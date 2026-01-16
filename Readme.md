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



# Deployment Simplification with Docker and CI/CD  
## Secure Full-Stack Application Deployment to AWS / Azure

---

## Overview

Modern application deployment often fails due to inconsistent environments, manual processes, and poor secret management. Docker and CI/CD pipelines address these issues by standardizing application environments and automating build and deployment workflows.

This README explains:
- How Docker and CI/CD simplify deployments
- Key security considerations when deploying full-stack applications to AWS or Azure
- A case study analysis of common deployment failures
- How to redesign a broken deployment workflow for reliability and security

---

## How Docker Simplifies Deployment

Docker packages an application and all its dependencies into a container, ensuring it runs the same across development, testing, and production environments.

### Key Benefits
- Eliminates “works on my machine” issues
- Ensures consistent runtime environments
- Simplifies onboarding and scaling
- Enables microservices and service isolation

### Example (Full-Stack Application)
- **Frontend:** React application built into static assets
- **Backend:** Node.js + Express REST API
- **Database:** MongoDB (managed cloud service)

Each component runs in its own container, defined using a `Dockerfile`, making the system modular and portable.

---

## How CI/CD Pipelines Simplify Deployment

CI/CD pipelines automate the entire software delivery lifecycle.

### Typical CI/CD Workflow
1. Developer pushes code to GitHub
2. Pipeline triggers automatically
3. Dependencies are installed
4. Tests are executed
5. Docker image is built and tagged
6. Image is pushed to a container registry
7. Application is deployed to AWS or Azure

### Advantages
- Faster and repeatable deployments
- Reduced human error
- Automatic testing before deployment
- Easier rollback through versioned builds

---

## Secure Deployment Considerations for AWS / Azure

### Environment Variable Management

Sensitive data should never be hardcoded or committed to version control.

**Best Practices**
- Use `.env` files for local development
- Use GitHub Actions Secrets for CI/CD
- Use AWS Parameter Store / Secrets Manager or Azure Key Vault in production

**Common Variables**
- Database connection strings
- JWT secrets
- API keys

---

### Network and Port Management

Improper port handling can lead to runtime conflicts and security vulnerabilities.

**Best Practices**
- Expose only required ports (e.g., 80, 443)
- Use cloud security groups or network security groups
- Avoid hardcoding ports in containers
- Let load balancers manage routing

---

### Identity and Access Management (IAM)

Avoid embedding cloud credentials in code.

**Best Practices**
- Use IAM Roles (AWS) or Managed Identities (Azure)
- Grant least-privilege permissions
- Rotate secrets automatically where possible

---

### Versioned and Immutable Deployments

Every Docker image should be uniquely tagged.

**Benefits**
- Enables rollback on failure
- Easier debugging
- Consistent production environments
- Clear deployment history

---

## Case Study: “The Never-Ending Deployment Loop”

### Scenario

QuickServe, an online food delivery startup, faces frequent deployment failures. CI/CD pipelines fail midway, old containers continue running, and production shows inconsistent behavior.

---

## Root Cause Analysis

### Issue 1: Missing Environment Variables

**Symptoms**
- Pipeline crashes with “Environment variable not found”

**Cause**
- Environment variables defined locally but not configured in CI/CD or cloud runtime

**Solution**
- Store secrets in GitHub Secrets and cloud secret managers
- Inject variables during container runtime

---

### Issue 2: Old Containers Still Running

**Symptoms**
- Multiple app versions running simultaneously
- Inconsistent production behavior

**Cause**
- No container lifecycle management
- New containers deployed without stopping old ones

**Solution**
- Use rolling or blue-green deployments
- Stop and remove old containers before deploying new ones
- Use ECS, AKS, or managed container services

---

### Issue 3: Port Conflicts

**Symptoms**
- “Port already in use” errors during deployment

**Cause**
- Hardcoded ports
- Containers not cleaned up properly

**Solution**
- Use dynamic port mapping
- Assign one service per port
- Use load balancers to manage traffic

---

## Improved Deployment Workflow Design

### Proper Containerization
- One service per container
- Stateless application design
- Environment-agnostic Dockerfiles

### Robust CI/CD Pipeline
1. Build Docker image
2. Tag image with commit hash or version
3. Push to container registry
4. Deploy using rolling updates
5. Perform health checks before routing traffic

---

## Redesigned Workflow Outcome

- Zero-downtime deployments
- Secure secret handling
- Predictable and stable releases
- Easy rollback and monitoring

---

## Conclusion

Docker ensures environment consistency, CI/CD pipelines automate delivery, and cloud-native security practices protect production systems. Together, they eliminate deployment instability and enable scalable, secure, and reliable application deployments.

---

