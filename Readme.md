# Digital Food Traceability System for Indian Railway Catering Services

## Problem Statement
Indian Railway Catering Services face persistent **food safety and hygiene complaints** due to the absence of a **digital traceability mechanism**.  
Suppliers are often **untracked**, records are **manual**, and there is no real-time visibility into the food supply chain.  
This makes it difficult to ensure hygiene compliance, identify responsibility during complaints, and enforce regulatory standards.

---

## Project Objective
The objective of this project is to design a **digital, end-to-end food traceability and compliance system** that ensures:
- Complete transparency of food supply chain
- Hygiene and safety compliance
- Supplier accountability
- Faster complaint resolution
- Improved passenger trust

---

## Proposed Solution Overview
The proposed system digitally tracks food throughout its lifecycle:

**Supplier → Ingredient Batch → Kitchen → Transport → Train → Passenger**

Each stage is digitally recorded, monitored, and verified using QR codes, cloud dashboards, and automated compliance checks.

---

## Key System Components

### 1. Supplier Registration & Verification
- Digital onboarding of suppliers
- FSSAI license verification
- Hygiene certification uploads
- Geo-location tagging
- Automatic license expiry alerts

---

### 2. Ingredient Batch Tracking
- Each ingredient assigned a unique batch ID
- Batch details include:
  - Source supplier
  - Manufacturing/harvest date
  - Expiry date
  - Storage requirements

---

### 3. QR Code-Based Traceability
- QR codes attached to food packets or catering units
- Scanning displays:
  - Ingredient source
  - Kitchen details
  - Cooking time
  - Transport history

---

### 4. Real-Time Monitoring Dashboard
- Centralized dashboard for railway authorities
- Tracks:
  - Supplier compliance status
  - Hygiene audits
  - Temperature logs
  - Violation alerts

---

### 5. Hygiene & Storage Monitoring
- Digital hygiene checklists
- IoT-based temperature and humidity tracking
- Automatic alerts for unsafe conditions

---

### 6. Passenger Feedback Integration
- QR-linked complaint system
- Complaints mapped directly to:
  - Supplier
  - Batch
  - Kitchen
- Enables quick isolation of unsafe food batches

---

### 7. Compliance & Reporting Automation
- Auto-generated compliance reports
- Monthly hygiene scorecards
- Supplier performance ranking

---

## Technology Stack

### Frontend
- Web & Mobile Interfaces
- QR Scanner Integration

### Backend
- Cloud-based APIs
- Authentication & Role Management

### Database
- PostgreSQL / Cloud Database

### Additional Technologies
- QR Codes / RFID
- IoT Sensors (optional)
- Cloud Platform (AWS / Azure)
- Analytics & Reporting Engine

---

## Expected Outcomes
- Reduced food safety complaints
- Improved hygiene compliance
- Faster identification of violations
- Increased passenger trust
- Data-driven decision making

---

## Future Enhancements
- Blockchain for tamper-proof logs
- AI-based risk prediction
- Facial recognition for staff hygiene compliance
- Passenger-visible hygiene ratings

---

## Team Members
- Sanya
- Madhav
- Nikunj

---

## Conclusion
This project introduces a **scalable and transparent digital traceability model** that strengthens food safety standards in Indian railway catering services.  
By digitizing the entire food supply chain, the system ensures **hygiene, accountability, and regulatory compliance**.

---

## 🔐 Environment Variables Setup

### Quick Setup

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in your actual credentials in `.env.local`**

3. **Never commit `.env.local`** (already protected in `.gitignore`)

### Environment Variables

#### 🔒 Server-Side Only (Never exposed to browser)

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | PostgreSQL connection | `postgres://user:pass@localhost:5432/db` |
| `AWS_REGION` | AWS region | `us-east-1` |
| `AWS_ACCESS_KEY_ID` | AWS credentials | From AWS IAM |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | From AWS IAM |
| `AWS_S3_BUCKET_NAME` | S3 bucket name | `supplysafe-storage` |
| `AZURE_STORAGE_CONNECTION_STRING` | Azure connection | From Azure Portal |
| `AZURE_STORAGE_ACCOUNT_NAME` | Azure account | `supplysafe` |
| `AZURE_STORAGE_CONTAINER_NAME` | Azure container | `food-images` |
| `JWT_SECRET` | JWT signing secret | Min 32 chars, generate with `openssl rand -base64 32` |
| `SESSION_SECRET` | Session encryption | Min 32 chars, generate with `openssl rand -base64 32` |
| `SENDGRID_API_KEY` | Email service | From SendGrid dashboard |
| `STRIPE_SECRET_KEY` | Payment processing | `sk_test_...` from Stripe |

