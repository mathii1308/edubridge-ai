from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, students, teachers, ai, quizzes, progress, tutors, bookings, scholarships, resources, admin
from app.database.seed_data import seed_database
from app.websockets.connection_manager import manager

app = FastAPI(
    title="EduBridge AI — Learning Platform API",
    description="Full-stack educational access backend providing grounded AI tutoring, RAG knowledge retrieval, real-time tutor availability & booking, adaptive progress analytics, and verified scholarship eligibility matching.",
    version="1.0.0"
)

# CORS Middleware Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auto Seed Database on Startup
@app.on_event("startup")
def startup_event():
    seed_database()

# Include Routers
app.include_router(auth.router)
app.include_router(students.router)
app.include_router(teachers.router)
app.include_router(ai.router)
app.include_router(quizzes.router)
app.include_router(progress.router)
app.include_router(tutors.router)
app.include_router(bookings.router)
app.include_router(scholarships.router)
app.include_router(resources.router)
app.include_router(admin.router)

# WebSocket Endpoint for Real-Time Updates
@app.websocket("/ws/notifications/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    await manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_text()
            # Echo or process incoming socket messages
            await manager.send_personal_message({"event": "ping_ack", "data": data}, user_id)
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)

@app.get("/")
def root():
    return {
        "status": "online",
        "app": "EduBridge AI",
        "version": "1.0.0",
        "documentation": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
