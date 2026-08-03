from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class TrainRequest(BaseModel):
    dataset_id: str = Field(..., description="ID or demo filename of the dataset")
    target_column: str = Field(..., description="Target variable name for ML modeling")
    problem_type: Optional[str] = Field(None, description="Regression or Classification (auto-detected if blank)")
    algorithms: List[str] = Field(default=["linear", "random_forest", "xgboost", "lightgbm", "catboost"])

class TrainResponse(BaseModel):
    job_id: str
    problem_type: str

class LeaderboardItem(BaseModel):
    model_id: str
    algorithm: str
    metrics: Dict[str, Any]

class JobStatusResponse(BaseModel):
    status: str
    error: Optional[str] = None
    results: Optional[List[str]] = None
    leaderboard: Optional[List[LeaderboardItem]] = None
