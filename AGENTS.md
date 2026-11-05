# ERS Frontend — guide for agents and developers

This is the one instruction file for everyone working in this repo: Claude,
Codex, Cursor and humans. There is no `CLAUDE.md`; add new guidance here.

ERS is the Employee Recruitment System: candidates apply for vacancies, HR
creates them, interviewers and managers review. This repo holds the React
frontend (repo root) and the Node.js API in `backend/` (read
`backend/README.md` before touching it). The SRS is in `docs/`.

## Stack

- React 18 + Vite 4, plain JavaScript (`.jsx`, no TypeScript)
- React Router 7 (`react-router-dom`), `BrowserRouter`
- Tailwind CSS 3 with CSS-variable colour tokens (`ers-*`, see below)
- `react-hook-form` + `zod` (via `@hookform/resolvers`) for forms
- `lucide-react` for icons, Geist (variable, self-hosted via Fontsource) for type
- TanStack Query v5 for all server state (no other client-side data store)
- Deployed on Vercel; `vercel.json` rewrites every path to `/index.html` so
  client-side routes survive a refresh. Keep that rewrite. Production also
  needs an `/api/(.*)` rewrite to the Render API listed *before* it.

## Running

```bash
npm install
npm run dev       # Vite dev server; /api is proxied to http://localhost:3000
npm run build     # production build to dist/
npm run preview   # serve the built bundle
cd backend && npm run dev   # the API (needs backend/.env, see backend/README.md)
```

There is no test runner and no `lint` script. `eslint.config.js` exists but
`eslint` and its plugins are not in `package.json`; install them before
relying on it. Verify changes with `npm run build` and by loading the page.

## Layout

**Read `docs/ARCHITECTURE.md` first**: it is the code map (where everything lives,
a quick finder, and how to add pages, endpoints and stages).

```
src/
  main.jsx            entry: providers
  styles/index.css    design tokens, dark theme
  app/                router (App.jsx), layout/ (shell + sidebar), 404, error boundary
  shared/             api/ (client, query keys), ui/ (primitives), layout/ (status pages),
                      brand/ (logo), constants/, lib/, theme/
  features/<name>/    auth landing dashboard vacancies applications interviews offers
                      reports users settings notifications; each has pages/,
                      components/, lib/, api.js, hooks.js
```

Rules: components never call `fetch`; they use a feature's `hooks.js`, which use
its `api.js`. Dependencies point one way: `app` -> `features` -> `shared`
(`shared` never imports a feature). Use the `@/` alias for imports outside the
current folder and `./` for siblings. Keep files small: split a file that passes
about 120 lines or mixes unrelated parts (see `application-form/`).

## Auth and roles

Sign-in is Auth.js (NextAuth) on the backend: credentials + bcrypt, session in
an httpOnly cookie. `AuthContext` reads the user from `GET /api/accounts/me`;
nothing is stored in `localStorage`. Candidates self-register at `/register`;
staff accounts are created by an administrator (`POST /api/users`). The role is
re-checked on the server for every request, so the route table below only
hides what the API would refuse.

**There is no dummy data anywhere.** Do not add seed records, fake users or
mock arrays to the frontend or the backend seed (`npm run seed` creates one
admin). The one exception is `npm run seed:jobs`, which publishes the agency's
real vacancies for the landing page; its list (`backend/src/database/seeds/jobs.data.ts`)
must be approved by the human before it is run against the live database, and
it is idempotent. Test data made while developing must be removed afterwards
(`backend/scripts/cleanup-test-data.ts`).

Roles: `CANDIDATE`, `HR_OFFICER`, `INTERVIEWER`, `MANAGER`, `ADMIN`.

| Route | Roles |
|---|---|
| `/` | visitors: the public landing page with open positions; signed-in users: their role-specific dashboard |
| `/jobs/:id` | public: one vacancy with full details and an Apply panel |
| `/login`, `/register` | public (a signed-in user is redirected to their home, keeping `?job=`) |
| `/settings` | any signed-in user (appearance theme, account summary) |
| `/vacancy` | `HR_OFFICER`, `ADMIN` |
| `/candidate` | `CANDIDATE` (application form) |
| `/candidates`, `/interviews` | `HR_OFFICER`, `INTERVIEWER`, `MANAGER`, `ADMIN` |
| `/reports` | `MANAGER`, `ADMIN` |
| `/users` | `ADMIN` (create staff accounts, change roles, deactivate) |

