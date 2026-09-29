import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./projexus.db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "projexus-blueprint-engineering-secret-key-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    PRODUCTION_READY_THRESHOLD: int = int(os.getenv("PRODUCTION_READY_THRESHOLD", "75"))
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]

settings = Settings()
