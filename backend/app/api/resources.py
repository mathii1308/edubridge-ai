from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.database.connection import get_db
from app.models.schemas import EducationalResource

router = APIRouter(prefix="/resources", tags=["Resources"])

class ResourceCreate(BaseModel):
    title: str
    description: str
    source_url: str
    source_name: Optional[str] = "Academic Resource"
    subject: str
    language: Optional[str] = "English"
    verified: Optional[bool] = True

class ResourceUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    source_url: Optional[str] = None
    source_name: Optional[str] = None
    subject: Optional[str] = None
    language: Optional[str] = None
    verified: Optional[bool] = None

@router.get("")
def list_resources(subject: str = None, language: str = None, db: Session = Depends(get_db)):
    query = db.query(EducationalResource)
    if subject:
        query = query.filter(EducationalResource.subject.ilike(f"%{subject}%"))
    if language:
        query = query.filter(EducationalResource.language.ilike(f"%{language}%"))

    resources = query.all()
    res = []
    for r in resources:
        res.append({
            "id": r.id,
            "title": r.title,
            "description": r.description,
            "source_url": r.source_url,
            "source_name": r.source_name,
            "subject": r.subject,
            "language": r.language,
            "verified": r.verified,
            "chunk_count": len(r.chunks) if hasattr(r, 'chunks') and r.chunks else 0
        })
    return res

@router.post("")
def create_resource(data: ResourceCreate, db: Session = Depends(get_db)):
    new_res = EducationalResource(
        title=data.title,
        description=data.description,
        source_url=data.source_url,
        source_name=data.source_name or "Academic Portal",
        subject=data.subject,
        language=data.language or "English",
        verified=data.verified if data.verified is not None else True
    )
    db.add(new_res)
    db.commit()
    db.refresh(new_res)
    return {
        "id": new_res.id,
        "title": new_res.title,
        "description": new_res.description,
        "source_url": new_res.source_url,
        "source_name": new_res.source_name,
        "subject": new_res.subject,
        "language": new_res.language,
        "verified": new_res.verified,
        "chunk_count": 0
    }

@router.put("/{resource_id}")
def update_resource(resource_id: int, data: ResourceUpdate, db: Session = Depends(get_db)):
    r = db.query(EducationalResource).filter(EducationalResource.id == resource_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Resource not found")

    if data.title is not None: r.title = data.title
    if data.description is not None: r.description = data.description
    if data.source_url is not None: r.source_url = data.source_url
    if data.source_name is not None: r.source_name = data.source_name
    if data.subject is not None: r.subject = data.subject
    if data.language is not None: r.language = data.language
    if data.verified is not None: r.verified = data.verified

    db.commit()
    db.refresh(r)
    return {
        "id": r.id,
        "title": r.title,
        "description": r.description,
        "source_url": r.source_url,
        "source_name": r.source_name,
        "subject": r.subject,
        "language": r.language,
        "verified": r.verified,
        "chunk_count": len(r.chunks) if hasattr(r, 'chunks') and r.chunks else 0
    }

@router.delete("/{resource_id}")
def delete_resource(resource_id: int, db: Session = Depends(get_db)):
    r = db.query(EducationalResource).filter(EducationalResource.id == resource_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Resource not found")

    db.delete(r)
    db.commit()
    return {"message": "Resource deleted successfully", "id": resource_id}

