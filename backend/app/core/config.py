from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Template Generator"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    ANTHROPIC_API_KEY: str
    UNSPLASH_ACCESS_KEY: Optional[str] = None

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()