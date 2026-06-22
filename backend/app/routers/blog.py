from fastapi import APIRouter, Depends, HTTPException, status, Query, File, UploadFile
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Post
from ..auth import get_current_admin
from ..schemas import PostCreate, PostUpdate, PostOut, PostListItem
from ..storage import upload_image as storage_upload
import re

router = APIRouter()


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    text = re.sub(r'^-+|-+$', '', text)
    return text


# ─── Public routes ───────────────────────────────────────────────────────────

@router.get("", response_model=List[PostListItem])
def list_posts(
    db: Session = Depends(get_db),
    published_only: bool = Query(True),
):
    query = db.query(Post)
    if published_only:
        query = query.filter(Post.published == True)
    return query.order_by(Post.created_at.desc()).all()


@router.get("/{slug}", response_model=PostOut)
def get_post(slug: str, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.slug == slug, Post.published == True).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


# ─── Admin routes ────────────────────────────────────────────────────────────

@router.get("/admin/all", response_model=List[PostOut])
def list_all_posts(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    return db.query(Post).order_by(Post.created_at.desc()).all()
@router.post("/upload")
def upload_image(
    file: UploadFile = File(...),
    admin=Depends(get_current_admin),
):
    """
    Upload a blog cover image.
    - In production (Vercel): uploads to Supabase Storage, returns a permanent public URL.
    - In development (no SUPABASE_URL set): saves to local uploads/ folder.
    Validation (extension, MIME type, 5 MB size limit) is enforced inside storage.upload_image.
    """
    public_url = storage_upload(file)
    return {"url": public_url}



@router.post("", response_model=PostOut, status_code=201)
def create_post(
    post_data: PostCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    # Ensure slug is unique
    slug = post_data.slug or slugify(post_data.title)
    existing = db.query(Post).filter(Post.slug == slug).first()
    if existing:
        raise HTTPException(status_code=409, detail="A post with this slug already exists")
    
    post = Post(**post_data.model_dump())
    post.slug = slug
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@router.put("/{post_id}", response_model=PostOut)
def update_post(
    post_id: int,
    post_data: PostUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    update_data = post_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(post, key, value)
    
    db.commit()
    db.refresh(post)
    return post


@router.delete("/{post_id}", status_code=204)
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    db.delete(post)
    db.commit()
