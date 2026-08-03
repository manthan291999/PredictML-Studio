from xgboost import XGBRegressor, XGBClassifier
from backend.app.services.algorithms.base import BaseAlgorithm
from typing import Dict

class XGBoostAlgorithm(BaseAlgorithm):
    """
    XGBoost algorithm isolated in its own code structure.
    """
    def get_model(self):
        if self.problem_type == 'regression':
            return XGBRegressor
        else:
            return XGBClassifier

    def get_default_hyperparameters(self) -> Dict[str, list]:
        return {
            'n_estimators': [50, 100, 200],
            'learning_rate': [0.01, 0.1, 0.2],
            'max_depth': [3, 5, 7]
        }
