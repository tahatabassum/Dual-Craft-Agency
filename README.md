# Dual Craft — Agency Website

A full-stack agency website for **Dual Craft** — a web development and digital marketing agency. Features a modern animated React frontend, a FastAPI backend, and a Supabase PostgreSQL database with Supabase Storage for media.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, TailwindCSS 4 |
| **Animations** | GSAP 3, Lenis (smooth scroll) |
| **Backend** | FastAPI (Python 3.10+), Uvicorn |
| **Database ORM** | SQLAlchemy 2, Psycopg2 |
| **Auth** | JWT (HS256) + Bcrypt password hashing |
| **Database** | Supabase PostgreSQL (Transaction Pooler) |
| **Storage** | Supabase Storage (blog cover images) |
| **Email** | Resend API |
| **Deployment** | Vercel (frontend + backend), Supabase (DB + Storage) |

---

## Project Structure

```text
Agency Site/
│
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   │   ├── auth.py        # /api/auth/login endpoint + rate limiting
│   │   │   ├── blog.py        # Blog CRUD + image upload
│   │   │   └── contact.py     # Contact form submission + email
│   │   ├── auth.py            # JWT + bcrypt utilities
│   │   ├── database.py        # SQLAlchemy session setup
│   │   ├── email.py           # Resend email dispatch
│   │   ├── main.py            # App core, CORS, routers, startup
│   │   ├── models.py          # DB models: Admin, Post, Contact, LoginAttempt
│   │   ├── schemas.py         # Pydantic request/response schemas
│   │   ├── seed.py            # Auto-seeds admin accounts on first startup
│   │   └── storage.py        # Supabase Storage upload helper
│   │
│   ├── .env.example           # Environment variable reference (no secrets)
│   ├── vercel.json            # Vercel serverless config for FastAPI
│   └── requirements.txt       # Python dependencies
│
└── frontend/
    ├── public/                # Static assets (logos, icons)
    ├── src/
    │   ├── components/        # Navbar, Footer, WhatsApp FAB, MarkdownRenderer
    │   ├── data/              # Static project/team data
    │   ├── hooks/             # useAuth session hook
    │   ├── lib/               # Axios API client
    │   ├── pages/             # All page views (Home, Blog, Admin Dashboard, etc.)
    │   ├── types/             # TypeScript type definitions
    │   ├── App.tsx            # Router configuration
    │   └── main.tsx           # Entry point
    │
    ├── vercel.json            # SPA client-side routing rewrites for Vercel
    └── package.json           # Node dependencies
```

---

## Features

- **Animated Portfolio** — GSAP scroll animations, Lenis smooth scrolling, transition effects
- **Contact Form** — Saves leads to PostgreSQL + sends email notification via Resend
- **Blog System** — Markdown posts with syntax highlighting, cover images, publish/draft control
- **Image Uploads** — Stored permanently on Supabase Storage (production-safe, serverless-compatible)
- **WhatsApp FAB** — Pre-filled WhatsApp chat button
- **JWT-Secured Admin Panel** — Protected blog management dashboard
- **Login Rate Limiting** — DB-backed rate limiter (5 attempts / 60 sec) using `login_attempts` table

---

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Login, returns JWT |
| POST | `/api/contact` | Public | Submit contact form |
| GET | `/api/blog` | Public | List published posts |
| GET | `/api/blog/{slug}` | Public | Get single post |
| GET | `/api/blog/admin/all` | Admin | List all posts (incl. drafts) |
| POST | `/api/blog` | Admin | Create post |
| PUT | `/api/blog/{post_id}` | Admin | Update post |
| DELETE | `/api/blog/{post_id}` | Admin | Delete post |
| POST | `/api/blog/upload` | Admin | Upload cover image to Supabase Storage |
| GET | `/health` | Public | Health check |

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `SECRET_KEY` | HMAC secret for signing JWT tokens |
| `ALGORITHM` | JWT algorithm (default: `HS256`) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token lifetime in minutes |
| `DATABASE_URL` | Supabase PostgreSQL connection string |
| `FRONTEND_URL` | Frontend URL for CORS (e.g. `https://dualcraft.vercel.app`) |
| `ENVIRONMENT` | `development` or `production` |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase secret key for Storage API |
| `SUPABASE_BUCKET` | Storage bucket name (default: `blog-images`) |
| `RESEND_API_KEY` | Resend API key for email |
| `CONTACT_NOTIFICATION_EMAIL` | Email address to receive contact form notifications |
| `RESEND_FROM_EMAIL` | Sender display name and address |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL (e.g. `https://dualcraft-api.vercel.app/api`) |

> See `backend/.env.example` for a full template.

---

## Local Development Setup

### Prerequisites
- Node.js v18+
- Python 3.10+

### Backend
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate      # Windows
pip install -r requirements.txt
# Copy .env.example to .env and fill in your values
python -m uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## Deployment (Vercel)

Deploy as **two separate Vercel projects**:

1. **Backend** — set Root Directory to `backend/`, add all backend env vars
2. **Frontend** — set Root Directory to `frontend/`, add `VITE_API_URL` pointing to the backend deployment URL

Both projects connect to the same Supabase instance.
