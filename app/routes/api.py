
from fastapi import APIRouter, HTTPException
from app.schemas.churn import CustomerData, PredictionResponse
from app.services.prediction_service import prediction_service

router = APIRouter()

@router.post("/predict", response_model=PredictionResponse)
async def predict_single(data: CustomerData):
    try:
        result = await prediction_service.execute_analysis(data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health_check():
    return {"status": "healthy", "ml_pipeline": "online"}
