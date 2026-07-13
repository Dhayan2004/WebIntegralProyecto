from datetime import datetime

from pydantic import BaseModel, EmailStr, Field, HttpUrl


class UserUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=100)
    avatar_url: HttpUrl | None = None
    preferences: dict | None = None


class DeleteOwnUserRequest(BaseModel):
    password: str
    confirmation: str


class UserAdminUpdate(BaseModel):
    role: str | None = Field(default=None, pattern="^(admin|member)$")
    is_active: bool | None = None


class UserPreferences(BaseModel):
    language: str = "es"
    theme: str = "dark"
    default_llm: str = "claude"


class UserProfile(BaseModel):
    id: str
    email: EmailStr
    name: str
    avatar_url: str | None = None
    role: str
    organization_id: str | None = None
    email_verified: bool
    preferences: dict
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class PaginationMeta(BaseModel):
    page: int
    page_size: int
    total_items: int
    total_pages: int
    has_next: bool
    has_previous: bool


class PaginatedUsersResponse(BaseModel):
    items: list[UserProfile]
    pagination: PaginationMeta
