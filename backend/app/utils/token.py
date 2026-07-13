from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt

from app.core.config import settings


def _create_token(subject: str, token_type: str, expires_delta: timedelta, extra_claims: dict | None = None) -> str:
    payload = {"sub": str(subject), "type": token_type, "exp": datetime.now(timezone.utc) + expires_delta}
    if extra_claims:
        payload.update(extra_claims)
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_access_token(
    subject: str,
    organization_id: str | None = None,
    role: str | None = None,
    expires_delta: timedelta | None = None,
) -> str:
    claims: dict[str, str] = {}
    if organization_id:
        claims["org"] = organization_id
    if role:
        claims["role"] = role
    return _create_token(
        subject=subject,
        token_type="access",
        expires_delta=expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
        extra_claims=claims,
    )


def create_refresh_token(subject: str, expires_delta: timedelta | None = None) -> str:
    return _create_token(
        subject=subject,
        token_type="refresh",
        expires_delta=expires_delta or timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )


def create_action_token(subject: str, token_type: str, expires_delta: timedelta) -> str:
    return _create_token(subject=subject, token_type=token_type, expires_delta=expires_delta)


def create_password_reset_token(subject: str) -> str:
    return create_action_token(
        subject=subject,
        token_type="password_reset",
        expires_delta=timedelta(hours=settings.PASSWORD_RESET_TOKEN_EXPIRE_HOURS),
    )


def create_email_verification_token(subject: str) -> str:
    return create_action_token(
        subject=subject,
        token_type="email_verification",
        expires_delta=timedelta(hours=settings.EMAIL_TOKEN_EXPIRE_HOURS),
    )


def get_access_token_expires_in_seconds() -> int:
    return settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60


def get_refresh_token_expire_seconds() -> int:
    return settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60


def get_refresh_token_expire_timedelta() -> timedelta:
    return timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)


def get_password_reset_expire_timedelta() -> timedelta:
    return timedelta(hours=settings.PASSWORD_RESET_TOKEN_EXPIRE_HOURS)


def get_email_verification_expire_timedelta() -> timedelta:
    return timedelta(hours=settings.EMAIL_TOKEN_EXPIRE_HOURS)


def decode_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError:
        return None


def decode_token_or_raise(token: str) -> dict:
    expire = datetime.now(timezone.utc) + (
        timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError as exc:
        raise ValueError("Token invalido o expirado") from exc