#### 🌐 Client-Side Safe (Must have `NEXT_PUBLIC_` prefix)

| Variable | Purpose | Example |
|----------|---------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | API base URL | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_NAME` | App display name | `SupplySafe` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key | `pk_test_...` |

### Usage Rules

**✅ DO:**
- Use `NEXT_PUBLIC_` prefix for variables needed in client components
- Access server-only variables in Server Components, API routes, or server actions
- Keep secrets strong (min 32 chars for JWT/Session)
- Restart dev server after changing env variables

**❌ DON'T:**
- Commit `.env.local` to Git
- Use server variables (without `NEXT_PUBLIC_`) in client components
- Expose sensitive data to the client
- Share your `.env.local` file

### Example Usage

**Server-side (API Route):**
```typescript
// app/api/upload/route.ts
export async function POST(req: Request) {
  // ✅ Safe: Server-only
  const s3 = new S3Client({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
  });
}
```

**Client-side (Component):**
```typescript
'use client';

export default function Dashboard() {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  const secret = process.env.JWT_SECRET;
}
```

### Common Pitfalls

- **Variable is undefined**: Check spelling, restart dev server
- **Can't access in client**: Add `NEXT_PUBLIC_` prefix
- **Changes not working**: `NEXT_PUBLIC_` vars need rebuild: `npm run build`
- **Build fails**: Check required variables are set in `.env.local`

### Resources

- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [12-Factor App Config](https://12factor.net/config)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

## 🚀 Advanced Data Fetching & Rendering Strategies

This project demonstrates three powerful rendering strategies in Next.js 13+ App Router to optimize performance, user experience, and cost-efficiency.

### 📊 Overview of Rendering Modes

| Rendering Mode | When Content is Generated | Revalidation | Use Case | Cost Impact |
|----------------|--------------------------|--------------|----------|-------------|
| **Static (SSG)** | Build time | None | Rarely changing content | Lowest |
| **Dynamic (SSR)** | Every request | N/A | Real-time, personalized data | Highest |
| **Hybrid (ISR)** | Build time + periodic regeneration | On-demand | Periodically updated content | Medium |

---

### 1️⃣ Static Rendering (SSG) - `/about`

**What it is:**  
Pages are pre-rendered at build time and served as static HTML. This is the fastest rendering mode.

**Implementation:**
```typescript
// app/about/page.tsx
export const revalidate = false; // Force static rendering

export default async function AboutPage() {
  const data = await getStaticContent();
  return <AboutView data={data} />;
}
```

**Key Features:**
- ⚡ **Lightning-fast load times** - Pre-built HTML served instantly
- 💰 **Lowest server costs** - No runtime rendering required
- 🌐 **CDN-friendly** - Can be cached globally at edge locations
- 🔒 **Predictable** - Content is identical for all users

**When to Use:**
- Marketing pages (landing pages, features)
- Blog posts and articles
- Documentation
- About pages and static content
- Product catalogs that don't change frequently

**Performance Impact:**
- Time to First Byte (TTFB): ~50-100ms
- Ideal for SEO and Core Web Vitals
- No database queries on each request

**Example Output:**
```
✅ Rendering: Static (pre-rendered at build time)
📅 Built at: 2026-01-16T10:30:00.000Z
💡 The timestamp never changes - refresh to verify!
```

---

### 2️⃣ Dynamic Rendering (SSR) - `/dashboard`

**What it is:**  
Pages are generated on-demand for every request, ensuring always-fresh data.

**Implementation:**
```typescript
// app/dashboard/page.tsx
export const dynamic = 'force-dynamic'; // Force SSR

export default async function Dashboard() {
  // Fetch with no-store to prevent caching
  const data = await fetch('https://api.example.com/metrics', { 
    cache: 'no-store' 
  });
  return <DashboardView data={data} />;
}
```

**Key Features:**
- 🔄 **Always up-to-date** - Fresh data on every request
- 👤 **Personalized** - Can show user-specific content
- 🎯 **Real-time** - Perfect for live data and analytics
- 💸 **Higher cost** - Server renders on every request

**When to Use:**
- User dashboards with personal data
- Real-time analytics and metrics
- Live feeds (news, social media)
- Shopping carts and checkout pages
- Admin panels with live monitoring

**Performance Impact:**
- TTFB: ~200-500ms (depends on data fetching)
- Server resources used on every request
- Not cached by CDN

**Example Output:**
```
✅ Rendering: Server-Side Rendering (SSR)
🕒 Generated at: 2026-01-16T15:45:23.456Z
🌐 API Time: 3:45:23 PM
💡 Refresh to see real-time updates!
```

---

### 3️⃣ Hybrid Rendering (ISR) - `/news`

**What it is:**  
Combines static generation with periodic background regeneration - best of both worlds.

**Implementation:**
```typescript
// app/news/page.tsx
export const revalidate = 60; // Revalidate every 60 seconds

