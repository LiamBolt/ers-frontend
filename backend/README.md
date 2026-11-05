# ERS Backend API

REST/JSON API for the Employee Recruitment System. It models recruitment as one
long-duration transaction per application (SRS v1) and enforces who may move it
from state to state.

**Stack:** Node.js 22, TypeScript, Express 5, Prisma 6 + PostgreSQL (Neon),
Auth.js (NextAuth) credentials + JWT session cookie, Cloudinary (CV uploads),
Zod validation. Structure and tooling follow `Nysonn/hostel-booking-api`.

## Run it (local Node, no Docker)

```bash
cd backend
npm install
cp .env.example .env      # fill in the values (see below)
npx prisma migrate deploy # create tables
npm run seed              # one bootstrap ADMIN account, no demo data
npm run seed:jobs         # the agency's vacancies (idempotent; edit src/database/seeds/jobs.data.ts)
npm run dev               # http://localhost:3000, health: /api/health
```

Test the whole lifecycle with curl (leaves test users behind; clean up after):

```bash
ADMIN_PASSWORD='<SEED_PASSWORD>' ./scripts/smoke.sh    # or: make smoke
npx tsx scripts/cleanup-test-data.ts                   # removes smoke-*/uitest-* users and their data
```

Docker (last step, ask the human first): `make dev` (hot reload),
`make migrate`, `make seed`. Production image: Dockerfile target `production`.

## Environment

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon **pooled** connection string (runtime) |
| `DIRECT_URL` | Neon **direct** connection string (same host without `-pooler`), used by `prisma migrate` |
| `AUTH_SECRET` | Signs the session JWT. `openssl rand -base64 32` |
| `CLOUDINARY_URL` | `cloudinary://<key>:<secret>@<cloud>` |
| `CORS_ORIGINS` | Comma-separated browser origins |
| `PORT`, `NODE_ENV` | Server |
| `SEED_PASSWORD` | Password for the bootstrap admin created by `npm run seed` |

Never commit `.env`. Drop `channel_binding=require` from Neon URLs; Prisma ignores it.

## Layout

See also `../docs/ARCHITECTURE.md` for the whole repository.

```
src/
  server.ts               starts listening (entry point)
  app.ts                  builds the Express app; Auth.js mounted at /api/auth
  config/                 env, cloudinary, upload (CV file rules)
  database/               Prisma client; seeds/ (admin.seed.ts, jobs.seed.ts, jobs.data.ts)
  auth/                   auth.config.ts (Auth.js), auth.middleware.ts (requireAuth, requireRole)
  common/                 http.ts (HttpError, send), audit.ts, notify.ts,
                          middlewares/ (validate, error-handler), types/
  routes/index.ts         mounts every module under /api
  modules/
    accounts/ users/ jobs/ notifications/ reports/
    recruitment/          the application lifecycle
      workflow/             state machine: rules table, engine, constants
      applications/         list/read/submit + serializer (the JSON contract)
      interviews/ evaluations/ approvals/ offers/ onboarding/
prisma/schema.prisma      SRS section 4.2 entities
scripts/                  smoke.sh, cleanup-test-data.ts
```

Flow of a request: **routes** (auth + role gate + validation) -> **controller**
(HTTP only) -> **service** (business rules, transactions) -> **repository /
Prisma**. Controllers never touch Prisma; services never touch `req`/`res`.

## The rules that matter

- **One door for state changes:** `workflow/workflow.engine.ts#moveState`. It
  checks `workflow.rules.ts` (role per `FROM>TO`), writes the new state, appends
  an `ApplicationHistory` row and an `AuditLog` row, inside the caller's
  transaction. Never update `Application.state` anywhere else.
- To add a stage or change who may act, edit **only** `workflow.rules.ts` (and
  the stage module). Auth and reports stay untouched (NFR-08).
- History and audit rows are insert-only. There is no update/delete path.
- Role and status are read from the DB on every request (`requireAuth`), not
  trusted from the token, so deactivating a user takes effect immediately.
- Every authorisation failure is written to the audit log (NFR-04).
- Mutating endpoints answer with the refreshed application (see
  `application.serializer.ts`); the frontend writes it straight into its cache.

## API (all under `/api`)

Auth.js: `GET /auth/csrf`, `POST /auth/callback/credentials`,
`GET /auth/session`, `POST /auth/signout`. Sign-in needs the CSRF token from
`/auth/csrf`, a form-encoded body and header `X-Auth-Return-Redirect: 1`.

| Method + path | Who |
|---|---|
| `POST /accounts/register` | public (candidates only) |
| `GET /accounts/me` | any signed-in user |
| `GET /accounts/panelists` | HR, Admin |
| `GET/POST /users`, `PATCH /users/:id` | Admin |
| `GET /jobs/public`, `GET /jobs/public/:id` | public (open vacancies for the landing page and job pages; no internal fields; 404 once closed) |
| `GET /jobs`, `GET /jobs/:id` | any (candidates see open vacancies only) |
| `POST /jobs`, `PATCH /jobs/:id` | HR, Admin |
| `GET /applications`, `GET /applications/:id` | any, scoped by role |
| `POST /applications` (multipart, field `cv`) | Candidate |
| `POST /applications/:id/transition` `{to,note}` | HR, Panel (screen, shortlist, reject, select) |
| `POST /applications/:id/interview` / `.../interview/complete` | HR |
| `POST /applications/:id/evaluations` | Panel (assigned only) |
| `POST /applications/:id/approval` `{decision,note}` | Manager |
| `POST /applications/:id/offer` / `.../offer/response` | HR / HR or the Candidate |
| `POST /applications/:id/onboarding/{documents,confirmations,complete}` | HR, Admin (Manager: Department confirmation) |
| `GET /notifications`, `/notifications/count`, `POST /notifications/mark-all-read` | any |
| `GET /reports/summary?from&to&department&jobId` | Manager, Admin |

Responses: `{ success, message, data }`. Errors: `{ success:false, message }`,
with `errors` (field map) on 422.

## Production notes

- Session cookies are same-origin. The frontend calls the relative `/api`; in
  production add a Vercel rewrite `/api/(.*)` -> the Render API URL **before**
  the SPA catch-all rewrite in `vercel.json`.
- Neon is far from some users; Prisma `relationJoins` is enabled so each
  application load is one query. Keep it that way for new includes
  (`relationLoadStrategy: "join"`).
