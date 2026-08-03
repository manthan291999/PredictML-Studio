from sklearn.linear_model import LinearRegression, LogisticRegression
from backend.app.services.algorithms.base import BaseAlgorithm
from typing import Dict

class LinearAlgorithm(BaseAlgorithm):
    """
    Linear models: LinearRegression for Regression, LogisticRegression for Classification.
    Same "slot," swapped automatically depending on problem_type.
    """
    def get_model(self):
        if self.problem_type == 'regression':
            return LinearRegression
        else:
            return LogisticRegression

    def get_default_hyperparameters(self) -> Dict[str, list]:
        if self.problem_type == 'regression':
            return {
                'fit_intercept': [True, False]
            }
        else:
            return {
                'C': [0.1, 1.0, 10.0],
                'solver': ['lbfgs', 'liblinear']
            }
