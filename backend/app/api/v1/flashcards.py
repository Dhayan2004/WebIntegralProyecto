from fastapi import APIRouter, Depends, status

from app.db.models.user import User
from app.dependencies.auth import get_current_user
from app.dependencies.db import get_db
from app.schemas.flashcards import FlashcardCreate, FlashcardGenerate, FlashcardOut
from app.services.flashcard_service import FlashcardService

router = APIRouter(prefix="/flashcards", tags=["Flashcards"])


@router.get("", response_model=list[FlashcardOut])
def list_flashcards(current_user: User = Depends(get_current_user), db=Depends(get_db)):
    return FlashcardService.list_flashcards(db=db, current_user=current_user)


@router.post("", response_model=FlashcardOut, status_code=status.HTTP_201_CREATED)
def create_flashcard(payload: FlashcardCreate, current_user: User = Depends(get_current_user), db=Depends(get_db)):
    return FlashcardService.create_flashcard(db=db, current_user=current_user, data=payload.model_dump())


@router.post("/generate", response_model=list[FlashcardOut], status_code=status.HTTP_201_CREATED)
def generate_flashcards(payload: FlashcardGenerate, current_user: User = Depends(get_current_user), db=Depends(get_db)):
    return FlashcardService.generate_flashcards(
        db=db,
        current_user=current_user,
        document_id=payload.document_id,
        text=payload.text,
        count=payload.count,
    )
