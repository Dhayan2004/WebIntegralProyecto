
from datetime import datetime, timezone

from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.core.security import verify_password
from app.db.models.auth_token import AuthToken
from app.db.models.chat_message import ChatMessage, ChatSession
from app.db.models.document import Document
from app.db.models.flashcard import Flashcard
from app.db.models.organization_member import OrganizationMember
from app.db.models.quiz import Quiz
from app.db.models.study_room import StudyRoom
from app.db.models.subject import Subject
from app.db.models.summary import Summary
from app.db.models.user import User
from app.db.models.user_profile import UserProfile


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class UserService:
    @staticmethod
    def get_membership(db: Session, user_id: str) -> OrganizationMember | None:
        return db.query(OrganizationMember).filter(OrganizationMember.user_id == user_id).first()

    @staticmethod
    def get_or_create_profile(db: Session, user_id: str) -> UserProfile:
        profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        if profile:
            return profile
        profile = UserProfile(user_id=user_id, preferences={"language": "es", "theme": "dark", "default_llm": "claude"})
        db.add(profile)
        db.commit()
        db.refresh(profile)
        return profile

    @staticmethod
    def serialize_user(db: Session, user: User) -> dict:
        membership = UserService.get_membership(db, user.id)
        profile = UserService.get_or_create_profile(db, user.id)
        return {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "avatar_url": profile.avatar_url,
            "role": membership.role if membership else user.role,
            "organization_id": membership.organization_id if membership else None,
            "email_verified": user.email_verified,
            "preferences": profile.preferences or {"language": "es", "theme": "dark", "default_llm": "claude"},
            "is_active": user.is_active,
            "created_at": user.created_at,
            "updated_at": user.updated_at,
        }

    @staticmethod
    def update_own_profile(db: Session, user: User, data: dict) -> dict:
        if "name" in data and data["name"] is not None:
            user.name = data["name"]
        profile = UserService.get_or_create_profile(db, user.id)
        if "avatar_url" in data:
            profile.avatar_url = str(data["avatar_url"]) if data["avatar_url"] is not None else None
        if "preferences" in data and data["preferences"] is not None:
            merged_preferences = (profile.preferences or {}).copy()
            merged_preferences.update(data["preferences"])
            profile.preferences = merged_preferences
        db.commit()
        db.refresh(user)
        db.refresh(profile)
        return UserService.serialize_user(db, user)

    @staticmethod
    def _require_admin(current_user: User, membership: OrganizationMember | None) -> None:
        if not membership or membership.role != "admin":
            raise PermissionError("INSUFFICIENT_PERMISSIONS")
        if not current_user.is_active:
            raise PermissionError("INSUFFICIENT_PERMISSIONS")

    @staticmethod
    def list_organization_users(
        db: Session,
        current_user: User,
        page: int,
        page_size: int,
        q: str | None,
        role: str | None,
        sort: str,
    ) -> tuple[list[dict], int]:
        current_membership = UserService.get_membership(db, current_user.id)
        UserService._require_admin(current_user, current_membership)

        query = (
            db.query(User, OrganizationMember)
            .join(OrganizationMember, OrganizationMember.user_id == User.id)
            .filter(OrganizationMember.organization_id == current_membership.organization_id)
        )

        if q:
            like = f"%{q}%"
            query = query.filter(or_(User.username.ilike(like), User.email.ilike(like)))
        if role:
            query = query.filter(OrganizationMember.role == role)

        descending = sort.startswith("-")
        sort_key = sort.lstrip("-")
        if sort_key == "name":
            order_col = User.username
        elif sort_key == "email":
            order_col = User.email
        elif sort_key == "role":
            order_col = OrganizationMember.role
        else:
            order_col = User.created_at
        query = query.order_by(order_col.desc() if descending else order_col.asc())

        total = query.count()
        rows = query.offset((page - 1) * page_size).limit(page_size).all()
        items = []
        for user, membership in rows:
            profile = UserService.get_or_create_profile(db, user.id)
            items.append(
                {
                    "id": user.id,
                    "email": user.email,
                    "name": user.name,
                    "avatar_url": profile.avatar_url,
                    "role": membership.role,
                    "organization_id": membership.organization_id,
                    "email_verified": user.email_verified,
                    "preferences": profile.preferences or {"language": "es", "theme": "dark", "default_llm": "claude"},
                    "is_active": user.is_active,
                    "created_at": user.created_at,
                    "updated_at": user.updated_at,
                }
            )

        return items, total

    @staticmethod
    def get_organization_user(db: Session, current_user: User, user_id: str) -> dict | None:
        current_membership = UserService.get_membership(db, current_user.id)
        target_membership = UserService.get_membership(db, user_id)
        if not target_membership:
            return None
        if current_user.id != user_id:
            UserService._require_admin(current_user, current_membership)
        if not current_membership or current_membership.organization_id != target_membership.organization_id:
            return None

        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return None
        return UserService.serialize_user(db, user)

    @staticmethod
    def _count_active_admins(db: Session, organization_id: str) -> int:
        return (
            db.query(OrganizationMember)
            .join(User, User.id == OrganizationMember.user_id)
            .filter(
                OrganizationMember.organization_id == organization_id,
                OrganizationMember.role == "admin",
                User.is_active.is_(True),
            )
            .count()
        )

    @staticmethod
    def update_organization_user(db: Session, current_user: User, user_id: str, role: str | None, is_active: bool | None) -> dict | None:
        current_membership = UserService.get_membership(db, current_user.id)
        UserService._require_admin(current_user, current_membership)
        target_membership = UserService.get_membership(db, user_id)
        if not target_membership or target_membership.organization_id != current_membership.organization_id:
            return None

        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return None

        if role and target_membership.role == "admin" and role != "admin":
            if UserService._count_active_admins(db, target_membership.organization_id) <= 1:
                raise PermissionError("CANNOT_MODIFY_ONLY_ADMIN")

        if is_active is False and target_membership.role == "admin":
            if UserService._count_active_admins(db, target_membership.organization_id) <= 1:
                raise PermissionError("CANNOT_MODIFY_ONLY_ADMIN")

        if role:
            target_membership.role = role
            user.role = role
        if is_active is not None:
            user.is_active = is_active

        db.commit()
        db.refresh(user)
        return UserService.serialize_user(db, user)

    @staticmethod
    def delete_organization_user(db: Session, current_user: User, user_id: str) -> bool:
        current_membership = UserService.get_membership(db, current_user.id)
        UserService._require_admin(current_user, current_membership)
        if current_user.id == user_id:
            raise PermissionError("CANNOT_DELETE_SELF")

        target_membership = UserService.get_membership(db, user_id)
        if not target_membership or target_membership.organization_id != current_membership.organization_id:
            return False

        target_user = db.query(User).filter(User.id == user_id).first()
        if not target_user:
            return False
        if target_membership.role == "admin":
            if UserService._count_active_admins(db, target_membership.organization_id) <= 1:
                raise PermissionError("CANNOT_MODIFY_ONLY_ADMIN")

        target_user.is_active = False
        db.delete(target_membership)
        db.commit()
        return True

    @staticmethod
    def delete_own_account(db: Session, user: User, password: str, confirmation: str) -> None:
        if confirmation != "ELIMINAR MI CUENTA":
            raise ValueError("CONFIRMATION_MISMATCH")
        if not verify_password(password, user.password_hash):
            raise PermissionError("INVALID_CREDENTIALS")

        db.query(ChatMessage).filter(ChatMessage.user_id == user.id).delete(synchronize_session=False)
        db.query(ChatSession).filter(ChatSession.user_id == user.id).delete(synchronize_session=False)
        db.query(Document).filter(Document.user_id == user.id).delete(synchronize_session=False)
        db.query(Subject).filter(Subject.user_id == user.id).delete(synchronize_session=False)
        db.query(Flashcard).filter(Flashcard.user_id == user.id).delete(synchronize_session=False)
        db.query(Quiz).filter(Quiz.user_id == user.id).delete(synchronize_session=False)
        db.query(Summary).filter(Summary.user_id == user.id).delete(synchronize_session=False)
        db.query(StudyRoom).filter(StudyRoom.user_id == user.id).delete(synchronize_session=False)
        db.query(UserProfile).filter(UserProfile.user_id == user.id).delete(synchronize_session=False)
        db.query(AuthToken).filter(AuthToken.user_id == user.id).delete(synchronize_session=False)
        db.query(OrganizationMember).filter(OrganizationMember.user_id == user.id).delete(synchronize_session=False)
        user.is_active = False
        user.updated_at = _utcnow()
        db.commit()
