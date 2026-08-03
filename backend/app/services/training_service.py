import pandas as pd
from typing import Dict, Any, List
from sklearn.model_selection import RandomizedSearchCV, train_test_split
from sklearn.pipeline import Pipeline
import joblib
import os
import uuid

from backend.app.services.preprocessing_service import PreprocessingService
from backend.app.services.algorithms.factory import get_algorithm

class TrainingService:
    """
    Orchestrates the model training process: combines the generic preprocessor
    with the selected algorithm, performs hyperparameter tuning, and saves the
    trained pipeline to disk.
    """
    
    def __init__(self, model_dir: str = "backend/data/models/"):
        self.model_dir = model_dir
        os.makedirs(self.model_dir, exist_ok=True)
        
    def train_model(
        self,
        df: pd.DataFrame,
        target_column: str,
        problem_type: str,
        algorithm_name: str,
        numeric_features: List[str],
        categorical_features: List[str]
    ) -> Dict[str, Any]:
        """
        Trains a single model algorithm on the given dataset.
        Returns the saved artifact path and the trained model pipeline.
        """
        
        # 1. Prepare data
        X = df.drop(columns=[target_column])
        y = df[target_column]
        
        # Only use the declared features in X to avoid data leakage / bad columns
        used_features = numeric_features + categorical_features
        X = X[used_features]
        
        # 2. Get algorithm slot from factory
        algorithm = get_algorithm(algorithm_name, problem_type=problem_type)
        estimator = algorithm.get_model()()
        param_distributions = algorithm.get_default_hyperparameters()
        
        # 3. Build Preprocessor
        preprocessor = PreprocessingService.build_preprocessor(numeric_features, categorical_features)
        
        # 4. Construct complete pipeline
        pipeline = Pipeline(steps=[
            ('preprocessor', preprocessor),
            ('classifier_or_regressor', estimator)
        ])
        
        # 5. Adapt hyperparameter grid for pipeline (prefix with classifier_or_regressor__)
        pipeline_params = {f"classifier_or_regressor__{k}": v for k, v in param_distributions.items()}
        
        # 6. Train-test split for final holdout eval
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # 7. Hyperparameter tuning via RandomizedSearchCV (CV = 3 for brevity)
        search = RandomizedSearchCV(
            pipeline, 
            param_distributions=pipeline_params, 
            n_iter=5, # Keep low for fast MVP training
            cv=3, 
            random_state=42, 
            n_jobs=-1
        )
        
        search.fit(X_train, y_train)
        best_model = search.best_estimator_
        
        # 8. Save artifact
        run_id = str(uuid.uuid4())
        model_path = os.path.join(self.model_dir, f"{algorithm_name}_{run_id}.joblib")
        joblib.dump(best_model, model_path)
        
        # Return information for evaluation and tracking
        return {
            "run_id": run_id,
            "algorithm_name": algorithm_name,
            "best_params": search.best_params_,
            "model_path": model_path,
            "X_test": X_test,
            "y_test": y_test,
            "pipeline": best_model
        }
