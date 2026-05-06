# ResumeIQ - AI-Powered Resume & ATS Optimizer

> MERN Stack · Socket.io · Redis · JWT + RBAC · Cloudinary · OpenAI

A full-stack SaaS application that analyzes resumes against job descriptions using AI, providing real-time ATS scores, keyword gap analysis, and actionable suggestions.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + TypeScript + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Real-time | Socket.io |
| Auth | JWT + Refresh Tokens + RBAC |
| AI | OpenAI GPT-4o-mini |
| File Storage | Cloudinary |
| Caching | Redis |
| Jobs | node-cron |

---

## Project Structure

```
resumeiq/
├── server/
│   ├── config/          # DB, Redis, Cloudinary config
│   ├── controllers/     # Auth, Resume, Scan, Admin
│   ├── middleware/      # JWT auth, RBAC, rate limiting
│   ├── models/          # User, Resume, Job, Scan schemas
│   ├── routes/          # All API routes
│   ├── utils/           # AI service, text extractor, cron jobs
│   └── index.js         # Entry point + Socket.io setup
└── client/
    └── src/
        ├── context/     # AuthContext
        ├── hooks/       # useSocket
        ├── pages/       # Dashboard, Resumes, Scan, Admin
        ├── services/    # Axios API client, Socket.io client
        └── components/  # Layout, UI components
```

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Redis (local or Redis Cloud) — optional, app works without it
- Cloudinary account
- OpenAI API key

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
OPENAI_API_KEY=sk-...
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
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin", plan: "pro", scansLimit: 100 } })
```

---

## API Endpoints

### Auth
| Method | Route | Description |
|---|---|---|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login + get tokens |
| POST | /api/auth/refresh | Refresh access token |
| POST | /api/auth/logout | Logout (protected) |
| GET | /api/auth/me | Get current user |

### Resumes
| Method | Route | Description |
|---|---|---|
| POST | /api/resumes | Upload resume (multipart) |
| GET | /api/resumes | Get my resumes |
| DELETE | /api/resumes/:id | Delete resume |

### Scans
| Method | Route | Description |
|---|---|---|
| POST | /api/scans | Create new scan (async) |
| GET | /api/scans | Get my scans |
| GET | /api/scans/:id | Get scan result |
| GET | /api/scans/stats/dashboard | Dashboard stats |

### Admin (admin role only)
| Method | Route | Description |
|---|---|---|
| GET | /api/admin/stats | Aggregation dashboard |
| GET | /api/admin/users | All users |
| PATCH | /api/admin/users/:id | Update user role/plan |

---

## Socket.io Events

| Event | Direction | Payload |
|---|---|---|
| `scan:progress` | Server → Client | `{ scanId, step, pct }` |
| `scan:done` | Server → Client | `{ scanId, atsScore, keywordMatchPct }` |
| `scan:failed` | Server → Client | `{ scanId, message }` |
| `resume:uploaded` | Server → Client | `{ resumeId, name }` |

---

## Key Features

1. **Real-time AI Scoring** — Socket.io progress events while GPT analyzes
2. **Redis Caching** — JD keyword extraction cached 24h by content hash
3. **JWT + Refresh Tokens** — 15-min access tokens, auto-refresh on expiry
4. **RBAC** — User/Admin roles with route-level guards
5. **MongoDB Aggregations** — Admin dashboard uses `$group`, `$unwind`, `$bucket`, `$facet`

---

## Deployment Notes

- **Frontend**: Deploy `client/dist` to Vercel / Netlify
- **Backend**: Deploy to Railway / Render / EC2
- **MongoDB**: MongoDB Atlas (free tier works)
- **Redis**: Redis Cloud (free tier works)
- **Cloudinary**: Free tier (25GB storage)

---

Built with ❤️ as a portfolio project | Nagaraj Jambagi
