from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Contact
from ..schemas import ContactCreate, ContactOut
from ..email import send_contact_email

router = APIRouter()


@router.post("", response_model=ContactOut, status_code=201)
def submit_contact(data: ContactCreate, db: Session = Depends(get_db)):
    contact = Contact(
        name=data.name,
        email=data.email,
        phone=data.phone,
        message=data.message,
    )
    db.add(contact)
    db.commit()
    db.refresh(contact)
    
    # Send email notification
    send_contact_email(
        name=contact.name,
        email=contact.email,
        phone=contact.phone,
        message=contact.message
    )
    
    return contact
