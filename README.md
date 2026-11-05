<p align="center">
  <img src="public/logo.svg" alt="ERS logo" width="200">
</p>

<h1 align="center">Employee Recruitment System (ERS)</h1>

<p align="center">
  A client-server system that models hiring as one long-running, auditable transaction,
  from vacancy creation to employee onboarding.
</p>

<p align="center">
  Live app: <a href="https://ers-frontend-sooty.vercel.app">ers-frontend-sooty.vercel.app</a>
  &nbsp;|&nbsp;
  API: <a href="https://ers-api-s16j.onrender.com/api/health">ers-api-s16j.onrender.com</a>
</p>

---

## Table of contents

1. [What ERS is](#what-ers-is)
2. [How recruitment is modelled](#how-recruitment-is-modelled)
3. [Roles and what each can do](#roles-and-what-each-can-do)
4. [Architecture and tech stack](#architecture-and-tech-stack)
5. [Repository layout](#repository-layout)
6. [Getting started](#getting-started)
7. [Configuration reference](#configuration-reference)
8. [Testing](#testing)
9. [Docker](#docker)
10. [Deployment](#deployment)
11. [Code conventions](#code-conventions)
12. [Contributing (humans)](#contributing-humans)
13. [Contributing (AI agents)](#contributing-ai-agents)
14. [Security notes](#security-notes)
15. [Troubleshooting](#troubleshooting)
16. [Further reading](#further-reading)

---

## What ERS is

Hiring someone is not one action. It is a chain of activities carried out by
different people, sometimes weeks apart: advertise a vacancy, receive
applications, screen, interview, evaluate, approve, make an offer, and onboard.
A conventional create/read/update/delete application has no natural way to hold
a process that stays open that long and has to remember exactly where it left
off.

ERS treats each application as a single persisted record that moves through a
defined sequence of states. The system's job is to keep that state reliably
across sessions, days and weeks, to make it visible to whichever authorised
person must act next, and to keep an immutable history of who did what and when.

ERS was specified as a group project for SWE4107 (Client Server Programming for
Applications) at Mbarara University of Science and Technology. The full
requirements are in [`docs/Employee_Recruitment_System_SRS_v1.pdf`](docs/Employee_Recruitment_System_SRS_v1.pdf).

Out of scope: payroll, ongoing employee management after onboarding is complete,
training content, and the internals of any third-party background-check service.

## How recruitment is modelled

One application is one long-duration transaction. Its `state` is the single
source of truth for where it stands.

```
SUBMITTED -> UNDER_SCREENING -> SHORTLISTED -> INTERVIEW_SCHEDULED
          -> UNDER_EVALUATION -> SELECTED -> PENDING_APPROVAL
          -> OFFER_SENT -> OFFER_ACCEPTED -> ONBOARDING -> COMPLETED

Closed branches (kept, never deleted):  REJECTED, DECLINED
```

Business rules that the code enforces (from the SRS):

| Rule | Meaning |
|---|---|
| BR-01 | Only authenticated users reach the system, restricted by role. |
| BR-02 | State is persisted on every change, so nothing is lost between sessions. |
| BR-03 | Only the role authorised for a stage may advance an application past it. |
| BR-04 | Every transition is recorded with actor and timestamp; history is never overwritten. |
| BR-05 | Rejection or decline closes the path but keeps the record and its history. |
| BR-06 | An offer stays open until the candidate answers; it never silently expires. |
| BR-07 | Every manager approval or rejection is logged with identity, decision and time. |
| BR-08 | An application cannot be COMPLETED until all onboarding documents are verified and the HR, IT, Finance and Department confirmations are recorded. |

## Roles and what each can do

| Role | Code value | Main actions |
|---|---|---|
| Candidate | `CANDIDATE` | Register, apply with CV, track status and history, accept or decline an offer |
| HR Officer | `HR_OFFICER` | Publish vacancies, screen and shortlist, schedule interviews, select, send offers, run onboarding |
| Interview Panel | `INTERVIEWER` | See assigned interviews, submit scored evaluations |
| Department Manager | `MANAGER` | Approve or reject selected candidates, confirm the Department onboarding step, view reports |
| System Administrator | `ADMIN` | Manage users and roles, monitor all applications, view reports |

Each role sees only the screens and actions relevant to it. The server enforces
this independently of what the interface shows.

## Architecture and tech stack

```
Browser (React SPA, Vercel)
   |  same-origin /api  (Vercel rewrite in production, Vite proxy in dev)
   v
Express API (Node.js, Render)  --->  PostgreSQL (Neon)
   |
   +--->  Cloudinary (CV uploads)
```

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 4, React Router 7, Tailwind CSS 3, TanStack Query 5, react-hook-form, Zod, lucide-react |
| Backend | Node.js 22, TypeScript, Express 5, Zod |
| Auth | Auth.js (NextAuth) credentials provider, bcrypt, JWT session in an httpOnly cookie |
| Database | PostgreSQL on Neon, accessed through Prisma 6 |
| Files | Cloudinary |
| Hosting | Vercel (frontend), Render (API, Docker) |

The browser only ever talks to a relative `/api` path. That keeps the session
cookie same-origin, which avoids CORS and third-party-cookie problems.

## Repository layout

The full map, with a "where do I find..." table and how to add things, is in
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md). In short, code is organised by
feature, not by file type:

```
.
|-- README.md  AGENTS.md      overview and rules for contributors
|-- docs/                     ARCHITECTURE.md (code map), the SRS, brand assets
|-- public/                   logo and favicon (SVG, generated), hero photos
|-- scripts/                  repo-level scripts (build-logo.mjs)
|-- vercel.json               /api rewrite to the Render API, then SPA fallback
|-- src/                      React frontend
|   |-- app/                    router, app shell (sidebar, layout), 404, error boundary
|   |-- shared/                 ui primitives, api client, constants, theme, logo
|   |-- features/               one folder per area:
|   |     auth  landing  dashboard  vacancies  applications  interviews
|   |     offers  reports  users  settings  notifications
|   `-- styles/                 design tokens and dark theme
`-- backend/                  Node.js API (see backend/README.md)
    |-- prisma/                 schema and migrations
    |-- scripts/                smoke test and test-data cleanup
    `-- src/
        |-- server.ts  app.ts    start the server / build the Express app
        |-- config/  database/  auth/  common/  routes/
        `-- modules/             accounts users jobs notifications reports
                                 recruitment/ (workflow applications interviews
                                 evaluations approvals offers onboarding)
```

Each backend module follows `routes -> controller -> service (-> repository)`
with a Zod `schema`; each frontend feature uses `pages/`, `components/`, `lib/`,
`api.js` and `hooks.js`.

## Getting started

### Prerequisites

- Node.js 22 or newer and npm
- A PostgreSQL database. A free [Neon](https://neon.tech) project works well.
- A [Cloudinary](https://cloudinary.com) account for CV uploads
- Docker (optional, only for running the containerised API)

### 1. Clone and install

```bash
git clone https://github.com/LiamBolt/ers-frontend.git
cd ers-frontend
npm install                 # frontend dependencies
cd backend && npm install   # backend dependencies
```

### 2. Configure the backend

```bash
cd backend
cp .env.example .env
```

Fill in `backend/.env` using the [configuration reference](#configuration-reference).
Generate the auth secret with `openssl rand -base64 32`.

### 3. Create the database tables and the first admin

```bash
cd backend
npx prisma migrate deploy   # applies the migrations in prisma/migrations
npm run seed                # creates ONE admin account (no demo data)
npm run seed:jobs           # publishes the agency's vacancies for the landing page (review the list first)
```

The seed creates a single administrator, `nysonagumya@gmail.com` by default.
Override with `ADMIN_EMAIL` and `ADMIN_NAME`; the password is `SEED_PASSWORD`.
Change the password after the first sign-in.

### 4. Run both servers

In two terminals:

```bash
# terminal 1: API on http://localhost:3000
cd backend && npm run dev

# terminal 2: frontend on http://localhost:5173 (proxies /api to the API)
npm run dev
```

Open http://localhost:5173 and sign in as the admin. The admin creates staff
accounts (HR, panel members, managers) on the Users screen (`/users`), where
roles can also be changed and accounts deactivated or reactivated. Candidates
register themselves at `/register`.

Typical first run as an administrator:

1. Open Users and create an HR officer, at least one interview panel member and a manager.
2. Sign in as HR and publish a vacancy.
3. Open the landing page signed out, click Apply on a vacancy, register, and submit an application.
4. Walk it through screening, interview, evaluation, approval, offer and onboarding.

## Configuration reference

Backend variables (`backend/.env`, never committed):

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | yes | Pooled PostgreSQL connection string used at runtime |
| `DIRECT_URL` | yes | Direct (non-pooled) connection string used by `prisma migrate`. For Neon this is the same host without `-pooler`. |
| `AUTH_SECRET` | yes | Signs session tokens. Use a long random value. |
| `CLOUDINARY_URL` | yes | `cloudinary://<api_key>:<api_secret>@<cloud_name>` |
| `CORS_ORIGINS` | yes | Comma-separated browser origins allowed to call the API |
| `PORT` | no | Defaults to 3000 (Render supplies its own) |
| `NODE_ENV` | no | `development` or `production` |
| `SEED_PASSWORD` | seed only | Password for the bootstrap admin |

Frontend variables (optional):

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Overrides the API base. Leave unset so the app uses the same-origin `/api`. |
| `VITE_API_PROXY` | Dev only. Where Vite proxies `/api` (default `http://localhost:3000`). |

Remove `channel_binding=require` from Neon connection strings. Prisma does not use it.

## Testing

There is no unit-test suite yet. Correctness is checked by:

- **Frontend build:** `npm run build`
- **Backend type check:** `cd backend && npx tsc --noEmit`
- **End-to-end API smoke test:** a `curl` script that drives the entire lifecycle
  and the negative cases (wrong role, illegal transition, missing CV, the
  onboarding gate, deactivated accounts).

```bash
cd backend
npm run dev                                   # keep the API running
ADMIN_PASSWORD='<your SEED_PASSWORD>' ./scripts/smoke.sh
npx tsx scripts/cleanup-test-data.ts          # remove the users and data it created
```

The smoke script creates uniquely named `smoke-*@ers.test` users and a vacancy
on every run and leaves them in the database. Always run the cleanup script
afterwards so no test data stays in a shared database. It never touches other
accounts.

Run the smoke test on Node first. Run it against Docker only after it passes.

## Docker

The API ships a multi-stage `backend/Dockerfile` (migrate, dev, builder,
production) and a `docker-compose.yml` for hot-reload development.

```bash
cd backend
make dev          # docker-compose up --build  (hot reload, source mounted)
make migrate      # apply migrations in a one-off container
make seed         # create the bootstrap admin in the running container
```

If your machine has Docker Compose v2 without the `docker-compose` command, use
`docker compose up --build` instead of `make dev`. The final Dockerfile stage
(`production`) is what Render builds: it installs production dependencies only
and runs as the non-root `node` user.

Docker uses a lot of memory. Develop and test on Node, and bring Docker in at
the end.

## Deployment

| Part | Host | Notes |
|---|---|---|
| Frontend | Vercel | `vercel.json` rewrites `/api/(.*)` to the Render API, then everything else to `/index.html`. Keep that order. |
| API | Render (Docker) | Build context `backend`, Dockerfile `backend/Dockerfile`. Set the backend environment variables in the Render dashboard. |
| Database | Neon | Run `prisma migrate deploy` against it when the schema changes. |

Notes:

- The Render free plan sleeps when idle, so the first request after a quiet
  period can take around 30 seconds.
- After pushing a schema change, apply the migration to the production database
  before or together with deploying the API.
- If the API URL changes, update the `/api` destination in `vercel.json`.
- Add every browser origin that should call the API to `CORS_ORIGINS`.

## Code conventions

### Frontend (`src/`)

- Plain JavaScript with function components; one default export per file named
  after the file.
- Components never call `fetch`. Data flows: component -> hook in the feature's
  `hooks.js` -> function in its `api.js` -> `src/shared/api/client.js`.
- Server state lives in TanStack Query. After a mutation, write the returned
  application into the cache and invalidate dependent lists.
- Forms use react-hook-form with a Zod schema. Show the server's message from
  `ApiError`, never a generic failure text.
- Styling uses the `ers-*` colour tokens (RGB channels in `src/styles/index.css`,
  exposed in `tailwind.config.js`). Do not hard-code colours. Text must meet
  4.5:1 contrast and input borders 3:1. Use the primitives in
  `src/shared/ui/` (Button, Input, Table, Modal, Skeleton, EmptyState, and so
  on) instead of raw elements. The full design-system rules are in `AGENTS.md`
  under "Design system".
- Keep components small. When a component grows several independent sections,
  split it (see `src/features/applications/components/application-form/`).
- Icons come from `lucide-react` only; the pinned version is old, so check an
  icon exists before importing it.
- Access rules live in `src/App.jsx` through `<ProtectedRoute allowedRoles>`.
  The server decides; the client only hides what would be refused.

### Backend (`backend/src/`)

- TypeScript, strict mode. Controllers handle HTTP only and never touch Prisma.
  Services hold business rules and transactions and never touch `req` or `res`.
- Validate every input with Zod in the module's `*.schema.ts`.
- The recruitment state changes in exactly one place:
  `modules/recruitment/workflow/workflow.engine.ts` (`moveState`). The legal moves and the
  role allowed for each live in `modules/recruitment/workflow/workflow.rules.ts`. Never
  update `Application.state` anywhere else. To add a stage or change who may act,
  edit the rules file and the relevant stage module.
- History and audit rows are insert-only. Do not add update or delete paths.
- Role and account status are read from the database on every request, so
  deactivating a user takes effect immediately.
- Every authorisation failure is written to the audit log.
- Mutating endpoints answer with the refreshed application, shaped by
  `application.serializer.ts`. Treat that shape as the API contract with the
  frontend.
- Use `relationLoadStrategy: "join"` for Prisma includes. The database can be far
  from the server, and one query per relation is slow.
- Responses are `{ success, message, data }`. Errors are
  `{ success: false, message }`, with a field map under `errors` for 422.

### No dummy data

There is no seed data, mock array or fake user anywhere in the project. The seed
creates one administrator only. If you create test data while developing, remove
it before you finish.

## Contributing (humans)

1. **Find or open an issue** describing the change. For anything touching the
   recruitment workflow, check the SRS first and say which requirement (FR, NFR
   or BR id) it serves.
2. **Branch** from `main`: `feature/<short-name>` or `fix/<short-name>`.
3. **Set up** as in [Getting started](#getting-started). Use your own Neon
   database and Cloudinary account for development so you never touch shared data.
4. **Make the change** following the [conventions](#code-conventions). Keep
   commits focused.
5. **Verify** before opening a pull request:
   - `npm run build` passes
   - `cd backend && npx tsc --noEmit` passes
   - `./scripts/smoke.sh` passes against a locally running API, then
     `npx tsx scripts/cleanup-test-data.ts`
   - You exercised the changed screens in a browser
6. **Update the docs** when behaviour changes: this README, `backend/README.md`
   (endpoints, environment variables) and `AGENTS.md` (rules for agents).
7. **Commit messages** use conventional commits (`feat:`, `fix:`, `docs:`,
   `chore:`, `refactor:`) with a short body that explains why.
8. **Open a pull request** against `main` that describes the change, links the
   issue and notes how you tested it.

Do not commit `.env` files, credentials, `dist/` or `node_modules/`. Only
`.env.example` is tracked.

## Contributing (AI agents)

Read [`AGENTS.md`](AGENTS.md) first; it is the authoritative instruction file for
agents and is kept in step with this README. The essentials:

- **Orient quickly.** `graphify-out/` (if present) holds a knowledge graph of the
  repository; query it before grepping. The state machine is in
  `backend/src/modules/recruitment/workflow/`, the API contract is
  `backend/src/modules/recruitment/applications/application.serializer.ts`, and the
  frontend data path is a feature's `api.js` -> `hooks.js` -> components.
  Start with `docs/ARCHITECTURE.md` to find anything.
- **Never commit, push or deploy without the human's explicit approval.** Approval
  for one commit or deploy does not carry over to the next.
- **Never add yourself or any AI as an author or co-author.** No
  `Co-Authored-By` trailer and no "generated with" line in commits or pull
  requests.
- **Do not use MCP tools** (Render, Neon, Vercel, and so on) unless the human asked
  you to. Use the `agent-browser` CLI for browser checks, not browser-extension
  tools.
- **Develop on Node, not Docker.** Test with `curl` and the smoke script. Start
  Docker only at the end, and ask first, because the machine is shared.
- **Stage files explicitly** (`git add <paths>`). Other people or agents may have
  unrelated changes in the working tree.
- **Do not invent data.** No dummy users, fake records or placeholder content.
  Clean up any test data you create.
- **Verify, do not assume.** Run the build, the type check and the smoke test, and
  report failures as they are. Say plainly what you did not test.
- **Keep secrets out of output and commits.** Read `backend/.env` only when
  required, and never echo credentials into docs, logs or messages.
- **Regenerate the graph** with `graphify update .` after code changes if the
  graphify setup is installed.

When you add an endpoint, an environment variable or a convention, update
`backend/README.md` and `AGENTS.md` in the same change so the next contributor,
human or agent, starts from accurate information.

## Security notes

- Passwords are hashed with bcrypt and never stored or logged in plain text.
- Sessions are httpOnly cookies signed with `AUTH_SECRET`. The secure cookie
  variants are used in production.
- Authorisation is enforced on the server for every request and is independent of
  the interface. Refusals are written to the audit log.
- Deactivated accounts cannot sign in, and existing sessions stop working
  immediately.
- Never share a real `.env`. Rotate any secret that has been pasted into chat,
  an issue or a log, and change the seeded administrator's password after the
  first sign-in.
- Report suspected vulnerabilities privately to the maintainers instead of
  opening a public issue.

## Troubleshooting

| Symptom | Likely cause and fix |
|---|---|
| `prisma: not found` or missing client types | Run `npm install` in `backend`, then `npx prisma generate`. |
| API errors about an unknown Prisma argument after changing the schema | The dev server has the old client loaded. Run `npx prisma generate` and restart the API. |
| Every authenticated call returns 401 in the browser | Use the Vite dev server so `/api` is proxied. Calling the API on a different origin breaks the session cookie. |
| Sign-in appears to succeed but you are sent back to the login page | The session cookie was not stored. Check `AUTH_SECRET` is set and you are using the same origin for the app and `/api`. |
| Application list is slow | The database is far from the API. Keep `relationLoadStrategy: "join"` on includes, and pick a Render region near Neon. |
| First request to the live API takes about 30 seconds | The free Render plan was asleep. This is expected. |
| CV upload fails with "Invalid PDF file" | Cloudinary rejects malformed PDFs. Upload a real PDF, DOC or DOCX under 5 MB. |
| `docker-compose: command not found` | Use `docker compose` (Compose v2), for example `docker compose up --build`. |
| Smoke test cannot sign in | `ADMIN_PASSWORD` must equal the `SEED_PASSWORD` used when the admin was seeded. |

## Further reading

- [`backend/README.md`](backend/README.md): endpoint table, module layout, the rules
  the workflow engine enforces, production notes
- [`AGENTS.md`](AGENTS.md): working rules for agents and humans
- [`docs/Employee_Recruitment_System_SRS_v1.pdf`](docs/Employee_Recruitment_System_SRS_v1.pdf):
  requirements, business rules, state model and database design
