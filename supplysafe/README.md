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

## ⚙️ 7. Environment & Build Configuration

### 7.1 Multi-Environment Logic
To ensure security and prevent the leakage of sensitive credentials (like database URLs or API keys), the system utilizes a tiered environment configuration. This separation ensures that development data never mixes with live railway production data.

* **.env.development**: Used for local coding and UI testing.
* **.env.staging**: A mirror of the production environment used for final QA and UAT (User Acceptance Testing).
* **.env.production**: The secure, live environment connected to official railway servers.

### 7.2 Build Scripts (`package.json`)
We use `env-cmd` to inject the correct environment variables during the build process. This allows for a "Build Once, Deploy Anywhere" workflow.

```json
"scripts": {
  "dev": "next dev",
  "build:dev": "env-cmd -f .env.development next build",
  "build:stage": "env-cmd -f .env.staging next build",
  "build:prod": "env-cmd -f .env.production next build",
  "start": "next start"
}


---

## ✅ 8. Expected Outcomes

The implementation of the Digital Food Traceability System is expected to yield the following high-impact results:

* **🛡️ Enhanced Safety:** A significant reduction in food-borne illness reports by ensuring only verified ingredients enter the supply chain.
* **⚡ Rapid Response (Speed):** Instant identification and "Kill-Switch" capability for "bad batches" to halt distribution across all affected trains within minutes.
* **📊 Operational Efficiency:** Transition to 100% digital audit trails, eliminating the need for manual paperwork and physical record storage.
* **⚖️ Strict Accountability:** Implementation of data-driven penalties and automated performance scoring for non-compliant vendors.



---

## 🔮 9. Future Roadmap

Our vision for the next phase of the system includes:

* **🔗 Blockchain Integration:** Implementing **Hyperledger Fabric** to create immutable, tamper-proof logs of every touchpoint in the food lifecycle, ensuring absolute data integrity.
* **📡 IoT Smart Sensors:** Integration of real-time temperature and humidity sensors in pantry car refrigerators with automated cloud-based logging and threshold alerts.
* **🤖 AI-Powered Risk Analysis:** Developing predictive models to identify hygiene risks by correlating historical data with external factors like ambient temperature, transit delays, and seasonal trends.



---

## 👥 10. Team Members

| Name | Role / Area of Expertise |
| :--- | :--- |
| **Sanya Jain** | System Design & Backend Architecture |
| **Madhav Garg** | Frontend Implementation & UI/UX |
| **Nikunj Kohli** | Quality Assurance & Deployment |

---