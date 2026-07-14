from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password
from app.db.models.auth_token import AuthToken
from app.db.models.organization import Organization
from app.db.models.organization_member import OrganizationMember
from app.db.models.user import User
from app.db.models.user_profile import UserProfile
from app.repositories.user_repository import UserRepository
from app.services.email_service import EmailService
from app.utils.token import (
    create_access_token,
    create_email_verification_token,
    create_password_reset_token,
    create_refresh_token,
    decode_token,
    get_access_token_expires_in_seconds,
    get_email_verification_expire_timedelta,
    get_password_reset_expire_timedelta,
    get_refresh_token_expire_timedelta,
)


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _is_strong_password(password: str) -> bool:
    return (
        any(character.isupper() for character in password)
        and any(character.isdigit() for character in password)
    )


class AuthService:
    @staticmethod
    def register(
        db: Session,
        name: str,
        email: str,
        password: str,
        organization_slug: str,
    ):
        if not _is_strong_password(password):
            raise ValueError(
                "La contraseña debe tener al menos una mayúscula y un número"
            )

        existing_user = UserRepository.get_by_email(db, email)

        if existing_user:
            return None

        organization = (
            db.query(Organization)
            .filter(Organization.slug == organization_slug)
            .first()
        )

        role = "member"

        if not organization:
            organization = Organization(
                slug=organization_slug,
                name=organization_slug.replace("-", " ").title(),
            )

            db.add(organization)
            db.flush()

            role = "admin"

        hashed_password = hash_password(password)

        user = UserRepository.create_user(
            db=db,
            name=name,
            email=email,
            password_hash=hashed_password,
            role=role,
            email_verified=False,
        )

        membership = OrganizationMember(
            organization_id=organization.id,
            user_id=user.id,
            role=role,
        )

        profile = UserProfile(
            user_id=user.id,
            preferences={
                "language": "es",
                "theme": "dark",
                "default_llm": "claude",
            },
        )

        db.add(membership)
        db.add(profile)

        verification_token = create_email_verification_token(
            user.id
        )

        verification_record = AuthToken(
            user_id=user.id,
            token=verification_token,
            token_type="email_verification",
            expires_at=(
                _utcnow()
                + get_email_verification_expire_timedelta()
            ),
        )

        db.add(verification_record)

        db.commit()
        db.refresh(user)
        db.refresh(organization)

        EmailService.send_verification_email(
            recipient_email=user.email,
            recipient_name=user.name,
            verification_token=verification_token,
        )

        return user, organization

    @staticmethod
    def authenticate(
        db: Session,
        email: str,
        password: str,
    ) -> User | None:
        user = UserRepository.get_by_email(db, email)

        if not user:
            return None

        if not verify_password(
            password,
            user.password_hash,
        ):
            return None

        return user

    @staticmethod
    def _get_membership(
        db: Session,
        user_id: str,
    ) -> OrganizationMember | None:
        return (
            db.query(OrganizationMember)
            .filter(
                OrganizationMember.user_id == user_id
            )
            .first()
        )

    @staticmethod
    def create_refresh_record(
        db: Session,
        user_id: str,
    ) -> str:
        refresh_token = create_refresh_token(user_id)

        token_record = AuthToken(
            user_id=user_id,
            token=refresh_token,
            token_type="refresh",
            expires_at=(
                _utcnow()
                + get_refresh_token_expire_timedelta()
            ),
        )

        db.add(token_record)
        db.commit()

        return refresh_token

    @staticmethod
    def build_token_response(
        db: Session,
        user: User,
    ) -> dict:
        membership = AuthService._get_membership(
            db,
            user.id,
        )

        organization_id = (
            membership.organization_id
            if membership
            else None
        )

        role = (
            membership.role
            if membership
            else user.role
        )

        refresh_token = (
            AuthService.create_refresh_record(
                db,
                user.id,
            )
        )

        return {
            "access_token": create_access_token(
                user.id,
                organization_id=organization_id,
                role=role,
            ),
            "refresh_token": refresh_token,
            "token_type": "Bearer",
            "expires_in": (
                get_access_token_expires_in_seconds()
            ),
            "user": user,
        }

    @staticmethod
    def refresh_access_token(
        db: Session,
        refresh_token: str,
    ) -> dict | None:
        payload = decode_token(refresh_token)

        if not payload:
            return None

        if payload.get("type") != "refresh":
            return None

        token_record = (
            db.query(AuthToken)
            .filter(
                AuthToken.token == refresh_token,
                AuthToken.token_type == "refresh",
                AuthToken.revoked_at.is_(None),
                AuthToken.expires_at > _utcnow(),
            )
            .first()
        )

        if not token_record:
            return None

        user = UserRepository.get_by_id(
            db,
            payload.get("sub"),
        )

        if not user or not user.is_active:
            return None

        token_record.revoked_at = _utcnow()

        db.add(token_record)
        db.commit()

        return AuthService.build_token_response(
            db,
            user,
        )

    @staticmethod
    def revoke_refresh_token(
        db: Session,
        refresh_token: str | None,
        user_id: str | None = None,
    ) -> None:
        query = db.query(AuthToken).filter(
            AuthToken.token_type == "refresh",
            AuthToken.revoked_at.is_(None),
        )

        if refresh_token:
            query = query.filter(
                AuthToken.token == refresh_token
            )

        elif user_id:
            query = query.filter(
                AuthToken.user_id == user_id
            )

        else:
            return

        records = query.all()
        now = _utcnow()

        for record in records:
            record.revoked_at = now

        db.commit()

    @staticmethod
    def start_password_reset(
        db: Session,
        email: str,
    ) -> None:
        user = UserRepository.get_by_email(
            db,
            email,
        )

        if not user:
            return

        reset_token = create_password_reset_token(
            user.id
        )

        token_record = AuthToken(
            user_id=user.id,
            token=reset_token,
            token_type="password_reset",
            expires_at=(
                _utcnow()
                + get_password_reset_expire_timedelta()
            ),
        )

        db.add(token_record)
        db.commit()

    @staticmethod
    def reset_password(
        db: Session,
        token: str,
        new_password: str,
    ) -> bool:
        if not _is_strong_password(new_password):
            raise ValueError(
                "La contraseña debe tener al menos una mayúscula y un número"
            )

        token_record = (
            db.query(AuthToken)
            .filter(
                AuthToken.token == token,
                AuthToken.token_type
                == "password_reset",
                AuthToken.used_at.is_(None),
                AuthToken.revoked_at.is_(None),
                AuthToken.expires_at > _utcnow(),
            )
            .first()
        )

        if not token_record:
            return False

        user = UserRepository.get_by_id(
            db,
            token_record.user_id,
        )

        if not user:
            return False

        user.password_hash = hash_password(
            new_password
        )

        token_record.used_at = _utcnow()

        AuthService.revoke_refresh_token(
            db=db,
            refresh_token=None,
            user_id=user.id,
        )

        db.commit()

        return True

    @staticmethod
    def verify_email(
        db: Session,
        token: str,
    ) -> bool:
        token_record = (
            db.query(AuthToken)
            .filter(
                AuthToken.token == token,
                AuthToken.token_type
                == "email_verification",
                AuthToken.used_at.is_(None),
                AuthToken.revoked_at.is_(None),
                AuthToken.expires_at > _utcnow(),
            )
            .first()
        )

        if not token_record:
            return False

        user = UserRepository.get_by_id(
            db,
            token_record.user_id,
        )

        if not user:
            return False

        user.email_verified = True
        token_record.used_at = _utcnow()

        db.commit()

        return True

    @staticmethod
    def resend_verification(
        db: Session,
        user: User,
    ) -> None:
        if user.email_verified:
            raise ValueError(
                "El correo ya está verificado"
            )

        now = _utcnow()

        previous_tokens = (
            db.query(AuthToken)
            .filter(
                AuthToken.user_id == user.id,
                AuthToken.token_type
                == "email_verification",
                AuthToken.used_at.is_(None),
                AuthToken.revoked_at.is_(None),
            )
            .all()
        )

        for token_record in previous_tokens:
            token_record.revoked_at = now

        verification_token = (
            create_email_verification_token(
                user.id
            )
        )

        new_token_record = AuthToken(
            user_id=user.id,
            token=verification_token,
            token_type="email_verification",
            expires_at=(
                now
                + get_email_verification_expire_timedelta()
            ),
        )

        db.add(new_token_record)
        db.commit()

        EmailService.send_verification_email(
            recipient_email=user.email,
            recipient_name=user.name,
            verification_token=verification_token,
        )

    @staticmethod
    def change_password(
        db: Session,
        user: User,
        current_password: str,
        new_password: str,
    ) -> bool:
        if not verify_password(
            current_password,
            user.password_hash,
        ):
            return False

        if not _is_strong_password(new_password):
            raise ValueError(
                "La contraseña debe tener al menos una mayúscula y un número"
            )

        user.password_hash = hash_password(
            new_password
        )

        AuthService.revoke_refresh_token(
            db=db,
            refresh_token=None,
            user_id=user.id,
        )

        db.commit()

        return True