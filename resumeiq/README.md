# HYRR — AI-Powered Resume & ATS Optimizer

> MERN Stack · Socket.io · Redis · JWT + RBAC · Cloudinary · Groq × Llama 3.3

A full-stack SaaS application that analyzes resumes against job descriptions using AI, providing real-time ATS scores, keyword gap analysis, AI bullet-point rewrites, cover letter generation, and actionable suggestions.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + TypeScript + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Real-time | Socket.io |
| Auth | JWT + Refresh Tokens + RBAC |
| AI | Groq × Llama 3.3 (70B Versatile) / Llama 3.1 (8B Instant) |
| File Storage | Cloudinary |
| Caching | Redis |
| Jobs | node-cron |

---

## Key Features

1. **Real-Time ATS Scoring** — Socket.io progress events while Llama 3.3 analyzes your resume against job descriptions
2. **AI Magic Rewrite** — One-click bullet point transformation into metric-driven, achievement-focused statements
3. **AI Cover Letters** — Context-aware 3-paragraph cover letters tailored to company and role (Pro+ only)
4. **10 Resume Templates** — Minimalist, Modern Slate, Executive, Tech Mono, Creative Split, Academic CV, Sleek Serif, Infographic, EuroPass, Metric Matrix
5. **LinkedIn PDF Import** — Upload your LinkedIn "Save to PDF" export to auto-fill the resume builder (Pro+ only)
6. **Optimized Resume Download** — AI rewrites your resume to include missing keywords, exports as PDF or DOCX (Pro+ only)
7. **Scan Comparison** — Compare two scans side by side to find the best resume version per role
8. **Shareable Reports** — Public report URLs for career coaches and peer review
9. **Dashboard Analytics** — Track average ATS score, best score, total scans, and top missing keywords
10. **Plan-Based Feature Gating** — Free (3 scans/mo), Pro (unlimited), Career+ (everything + analytics)
11. **Redis Caching** — JD keyword extraction cached 24h by content hash
12. **JWT + Refresh Tokens** — 15-min access tokens, auto-refresh on expiry
13. **RBAC** — User/Admin roles with route-level guards
14. **MongoDB Aggregations** — Admin dashboard uses `$group`, `$unwind`, `$bucket`, `$facet`
15. **Monthly Scan Reset** — Cron job resets scan quotas on the 1st of every month

---

## Project Structure

```
resumeiq/
├── server/
│   ├── config/          # DB, Redis, Cloudinary config
│   ├── controllers/     # Auth, Resume, Scan, Admin
│   ├── middleware/      # JWT auth, RBAC, plan gating, rate limiting
│   ├── models/          # User, Resume, Job, Scan schemas
│   ├── routes/          # All API routes
│   ├── utils/           # AI service, text extractor, cron jobs
│   └── index.js         # Entry point + Socket.io setup
└── client/
    └── src/
        ├── context/     # AuthContext
        ├── hooks/       # useSocket
        ├── pages/       # Landing, Dashboard, Builder, Scan, Admin, etc.
        ├── services/    # Axios API client, Socket.io client
        └── components/  # Layout, Resume Templates, UI components
```

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Redis (local or Redis Cloud) — optional, app works without it
- Cloudinary account
- Groq API key

### 1. Clone & Install

```bash
cd resumeiq
npm install
cd server && npm install
cd ../client && npm install
```

### 2. Configure Environment

```bash
cd server
cp .env.example .env
# Edit .env with your keys
```

