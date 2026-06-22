"""
Seed script: creates two admin accounts if they don't exist.
Run automatically on app startup if admins table is empty.
"""
from sqlalchemy.orm import Session
from .models import Admin
from .auth import get_password_hash


SEED_ADMINS = [
    {
        "email": "taha@dualcraft.com",
        "password": "Taha@DualCraft2025",
        "name": "Taha Tabassum",
    },
    {
        "email": "mohsin@dualcraft.com",
        "password": "Mohsin@DualCraft2025",
        "name": "Mohsin Saeed",
    },
]


def seed_admins(db: Session) -> None:
    count = db.query(Admin).count()
    if count > 0:
        return  # already seeded

    for admin_data in SEED_ADMINS:
        admin = Admin(
            email=admin_data["email"],
            hashed_password=get_password_hash(admin_data["password"]),
            name=admin_data["name"],
        )
        db.add(admin)
    
    db.commit()
    print("[SUCCESS] Seeded admin accounts: taha@dualcraft.com, mohsin@dualcraft.com")
