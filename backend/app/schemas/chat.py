from datetime import datetime

from pydantic import BaseModel


class ChatSessionCreate(BaseModel):
    title: str = "Nueva conversacion"


class ChatSessionOut(BaseModel):
    id: str
    title: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ChatMessageCreate(BaseModel):
    message: str


class ChatMessageOut(BaseModel):
    id: str
    session_id: str
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True
