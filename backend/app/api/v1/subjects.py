from fastapi import APIRouter, Depends, status

from app.db.models.user import User
from app.dependencies.auth import get_current_user
from app.dependencies.db import get_db
from app.schemas.subjects import SubjectCreate, SubjectOut, SubjectUpdate
from app.services.subject_service import SubjectService

router = APIRouter(prefix="/subjects", tags=["Subjects"])


@router.get("", response_model=list[SubjectOut])
def list_subjects(current_user: User = Depends(get_current_user), db=Depends(get_db)):
    return SubjectService.list_subjects(db=db, current_user=current_user)


@router.post("", response_model=SubjectOut, status_code=status.HTTP_201_CREATED)
def create_subject(payload: SubjectCreate, current_user: User = Depends(get_current_user), db=Depends(get_db)):
    return SubjectService.create_subject(db=db, current_user=current_user, data=payload.model_dump())


@router.patch("/{subject_id}", response_model=SubjectOut)
def update_subject(subject_id: str, payload: SubjectUpdate, current_user: User = Depends(get_current_user), db=Depends(get_db)):
    return SubjectService.update_subject(db=db, subject_id=subject_id, current_user=current_user, data=payload.model_dump(exclude_unset=True))


@router.delete("/{subject_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_subject(subject_id: str, current_user: User = Depends(get_current_user), db=Depends(get_db)):
    SubjectService.delete_subject(db=db, subject_id=subject_id, current_user=current_user)
    return None
