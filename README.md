# 📝 Taskify — Fast, simple, full-stack task management

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Monorepo](https://img.shields.io/badge/monorepo-TurboRepo-000000?logo=turborepo)
![Runtime](https://img.shields.io/badge/runtime-Bun-000000?logo=bun)
![Frontend](https://img.shields.io/badge/frontend-Next.js_16-000000?logo=nextdotjs)
![Backend](https://img.shields.io/badge/backend-Express.js_5-000000?logo=express)
![Database](https://img.shields.io/badge/database-PostgreSQL-4169E1?logo=postgresql)
![ORM](https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma)
![Auth](https://img.shields.io/badge/auth-JWT-orange)
![OAuth](https://img.shields.io/badge/OAuth-Google-4285F4?logo=google)
![Language](https://img.shields.io/badge/language-TypeScript-3178C6?logo=typescript)
![UI](https://img.shields.io/badge/UI-Tailwind_CSS-38B2AC?logo=tailwindcss)
![UI](https://img.shields.io/badge/UI-shadcn%2Fui-000000)
![Deploy](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel)

Taskify is a fast, open-source task management application built as a Turborepo monorepo. It provides an intuitive dashboard where you can organize your work through projects and tasks, with support for labels, priorities, statuses, and filtering. With Google OAuth integration, secure JWT-based sessions, and a responsive modern UI built with Next.js and Tailwind CSS, Taskify makes managing your daily tasks effortless and enjoyable.

## Table of Contents

- [📝 Taskify — Fast, simple, full-stack task management](#-taskify--fast-simple-full-stack-task-management)
  - [Table of Contents](#table-of-contents)
  - [📌 Live Services](#-live-services)
  - [📁 Repository Structure](#-repository-structure)
  - [🛠 Tech Stack](#-tech-stack)
    - [Languages \& Frameworks](#languages--frameworks)
    - [Libraries \& Tools](#libraries--tools)
  - [🧩 High-Level Architecture](#-high-level-architecture)
  - [🚀 Features](#-features)
    - [Authentication](#authentication)
    - [Project Management](#project-management)
    - [Task Management](#task-management)
    - [Dashboard UX](#dashboard-ux)
    - [Developer Experience](#developer-experience)
  - [📡 API Endpoints](#-api-endpoints)
    - [Authentication Routes](#authentication-routes)
    - [Project Routes](#project-routes)
    - [Task Routes](#task-routes)
  - [⚙️ Installation (Local Development)](#️-installation-local-development)
    - [Prerequisites](#prerequisites)
    - [1) Clone and install](#1-clone-and-install)
    - [2) Environment variables](#2-environment-variables)
    - [3) Database and Prisma](#3-database-and-prisma)
    - [4) Start development](#4-start-development)
  - [🧪 Usage Guide](#-usage-guide)
    - [Web app](#web-app)
    - [Monorepo scripts (root)](#monorepo-scripts-root)
  - [👥 Authors](#-authors)

<a id="live-services"></a>

## 📌 Live Services

| Layer | Platform | Link                                  |
| ----- | -------- | ------------------------------------- |
| Web   | Vercel   | https://taskify-web-rho.vercel.app    |
| API   | Vercel   | https://taskify-server-psi.vercel.app |

<a id="repository-structure"></a>

## 📁 Repository Structure

```
Taskify/
├─ apps/
│  ├─ api/                        # Backend: Express + Prisma + Zod
│  │  ├─ src/
│  │  │  ├─ app.ts                # Express app wiring (CORS, cookies, routes)
│  │  │  ├─ index.ts              # Bootstraps server (PORT from env)
│  │  │  ├─ constants/env.ts      # Zod-validated environment variables
│  │  │  ├─ controllers/
│  │  │  │  ├─ auth/              # register, login, logout, oauth, verify
│  │  │  │  ├─ projects/          # getProjects, getProjectDetails, createProject, updateProject, deleteProject
│  │  │  │  └─ tasks/             # getTasks, createTask, updateTask, deleteTask
│  │  │  ├─ lib/db.ts             # PrismaClient singleton
│  │  │  ├─ middlewares/          # authenticate (JWT via cookie)
│  │  │  └─ routes/               # /api/auth, /api/tasks, /api/projects
│  │  ├─ prisma/
│  │  │  ├─ schema.prisma         # PostgreSQL models: User, Project, Task, Label
│  │  │  └─ migrations/           # Database migrations
│  │  └─ vercel.json
│  └─ web/                        # Frontend: Next.js + Tailwind + shadcn/ui
│     ├─ src/
│     │  ├─ app/                  # App Router pages (landing, auth, dashboard, projects)
│     │  │  ├─ page.tsx           # Landing page
│     │  │  ├─ login/             # Login page
│     │  │  ├─ register/          # Registration page
│     │  │  ├─ auth/callback/     # OAuth callback handler
│     │  │  └─ dashboard/         # Dashboard and project views
│     │  │     └─ [projectId]/    # Dynamic project task management
│     │  ├─ components/           # UI primitives and providers
│     │  │  ├─ ui/                # shadcn/ui components (button, card, dialog, input, etc.)
│     │  │  └─ providers/         # Theme provider
│     │  ├─ hooks/                # Custom hooks (useNotyf)
│     │  └─ lib/                  # apiFetch, auth helpers, utils
│     ├─ styles/globals.css
│     └─ vercel.json
├─ packages/
│  ├─ eslint-config/              # Shared ESLint configs
│  └─ typescript-config/          # Shared tsconfig base
├─ turbo.json                     # Turborepo pipeline (env passthrough)
├─ package.json                   # Monorepo scripts (Bun)
└─ bun.lock
```

<a id="tech-stack"></a>

## 🛠 Tech Stack

### Languages & Frameworks

- **Frontend:** Next.js 16, React 19, TypeScript
- **Backend:** Express.js 5, TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma

### Libraries & Tools

- **UI:** Tailwind CSS, shadcn/ui, Radix UI (Dialog, Dropdown Menu, Select, Slot), Lucide Icons
- **Theming:** next-themes
- **Notifications:** Notyf
- **Styling Utilities:** clsx, tailwind-merge, class-variance-authority, tailwindcss-animate
- **Authentication:** jsonwebtoken (JWT), bcryptjs, Google OAuth 2.0
- **Validation:** Zod (env validation)
- **HTTP:** cors, cookie-parser
- **Tooling/Infra:** Turborepo, Bun, ESLint, Prettier, PostCSS
- **Deployment:** Vercel (web + api)

<a id="high-level-architecture"></a>

## 🧩 High-Level Architecture

```
   ┌─────────────────┐          ┌───────────────────────┐           ┌─────────────────┐
   │   Next.js 16    │  fetch   │   Express API (Bun)   │  Prisma   │   PostgreSQL    │
   │   (Web)         ├─────────>│   /api/auth           ├──────────>│   (Users,       │
   │                 │ cookies  │   /api/projects       │           │    Projects,    │
   │   Turbopack     │          │   /api/tasks          │           │    Tasks,       │
   └─────────────────┘          │   JWT via cookies     │           │    Labels)      │
                                └───────────────────────┘           └─────────────────┘
                           ^                |
                           |                |
                     Google OAuth 2.0 <─────┘ (code exchange → JWT session)
```

**Key Architecture Details:**

- **Sessions:** JWT stored in `httpOnly` cookie `SessionToken` (1 year expiry; `secure` + `sameSite` tuned by `NODE_ENV`)
- **CORS:** Restricted to `APP_ORIGIN` with credentials enabled
- **Labels:** Many-to-many relationship between `Task` and `Label` (connect or create on write)
- **Projects:** Users can organize tasks into projects with cascading deletes
- **Database Relations:** User → Projects → Tasks with proper cascade deletion

<a id="features"></a>

## 🚀 Features

### Authentication

- Email + password registration and login (bcrypt hashing)
- Google OAuth (authorization code flow)
- Session management via `httpOnly` JWT cookie
- Session verification endpoint

### Project Management

- Create, Read, Update, Delete projects
- Project descriptions (optional)
- Search projects by name
- Cascading delete (deletes all associated tasks)

### Task Management

- Create, Read, Update, Delete tasks
- Priority levels (customizable)
- Status tracking (customizable)
- Labels (connect existing or create new, many-to-many)
- Tasks organized within projects

### Dashboard UX

- Search tasks and projects
- Filter by priority and status
- Sort by date (ascending/descending)
- Pagination for large task lists
- Toggle to show/hide completed tasks
- Toast notifications (Notyf)
- Dark/light theme toggle (next-themes)
- Responsive design with shadcn/ui + Tailwind CSS

### Developer Experience

- Zod-validated runtime configuration
- Turborepo-managed monorepo
- Shared ESLint and TypeScript configs
- Bun for fast install and development
- Hot reload with `--hot` flag

<a id="api-endpoints"></a>

## 📡 API Endpoints

Base URL (local): `http://localhost:8080`  
All authenticated routes require a valid `SessionToken` cookie.

### Authentication Routes

| Endpoint             | Method | Description                              | Access                                 |
| -------------------- | ------ | ---------------------------------------- | -------------------------------------- |
| `/`                  | GET    | Health check ("Hello, World!")           | Public                                 |
| `/api/auth/register` | POST   | Register a user (name, email, password)  | Public                                 |
| `/api/auth/login`    | POST   | Login (email, password) → sets cookie    | Public                                 |
| `/api/auth/oauth`    | POST   | Google OAuth code exchange → sets cookie | Public                                 |
| `/api/auth/verify`   | GET    | Validate current session cookie          | Auth required (401 if missing/invalid) |
| `/api/auth/logout`   | DELETE | Clear session cookie                     | Public (clears if present)             |

### Project Routes

| Endpoint                   | Method | Description                  | Access        |
| -------------------------- | ------ | ---------------------------- | ------------- |
| `/api/projects`            | GET    | Get all user projects        | Auth required |
| `/api/projects/:projectId` | GET    | Get project details          | Auth required |
| `/api/projects`            | POST   | Create project (name, desc)  | Auth required |
| `/api/projects/:projectId` | PATCH  | Update project (name, desc)  | Auth required |
| `/api/projects/:projectId` | DELETE | Delete project and its tasks | Auth required |

### Task Routes

| Endpoint             | Method | Description                                              | Access        |
| -------------------- | ------ | -------------------------------------------------------- | ------------- |
| `/api/tasks`         | GET    | Get tasks (with search, filter, sort, pagination)        | Auth required |
| `/api/tasks`         | POST   | Create task (title, priority, status, labels, projectId) | Auth required |
| `/api/tasks/:taskId` | PATCH  | Update task (title, priority, status, labels)            | Auth required |
| `/api/tasks/:taskId` | DELETE | Delete task                                              | Auth required |

<a id="installation-local-development"></a>

## ⚙️ Installation (Local Development)

<a id="prerequisites"></a>

### Prerequisites

- **Bun** >= 1.0 ([https://bun.sh](https://bun.sh))
- **PostgreSQL** (local or remote instance)
- **Google OAuth Credentials** (for OAuth functionality)

<a id="1-clone-and-install"></a>

### 1) Clone and install

```bash
git clone https://github.com/AvgBlank/Taskify.git
cd Taskify
bun install
```

<a id="2-environment-variables"></a>

### 2) Environment variables

Create `.env` files in each app directory:

**apps/api/.env**

```env
# Node environment
NODE_ENV=development

# Port to run API on
PORT=8080

# Frontend origin (for CORS)
APP_ORIGIN=http://localhost:3000

# PostgreSQL connection string
DATABASE_URL=postgres://username:password@localhost:5432/taskify

# JWT secret (use a strong random string)
JWT_SECRET="your-random-secret-key"

# Google OAuth credentials
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
REDIRECT_URI="http://localhost:3000/auth/callback"
```

**apps/web/.env**

```env
# Backend API base URL
NEXT_PUBLIC_API_URL="http://localhost:8080"

# Google OAuth (must match API config)
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id"
NEXT_PUBLIC_REDIRECT_URI="http://localhost:3000/auth/callback"
```

<a id="3-database-and-prisma"></a>

### 3) Database and Prisma

Run from repository root:

```bash
bun run db:migrate:dev     # Run dev migrations
```

Alternatively, within the API app:

```bash
cd apps/api
bunx prisma migrate dev
```

To generate the Prisma client:

```bash
bun run db:generate
```

<a id="4-start-development"></a>

### 4) Start development

**Start both apps using TurboRepo (from root):**

```bash
bun run dev
```

**Or start individually:**

```bash
# API (http://localhost:8080)
cd apps/api
bun run dev

# Web (http://localhost:3000)
cd apps/web
bun run dev
```

<a id="usage-guide"></a>

## 🧪 Usage Guide

<a id="web-app"></a>

### Web app

1. Open [http://localhost:3000](http://localhost:3000)
2. Register a new account or Login with existing credentials
3. Optionally use **Continue with Google** (OAuth — redirects to `/auth/callback`)
4. Create and manage **Projects** from the Dashboard
5. Click on a project to manage its **Tasks**
6. Use search, filter by priority/status, and sort by date
7. Add labels to tasks (space-separated input)
8. Toggle dark/light theme using the theme switcher

<a id="monorepo-scripts-root"></a>

### Monorepo scripts (root)

| Command                     | Description                    |
| --------------------------- | ------------------------------ |
| `bun run dev`               | Start all apps in dev mode     |
| `bun run build`             | Build all apps                 |
| `bun run start`             | Start all apps (after build)   |
| `bun run lint`              | Lint all apps                  |
| `bun run lint:fix`          | Fix lint issues                |
| `bun run check-types`       | Type-check all apps            |
| `bun run format`            | Format code with Prettier      |
| `bun run clean`             | Clean build outputs            |
| `bun run db:generate`       | Generate Prisma client         |
| `bun run db:migrate:dev`    | Run development migrations     |
| `bun run db:migrate:deploy` | Deploy migrations (production) |

<a id="authors"></a>

## 👥 Authors

- **AvgBlank** — [https://github.com/AvgBlank](https://github.com/AvgBlank)
