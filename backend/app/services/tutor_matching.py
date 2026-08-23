from typing import List, Dict
from sqlalchemy.orm import Session
from app.models.schemas import TeacherProfile, StudentProfile

class TutorMatchingService:
    @staticmethod
    def calculate_match(
        db: Session,
        tutor: TeacherProfile,
        student: StudentProfile,
        req_subject: str,
        req_topic: str = None,
        req_language: str = "English",
        req_date: str = None
    ) -> Dict:
        """
        Calculates a deterministic multi-criteria match score (0 to 100%) between a student and a tutor.
        Formula:
        - Subject & Topic expertise: 40%
        - Language preference: 20%
        - Real-time availability: 20%
        - Learning level / Mode: 10%
        - Experience & Rating: 10%
        """
        score = 0.0
        reasons = []

        # 1. Subject & Topic expertise (40%)
        tutor_subject_names = [s.name.lower() for s in tutor.subjects]
        if req_subject.lower() in tutor_subject_names:
            score += 25.0
            reasons.append(f"Expert in {req_subject}")
            if req_topic:
                tutor_topic_names = [t.name.lower() for t in tutor.topics]
                if req_topic.lower() in tutor_topic_names:
                    score += 15.0
                    reasons.append(f"Specialized in {req_topic}")
                else:
                    score += 8.0
        else:
            score += 10.0

        # 2. Language Match (20%)
        tutor_languages = [l.language.lower() for l in tutor.languages]
        student_lang = (req_language or student.preferred_language or "English").lower()
        if student_lang in tutor_languages:
            score += 20.0
            reasons.append(f"Fluent in {req_language or student.preferred_language}")
        else:
            score += 5.0

        # 3. Availability Match (20%)
        availabilities = [a for a in tutor.availabilities if a.status == "available"]
        if req_date:
            date_avail = [a for a in availabilities if a.date == req_date]
            if date_avail:
                score += 20.0
                reasons.append(f"Has open slots on {req_date}")
            elif availabilities:
                score += 10.0
                reasons.append("Has upcoming available slots")
        elif availabilities:
            score += 20.0
            reasons.append("Immediate real-time availability")

        # 4. Mode / Level (10%)
        score += 10.0
        reasons.append(f"{tutor.teaching_mode} teaching mode supported")

        # 5. Rating & Experience (10%)
        rating_score = min(10.0, (tutor.rating / 5.0) * 10.0)
        score += rating_score
        if tutor.rating >= 4.8:
            reasons.append(f"Top rated tutor ({tutor.rating}★, {tutor.experience}+ yrs exp)")

        final_score = min(100.0, round(score, 1))

        return {
            "tutor_id": tutor.id,
            "user_id": tutor.user_id,
            "name": tutor.user.name if tutor.user else "Tutor",
            "bio": tutor.bio,
            "experience": tutor.experience,
            "rating": tutor.rating,
            "teaching_mode": tutor.teaching_mode,
            "verified": tutor.verified,
            "subjects": [s.name for s in tutor.subjects],
            "topics": [t.name for t in tutor.topics],
            "languages": [l.language for l in tutor.languages],
            "match_score": final_score,
            "match_reasons": reasons
        }
