from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.schemas import User, TeacherProfile, EducationalResource, Scholarship, TutorBooking, QuizAttempt
from app.workers.scheduler import run_scholarship_sync_job

router = APIRouter(prefix="/admin", tags=["Admin Portal"])

@router.get("/analytics")
def get_admin_analytics(db: Session = Depends(get_db)):
    total_students = db.query(User).filter(User.role == "student").count()
    total_teachers = db.query(User).filter(User.role == "teacher").count()
    total_bookings = db.query(TutorBooking).count()
    total_quiz_attempts = db.query(QuizAttempt).count()
    total_resources = db.query(EducationalResource).count()
    total_scholarships = db.query(Scholarship).count()

    return {
        "total_students": total_students,
        "total_teachers": total_teachers,
        "total_bookings": total_bookings,
        "total_quiz_attempts": total_quiz_attempts,
        "total_resources": total_resources,
        "total_scholarships": total_scholarships,
        "system_health": "99.98% Operational"
    }

from pydantic import BaseModel
from typing import Optional

class UserUpdateSchema(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None
    account_status: Optional[str] = None

@router.put("/users/{user_id}")
def update_user(user_id: int, data: UserUpdateSchema, db: Session = Depends(get_db)):
    u = db.query(User).filter(User.id == user_id).first()
    if not u:
        raise HTTPException(status_code=404, detail="User not found")

    if data.name is not None: u.name = data.name
    if data.email is not None: u.email = data.email
    if data.role is not None: u.role = data.role
    if data.account_status is not None: u.account_status = data.account_status

    db.commit()
    db.refresh(u)
    return {"id": u.id, "name": u.name, "email": u.email, "role": u.role, "account_status": getattr(u, 'account_status', 'active'), "created_at": u.created_at}

@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    u = db.query(User).filter(User.id == user_id).first()
    if not u:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(u)
    db.commit()
    return {"message": "User removed successfully", "id": user_id}


@router.post("/scholarships/sync")
def trigger_scholarship_sync(db: Session = Depends(get_db)):
    result = run_scholarship_sync_job(db)
    return result

@router.post("/scholarships")
def add_verified_scholarship(
    name: str,
    provider: str,
    description: str,
    official_url: str,
    source_url: str,
    min_percentage: float = 60.0,
    max_income: float = 250000.0,
    db: Session = Depends(get_db)
):
    sch = Scholarship(
        name=name,
        provider=provider,
        description=description,
        official_url=official_url,
        source_url=source_url,
        application_deadline="2026-11-30",
        education_level="High School",
        courses=["Class 11", "Class 12", "Undergraduate"],
        states=["All"],
        min_percentage=min_percentage,
        max_income=max_income,
        benefits="Stipend & Full Tuition",
        documents_required=["Marksheet", "Income Proof"],
        status="Active"
    )
    db.add(sch)
    db.commit()
    db.refresh(sch)
    return sch
