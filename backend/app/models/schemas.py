import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, Table, JSON
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

# Association Tables
teacher_subjects = Table(
    'teacher_subjects',
    Base.metadata,
    Column('teacher_id', Integer, ForeignKey('teacher_profiles.id', ondelete="CASCADE"), primary_key=True),
    Column('subject_id', Integer, ForeignKey('subjects.id', ondelete="CASCADE"), primary_key=True)
)

teacher_topics = Table(
    'teacher_topics',
    Base.metadata,
    Column('teacher_id', Integer, ForeignKey('teacher_profiles.id', ondelete="CASCADE"), primary_key=True),
    Column('topic_id', Integer, ForeignKey('topics.id', ondelete="CASCADE"), primary_key=True)
)

saved_scholarships = Table(
    'saved_scholarships',
    Base.metadata,
    Column('student_id', Integer, ForeignKey('student_profiles.id', ondelete="CASCADE"), primary_key=True),
    Column('scholarship_id', Integer, ForeignKey('scholarships.id', ondelete="CASCADE"), primary_key=True)
)


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)  # student, teacher, admin
    email_verified = Column(Boolean, default=False)
    account_status = Column(String(20), default="active")  # active, unverified
    verification_token = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    student_profile = relationship("StudentProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    teacher_profile = relationship("TeacherProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")


class StudentProfile(Base):
    __tablename__ = 'student_profiles'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete="CASCADE"), unique=True, nullable=False)
    education_level = Column(String(50), default="High School")  # High School, Undergraduate, Postgraduate
    institution = Column(String(150), default="Government Higher Secondary School")
    preferred_language = Column(String(20), default="English")  # English, Tamil
    learning_level = Column(String(30), default="Intermediate")  # Beginner, Intermediate, Advanced
    state = Column(String(50), default="Tamil Nadu")
    course = Column(String(100), default="Science Standard 12")
    academic_score = Column(Float, default=82.5)
    income_range = Column(Float, default=180000.0)  # Annual income in INR
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="student_profile")
    quiz_attempts = relationship("QuizAttempt", back_populates="student", cascade="all, delete-orphan")
    bookings = relationship("TutorBooking", back_populates="student", cascade="all, delete-orphan")
    topic_progress = relationship("StudentTopicProgress", back_populates="student", cascade="all, delete-orphan")
    saved_scholarships_rel = relationship("Scholarship", secondary=saved_scholarships, backref="saved_by_students")


class TeacherProfile(Base):
    __tablename__ = 'teacher_profiles'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete="CASCADE"), unique=True, nullable=False)
    bio = Column(Text, default="Passionate educator dedicated to personalized concept mastery.")
    experience = Column(Integer, default=5)  # Years
    rating = Column(Float, default=4.8)
    teaching_mode = Column(String(20), default="Online")  # Online, In-Person, Both
    verified = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="teacher_profile")
    subjects = relationship("Subject", secondary=teacher_subjects, backref="teachers")
    topics = relationship("Topic", secondary=teacher_topics, backref="teachers")
    languages = relationship("TeacherLanguage", back_populates="teacher", cascade="all, delete-orphan")
    availabilities = relationship("TutorAvailability", back_populates="teacher", cascade="all, delete-orphan")
    bookings = relationship("TutorBooking", back_populates="teacher", cascade="all, delete-orphan")


class TeacherLanguage(Base):
    __tablename__ = 'teacher_languages'

    id = Column(Integer, primary_key=True, index=True)
    teacher_id = Column(Integer, ForeignKey('teacher_profiles.id', ondelete="CASCADE"), nullable=False)
    language = Column(String(30), nullable=False)

    teacher = relationship("TeacherProfile", back_populates="languages")


class Subject(Base):
    __tablename__ = 'subjects'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)

    topics = relationship("Topic", back_populates="subject", cascade="all, delete-orphan")


class Topic(Base):
    __tablename__ = 'topics'

    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey('subjects.id', ondelete="CASCADE"), nullable=False)
    name = Column(String(100), nullable=False)

    subject = relationship("Subject", back_populates="topics")
    progress_records = relationship("StudentTopicProgress", back_populates="topic", cascade="all, delete-orphan")


class TutorAvailability(Base):
    __tablename__ = 'tutor_availability'

    id = Column(Integer, primary_key=True, index=True)
    teacher_id = Column(Integer, ForeignKey('teacher_profiles.id', ondelete="CASCADE"), nullable=False)
    date = Column(String(10), nullable=False)  # YYYY-MM-DD
    start_time = Column(String(8), nullable=False)  # HH:MM
    end_time = Column(String(8), nullable=False)  # HH:MM
    status = Column(String(20), default="available")  # available, reserved, booked, unavailable

    teacher = relationship("TeacherProfile", back_populates="availabilities")


class TutorBooking(Base):
    __tablename__ = 'tutor_bookings'

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey('student_profiles.id', ondelete="CASCADE"), nullable=False)
    teacher_id = Column(Integer, ForeignKey('teacher_profiles.id', ondelete="CASCADE"), nullable=False)
    subject_name = Column(String(100), nullable=False)
    topic_name = Column(String(100), nullable=False)
    scheduled_date = Column(String(10), nullable=False)
    start_time = Column(String(8), nullable=False)
    end_time = Column(String(8), nullable=False)
    student_requirement = Column(Text, nullable=True)
    status = Column(String(20), default="requested")  # requested, accepted, rejected, cancelled, completed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    student = relationship("StudentProfile", back_populates="bookings")
    teacher = relationship("TeacherProfile", back_populates="bookings")
    messages = relationship("BookingMessage", back_populates="booking", cascade="all, delete-orphan")


