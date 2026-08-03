from typing import Dict, Any, List
import pandas as pd
import numpy as np
from sklearn.metrics import (
    mean_squared_error,
    mean_absolute_error,
    r2_score,
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix
)

class EvaluationService:
    """
    Computes performance metrics and visualization data (like confusion matrix or residuals)
    based on the problem type.
    """
    
    @staticmethod
    def evaluate_model(
        pipeline: Any,
        X_test: pd.DataFrame,
        y_test: pd.Series,
        problem_type: str
    ) -> Dict[str, Any]:
        """
        Runs the test set through the model and computes relevant metrics.
        """
        y_pred = pipeline.predict(X_test)
        results = {}
        
        if problem_type == "regression":
            mse = mean_squared_error(y_test, y_pred)
            results['metrics'] = {
                'rmse': float(np.sqrt(mse)),
                'mae': float(mean_absolute_error(y_test, y_pred)),
                'r2': float(r2_score(y_test, y_pred))
            }
            # Compute a sample of residuals for plotting
            residuals = np.array(y_test) - np.array(y_pred)
            y_pred_arr = np.array(y_pred)
            # Limit to 100 points for efficient frontend charting
            sample_idx = np.random.choice(len(residuals), min(100, len(residuals)), replace=False)
            results['charts'] = {
                'residual_plot': [
                    {"predicted": float(y_pred_arr[i]), "residual": float(residuals[i])} 
                    for i in sample_idx
                ]
            }
            
        else: # classification
            results['metrics'] = {
                'accuracy': float(accuracy_score(y_test, y_pred)),
                'precision': float(precision_score(y_test, y_pred, average='weighted', zero_division=0)),
                'recall': float(recall_score(y_test, y_pred, average='weighted', zero_division=0)),
                'f1': float(f1_score(y_test, y_pred, average='weighted', zero_division=0))
            }
            
            # ROC-AUC requires probabilities
            if hasattr(pipeline.named_steps['classifier_or_regressor'], "predict_proba"):
                y_proba = pipeline.predict_proba(X_test)
                # Handle binary vs multiclass
                if len(y_test.unique()) == 2:
                    results['metrics']['roc_auc'] = float(roc_auc_score(y_test, y_proba[:, 1]))
                else: # Multiclass (heuristic: One-vs-Rest)
                    results['metrics']['roc_auc'] = float(roc_auc_score(y_test, y_proba, multi_class='ovr'))

            # Confusion Matrix
            cm = confusion_matrix(y_test, y_pred)
            labels = sorted(y_test.unique().tolist())
            results['charts'] = {
                'confusion_matrix': {
                    'labels': [str(lbl) for lbl in labels],
                    'matrix': cm.tolist()
                }
            }
            
        return results
