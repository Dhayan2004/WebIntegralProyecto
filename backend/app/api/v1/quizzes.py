from fastapi import APIRouter, Depends, status

from app.db.models.user import User
from app.dependencies.auth import get_current_user
from app.dependencies.db import get_db
from app.schemas.quizzes import QuizCreate, QuizGenerate, QuizOut
from app.services.quiz_service import QuizService

router = APIRouter(prefix="/quizzes", tags=["Quizzes"])


@router.get("", response_model=list[QuizOut])
def list_quizzes(current_user: User = Depends(get_current_user), db=Depends(get_db)):
    return QuizService.list_quizzes(db=db, current_user=current_user)


@router.post("", response_model=QuizOut, status_code=status.HTTP_201_CREATED)
def create_quiz(payload: QuizCreate, current_user: User = Depends(get_current_user), db=Depends(get_db)):
    return QuizService.create_quiz(db=db, current_user=current_user, data=payload.model_dump())


@router.post("/generate", response_model=list[QuizOut], status_code=status.HTTP_201_CREATED)
def generate_quizzes(payload: QuizGenerate, current_user: User = Depends(get_current_user), db=Depends(get_db)):
    return QuizService.generate_quizzes(
        db=db,
        current_user=current_user,
        document_id=payload.document_id,
        text=payload.text,
        count=payload.count,
    )
