# Hostel Management System (Full-Stack)

A full-stack hostel management application built with Next.js, Prisma, and SQLite.

## Stack

- Next.js (App Router + TypeScript)
- Prisma ORM
- SQLite database
- Tailwind CSS

## Features

- Dashboard with occupancy and payment summary
- Room management (create/list/delete)
- Student management (create/list/delete + room assignment)
- Payment management (create/list/update status/delete)
- REST API routes for CRUD operations
- Seed script for sample data

## Setup

Install dependencies:

```bash
npm install
```

Create DB schema:

```bash
npm run db:push
```

Seed sample data:

```bash
npm run db:seed
```

Run development server:

```bash
npm run dev
```

Open http://localhost:3000

## Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Required variables:

- `DATABASE_URL`

## Deploy (Next.js)

This app is deployable as a standard Next.js app.

### Option 1: Vercel (recommended)

1. Push this repository to GitHub.
2. Import the repo in Vercel.
3. Add `DATABASE_URL` in **Project Settings → Environment Variables**.
4. Deploy.

### Option 2: Any Node host

Use:

- Build command: `npm run build`
- Start command: `npm start`

## Database Notes for Production

- Current Prisma datasource uses SQLite (`provider = "sqlite"`).
- SQLite file storage is usually not persistent on serverless platforms.
- For real production usage, switch Prisma datasource to a managed database (for example PostgreSQL), run a Prisma migration, and set `DATABASE_URL` to that database connection string.

## Pages

- `/` home
- `/dashboard`
- `/rooms`
- `/students`
- `/payments`

## API Endpoints

- `GET, POST /api/rooms`
- `GET, PATCH, DELETE /api/rooms/:id`
- `GET, POST /api/students`
- `GET, PATCH, DELETE /api/students/:id`
- `GET, POST /api/payments`
- `GET, PATCH, DELETE /api/payments/:id`