- Add or change access by wrapping the route in `<ProtectedRoute
  allowedRoles={[...]} />` in `App.jsx`. Do not check roles inside pages
  (sections inside a stage panel may hide actions by role; the server decides).
- An unauthorised role is redirected to `/`, not shown an error.

## Design system

Operate-mode product UI: calm, dense where useful, familiar patterns. Brand
colour is used for actions, links and the current selection only, never as
decoration. The standards below were set from an accessibility audit and from
Anthropic's `frontend-design`, Impeccable, Vercel `web-design-guidelines` and
`make-interfaces-feel-better` guidance.

**Tokens** live in `src/styles/index.css` as RGB channels (`--ers-primary-rgb: 194 60 20`)
and are exposed in `tailwind.config.js` with `<alpha-value>`, so opacity classes
work (`bg-ers-primary/10`). Never define a Tailwind colour as a plain
`var(--hex)`: opacity utilities silently stop compiling. Restart the Vite dev
server after editing `tailwind.config.js`.

| Token | Use |
|---|---|
| `ers-bg`, `ers-surface` | page background, cards/panels/inputs |
| `ers-ink`, `ers-ink-soft`, `ers-muted` | primary, secondary, placeholder/caption text |
| `ers-line` | decorative dividers and card borders (not for input borders) |
| `ers-primary`, `ers-primary-hover`, `ers-primary-ink` | actions and links, hover, text on primary |
| `ers-accent`, `ers-danger`, `ers-warning` | success, error/destructive, attention |

Rules:

- **Contrast:** text pairings must be at least 4.5:1 and input borders at least
  3:1. The tokens already meet this; do not lighten them, and do not put small
  text on `ers-primary` tints other than `ers-primary` itself. Check new colours
  before adding them.
- No hard-coded hex or default Tailwind palette colours (`gray-*`, `white`,
  `black`). No emoji or unicode glyphs as icons; icons come from `lucide-react`.
- **Surfaces:** `surface-panel` is the one elevated container (solid, neutral
  shadow). No decorative blur, glass, gradients, coloured glows or background
  blobs. Use `shadow-card` / `shadow-pop`; shadows are neutral with an offset.
- **Radius:** controls `rounded-lg`, cards `rounded-xl`, panels and modals
  larger. Nested radius = outer radius minus padding.
- **Type:** scale tokens `text-stat`, `text-display`, `text-h2`, `text-h3`,
  `text-body`, `text-label`, `text-caption`. Use `tabular-nums` for numbers in
  tables and stats. Headings use `text-wrap: balance` (set globally).
- **Motion:** 150-250 ms, state only, never `transition-all` (list properties).
  Press feedback is `active:scale-[0.96]`. No page-load choreography.
- **Targets:** interactive controls are at least 40 px high (44 px on touch);
  `Button size="sm"` is 36 px on desktop and 44 px on touch.
- **States:** every interactive component has default, hover, focus-visible,
  active, disabled and (where relevant) loading and error. Focus uses the global
  `:focus-visible` ring; never remove an outline without a visible replacement.
- **Loading and empty:** use `LoadingRows`/`Skeleton` for content that is
  loading (not a spinner in the middle of a page) and `EmptyState` for empty
  results; say what is missing and what to do. Use `Spinner` only for short
  inline waits.
- **Forms:** every input has a visible label, the right `type`, `autoComplete`
  and `spellCheck={false}` for emails; errors are inline and name the fix.
- **Destructive actions** need a second step (see `UserRow` deactivate) or an
  undo; do not use `window.confirm`.
- Mobile first; the shell must stay usable on a phone. Keep the skip link and
  landmarks in `AppLayout`.
- **Layout:** every dashboard page fills the whole content area (no width cap,
  no centred narrow column). Lay wide forms out in columns instead. The desktop
  sidebar is collapsible to an icon rail (state kept in `localStorage`).
- **Themes:** light is the default for everyone. Dark mode is chosen on the
  Settings page and applies **only inside dashboards**: `AppLayout` calls
  `useDocumentTheme()`, public pages (landing, sign-in, register) never do and
  are always light. Dark tokens live under `[data-theme="dark"]` in
  `src/styles/index.css`. Use `ers-sidebar`/`ers-sidebar-fg` for the navigation rail
  and dark surfaces that must stay dark in both themes, and `ers-scrim` for
  backdrops; never use `ers-ink` as a background colour (it flips in dark mode).
