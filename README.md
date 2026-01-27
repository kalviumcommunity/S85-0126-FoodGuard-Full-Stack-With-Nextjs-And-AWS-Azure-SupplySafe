# 🚆 Digital Food Traceability System (DFTS)
### *Indian Railway Catering Services*

[![Next.js](https://img.shields.io/badge/Next.js-16.1.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)


---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/your-org/supplysafe.git
cd supplysafe

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run database migrations
npx prisma migrate dev

# Seed the database (optional)
npx prisma db seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ✨ Features

### Core Functionality
- 🔐 **Authentication** - JWT-based auth with cookie sessions
- 📊 **Real-time Dashboard** - Monitor food batches, hygiene scores, and alerts
- 📦 **Batch Tracking** - End-to-end traceability from supplier to passenger
- 📱 **QR Code Scanning** - Passengers can verify food origin instantly
- 🔔 **Alert System** - Automated notifications for compliance violations

### Technical Highlights
- ⚡ **Server Components** - Leverages Next.js 16 App Router for optimal performance
- 🎨 **Modern UI** - Built with Tailwind CSS, Shadcn/UI, and Lucide icons
- 🗄️ **Type-safe Database** - Prisma ORM with PostgreSQL
- 🔄 **Context Management** - React Context for auth and UI state
- 📱 **Responsive Design** - Mobile-first approach for all screen sizes

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
```

---

## 🧭 Page Routing and Dynamic Routes (App Router)

SupplySafe uses the **Next.js App Router** for file-based routing, with **public**, **protected**, and **dynamic** routes.

### Route map

| Route | Type | Auth | Description |
|-------|------|------|-------------|
| `/` | Public | — | Home |
| `/login` | Public | — | Login (email/password); sets JWT in `token` cookie |
| `/about` | Public | — | About (SSG) |
| `/news` | Public | — | News (ISR) |
| `/dashboard` | Protected | Cookie | Dashboard (SSR); requires valid `token` cookie |
| `/users` | Protected | Cookie | Users list |
| `/users/[id]` | Protected | Cookie | User profile (dynamic); breadcrumbs: Home › Users › *name* |
| — | — | — | **404:** `app/not-found.tsx` |

### Middleware (page protection)

Protected **page** routes (`/dashboard`, `/users`, `/users/[id]`) use **cookie-based** JWT auth:

- **Cookie:** `token` (JWT from `/api/auth/login`).
- **No or invalid token** → redirect to `/login?from=<pathname>`.
- **Valid token** → `NextResponse.next()`.

Middleware runs on:

```ts
// config.matcher
["/dashboard", "/dashboard/:path*", "/users", "/users/:path*", ...]
```

### Public pages

- **`app/page.tsx`** — Home; links to About, Dashboard, News, API.
- **`app/login/page.tsx`** — Client form; `POST /api/auth/login` → set `token` cookie → redirect to `from` or `/dashboard`.

### Protected pages

- **`app/dashboard/page.tsx`** — SSR dashboard; fetches `/api/users`, `/api/products`, etc. with `Cookie` forwarded.
- **`app/users/page.tsx`** — Users list; fetches `/api/users` with `Cookie`.
- **`app/users/[id]/page.tsx`** — Dynamic user profile; fetches `/api/users/:id`, uses `notFound()` if missing; breadcrumbs: **Home › Users › {name}**.

### Dynamic routes

- **`app/users/[id]/page.tsx`** — `params` is a `Promise<{ id: string }>` (Next.js 15+). Example: `/users/1`, `/users/<uuid>`.

### Layout and navigation

- **`app/layout.tsx`** — Global layout with nav: Home, Login, Dashboard, Users, User 1, About, News.

### Custom 404

- **`app/not-found.tsx`** — Custom 404 UI and “Back to Home” link.

### Code snippets

**Middleware (protected pages, cookie check):**

```ts
if (isProtectedPage(pathname)) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }
  try {
    await verifyToken(token);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(loginUrl);
  }
}
```

**Dynamic route (`app/users/[id]/page.tsx`):**

```ts
type Props = { params: Promise<{ id: string }> };

