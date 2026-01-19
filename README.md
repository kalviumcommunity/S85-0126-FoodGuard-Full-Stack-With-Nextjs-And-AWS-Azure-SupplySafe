# 🚆 Digital Food Traceability System (DFTS)
### *Indian Railway Catering Services*

---

## 📋 1. Problem Statement
Indian Railway Catering Services face persistent **food safety and hygiene complaints** due to the absence of a digital traceability mechanism. 
* **Manual Records:** Reliance on paper-based logs leads to errors.
* **Untracked Suppliers:** Difficult to trace raw material origins once cooked.
* **Delayed Resolution:** No real-time mapping between a passenger complaint and a specific food batch.

---

## 🎯 2. Project Objective
To design a **digital, end-to-end food traceability and compliance system** that ensures:
* **Transparency:** Complete visibility from supplier to the passenger's plate.
* **Compliance:** Digital monitoring of FSSAI standards.
* **Accountability:** Precise identification of responsible vendors/kitchens.
* **Trust:** Improved passenger confidence via scannable QR verification.

---

## ⚙️ 3. Proposed Solution Overview
The system digitally tracks food across its entire lifecycle:

**Lifecycle Flow:**
1. **Supplier:** Onboarded with verified FSSAI credentials.
2. **Ingredient Batch:** Unique IDs generated for raw materials.
3. **Kitchen:** Cooking time, temperature, and hygiene logs recorded.
4. **Transport:** GPS and (optional) IoT sensor tracking.
5. **Passenger:** QR code on the meal box provides full history.

---

## 🧩 4. Key System Components

### 4.1 Supplier Management
* **Verification:** Automated FSSAI license and hygiene certificate verification.
* **Geo-tagging:** Location tracking of base kitchens and warehouses.

### 4.2 QR Code Traceability
* **Dynamic QR Generation:** Attached to every food packet.
* **Public Portal:** Passengers scan to see:
    - Kitchen Name & Location
    - Chef details & Cooking timestamp
    - Origin of major ingredients (e.g., Rice, Flour)

### 4.3 Real-Time Dashboard
* **Authority View:** Centralized monitoring for Railway Officials.
* **Alert System:** Notifies if a batch exceeds expiry or fails a hygiene check.

### 4.4 Feedback & Compliance
* **Integrated Complaints:** One-click feedback mapped to the exact meal batch.
* **Performance Scores:** AI-driven vendor rankings based on audit results and feedback.

---

## 💻 5. Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 15 (App Router), TypeScript |
| **UI/UX** | Tailwind CSS, Lucide Icons, Shadcn/UI |
| **Backend** | Node.js / Next.js Server Actions |
| **Database** | PostgreSQL (Prisma ORM) |
| **DevOps** | GitHub Actions, AWS/Azure |
| **Tools** | QR Code API, env-cmd (Environment Management) |

---

## 🏗️ 6. Project Structure (Next.js)

```text
supplysafe/
├── src/
│   ├── app/                # Next.js Routes & Pages
│   │   ├── (auth)/         # Login/Signup routes
│   │   ├── dashboard/      # Admin & Supplier dashboards
│   │   ├── scan/           # QR code scan results page
│   │   └── layout.tsx      # Main layout
│   ├── components/         # Reusable UI (Cards, Forms, Nav)
│   ├── lib/                # Database (Prisma) & Shared Utils
│   ├── services/           # API Logic & Third-party integrations
│   └── types/              # TypeScript Interfaces
├── public/                 # Static Assets & Icons
├── .env.example            # Environment variables template
├── package.json            # Scripts & Dependencies
└── README.md               # Project Documentation






# 2.13

## 1. Project Overview

This project uses **PostgreSQL** as the relational database and **Prisma ORM** for data modeling and migrations.

The database is designed to support:

* **Scalability** — can handle growth in users, projects, and tasks.
* **Consistency** — ensures no duplicate or inconsistent data.
* **Efficient querying** — optimized with indexes on frequently queried fields.

The database schema follows **3NF (Third Normal Form)** to avoid redundancy and maintain data integrity.

---

## 2. Core Entities

| Entity      | Description                                   |
| ----------- | --------------------------------------------- |
| **User**    | Represents registered users or team members.  |
| **Project** | Represents ongoing or completed projects.     |
| **Task**    | Represents individual tasks within a project. |
| **Comment** | Comments associated with tasks.               |
| **Team**    | Teams that users belong to.                   |

---

## 3. Relational Schema (Prisma Example)

```prisma
model User {
  id        Int       @id @default(autoincrement())
  name      String
  email     String    @unique
  createdAt DateTime  @default(now())
  projects  Project[]
  tasks     Task[]    @relation("AssignedTasks")
}

