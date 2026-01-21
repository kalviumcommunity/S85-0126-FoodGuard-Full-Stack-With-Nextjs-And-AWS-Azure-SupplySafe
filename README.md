# 🚆 Digital Food Traceability System (DFTS)
### *Indian Railway Catering Services*

---


## 📌 Overview
The **Digital Food Traceability System (DFTS)** is a full-stack web application designed to ensure **food safety, hygiene compliance, and accountability** across Indian Railway Catering Services.  
It provides **end-to-end digital traceability** of food items from **supplier → kitchen → transport → passenger**, enabling real-time monitoring, faster complaint resolution, and increased passenger trust.

---

## 📋 1. Problem Statement
Indian Railway Catering Services face persistent **food safety and hygiene complaints** due to the absence of a centralized digital traceability mechanism.

### Key Challenges
- **Manual Records:** Paper-based logs lead to data loss and human errors  
- **Untracked Suppliers:** Ingredient origins cannot be traced once cooking begins  
- **Delayed Resolution:** Passenger complaints cannot be mapped to specific food batches  


---

## 🎯 2. Project Objectives
The Digital Food Traceability System aims to:

- **Transparency:** Provide complete visibility of food origin and preparation  
- **Compliance:** Digitally enforce FSSAI hygiene standards  
- **Accountability:** Identify responsible suppliers, kitchens, and vendors  
- **Trust:** Improve passenger confidence using scannable QR-based verification  

---

## ⚙️ 3. Proposed Solution Overview
The system digitally tracks food across its entire lifecycle.

### Food Lifecycle Flow
1. **Supplier Onboarding** – Verified using FSSAI license and hygiene certificates  
2. **Ingredient Batching** – Unique batch IDs generated for raw materials  
3. **Kitchen Processing** – Cooking time, temperature, and hygiene logs recorded  
4. **Transportation** – GPS tracking with optional IoT sensor integration  
5. **Passenger Access** – QR code on meal box reveals complete food history  

---

## 🧩 4. Key System Components

### 4.1 Supplier Management
- Automated **FSSAI verification**
- **Geo-tagging** of kitchens and warehouses
- Supplier hygiene compliance tracking

### 4.2 QR Code Traceability
- **Dynamic QR codes** generated for every food packet
- Public scan interface showing:
  - Kitchen name and location  
  - Cooking timestamp and chef details  
  - Ingredient source information  

### 4.3 Real-Time Monitoring Dashboard
- Centralized dashboard for railway authorities
- Batch-level tracking and expiry monitoring
- Automated alerts for hygiene or compliance violations

### 4.4 Feedback & Compliance System
- One-click passenger complaint registration
- Complaints mapped directly to food batches
- AI-based vendor performance scoring

---

## 💻 5. Technology Stack

| Layer | Technology |
|------|-----------|
| **Frontend** | Next.js 15 (App Router), TypeScript |
| **UI / UX** | Tailwind CSS, Shadcn/UI, Lucide Icons |
| **Backend** | Next.js API Routes & Server Actions |
| **Database** | PostgreSQL with Prisma ORM |
| **DevOps** | GitHub Actions, AWS / Azure |
| **Utilities** | QR Code APIs, env-cmd |

---

## 🏗️ 6. Project Structure

```text
supplysafe/
├── src/
│   ├── app/
│   │   ├── (auth)/          # Authentication routes
│   │   ├── dashboard/       # Admin & supplier dashboards
│   │   ├── scan/            # QR scan result page
│   │   ├── api/             # API route handlers
│   │   └── layout.tsx       # Global layout
│   ├── components/          # Reusable UI components
│   ├── lib/                 # Prisma client & utilities
│   ├── services/            # Business logic & integrations
│   └── types/               # TypeScript types
├── prisma/
│   └── schema.prisma        # Database schema
├── public/                  # Static assets
├── .env.example             # Environment variables template
├── package.json
└── README.md

---

## 🧬 7. Prisma ORM Setup

### 🎯 Purpose
Prisma is used as the **Object Relational Mapping (ORM)** layer to:
- Provide **type-safe database queries**
- Keep the **database schema versioned** in code (`prisma/schema.prisma`)
- Generate a **typed Prisma Client** (`@prisma/client`) for use across the Next.js application

---

### ⚙️ Setup Steps
From the **project root directory**, run:

```bash
npm install
npx prisma generate


### Environment Variables
Set `DATABASE_URL` in your local env file (for example `.env.development`):
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/mydb"
```

### Schema
The schema lives in:
- `prisma/schema.prisma`

Example snippet:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  createdAt DateTime @default(now())
}
```

### Prisma Client Initialization
Prisma Client is initialized here:
- `src/lib/prisma.ts`

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

### Test Query / Verification
For a quick verification, the project includes a minimal API route:
- `GET /api/users` (file: `src/app/api/users/route.ts`)

After starting the app (`npm run dev`), visit:
- `http://localhost:3000/api/users`

If the DB is reachable and migrations are applied, you should see a JSON array response.

### Reflection
Prisma improves:
- Type safety: generated types for models and queries
- Query reliability: safer query construction and validation
- Productivity: faster iteration with schema-driven development

## 👥 Team Information

- **Madhav Garg**
- **Sanya Jain**
- **Nikunj Kohli**
