from backend.app.services.algorithms.linear import LinearAlgorithm
from backend.app.services.algorithms.random_forest import RandomForestAlgorithm
from backend.app.services.algorithms.xgboost import XGBoostAlgorithm
from backend.app.services.algorithms.lightgbm import LightGBMAlgorithm
from backend.app.services.algorithms.catboost import CatBoostAlgorithm

def get_algorithm(algorithm_name: str, problem_type: str, random_state: int = 42):
    """
    Factory function to retrieve the correct algorithm slot instance.
    """
    mapping = {
        'linear': LinearAlgorithm,
        'random_forest': RandomForestAlgorithm,
        'xgboost': XGBoostAlgorithm,
        'lightgbm': LightGBMAlgorithm,
        'catboost': CatBoostAlgorithm
    }
    
    if algorithm_name not in mapping:
        raise ValueError(f"Unknown algorithm name {algorithm_name}. Available: {list(mapping.keys())}")
        
    return mapping[algorithm_name](problem_type, random_state)
