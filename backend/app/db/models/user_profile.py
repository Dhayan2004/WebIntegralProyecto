from datetime import datetime, timezone

from sqlalchemy import JSON, Column, DateTime, ForeignKey, String

from app.db.base import Base


class UserProfile(Base):
    __tablename__ = "user_profiles"

    user_id = Column(String(36), ForeignKey("users.id"), primary_key=True)
    avatar_url = Column(String(500), nullable=True)
    preferences = Column(JSON, nullable=False, default=dict)
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
