from fastapi import APIRouter
from backend.app.api.v1 import datasets, training, models, health

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(datasets.router)
api_router.include_router(training.router)
api_router.include_router(models.router)
