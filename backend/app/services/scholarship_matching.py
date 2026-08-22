from typing import Dict, List
from app.models.schemas import Scholarship, StudentProfile

class ScholarshipMatchingService:
    @staticmethod
    def evaluate_eligibility(scholarship: Scholarship, student: StudentProfile) -> Dict:
        """
        Evaluates deterministic boolean eligibility rules for a student profile against a verified scholarship.
        Does NOT rely on LLMs for final eligibility criteria decisions.
        """
        reasons = []
        is_eligible = True
        match_score = 100.0

        # Rule 1: Academic Score / Min Percentage
        if student.academic_score >= scholarship.min_percentage:
            reasons.append(f"✓ Academic score ({student.academic_score}%) meets minimum requirement ({scholarship.min_percentage}%)")
        else:
            is_eligible = False
            match_score -= 30.0
            reasons.append(f"✗ Academic score ({student.academic_score}%) below required threshold ({scholarship.min_percentage}%)")

        # Rule 2: Annual Family Income
        if student.income_range <= scholarship.max_income:
            reasons.append(f"✓ Family income (₹{student.income_range:,.0f}) is within maximum ceiling (₹{scholarship.max_income:,.0f})")
        else:
            is_eligible = False
            match_score -= 35.0
            reasons.append(f"✗ Family income (₹{student.income_range:,.0f}) exceeds ceiling (₹{scholarship.max_income:,.0f})")

        # Rule 3: State Domicile
        sch_states = scholarship.states if isinstance(scholarship.states, list) else []
        if "All" in sch_states or student.state in sch_states:
            reasons.append(f"✓ State domicile ({student.state}) is eligible")
        else:
            is_eligible = False
            match_score -= 20.0
            reasons.append(f"✗ Restricted to states: {', '.join(sch_states)} (Your state: {student.state})")

        # Rule 4: Course / Education Level
        sch_courses = scholarship.courses if isinstance(scholarship.courses, list) else []
        course_match = any(student.course.lower() in c.lower() or c.lower() in student.course.lower() for c in sch_courses) or "All" in sch_courses
        if course_match or scholarship.education_level.lower() == student.education_level.lower():
            reasons.append(f"✓ Course level ({student.course}) matches program criteria")
        else:
            match_score -= 15.0
            reasons.append(f"⚠ Course criteria check advised: {', '.join(sch_courses)}")

        final_match_score = max(0.0, min(100.0, round(match_score, 1)))

        return {
            "scholarship_id": scholarship.id,
            "is_eligible": is_eligible,
            "match_percentage": final_match_score,
            "reasons": reasons
        }
