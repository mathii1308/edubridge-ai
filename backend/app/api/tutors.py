from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.connection import get_db
from app.models.schemas import TeacherProfile, StudentProfile, TutorAvailability
from app.schemas.pydantic_schemas import TutorResponse
from app.services.tutor_matching import TutorMatchingService

router = APIRouter(prefix="/tutors", tags=["Tutors"])

@router.get("", response_model=List[TutorResponse])
def discover_tutors(
    subject: Optional[str] = None,
    topic: Optional[str] = None,
    language: Optional[str] = "English",
    date: Optional[str] = None,
    student_id: int = 1,
    db: Session = Depends(get_db)
):
    student = db.query(StudentProfile).filter(StudentProfile.id == student_id).first()
    if not student:
        student = db.query(StudentProfile).first()

    teachers = db.query(TeacherProfile).filter(TeacherProfile.verified == True).all()
    results = []

    for tutor in teachers:
        # Evaluate deterministic match score if subject provided
        if subject:
            match_data = TutorMatchingService.calculate_match(
                db=db,
                tutor=tutor,
                student=student,
                req_subject=subject,
                req_topic=topic,
                req_language=language,
                req_date=date
            )
        else:
            match_data = {
                "tutor_id": tutor.id,
                "user_id": tutor.user_id,
                "name": tutor.user.name if tutor.user else "Tutor",
                "bio": tutor.bio,
                "experience": tutor.experience,
                "rating": tutor.rating,
                "teaching_mode": tutor.teaching_mode,
                "verified": tutor.verified,
                "subjects": [s.name for s in tutor.subjects],
                "topics": [tp.name for tp in tutor.topics],
                "languages": [l.language for l in tutor.languages],
                "match_score": 85.0,
                "match_reasons": ["Verified Educator", f"{tutor.experience}+ Years Experience"]
            }

        results.append(match_data)

    # Sort by match score descending
    results.sort(key=lambda x: x["match_score"], reverse=True)
    return results

@router.get("/{tutor_id}")
def get_tutor_detail(tutor_id: int, db: Session = Depends(get_db)):
    tutor = db.query(TeacherProfile).filter(TeacherProfile.id == tutor_id).first()
    if not tutor:
        raise HTTPException(status_code=404, detail="Tutor not found")

    availabilities = [
        {
            "id": a.id,
            "date": a.date,
            "start_time": a.start_time,
            "end_time": a.end_time,
            "status": a.status
        }
        for a in tutor.availabilities
    ]

    return {
        "id": tutor.id,
        "name": tutor.user.name if tutor.user else "Tutor",
        "bio": tutor.bio,
        "experience": tutor.experience,
        "rating": tutor.rating,
        "teaching_mode": tutor.teaching_mode,
        "verified": tutor.verified,
        "subjects": [s.name for s in tutor.subjects],
        "topics": [t.name for t in tutor.topics],
        "languages": [l.language for l in tutor.languages],
        "availabilities": availabilities
    }

@router.put("/availability")
def update_tutor_availability(
    teacher_id: int = 1,
    date: str = "2026-08-23",
    start_time: str = "10:00",
    end_time: str = "11:00",
    status: str = "available",
    db: Session = Depends(get_db)
):
    avail = db.query(TutorAvailability).filter(
        TutorAvailability.teacher_id == teacher_id,
        TutorAvailability.date == date,
        TutorAvailability.start_time == start_time
    ).first()

    if not avail:
        avail = TutorAvailability(
            teacher_id=teacher_id,
            date=date,
            start_time=start_time,
            end_time=end_time,
            status=status
        )
        db.add(avail)
    else:
        avail.status = status

    db.commit()
    return {"status": "updated", "date": date, "slot_status": status}
