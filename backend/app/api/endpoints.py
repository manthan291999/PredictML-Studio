from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import pandas as pd
import uuid

# Import services
from backend.app.services.dataset_service import DatasetService
from backend.app.services.training_service import TrainingService
from backend.app.services.evaluation_service import EvaluationService
from backend.app.services.explainability_service import ExplainabilityService
from backend.app.services.ai_narrative_service import AINarrativeService

# Initialize services (In a real app, use FastAPI Dependency Injection)
dataset_service = DatasetService()
training_service = TrainingService()
evaluation_service = EvaluationService()
explainability_service = ExplainabilityService()
ai_service = AINarrativeService()

router = APIRouter()

# In-memory stores for MVP
JOBS_STORE = {}
MODELS_STORE = {}
DATASETS_STORE = {}

class TrainReq(BaseModel):
    dataset_id: str
    target_column: str
    problem_type: Optional[str] = None
    algorithms: List[str] = ["linear", "random_forest", "xgboost"]

@router.get("/health")
def health_check():
    return {"status": "ok", "message": "PredictML API is running."}

@router.post("/datasets/upload")
def upload_dataset(file_path: str): # Simplified for MVP to take local path or bundled name
    try:
        df = dataset_service.load_dataset(f"backend/data/demo_datasets/{file_path}")
        dataset_id = str(uuid.uuid4())
        DATASETS_STORE[dataset_id] = df
        
        schema = dataset_service.infer_schema(df)
        return {"dataset_id": dataset_id, "schema": schema}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

def background_train_task(job_id: str, df: pd.DataFrame, target: str, problem: str, algos: List[str]):
    try:
        schema = dataset_service.infer_schema(df.drop(columns=[target]))
        num_feats = schema['numeric_columns']
        cat_feats = schema['categorical_columns']
        
        results = []
        for algo in algos:
            res = training_service.train_model(df, target, problem, algo, num_feats, cat_feats)
            
            # Evaluate
            eval_metrics = evaluation_service.evaluate_model(res['pipeline'], res['X_test'], res['y_test'], problem)
            
            # Global SHAP
            global_shap = explainability_service.get_global_shap(res['pipeline'], df.drop(columns=[target]))
            
            model_record = {
                "id": res["run_id"],
                "algorithm": algo,
                "metrics": eval_metrics['metrics'],
                "charts": eval_metrics.get('charts', {}),
                "global_shap": global_shap,
                "pipeline": res['pipeline']
            }
            MODELS_STORE[res["run_id"]] = model_record
            results.append(res["run_id"])
            
        JOBS_STORE[job_id] = {"status": "completed", "results": results}
    except Exception as e:
        JOBS_STORE[job_id] = {"status": "failed", "error": str(e)}

@router.post("/train")
def start_training(req: TrainReq, background_tasks: BackgroundTasks):
    if req.dataset_id not in DATASETS_STORE:
        if req.dataset_id.startswith("demo-"):
            try:
                # Lazy load demo datasets into memory 
                df = dataset_service.load_dataset(f"backend/data/demo_datasets/{req.dataset_id}.csv")
                DATASETS_STORE[req.dataset_id] = df
            except Exception as e:
                raise HTTPException(status_code=404, detail=f"Demo dataset {req.dataset_id} failed to load.")
        else:
            raise HTTPException(status_code=404, detail="Dataset not found")
        
    df = DATASETS_STORE[req.dataset_id]
    
    problem_type = req.problem_type
    if not problem_type:
        problem_type = dataset_service.detect_problem_type(df, req.target_column)
        
    job_id = str(uuid.uuid4())
    JOBS_STORE[job_id] = {"status": "running"}
    
    background_tasks.add_task(
        background_train_task, 
        job_id, df, req.target_column, problem_type, req.algorithms
    )
    
    return {"job_id": job_id, "problem_type": problem_type}

@router.get("/train/{job_id}/status")
def get_job_status(job_id: str):
    if job_id not in JOBS_STORE:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job = JOBS_STORE[job_id]
    if job['status'] == 'completed':
        # Return leaderboard
        leaderboard = []
        for mid in job['results']:
            m = MODELS_STORE[mid]
            leaderboard.append({
                "model_id": m["id"],
                "algorithm": m["algorithm"],
                "metrics": m["metrics"]
            })
        return {"status": "completed", "leaderboard": leaderboard}
    
    return job

@router.post("/models/{model_id}/predict")
def predict_record(model_id: str, record: Dict[str, Any]):
    if model_id not in MODELS_STORE:
        raise HTTPException(status_code=404, detail="Model not found")
        
    model_record = MODELS_STORE[model_id]
    pipeline = model_record['pipeline']
    
    df_record = pd.DataFrame([record])
    prediction = pipeline.predict(df_record)[0]
    
    # Get arbitrary training data strictly for SHAP background (MVP simplification)
    # Ideally, X_train is cached in the MODELS_STORE
    test_df = pd.DataFrame([{k:0 for k in record.keys()}]) # Fallback mock background
    
    try:
        local_shap = explainability_service.get_local_shap(pipeline, test_df, df_record)
        
        # AI narrative
        narrative = ai_service.generate_narrative(
            float(prediction), 
            "Unknown (infered)", 
            local_shap['contributions'],
            "Target"
        )
    except Exception as e:
        local_shap = {"error": str(e)}
        narrative = {"summary": "Error generating insights.", "caveats": [str(e)]}
        
    return {
        "prediction": float(prediction),
        "local_shap": local_shap,
        "narrative": narrative
    }
