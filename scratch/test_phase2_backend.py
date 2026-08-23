import sys
import os

# Ensure backend directory is in path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from fastapi.testclient import TestClient
from app.main import app
from app.database.seed_data import seed_database

db_path = os.path.join(os.path.dirname(__file__), '..', 'backend', 'edubridge.db')
if os.path.exists(db_path):
    try:
        os.remove(db_path)
    except Exception:
        pass

print("=== STARTING PHASE 2 END-TO-END BACKEND TEST SUITE ===")

# Re-seed database
seed_database()


client = TestClient(app)

# 1. Test Student Email Registration
print("\n--- 1. Testing Student Registration ---")
reg_payload = {
    "name": "Priya Sundaram",
    "email": "priya.test@edubridge.ai",
    "password": "securePassword123",
    "role": "student",
    "preferred_language": "English",
    "learning_level": "Intermediate"
}
res_reg = client.post("/auth/register", json=reg_payload)
print(f"Register status: {res_reg.status_code}")
assert res_reg.status_code == 200, res_reg.text
reg_data = res_reg.json()
assert reg_data["user"]["email"] == "priya.test@edubridge.ai"
assert reg_data["user"]["email_verified"] == False
print("[OK] Registration successful (user marked as unverified)")

# 2. Test Duplicate Email Prevention
print("\n--- 2. Testing Duplicate Email Prevention ---")
res_dup = client.post("/auth/register", json=reg_payload)
print(f"Duplicate email status: {res_dup.status_code}")
assert res_dup.status_code == 400
print("[OK] Duplicate email prevented successfully")

# 3. Test Email Verification Endpoint
print("\n--- 3. Testing Email Verification ---")
res_verify = client.post(f"/auth/verify-email?email=priya.test@edubridge.ai")
assert res_verify.status_code == 200
print("[OK] Email verified successfully")

# 4. Test Student Login
print("\n--- 4. Testing Student Login ---")
login_payload = {
    "email": "priya.test@edubridge.ai",
    "password": "securePassword123"
}
res_login = client.post("/auth/login", json=login_payload)
assert res_login.status_code == 200, res_login.text
login_data = res_login.json()
assert "access_token" in login_data
assert login_data["user"]["role"] == "student"
print("[OK] Login successful, JWT token issued")

# 5. Test AI Requirement Analysis (DBMS Normalization doubt)
print("\n--- 5. Testing AI Requirement Analysis ---")
dbms_question = {
    "message": "I don't understand normalization in DBMS, specifically 2NF and 3NF functional dependencies.",
    "language": "English"
}
res_req = client.post("/ai/analyze-requirement", json=dbms_question)
assert res_req.status_code == 200
req_analysis = res_req.json()
print(f"Requirement analysis result: {req_analysis}")
assert req_analysis["subject"] == "DBMS"
assert req_analysis["topic"] == "Normalization"
print("[OK] AI Requirement analysis correctly inferred DBMS Normalization requirement")

# 6. Test AI Chat & Handoff Trigger
print("\n--- 6. Testing AI Chat & Tutor Handoff Trigger ---")
struggle_payload = {
    "message": "I still don't understand 2NF and 3NF normalization.",
    "language": "English",
    "action_type": "struggle"
}
res_chat = client.post("/ai/chat", json=struggle_payload)
assert res_chat.status_code == 200
chat_data = res_chat.json()
assert chat_data["needs_tutor"] == True
print("[OK] AI chat triggered tutor handoff on persistent struggle")

# 7. Test Multi-Factor Tutor Matching
print("\n--- 7. Testing Multi-Factor Tutor Matching ---")
res_match = client.get("/tutors?subject=DBMS&topic=Normalization&language=English")
assert res_match.status_code == 200
matched_tutors = res_match.json()
print(f"Found {len(matched_tutors)} matched tutors for DBMS Normalization")
assert len(matched_tutors) > 0
top_tutor = matched_tutors[0]
print(f"Top matched tutor: {top_tutor['name']} (Score: {top_tutor['match_score']}%)")
print(f"Match reasons count: {len(top_tutor['match_reasons'])}")
assert top_tutor['match_score'] > 70.0
print("[OK] Multi-factor tutor matching calculated score & match reasons successfully")

# 8. Test Booking Creation & Double-Booking Prevention
print("\n--- 8. Testing Booking Creation & Double-Booking Prevention ---")
booking_payload = {
    "teacher_id": top_tutor["id"],
    "subject_name": "DBMS",
    "topic_name": "Normalization",
    "scheduled_date": "2026-08-25",
    "start_time": "14:00",
    "end_time": "15:00",
    "student_requirement": "Needs explanation of 2NF (partial dependency) and 3NF (transitive dependency)"
}
res_book1 = client.post("/bookings?student_id=1", json=booking_payload)
assert res_book1.status_code == 200, res_book1.text
b1_data = res_book1.json()
booking_id = b1_data["id"]
print(f"Created Booking ID: {booking_id} for date {b1_data['scheduled_date']} at {b1_data['start_time']}")

# Attempt double-booking exact same slot
res_book_dup = client.post("/bookings?student_id=2", json=booking_payload)
print(f"Double booking response status: {res_book_dup.status_code}")
assert res_book_dup.status_code == 400
assert "Double-Booking Blocked" in res_book_dup.json()["detail"] or "already" in res_book_dup.json()["detail"]
print("[OK] Double-booking attempt successfully prevented by backend lock!")

# 9. Test Student-Tutor Session Messaging
print("\n--- 9. Testing Booking Session Messaging ---")
msg_payload_student = {"message": "Hi Dr. Rajesh, I would like to review the 3NF transitive dependency rule."}
res_msg_s = client.post(f"/bookings/{booking_id}/messages?sender_id=1&sender_role=student", json=msg_payload_student)
assert res_msg_s.status_code == 200, res_msg_s.text
print("[OK] Student message sent")

msg_payload_tutor = {"message": "Hello Priya! Sure, we will use a Student-Department example to clarify transitive dependencies."}
res_msg_t = client.post(f"/bookings/{booking_id}/messages?sender_id=2&sender_role=teacher", json=msg_payload_tutor)
assert res_msg_t.status_code == 200, res_msg_t.text
print("[OK] Tutor reply sent")

# List messages for booking
res_msg_list = client.get(f"/bookings/{booking_id}/messages")
assert res_msg_list.status_code == 200
msg_list = res_msg_list.json()
assert len(msg_list) >= 3 # Initial system note + student msg + tutor msg
print(f"[OK] Retrieved {len(msg_list)} messages for booking session #{booking_id}")
for m in msg_list:
    print(f"  [{m['sender_role'].upper()}] {m['sender_name']}: {m['message']}")

print("\n=======================================================")
print("  ALL PHASE 2 BACKEND TEST SUITES PASSED CLEANLY!  ")
print("=======================================================")
