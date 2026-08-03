from catboost import CatBoostRegressor, CatBoostClassifier
from backend.app.services.algorithms.base import BaseAlgorithm
from typing import Dict

class CatBoostAlgorithm(BaseAlgorithm):
    """
    CatBoost algorithm isolated in its own code structure.
    """
    def get_model(self):
        if self.problem_type == 'regression':
            return CatBoostRegressor
        else:
            return CatBoostClassifier

    def get_default_hyperparameters(self) -> Dict[str, list]:
        return {
            'iterations': [50, 100, 200],
            'learning_rate': [0.01, 0.1, 0.2],
            'depth': [4, 6, 8],
            'verbose': [0] # prevent logging spam
        }
