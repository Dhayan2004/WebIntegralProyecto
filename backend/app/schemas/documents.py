from datetime import datetime

from pydantic import BaseModel


class DocumentCreate(BaseModel):
    title: str
    content: str | None = None
    subject_id: str | None = None
    file_name: str | None = None


class DocumentUpdate(BaseModel):
    title: str | None = None
    content: str | None = None
    subject_id: str | None = None
    status: str | None = None


class DocumentOut(BaseModel):
    id: str
    title: str
    content: str | None
    subject_id: str | None
    file_name: str | None
    file_size_bytes: int
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
