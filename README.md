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
