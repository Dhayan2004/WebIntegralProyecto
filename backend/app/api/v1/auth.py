from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.db.models.user import User
from app.dependencies.auth import get_current_user
from app.dependencies.db import get_db
from app.schemas.auth import (
    ChangePasswordRequest,
    ForgotPasswordRequest,
    RefreshTokenRequest,
    RefreshTokenResponse,
    RegisterResponse,
    ResetPasswordRequest,
    TokenResponse,
    UserLogin,
    UserRegister,
    VerifyEmailRequest,
)
from app.schemas.users import UserProfile
from app.services.auth_service import AuthService
from app.services.user_service import UserService

router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)


@router.get(
    "/me",
    response_model=UserProfile,
)
def get_me(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return UserService.serialize_user(
        db,
        current_user,
    )


@router.post(
    "/register",
    response_model=RegisterResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    payload: UserRegister,
    db: Session = Depends(get_db),
):
    if not payload.accept_terms:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Debe aceptar los términos",
        )

    try:
        result = AuthService.register(
            db=db,
            name=payload.name,
            email=payload.email,
            password=payload.password,
            organization_slug=payload.organization_slug,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        ) from error

    if not result:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="El correo ya está registrado",
        )

    user, organization = result

    return {
        "user": UserService.serialize_user(
            db,
            user,
        ),
        "organization": organization,
    }


@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(
    payload: UserLogin,
    db: Session = Depends(get_db),
):
    user = AuthService.authenticate(
        db=db,
        email=payload.email,
        password=payload.password,
    )

    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas",
        )

    # Durante el desarrollo, la verificación de correo
    # no bloquea el inicio de sesión.
    #
    # Cuando tengan un dominio verificado y el envío de
    # correos funcione para todos los usuarios, pueden
    # volver a activar esta validación:
    #
    # if not user.email_verified:
    #     raise HTTPException(
    #         status_code=status.HTTP_403_FORBIDDEN,
    #         detail=(
    #             "Debes verificar tu correo "
    #             "antes de iniciar sesión"
    #         ),
    #     )

    return AuthService.build_token_response(
        db,
        user,
    )


@router.post(
    "/refresh",
    response_model=RefreshTokenResponse,
)
def refresh_token(
    payload: RefreshTokenRequest,
    db: Session = Depends(get_db),
):
    if not payload.refresh_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Refresh token requerido",
        )

    response = AuthService.refresh_access_token(
        db=db,
        refresh_token=payload.refresh_token,
    )

    if not response:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token inválido o expirado",
        )

    return {
        "access_token": response["access_token"],
        "refresh_token": response["refresh_token"],
        "token_type": response["token_type"],
        "expires_in": response["expires_in"],
    }


@router.post(
    "/logout",
    status_code=status.HTTP_204_NO_CONTENT,
)
def logout(
    payload: RefreshTokenRequest | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    AuthService.revoke_refresh_token(
        db=db,
        refresh_token=(
            payload.refresh_token
            if payload
            else None
        ),
        user_id=(
            current_user.id
            if not payload
            or not payload.refresh_token
            else None
        ),
    )

    return None


@router.post(
    "/forgot-password",
    status_code=status.HTTP_202_ACCEPTED,
)
def forgot_password(
    payload: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    AuthService.start_password_reset(
        db=db,
        email=payload.email,
    )

    return {
        "message": (
            "Si el correo existe, recibirá "
            "instrucciones para restablecer "
            "la contraseña"
        )
    }


@router.post("/reset-password")
def reset_password(
    payload: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    try:
        success = AuthService.reset_password(
            db=db,
            token=payload.token,
            new_password=payload.new_password,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        ) from error

    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token inválido o expirado",
        )

    return {
        "message": (
            "Contraseña actualizada correctamente"
        )
    }


@router.post("/verify-email")
def verify_email(
    payload: VerifyEmailRequest,
    db: Session = Depends(get_db),
):
    success = AuthService.verify_email(
        db=db,
        token=payload.token,
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token inválido o expirado",
        )

    return {
        "message": (
            "Correo verificado correctamente"
        )
    }


@router.post(
    "/resend-verification",
    status_code=status.HTTP_202_ACCEPTED,
)
def resend_verification(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        AuthService.resend_verification(
            db=db,
            user=current_user,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        ) from error

    return {
        "message": (
            "Correo de verificación reenviado"
        )
    }


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

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        ) from error

    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Credenciales inválidas",
        )

    return {
        "message": (
            "Contraseña actualizada correctamente"
        )
    }