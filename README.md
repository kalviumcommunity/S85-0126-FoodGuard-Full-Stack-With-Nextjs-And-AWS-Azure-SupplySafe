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

---

## 🧬 7. Prisma ORM Setup

### Purpose
Prisma is used as the ORM layer to:
- Provide type-safe database queries
- Keep the database schema versioned in code (`prisma/schema.prisma`)
- Generate a typed client (`@prisma/client`) for use in the Next.js app

### Setup Steps
From the project root:
```bash
npm install
npx prisma generate
```

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
