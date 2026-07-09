from fastapi import APIRouter, Depends, status

from app.db.models.user import User
from app.dependencies.auth import get_current_user
from app.dependencies.db import get_db
from app.schemas.summaries import SummaryCreate, SummaryOut
from app.services.summary_service import SummaryService

router = APIRouter(prefix="/summaries", tags=["Summaries"])


@router.get("", response_model=list[SummaryOut])
def list_summaries(current_user: User = Depends(get_current_user), db=Depends(get_db)):
    return SummaryService.list_summaries(db=db, current_user=current_user)


@router.post("", response_model=SummaryOut, status_code=status.HTTP_201_CREATED)
def create_summary(payload: SummaryCreate, current_user: User = Depends(get_current_user), db=Depends(get_db)):
    return SummaryService.create_summary(
        db=db,
        current_user=current_user,
        title=payload.title,
        content=payload.content,
        document_id=payload.document_id,
    )
