# 🎓 Skill Bridge — Backend API

> RESTful API powering the Skill Bridge tutoring platform — managing authentication, tutor profiles, session booking, availability scheduling, and post-session payments.

---

## 🎯 Problem Statement

A robust backend is required to support a **multi-role tutoring marketplace** with complex session state management, availability scheduling, and a secure payment flow that triggers only after session completion.

---

## 💡 Solution Overview

This Express.js API provides:
- Secure **JWT-based authentication** with BetterAuth for three user roles
- **Tutor profile and availability management**
- **Session booking lifecycle** (Pending → Confirmed → Completed)
- **Post-completion payment processing**
- PostgreSQL persistence via **Prisma ORM**

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js with Bun |
| Framework | Express.js |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | BetterAuth + JWT |
| Language | TypeScript |

---

## ✨ Key Features

- 🔐 **BetterAuth + JWT** — Secure auth with role-scoped token claims
- 👥 **Three-Role RBAC** — Admin, Tutor, and Student permission layers
- 👨‍🏫 **Tutor Profile API** — Create and update tutor profiles with subjects and rates
- 🗓️ **Availability System** — Tutors define available time slots per day
- 📅 **Booking Engine** — Students book from tutor's available slots
- ✅ **Session State Machine** — Manage session lifecycle: Pending → Confirmed → Completed
- 💳 **Payment After Completion** — Payment records created only on session completion
- 🛡️ **Route Guards** — Middleware-enforced auth and role checks

---

## 🚀 Live API

🔗 **Base URL:** `https://your-backend-api.com/api`

---

## ⚙️ Setup Instructions

### Prerequisites

- [Bun](https://bun.sh/) installed
- PostgreSQL database (local or hosted, e.g., Supabase / Neon)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/skill-bridge-backend.git
cd skill-bridge-backend

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env

# Run database migrations
bunx prisma migrate dev

# Seed the database (optional)
bunx prisma db seed

# Start development server
bun dev
```

API will run at `http://localhost:5000`

---

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/skill_bridge

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# BetterAuth
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:5000

# CORS
CLIENT_URL=http://localhost:3000
```

> ⚠️ Never commit `.env` to version control.

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register (student/tutor) | Public |
| POST | `/api/auth/login` | Login and get JWT | Public |
| POST | `/api/auth/logout` | Logout session | Auth |
| GET | `/api/auth/me` | Get current user | Auth |

### Tutor Profiles

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/tutors` | List all tutors | Public |
| GET | `/api/tutors/:id` | Get tutor profile | Public |
| POST | `/api/tutors/profile` | Create tutor profile | Tutor |
| PUT | `/api/tutors/profile` | Update tutor profile | Tutor |

### Availability

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/tutors/:id/availability` | Get tutor availability | Public |
| POST | `/api/availability` | Set availability slots | Tutor |
| PUT | `/api/availability/:id` | Update slot | Tutor |
| DELETE | `/api/availability/:id` | Remove slot | Tutor |

### Sessions (Bookings)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/sessions` | Book a session | Student |
| GET | `/api/sessions/my` | Get user's sessions | Auth |
| PATCH | `/api/sessions/:id/confirm` | Confirm booking | Tutor |
| PATCH | `/api/sessions/:id/complete` | Mark as completed | Tutor |
| PATCH | `/api/sessions/:id/cancel` | Cancel session | Auth |
| GET | `/api/sessions` | Get all sessions | Admin |

### Payments

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/payments` | Pay for completed session | Student |
| GET | `/api/payments/my` | Get user's payment history | Auth |
| GET | `/api/payments` | Get all payments | Admin |

### Admin

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/admin/users` | Get all users | Admin |
| PATCH | `/api/admin/users/:id/role` | Update user role | Admin |
| DELETE | `/api/admin/users/:id` | Delete user | Admin |

---

## 🗂️ Project Structure

```
skill-bridge-backend/
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── migrations/         # Migration history
│   └── seed.ts             # Seed data
├── src/
│   ├── config/             # App & DB config
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   └── role.middleware.ts
│   ├── modules/
│   │   ├── auth/
│   │   ├── tutors/
│   │   ├── availability/
│   │   ├── sessions/
│   │   └── payments/
│   ├── utils/              # Helper utilities
│   └── index.ts            # Entry point
└── package.json
```

---

## 🗄️ Database Schema Overview

```prisma
model User {
  id           String    @id @default(cuid())
  email        String    @unique
  password     String
  role         Role      @default(STUDENT)
  tutorProfile TutorProfile?
  sessionsAsStudent Session[] @relation("StudentSessions")
  sessionsAsTutor   Session[] @relation("TutorSessions")
  payments     Payment[]
  createdAt    DateTime  @default(now())
}

model TutorProfile {
  id           String    @id @default(cuid())
  tutor        User      @relation(fields: [tutorId], references: [id])
  tutorId      String    @unique
  bio          String
  subjects     String[]
  hourlyRate   Float
  availability Availability[]
}

model Availability {
  id        String       @id @default(cuid())
  profile   TutorProfile @relation(fields: [profileId], references: [id])
  profileId String
  dayOfWeek Int          # 0 = Sunday, 6 = Saturday
  startTime String       # "09:00"
  endTime   String       # "17:00"
}

model Session {
  id        String        @id @default(cuid())
  student   User          @relation("StudentSessions", fields: [studentId], references: [id])
  studentId String
  tutor     User          @relation("TutorSessions", fields: [tutorId], references: [id])
  tutorId   String
  status    SessionStatus @default(PENDING)
  date      DateTime
  payment   Payment?
  createdAt DateTime      @default(now())
}

model Payment {
  id        String   @id @default(cuid())
  session   Session  @relation(fields: [sessionId], references: [id])
  sessionId String   @unique
  payer     User     @relation(fields: [payerId], references: [id])
  payerId   String
  amount    Float
  createdAt DateTime @default(now())
}

enum Role {
  ADMIN
  TUTOR
  STUDENT
}

enum SessionStatus {
  PENDING
  CONFIRMED
  COMPLETED
  CANCELLED
}
```

---

## 🔗 Related Repository

- **Frontend:** [skill-bridge-frontend](https://github.com/your-username/skill-bridge-frontend)

---

## 📄 License

This project is licensed under the MIT License.
