from fastapi import APIRouter, Depends, status

from app.db.models.user import User
from app.dependencies.auth import get_current_user
from app.dependencies.db import get_db
from app.schemas.chat import ChatMessageCreate, ChatMessageOut, ChatSessionCreate, ChatSessionOut
from app.services.chat_service import ChatService

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.get("/sessions", response_model=list[ChatSessionOut])
def list_sessions(current_user: User = Depends(get_current_user), db=Depends(get_db)):
    return ChatService.list_sessions(db=db, current_user=current_user)


@router.post("/sessions", response_model=ChatSessionOut, status_code=status.HTTP_201_CREATED)
def create_session(payload: ChatSessionCreate, current_user: User = Depends(get_current_user), db=Depends(get_db)):
    return ChatService.create_session(db=db, current_user=current_user, title=payload.title)


@router.get("/sessions/{session_id}/messages", response_model=list[ChatMessageOut])
def list_messages(session_id: str, current_user: User = Depends(get_current_user), db=Depends(get_db)):
    return ChatService.list_messages(db=db, session_id=session_id, current_user=current_user)


@router.post("/sessions/{session_id}/messages", response_model=list[ChatMessageOut], status_code=status.HTTP_201_CREATED)
def send_message(session_id: str, payload: ChatMessageCreate, current_user: User = Depends(get_current_user), db=Depends(get_db)):
    return ChatService.send_message(db=db, session_id=session_id, current_user=current_user, message=payload.message)
