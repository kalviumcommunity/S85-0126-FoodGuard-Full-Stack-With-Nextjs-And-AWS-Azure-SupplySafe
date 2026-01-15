# Digital Food Traceability System for Indian Railway Catering Services

## Project Setup (Next.js + TypeScript)

This project is initialized using **Next.js App Router** with **TypeScript**:

```bash
npx create-next-app@latest supplysafe --typescript
npm run dev
```

The application runs locally at: **[http://localhost:3000](http://localhost:3000)**

---

## Standard Folder Structure

```
src/
├── app/          # Routes, layouts, and pages (Next.js App Router)
│   ├── layout.tsx    # Root layout
│   ├── page.tsx      # Home page
│   └── globals.css   # Global styles
│
├── components/   # Reusable UI components (buttons, cards, modals, etc.)
│   └── ui/           # Low-level UI primitives
│
├── lib/          # Utilities, helpers, configs, API clients
│   ├── constants.ts
│   └── utils.ts
│
public/           # Static assets (images, icons)

.gitignore        # Excludes node_modules, .env, .next, build output
package.json
README.md
```

---

## Folder Purpose

### `src/app/`

* Handles routing using the **App Router**
* Supports layouts, loading states, and server/client components
* Keeps routing logic clean and colocated

### `src/components/`

* Contains reusable and shared UI components
* Encourages DRY principles
* Makes UI consistent across the application

### `src/lib/`

* Houses utility functions, helpers, constants, and configuration files
* Keeps business logic separate from UI
* Simplifies testing and reuse

### `public/`

* Stores static assets like logos, images, and icons
* Directly accessible by the browser

---

## Naming Conventions

* **Folders**: kebab-case or lowercase (`food-tracking`, `components`)
* **Components**: PascalCase (`SupplierCard.tsx`, `QRCodeScanner.tsx`)
* **Utilities**: camelCase (`formatDate.ts`, `fetchSupplier.ts`)
* **Routes**: file-based routing via folder names in `app/`

---

## Scalability & Clarity Benefits

This structure:

* Separates concerns (routing, UI, logic)
* Scales well for large teams and features
* Makes onboarding easier for new developers
* Supports future additions like APIs, dashboards, and mobile views

---

## Run Evidence

### Local Development Screenshot

> Screenshot of the application running locally on `http://localhost:3000`

![Localhost Running Screenshot](./public/localhost-running.png)

---

## Problem Statement

Indian Railway Catering Services face persistent **food safety and hygiene complaints** due to the absence of a **digital traceability mechanism**.

---

## Project Objective

To design a **digital, end-to-end food traceability and compliance system** ensuring hygiene, accountability, and passenger trust.

---

## Technology Stack

* **Frontend**: Next.js (TypeScript)
* **Backend**: Node.js / APIs
* **Database**: PostgreSQL
* **Cloud**: AWS / Azure
* **Extras**: QR Codes, IoT (optional)

---

## Team Members

* Sanya
* Madhav
* Nikunj

---

## Conclusion

This project introduces a **scalable and transparent digital traceability model** that strengthens food safety standards in Indian railway catering services.