model Project {
  id          Int       @id @default(autoincrement())
  name        String
  description String?
  createdAt   DateTime  @default(now())
  userId      Int
  user        User      @relation(fields: [userId], references: [id])
  tasks       Task[]
}

model Task {
  id          Int       @id @default(autoincrement())
  title       String
  description String?
  status      String    @default("pending")
  projectId   Int
  project     Project   @relation(fields: [projectId], references: [id])
  assignedTo  Int?
  assignee    User?     @relation("AssignedTasks", fields: [assignedTo], references: [id])
  comments    Comment[]
}

model Comment {
  id        Int      @id @default(autoincrement())
  content   String
  createdAt DateTime @default(now())
  taskId    Int
  task      Task     @relation(fields: [taskId], references: [id])
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
}

model Team {
  id       Int     @id @default(autoincrement())
  name     String
  users    User[]  @relation(references: [id])
}
```

---

## 4. Keys, Constraints & Relationships

* **Primary Keys (PK):**

  * `id` in all tables uniquely identifies each record.

* **Foreign Keys (FK):**

  * `Project.userId → User.id`
  * `Task.projectId → Project.id`
  * `Task.assignedTo → User.id`
  * `Comment.taskId → Task.id`
  * `Comment.userId → User.id`

* **Constraints:**

  * `email` in User is **UNIQUE**.
  * Mandatory fields are **NOT NULL**.
  * `ON DELETE CASCADE` applied where appropriate to maintain referential integrity.

* **Indexes:**

  * Automatically added for PKs.
  * Additional indexes can be created on frequently queried fields like `Task.status` or `Project.userId`.

---

## 5. Normalization

* **1NF (First Normal Form):** All attributes are atomic; no repeating groups.
* **2NF (Second Normal Form):** All non-key attributes fully depend on the primary key.
* **3NF (Third Normal Form):** No transitive dependencies exist between non-key attributes.

---

## 6. Applying Migrations

To create tables in PostgreSQL using Prisma:

```bash
npx prisma migrate dev --name init_schema
```

Verify created tables:

```bash
npx prisma studio
```

---

## 7. Seed Data

Insert sample records for testing:

```ts
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: { name: "Alice", email: "alice@example.com" }
  });

  const project = await prisma.project.create({
    data: { name: "Project A", userId: user.id }
  });

  const task = await prisma.task.create({
    data: { title: "Task 1", projectId: project.id, status: "pending" }
  });

  console.log({ user, project, task });
}

main()
  .catch(e => console.error(e))
  .finally(async () => { await prisma.$disconnect() });
```

---

## 8. Reflections

* **Scalability:**
  The schema supports adding new users, projects, and tasks without redesign. Relationships are modular, allowing flexible queries.

* **Common Queries Supported Efficiently:**

  * Fetch all projects for a user.
  * Fetch all tasks in a project.
  * Fetch all comments for a task.
  * Fetch tasks assigned to a specific user.

* **Normalization Benefits:**
  Reduces data redundancy, avoids inconsistencies, and simplifies updates and deletions.

---

## 9. Resources

* [PostgreSQL Table Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)
* [PostgreSQL Indexes](https://www.postgresql.org/docs/current/indexes.html)
* [Prisma Schema Reference](https://www.prisma.io/docs/concepts/components/prisma-schema)
* [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)
* [Database Normalization Basics](https://learn.microsoft.com/en-us/sql/relational-databases/database-normalization)


