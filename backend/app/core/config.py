import os


class Settings:
    PROJECT_NAME = os.getenv("PROJECT_NAME", "StudyBuddy AI API")
    API_V1_PREFIX = "/api/v1"
    SECRET_KEY = os.getenv("SECRET_KEY", "change-me-in-production")
    ALGORITHM = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "15"))
    REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))
    EMAIL_TOKEN_EXPIRE_HOURS = int(os.getenv("EMAIL_TOKEN_EXPIRE_HOURS", "24"))
    PASSWORD_RESET_TOKEN_EXPIRE_HOURS = int(os.getenv("PASSWORD_RESET_TOKEN_EXPIRE_HOURS", "1"))
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./studybuddy.db")
    BACKEND_CORS_ORIGINS = [
        origin.strip()
        for origin in os.getenv(
            "BACKEND_CORS_ORIGINS",
            "http://localhost:3000,http://127.0.0.1:3000",
        ).split(",")
        if origin.strip()
    ]


settings = Settings()
