#!/usr/bin/env bash
# End-to-end smoke test using curl against a locally running API (npm run dev).
# Usage: ADMIN_PASSWORD=... ./scripts/smoke.sh [base_url]
# Creates uniquely-named users/vacancy each run; leaves them in the database.
set -uo pipefail

BASE="${1:-http://localhost:3000}/api"
ADMIN_EMAIL="${ADMIN_EMAIL:-nysonagumya@gmail.com}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:?set ADMIN_PASSWORD (the SEED_PASSWORD used by npm run seed)}"
RUN="$(date +%s)"
PW='Smoke-Pass1'
JARS="$(mktemp -d)"
PASS=0; FAIL=0
trap 'rm -rf "$JARS"' EXIT

# call <jar> <METHOD> <path> [curl args...]  -> sets $CODE and $BODY
call() {
  local jar=$1 method=$2 path=$3; shift 3
  local out; out=$(curl -s -w '\n%{http_code}' -b "$JARS/$jar" -c "$JARS/$jar" -X "$method" "$BASE$path" "$@")
  CODE=${out##*$'\n'}; BODY=${out%$'\n'*}
}
json() { call "$1" "$2" "$3" -H 'Content-Type: application/json' -d "$4"; }
expect() { # <label> <expected_code>
  if [[ "$CODE" == "$2" ]]; then PASS=$((PASS+1)); echo "  ok   $1 ($CODE)"
  else FAIL=$((FAIL+1)); echo "  FAIL $1: expected $2, got $CODE -> $BODY"; fi
}
field() { echo "$BODY" | jq -r "$1"; }
check() { # <label> <expected> <actual>
  if [[ "$2" == "$3" ]]; then PASS=$((PASS+1)); echo "  ok   $1 ($3)"
  else FAIL=$((FAIL+1)); echo "  FAIL $1: expected '$2', got '$3'"; fi
}

login() { # <jar> <email> <password> -> sets CODE to 200 if a session user exists
  : > "$JARS/$1"
  local csrf; csrf=$(curl -s -c "$JARS/$1" -b "$JARS/$1" "$BASE/auth/csrf" | jq -r .csrfToken)
  curl -s -o /dev/null -b "$JARS/$1" -c "$JARS/$1" -X POST "$BASE/auth/callback/credentials" \
    -H 'X-Auth-Return-Redirect: 1' --data-urlencode "csrfToken=$csrf" \
    --data-urlencode "email=$2" --data-urlencode "password=$3"
  local s; s=$(curl -s -b "$JARS/$1" "$BASE/auth/session")
  if [[ "$(echo "$s" | jq -r '.user.email // empty')" == "$2" ]]; then CODE=200; else CODE=401; fi
}

echo "== health"; call anon GET /health; expect "health" 200

echo "== unauthenticated access is refused (BR-01)"
call anon GET /applications; expect "GET /applications without session" 401

echo "== admin creates staff (FR-12)"
login admin "$ADMIN_EMAIL" "$ADMIN_PASSWORD"; expect "admin login" 200
declare -A ID
for spec in "hr:HR_OFFICER" "p1:INTERVIEWER" "p2:INTERVIEWER" "mgr:MANAGER"; do
  k=${spec%%:*}; role=${spec##*:}
  json admin POST /users "{\"name\":\"Smoke $k\",\"email\":\"smoke-$k-$RUN@ers.test\",\"password\":\"$PW\",\"role\":\"$role\"}"
  expect "create $k ($role)" 201; ID[$k]=$(field .data.id)
done

echo "== candidate self-registers and signs in (FR-01/FR-03)"
json anon POST /accounts/register "{\"name\":\"Smoke Candidate\",\"email\":\"smoke-cand-$RUN@ers.test\",\"password\":\"$PW\"}"; expect "register candidate" 201
json anon POST /accounts/register "{\"name\":\"X\",\"email\":\"bad\",\"password\":\"x\"}"; expect "register validation" 422
login cand "smoke-cand-$RUN@ers.test" "$PW"; expect "candidate login" 200
login anon2 "smoke-cand-$RUN@ers.test" "wrong-password"; expect "bad password rejected" 401

for k in hr p1 p2 mgr; do login $k "smoke-$k-$RUN@ers.test" "$PW"; expect "login $k" 200; done

echo "== vacancy (FR-02)"
json cand POST /jobs '{"title":"Nope","department":"Finance","numPositions":1,"requiredSkills":"long enough skills","closingDate":"2030-01-01"}'; expect "candidate cannot create vacancy" 403
json hr POST /jobs '{"title":"Ab","department":"Finance","numPositions":1,"requiredSkills":"x","closingDate":"2030-01-01"}'; expect "vacancy validation" 422
json hr POST /jobs "{\"title\":\"Smoke Accountant $RUN\",\"department\":\"Finance\",\"numPositions\":1,\"requiredSkills\":\"Bookkeeping and reconciliation\",\"closingDate\":\"2030-01-01\"}"; expect "HR publishes vacancy" 201
JOB=$(field .data.id)
call cand GET /jobs; expect "candidate sees open vacancies" 200

echo "== application (FR-03)"
CV="$(cd "$(dirname "$0")" && pwd)/fixtures/sample-cv.pdf"
FORM=(-F "jobId=$JOB" -F "fullName=Smoke Candidate" -F "phone=+256700000000" -F "address=Plot 1 Kampala Road Kampala"
  -F 'qualifications=[{"qualification":"BSc","institution":"MUST","yearCompleted":2022}]'
  -F 'experience=[]' -F 'references=[{"refereeName":"Ref","organisation":"Org","contact":"ref@org.com"}]')
call cand POST /applications "${FORM[@]}"; expect "cannot submit without CV" 422
call cand POST /applications "${FORM[@]}" -F "cv=@$CV;type=application/pdf"; expect "submit with CV" 201
APP=$(field .data.id); check "state is SUBMITTED" SUBMITTED "$(field .data.state)"
call cand POST /applications "${FORM[@]}" -F "cv=@$CV;type=application/pdf"; expect "duplicate application" 409
call hr GET "/applications/$APP"; expect "HR can read it" 200

echo "== screening and shortlisting (FR-05, BR-03)"
json cand POST "/applications/$APP/transition" '{"to":"SHORTLISTED"}'; expect "candidate cannot shortlist" 403
json hr POST "/applications/$APP/transition" '{"to":"SELECTED"}'; expect "illegal move rejected" 409
json hr POST "/applications/$APP/transition" '{"to":"UNDER_SCREENING"}'; expect "start screening" 200
json hr POST "/applications/$APP/transition" '{"to":"SHORTLISTED"}'; expect "shortlist" 200

echo "== interview (FR-06)"
json hr POST "/applications/$APP/interview" "{\"date\":\"2030-02-01T10:00:00Z\",\"location\":\"Boardroom\",\"panel\":[\"${ID[mgr]}\"]}"; expect "non-panelist rejected" 422
json hr POST "/applications/$APP/interview" "{\"date\":\"2030-02-01T10:00:00Z\",\"location\":\"Boardroom\",\"panel\":[\"${ID[p1]}\",\"${ID[p2]}\"]}"; expect "schedule interview" 200
check "state" INTERVIEW_SCHEDULED "$(field .data.state)"
call p1 GET /applications; check "panelist sees assigned application" 1 "$(field '[.data[] | select(.id=="'$APP'")] | length')"
json p1 POST "/applications/$APP/evaluations" '{"technical":80,"communication":80,"problemSolving":80,"teamwork":80,"comments":"too early to evaluate"}'; expect "evaluation before interview completes" 409
json hr POST "/applications/$APP/interview/complete" '{}'; expect "mark interview completed" 200
check "state" UNDER_EVALUATION "$(field .data.state)"

echo "== evaluations (FR-07)"
json p1 POST "/applications/$APP/evaluations" '{"technical":150,"communication":80,"problemSolving":80,"teamwork":80,"comments":"scores out of range"}'; expect "score > 100 rejected" 422
json p1 POST "/applications/$APP/evaluations" '{"technical":85,"communication":80,"problemSolving":90,"teamwork":75,"comments":"Strong candidate overall."}'; expect "p1 evaluates" 200
json p1 POST "/applications/$APP/evaluations" '{"technical":85,"communication":80,"problemSolving":90,"teamwork":75,"comments":"Second attempt same panelist"}'; expect "duplicate evaluation" 409
json hr POST "/applications/$APP/evaluations" '{"technical":85,"communication":80,"problemSolving":90,"teamwork":75,"comments":"HR is not a panelist"}'; expect "HR cannot evaluate" 403
json p2 POST "/applications/$APP/evaluations" '{"technical":70,"communication":75,"problemSolving":72,"teamwork":80,"comments":"Good but less senior."}'; expect "p2 evaluates" 200
check "two attributed evaluations" 2 "$(field '.data.evaluations | length')"

echo "== selection + manager approval (FR-08, FR-09, BR-07)"
json hr POST "/applications/$APP/transition" '{"to":"SELECTED"}'; expect "select candidate" 200
check "auto-routed to manager" PENDING_APPROVAL "$(field .data.state)"
json hr POST "/applications/$APP/offer" '{"salary":3000000,"startDate":"2030-03-01","contract":"Permanent"}'; expect "offer blocked before approval" 409
json hr POST "/applications/$APP/approval" '{"decision":"APPROVED"}'; expect "HR cannot approve" 403
json mgr POST "/applications/$APP/approval" '{"decision":"REJECTED"}'; expect "reject needs a reason" 422
json mgr POST "/applications/$APP/approval" '{"decision":"APPROVED","note":"Good fit"}'; expect "manager approves" 200
check "approval attributed" "Smoke mgr" "$(field .data.approval.by)"

echo "== offer (FR-10, BR-06)"
json hr POST "/applications/$APP/offer" '{"salary":3000000,"startDate":"2030-03-01","contract":"Permanent"}'; expect "HR sends offer" 201
check "state" OFFER_SENT "$(field .data.state)"
json cand POST "/applications/$APP/offer/response" '{"response":"ACCEPTED"}'; expect "candidate accepts" 200
check "accept moves into ONBOARDING" ONBOARDING "$(field .data.state)"

echo "== onboarding gate (FR-11, BR-08)"
json hr POST "/applications/$APP/onboarding/complete" '{}'; expect "cannot complete with items outstanding" 409
for d in "National ID / passport" "Academic certificates" "Signed contract" "Bank & tax details"; do
  json hr POST "/applications/$APP/onboarding/documents" "{\"name\":\"$d\"}"; expect "verify: $d" 200
done
for c in HR IT Finance; do json hr POST "/applications/$APP/onboarding/confirmations" "{\"key\":\"$c\"}"; expect "confirm $c" 200; done
json hr POST "/applications/$APP/onboarding/complete" '{}'; expect "still blocked without Department" 409
json mgr POST "/applications/$APP/onboarding/confirmations" '{"key":"Department"}'; expect "manager confirms Department" 200
json mgr POST "/applications/$APP/onboarding/confirmations" '{"key":"IT"}'; expect "manager cannot confirm IT" 403
json hr POST "/applications/$APP/onboarding/complete" '{}'; expect "complete" 200
check "state" COMPLETED "$(field .data.state)"
check "history is retained" true "$(field '.data.history | length > 10')"

echo "== candidate view, notifications, reports (FR-04, FR-12)"
call cand GET /applications; check "candidate sees only own" 1 "$(field '.data | length')"
call cand GET /notifications/count; expect "notification count" 200
call p1 GET /reports/summary; expect "panelist cannot read reports" 403
call mgr GET "/reports/summary?department=Finance"; expect "manager reads report" 200
check "report counts hire" true "$(field '.data.totals.hired >= 1')"

echo "== deactivated account cannot sign in (FR-12)"
json admin PATCH "/users/${ID[p2]}" '{"status":"DEACTIVATED"}'; expect "deactivate p2" 200
call p2 GET /applications; expect "existing session of deactivated user is refused" 401
login p2b "smoke-p2-$RUN@ers.test" "$PW"; expect "deactivated login refused" 401
json admin PATCH "/users/$(call admin GET /accounts/me; field .data.id)" '{"status":"DEACTIVATED"}'; expect "admin cannot deactivate self" 400

echo; echo "passed: $PASS  failed: $FAIL"; [[ $FAIL -eq 0 ]]
