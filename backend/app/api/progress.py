from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.schemas import StudentProfile, StudentTopicProgress
from app.services.progress_analysis import ProgressAnalysisService

router = APIRouter(prefix="/progress", tags=["Progress Analytics"])

@router.get("")
def get_student_overall_progress(student_id: int = 1, db: Session = Depends(get_db)):
    student = db.query(StudentProfile).filter(StudentProfile.id == student_id).first()
    if not student:
        student = db.query(StudentProfile).first()

    analysis = ProgressAnalysisService.analyze_student_progress(db, student.id if student else 1)

    # Historical trend simulation for Recharts Line Chart
    history_trend = [
        {"week": "Week 1", "Mathematics": 60, "Physics": 70, "Chemistry": 55},
        {"week": "Week 2", "Mathematics": 65, "Physics": 75, "Chemistry": 60},
        {"week": "Week 3", "Mathematics": 72, "Physics": 80, "Chemistry": 62},
        {"week": "Week 4", "Mathematics": 78, "Physics": 85, "Chemistry": 65},
    ]

    subject_scores = [
        {"subject": "Mathematics", "score": 78, "weak_count": 1, "strong_count": 1},
        {"subject": "Physics", "score": 85, "weak_count": 0, "strong_count": 2},
        {"subject": "Chemistry", "score": 65, "weak_count": 1, "strong_count": 0},
    ]

    return {
        "overall_progress": analysis["overall_progress"],
        "subject_scores": subject_scores,
        "weak_topics": [
            {"topic": "Probability", "score": 42, "subject": "Mathematics", "recommendation": "Review conditional probability formula"},
            {"topic": "Trigonometry", "score": 55, "subject": "Mathematics", "recommendation": "Practice sine & cosine law identities"}
        ],
        "strong_topics": [
            {"topic": "Wave Optics & Light", "score": 85, "subject": "Physics"},
            {"topic": "Calculus & Derivatives", "score": 78, "subject": "Mathematics"}
        ],
        "history_trend": history_trend,
        "recommended_action": analysis["recommended_action"]
    }

@router.get("/topics")
def get_topic_progress_list(student_id: int = 1, db: Session = Depends(get_db)):
    records = db.query(StudentTopicProgress).filter(StudentTopicProgress.student_id == student_id).all()
    res = []
    for r in records:
        res.append({
            "topic_id": r.topic_id,
            "topic_name": r.topic.name if r.topic else "Topic",
            "accuracy": r.accuracy,
            "attempts": r.attempts,
            "mastery_level": r.mastery_level
        })
    return res
