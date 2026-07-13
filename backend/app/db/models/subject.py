import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, String, Text

from app.db.base import Base


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    name = Column(String(120), nullable=False)
    description = Column(Text, nullable=True)
    color = Column(String(20), default="#2563eb")
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
