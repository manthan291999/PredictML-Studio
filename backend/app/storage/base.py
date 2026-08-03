from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
import pandas as pd

class StorageRepository(ABC):
    """Abstract interface defining repository operations for datasets, models, and background jobs."""
    
    @abstractmethod
    def save_dataset(self, dataset_id: str, df: pd.DataFrame) -> None:
        pass
    
    @abstractmethod
    def get_dataset(self, dataset_id: str) -> Optional[pd.DataFrame]:
        pass
        
    @abstractmethod
    def save_job(self, job_id: str, job_data: Dict[str, Any]) -> None:
        pass
        
    @abstractmethod
    def get_job(self, job_id: str) -> Optional[Dict[str, Any]]:
        pass
        
    @abstractmethod
    def update_job_status(self, job_id: str, status: str, error: Optional[str] = None, results: Optional[List[str]] = None) -> None:
        pass
        
    @abstractmethod
    def save_model(self, model_id: str, model_data: Dict[str, Any]) -> None:
        pass
        
    @abstractmethod
    def get_model(self, model_id: str) -> Optional[Dict[str, Any]]:
        pass
