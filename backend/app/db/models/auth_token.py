import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, String

from app.db.base import Base


class AuthToken(Base):
    __tablename__ = "auth_tokens"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    token = Column(String(1024), nullable=False, unique=True)
    token_type = Column(String(50), nullable=False, index=True)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    used_at = Column(DateTime(timezone=True), nullable=True)
    revoked_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
