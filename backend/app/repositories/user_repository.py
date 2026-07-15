from sqlalchemy.orm import Session

from app.db.models.user import User
from .base_repository import BaseRepository


class UserRepository(BaseRepository):

    @staticmethod
    def get_by_email(db: Session, email: str):
        return (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

    @staticmethod
    def get_by_id(db: Session, user_id: str):
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def create_user(
        db: Session,
        name: str,
        email: str,
        password_hash: str,
        role: str = "member",
        email_verified: bool = False,
    ):
        user = User(
            username=name,
            email=email,
            password_hash=password_hash,
            role=role,
            email_verified=email_verified,
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        return user
