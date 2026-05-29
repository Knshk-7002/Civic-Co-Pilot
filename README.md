# Civic Co-Pilot

A district-level government admin dashboard to track citizen complaints and connect communities to official government welfare schemes.

---

## What It Does

**Civic Co-Pilot** is a command center for government administrators. It allows admins to:

- **Track citizen complaints** — receive, filter, prioritize, and resolve complaints across categories like Road, Water, Electricity, Sanitation, Healthcare, and Education
- **Manage complaint status** — move complaints through a workflow (Pending → In Review → Resolved/Rejected) and add internal admin notes
- **Browse government schemes** — a directory of official Indian government welfare schemes with direct links to official portals
- **Recommend schemes** — when viewing a complaint, the system shows relevant government schemes based on the complaint category
- **Add new schemes** — admins can add new government schemes to the directory at any time

---

## Features

| Feature | Description |
|---|---|
| Admin Login | Secure session-based login with configurable credentials |
| Dashboard | Live stats — total complaints, by status, high priority, recent activity, category breakdown |
| Complaints List | Search + filter by status, category, and priority |
| Complaint Detail | Full citizen info, status updates, admin notes, scheme recommendations |
| Schemes Directory | Browse and search official government schemes with external links |
| Add Scheme | Form to add new welfare schemes to the directory |

---

## Tech Stack

- **Frontend:** React + Vite + Wouter + TanStack Query + shadcn/ui
- **Backend:** Node.js + Express 5
- **Database:** PostgreSQL + Drizzle ORM
- **Auth:** Session-based (express-session)
- **Validation:** Zod
- **Language:** TypeScript (full-stack)

---

## Getting Started

### Prerequisites

- Node.js 24+
- pnpm
- PostgreSQL database (set `DATABASE_URL` env var)

### Install dependencies

```bash
pnpm install
```

### Set up the database

```bash
pnpm --filter @workspace/db run push
```

### Run the development servers

```bash
# API server (port 8080)
pnpm --filter @workspace/api-server run dev

# Frontend (port 20671)
pnpm --filter @workspace/civic-copilot run dev
```

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | Yes | — | PostgreSQL connection string |
| `SESSION_SECRET` | No | fallback string | Secret key for session signing |
| `ADMIN_USERNAME` | No | `admin` | Admin login username |
| `ADMIN_PASSWORD` | No | `admin123` | Admin login password |

---

## Default Admin Credentials

```
Username: admin
Password: admin123
```

To change these, set the `ADMIN_USERNAME` and `ADMIN_PASSWORD` environment variables.

---

## Project Structure

```
artifacts/
  api-server/          # Express backend
    src/routes/
      auth.ts          # Login / logout / session
      complaints.ts    # Complaint CRUD + stats
      schemes.ts       # Government scheme CRUD
  civic-copilot/       # React frontend

lib/
  api-spec/
    openapi.yaml       # OpenAPI contract (source of truth)
  db/
    src/schema/
      complaints.ts    # Complaints table
      schemes.ts       # Government schemes table
  api-client-react/    # Auto-generated React Query hooks
  api-zod/             # Auto-generated Zod schemas
```

---

## Government Schemes Included

The app comes pre-loaded with 10 official Indian government schemes including:

- Pradhan Mantri Awas Yojana (Housing)
- Ayushman Bharat - PM Jan Arogya Yojana (Healthcare)
- PM Kisan Samman Nidhi (Agriculture)
- Mahatma Gandhi NREGA (Employment)
- Pradhan Mantri Ujjwala Yojana (Energy)
- National Scholarship Portal (Education)
- Pradhan Mantri Mudra Yojana (Business loans)
- Swachh Bharat Mission (Sanitation)
- Beti Bachao Beti Padhao (Girl child welfare)
- PM SVANidhi — Street Vendor Loan Scheme

---

## License

This project is intended for educational and civic governance purposes.
