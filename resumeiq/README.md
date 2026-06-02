# HYRR - AI Resume & ATS Optimizer

![HYRR Header](./client/public/og-image.png)

HYRR is a full-stack AI-powered resume optimization SaaS that helps job seekers scan resumes against job descriptions, calculate ATS scores, identify keyword gaps, rewrite resume bullets with AI, generate cover letters, and export job-ready resumes.

---

## 🌐 Live Links

- **Live App:** [https://hyrr-blue.vercel.app/](https://hyrr-blue.vercel.app/)
- **Demo Page:** [https://hyrr-blue.vercel.app/demo](https://hyrr-blue.vercel.app/demo)
- **Features:** [https://hyrr-blue.vercel.app/features](https://hyrr-blue.vercel.app/features)
- **Pricing:** [https://hyrr-blue.vercel.app/pricing](https://hyrr-blue.vercel.app/pricing)

---

## 🚀 Tech Stack & Technologies

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-131415?style=for-the-badge&logo=railway&logoColor=white)

### Frontend
- React + Vite
- TypeScript
- Tailwind CSS (Dark Neon SaaS Aesthetic)
- Recharts (Data Visualization)
- Axios & React Router

### Backend
- Node.js & Express.js
- MongoDB (Atlas)
- Redis (Upstash)
- JWT (HttpOnly Cookies)
- Zod (Schema Validation)
- Socket.io (Real-time updates)
- Razorpay (Payments & Webhooks)
- Groq AI API (Llama 3.3 for Fast AI Inference)

### Deployment
- **Frontend:** Vercel
- **Backend:** Railway
- **Database:** MongoDB Atlas
- **Cache:** Upstash Redis

---

## ✨ Features

- **ATS Resume Scanner:** Instantly parse PDFs and score them against target job descriptions.
- **Keyword Gap Analysis:** Identify missing technical and soft skills to beat applicant tracking systems.
- **AI Magic Rewrite:** Automatically rewrite weak resume bullets into quantifiable, impactful achievements.
- **AI Cover Letter Generation:** Context-aware cover letters generated instantly based on resume + job description.
- **Resume Builder Templates:** Create and export beautifully formatted, ATS-compliant PDFs or DOCX files.
- **Pricing & Subscriptions:** Tiered Razorpay integration (Free, Pro, Career+).
- **Comprehensive Admin Dashboard:** Real-time analytics, user management, global scan visibility, and infrastructure metrics.
- **Feedback CRM System:** In-app user feedback loops managed directly by admins.
- **Plan Limit Management:** Automated tracking of AI scan quotas synchronized with billing.
- **SEO & Social Optimization:** Complete with `sitemap.xml`, `robots.txt`, and rich Open Graph images.

---

## 🏗️ Architecture Design

HYRR employs a strict, scalable layered architecture on the backend to enforce separation of concerns:

**Routes → Controllers → Services → Repositories → Database**

- **Zod Validation Middleware:** All incoming requests are strictly validated at the boundary before reaching the controller.
- **Repository Pattern:** Database interactions are abstracted away from business logic, making the code testable and scalable.
- **Business Logic Separation:** AI prompt engineering, token management, and file parsing live in dedicated Service modules.
- **Role-Based Access Control (RBAC):** Admin-only actions and protected user routes ensure data sovereignty.

---

## 🔒 Security Posture

HYRR is built with production-grade security standards:

- **Authentication:** HttpOnly JWT cookies with short-lived access tokens and secure refresh token flows.
- **RBAC Admin Protection:** Middleware enforces strict isolation of moderator capabilities.
- **Helmet Headers:** Automated insertion of secure HTTP headers to prevent XSS and clickjacking.
- **CORS Production Whitelist:** Strict domain origins enforced.
- **Rate Limiting:** IP-based brute-force protections on `/login`, `/register`, and AI `/scan` endpoints.
- **Zod Request Validation:** Type-safe runtime validation against payload injection.
- **Razorpay Signature Verification:** Cryptographic webhook validation to prevent spoofed subscriptions.
- **Zero Secrets in Git:** All keys (Groq, Razorpay, MongoDB) are strictly loaded via `.env` files.

---

## 📸 Screenshots

*Note: Replace these markdown placeholders with actual screenshot paths if placed in `/docs/screenshots/`*

| Landing Page | Demo Page |
|--------------|-----------|
| ![Landing Page](./docs/screenshots/landing.png) | ![Demo Page](./docs/screenshots/demo.png) |

| ATS Scanner | Resume Builder |
|-------------|----------------|
| ![ATS Scanner](./docs/screenshots/scanner.png) | ![Resume Builder](./docs/screenshots/builder.png) |

| Pricing Page | Admin Dashboard |
|--------------|-----------------|
| ![Pricing Page](./docs/screenshots/pricing.png) | ![Admin Dashboard](./docs/screenshots/admin.png) |

---

## 💻 Local Setup Instructions

Want to run HYRR locally? Follow these steps:

```bash
# Clone the repository
git clone <repo-url>
cd resumeiq

# Install dependencies for both client and server (if using a root script, or separately)
# Terminal 1: Backend
cd server
npm install
npm run dev

# Terminal 2: Frontend
cd client
npm install
npm run dev
```

### Environment Variables Required

You will need to configure two `.env` files. **Do not commit these files to version control.**

#### `server/.env`
- `PORT`
- `NODE_ENV`
- `MONGO_URI`
- `JWT_SECRET`
- `REFRESH_TOKEN_SECRET`
- `REDIS_URL`
- `GROQ_API_KEY`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`
- `CLIENT_URL`

#### `client/.env`
- `VITE_API_URL`
- `VITE_RAZORPAY_KEY_ID`

---

## 🎯 Status

**HYRR is currently production-deployed and portfolio-ready.**