export default async function NewsPage() {
  // Default fetch behavior (cached with revalidation)
  const articles = await fetch('https://api.example.com/news');
  return <NewsView articles={articles} />;
}
```

**Key Features:**
- ⚡ **Fast like static** - Serves cached HTML
- 🔄 **Fresh like dynamic** - Updates periodically
- 📉 **Cost-effective** - Only regenerates when needed
- 🎯 **Smart caching** - Stale-while-revalidate pattern

**When to Use:**
- News and blog sites
- Product listings with inventory
- Event calendars
- Social media feeds
- E-commerce product pages

**How It Works:**
1. First request after build → Serves static HTML (fast)
2. After 60 seconds → Next request serves stale content but triggers background regeneration
3. Subsequent requests → Serve newly regenerated content

**Performance Impact:**
- TTFB: ~50-100ms (most of the time)
- Background regeneration only when needed
- Best balance of speed, freshness, and cost

**Example Output:**
```
✅ Rendering: Incremental Static Regeneration (ISR)
📅 Last Updated: 2026-01-16 3:45:00 PM
⏰ Next Update: 2026-01-16 3:46:00 PM
💡 Content refreshes automatically every 60 seconds!
```

---

### 🎯 When to Use Each Strategy

#### Use **Static (SSG)** when:
- Content changes rarely (days/weeks)
- Same content for all users
- SEO is critical
- Maximum performance needed
- Examples: About pages, blog posts, documentation

#### Use **Dynamic (SSR)** when:
- Content changes on every request
- User-specific or personalized data
- Real-time updates required
- Examples: Dashboards, user profiles, live feeds

#### Use **Hybrid (ISR)** when:
- Content changes periodically (minutes/hours)
- Balance between speed and freshness needed
- Can tolerate slightly stale data
- Examples: News sites, product catalogs, event listings

---

### 📈 Performance Comparison

**Test Scenario: 10,000 users accessing a page**

| Strategy | Server Load | Cost | Speed | Data Freshness |
|----------|------------|------|-------|----------------|
| **Static** | 0 renders | $0.01 | ⚡⚡⚡ | Hours/Days old |
| **ISR (60s)** | ~167 renders | $0.05 | ⚡⚡ | Max 60s old |
| **Dynamic** | 10,000 renders | $5.00 | ⚡ | Always fresh |

---

### 🔍 How to Verify Rendering Mode

**During Development:**
```bash
npm run build
npm start
```

Check the build output:
- `○` (Static) = Pre-rendered at build time
- `ƒ` (Dynamic) = Server-rendered on each request
- `◐` (ISR) = Static with revalidation

**In DevTools:**
1. Open Network tab
2. Reload page
3. Check response headers:
   - `x-nextjs-cache: HIT` = Served from cache (Static/ISR)
   - `x-nextjs-cache: MISS` = Freshly rendered (Dynamic)

**In Code:**
```typescript
// Check if page was generated or cached
console.log('Page generated at:', new Date().toISOString());
```

---

### 💡 Real-World Scaling Considerations

**Question: What if we had 10x more users (100,000 requests/day)?**

**Current Strategy Analysis:**

1. **About Page (Static)**
   - ✅ No change needed
   - Still serves instantly from CDN
   - Zero additional server cost
   - **Recommendation:** Keep static

2. **Dashboard (Dynamic)**
   - ⚠️ Server load increases 10x
   - Cost increases proportionally
   - Potential bottleneck
   - **Recommendation:** Consider ISR with short revalidation (10-30s) if real-time isn't critical, or implement client-side data fetching with SWR/React Query for personalized widgets

3. **News Page (ISR 60s)**
   - ✅ Scales well
   - Regenerates only once per minute regardless of traffic
   - Cost stays nearly the same
   - **Recommendation:** Keep ISR, consider CDN caching

**Optimization Strategy for 10x Traffic:**
- Move dashboard widgets to client-side fetching where possible
- Use ISR for base layout, dynamic for real-time data only
- Implement Redis caching for frequently accessed data
- Use CDN edge functions for personalization
- Consider database read replicas for analytics queries

---

### 🛠️ Implementation Commands

**Build and test:**
```bash
# Development mode
npm run dev

# Production build
npm run build

# Start production server
npm start
```

**Test each page:**
- Static: http://localhost:3000/about
- Dynamic: http://localhost:3000/dashboard
- Hybrid: http://localhost:3000/news

---

### 📚 Additional Resources

- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Rendering Strategies](https://nextjs.org/docs/app/building-your-application/rendering)
- [Incremental Static Regeneration](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#revalidating-data)

---
