from backend.app.storage.base import StorageRepository
from backend.app.storage.memory_store import storage
from backend.app.services.dataset_service import DatasetService
from backend.app.services.training_service import TrainingService
from backend.app.services.evaluation_service import EvaluationService
from backend.app.services.explainability_service import ExplainabilityService
from backend.app.services.ai_narrative_service import AINarrativeService

# Instantiate service singleton instances for injection
_dataset_service = DatasetService()
_training_service = TrainingService()
_evaluation_service = EvaluationService()
_explainability_service = ExplainabilityService()
_ai_narrative_service = AINarrativeService()

def get_storage() -> StorageRepository:
    """Dependency provider returning the configured storage repository."""
    return storage

def get_dataset_service() -> DatasetService:
    return _dataset_service

def get_training_service() -> TrainingService:
    return _training_service

def get_evaluation_service() -> EvaluationService:
    return _evaluation_service

def get_explainability_service() -> ExplainabilityService:
    return _explainability_service

def get_ai_narrative_service() -> AINarrativeService:
    return _ai_narrative_service
