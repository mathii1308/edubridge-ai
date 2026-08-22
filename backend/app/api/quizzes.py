from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.connection import get_db
from app.models.schemas import Quiz, QuizQuestion, QuizAttempt, StudentAnswer, StudentTopicProgress, Topic, StudentProfile
from app.schemas.pydantic_schemas import QuizDetailSchema, QuizSubmitRequest, QuizResultResponse
from app.services.progress_analysis import ProgressAnalysisService

router = APIRouter(prefix="/quizzes", tags=["Quizzes"])

@router.get("")
def get_all_quizzes(subject: str = None, db: Session = Depends(get_db)):
    q_query = db.query(Quiz)
    if subject:
        q_query = q_query.filter(Quiz.subject.ilike(f"%{subject}%"))
    quizzes = q_query.all()
    res = []
    for q in quizzes:
        res.append({
            "id": q.id,
            "subject": q.subject,
            "topic": q.topic,
            "difficulty": q.difficulty,
            "question_count": len(q.questions)
        })
    return res

@router.get("/{quiz_id}", response_model=QuizDetailSchema)
def get_quiz_by_id(quiz_id: int, db: Session = Depends(get_db)):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        quiz = db.query(Quiz).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    questions_res = []
    for qq in quiz.questions:
        questions_res.append({
            "id": qq.id,
            "question": qq.question,
            "options": qq.options,
            "explanation": qq.explanation
        })

    return {
        "id": quiz.id,
        "subject": quiz.subject,
        "topic": quiz.topic,
        "difficulty": quiz.difficulty,
        "questions": questions_res
    }

@router.post("/{quiz_id}/submit", response_model=QuizResultResponse)
def submit_quiz_attempt(quiz_id: int, req: QuizSubmitRequest, student_id: int = 1, db: Session = Depends(get_db)):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        quiz = db.query(Quiz).first()

    student = db.query(StudentProfile).filter(StudentProfile.id == student_id).first()
    if not student:
        student = db.query(StudentProfile).first()

    correct_count = 0
    total_questions = len(quiz.questions) if quiz else len(req.answers)

    # Calculate score
    for ans in req.answers:
        q_id = ans.get("question_id")
        user_ans = ans.get("answer")
        qq = db.query(QuizQuestion).filter(QuizQuestion.id == q_id).first()
        if qq and qq.correct_answer == user_ans:
            correct_count += 1

    score_pct = round((correct_count / max(1, total_questions)) * 100.0, 1)

    # Save Attempt
    attempt = QuizAttempt(
        student_id=student.id,
        quiz_id=quiz.id if quiz else 1,
        score=score_pct
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    # Update Topic Progress
    topic_obj = db.query(Topic).filter(Topic.name.ilike(f"%{quiz.topic if quiz else 'Probability'}%")).first()
    if topic_obj:
        prog = db.query(StudentTopicProgress).filter(
            StudentTopicProgress.student_id == student.id,
            StudentTopicProgress.topic_id == topic_obj.id
        ).first()
        if not prog:
            prog = StudentTopicProgress(student_id=student.id, topic_id=topic_obj.id, accuracy=score_pct, attempts=1)
            db.add(prog)
        else:
            new_acc = round((prog.accuracy * prog.attempts + score_pct) / (prog.attempts + 1), 1)
            prog.accuracy = new_acc
            prog.attempts += 1
            prog.mastery_level = ProgressAnalysisService.get_mastery_status(new_acc)

        db.commit()

    mastery = ProgressAnalysisService.get_mastery_status(score_pct)
    weak_topics = [quiz.topic] if score_pct < 60.0 else []

    return {
        "attempt_id": attempt.id,
        "score": score_pct,
        "total_questions": total_questions,
        "correct_count": correct_count,
        "mastery_level": mastery,
        "weak_topics": weak_topics,
        "recommendation": f"Great effort! Practicing 5 more questions on {quiz.topic if quiz else 'Probability'} will boost your confidence."
    }
