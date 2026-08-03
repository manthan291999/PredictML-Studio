from abc import ABC, abstractmethod
from typing import Dict, Any, Optional

class BaseAlgorithm(ABC):
    """
    Base class for all ML algorithms in PredictML Studio.
    Every algorithm (Linear, RF, XGB, etc.) will inherit from this, keeping their code isolated and clean.
    """
    
    def __init__(self, problem_type: str, random_state: int = 42):
        """
        problem_type: 'regression' or 'classification'
        """
        self.problem_type = problem_type
        self.random_state = random_state
        self.model = None

    @abstractmethod
    def get_model(self) -> Any:
        """
        Returns the uninstantiated scikit-learn compatible estimator.
        """
        pass

    @abstractmethod
    def get_default_hyperparameters(self) -> Dict[str, list]:
        """
        Returns the default search space for hyperparameter tuning.
        """
        pass

    def build_estimator(self, **kwargs) -> Any:
        """
        Builds the estimator with specific kwargs.
        """
        estimator_class = self.get_model()
        
        # Inject random_state if the estimator accepts it
        if hasattr(estimator_class, "random_state"):
            kwargs["random_state"] = self.random_state
            
        return estimator_class(**kwargs)
