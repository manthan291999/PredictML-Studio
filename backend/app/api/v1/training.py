import uuid
import traceback
from typing import Any, Dict, List
import pandas as pd
from fastapi import APIRouter, Depends, BackgroundTasks
from backend.app.api.deps import (
    get_storage, get_dataset_service, get_training_service,
    get_evaluation_service, get_explainability_service
)
from backend.app.storage.base import StorageRepository
from backend.app.services.dataset_service import DatasetService
from backend.app.services.training_service import TrainingService
from backend.app.services.evaluation_service import EvaluationService
from backend.app.services.explainability_service import ExplainabilityService
from backend.app.core.exceptions import DatasetNotFoundError, JobNotFoundError
from backend.app.core.logger import get_logger
from backend.app.core.config import settings
from backend.app.schemas.training import TrainRequest, TrainResponse, JobStatusResponse

logger = get_logger(__name__)
router = APIRouter(prefix="/train", tags=["AutoML Pipeline Engine"])

def background_train_task(
    job_id: str,
    df: pd.DataFrame,
    target: str,
    problem: str,
    algos: List[str],
    storage: StorageRepository = get_storage(),
    dataset_service: DatasetService = get_dataset_service(),
    training_service: TrainingService = get_training_service(),
    evaluation_service: EvaluationService = get_evaluation_service(),
    explainability_service: ExplainabilityService = get_explainability_service()
):
    """Asynchronous background execution engine for training multi-algorithm candidate models and explainability calculations."""
    try:
        logger.info(f"[{job_id}] Starting background AutoML pipeline for target '{target}' ({problem}) across algorithms: {algos}")
        schema = dataset_service.infer_schema(df.drop(columns=[target]))
        num_feats = schema['numeric_columns']
        cat_feats = schema['categorical_columns']
        
        results = []
        for algo in algos:
            logger.info(f"[{job_id}] Training algorithm: {algo}")
            res = training_service.train_model(df, target, problem, algo, num_feats, cat_feats)
            
            # Evaluate model performance
            eval_metrics = evaluation_service.evaluate_model(res['pipeline'], res['X_test'], res['y_test'], problem)
            
            # Compute global SHAP feature importances
            global_shap = explainability_service.get_global_shap(res['pipeline'], df.drop(columns=[target]))
            
            model_record = {
                "id": res["run_id"],
                "algorithm": algo,
                "metrics": eval_metrics['metrics'],
                "charts": eval_metrics.get('charts', {}),
                "global_shap": global_shap,
                "pipeline": res['pipeline']
            }
            storage.save_model(res["run_id"], model_record)
            results.append(res["run_id"])
            
        storage.update_job_status(job_id, status="completed", results=results)
        logger.info(f"[{job_id}] AutoML pipeline completed successfully. Trained {len(results)} models.")
    except Exception as e:
        logger.error(f"[{job_id}] Pipeline execution exception: {str(e)}")
        traceback.print_exc()
        storage.update_job_status(job_id, status="failed", error=str(e))

@router.post("", response_model=TrainResponse)
def start_training(
    req: TrainRequest,
    background_tasks: BackgroundTasks,
    storage: StorageRepository = Depends(get_storage),
    dataset_service: DatasetService = Depends(get_dataset_service),
    training_service: TrainingService = Depends(get_training_service),
    evaluation_service: EvaluationService = Depends(get_evaluation_service),
    explainability_service: ExplainabilityService = Depends(get_explainability_service)
):
    """Launches an asynchronous AutoML training and explainability pipeline job."""
    df = storage.get_dataset(req.dataset_id)
    if df is None:
        if req.dataset_id.startswith("demo-"):
            try:
                df = dataset_service.load_dataset(f"{settings.DEMO_DATA_DIR}/{req.dataset_id}.csv")
                storage.save_dataset(req.dataset_id, df)
            except Exception as e:
                logger.error(f"Failed to lazy-load demo dataset '{req.dataset_id}': {str(e)}")
                raise DatasetNotFoundError(req.dataset_id)
        else:
            raise DatasetNotFoundError(req.dataset_id)
        
    problem_type = req.problem_type
    if not problem_type:
        problem_type = dataset_service.detect_problem_type(df, req.target_column)
        
    job_id = str(uuid.uuid4())
    storage.save_job(job_id, {"status": "running", "target_column": req.target_column, "dataset_id": req.dataset_id})
    
    background_tasks.add_task(
        background_train_task,
        job_id, df, req.target_column, problem_type, req.algorithms,
        storage, dataset_service, training_service, evaluation_service, explainability_service
    )
    
    logger.info(f"Dispatched training job '{job_id}' for dataset '{req.dataset_id}' ({problem_type})")
    return {"job_id": job_id, "problem_type": problem_type}

@router.get("/{job_id}/status", response_model=JobStatusResponse)
def get_job_status(job_id: str, storage: StorageRepository = Depends(get_storage)):
    """Polls real-time telemetry status of an executing pipeline job or returns leaderboard results upon completion."""
    job = storage.get_job(job_id)
    if not job:
        raise JobNotFoundError(job_id)
    
    if job['status'] == 'completed':
        leaderboard = []
        for mid in job.get('results', []):
            m = storage.get_model(mid)
            if m:
                leaderboard.append({
                    "model_id": m["id"],
                    "algorithm": m["algorithm"],
                    "metrics": m["metrics"]
                })
        
        # Sort leaderboard dynamically based on actual predictive performance metrics
        if leaderboard and "metrics" in leaderboard[0]:
            sample_metrics = leaderboard[0]["metrics"]
            if "rmse" in sample_metrics and sample_metrics.get("rmse") is not None:
                # For Regression: sort ascending by RMSE (lowest error = #1 rank), fallback to R2 descending
                leaderboard.sort(key=lambda x: (
                    x["metrics"].get("rmse") if x["metrics"].get("rmse") is not None else float('inf'),
                    -(x["metrics"].get("r2") if x["metrics"].get("r2") is not None else float('-inf'))
                ))
            elif "accuracy" in sample_metrics and sample_metrics.get("accuracy") is not None:
                # For Classification: sort descending by Accuracy (highest percentage = #1 rank), fallback to ROC-AUC
                leaderboard.sort(key=lambda x: (
                    x["metrics"].get("accuracy") if x["metrics"].get("accuracy") is not None else float('-inf'),
                    x["metrics"].get("roc_auc") if x["metrics"].get("roc_auc") is not None else float('-inf')
                ), reverse=True)
                
        sorted_results = [item["model_id"] for item in leaderboard]
        return {"status": "completed", "leaderboard": leaderboard, "results": sorted_results}
    
    return {"status": job['status'], "error": job.get("error")}
