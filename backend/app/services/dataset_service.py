import pandas as pd
from typing import Dict, Any, Tuple
import os

class DatasetService:
    """
    Handles loading datasets and inferring their schema to automatically
    detect problem type (regression vs classification) and column types.
    """
    
    def __init__(self, data_dir: str = "backend/data/"):
        self.data_dir = data_dir
        os.makedirs(self.data_dir, exist_ok=True)

    def load_dataset(self, dataset_path: str) -> pd.DataFrame:
        """Loads a CSV/XLSX file into a DataFrame."""
        if dataset_path.endswith('.csv'):
            return pd.read_csv(dataset_path)
        elif dataset_path.endswith('.xlsx'):
            return pd.read_excel(dataset_path)
        else:
            raise ValueError("Unsupported file format. Use CSV or XLSX.")

    def infer_schema(self, df: pd.DataFrame) -> Dict[str, Any]:
        """
        Determines numeric vs categorical columns to dynamically build preprocessors.
        """
        schema = {
            'numeric_columns': [],
            'categorical_columns': [],
            'total_rows': len(df),
            'columns': df.columns.tolist()
        }
        
        for col in df.columns:
            if pd.api.types.is_numeric_dtype(df[col]):
                schema['numeric_columns'].append(col)
            else:
                schema['categorical_columns'].append(col)
                
        return schema

    def detect_problem_type(self, df: pd.DataFrame, target_column: str) -> str:
        """
        Infers whether the target implies a regression or classification problem.
        - Numeric with many unique values -> Regression
        - Otherwise (boolean, categorical, or low cardinality numeric) -> Classification
        """
        if target_column not in df.columns:
            raise ValueError(f"Target column '{target_column}' not found in dataset.")
            
        target_series = df[target_column]
        unique_cnt = target_series.nunique()
        
        # Categorical or Boolean is always classification
        if pd.api.types.is_object_dtype(target_series) or pd.api.types.is_bool_dtype(target_series):
            return "classification"
        
        # If numeric but unique values are small (e.g., <= 20) -> likely classification
        if unique_cnt <= 20:
            return "classification"
            
        return "regression"
