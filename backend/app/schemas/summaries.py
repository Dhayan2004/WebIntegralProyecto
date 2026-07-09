from datetime import datetime

from pydantic import BaseModel


class SummaryCreate(BaseModel):
    title: str | None = None
    content: str | None = None
    document_id: str | None = None


class SummaryOut(BaseModel):
    id: str
    document_id: str | None
    title: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True
