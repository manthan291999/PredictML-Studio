from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

class PreprocessingService:
    """
    Builds a generic and robust sklearn ColumnTransformer based on the inferred schema.
    This guarantees that the same pipeline logic serves all datasets without custom code per dataset.
    """
    
    @staticmethod
    def build_preprocessor(numeric_features: list, categorical_features: list) -> ColumnTransformer:
        """
        Constructs the Preprocessor dynamically.
        Numeric -> Impute Median -> Scale
        Categorical -> Impute Most Frequent -> One Hot Encode (ignore unknowns)
        """
        
        # Numeric transformer
        numeric_transformer = Pipeline(steps=[
            ('imputer', SimpleImputer(strategy='median')),
            ('scaler', StandardScaler())
        ])
        
        # Categorical transformer
        categorical_transformer = Pipeline(steps=[
            ('imputer', SimpleImputer(strategy='most_frequent')),
            ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
        ])
        
        # Combine them using ColumnTransformer
        preprocessor = ColumnTransformer(
            transformers=[
                ('num', numeric_transformer, numeric_features),
                ('cat', categorical_transformer, categorical_features)
            ],
            remainder='drop' # Drop columns not specified in schema (e.g. IDs)
        )
        
        return preprocessor
