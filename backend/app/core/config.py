import os
from pathlib import Path

class Settings:
    """Enterprise application settings and runtime configuration variables."""
    PROJECT_NAME: str = "PredictML Studio"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "Enterprise Autonomous AutoML Engine & Model Explainability Studio"
    DEBUG: bool = os.getenv("PREDICTML_DEBUG", "True").lower() == "true"
    API_V1_STR: str = "/api"
    
    # Base filesystem paths
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent
    DEMO_DATA_DIR: str = os.getenv("DEMO_DATA_DIR", "backend/data/demo_datasets")

settings = Settings()