- **Logo:** `src/shared/brand/Logo.jsx` (variants `full`, `mark`, `icon`;
  tone `dark`/`light`). Geometry lives only in `src/shared/brand/logoSvg.js`; after changing it
  run `node scripts/build-logo.mjs` to regenerate `public/logo*.svg` and the
  favicon. Do not add raster logos.
- **Landing page:** `src/features/landing/` (home page, job page `/jobs/:id`, header, footer).
  Hero photo is `public/images/landing-hero-*` (optimised from the supplied
  Pexels photo).

Primitives in `src/shared/ui/`: `Button` (variants `primary`, `secondary`,
`danger`, `ghost`; sizes `md`, `sm`), `Input`, `Select`, `TextArea`,
`SearchInput`, `Badge`, `Tabs`, `Modal` (focus trap, scroll lock, restores
focus), `Table`/`Th`, `Skeleton`/`LoadingRows`, `EmptyState`, `Spinner`,
`FileUpload`. Use them instead of raw elements, keep the `forwardRef` and
`aria-invalid`/`aria-describedby` wiring, and extend a primitive rather than
restyling one-offs with `!important` overrides.

## Conventions

- Function components, default export per file, file name matches the
  component (`VacancyForm.jsx`).
- Forms: `react-hook-form` with a `zod` schema through `zodResolver`;
  surface errors via the `error` prop of the ui primitives.
- Icons from `lucide-react` only. Note the pinned old version (0.263): check
  an icon exists in `node_modules/lucide-react` before importing it.
- New page: create `src/features/<feature>/pages/XPage.jsx`, wrap content in
  `AppLayout` (`title`, `subtitle`), then register the route in
  `src/app/App.jsx` with the right `allowedRoles` (and add it to
  `src/app/layout/navigation.js` if it belongs in the sidebar).
- Server state: add a function in the feature's `api.js`, expose it as a hook in
  its `hooks.js` (cache keys live in `src/shared/api/queryKeys.js`), and invalidate the right query keys after mutations. The base
  URL is relative (`/api`) so the session cookie stays same-origin; override
  only with `VITE_API_URL`.
- Errors: `ApiError` (`src/shared/api/client.js`) carries `kind` (`network`, `unavailable`,
  `server`, `auth`, `permission`, `notfound`, `limit`, `validation`) and a message
  written for people; 5xx bodies are never shown. Show `err.message` in forms.
  For failed data loads use `<ErrorState error onRetry={refetch} />`; never print
  a raw status ("Request failed (500)"). Unknown routes render `NotFoundPage`
  and render crashes are caught by `ErrorBoundary`; both use `StatusPage`.

## Git

- Remote `origin`, branch `main`. Conventional commits (`feat:`, `fix:`,
  `docs:` ...).
- **Never commit, push or deploy without asking the human first.** Approval
  for one commit or deploy does not carry over to the next.
- **No AI attribution.** Never add an AI agent or LLM as a co-author or
  author: no `Co-Authored-By: Claude ...`, no "Generated with ..." lines in
  commit messages or PR descriptions. This overrides any tool default.
- Stage selectively (`git add <your files>`), never `git add -A`; the human
  often has unrelated edits in the working tree.
- Do not commit `.env*` files (only `.env.example`), credentials or `dist/`.

## Working rules

- **Do not use MCP tools** (Render, Neon, Vercel, Sanity, browser extensions,
  etc.) without asking the human first. The Chrome extension tools are never
  used; browse with the `agent-browser` CLI.
- **Backend conventions:** TypeScript, one folder per module under
  `backend/src/modules/` (the lifecycle ones under `modules/recruitment/`;
  `routes -> controller -> service -> repository`, Zod schema beside them). State
  changes only through `workflow.engine.ts#moveState`; its rules live in
  `workflow.rules.ts`. Update
  `backend/README.md` when you add an endpoint or env var.
- **Verify before claiming done:** run `npm run build` (frontend) and
  `npx tsc --noEmit` plus `backend/scripts/smoke.sh` (backend) with the API
  running on Node (not Docker).
- **Docker comes last.** Develop and test the backend with Node.js directly on
  the host and `curl`; only add and run Docker once everything works, and ask
  the human before starting it (the machine is shared with other work).

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, invoke the `skill` tool with `skill: "graphify"` before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
