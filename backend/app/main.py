from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

# Import all models to ensure they are registered and created
from app.db.base import Base
from app.db.session import engine
from app.db.models.user import User
from app.db.models.subject import Subject
from app.db.models.document import Document, DocumentChunk
from app.db.models.chat_message import ChatSession, ChatMessage
from app.db.models.flashcard import Flashcard
from app.db.models.quiz import Quiz
from app.db.models.summary import Summary
from app.db.models.auth_token import AuthToken
from app.db.models.organization import Organization
from app.db.models.organization_member import OrganizationMember
from app.db.models.user_profile import UserProfile
from app.db.models.study_room import StudyRoom
from app.db.models.study_metrics import StudyMetrics

# Import API routers
from app.api.v1.auth import router as auth_router
from app.api.v1.subjects import router as subjects_router
from app.api.v1.documents import router as documents_router
from app.api.v1.chat import router as chat_router
from app.api.v1.summaries import router as summaries_router
from app.api.v1.flashcards import router as flashcards_router
from app.api.v1.quizzes import router as quizzes_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.users import router as users_router

from app.core.config import settings

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers under /api prefix
app.include_router(auth_router, prefix="/api")
app.include_router(subjects_router, prefix="/api")
app.include_router(documents_router, prefix="/api")
app.include_router(chat_router, prefix="/api")
app.include_router(summaries_router, prefix="/api")
app.include_router(flashcards_router, prefix="/api")
app.include_router(quizzes_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")
app.include_router(users_router, prefix="/api")


@app.get("/")
def test_connection():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
    return {
        "message": "Database connected successfully",
        "status": "online"
    }