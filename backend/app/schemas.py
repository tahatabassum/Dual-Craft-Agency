from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# ─── Auth ───────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ─── Blog Posts ─────────────────────────────────────────────────────────────

class PostBase(BaseModel):
    title: str
    slug: str
    excerpt: Optional[str] = None
    body: str
    cover_image: Optional[str] = None
    published: bool = False


class PostCreate(PostBase):
    pass


class PostUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    excerpt: Optional[str] = None
    body: Optional[str] = None
    cover_image: Optional[str] = None
    published: Optional[bool] = None


class PostOut(PostBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PostListItem(BaseModel):
    id: int
    title: str
    slug: str
    excerpt: Optional[str] = None
    cover_image: Optional[str] = None
    published: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Contact ─────────────────────────────────────────────────────────────────

class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str


class ContactOut(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str] = None
    message: str
    created_at: datetime

    class Config:
        from_attributes = True
