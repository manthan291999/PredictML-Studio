from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.core.logger import logger
from backend.app.core.exceptions import PredictMLException
from backend.app.api.router import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(PredictMLException)
async def predictml_exception_handler(request: Request, exc: PredictMLException):
    logger.error(f"Domain exception on {request.method} {request.url.path}: {exc.message}")
    return JSONResponse(
        status_code=400,
        content={"error": "PredictML Domain Error", "detail": exc.message}
    )

@app.on_event("startup")
async def startup_event():
    logger.info(f"Starting up {settings.PROJECT_NAME} (v{settings.VERSION})...")
    logger.info("Modular v1 API routing fully operational.")

app.include_router(api_router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
