import threading
from typing import Any, Dict, List, Optional
import pandas as pd
from backend.app.storage.base import StorageRepository
from backend.app.core.logger import get_logger

logger = get_logger(__name__)

class MemoryStore(StorageRepository):
    """
    Thread-safe in-memory repository implementation with concurrency lock mechanisms
    for managing active datasets, asynchronous training job states, and serialized model pipelines.
    """
    def __init__(self):
        self._lock = threading.RLock()
        self._datasets: Dict[str, pd.DataFrame] = {}
        self._jobs: Dict[str, Dict[str, Any]] = {}
        self._models: Dict[str, Dict[str, Any]] = {}
        logger.info("Initialized thread-safe MemoryStore repository.")

    def save_dataset(self, dataset_id: str, df: pd.DataFrame) -> None:
        with self._lock:
            self._datasets[dataset_id] = df
            logger.debug(f"Saved dataset '{dataset_id}' ({df.shape[0]} rows, {df.shape[1]} cols)")

    def get_dataset(self, dataset_id: str) -> Optional[pd.DataFrame]:
        with self._lock:
            return self._datasets.get(dataset_id)

    def save_job(self, job_id: str, job_data: Dict[str, Any]) -> None:
        with self._lock:
            self._jobs[job_id] = job_data
            logger.debug(f"Saved job state for '{job_id}'")

    def get_job(self, job_id: str) -> Optional[Dict[str, Any]]:
        with self._lock:
            return self._jobs.get(job_id)

    def update_job_status(self, job_id: str, status: str, error: Optional[str] = None, results: Optional[List[str]] = None) -> None:
        with self._lock:
            job = self._jobs.get(job_id, {})
            job["status"] = status
            if error is not None:
                job["error"] = error
            if results is not None:
                job["results"] = results
            self._jobs[job_id] = job
            logger.info(f"Updated job '{job_id}' status -> {status}")

    def save_model(self, model_id: str, model_data: Dict[str, Any]) -> None:
        with self._lock:
            self._models[model_id] = model_data
            logger.debug(f"Saved model record '{model_id}'")

    def get_model(self, model_id: str) -> Optional[Dict[str, Any]]:
        with self._lock:
            return self._models.get(model_id)

# Global singleton repository instance for dependency injection
storage = MemoryStore()
