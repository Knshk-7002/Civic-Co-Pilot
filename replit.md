# Civic Co-Pilot

An admin dashboard for district-level government administrators to track citizen complaints and recommend official government welfare schemes.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/civic-copilot run dev` — run the frontend (port 20671)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string (already provisioned)
- Optional env: `SESSION_SECRET` — session signing key (already set)
- Optional env: `ADMIN_USERNAME` / `ADMIN_PASSWORD` — defaults to `admin` / `admin123`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Wouter + TanStack Query + shadcn/ui
- API: Express 5 + express-session
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for all contracts)
- `lib/db/src/schema/complaints.ts` — Complaints table
- `lib/db/src/schema/schemes.ts` — Government schemes table
- `artifacts/api-server/src/routes/auth.ts` — Admin login/logout/session
- `artifacts/api-server/src/routes/complaints.ts` — Complaint CRUD + stats
- `artifacts/api-server/src/routes/schemes.ts` — Scheme CRUD
- `artifacts/civic-copilot/src/` — React frontend

## Admin Login

Default credentials: **username:** `admin` | **password:** `admin123`

To change, set `ADMIN_USERNAME` and `ADMIN_PASSWORD` environment variables.

## Product

- Admin login with session-based authentication
- Dashboard with complaint statistics (by status, by category, recent count, high-priority)
- Complaints list with search, status/category/priority filters
- Complaint detail view: update status, add admin notes, see relevant scheme recommendations
- Government schemes directory: browse official schemes with links to govt portals
- Add new schemes via a form

## Architecture decisions

- Session-based auth (express-session) — no external auth service needed for a single-admin tool
- Stats endpoint uses SQL aggregation for accurate counts
- Complaints are publicly creatable (citizens submit them), but only admins can view/update/delete
- Schemes are publicly viewable so they can be embedded in public-facing pages later
- Admin credentials from env vars with safe defaults for development

## Gotchas

- Run `pnpm --filter @workspace/api-spec run codegen` after any OpenAPI spec change
- Run `pnpm --filter @workspace/db run push` after DB schema changes
- Session cookies are not secure (HTTP-only) — enable HTTPS + `secure: true` in production
