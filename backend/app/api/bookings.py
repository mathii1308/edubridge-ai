from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database.connection import get_db
from app.models.schemas import TutorBooking, TutorAvailability, StudentProfile, TeacherProfile, Notification
from app.schemas.pydantic_schemas import BookingCreate, BookingResponse

router = APIRouter(prefix="/bookings", tags=["Bookings"])

@router.get("", response_model=List[BookingResponse])
def list_bookings(user_role: str = "student", user_id: int = 1, db: Session = Depends(get_db)):
    if user_role == "teacher":
        teacher = db.query(TeacherProfile).filter(TeacherProfile.user_id == user_id).first()
        t_id = teacher.id if teacher else 1
        bookings = db.query(TutorBooking).filter(TutorBooking.teacher_id == t_id).all()
    else:
        student = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
        s_id = student.id if student else 1
        bookings = db.query(TutorBooking).filter(TutorBooking.student_id == s_id).all()

    res = []
    for b in bookings:
        res.append({
            "id": b.id,
            "student_id": b.student_id,
            "teacher_id": b.teacher_id,
            "teacher_name": b.teacher.user.name if b.teacher and b.teacher.user else "Dr. Rajesh Kumar",
            "student_name": b.student.user.name if b.student and b.student.user else "Ananya Sharma",
            "subject_name": b.subject_name,
            "topic_name": b.topic_name,
            "scheduled_date": b.scheduled_date,
            "start_time": b.start_time,
            "end_time": b.end_time,
            "status": b.status,
            "created_at": b.created_at
        })
    return res

@router.post("", response_model=BookingResponse)
def create_booking(req: BookingCreate, student_id: int = 1, db: Session = Depends(get_db)):
    student = db.query(StudentProfile).filter(StudentProfile.id == student_id).first()
    if not student:
        student = db.query(StudentProfile).first()

    teacher = db.query(TeacherProfile).filter(TeacherProfile.id == req.teacher_id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")

    # Step 1: Check availability slot and prevent double-booking
    avail = db.query(TutorAvailability).filter(
        TutorAvailability.teacher_id == req.teacher_id,
        TutorAvailability.date == req.scheduled_date,
        TutorAvailability.start_time == req.start_time
    ).first()

    if avail and avail.status in ["booked", "reserved"]:
        raise HTTPException(status_code=400, detail="This tutor time slot has already been booked by another student!")

    # Lock slot
    if avail:
        avail.status = "booked"

    # Step 2: Create Booking Record
    booking = TutorBooking(
        student_id=student.id,
        teacher_id=teacher.id,
        subject_name=req.subject_name,
        topic_name=req.topic_name,
        scheduled_date=req.scheduled_date,
        start_time=req.start_time,
        end_time=req.end_time,
        status="accepted"  # Auto accept demo slots
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)

    # Step 3: Send Notification to Student and Teacher
    teacher_notif = Notification(
        user_id=teacher.user_id,
        type="booking",
        title="New Tutor Booking Confirmed",
        message=f"Student {student.user.name if student.user else 'Student'} booked a session for {req.subject_name} ({req.topic_name}) on {req.scheduled_date} at {req.start_time}."
    )
    db.add(teacher_notif)
    db.commit()

    return {
        "id": booking.id,
        "student_id": booking.student_id,
        "teacher_id": booking.teacher_id,
        "teacher_name": teacher.user.name if teacher.user else "Tutor",
        "student_name": student.user.name if student.user else "Student",
        "subject_name": booking.subject_name,
        "topic_name": booking.topic_name,
        "scheduled_date": booking.scheduled_date,
        "start_time": booking.start_time,
        "end_time": booking.end_time,
        "status": booking.status,
        "created_at": booking.created_at
    }

@router.put("/{booking_id}")
def update_booking_status(booking_id: int, status: str, db: Session = Depends(get_db)):
    booking = db.query(TutorBooking).filter(TutorBooking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    booking.status = status
    db.commit()
    return {"id": booking_id, "status": status}
