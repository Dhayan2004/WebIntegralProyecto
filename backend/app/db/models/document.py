import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text

from app.db.base import Base


class Document(Base):
    __tablename__ = "documents"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    subject_id = Column(String(36), ForeignKey("subjects.id"), nullable=True, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=True)
    file_name = Column(String(255), nullable=True)
    file_size_bytes = Column(Integer, default=0)
    status = Column(String(30), default="ready", nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
