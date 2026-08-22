from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.pydantic_schemas import AIChatRequest, AIChatResponse
from app.services.ai_service import AIService

router = APIRouter(prefix="/ai", tags=["AI Tutor"])

@router.post("/analyze-requirement")
def analyze_student_requirement(req: AIChatRequest):
    return AIService.analyze_requirement(req.message)

@router.post("/chat", response_model=AIChatResponse)
def chat_with_ai(req: AIChatRequest, db: Session = Depends(get_db)):
    response = AIService.generate_tutor_response(
        db=db,
        message=req.message,
        language=req.language or "English",
        learning_level=req.learning_level or "Intermediate",
        subject=req.subject,
        topic=req.topic,
        action_type=req.action_type or "explain"
    )
    return response

@router.post("/explain", response_model=AIChatResponse)
def explain_concept(req: AIChatRequest, db: Session = Depends(get_db)):
    req.action_type = "step_by_step"
    return chat_with_ai(req, db)

@router.post("/generate-practice")
def generate_practice_question(subject: str = "Mathematics", topic: str = "Probability"):
    return {
        "question": f"Given event A and B with P(A) = 0.5, P(B) = 0.4, and P(A ∩ B) = 0.2. What is P(A|B)?",
        "options": ["0.40", "0.50", "0.20", "0.80"],
        "correct_answer": 1,
        "explanation": "P(A|B) = P(A ∩ B) / P(B) = 0.2 / 0.4 = 0.50.",
        "subject": subject,
        "topic": topic
    }

