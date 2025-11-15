# 📝 Taskify – Organize and Manage Your Tasks

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Frontend](https://img.shields.io/badge/frontend-Next.js-blue)
![Backend](https://img.shields.io/badge/backend-Express.js-green)
![Database](https://img.shields.io/badge/database-PostgreSQL-lightgrey)
![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma)
![Auth](https://img.shields.io/badge/auth-JWT-orange)
![TypeScript](https://img.shields.io/badge/language-TypeScript-3178C6)

A modern, full-stack task-management application designed for creating, organizing and tracking tasks.  
Taskify is built as a monorepo with a fully typed Next.js frontend and an Express.js backend powered by Prisma + PostgreSQL.

## 📌 Live Services

| **Layer** | **Platform** | **Link**                              |
| --------- | ------------ | ------------------------------------- |
| Frontend  | Vercel       | https://taskify-web-rho.vercel.app    |
| Backend   | Vercel       | https://taskify-server-psi.vercel.app |
| Database  | NeonDB       | PostgreSQL hosted on Neon.tech        |

## 📁 Repository Structure

```
Taskify/
├─ server/        # Backend (Express.js, TypeScript, Prisma)
├─ web/           # Frontend (Next.js, TypeScript, Tailwind)
├─ package.json
└─ README.md
```

# 🛠 Tech Stack

| **Layer**          | **Technologies**                                                    |
| ------------------ | ------------------------------------------------------------------- |
| **Frontend**       | Next.js, React, Tailwind CSS, ShadCN, Radix UI, Lucide Icons, Notyf |
| **Backend**        | Express.js, TypeScript, Zod, Prisma ORM                             |
| **Database**       | PostgreSQL (Neon)                                                   |
| **Authentication** | JWT-based login/signup + Google OAuth integration                   |
| **Hosting**        | Vercel (frontend), Vercel (backend), NeonDB (database)              |

# 🧩 Architecture Diagram

#### **High-Level Flow**

```
    ┌────────────────┐         ┌───────────────────┐          ┌──────────────────────┐
    │   Frontend     │  API    │    Backend API    │  Prisma  │    PostgreSQL (Neon) │
    │   Next.js      ├────────>│  Express + TS     ├─────────>│   Taskify Database   │
    └────────────────┘         └───────────────────┘          └──────────────────────┘
```

# 🚀 Features

- User Authentication with JWT based tokens & sessions
  - Email + Password
  - Google OAuth
- Task Management CRUD (Create, Read, Update, Delete)
- Pagination, Filtering, Searching, Sorting
- Responsive UI with modern components
- Prisma-powered PostgreSQL data management
- Toast notifications with Notyf

# 📡 API Endpoints

| **Endpoint**       | **Method** | **Description**           | **Access**    |
| ------------------ | ---------- | ------------------------- | ------------- |
| /api/auth/register | POST       | Register a new user       | Public        |
| /api/auth/login    | POST       | Log in user & return JWT  | Public        |
| /api/auth/oauth    | POST       | Handle Google OAuth token | Public        |
| /api/tasks         | GET        | Get all tasks             | Authenticated |
| /api/tasks         | POST       | Create a new task         | Authenticated |
| /api/tasks/:id     | PATCH      | Update existing task      | Authenticated |
| /api/tasks/:id     | DELETE     | Delete a task             | Authenticated |

# ⚙️ Quickstart (Local Development)

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/AvgBlank/Taskify.git
cd Taskify
```

# 🔧 Backend Setup (`/server`)

## 2️⃣ Install Dependencies

```bash
cd server
npm install
```

## 3️⃣ Create Environment Variables

Create `.env` in **server**:

```env
PORT=4000
APP_ORIGIN=http://localhost:3000

DATABASE_URL="postgresql://username:password@localhost:5432/taskify"

JWT_SECRET="your_random_secret_key"

GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

REDIRECT_URI="http://localhost:3000/auth/callback"
```

## 4️⃣ Setup Prisma + Database

```bash
npx prisma migrate deploy
npx prisma generate
```

## 5️⃣ Run Backend

```bash
npm run dev
```

Backend →
👉 [http://localhost:4000](http://localhost:4000)

# 🎨 Frontend Setup (`/web`)

## 6️⃣ Install Dependencies

```bash
cd web
npm install
```

## 7️⃣ Create Environment Variables

```env
NEXT_PUBLIC_API_URL="http://localhost:4000"

NEXT_PUBLIC_GOOGLE_CLIENT_ID="your_google_client_id"
NEXT_PUBLIC_REDIRECT_URI="http://localhost:3000/auth/callback"
```

## 8️⃣ Run Frontend

```bash
npm run dev
```

Open the app:
👉 [http://localhost:3000](http://localhost:3000)

---
