import shap
import numpy as np
import pandas as pd
from typing import Dict, Any, List

class ExplainabilityService:
    """
    Provides global and local model explanations using SHAP.
    Detects if the model is tree-based (TreeExplainer) or otherwise uses KernelExplainer.
    """
    
    @staticmethod
    def _get_explainer(pipeline: Any, X_background: pd.DataFrame):
        """
        Extracts the estimator from the pipeline and initializes the correct SHAP explainer.
        """
        model = pipeline.named_steps['classifier_or_regressor']
        
        # Check if it's a tree model (RandomForest, XGB, LGBM, CatBoost usually have 'estimators_' or specific class names)
        # TreeExplainer is extremely fast for these.
        model_name = type(model).__name__.lower()
        
        if 'forest' in model_name or 'xgb' in model_name or 'lgbm' in model_name or 'catboost' in model_name:
            explainer = shap.TreeExplainer(model)
        else:
            # Fallback to KernelExplainer for Linear/Logistic modes etc.
            # Sample background strictly to keep it fast
            background_sample = X_background.sample(n=min(100, len(X_background)), random_state=42)
            explainer = shap.KernelExplainer(model.predict, background_sample)
            
        return explainer

    @staticmethod
    def get_global_shap(pipeline: Any, X_train: pd.DataFrame, max_display: int = 10) -> Dict[str, Any]:
        """
        Computes feature importance for the global view.
        X_train should be preprocessed data so SHAP can match exactly the model inputs.
        """
        # We need the transformed training data to generate SHAP values that matter to the final estimator
        preprocessor = pipeline.named_steps['preprocessor']
        X_transformed = preprocessor.transform(X_train)
        
        # We create a dummy DataFrame for SHAP visualization, with correct feature names
        num_features = preprocessor.transformers_[0][1].get_feature_names_out()
        cat_features = preprocessor.transformers_[1][1].get_feature_names_out()
        all_features = list(num_features) + list(cat_features)
        
        X_trans_df = pd.DataFrame(X_transformed, columns=all_features)
        
        # Speed optimization: sample 500 rows globally
        X_sample = X_trans_df.sample(n=min(500, len(X_trans_df)), random_state=42)
        
        explainer = ExplainabilityService._get_explainer(pipeline, X_sample)
        shap_values = explainer.shap_values(X_sample)
        
        # For classification, shap_values might be a list of arrays (one per class). We take class 1.
        if isinstance(shap_values, list):
            shap_values = shap_values[1]
            
        # Calculate mean absolute shap values for global feature importance
        mean_abs_shap = np.mean(np.abs(shap_values), axis=0)
        
        # Sort and take top K
        sorted_idx = np.argsort(mean_abs_shap)[::-1][:max_display]
        top_features = [all_features[i] for i in sorted_idx]
        top_values = [float(mean_abs_shap[i]) for i in sorted_idx]
        
        return {
            "features": top_features,
            "importance": top_values
        }

    @staticmethod
    def get_local_shap(pipeline: Any, X_train: pd.DataFrame, record: pd.DataFrame) -> Dict[str, Any]:
        """
        Computes SHAP for a single record prediction (e.g., What-If analysis).
        """
        preprocessor = pipeline.named_steps['preprocessor']
        
        # Transform the single record
        record_transformed = preprocessor.transform(record)
        
        num_features = preprocessor.transformers_[0][1].get_feature_names_out()
        cat_features = preprocessor.transformers_[1][1].get_feature_names_out()
        all_features = list(num_features) + list(cat_features)
        
        record_trans_df = pd.DataFrame(record_transformed, columns=all_features)
        
        # Need some background for KernelExplainer if not tree
        X_trans_train = pd.DataFrame(preprocessor.transform(X_train), columns=all_features)
        
        explainer = ExplainabilityService._get_explainer(pipeline, X_trans_train)
        
        shap_values = explainer.shap_values(record_trans_df)
        expected_value = explainer.expected_value
        
        if isinstance(shap_values, list):
            shap_values = shap_values[1][0]
            expected_value = expected_value[1] if isinstance(expected_value, (list, np.ndarray)) else expected_value
        else:
            shap_values = shap_values[0]
            expected_value = expected_value if not isinstance(expected_value, (list, np.ndarray)) else expected_value[0]
            
        # Returning base_value and shap_values suited for force plots/waterfalls
        result = []
        for feat, val, output_val in zip(all_features, record_trans_df.iloc[0].values, shap_values):
            if abs(output_val) > 1e-4: # Filter zeroes
                result.append({
                    "feature": feat,
                    "actual_value": float(val),
                    "shap_contribution": float(output_val)
                })
        
        # Sort by impact
        result = sorted(result, key=lambda x: abs(x["shap_contribution"]), reverse=True)
        
        return {
            "base_value": float(expected_value),
            "contributions": result[:10]  # Return top 10 factors driving the change for the UI
        }
