import time
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Admin, LoginAttempt
from ..auth import verify_password, create_access_token
from ..schemas import LoginRequest, TokenResponse

router = APIRouter()


def rate_limit_login(request: Request, db: Session = Depends(get_db)):
    # 1. Resolve true client IP behind Vercel or reverse proxy
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        client_ip = forwarded.split(",")[0].strip()
    else:
        client_ip = request.client.host if request.client else "127.0.0.1"
        
    now = datetime.now(timezone.utc)
    
    # 2. Run automatic cleanup: delete records older than 24 hours on every request
    twenty_four_hours_ago = now - timedelta(hours=24)
    try:
        db.query(LoginAttempt).filter(LoginAttempt.attempted_at < twenty_four_hours_ago).delete()
        db.commit()
    except Exception:
        db.rollback()
        
    # 3. Log the current attempt to the database (persisted whether blocked or not)
    new_attempt = LoginAttempt(ip_address=client_ip, attempted_at=now)
    db.add(new_attempt)
    db.commit()
    db.refresh(new_attempt)
    
    # 4. Count attempts in the last 60 seconds (including this one)
    one_minute_ago = now - timedelta(minutes=1)
    recent_attempts = db.query(LoginAttempt).filter(
        LoginAttempt.ip_address == client_ip,
        LoginAttempt.attempted_at >= one_minute_ago
    ).count()
    
    # 5. Since current attempt is logged first, block if count is strictly greater than 5
    if recent_attempts > 5:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many login attempts. Please try again in 60 seconds."
        )


@router.post("/login", response_model=TokenResponse)
def login(
    request: LoginRequest, 
    db: Session = Depends(get_db),
    _rate_limit=Depends(rate_limit_login)
):
    admin = db.query(Admin).filter(Admin.email == request.email).first()
    if not admin or not verify_password(request.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    token = create_access_token(data={"sub": admin.email})
    return {"access_token": token, "token_type": "bearer"}
