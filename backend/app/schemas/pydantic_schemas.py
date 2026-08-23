from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime

# Auth Schemas
class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    role: str  # student, teacher, admin
    preferred_language: Optional[str] = "English"
    learning_level: Optional[str] = "Intermediate"

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    email_verified: bool = False
    account_status: str = "active"
    created_at: datetime
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Student Profile Schema
class StudentProfileSchema(BaseModel):
    id: int
    user_id: int
    education_level: str
    institution: str
    preferred_language: str
    learning_level: str
    state: str
    course: str
    academic_score: float
    income_range: float
    class Config:
        from_attributes = True

class StudentProfileUpdate(BaseModel):
    education_level: Optional[str] = None
    institution: Optional[str] = None
    preferred_language: Optional[str] = None
    learning_level: Optional[str] = None
    state: Optional[str] = None
    course: Optional[str] = None
    academic_score: Optional[float] = None
    income_range: Optional[float] = None

# AI Chat Schemas
class AIChatRequest(BaseModel):
    message: str
    language: Optional[str] = "English"
    learning_level: Optional[str] = "Intermediate"
    subject: Optional[str] = None
    topic: Optional[str] = None
    action_type: Optional[str] = "explain"  # explain, simplify, example, step_by_step, test, struggle
    reference_text: Optional[str] = None
    reference_title: Optional[str] = None


class CitationSchema(BaseModel):
    title: str
    source_name: str
    source_url: str
    snippet: str

class AIChatResponse(BaseModel):
    reply: str
    subject: Optional[str] = None
    topic: Optional[str] = None
    difficulty: Optional[str] = None
    learning_gap: Optional[str] = None
    confidence: float
    needs_tutor: bool
    citations: List[CitationSchema] = []

# Tutor Match Schemas
class TutorMatchRequest(BaseModel):
    subject: str
    topic: Optional[str] = None
    language: Optional[str] = "English"
    date: Optional[str] = None

class TutorResponse(BaseModel):
    id: int
    user_id: int
    name: str
    bio: str
    experience: int
    rating: float
    teaching_mode: str
    verified: bool
    subjects: List[str]
    topics: List[str]
    languages: List[str]
    match_score: Optional[float] = 0.0
    match_reasons: Optional[List[str]] = []
    class Config:
        from_attributes = True

# Booking Schema
class BookingCreate(BaseModel):
    teacher_id: int
    subject_name: str
    topic_name: str
    scheduled_date: str
    start_time: str
    end_time: str
    student_requirement: Optional[str] = None

class BookingResponse(BaseModel):
    id: int
    student_id: int
    teacher_id: int
    teacher_name: Optional[str] = None
    student_name: Optional[str] = None
    subject_name: str
    topic_name: str
    scheduled_date: str
    start_time: str
    end_time: str
    student_requirement: Optional[str] = None
    status: str
    created_at: datetime
    class Config:
        from_attributes = True

class BookingMessageCreate(BaseModel):
    message: str

class BookingMessageResponse(BaseModel):
    id: int
    booking_id: int
    sender_id: int
    sender_name: Optional[str] = None
    sender_role: str
    message: str
    created_at: datetime
    read: bool
    class Config:
        from_attributes = True

# Quiz Schemas
class QuizQuestionSchema(BaseModel):
    id: int
    question: str
    options: List[str]
    explanation: str

class QuizDetailSchema(BaseModel):
    id: int
    subject: str
    topic: str
    difficulty: str
    questions: List[QuizQuestionSchema]

class QuizSubmitRequest(BaseModel):
    quiz_id: int
    answers: List[dict]  # [{"question_id": 1, "answer": 2, "time_taken": 12}]

class QuizResultResponse(BaseModel):
    attempt_id: int
    score: float
    total_questions: int
    correct_count: int
    mastery_level: str
    weak_topics: List[str]
    recommendation: str

# Scholarship Schemas
class ScholarshipResponse(BaseModel):
    id: int
    name: str
    provider: str
    description: str
    official_url: str
    source_url: str
    application_start: Optional[str]
    application_deadline: str
    academic_year: str
    education_level: str
    courses: List[str]
    states: List[str]
    min_percentage: float
    max_income: float
    benefits: str
    documents_required: List[str]
    status: str
    last_verified_at: datetime
    is_eligible: Optional[bool] = True
    match_percentage: Optional[float] = 100.0
    eligibility_reasons: Optional[List[str]] = []
    saved: Optional[bool] = False
    class Config:
        from_attributes = True

# Notification Schema
class NotificationResponse(BaseModel):
    id: int
    type: str
    title: str
    message: str
    read: bool
    created_at: datetime
    class Config:
        from_attributes = True