class BookingMessage(Base):
    __tablename__ = 'booking_messages'

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey('tutor_bookings.id', ondelete="CASCADE"), nullable=False)
    sender_id = Column(Integer, ForeignKey('users.id', ondelete="CASCADE"), nullable=False)
    sender_role = Column(String(20), nullable=False)  # student, teacher
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    read = Column(Boolean, default=False)

    booking = relationship("TutorBooking", back_populates="messages")
    sender = relationship("User")


class EducationalResource(Base):
    __tablename__ = 'educational_resources'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    source_url = Column(String(300), nullable=False)
    source_name = Column(String(100), nullable=False)
    subject = Column(String(100), nullable=False)
    language = Column(String(30), default="English")
    file_url = Column(String(300), nullable=True)
    verified = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    chunks = relationship("ResourceChunk", back_populates="resource", cascade="all, delete-orphan")


class ResourceChunk(Base):
    __tablename__ = 'resource_chunks'

    id = Column(Integer, primary_key=True, index=True)
    resource_id = Column(Integer, ForeignKey('educational_resources.id', ondelete="CASCADE"), nullable=False)
    content = Column(Text, nullable=False)

    resource = relationship("EducationalResource", back_populates="chunks")


class Quiz(Base):
    __tablename__ = 'quizzes'

    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String(100), nullable=False)
    topic = Column(String(100), nullable=False)
    difficulty = Column(String(20), default="Medium")  # Easy, Medium, Hard
    created_by = Column(String(50), default="System AI")

    questions = relationship("QuizQuestion", back_populates="quiz", cascade="all, delete-orphan")
    attempts = relationship("QuizAttempt", back_populates="quiz", cascade="all, delete-orphan")


class QuizQuestion(Base):
    __tablename__ = 'quiz_questions'

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey('quizzes.id', ondelete="CASCADE"), nullable=False)
    question = Column(Text, nullable=False)
    options = Column(JSON, nullable=False)  # list of strings
    correct_answer = Column(Integer, nullable=False)  # index of correct option
    explanation = Column(Text, nullable=False)

    quiz = relationship("Quiz", back_populates="questions")


class QuizAttempt(Base):
    __tablename__ = 'quiz_attempts'

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey('student_profiles.id', ondelete="CASCADE"), nullable=False)
    quiz_id = Column(Integer, ForeignKey('quizzes.id', ondelete="CASCADE"), nullable=False)
    score = Column(Float, nullable=False)
    started_at = Column(DateTime, default=datetime.datetime.utcnow)
    completed_at = Column(DateTime, default=datetime.datetime.utcnow)

    student = relationship("StudentProfile", back_populates="quiz_attempts")
    quiz = relationship("Quiz", back_populates="attempts")
    answers = relationship("StudentAnswer", back_populates="attempt", cascade="all, delete-orphan")


class StudentAnswer(Base):
    __tablename__ = 'student_answers'

    id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey('quiz_attempts.id', ondelete="CASCADE"), nullable=False)
    question_id = Column(Integer, ForeignKey('quiz_questions.id', ondelete="CASCADE"), nullable=False)
    answer = Column(Integer, nullable=False)
    is_correct = Column(Boolean, nullable=False)
    time_taken = Column(Integer, default=15)  # Seconds

    attempt = relationship("QuizAttempt", back_populates="answers")


class StudentTopicProgress(Base):
    __tablename__ = 'student_topic_progress'

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey('student_profiles.id', ondelete="CASCADE"), nullable=False)
    topic_id = Column(Integer, ForeignKey('topics.id', ondelete="CASCADE"), nullable=False)
    accuracy = Column(Float, default=0.0)
    attempts = Column(Integer, default=0)
    mastery_level = Column(String(30), default="Needs Attention")  # Needs Attention, Developing, Good, Strong
    last_updated = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    student = relationship("StudentProfile", back_populates="topic_progress")
    topic = relationship("Topic", back_populates="progress_records")


class Scholarship(Base):
    __tablename__ = 'scholarships'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    provider = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    official_url = Column(String(300), nullable=False)
    source_url = Column(String(300), nullable=False)
    application_start = Column(String(10), nullable=True)
    application_deadline = Column(String(10), nullable=False)
    academic_year = Column(String(20), default="2026-2027")
    education_level = Column(String(50), nullable=False)
    courses = Column(JSON, nullable=False)  # list of strings
    states = Column(JSON, nullable=False)  # list of strings or ["All"]
    min_percentage = Column(Float, default=60.0)
    max_income = Column(Float, default=250000.0)
    category_requirements = Column(String(100), default="All Categories")
    gender_requirements = Column(String(50), default="All")
    disability_requirements = Column(String(50), default="None")
    benefits = Column(Text, nullable=False)
    documents_required = Column(JSON, nullable=False)
    status = Column(String(20), default="Active")
    last_verified_at = Column(DateTime, default=datetime.datetime.utcnow)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    sources = relationship("ScholarshipSource", back_populates="scholarship", cascade="all, delete-orphan")


class ScholarshipSource(Base):
    __tablename__ = 'scholarship_sources'

    id = Column(Integer, primary_key=True, index=True)
    scholarship_id = Column(Integer, ForeignKey('scholarships.id', ondelete="CASCADE"), nullable=False)
    source_name = Column(String(100), nullable=False)
    source_url = Column(String(300), nullable=False)
    last_checked_at = Column(DateTime, default=datetime.datetime.utcnow)
    verification_status = Column(String(20), default="VERIFIED")

    scholarship = relationship("Scholarship", back_populates="sources")


class Notification(Base):
    __tablename__ = 'notifications'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete="CASCADE"), nullable=False)
    type = Column(String(50), nullable=False)  # booking, scholarship, progress, system
    title = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="notifications")
