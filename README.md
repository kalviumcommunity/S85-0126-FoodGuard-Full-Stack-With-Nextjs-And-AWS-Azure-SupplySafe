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

**Note (Prisma v7)**: Connection URLs are configured via `prisma.config.ts` (not via `url = env("DATABASE_URL")` inside `schema.prisma`).

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

---

## 🔄 API Response Format

FoodGuard implements a **Global API Response Handler** to ensure every API endpoint returns responses in a consistent, structured, and predictable format.

### Why Standardized Responses?

- ✅ **Consistency**: Every endpoint follows the same response structure
- 🐛 **Better Debugging**: Error codes and timestamps make troubleshooting easier
- 📊 **Observability**: Structured logs integrate seamlessly with monitoring tools
- 👥 **Developer Experience**: Predictable responses simplify frontend development
- 🔒 **Security**: Sensitive error details hidden in production

---

### Success Response

```json
{
  "success": true,
  "message": "Products fetched successfully",
  "data": [
    {
      "id": "clx1234567890",
      "name": "Organic Tomatoes",
      "category": "Vegetables",
      "price": 3.99,
      "unit": "lb",
      "inStock": true,
      "supplier": {
        "id": "clx0987654321",
        "name": "Fresh Farms Ltd",
        "verified": true
      }
    }
  ],
  "timestamp": "2026-01-21T10:30:00.000Z"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Product not found",
  "error": {
    "code": "E404_PRODUCT",
    "details": "No product exists with ID: clx1234567890"
  },
  "timestamp": "2026-01-21T10:30:00.000Z"
}
```

---

### Response Structure

| Field | Type | Description |
|-------|------|-------------|
| `success` | `boolean` | Indicates if the request was successful |
| `message` | `string` | Human-readable message describing the result |
| `data` | `any` | Response payload (only in success responses) |
| `error` | `object` | Error details (only in error responses) |
| `error.code` | `string` | Standardized error code for tracking and monitoring |
| `error.details` | `any` | Additional error context (only in development mode) |
| `timestamp` | `string` | ISO 8601 timestamp of when the response was generated |

---

### Error Codes Reference

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `E001` | Validation Error | 400 |
| `E002` | Missing Required Field | 400 |
| `E003` | Invalid Input | 400 |
| `E004` | Invalid Email | 400 |
| `E006` | Invalid Price | 400 |
| `E007` | Invalid Quantity | 400 |
| `E404` | Resource Not Found | 404 |
| `E404_USER` | User Not Found | 404 |
| `E404_PRODUCT` | Product Not Found | 404 |
| `E404_ORDER` | Order Not Found | 404 |
| `E404_SUPPLIER` | Supplier Not Found | 404 |
| `E401` | Unauthorized | 401 |
| `E403` | Forbidden | 403 |
| `E403_SUPPLIER` | Supplier Not Verified | 403 |
| `E409` | Duplicate Entry | 409 |
| `E409_EMAIL` | Duplicate Email | 409 |
| `E400_OUT_STOCK` | Product Out of Stock | 400 |
| `E503` | Database Error | 503 |
| `E500` | Internal Server Error | 500 |

---

### API Endpoints

#### 👥 Users

**GET** `/api/users`
```typescript
Response: { success: true, data: User[], message: "Successfully fetched N users" }
```

**POST** `/api/users`
```typescript
Request: { name, email, password, role? }
Response: { success: true, data: User, message: "User created successfully" }
```

**GET** `/api/users/:id`
```typescript
Response: { success: true, data: User, message: "User fetched successfully" }
```

**PUT** `/api/users/:id`
```typescript
Request: { name?, email?, role? }
Response: { success: true, data: User, message: "User updated successfully" }
```

---

## ✅ Input Validation with Zod (Kalvium)

FoodGuard validates **all POST/PUT request bodies** using **Zod** before running business logic or writing to the database.

### Shared Schemas

- `src/lib/schemas/userSchema.ts`
- `src/lib/schemas/supplierSchema.ts`
- `src/lib/schemas/productSchema.ts`
- `src/lib/schemas/orderSchema.ts`

### Error Handling

If validation fails, APIs return a structured 400 response using the global response handler:

- `code`: `E001` (`ERROR_CODES.VALIDATION_ERROR`)
- `details`: array of `{ field, message }` (only in development mode)

### Quick Tests

✅ Passing example (create user):

```bash
curl -X POST http://localhost:3000/api/users ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Alice\",\"email\":\"alice@example.com\",\"password\":\"password123\",\"role\":\"USER\"}"
```

❌ Failing example (invalid email + short name):

```bash
curl -X POST http://localhost:3000/api/users ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"A\",\"email\":\"bademail\",\"password\":\"password123\"}"
```

### Reflection

Zod protects the backend by rejecting malformed or missing fields **before** any database call happens, and it improves collaboration by providing consistent, field-level error messages that frontend developers can fix immediately.

**DELETE** `/api/users/:id`
```typescript
Response: { success: true, data: { id }, message: "User deleted successfully" }
```

#### 📦 Products

**GET** `/api/products?category=Vegetables&inStock=true&supplierId=xxx`
```typescript
Response: { success: true, data: Product[], message: "Successfully fetched N products" }
```

**POST** `/api/products`
```typescript
Request: { name, description?, category?, price, unit, supplierId, inStock?, imageUrl? }
Response: { success: true, data: Product, message: "Product created successfully" }
```

#### 🛒 Orders

**GET** `/api/orders?userId=xxx&status=PENDING`
```typescript
Response: { success: true, data: Order[], message: "Successfully fetched N orders" }
```

**POST** `/api/orders`
```typescript
Request: { userId, items: [{ productId, quantity }], deliveryDate?, notes? }
Response: { success: true, data: Order, message: "Order created successfully" }
```

#### 🏪 Suppliers

**GET** `/api/suppliers?verified=true`
```typescript
Response: { success: true, data: Supplier[], message: "Successfully fetched N suppliers" }
```

**POST** `/api/suppliers`
```typescript
Request: { name, email, phone?, address?, description?, userId }
Response: { success: true, data: Supplier, message: "Supplier created successfully" }
```

---

### Usage Example

```typescript
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";

export async function GET() {
  try {
    const data = await fetchData();
    return sendSuccess(data, "Data fetched successfully");
  } catch (error) {
    return sendError(
      "Failed to fetch data",
      ERROR_CODES.DATABASE_ERROR,
      500,
      error
    );
  }
}
```

---

### Frontend Integration

```typescript
async function fetchProducts() {
  const response = await fetch('/api/products');
  const result = await response.json();
  
  if (result.success) {
    console.log(result.data);
    console.log(result.message);
  } else {
    console.error(result.error.code);
    console.error(result.message);
  }
}
```

---

## 👥 Team Information

- **Madhav Garg**
- **Sanya Jain**
- **Nikunj Kohli**
