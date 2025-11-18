# 📝 Taskify — Fast, simple, full‑stack task management

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Monorepo](https://img.shields.io/badge/monorepo-TurboRepo-000000?logo=turborepo&logoColor=white)
![Runtime](https://img.shields.io/badge/runtime-Bun-000000?logo=bun&logoColor=white)
![Frontend](https://img.shields.io/badge/frontend-Next.js-000000?logo=nextdotjs&logoColor=white)
![Backend](https://img.shields.io/badge/backend-Express.js-000000?logo=express&logoColor=white)
![Database](https://img.shields.io/badge/database-PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![ORM](https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma)
![Auth](https://img.shields.io/badge/auth-JWT-orange)
![OAuth](https://img.shields.io/badge/OAuth-Google-4285F4?logo=google&logoColor=white)
![Language](https://img.shields.io/badge/language-TypeScript-3178C6?logo=typescript&logoColor=white)
![UI](https://img.shields.io/badge/UI-Tailwind_CSS-38B2AC?logo=tailwindcss&logoColor=white)
![UI](https://img.shields.io/badge/UI-shadcn%2Fui-000000)
![Deploy](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)

Taskify is a simple and fast task manager built as a Turborepo monorepo. It offers a clean, modern interface where you can easily create, edit, label, and filter tasks. The app stays responsive and reliable behind the scenes, focusing on clarity, speed, and an effortless workflow to help you stay organized.

## Table of Contents

- [Live Services](#live-services)
- [Repository Structure](#repository-structure)
- [Tech Stack](#tech-stack)
- [High-Level Architecture](#high-level-architecture)
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Installation (Local Development)](#installation-local-development)
  - [Prerequisites](#prerequisites)
  - [1) Clone and install](#1-clone-and-install)
  - [2) Environment variables](#2-environment-variables)
  - [3) Database and Prisma](#3-database-and-prisma)
  - [4) Start development](#4-start-development)
- [Usage Guide](#usage-guide)
  - [Web app](#web-app)
  - [Monorepo scripts (root)](#monorepo-scripts-root)
- [Authors](#authors)

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
│  ├─ api/                     # Backend: Express + Prisma + Zod
│  │  ├─ src/
│  │  │  ├─ app.ts             # Express app wiring (CORS, cookies, routes)
│  │  │  ├─ index.ts           # Bootstraps server (PORT from env)
│  │  │  ├─ constants/env.ts   # Zod-validated environment variables
│  │  │  ├─ controllers/
│  │  │  │  ├─ auth/           # register, login, logout, oauth, verify
│  │  │  │  └─ tasks/          # getTasks, createTask, updateTask, deleteTask
│  │  │  ├─ lib/db.ts          # PrismaClient singleton
│  │  │  ├─ middlewares/       # authenticate (JWT via cookie)
│  │  │  └─ routes/            # /api/auth, /api/tasks
│  │  ├─ prisma/schema.prisma  # PostgreSQL models: User, Task, Label (M2M)
│  │  ├─ .env.sample           # API environment variables
│  │  └─ vercel.json
│  └─ web/                     # Frontend: Next.js + Tailwind + shadcn/ui
│     ├─ src/
│     │  ├─ app/               # App Router pages (landing, auth, dashboard)
│     │  ├─ components/        # UI primitives and providers
│     │  ├─ hooks/             # Notyf hook
│     │  └─ lib/               # apiFetch, auth helpers, utils
│     ├─ styles/globals.css
│     ├─ .env.sample           # Web environment variables
│     └─ vercel.json
├─ packages/
│  ├─ eslint-config/           # Shared ESLint configs
│  └─ typescript-config/       # Shared tsconfig base
├─ turbo.json                   # Turborepo pipeline (env passthrough)
├─ package.json                 # Monorepo scripts (Bun)
└─ bun.lock
```

<a id="tech-stack"></a>

## 🛠 Tech Stack

- Frontend: Next.js 15, React 19, Tailwind CSS, shadcn/ui, Radix UI, Lucide Icons, next-themes, Notyf
- Backend: Express.js 5, TypeScript, Zod (env validation), CORS, cookie-parser, bcryptjs, jsonwebtoken
- ORM/DB: Prisma, PostgreSQL
- Auth: JWT (httpOnly cookie-based sessions), Google OAuth (authorization code)
- Tooling/Infra: Turborepo, Bun, ESLint, Prettier, Vercel (web + api)

<a id="high-level-architecture"></a>

## 🧩 High-Level Architecture

```
   ┌─────────────┐          ┌───────────────────────┐           ┌─────────────────┐
   │   Next.js   │  fetch   │   Express API (Bun)   │  Prisma   │  PostgreSQL     │
   │   (Web)     ├─────────>│   /api/auth, /api/... ├──────────>│  (Tasks, Labels │
   │             │ cookies  │   JWT via cookies     │           │  Users)         │
   └─────────────┘          └───────────────────────┘           └─────────────────┘
                       ^                |
                       |                |
                 Google OAuth 2.0 <─────┘ (code exchange → JWT session)
```

- Sessions: JWT stored in `httpOnly` cookie `SessionToken` (1y expiry; `secure` + `sameSite` tuned by `NODE_ENV`)
- CORS: Restricted to `APP_ORIGIN` with credentials enabled
- Labels: Many-to-many between `Task` and `Label` (connect or create on write)

<a id="features"></a>

## 🚀 Features

- Authentication
  - Email + password (bcrypt)
  - Google OAuth (authorization code flow)
  - Session via `httpOnly` JWT cookie
- Task Management
  - Create, Read, Update, Delete
  - Labels (connect or create)
  - Created-at ordering
- Dashboard UX
  - Search, filter by priority/status, sort by date, pagination
  - Toast notifications (Notyf)
  - Dark/light theme (next-themes)
  - Responsive UI with shadcn/ui + Tailwind
- Developer Experience
  - Zod-validated runtime config
  - Turborepo-managed monorepo
  - Shared ESLint and TS configs
  - Bun for fast install and dev

<a id="api-endpoints"></a>

## 📡 API Endpoints

Base URL (local): `http://localhost:8080`  
All authenticated routes require a valid `SessionToken` cookie.

| Endpoint             | Method | Description                                   | Access                                 |
| -------------------- | ------ | --------------------------------------------- | -------------------------------------- |
| `/`                  | GET    | Health check (“Hello, World!”)                | Public                                 |
| `/api/auth/register` | POST   | Register a user (name, email, password)       | Public                                 |
| `/api/auth/login`    | POST   | Login (email, password) → sets cookie         | Public                                 |
| `/api/auth/oauth`    | POST   | Google OAuth code exchange → sets cookie      | Public                                 |
| `/api/auth/verify`   | GET    | Validate current session cookie               | Auth required (401 if missing/invalid) |
| `/api/auth/logout`   | DELETE | Clear session cookie                          | Public (clears if present)             |
| `/api/tasks`         | GET    | Get authenticated user’s tasks                | Auth required                          |
| `/api/tasks`         | POST   | Create task (title, priority, status, labels) | Auth required                          |
| `/api/tasks/:taskId` | PATCH  | Update task (title, priority, status, labels) | Auth required                          |
| `/api/tasks/:taskId` | DELETE | Delete task                                   | Auth required                          |

<a id="installation-local-development"></a>

## ⚙️ Installation (Local Development)

<a id="prerequisites"></a>

### Prerequisites

- Bun >= 1.0 (https://bun.sh)
- PostgreSQL (local or remote)

<a id="1-clone-and-install"></a>

### 1) Clone and install

```bash
git clone https://github.com/AvgBlank/Taskify.git
cd Taskify
bun install
```

<a id="2-environment-variables"></a>

### 2) Environment variables

Copy and edit per app:

apps/api/.env

```env
# Node environment
NODE_ENV=development

# Port to run API on
PORT=8080

# Frontend origin (for CORS)
APP_ORIGIN=http://localhost:3000

# PostgreSQL connection string
DATABASE_URL=postgres://username:password@localhost:5432/taskify

# JWT secret
JWT_SECRET="random-secret"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
REDIRECT_URI="http://localhost:3000/auth/callback"
```

apps/web/.env

```env
# Backend base URL
NEXT_PUBLIC_API_URL="http://localhost:8080"

# Google OAuth (must match API config)
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id"
NEXT_PUBLIC_REDIRECT_URI="http://localhost:3000/auth/callback"
```

<a id="3-database-and-prisma"></a>

### 3) Database and Prisma

Run from repository root:

```bash
bun run db:migrate:dev     # run dev migrations
```

Alternatively, within API app:

```bash
cd apps/api
bunx prisma migrate dev
```

<a id="4-start-development"></a>

### 4) Start development

- Start both apps using TurboRepo (from root):

```bash
bun run dev
```

- Or start individually:

```bash
# API
cd apps/api
bun run dev  # http://localhost:8080

# Web
cd apps/web
bun run dev  # http://localhost:3000
```

<a id="usage-guide"></a>

## 🧪 Usage Guide

<a id="web-app"></a>

### Web app

- Open http://localhost:3000
- Register or Login
- Optionally Continue with Google (OAuth — redirects to `/auth/callback`)
- Manage tasks in Dashboard (search/filter/sort/paginate; labels via space-separated input)

<a id="monorepo-scripts-root"></a>

### Monorepo scripts (root)

- `bun run dev` — Start all apps in dev
- `bun run build` — Build all
- `bun run start` — Start (after build)
- `bun run lint` / `bun run lint:fix` — Lint
- `bun run check-types` — Type-check
- `bun run format` — Prettier
- `bun run clean` — Clean outputs
- DB helpers: `bun run db:generate`, `bun run db:migrate:dev`, `bun run db:migrate:deploy`

<a id="authors"></a>

## 👥 Authors

- AvgBlank — https://github.com/AvgBlank
