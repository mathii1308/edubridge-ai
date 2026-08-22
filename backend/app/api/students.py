from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.schemas import StudentProfile, User
from app.schemas.pydantic_schemas import StudentProfileSchema, StudentProfileUpdate

router = APIRouter(prefix="/students", tags=["Students"])

@router.get("/me", response_model=StudentProfileSchema)
def get_student_profile(student_id: int = 1, db: Session = Depends(get_db)):
    profile = db.query(StudentProfile).filter(StudentProfile.id == student_id).first()
    if not profile:
        profile = db.query(StudentProfile).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")
    return profile

@router.put("/me", response_model=StudentProfileSchema)
def update_student_profile(upd: StudentProfileUpdate, student_id: int = 1, db: Session = Depends(get_db)):
    profile = db.query(StudentProfile).filter(StudentProfile.id == student_id).first()
    if not profile:
        profile = db.query(StudentProfile).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")

    for field, val in upd.dict(exclude_unset=True).items():
        setattr(profile, field, val)

    db.commit()
    db.refresh(profile)
    return profile
