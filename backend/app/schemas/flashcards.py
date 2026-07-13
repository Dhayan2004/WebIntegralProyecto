from datetime import datetime

from pydantic import BaseModel


class FlashcardCreate(BaseModel):
    question: str
    answer: str
    document_id: str | None = None


class FlashcardGenerate(BaseModel):
    document_id: str | None = None
    text: str | None = None
    count: int = 5


class FlashcardOut(BaseModel):
    id: str
    document_id: str | None
    question: str
    answer: str
    created_at: datetime

    class Config:
        from_attributes = True
