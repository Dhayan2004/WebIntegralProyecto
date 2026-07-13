import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[2] / ".env")


class Settings:
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "StudyBuddy AI API")
    API_V1_PREFIX: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "change-me-in-production")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "15"))
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))
    EMAIL_TOKEN_EXPIRE_HOURS: int = int(os.getenv("EMAIL_TOKEN_EXPIRE_HOURS", "24"))
    PASSWORD_RESET_TOKEN_EXPIRE_HOURS: int = int(os.getenv("PASSWORD_RESET_TOKEN_EXPIRE_HOURS", "1"))
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./studybuddy.db")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    BACKEND_CORS_ORIGINS: list[str] = [
        origin.strip()
        for origin in os.getenv(
            "BACKEND_CORS_ORIGINS",
            "http://localhost:3000,http://127.0.0.1:3000",
        ).split(",")
        if origin.strip()
    ]


settings = Settings()