export default async function UserProfilePage({ params }: Props) {
  const { id } = await params;
  const user = await getUser(id);  // fetch /api/users/:id with cookie
  if (!user) notFound();
  return (
    <>
      <nav aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <Link href="/users">Users</Link> / {user.name}
      </nav>
      <h1>User Profile</h1>
      ...
    </>
  );
}
```

### Reflection

- **Dynamic routing and scalability:** `[id]` supports arbitrary user IDs (UUIDs or numeric) without new files; same component and data-fetch pattern.
- **SEO:** Descriptive URLs (`/users/123`), breadcrumbs, and semantic markup improve crawlability and clarity.
- **Breadcrumbs and UX:** Home › Users › *name* clarifies context and supports back-navigation.
- **Error handling:** `notFound()` for missing users returns the custom 404; protected routes redirect to `/login` with `from` for post-login redirect.

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


## 🔐 Authorization Middleware (RBAC)

FoodGuard implements **Role-Based Access Control (RBAC)** through authorization middleware that protects API routes based on user roles and validates JWT tokens.

### Authentication vs Authorization

| Concept | Description | Example |
|---------|-------------|---------|
| **Authentication** | Confirms who the user is | User logs in with valid credentials |
| **Authorization** | Determines what actions they can perform | Only admins can delete users |

### User Roles

The system supports three user roles defined in the Prisma schema:

```prisma
enum Role {
  USER      // Regular users - can access authenticated routes
  SUPPLIER  // Supplier accounts - can manage their products
  ADMIN     // Full access to all routes including admin dashboard
}
```

### Middleware Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        Incoming Request                          │
└─────────────────────────────┬────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                    Authorization Middleware                       │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  1. Check if route requires protection                     │  │
│  │  2. Extract JWT from Authorization header                  │  │
│  │  3. Verify token signature and expiration                  │  │
│  │  4. Check user role against route requirements             │  │
│  │  5. Pass user info to route handlers via headers           │  │
│  └────────────────────────────────────────────────────────────┘  │
└─────────────────────────────┬────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
        ┌─────────┐    ┌───────────┐   ┌───────────┐
        │   401   │    │    403    │   │    200    │
        │ No Token│    │  Access   │   │  Success  │
        │         │    │  Denied   │   │           │
        └─────────┘    └───────────┘   └───────────┘
```

### Protected Routes

| Route Pattern | Required Role | Description |
|---------------|---------------|-------------|
| `/api/admin/*` | ADMIN only | Admin dashboard and management |
| `/api/users/*` | Any authenticated | User management |
| `/api/products/*` | Any authenticated | Product CRUD operations |
| `/api/orders/*` | Any authenticated | Order management |
| `/api/suppliers/*` | Any authenticated | Supplier management |
| `/api/auth/*` | Public | Authentication (login/register) |
| `/api` | Public | API information |

### JWT Token Structure

The JWT token contains the following claims:

```typescript
{
  userId: string;    // User's unique ID
  email: string;     // User's email address
  role: string;      // USER | SUPPLIER | ADMIN
  name: string;      // User's display name
  iat: number;       // Issued at timestamp
  exp: number;       // Expiration timestamp (24h)
}
```

### Authentication Endpoints

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@foodguard.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": "24h",
    "user": {
      "id": "uuid",
      "name": "Admin User",
      "email": "admin@foodguard.com",
      "role": "ADMIN"
    }
  }
}
```

#### Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "New User",
  "email": "user@example.com",
  "password": "securepassword",
  "role": "USER"  // Optional, defaults to USER
}
```

#### Get Current User
```bash
GET /api/auth/me
Authorization: Bearer <token>
```

### Testing Role-Based Access

