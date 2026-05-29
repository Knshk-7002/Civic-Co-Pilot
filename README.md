# Civic Co-Pilot

### AI-Simulated Civic Grievance & Scheme Recommendation System

Civic Co-Pilot is a full-stack web application that streamlines civic grievance handling, improves government transparency, and helps citizens discover government schemes they qualify for. It uses a rule-based logic engine to auto-classify complaints and a personal eligibility checker to recommend schemes based on user-provided details.

---

## Live Demo

| | Link |
|---|---|
| **Live Website** | https://civic-co-pilot--kanishkjoshi700.replit.app |
| **GitHub Repository** | https://github.com/Knshk-7002/Civic-Co-Pilot |

---

## What It Does

### For Citizens
- Log in through the **Citizen Portal** (green theme)
- Submit complaints in plain language — the system auto-classifies them by category, priority, and department
- Track every complaint from submission to resolution with a full status timeline
- Use the **Scheme Eligibility Checker** — enter personal details (age, income, occupation, problems) and instantly see which government schemes you qualify for

### For Admins
- Log in through the **Admin Portal** (purple theme)
- View the full dashboard with complaint statistics, priority breakdown, and resolution rates
- Browse all citizen complaints with filters
- Update complaint statuses: `IN_PROGRESS → RESOLVED / REJECTED` with notes

---

## Features

| Feature | Description |
|---|---|
| Dual Portal Login | Separate Citizen Portal and Admin Portal — distinct themes, forms, and dashboards |
| Auto-Classification | Complaint text is analyzed by a rule-based engine and assigned category, priority, and department |
| Complaint Tracking | Full lifecycle from `SUBMITTED → IN_PROGRESS → RESOLVED / REJECTED` with status history |
| Scheme Eligibility Checker | Fill in your personal details and problems — get a list of schemes you personally qualify for |
| Scheme Browser | Browse all 12 government schemes with expandable details, benefits, and how-to-apply |
| Admin Dashboard | Stats overview, urgency queues, and full complaint management |
| Role-Based Access | Three roles: `CITIZEN`, `STUDENT`, `ADMIN` — each sees a different interface |
| Session Auth | Secure cookie-based sessions — no tokens, no localStorage |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS |
| UI Components | shadcn/ui, Radix UI |
| Backend | Node.js, Express 5, TypeScript |
| Database | PostgreSQL + Drizzle ORM |
| API Contract | OpenAPI 3.1 + Orval codegen |
| Validation | React Hook Form + Zod |
| Monorepo | pnpm workspaces + esbuild |

---

## Project Structure

```
Civic-Co-Pilot/
│
├── artifacts/
│   ├── api-server/                  # Express 5 REST API
│   │   └── src/
│   │       ├── index.ts             # Server entry point
│   │       ├── app.ts               # Express app setup + middleware
│   │       ├── lib/
│   │       │   └── classifier.ts    # Rule-based complaint classifier
│   │       └── routes/
│   │           ├── auth.ts          # Register, login, logout, me
│   │           ├── complaints.ts    # Complaint CRUD + status update
│   │           ├── schemes.ts       # Scheme list + eligibility recommendation
│   │           └── admin.ts         # Admin stats + full complaint management
│   │
│   └── civic-copilot/               # React + Vite frontend
│       └── src/
│           ├── App.tsx              # Router + protected routes
│           ├── pages/
│           │   ├── home.tsx         # Landing page
│           │   ├── login.tsx        # Dual portal login (Citizen / Admin)
│           │   ├── register.tsx     # Registration with role selection
│           │   ├── dashboard.tsx    # Citizen dashboard with stats + complaints
│           │   ├── my-complaints.tsx        # Complaint list with filters
│           │   ├── complaint-detail.tsx     # Individual complaint + status history
│           │   ├── submit-complaint.tsx     # Complaint submission form
│           │   ├── schemes.tsx      # Browse schemes + eligibility checker
│           │   ├── admin-dashboard.tsx      # Admin stats overview
│           │   └── admin-complaints.tsx     # Admin complaint management
│           ├── components/
│           │   ├── layout.tsx       # App shell + sidebar navigation
│           │   └── shared/          # Reusable UI (Card, Badge, PageHeader)
│           └── hooks/
│               └── use-auth.tsx     # Auth context + login/logout/register
│
├── lib/
│   ├── api-spec/                    # OpenAPI 3.1 YAML specification
│   ├── api-client-react/            # Generated React Query hooks (via Orval)
│   ├── api-zod/                     # Generated Zod validation schemas
│   └── db/
│       └── src/schema/
│           ├── users.ts
│           ├── complaints.ts
│           └── schemes.ts
│
├── scripts/                         # Utility scripts (seeding, etc.)
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

---

## Pages & Routes

| Page | URL | Access | Description |
|---|---|---|---|
| Landing | `/` | Public | Home page with portal selection buttons |
| Login | `/login` | Public | Choose Citizen or Admin portal, then sign in |
| Register | `/register` | Public | Create account with role selection |
| Citizen Dashboard | `/dashboard` | Citizen / Student | Stats, recent complaints, quick actions |
| Submit Complaint | `/complaints/new` | Citizen / Student | Plain language complaint form |
| My Complaints | `/complaints` | Citizen / Student | Full complaint history with filters |
| Complaint Detail | `/complaints/:id` | Citizen / Student | Status timeline + full details |
| Schemes | `/schemes` | Citizen / Student | Browse schemes + eligibility checker |
| Admin Dashboard | `/admin/dashboard` | Admin only | Stats, priority breakdown, summary |
| Admin Complaints | `/admin/complaints` | Admin only | Manage all complaints, update statuses |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Create new account |
| `POST` | `/api/auth/login` | Sign in |
| `POST` | `/api/auth/logout` | Sign out |
| `GET` | `/api/auth/me` | Get logged-in user |
| `GET` | `/api/complaints` | List complaints (own for citizen, all for admin) |
| `POST` | `/api/complaints` | Submit a new complaint |
| `GET` | `/api/complaints/:id` | Complaint details + full status history |
| `PATCH` | `/api/complaints/:id/status` | Update status (admin only) |
| `GET` | `/api/schemes` | List schemes (filterable by category/role) |
| `POST` | `/api/schemes/recommend` | Recommend schemes based on text + user role |
| `GET` | `/api/admin/stats` | Admin statistics overview |
| `GET` | `/api/admin/complaints` | All complaints with filters (admin only) |

---

## Auto-Classification Logic

The classifier at `artifacts/api-server/src/lib/classifier.ts` analyzes complaint text with keyword matching:

**Category Keywords**

| Category | Trigger Keywords |
|---|---|
| FINANCE | fee, payment, scholarship, loan, refund, subsidy, pension, tax |
| EDUCATION | school, college, exam, teacher, admission, syllabus, degree |
| HEALTH | hospital, doctor, medicine, vaccination, clinic, disease |
| INFRASTRUCTURE | road, pothole, electricity, water, drainage, bridge, street |
| HOUSING | house, rent, eviction, accommodation, shelter, property |
| EMPLOYMENT | job, salary, unemployment, labour, hiring, work |
| ENVIRONMENT | pollution, waste, garbage, emission, plastic, dumping |

**Priority Keywords**

| Priority | Trigger Keywords |
|---|---|
| URGENT | emergency, danger, life, crisis, flood, fire, accident |
| HIGH | severe, broken, denied, no access, collapsed, critical |
| MEDIUM | delay, pending, waiting, months, no response |
| LOW | Default fallback |

---

## Database Schema

```
users
  id, name, email, password_hash, role (CITIZEN/STUDENT/ADMIN), created_at

