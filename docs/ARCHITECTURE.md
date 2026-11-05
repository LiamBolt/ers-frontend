# ERS code map: where to find things

This is the index of the repository. Start here if you are looking for something.
Rule of thumb: **code is organised by feature (what it is for), not by file type.**
Everything about "applications" lives under `applications`, everything about
"users" under `users`, and so on.

```
.
|-- src/            React frontend
|-- backend/        Node.js API
|-- docs/           SRS, this guide, brand assets
|-- public/         static files served as-is (logo SVGs, hero photos)
|-- scripts/        repo-level scripts (build-logo.mjs)
`-- README.md  AGENTS.md
```

## "I want to..." quick finder

| I want to... | Look in |
|---|---|
| Change a screen's layout or text | `src/features/<feature>/pages/` and `.../components/` |
| Change the sidebar or top bar | `src/app/layout/` (`navigation.js` is the menu) |
| Add or change a route / who may open it | `src/app/App.jsx` |
| Change colours, spacing, dark mode | `src/styles/index.css` (tokens) and `tailwind.config.js` |
| Change a button, input, table, modal | `src/shared/ui/` |
| Change the logo | `src/shared/brand/logoSvg.js`, then `node scripts/build-logo.mjs` |
| Add a label, role or state name | `src/shared/constants/` |
| Call the API from a screen | `src/features/<feature>/api.js` + `hooks.js` |
| Change how errors look | `src/shared/api/client.js` (messages) and `src/shared/ui/ErrorState.jsx` |
| Change a recruitment rule (who can move a stage) | `backend/src/modules/recruitment/workflow/workflow.rules.ts` |
| Add an API endpoint | `backend/src/modules/<module>/` (see below) |
| Change the database | `backend/prisma/schema.prisma`, then `npx prisma migrate dev` |
| Change what the careers page lists | `backend/src/database/seeds/jobs.data.ts`, then `npm run seed:jobs` |
| Deploy or run in Docker | `backend/Dockerfile`, `backend/Makefile`, `README.md` |

## Frontend (`src/`)

```
src/
|-- main.jsx            entry: providers (React Query, theme, error boundary)
|-- styles/             index.css  (design tokens, dark theme, base styles)
|-- app/                the application shell
|   |-- App.jsx           router + every route and its role gate
|   |-- ErrorBoundary.jsx catches render crashes
|   |-- NotFoundPage.jsx  the 404 page
|   `-- layout/           AppLayout, Sidebar, MobileNav, navigation menu
|-- shared/             used by many features; never imports from features/
|   |-- api/              client.js (fetch + typed errors), queryKeys.js
|   |-- ui/               Button, Input, Select, Table, Modal, Skeleton, ...
|   |-- layout/           StatusPage (404 / error pages)
|   |-- brand/            Logo component + logo geometry
|   |-- constants/        states, roles, departments, onboarding, scoring
|   |-- lib/              format.js, csv.js
|   `-- theme/            ThemeContext (light / dark)
`-- features/           one folder per area of the product
    |-- auth/             sign in, register, session, route guards
    |-- landing/          public home page, job page, header, footer
    |-- dashboard/        role dashboards (candidate, HR, panel, manager, admin)
    |-- vacancies/        create a vacancy, vacancy API + hooks
    |-- applications/     candidate application form, Candidates page,
    |                     the application panel with all stage actions
    |-- interviews/       Interviews page, schedule + evaluation forms
    |-- offers/           offer form
    |-- reports/          Reports page and widgets
    |-- users/            admin user management
    |-- settings/         Settings page (theme, account)
    `-- notifications/    notification API and hooks
```

Inside a feature, the same names are used everywhere:

| File or folder | Holds |
|---|---|
| `pages/` | One component per route. Thin: it composes components. |
| `components/` | Pieces of that feature's screens |
| `lib/` | Plain functions with no React (grouping, formatting rules) |
| `api.js` | The HTTP calls for that feature (only place `fetch` is reached) |
| `hooks.js` | TanStack Query hooks over `api.js` |
| `use*.js` | Behaviour hooks (form logic, mutations) |

Dependency direction (keep it one-way): `app` -> `features` -> `shared`.
A feature may import another feature's public pieces (for example the
application panel is reused by dashboards), but `shared` never imports a feature.

Imports use the `@/` alias for anything outside the current folder
(`@/shared/ui/Button`), and `./` for siblings.

## Backend (`backend/`)

```
backend/
|-- prisma/             schema.prisma and migrations (SRS section 4.2 entities)
|-- scripts/            smoke.sh (curl end-to-end test), cleanup-test-data.ts
|-- Dockerfile  docker-compose.yml  Makefile  .env.example
`-- src/
    |-- server.ts         starts the HTTP server
    |-- app.ts            builds the Express app (security, Auth.js, routes, errors)
    |-- config/           env, cloudinary, file upload rules
    |-- database/         Prisma client; seeds/ (admin, jobs + their data)
    |-- auth/             Auth.js config, requireAuth / requireRole
    |-- common/           shared helpers: http errors, audit log, notifications,
    |                     middlewares (validation, error handler), express types
    |-- routes/           index.ts mounts every module under /api
    `-- modules/
        |-- accounts/  users/  jobs/  notifications/  reports/
        `-- recruitment/      the application lifecycle
            |-- workflow/       THE state machine (rules + engine)
            |-- applications/   list, read, submit, serializer (API contract)
            |-- interviews/  evaluations/  approvals/  offers/  onboarding/
```

Each module has the same files:

| File | Responsibility |
|---|---|
| `<name>.routes.ts` | URL paths, auth + role gates, validation |
| `<name>.controller.ts` | HTTP only: read the request, send the response |
| `<name>.service.ts` | Business rules and transactions |
| `<name>.repository.ts` | Database queries (only where they are non-trivial) |
| `<name>.schema.ts` | Zod validation for inputs |

Controllers never touch Prisma; services never touch `req` or `res`.

## How to add things

**A new page in the frontend**
1. Create `src/features/<feature>/pages/<Name>Page.jsx` (wrap in `AppLayout`).
2. Add its components under `.../components/`, its API calls in `api.js`, hooks in `hooks.js`.
3. Register the route in `src/app/App.jsx` with the right `allowedRoles`.
4. If it belongs in the sidebar, add it to `src/app/layout/navigation.js`.

**A new endpoint in the backend**
1. Add or extend a module under `backend/src/modules/` (routes, controller, service, schema).
2. Mount it in `backend/src/routes/index.ts` if it is a new module.
3. Update the endpoint table in `backend/README.md`.
4. Add checks to `backend/scripts/smoke.sh` and run it.

**A new recruitment stage or rule**
Edit `workflow.rules.ts` (and `workflow.constants.ts`), add the stage module under
`modules/recruitment/`, then mirror labels in `src/shared/constants/states.js`.

## Conventions

- Keep files small and single-purpose. If a file passes roughly 120 lines or has
  several unrelated parts, split it (see `application-form/` for an example).
- Names say what a thing is: `CandidatesTable`, `useVacancyForm`, `nextAction`.
- No dummy data anywhere. The seeds create the admin and the agency's real vacancies.
- After moving or adding folders, update this file.
