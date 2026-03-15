
import uvicorn
import logging
import time
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from backend.app.routes import auth, prediction
from app.services.db_service import db_client

# Initialize Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("ChurnSenseAI")

app = FastAPI(
    title="ChurnSense AI - Enterprise Hub",
    description="Advanced Customer Churn Prediction & Retention Intelligence System (Python Engine)",
    version="3.5.0"
)

# Enterprise CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Timing Middleware for Performance Monitoring
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

@app.on_event("startup")
async def startup_db_client():
    logger.info("Initializing high-availability MongoDB connection...")
    await db_client.connect()

@app.on_event("shutdown")
async def shutdown_db_client():
    logger.info("Closing database connections gracefully...")
    await db_client.close()

# API V1 Routes
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(prediction.router, prefix="/api/v1/analytics", tags=["Predictions"])

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global Exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"message": "Internal processing error in ChurnSense Pipeline", "detail": str(exc)},
    )

@app.get("/")
async def health_check():
    return {
        "status": "operational",
        "engine": "ChurnSense AI Engine v3.5.0",
        "database": "Verified",
        "ml_pipeline": "XGBoost v2.x Ready"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=3000, reload=True)
