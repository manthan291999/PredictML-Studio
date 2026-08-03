from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from backend.app.services.algorithms.base import BaseAlgorithm
from typing import Dict

class RandomForestAlgorithm(BaseAlgorithm):
    """
    Random Forest algorithm isolated in its own code structure.
    """
    def get_model(self):
        if self.problem_type == 'regression':
            return RandomForestRegressor
        else:
            return RandomForestClassifier

    def get_default_hyperparameters(self) -> Dict[str, list]:
        return {
            'n_estimators': [50, 100, 200],
            'max_depth': [None, 10, 20],
            'min_samples_split': [2, 5]
        }
