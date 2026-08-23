from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.schemas import User, StudentProfile, TeacherProfile
from app.schemas.pydantic_schemas import UserRegister, UserLogin, TokenResponse, UserResponse
from datetime import datetime, timedelta
from jose import jwt

SECRET_KEY = "edubridge_ai_super_secret_jwt_key_2026"
ALGORITHM = "HS256"

router = APIRouter(prefix="/auth", tags=["Authentication"])

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/register", response_model=TokenResponse)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        name=user_in.name,
        email=user_in.email,
        password_hash=f"hashed_{user_in.password}",  # Production hash placeholder
        role=user_in.role
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    if user.role == "student":
        student_prof = StudentProfile(
            user_id=user.id,
            preferred_language=user_in.preferred_language or "English",
            learning_level=user_in.learning_level or "Intermediate"
        )
        db.add(student_prof)
    elif user.role == "teacher":
        teacher_prof = TeacherProfile(user_id=user.id)
        db.add(teacher_prof)

    db.commit()

    token = create_access_token({"sub": user.email, "role": user.role, "user_id": user.id})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": user.email, "role": user.role, "user_id": user.id})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserResponse)
def get_current_user(email: str = "student@edubridge.ai", db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = db.query(User).first()
    return user
