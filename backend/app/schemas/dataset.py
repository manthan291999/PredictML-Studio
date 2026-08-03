from typing import Dict, List, Any
from pydantic import BaseModel, Field

class DatasetUploadResponse(BaseModel):
    dataset_id: str
    schema_info: Dict[str, Any] = Field(..., alias="schema")
    
    class Config:
        populate_by_name = True

class DatasetSchema(BaseModel):
    numeric_columns: List[str]
    categorical_columns: List[str]
    sample: List[Dict[str, Any]]
