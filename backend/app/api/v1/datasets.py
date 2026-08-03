import uuid
from fastapi import APIRouter, Depends
from backend.app.api.deps import get_storage, get_dataset_service
from backend.app.storage.base import StorageRepository
from backend.app.services.dataset_service import DatasetService
from backend.app.core.exceptions import PipelineExecutionError
from backend.app.core.logger import get_logger
from backend.app.core.config import settings
from backend.app.schemas.dataset import DatasetUploadResponse

logger = get_logger(__name__)
router = APIRouter(prefix="/datasets", tags=["Dataset Management"])

@router.post("/upload", response_model=DatasetUploadResponse)
def upload_dataset(
    file_path: str,
    storage: StorageRepository = Depends(get_storage),
    dataset_service: DatasetService = Depends(get_dataset_service)
):
    """
    Ingests a dataset by file name or path into memory storage, infers analytical schema properties,
    and prepares column feature profiles for downstream AutoML modeling.
    """
    try:
        df = dataset_service.load_dataset(f"{settings.DEMO_DATA_DIR}/{file_path}")
        dataset_id = str(uuid.uuid4())
        storage.save_dataset(dataset_id, df)
        
        schema = dataset_service.infer_schema(df)
        logger.info(f"Dataset registered with ID: {dataset_id}")
        return {"dataset_id": dataset_id, "schema": schema}
    except Exception as e:
        logger.error(f"Failed to load dataset '{file_path}': {str(e)}")
        raise PipelineExecutionError(f"Dataset load failure: {str(e)}")
