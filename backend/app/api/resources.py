from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.schemas import EducationalResource

router = APIRouter(prefix="/resources", tags=["Resources"])

@router.get("")
def list_resources(subject: str = None, language: str = None, db: Session = Depends(get_db)):
    query = db.query(EducationalResource).filter(EducationalResource.verified == True)
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
            "chunk_count": len(r.chunks)
        })
    return res

@router.get("/{resource_id}")
def get_resource_detail(resource_id: int, db: Session = Depends(get_db)):
    r = db.query(EducationalResource).filter(EducationalResource.id == resource_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Resource not found")

    return {
        "id": r.id,
        "title": r.title,
        "description": r.description,
        "source_url": r.source_url,
        "source_name": r.source_name,
        "subject": r.subject,
        "language": r.language,
        "verified": r.verified,
        "chunks": [{"id": c.id, "content": c.content} for c in r.chunks]
    }

@router.post("")
def create_resource(
    title: str,
    description: str,
    subject: str,
    source_url: str = "",
    source_name: str = "Academic Faculty",
    language: str = "English",
    db: Session = Depends(get_db)
):
    r = EducationalResource(
        title=title,
        description=description,
        subject=subject,
        source_url=source_url or "https://edubridge.ai/resources",
        source_name=source_name,
        language=language,
        verified=True
    )
    db.add(r)
    db.commit()
    db.refresh(r)
    return {
        "id": r.id,
        "title": r.title,
        "description": r.description,
        "subject": r.subject,
        "source_url": r.source_url,
        "source_name": r.source_name,
        "language": r.language,
        "verified": r.verified
    }

@router.delete("/{resource_id}")
def delete_resource(resource_id: int, db: Session = Depends(get_db)):
    r = db.query(EducationalResource).filter(EducationalResource.id == resource_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Resource not found")
    db.delete(r)
    db.commit()
    return {"status": "success", "message": f"Resource {resource_id} deleted"}

