from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    name: str = Field(min_length=2, max_length=100)
    organization_slug: str = Field(pattern=r"^[a-z0-9-]+$")
    accept_terms: bool


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class RefreshTokenRequest(BaseModel):
    refresh_token: str | None = None


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(min_length=8, max_length=128)


class VerifyEmailRequest(BaseModel):
    token: str


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(min_length=8, max_length=128)


class UserOut(BaseModel):
    id: str
    email: EmailStr
    name: str
    role: str
    organization_id: str | None = None
    email_verified: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class OrganizationOut(BaseModel):
    id: str
    slug: str
    name: str

    model_config = {"from_attributes": True}


class RegisterResponse(BaseModel):
    user: UserOut
    organization: OrganizationOut


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "Bearer"
    expires_in: int
    user: UserOut


class RefreshTokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "Bearer"
    expires_in: int
