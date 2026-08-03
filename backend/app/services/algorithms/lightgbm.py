from lightgbm import LGBMRegressor, LGBMClassifier
from backend.app.services.algorithms.base import BaseAlgorithm
from typing import Dict

class LightGBMAlgorithm(BaseAlgorithm):
    """
    LightGBM algorithm isolated in its own code structure.
    """
    def get_model(self):
        if self.problem_type == 'regression':
            return LGBMRegressor
        else:
            return LGBMClassifier

    def get_default_hyperparameters(self) -> Dict[str, list]:
        return {
            'n_estimators': [50, 100, 200],
            'learning_rate': [0.01, 0.1, 0.2],
            'num_leaves': [31, 50]
        }
