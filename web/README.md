# 📝 Taskify - Task Management Application

## Overview

Taskify is a modern task management application designed to help users efficiently organize and track their tasks. Built with a robust backend powered by Next.js, PostgreSQL, and Prisma ORM, Taskify offers a seamless experience for managing daily to-dos, project tasks, and more. The application emphasizes practicality, usability, and reliability, enabling users to handle their tasks with ease.

## Live Preview

Experience Taskify in action by visiting the live application hosted on Vercel: [https://taskify-beta-ten.vercel.app](https://taskify-beta-ten.vercel.app)

## Setting up with Docker

### Prerequisites

Ensure you have Docker installed on your system.

- **[Docker](https://www.docker.com/)**: Download and install Docker.

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/AvgBlank/Taskify.git
   cd Taskify
   ```

2. **Set up environment variables**

   - Create a `.env` file in the root directory and add the following variables:
     ```env
     NEXT_PUBLIC_SESSION_SECRET="your_random_secret"
     NEXT_PUBLIC_GOOGLE_CLIENT_ID="your_google_client_id"
     NEXT_PUBLIC_GOOGLE_CLIENT_SECRET="your_google_client_secret"
     NEXT_PUBLIC_REDIRECT_URI="http://localhost:3000/api/users/oauth"
     ```

3. **Run the containers**

   - Start the PostgreSQL and Next.js server using Docker Compose:
     ```bash
     docker-compose up --build -d
     ```

4. **Open your browser**

   - Navigate to `http://localhost:3000/` to see the application running.

---

## Setting up Locally (without Docker)

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js**: [Download and install Node.js](https://nodejs.org/)
- **PostgreSQL**: [Download and install PostgreSQL](https://www.postgresql.org/download/)

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/AvgBlank/Taskify.git
   cd Taskify
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   - Create a `.env` file and add the following variables:
     ```env
     NEXT_PUBLIC_DATABASE_URL="PostgreSQL database URL"
     NEXT_PUBLIC_SESSION_SECRET="Randomly Generated Key"
     NEXT_PUBLIC_GOOGLE_CLIENT_ID="Google Client ID"
     NEXT_PUBLIC_GOOGLE_CLIENT_SECRET="Google Client Secret"
     NEXT_PUBLIC_REDIRECT_URI="http://localhost:3000/api/users/oauth"
     ```

4. **Initialize the database**

   - Run the following command to apply the Prisma schema to your PostgreSQL database:

     ```bash
     npx prisma migrate dev --name init
     ```

   - You may have to run the following command to generate the Prisma client in case you get any errors:
     ```bash
     npx prisma generate
     ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**

   - Navigate to `http://localhost:3000/` to see the application running locally.

---

## Tech Stack

- **[Next.js](https://nextjs.org/)**: A React framework for building fast and user-friendly web applications.
- **[TypeScript](https://www.typescriptlang.org/)**: A strongly typed programming language that builds on JavaScript.
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework for styling the application.
- **[PostgreSQL](https://www.postgresql.org/)**: A powerful, open-source relational database system.
- **[Prisma ORM](https://www.prisma.io/)**: A next-generation ORM for Node.js and TypeScript.

### Libraries and Tools Used

- **[bcrypt](https://www.npmjs.com/package/bcrypt)**: For hashing and securing user passwords.
- **[JWT (jsonwebtoken)](https://www.npmjs.com/package/jsonwebtoken)**: Used for authentication and secure user sessions.
- **[ShadCN](https://ui.shadcn.com/)**: Pre-built UI components styled with Tailwind CSS.
- **[Radix UI](https://www.radix-ui.com/)**: Accessible UI components for dropdowns, select inputs, and more.
- **[Lucide React](https://lucide.dev/)**: Icon library used for UI elements.
- **[Notyf](https://www.npmjs.com/package/notyf)**: Lightweight notification system for alerts.

For more details, refer to the `package.json` file in the repository.
