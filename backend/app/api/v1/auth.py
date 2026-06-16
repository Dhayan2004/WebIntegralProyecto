from fastapi import APIRouter

from app.schemas.auth import UserRegister, UserLogin

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
def register(user: UserRegister):

    return {
        "message": "Usuario recibido",
        "user": user
    }


@router.post("/login")
def login(user: UserLogin):

    return {
        "message": "Login recibido",
        "email": user.email
    }