import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, JSON, String, Text

from app.db.base import Base


class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    document_id = Column(String(36), ForeignKey("documents.id"), nullable=True, index=True)
    question = Column(Text, nullable=False)
    options = Column(JSON, nullable=False)
    correct_answer = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
