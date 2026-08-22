import datetime
from sqlalchemy.orm import Session
from app.models.schemas import (
    Base, User, StudentProfile, TeacherProfile, TeacherLanguage,
    Subject, Topic, TutorAvailability, TutorBooking, EducationalResource,
    ResourceChunk, Quiz, QuizQuestion, QuizAttempt, StudentAnswer,
    StudentTopicProgress, Scholarship, ScholarshipSource, Notification
)
from app.database.connection import engine, SessionLocal

def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    # Check if already seeded
    if db.query(User).filter(User.email == "student@edubridge.ai").first():
        print("Database already seeded.")
        db.close()
        return

    print("Seeding database with production demo dataset...")

    # Standard Hashed Password representation for 'password123'
    DEMO_PASS_HASH = "pbkdf2_sha256$260000$demo_salt$5f4dcc3b5aa765d61d8327deb882cf99"

    # 1. Users
    student_user = User(name="Ananya Sharma", email="student@edubridge.ai", password_hash=DEMO_PASS_HASH, role="student")
    tutor_user1 = User(name="Dr. Rajesh Kumar", email="tutor.rajesh@edubridge.ai", password_hash=DEMO_PASS_HASH, role="teacher")
    tutor_user2 = User(name="Prof. Lakshmi Priya", email="tutor.lakshmi@edubridge.ai", password_hash=DEMO_PASS_HASH, role="teacher")
    tutor_user3 = User(name="Karthik Sundaram", email="tutor.karthik@edubridge.ai", password_hash=DEMO_PASS_HASH, role="teacher")
    admin_user = User(name="EduBridge Admin", email="admin@edubridge.ai", password_hash=DEMO_PASS_HASH, role="admin")

    db.add_all([student_user, tutor_user1, tutor_user2, tutor_user3, admin_user])
    db.commit()

    # 2. Student Profile
    student_profile = StudentProfile(
        user_id=student_user.id,
        education_level="High School",
        institution="Government Higher Secondary School, Chennai",
        preferred_language="English",
        learning_level="Intermediate",
        state="Tamil Nadu",
        course="Class 12 Higher Secondary Science",
        academic_score=84.5,
        income_range=180000.0
    )
    db.add(student_profile)
    db.commit()

    # 3. Teacher Profiles
    t1 = TeacherProfile(
        user_id=tutor_user1.id,
        bio="Senior Mathematics lecturer with 12+ years experience simplifying Calculus & Probability for competitive exams.",
        experience=12,
        rating=4.9,
        teaching_mode="Online",
        verified=True
    )
    t2 = TeacherProfile(
        user_id=tutor_user2.id,
        bio="Physics PhD Researcher specializing in Quantum Mechanics, Optics, and Electromagnetism with bilingual proficiency (English & Tamil).",
        experience=8,
        rating=4.85,
        teaching_mode="Both",
        verified=True
    )
    t3 = TeacherProfile(
        user_id=tutor_user3.id,
        bio="Chemistry Educator and Olympiad Mentor focused on Organic Chemistry reaction mechanisms and Physical Chemistry concepts.",
        experience=6,
        rating=4.75,
        teaching_mode="Online",
        verified=True
    )
    db.add_all([t1, t2, t3])
    db.commit()

    # Teacher Languages
    db.add_all([
        TeacherLanguage(teacher_id=t1.id, language="English"),
        TeacherLanguage(teacher_id=t1.id, language="Tamil"),
        TeacherLanguage(teacher_id=t2.id, language="English"),
        TeacherLanguage(teacher_id=t2.id, language="Tamil"),
        TeacherLanguage(teacher_id=t3.id, language="English")
    ])

    # 4. Subjects & Topics
    math = Subject(name="Mathematics")
    physics = Subject(name="Physics")
    chemistry = Subject(name="Chemistry")
    db.add_all([math, physics, chemistry])
    db.commit()

    top_prob = Topic(subject_id=math.id, name="Probability")
    top_trig = Topic(subject_id=math.id, name="Trigonometry")
    top_calc = Topic(subject_id=math.id, name="Calculus & Derivatives")
    top_optics = Topic(subject_id=physics.id, name="Wave Optics & Light")
    top_elec = Topic(subject_id=physics.id, name="Electromagnetism")
    top_org = Topic(subject_id=chemistry.id, name="Organic Reaction Mechanisms")
    top_thermo = Topic(subject_id=chemistry.id, name="Thermodynamics")

    db.add_all([top_prob, top_trig, top_calc, top_optics, top_elec, top_org, top_thermo])
    db.commit()

    # Link Tutors to Subjects & Topics
    t1.subjects.extend([math])
    t1.topics.extend([top_prob, top_trig, top_calc])
    t2.subjects.extend([physics, math])
    t2.topics.extend([top_optics, top_elec, top_trig])
    t3.subjects.extend([chemistry])
    t3.topics.extend([top_org, top_thermo])
    db.commit()

    # 5. Real-Time Tutor Availabilities
    today_str = datetime.date.today().isoformat()
    tomorrow_str = (datetime.date.today() + datetime.timedelta(days=1)).isoformat()
    day_after_str = (datetime.date.today() + datetime.timedelta(days=2)).isoformat()

    slots = [
        # Dr. Rajesh
        TutorAvailability(teacher_id=t1.id, date=today_str, start_time="16:00", end_time="17:00", status="available"),
        TutorAvailability(teacher_id=t1.id, date=today_str, start_time="17:30", end_time="18:30", status="available"),
        TutorAvailability(teacher_id=t1.id, date=tomorrow_str, start_time="10:00", end_time="11:00", status="available"),
        # Prof. Lakshmi
        TutorAvailability(teacher_id=t2.id, date=today_str, start_time="18:00", end_time="19:00", status="available"),
        TutorAvailability(teacher_id=t2.id, date=tomorrow_str, start_time="15:00", end_time="16:00", status="available"),
        # Karthik
        TutorAvailability(teacher_id=t3.id, date=tomorrow_str, start_time="11:00", end_time="12:00", status="available"),
        TutorAvailability(teacher_id=t3.id, date=day_after_str, start_time="14:00", end_time="15:00", status="available"),
    ]
    db.add_all(slots)
    db.commit()

    # 6. Existing Booking (Sample)
    booking1 = TutorBooking(
        student_id=student_profile.id,
        teacher_id=t1.id,
        subject_name="Mathematics",
        topic_name="Probability",
        scheduled_date=tomorrow_str,
        start_time="10:00",
        end_time="11:00",
        status="accepted"
    )
    db.add(booking1)
    db.commit()

    # 7. Educational Knowledge Base Resources (Open Textbook Grounding Engine)
    r1 = EducationalResource(
        title="OpenStax University Mathematics: Probability and Combinatorics",
        description="Comprehensive open educational resource detailing sample spaces, conditional probability, and Bayes theorem.",
        source_url="https://openstax.org/details/books/introductory-statistics",
        source_name="OpenStax Educational Initiative",
        subject="Mathematics",
        language="English",
        verified=True
    )
    r2 = EducationalResource(
        title="NCERT Standard 12 Mathematics — Probability Fundamentals",
        description="Official open curriculum textbook covering independent events, multiplication rule of probability, and random variables.",
        source_url="https://ncert.nic.in/textbook.php?lemh1=0-13",
        source_name="NCERT Official Repository",
        subject="Mathematics",
        language="English",
        verified=True
    )
    r3 = EducationalResource(
        title="தமிழ்நாடு பாடநூல்: கணிதம் 12 — நிகழ்தகவு கோட்பாடு (Probability Theory in Tamil)",
        description="Tamil Nadu State Board Standard 12 Mathematics Textbook explaining conditional probability and Bayes theorem in clear Tamil.",
        source_url="https://www.textbooksonline.tn.nic.in/std12_maths_tam.html",
        source_name="Tamil Nadu School Education Department",
        subject="Mathematics",
        language="Tamil",
        verified=True
    )
    r4 = EducationalResource(
        title="Open Physics: Wave Optics and Huygens Principle",
        description="Grounded Physics curriculum on wave fronts, Young's double slit interference, and diffraction grating.",
        source_url="https://openstax.org/details/books/university-physics-volume-3",
        source_name="OpenStax Physics Foundation",
        subject="Physics",
        language="English",
        verified=True
    )

    db.add_all([r1, r2, r3, r4])
    db.commit()

    # Resource Chunks for RAG Retrieval
    c1 = ResourceChunk(
        resource_id=r1.id,
        content="Conditional Probability P(A|B) represents the likelihood of event A occurring given that event B has already occurred. Formula: P(A|B) = P(A ∩ B) / P(B), provided P(B) > 0. A key misconception is confusing P(A|B) with P(B|A). For independent events, P(A ∩ B) = P(A) * P(B)."
    )
    c2 = ResourceChunk(
        resource_id=r2.id,
        content="Bayes' Theorem provides a mathematical framework for updating conditional probabilities based on new evidence. Formula: P(A_i|B) = [P(A_i) * P(B|A_i)] / Σ [P(A_k) * P(B|A_k)]. Step-by-step resolution requires identifying prior probabilities P(A_i) and likelihoods P(B|A_i)."
    )
    c3 = ResourceChunk(
        resource_id=r3.id,
        content="சார்பு நிகழ்தகவு (Conditional Probability) என்பது B என்ற நிகழ்ச்சி ஏற்கனவே நடந்த நிலையில், A என்ற நிகழ்ச்சி நடப்பதற்கான நிகழ்தகவு ஆகும். சூத்திரம்: P(A|B) = P(A ∩ B) / P(B). இரு நிகழ்ச்சிகள் சார்பற்றவை எனில் P(A ∩ B) = P(A) * P(B)."
    )
    c4 = ResourceChunk(
        resource_id=r4.id,
        content="Huygens Principle states that every point on a primary wave front serves as a source of secondary spherical wavelets. The envelope of these wavelets determines the position of the wave front at a later time. Interference fringe width β = (λ * D) / d."
    )

    db.add_all([c1, c2, c3, c4])
    db.commit()

    # 8. Quizzes & Questions
    q1 = Quiz(subject="Mathematics", topic="Probability", difficulty="Medium", created_by="EduBridge Curriculum Engine")
    db.add(q1)
    db.commit()

    qq1 = QuizQuestion(
        quiz_id=q1.id,
        question="If P(A) = 0.6, P(B) = 0.5, and P(A ∩ B) = 0.3, what is the conditional probability P(A|B)?",
        options=["0.30", "0.50", "0.60", "0.83"],
        correct_answer=2, # index 2 = 0.60
        explanation="Using conditional probability formula P(A|B) = P(A ∩ B) / P(B) = 0.3 / 0.5 = 0.60."
    )
    qq2 = QuizQuestion(
        quiz_id=q1.id,
        question="A bag contains 4 red balls and 6 blue balls. Two balls are drawn successively without replacement. What is the probability that both are red?",
        options=["16/100", "2/15", "4/25", "1/5"],
        correct_answer=1, # index 1 = 2/15
        explanation="First draw: 4/10. Second draw: 3/9. Total probability = (4/10) * (3/9) = 12/90 = 2/15."
    )
    qq3 = QuizQuestion(
        quiz_id=q1.id,
        question="If two events A and B are independent, which of the following is true?",
        options=["P(A|B) = P(A)", "P(A ∩ B) = 0", "P(A ∪ B) = 1", "P(A|B) = P(B)"],
        correct_answer=0, # index 0
        explanation="By definition of independence, event B occurring gives no information about event A, so P(A|B) = P(A)."
    )

    db.add_all([qq1, qq2, qq3])
    db.commit()

    # 9. Student Topic Progress
    p1 = StudentTopicProgress(student_id=student_profile.id, topic_id=top_prob.id, accuracy=42.0, attempts=5, mastery_level="Needs Attention")
    p2 = StudentTopicProgress(student_id=student_profile.id, topic_id=top_trig.id, accuracy=55.0, attempts=4, mastery_level="Developing")
    p3 = StudentTopicProgress(student_id=student_profile.id, topic_id=top_calc.id, accuracy=78.0, attempts=6, mastery_level="Good")
    p4 = StudentTopicProgress(student_id=student_profile.id, topic_id=top_optics.id, accuracy=85.0, attempts=7, mastery_level="Strong")

    db.add_all([p1, p2, p3, p4])
    db.commit()

    # 10. Verified Scholarships (Government & Official Institutions)
    s1 = Scholarship(
        name="PM YASASVI Central Sector Post-Matric Scholarship 2026",
        provider="Ministry of Social Justice and Empowerment, Govt. of India",
        description="Financial assistance for meritorious students belonging to OBC, EBC, and DNT categories studying in Class 9 through Higher Education.",
        official_url="https://yet.nta.ac.in",
        source_url="https://scholarships.gov.in",
        application_start="2026-06-01",
        application_deadline="2026-09-30",
        academic_year="2026-2027",
        education_level="High School",
        courses=["Class 11 Science", "Class 12 Higher Secondary Science", "Undergraduate Degree"],
        states=["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "All"],
        min_percentage=60.0,
        max_income=250000.0,
        category_requirements="OBC/EBC/DNT",
        benefits="Full tuition fee coverage + ₹75,000 annual academic allowance",
        documents_required=["Income Certificate", "Mark Sheet of previous class", "Community Certificate", "Aadhaar Card", "Bank Passbook"],
        status="Active",
        last_verified_at=datetime.datetime.utcnow()
    )

    s2 = Scholarship(
        name="Tamil Nadu State Merit Higher Education Scholarship",
        provider="Department of School Education, Govt. of Tamil Nadu",
        description="Scholarship support for top-performing students in Tamil Nadu state government and government-aided schools pursuing Higher Secondary and STEM courses.",
        official_url="https://www.tn.gov.in/scholarships",
        source_url="https://tn.gov.in/schooledu",
        application_start="2026-07-15",
        application_deadline="2026-10-15",
        academic_year="2026-2027",
        education_level="High School",
        courses=["Class 12 Higher Secondary Science", "BE/BTech", "BSc"],
        states=["Tamil Nadu"],
        min_percentage=75.0,
        max_income=200000.0,
        category_requirements="All Categories",
        benefits="₹50,000 stipend per annum + laptop allowance",
        documents_required=["State Domicile Certificate", "Class 10 & 11 Marksheets", "Parent Income Certificate"],
        status="Active",
        last_verified_at=datetime.datetime.utcnow()
    )

    s3 = Scholarship(
        name="National Means-cum-Merit Scholarship Scheme (NMMSS)",
        provider="Department of School Education & Literacy, Ministry of Education",
        description="Awarded to meritorious students of economically weaker sections to arrest dropout rate at class VIII and encourage study at secondary stage.",
        official_url="https://scholarships.gov.in/nmmss",
        source_url="https://education.gov.in",
        application_start="2026-05-01",
        application_deadline="2026-08-31",
        academic_year="2026-2027",
        education_level="High School",
        courses=["Class 9", "Class 10", "Class 11", "Class 12 Higher Secondary Science"],
        states=["All"],
        min_percentage=55.0,
        max_income=350000.0,
        category_requirements="All Categories",
        benefits="₹12,000 per annum (₹1,000 per month)",
        documents_required=["School Enrollment Certificate", "Income Proof", "Category Certificate"],
        status="Active",
        last_verified_at=datetime.datetime.utcnow()
    )

    db.add_all([s1, s2, s3])
    db.commit()

    # Scholarship Sources
    src1 = ScholarshipSource(scholarship_id=s1.id, source_name="National Scholarship Portal (NSP)", source_url="https://scholarships.gov.in", verification_status="VERIFIED")
    src2 = ScholarshipSource(scholarship_id=s2.id, source_name="Tamil Nadu e-District Portal", source_url="https://tn.gov.in/scholarships", verification_status="VERIFIED")
    db.add_all([src1, src2])
    db.commit()

    # 11. Initial Notifications
    n1 = Notification(
        user_id=student_user.id,
        type="booking",
        title="Tutor Session Confirmed!",
        message="Dr. Rajesh Kumar accepted your session request on Probability for tomorrow at 10:00 AM.",
        read=False
    )
    n2 = Notification(
        user_id=student_user.id,
        type="scholarship",
        title="95% Match Scholarship Found",
        message="You are eligible for PM YASASVI Central Sector Post-Matric Scholarship. Deadline: Sept 30, 2026.",
        read=False
    )
    db.add_all([n1, n2])
    db.commit()

    db.close()
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    seed_database()
