from fastapi import HTTPException, status

class PredictMLException(Exception):
    """Base exception for PredictML Studio domain logic."""
    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)

class DatasetNotFoundError(HTTPException):
    def __init__(self, dataset_id: str):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Dataset with ID '{dataset_id}' was not found in active storage."
        )

class JobNotFoundError(HTTPException):
    def __init__(self, job_id: str):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pipeline training job '{job_id}' does not exist or has expired."
        )

class ModelNotFoundError(HTTPException):
    def __init__(self, model_id: str):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Model execution pipeline '{model_id}' was not found in model storage."
        )

class PipelineExecutionError(HTTPException):
    def __init__(self, reason: str):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Pipeline execution failed: {reason}"
        )
