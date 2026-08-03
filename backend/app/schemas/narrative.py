from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class NarrativeResult(BaseModel):
    summary: str
    key_drivers: Optional[List[Dict[str, Any]]] = None
    recommendations: Optional[List[str]] = None
    caveats: Optional[List[str]] = None

class PredictionResponse(BaseModel):
    prediction: float
    local_shap: Dict[str, Any]
    narrative: Dict[str, Any]
