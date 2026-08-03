from typing import Dict, Any, List, Optional
from pydantic import BaseModel

class ChartData(BaseModel):
    labels: Optional[List[str]] = None
    matrix: Optional[List[List[int]]] = None
    x: Optional[List[float]] = None
    y: Optional[List[float]] = None
    auc: Optional[float] = None

class ShapFeatureImportance(BaseModel):
    features: List[str]
    importance: List[float]

class ShapContribution(BaseModel):
    feature: str
    actual_value: Any
    shap_contribution: float

class LocalShapResult(BaseModel):
    base_value: Optional[float] = None
    contributions: Optional[List[ShapContribution]] = None
    error: Optional[str] = None
