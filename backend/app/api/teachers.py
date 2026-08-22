from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.connection import get_db
from app.models.schemas import TeacherProfile, User
from app.schemas.pydantic_schemas import TutorResponse

router = APIRouter(prefix="/teachers", tags=["Teachers"])

@router.get("", response_model=List[TutorResponse])
def get_all_teachers(db: Session = Depends(get_db)):
    teachers = db.query(TeacherProfile).all()
    res = []
    for t in teachers:
        res.append({
            "id": t.id,
            "user_id": t.user_id,
            "name": t.user.name if t.user else "Tutor",
            "bio": t.bio,
            "experience": t.experience,
            "rating": t.rating,
            "teaching_mode": t.teaching_mode,
            "verified": t.verified,
            "subjects": [s.name for s in t.subjects],
            "topics": [tp.name for tp in t.topics],
            "languages": [l.language for l in t.languages],
            "match_score": 90.0,
            "match_reasons": ["Expert Tutor"]
        })
    return res

@router.get("/me")
def get_teacher_profile(teacher_id: int = 1, db: Session = Depends(get_db)):
    t = db.query(TeacherProfile).filter(TeacherProfile.id == teacher_id).first()
    if not t:
        t = db.query(TeacherProfile).first()
    if not t:
        raise HTTPException(status_code=404, detail="Teacher profile not found")

    return {
        "id": t.id,
        "name": t.user.name if t.user else "Teacher",
        "email": t.user.email if t.user else "",
        "bio": t.bio,
        "experience": t.experience,
        "rating": t.rating,
        "teaching_mode": t.teaching_mode,
        "verified": t.verified,
        "subjects": [s.name for s in t.subjects],
        "topics": [tp.name for tp in t.topics],
        "languages": [l.language for l in t.languages]
    }