Required `.env` values:
```
MONGO_URI=mongodb://localhost:27017/resumeiq
JWT_SECRET=any_random_secret_string
REFRESH_TOKEN_SECRET=another_random_secret
GROQ_API_KEY=gsk_...
GROQ_MODEL=llama-3.3-70b-versatile
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### 3. Run Development

```bash
# From root
npm run dev
# Server: http://localhost:5000
# Client: http://localhost:5173
```

### 4. Create Admin User

After registering, open MongoDB Compass or CLI:
```js
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin", plan: "pro", scansLimit: 999 } })
```

---

## API Endpoints

### Auth
| Method | Route | Description |
|---|---|---|
| POST | /api/auth/register | Register new user (plan=free, scansLimit=3) |
| POST | /api/auth/login | Login + get tokens |
| POST | /api/auth/refresh | Refresh access token |
| POST | /api/auth/logout | Logout (protected) |
| GET | /api/auth/me | Get current user |
| POST | /api/auth/change-password | Change password (protected) |

### Resumes
| Method | Route | Description |
|---|---|---|
| POST | /api/resumes | Upload resume (multipart) |
| GET | /api/resumes | Get my resumes |
| GET | /api/resumes/:id | Get single resume |
| DELETE | /api/resumes/:id | Delete resume |
| POST | /api/resumes/rewrite | AI Magic Rewrite a bullet point |
| POST | /api/resumes/import-linkedin | Import LinkedIn PDF (Pro+ only) |
| POST | /api/resumes/cover-letter | Generate AI cover letter (Pro+ only) |

### Scans
| Method | Route | Description |
|---|---|---|
| POST | /api/scans | Create new scan (async, plan-limited) |
| GET | /api/scans | Get my scans (paginated) |
| GET | /api/scans/:id | Get scan result |
| GET | /api/scans/stats/dashboard | Dashboard stats |
| GET | /api/scans/report/:id | Public shareable report |
| POST | /api/scans/:id/download | Download optimized resume (Pro+ only) |

### Admin (admin role only)
| Method | Route | Description |
|---|---|---|
| GET | /api/admin/stats | Aggregation dashboard |
| GET | /api/admin/users | All users (paginated + search) |
| PATCH | /api/admin/users/:id/role | Update user role/plan (auto-sets scansLimit) |
| PUT | /api/admin/users/:id/status | Toggle user active status |

### Health
| Method | Route | Description |
|---|---|---|
| GET | /api/health | Server status, stack info, uptime |

---

## Pricing Plans

| Feature | Free | Pro ($19/mo) | Career+ ($39/mo) |
|---|---|---|---|
| ATS Scans | 3/month | Unlimited | Unlimited |
| AI Magic Rewrite | Basic | Unlimited | Unlimited |
| Resume Templates | 1 | All 10 | All 10 |
| PDF Export | ✅ | ✅ | ✅ |
| DOCX Export | ❌ | ✅ | ✅ |
| AI Cover Letters | ❌ | ✅ | ✅ |
| LinkedIn Import | ❌ | ✅ | ✅ |
| Scan Comparison | ❌ | ✅ | ✅ |
| Optimized Download | ❌ | ✅ | ✅ |
| Shareable Reports | ✅ | ✅ | ✅ |
| Dashboard Analytics | ❌ | ❌ | ✅ |
| Priority Support | ❌ | ❌ | ✅ |

---

## Socket.io Events

| Event | Direction | Payload |
|---|---|---|
| `scan:progress` | Server → Client | `{ scanId, step, pct }` |
| `scan:done` | Server → Client | `{ scanId, atsScore }` |
| `scan:failed` | Server → Client | `{ scanId, message }` |
| `resume:uploaded` | Server → Client | `{ resumeId, name }` |

---

## Cron Jobs

| Schedule | Task |
|---|---|
| Every Monday 9AM | Send weekly ATS report emails |
| Daily 2AM | Clean up failed scans older than 7 days |
| 1st of every month | Reset `scansUsed` to 0 for all users |

---

## Deployment Notes

- **Frontend**: Deploy `client/dist` to Vercel / Netlify
- **Backend**: Deploy to Railway / Render / EC2
- **MongoDB**: MongoDB Atlas (free tier works)
- **Redis**: Redis Cloud (free tier works)
- **Cloudinary**: Free tier (25GB storage)

---kkkkkkkkkkkkkkkkv

Built with ❤️ by Nagaraj Jakkappa | Powered by Groq × Llama 3.3
