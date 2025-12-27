import os
from pathlib import Path

# Load .env file from project root if it exists
from dotenv import load_dotenv

# Find project root (two levels up from this file)
project_root = Path(__file__).parent.parent.parent.parent
env_path = project_root / ".env"
if env_path.exists():
    load_dotenv(env_path)


class Settings:
    PROJECT_NAME: str = "Backend"
    PROJECT_DESCRIPTION: str = "Backend"    
    PROJECT_VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # DATABASE
    DB_URI: str = os.getenv("DB_URI", "sqlite+aiosqlite:///./local.db")
    
    # LLM
    LLM_BASE_URL: str = os.getenv("LLM_BASE_URL", "https://api.openai.com/v1")
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", "")
    LLM_MODEL: str = os.getenv("LLM_MODEL", "gpt-4o-mini")
    
    # JWT
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "your-secret-key")
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

settings = Settings()
