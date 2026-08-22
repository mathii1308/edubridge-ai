from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.connection import get_db
from app.models.schemas import TutorBooking, TutorAvailability, StudentProfile, TeacherProfile, Notification, BookingMessage, User
from app.schemas.pydantic_schemas import BookingCreate, BookingResponse, BookingMessageCreate, BookingMessageResponse

router = APIRouter(prefix="/bookings", tags=["Bookings"])

@router.get("", response_model=List[BookingResponse])
def list_bookings(user_role: str = "student", user_id: int = 1, db: Session = Depends(get_db)):
    if user_role == "teacher":
        teacher = db.query(TeacherProfile).filter(TeacherProfile.user_id == user_id).first()
        t_id = teacher.id if teacher else 1
        bookings = db.query(TutorBooking).filter(TutorBooking.teacher_id == t_id).all()
    elif user_role == "admin":
        bookings = db.query(TutorBooking).all()
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
            "student_requirement": b.student_requirement,
            "status": b.status,
            "created_at": b.created_at
        })
    return res

@router.get("/{booking_id}", response_model=BookingResponse)
def get_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(TutorBooking).filter(TutorBooking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    return {
        "id": booking.id,
        "student_id": booking.student_id,
        "teacher_id": booking.teacher_id,
        "teacher_name": booking.teacher.user.name if booking.teacher and booking.teacher.user else "Tutor",
        "student_name": booking.student.user.name if booking.student and booking.student.user else "Student",
        "subject_name": booking.subject_name,
        "topic_name": booking.topic_name,
        "scheduled_date": booking.scheduled_date,
        "start_time": booking.start_time,
        "end_time": booking.end_time,
        "student_requirement": booking.student_requirement,
        "status": booking.status,
        "created_at": booking.created_at
    }

@router.post("", response_model=BookingResponse)
def create_booking(req: BookingCreate, student_id: int = 1, db: Session = Depends(get_db)):
    student = db.query(StudentProfile).filter(StudentProfile.id == student_id).first()
    if not student:
        student = db.query(StudentProfile).first()

    teacher = db.query(TeacherProfile).filter(TeacherProfile.id == req.teacher_id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")

    # Step 1: Prevent Double-Booking via Active Bookings Lookup
    existing_active_booking = db.query(TutorBooking).filter(
        TutorBooking.teacher_id == req.teacher_id,
        TutorBooking.scheduled_date == req.scheduled_date,
        TutorBooking.start_time == req.start_time,
        TutorBooking.status.in_(["requested", "accepted"])
    ).first()

    if existing_active_booking:
        raise HTTPException(
            status_code=400,
            detail=f"Double-Booking Blocked: Slot on {req.scheduled_date} at {req.start_time} is already booked by another student!"
        )

    # Step 2: Check Availability Slot
    avail = db.query(TutorAvailability).filter(
        TutorAvailability.teacher_id == req.teacher_id,
        TutorAvailability.date == req.scheduled_date,
        TutorAvailability.start_time == req.start_time
    ).first()

    if avail and avail.status in ["booked", "reserved", "unavailable"]:
        raise HTTPException(status_code=400, detail="This tutor slot is marked as unavailable or already reserved.")

    # Lock availability slot status
    if avail:
        avail.status = "booked"
    else:
        # Create slot record as booked if not explicitly existing
        new_avail = TutorAvailability(
            teacher_id=req.teacher_id,
            date=req.scheduled_date,
            start_time=req.start_time,
            end_time=req.end_time,
            status="booked"
        )
        db.add(new_avail)

    # Step 3: Create Booking Record
    booking = TutorBooking(
        student_id=student.id,
        teacher_id=teacher.id,
        subject_name=req.subject_name,
        topic_name=req.topic_name,
        scheduled_date=req.scheduled_date,
        start_time=req.start_time,
        end_time=req.end_time,
        student_requirement=req.student_requirement or f"Help needed with {req.topic_name} in {req.subject_name}",
        status="accepted"  # Auto accept demo slots
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)

    # Step 4: Initial System Message for Communication
    initial_msg = BookingMessage(
        booking_id=booking.id,
        sender_id=student.user_id if student.user else 1,
        sender_role="student",
        message=f"Session booked for {req.subject_name} ({req.topic_name}). Note: {booking.student_requirement}"
    )
    db.add(initial_msg)

    # Step 5: Send Notification to Student and Teacher
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
        "student_requirement": booking.student_requirement,
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

# --- STUDENT - TUTOR MESSAGING ENDPOINTS ---

@router.get("/{booking_id}/messages", response_model=List[BookingMessageResponse])
def get_booking_messages(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(TutorBooking).filter(TutorBooking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking session not found")

    messages = db.query(BookingMessage).filter(BookingMessage.booking_id == booking_id).order_by(BookingMessage.created_at.asc()).all()
    
    res = []
    for m in messages:
        sender_name = m.sender.name if m.sender else ("Student" if m.sender_role == "student" else "Tutor")
        res.append({
            "id": m.id,
            "booking_id": m.booking_id,
            "sender_id": m.sender_id,
            "sender_name": sender_name,
            "sender_role": m.sender_role,
            "message": m.message,
            "created_at": m.created_at,
            "read": m.read
        })
    return res

@router.post("/{booking_id}/messages", response_model=BookingMessageResponse)
def send_booking_message(booking_id: int, req: BookingMessageCreate, sender_id: int = 1, sender_role: str = "student", db: Session = Depends(get_db)):
    booking = db.query(TutorBooking).filter(TutorBooking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking session not found")

    sender = db.query(User).filter(User.id == sender_id).first()
    if not sender:
        sender = db.query(User).first()
        sender_id = sender.id if sender else 1

    msg = BookingMessage(
        booking_id=booking_id,
        sender_id=sender_id,
        sender_role=sender_role,
        message=req.message,
        read=False
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)

    return {
        "id": msg.id,
        "booking_id": msg.booking_id,
        "sender_id": msg.sender_id,
        "sender_name": sender.name if sender else "User",
        "sender_role": msg.sender_role,
        "message": msg.message,
        "created_at": msg.created_at,
        "read": msg.read
    }

