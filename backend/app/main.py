from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import logging
from dotenv import load_dotenv

from .database import engine, SessionLocal, Base
from .models import Admin, Post, Contact, LoginAttempt
from .routers import auth as auth_router
from .routers import blog as blog_router
from .routers import contact as contact_router
from .seed import seed_admins

load_dotenv()

# Create all tables
Base.metadata.create_all(bind=engine)

ENVIRONMENT = os.getenv("ENVIRONMENT", "production")
show_docs = ENVIRONMENT == "development"

app = FastAPI(
    title="Dual Craft API",
    description="Backend API for Dual Craft",
    version="1.0.0",
    docs_url="/docs" if show_docs else None,
    redoc_url="/redoc" if show_docs else None,
    openapi_url="/openapi.json" if show_docs else None,
)

# ─── CORS ────────────────────────────────────────────────────────────────────

FRONTEND_URL = os.getenv("FRONTEND_URL")
origins = []
if FRONTEND_URL:
    origins.append(FRONTEND_URL)

# Only allow localhost testing/dev origins in development environment or if FRONTEND_URL is not set
if ENVIRONMENT == "development" or not FRONTEND_URL:
    origins.extend([
        "http://localhost:5173",
        "http://localhost:3000",
    ])

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Global Exception Handler ────────────────────────────────────────────────

logger = logging.getLogger("uvicorn.error")

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # Log the full traceback on the server console/logs
    logger.error(f"[ERROR] Unhandled error: {exc}", exc_info=True)
    
    # In development, return the traceback/error detail
    if ENVIRONMENT == "development":
        return JSONResponse(
            status_code=500,
            content={"detail": str(exc)},
        )
    
    # Generic, safe response in production to avoid leaking database schemas, credentials, or code details
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred. Please contact system support."},
    )

# ─── Static files for uploaded images (local dev only) ──────────────────────
# In production (Vercel), the filesystem is read-only — images go to Supabase Storage.
# Only mount local uploads if the directory already exists (i.e. local development).

if ENVIRONMENT == "development":
    try:
        from fastapi.staticfiles import StaticFiles
        import pathlib
        uploads_path = pathlib.Path("uploads")
        uploads_path.mkdir(exist_ok=True)
        app.mount("/uploads", StaticFiles(directory=str(uploads_path)), name="uploads")
    except Exception as e:
        print(f"[WARNING] Could not mount local uploads directory: {e}")

# ─── Routers ─────────────────────────────────────────────────────────────────

app.include_router(auth_router.router, prefix="/api/auth", tags=["Auth"])
app.include_router(blog_router.router, prefix="/api/blog", tags=["Blog"])
app.include_router(contact_router.router, prefix="/api/contact", tags=["Contact"])


# ─── Startup: seed admin accounts ────────────────────────────────────────────

@app.on_event("startup")
def on_startup():
    db = SessionLocal()
    try:
        seed_admins(db)
    finally:
        db.close()


@app.get("/")
def root():
    return {"message": "Dual Craft API is running 🚀"}


@app.get("/health")
def health():
    return {"status": "ok"}
