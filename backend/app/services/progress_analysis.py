from typing import Dict, List
from sqlalchemy.orm import Session
from app.models.schemas import StudentTopicProgress, Topic

class ProgressAnalysisService:
    @staticmethod
    def get_mastery_status(accuracy: float) -> str:
        if accuracy < 50.0:
            return "Needs Attention"
        elif accuracy < 70.0:
            return "Developing"
        elif accuracy < 85.0:
            return "Good"
        else:
            return "Strong"

    @staticmethod
    def analyze_student_progress(db: Session, student_id: int) -> Dict:
        records = db.query(StudentTopicProgress).filter(StudentTopicProgress.student_id == student_id).all()

        weak_topics = []
        strong_topics = []
        topic_scores = []
        overall_acc = 0.0

        if records:
            total_acc = sum(r.accuracy for r in records)
            overall_acc = round(total_acc / len(records), 1)

            for r in records:
                topic_name = r.topic.name if r.topic else f"Topic #{r.topic_id}"
                topic_scores.append({
                    "topic_id": r.topic_id,
                    "topic_name": topic_name,
                    "accuracy": r.accuracy,
                    "mastery_level": r.mastery_level,
                    "attempts": r.attempts
                })

                if r.accuracy < 55.0:
                    weak_topics.append({"name": topic_name, "accuracy": r.accuracy})
                elif r.accuracy >= 75.0:
                    strong_topics.append({"name": topic_name, "accuracy": r.accuracy})

        return {
            "overall_progress": overall_acc,
            "topic_scores": topic_scores,
            "weak_topics": weak_topics,
            "strong_topics": strong_topics,
            "recommended_action": f"Focus on reviewing {weak_topics[0]['name']} ({weak_topics[0]['accuracy']}%)" if weak_topics else "Maintain consistent practice across all subjects!"
        }
