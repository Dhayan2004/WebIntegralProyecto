from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.models.user import User
from app.dependencies.auth import get_current_user
from app.dependencies.db import get_db
from app.schemas.users import UserProfile, UserUpdate

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserProfile)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("/me", response_model=UserProfile)
def update_profile(
    payload: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(current_user, key, value)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_profile(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    current_user.is_active = False
    db.commit()
    return None
