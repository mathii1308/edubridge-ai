from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.connection import get_db
from app.models.schemas import Scholarship, StudentProfile, saved_scholarships
from app.schemas.pydantic_schemas import ScholarshipResponse
from app.services.scholarship_matching import ScholarshipMatchingService

router = APIRouter(prefix="/scholarships", tags=["Scholarships"])

@router.get("", response_model=List[ScholarshipResponse])
def get_all_scholarships(db: Session = Depends(get_db)):
    scholarships = db.query(Scholarship).all()
    res = []
    for s in scholarships:
        res.append({
            "id": s.id,
            "name": s.name,
            "provider": s.provider,
            "description": s.description,
            "official_url": s.official_url,
            "source_url": s.source_url,
            "application_start": s.application_start,
            "application_deadline": s.application_deadline,
            "academic_year": s.academic_year,
            "education_level": s.education_level,
            "courses": s.courses,
            "states": s.states,
            "min_percentage": s.min_percentage,
            "max_income": s.max_income,
            "benefits": s.benefits,
            "documents_required": s.documents_required,
            "status": s.status,
            "last_verified_at": s.last_verified_at,
            "is_eligible": True,
            "match_percentage": 95.0,
            "eligibility_reasons": ["Verified Official Source"]
        })
    return res

@router.get("/recommended", response_model=List[ScholarshipResponse])
def get_recommended_scholarships(student_id: int = 1, db: Session = Depends(get_db)):
    student = db.query(StudentProfile).filter(StudentProfile.id == student_id).first()
    if not student:
        student = db.query(StudentProfile).first()

    scholarships = db.query(Scholarship).filter(Scholarship.status == "Active").all()
    results = []

    for s in scholarships:
        elig_data = ScholarshipMatchingService.evaluate_eligibility(s, student)

        results.append({
            "id": s.id,
            "name": s.name,
            "provider": s.provider,
            "description": s.description,
            "official_url": s.official_url,
            "source_url": s.source_url,
            "application_start": s.application_start,
            "application_deadline": s.application_deadline,
            "academic_year": s.academic_year,
            "education_level": s.education_level,
            "courses": s.courses,
            "states": s.states,
            "min_percentage": s.min_percentage,
            "max_income": s.max_income,
            "benefits": s.benefits,
            "documents_required": s.documents_required,
            "status": s.status,
            "last_verified_at": s.last_verified_at,
            "is_eligible": elig_data["is_eligible"],
            "match_percentage": elig_data["match_percentage"],
            "eligibility_reasons": elig_data["reasons"]
        })

    # Sort by match percentage descending
    results.sort(key=lambda x: x["match_percentage"], reverse=True)
    return results

@router.get("/{scholarship_id}")
def get_scholarship_detail(scholarship_id: int, student_id: int = 1, db: Session = Depends(get_db)):
    s = db.query(Scholarship).filter(Scholarship.id == scholarship_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Scholarship not found")

    student = db.query(StudentProfile).filter(StudentProfile.id == student_id).first()
    if not student:
        student = db.query(StudentProfile).first()

    elig_data = ScholarshipMatchingService.evaluate_eligibility(s, student)

    return {
        "id": s.id,
        "name": s.name,
        "provider": s.provider,
        "description": s.description,
        "official_url": s.official_url,
        "source_url": s.source_url,
        "application_start": s.application_start,
        "application_deadline": s.application_deadline,
        "academic_year": s.academic_year,
        "education_level": s.education_level,
        "courses": s.courses,
        "states": s.states,
        "min_percentage": s.min_percentage,
        "max_income": s.max_income,
        "benefits": s.benefits,
        "documents_required": s.documents_required,
        "status": s.status,
        "last_verified_at": s.last_verified_at,
        "sources": [{"name": src.source_name, "url": src.source_url, "status": src.verification_status} for src in s.sources],
        "is_eligible": elig_data["is_eligible"],
        "match_percentage": elig_data["match_percentage"],
        "eligibility_reasons": elig_data["reasons"]
    }

@router.post("/{scholarship_id}/save")
def toggle_save_scholarship(scholarship_id: int, student_id: int = 1, db: Session = Depends(get_db)):
    student = db.query(StudentProfile).filter(StudentProfile.id == student_id).first()
    sch = db.query(Scholarship).filter(Scholarship.id == scholarship_id).first()
    if not student or not sch:
        raise HTTPException(status_code=404, detail="Student or Scholarship not found")

    if sch in student.saved_scholarships_rel:
        student.saved_scholarships_rel.remove(sch)
        saved = False
    else:
        student.saved_scholarships_rel.append(sch)
        saved = True

    db.commit()
    return {"scholarship_id": scholarship_id, "saved": saved}