complaints
  id, title, description, category, priority, department,
  status (SUBMITTED/IN_PROGRESS/RESOLVED/REJECTED),
  user_id → users.id, created_at, updated_at

status_history
  id, complaint_id → complaints.id, status, note, changed_at

schemes
  id, name, description, category, eligible_roles (JSON),
  benefits, how_to_apply
```

---

## Demo Accounts

All accounts use password: **`admin123`**

| Role | Email | Portal |
|---|---|---|
| Admin | admin@civic.gov | Admin Portal |
| Student | student@example.com | Citizen Portal |
| Citizen | citizen@example.com | Citizen Portal |

---

## Local Setup

### 1. Prerequisites
- Node.js 20+
- pnpm — `npm install -g pnpm`
- PostgreSQL database

### 2. Clone & Install
```bash
git clone https://github.com/Knshk-7002/Civic-Co-Pilot.git
cd Civic-Co-Pilot
pnpm install
```

### 3. Environment Variables
Create a `.env` file in the project root:
```
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/civic_copilot
SESSION_SECRET=any-long-random-string
PORT=8080
```

### 4. Database Setup
```bash
pnpm --filter @workspace/db run push
```

### 5. Run the App
Open two terminals:

**Terminal 1 — Backend:**
```bash
pnpm --filter @workspace/api-server run dev
```
Wait for: `Server listening port: 8080`

**Terminal 2 — Frontend:**
```bash
pnpm --filter @workspace/civic-copilot run dev
```
Wait for: `VITE ready`

Open browser at: **http://localhost:5173**

---

## Java Concepts Implemented

| Java Concept | How It Appears in This Project |
|---|---|
| OOP / Classes | TypeScript interfaces and typed models for User, Complaint, Scheme |
| Encapsulation | Classifier logic is hidden inside `classifier.ts` — rest of app just calls it |
| Exception Handling | `try/catch` in every route handler with structured error responses |
| JDBC / JPA / Hibernate | Drizzle ORM — type-safe queries, schema definition, migrations |
| MVC Architecture | Routes (Controller) → DB queries (Model) → React pages (View) |
| Collections / Streams | `.filter()`, `.map()`, `.reduce()` throughout frontend and backend |
| Enum Types | Status: SUBMITTED/IN_PROGRESS/RESOLVED/REJECTED; Role: CITIZEN/STUDENT/ADMIN |
| Rule-based Expert System | Keyword-matching classifier assigns category and priority automatically |
| Servlet Sessions | `express-session` — same concept as `HttpSession` in Java Servlets |
| REST API | Express routes mirror Java Spring `@RestController` patterns |

---

## Future Enhancements

- Real NLP / ML model replacing the keyword classifier
- Email and SMS notifications on status updates
- Mobile app (React Native / Expo)
- Live complaint tracking with WebSocket updates
- Multi-language support (Hindi, regional languages)
- Integration with official government scheme databases
- QR code generation for offline complaint submission

---

## License

Developed for academic purposes as part of a Java-based system design project.
