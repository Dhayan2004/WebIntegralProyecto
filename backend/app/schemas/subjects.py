from datetime import datetime

from pydantic import BaseModel


class SubjectCreate(BaseModel):
    name: str
    description: str | None = None
    color: str = "#2563eb"


class SubjectUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    color: str | None = None


class SubjectOut(BaseModel):
    id: str
    name: str
    description: str | None
    color: str
    created_at: datetime

    class Config:
        from_attributes = True
