from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.models.user import User
from app.dependencies.auth import get_current_user
from app.dependencies.db import get_db
from app.schemas.auth import (
    ChangePasswordRequest,
    ForgotPasswordRequest,
    RegisterResponse,
    RefreshTokenRequest,
    RefreshTokenResponse,
    ResetPasswordRequest,
    TokenResponse,
    UserLogin,
    UserRegister,
    VerifyEmailRequest,
)
from app.services.auth_service import AuthService
from app.services.user_service import UserService

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
def register(payload: UserRegister, db: Session = Depends(get_db)):
    if not payload.accept_terms:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Debe aceptar los terminos")

    result = AuthService.register(
        db=db,
        name=payload.name,
        email=payload.email,
        password=payload.password,
        organization_slug=payload.organization_slug,
    )
    if not result:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="El email ya esta registrado")

    user, organization = result
    return {
        "user": UserService.serialize_user(db, user),
        "organization": organization,
    }


@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = AuthService.authenticate(db=db, email=payload.email, password=payload.password)
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales invalidas")

    return AuthService.build_token_response(db, user)


@router.post("/refresh", response_model=RefreshTokenResponse)
def refresh_token(payload: RefreshTokenRequest, db: Session = Depends(get_db)):
    if not payload.refresh_token:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Refresh token requerido")

    response = AuthService.refresh_access_token(db=db, refresh_token=payload.refresh_token)
    if not response:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token invalido o expirado")

    return {
        "access_token": response["access_token"],
        "refresh_token": response["refresh_token"],
        "token_type": response["token_type"],
        "expires_in": response["expires_in"],
    }


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(
    payload: RefreshTokenRequest | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    AuthService.revoke_refresh_token(
        db=db,
        refresh_token=payload.refresh_token if payload else None,
        user_id=current_user.id if not payload or not payload.refresh_token else None,
    )
    return None


@router.post("/forgot-password", status_code=status.HTTP_202_ACCEPTED)
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    AuthService.start_password_reset(db=db, email=payload.email)
    return {"message": "Si el correo existe, recibirás instrucciones para restablecer la contraseña"}


@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    success = AuthService.reset_password(db=db, token=payload.token, new_password=payload.new_password)
    if not success:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Token invalido o expirado")
    return {"message": "Contraseña actualizada correctamente"}


@router.post("/verify-email")
def verify_email(payload: VerifyEmailRequest, db: Session = Depends(get_db)):
    success = AuthService.verify_email(db=db, token=payload.token)
    if not success:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Token invalido o expirado")
    return {"message": "Email verificado correctamente"}


@router.post("/resend-verification", status_code=status.HTTP_202_ACCEPTED)
def resend_verification(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        AuthService.resend_verification(db=db, user=current_user)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    return {"message": "Token de verificacion reenviado"}


@router.post("/change-password")
def change_password(
    payload: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        success = AuthService.change_password(
            db=db,
            user=current_user,
            current_password=payload.current_password,
            new_password=payload.new_password,
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    if not success:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Credenciales invalidas")
    return {"message": "Contraseña actualizada correctamente"}