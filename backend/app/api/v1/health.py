from fastapi import APIRouter
from backend.app.core.config import settings

router = APIRouter(prefix="/health", tags=["Health Diagnostics"])

@router.get("")
def health_check():
    """System diagnostic endpoint to verify active server status and API metadata."""
    return {
        "status": "ok",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "message": "PredictML Studio Autonomous AI Engine is fully operational."
    }
