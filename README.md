# 🌉 Skill Bridge API

Backend service for the **Skill Bridge** platform — built with **Node.js**, **Express**, **Prisma**, **PostgreSQL**, and **TypeScript**.
This API handles authentication, project management, collaboration, and user data.

---

## 🚀 Tech Stack

* ⚙️ Node.js
* 🚏 Express.js
* 🧠 Prisma ORM
* 🐘 PostgreSQL
* 🔷 TypeScript
* 🔐 JWT Authentication
* 🥟 Bun Runtime

---

## 📌 Features

* 🔐 User Authentication & Authorization (JWT)
* 👤 User Profile Management
* 📁 Project CRUD Operations
* 🤝 Collaboration System
* 🔍 Search & Filtering
* 📊 Dashboard Data APIs
* ⚡ Scalable & Modular Architecture

---

## ⚙️ Setup & Installation (Bun)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/mahmud-reza-rafsun/skill-bridge-back-end
cd skill-bridge-backend
```

---

### 2️⃣ Install Dependencies

```bash
bun install
```

---

### 3️⃣ Setup Environment Variables

Create a `.env` file in the root:

```env
PORT=5000
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/skill_bridge"
JWT_SECRET=your_secret_key
```

---

### 4️⃣ Prisma Setup (Bun)

```bash
bun prisma generate
bun prisma migrate dev
```

---

### 5️⃣ Run the Server

```bash
bun dev
```

Server will run on:

```
http://localhost:5000
```

---

## 📡 API Endpoints (Sample)

### 🔐 Auth

```
POST   /api/auth/register
POST   /api/auth/login
```

### 👤 User

```
GET    /api/users
GET    /api/users/:id
PATCH  /api/users/:id
```

### 📁 Projects

```
POST   /api/projects
GET    /api/projects
GET    /api/projects/:id
PATCH  /api/projects/:id
DELETE /api/projects/:id
```

### 🤝 Collaboration

```
POST   /api/collaborations
GET    /api/collaborations
```

---

## 🧠 Prisma Commands (Bun)

```bash
bun prisma generate
bun prisma migrate dev
```

---

## 🔗 Custom Scripts (Bun)

```bash
bun generate
bun migrate dev
bun stripe:webhook
bun dev
```

---

## 🔐 Authentication Flow

* User registers → password is hashed
* User logs in → receives JWT token
* Protected routes → require:

```
Authorization: Bearer <token>
```

---

## ⚠️ Error Handling

* Centralized error middleware
* Proper HTTP status codes
* Validation using Zod or custom validators

---

## 🌍 Deployment

* Use **VPS / Railway / Render**
* Set environment variables
* Run:

```bash
bun install
bun prisma generate
bun dev
```

---

## 👨‍💻 Author

**Rafsun Ahmed**
Full Stack Developer

---

## 📜 License

This project is licensed under the MIT License.