#### Admin Access to Admin Route ✅
```bash
curl -X GET http://localhost:3000/api/admin \
  -H "Authorization: Bearer <ADMIN_JWT>"
```
**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Admin dashboard accessed successfully",
  "data": {
    "message": "Welcome Admin! You have full access.",
    "statistics": { ... }
  }
}
```

#### Regular User Access to Admin Route ❌
```bash
curl -X GET http://localhost:3000/api/admin \
  -H "Authorization: Bearer <USER_JWT>"
```
**Response:** `403 Forbidden`
```json
{
  "success": false,
  "message": "Access denied",
  "error": {
    "code": "E403",
    "details": "Admin privileges required to access this resource"
  }
}
```

#### No Token Access ❌
```bash
curl -X GET http://localhost:3000/api/users
```
**Response:** `401 Unauthorized`
```json
{
  "success": false,
  "message": "Token missing",
  "error": {
    "code": "E401",
    "details": "Authorization header with Bearer token is required"
  }
}
```

#### Invalid Token ❌
```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer invalid.token.here"
```
**Response:** `403 Forbidden`
```json
{
  "success": false,
  "message": "Invalid or expired token",
  "error": {
    "code": "E401_TOKEN"
  }
}
```

### Middleware Implementation

The middleware is implemented in `src/middleware.ts`:

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check if route requires protection
  const isAdminRoute = pathname.startsWith("/api/admin");
  const isProtectedRoute = ["/api/users", "/api/orders"].some(
    route => pathname.startsWith(route)
  );

  if (!isAdminRoute && !isProtectedRoute) {
    return NextResponse.next();
  }

  // Extract and verify JWT
  const token = req.headers.get("authorization")?.split(" ")[1];
  
  if (!token) {
    return NextResponse.json({ 
      success: false, 
      message: "Token missing" 
    }, { status: 401 });
  }

  // Verify token and check role
  const decoded = await jose.jwtVerify(token, secret);
  
  if (isAdminRoute && decoded.payload.role !== "ADMIN") {
    return NextResponse.json({ 
      success: false, 
      message: "Access denied" 
    }, { status: 403 });
  }

  // Pass user info to route handlers
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-id", decoded.payload.userId);
  requestHeaders.set("x-user-email", decoded.payload.email);
  requestHeaders.set("x-user-role", decoded.payload.role);

  return NextResponse.next({ request: { headers: requestHeaders } });
}
```

### Principle of Least Privilege

The middleware enforces the **principle of least privilege**:

1. **Public routes** (`/api`, `/api/auth/*`) - No authentication required
2. **Authenticated routes** (`/api/users/*`, `/api/products/*`) - Any valid token
3. **Admin routes** (`/api/admin/*`) - Only ADMIN role tokens

### Adding New Roles

To add new roles (e.g., `EDITOR`, `MODERATOR`):

1. **Update Prisma Schema:**
```prisma
enum Role {
  USER
  SUPPLIER
  ADMIN
  EDITOR      // New role
  MODERATOR   // New role
}
```

2. **Update Middleware:**
```typescript
// Add new role checks
if (pathname.startsWith("/api/content") && 
    !["ADMIN", "EDITOR"].includes(decoded.role)) {
  return NextResponse.json({ 
    success: false, 
    message: "Editor access required" 
  }, { status: 403 });
}
```

3. **Run Migration:**
```bash
npx prisma migrate dev --name add_new_roles
```

### Interactive Testing

Visit `http://localhost:3000/test-auth` to interactively test all authorization scenarios with a visual interface showing:
- Test results with status codes
- Success/failure indicators
- Response payloads
- Generated tokens for manual testing

### Security Best Practices

1. **JWT Secret**: Store in environment variables, minimum 32 characters
2. **Token Expiration**: Set reasonable expiration (24h default)
3. **HTTPS**: Always use HTTPS in production
4. **Password Hashing**: Uses bcrypt with salt rounds
5. **Error Messages**: Generic messages in production to prevent enumeration

