"""
storage.py — Supabase Storage helper for blog image uploads.

Uses the Supabase REST Storage API (no Python SDK required).
Set these environment variables in production (Vercel):
  SUPABASE_URL              e.g. https://xyzxyz.supabase.co
  SUPABASE_SERVICE_ROLE_KEY the service_role secret key (NOT the anon key)
  SUPABASE_BUCKET           bucket name, defaults to "blog-images"

Falls back to local filesystem storage when the above vars are absent
(useful for local development without a Supabase project).
"""

import os
import uuid
import httpx
from fastapi import HTTPException, UploadFile

SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
BUCKET = os.getenv("SUPABASE_BUCKET", "blog-images")

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp"}
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB


def _validate_upload(file: UploadFile) -> tuple[str, str]:
    """Validate extension, content-type, and size. Returns (safe_filename, ext)."""
    filename = file.filename or ""
    if not filename or "." not in filename:
        raise HTTPException(status_code=400, detail="Invalid filename")

    ext = filename.rsplit(".", 1)[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="File extension not allowed. Only jpg, jpeg, png, and webp are allowed.",
        )

    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail="File type not allowed. Only JPEG, PNG, and WebP images are allowed.",
        )

    # Check size
    try:
        file_size = getattr(file, "size", None)
        if file_size is None:
            import os as _os
            file.file.seek(0, _os.SEEK_END)
            file_size = file.file.tell()
            file.file.seek(0)
        if file_size > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File size exceeds the 5 MB limit.")
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=400, detail="Could not determine file size.")

    safe_filename = f"{uuid.uuid4()}.{ext}"
    return safe_filename, ext


def upload_image(file: UploadFile) -> str:
    """
    Upload an image and return its public URL.

    - If SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are set → uploads to Supabase Storage.
    - Otherwise → saves to local `uploads/` directory (development fallback).
    """
    safe_filename, ext = _validate_upload(file)

    if SUPABASE_URL and SUPABASE_KEY:
        return _upload_to_supabase(file, safe_filename)
    else:
        return _upload_to_local(file, safe_filename)


# ─── Supabase Storage ─────────────────────────────────────────────────────────

def _upload_to_supabase(file: UploadFile, safe_filename: str) -> str:
    """Upload to Supabase Storage and return the permanent public URL."""
    upload_url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET}/{safe_filename}"

    content_type = file.content_type or "application/octet-stream"
    file_bytes = file.file.read()

    try:
        response = httpx.put(
            upload_url,
            content=file_bytes,
            headers={
                "Authorization": f"Bearer {SUPABASE_KEY}",
                "Content-Type": content_type,
                "x-upsert": "false",          # fail if object already exists (UUID collision is astronomically unlikely)
            },
            timeout=30.0,
        )
        response.raise_for_status()
    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=502,
            detail=f"Supabase Storage upload failed: {e.response.status_code} — {e.response.text}",
        )
    except httpx.RequestError as e:
        raise HTTPException(status_code=502, detail=f"Could not reach Supabase Storage: {e}")

    # Return the permanent public URL
    public_url = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/{safe_filename}"
    return public_url


# ─── Local filesystem fallback (development only) ─────────────────────────────

def _upload_to_local(file: UploadFile, safe_filename: str) -> str:
    """Save to local uploads/ directory and return a relative URL."""
    import shutil

    os.makedirs("uploads", exist_ok=True)
    filepath = os.path.join("uploads", safe_filename)
    try:
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {e}")

    return f"/uploads/{safe_filename}"
