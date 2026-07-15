from datetime import datetime

from pydantic import BaseModel


class QuizCreate(BaseModel):
    question: str
    options: list[str]
    correct_answer: str
    document_id: str | None = None


class QuizGenerate(BaseModel):
    document_id: str | None = None
    text: str | None = None
    count: int = 5


class QuizOut(BaseModel):
    id: str
    document_id: str | None
    question: str
    options: list[str]
    correct_answer: str
    created_at: datetime

    class Config:
        from_attributes = True