---

## 🛡️ Centralized Error Handling Middleware

FoodGuard implements a **centralized error handling system** that ensures consistent error responses, structured logging, and secure error messages across all API routes.

### Why Centralized Error Handling?

Modern web applications can fail in many ways — from API timeouts to database connection issues. Without a centralized strategy:

- ❌ Errors become scattered across routes
- ❌ Logs are inconsistent and hard to parse
- ❌ Debugging becomes difficult
- ❌ Sensitive information may leak to users

A centralized error handler ensures:

- ✅ **Consistency**: Every error follows a uniform response format
- ✅ **Security**: Sensitive stack traces are hidden in production
- ✅ **Observability**: Structured logs make debugging and monitoring easier
- ✅ **Developer Experience**: Clear error messages with context

### Components

#### 1. Structured Logger (`src/lib/logger.ts`)

The logger provides consistent, JSON-formatted logs for easy parsing by log aggregation tools (CloudWatch, Datadog, etc.).

```typescript
import { logger } from "@/lib/logger";

// Info logging
logger.info("User created successfully", { userId: "123" }, "POST /api/users");

// Error logging
logger.error("Database connection failed", error, { query: "SELECT * FROM users" }, "GET /api/users");
```

**Log Output Format:**
```json
{
  "level": "error",
  "message": "Error in GET /api/users",
  "timestamp": "2026-01-21T10:30:00.000Z",
  "context": "GET /api/users",
  "meta": {
    "errorCode": "E503",
    "statusCode": 503
  },
  "error": {
    "name": "DatabaseError",
    "message": "Connection timeout",
    "stack": "DatabaseError: Connection timeout\n    at ..."
  }
}
```

#### 2. Error Handler (`src/lib/errorHandler.ts`)

The centralized error handler categorizes errors, logs them with context, and returns appropriate responses.

**Usage in API Routes:**

```typescript
import { handleError } from "@/lib/errorHandler";

export async function GET(req: Request) {
  try {
    const data = await fetchData();
    return sendSuccess(data, "Success");
  } catch (error) {
    return handleError(error, {
      route: "/api/users",
      method: "GET",
      userId: req.headers.get("x-user-id") || undefined,
    });
  }
}
```

### Environment-Aware Error Responses

| Environment | Error Message | Stack Trace | Details |
|-------------|---------------|-------------|---------|
| **Development** | Full error message | ✅ Included | ✅ Full context |
| **Production** | Safe, generic message | ❌ Hidden | ❌ Minimal details |

**Development Response:**
```json
{
  "success": false,
  "message": "Database connection failed",
  "error": {
    "code": "E503",
    "details": {
      "stack": "DatabaseError: Connection timeout\n    at ..."
    }
  }
}
```

**Production Response:**
```json
{
  "success": false,
  "message": "Something went wrong. Please try again later.",
  "error": {
    "code": "E500"
  }
}
```

**Note:** Full error details are **always logged** internally, even in production. Only the user-facing response is sanitized.

### Reflection

**How structured logs aid debugging:**
- JSON format enables easy parsing and filtering
- Context fields help trace errors to specific routes/operations
- Timestamps enable correlation with other system events
- Error codes enable automated alerting and monitoring

**Why redacting sensitive data builds user trust:**
- Prevents information leakage (database structure, file paths, etc.)
- Protects against security vulnerabilities
- Maintains professional appearance
- Reduces attack surface

---

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/supplysafe"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"

# Redis (optional, for caching)
REDIS_URL="redis://localhost:6379"

# Supabase (optional)
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma studio` | Open Prisma database GUI |
| `npx prisma migrate dev` | Run database migrations |
| `npx prisma db seed` | Seed database with sample data |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**SupplySafe** is developed and maintained by the FoodGuard team.

---

<p align="center">
  Made with ❤️ for Indian Railway Catering Services
</p>
