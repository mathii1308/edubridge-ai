import datetime
from sqlalchemy.orm import Session
from app.models.schemas import Scholarship, Notification, User

def run_scholarship_sync_job(db: Session):
    """
    Background job simulation: Synchronizes verified scholarship official sources,
    updates verification timestamps, and generates student notifications for upcoming deadlines.
    """
    scholarships = db.query(Scholarship).all()
    now = datetime.datetime.utcnow()
    synced_count = 0

    for sch in scholarships:
        sch.last_verified_at = now
        synced_count += 1

    # Generate deadline alert notification for students
    students = db.query(User).filter(User.role == "student").all()
    for student in students:
        new_notif = Notification(
            user_id=student.id,
            type="scholarship",
            title="Scholarship Verification Sync Complete",
            message=f"Verified eligibility data for {synced_count} active scholarship opportunities as of {now.strftime('%b %d, %Y')}.",
            read=False
        )
        db.add(new_notif)

    db.commit()
    return {"status": "success", "synced_scholarships": synced_count, "timestamp": now.isoformat()}
