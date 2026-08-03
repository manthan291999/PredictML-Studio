from typing import Any, Dict
import pandas as pd
from fastapi import APIRouter, Depends
from backend.app.api.deps import get_storage, get_explainability_service, get_ai_narrative_service
from backend.app.storage.base import StorageRepository
from backend.app.services.explainability_service import ExplainabilityService
from backend.app.services.ai_narrative_service import AINarrativeService
from backend.app.core.exceptions import ModelNotFoundError
from backend.app.core.logger import get_logger
from backend.app.schemas.narrative import PredictionResponse

logger = get_logger(__name__)
router = APIRouter(prefix="/models", tags=["Model Execution & Explainability"])

@router.get("/{model_id}")
def get_model_details(model_id: str, storage: StorageRepository = Depends(get_storage)):
    """Retrieves full model evaluation metadata, ROC/R2 metric curves, confusion matrix charts, and global SHAP factors."""
    model_record = storage.get_model(model_id)
    if not model_record:
        raise ModelNotFoundError(model_id)
    return {
        "id": model_record["id"],
        "algorithm": model_record["algorithm"],
        "metrics": model_record["metrics"],
        "charts": model_record.get("charts", {}),
        "global_shap": model_record.get("global_shap", {})
    }

@router.post("/{model_id}/predict", response_model=PredictionResponse)
def predict_record(
    model_id: str,
    record: Dict[str, Any],
    storage: StorageRepository = Depends(get_storage),
    explainability_service: ExplainabilityService = Depends(get_explainability_service),
    ai_service: AINarrativeService = Depends(get_ai_narrative_service)
):
    """Executes single-record inference, calculates local SHAP factor contributions, and generates AI Diagnostic Storytelling narrative."""
    model_record = storage.get_model(model_id)
    if not model_record:
        raise ModelNotFoundError(model_id)
        
    pipeline = model_record['pipeline']
    df_record = pd.DataFrame([record])
    prediction = pipeline.predict(df_record)[0]
    
    # Mock background for kernel explainer / transformations
    test_df = pd.DataFrame([{k: 0 for k in record.keys()}])
    
    try:
        local_shap = explainability_service.get_local_shap(pipeline, test_df, df_record)
        narrative = ai_service.generate_narrative(
            float(prediction),
            model_record["algorithm"],
            local_shap.get('contributions', []),
            "Target"
        )
    except Exception as e:
        logger.error(f"Error during local SHAP or AI narrative generation for model '{model_id}': {str(e)}")
        local_shap = {"error": str(e), "contributions": []}
        narrative = {"summary": "Error generating AI narrative insights.", "caveats": [str(e)]}
        
    return {
        "prediction": float(prediction),
        "local_shap": local_shap,
        "narrative": narrative
    }
