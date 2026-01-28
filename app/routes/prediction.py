
from fastapi import APIRouter, HTTPException, Depends, Header
from app.schemas.churn import ChurnRequest, ChurnAnalysisResponse
from app.services.prediction_service import analytics_service
from app.services.auth_service import auth_service
from app.services.db_service import db_client
from typing import List

router = APIRouter()

async def get_current_user(authorization: str = Header(...)):
    token = authorization.split(" ")[1] if " " in authorization else authorization
    payload = auth_service.verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Unauthorized session")
    return payload["sub"]

@router.post("/predict", response_model=ChurnAnalysisResponse)
async def predict_customer(data: ChurnRequest, email: str = Depends(get_current_user)):
    try:
        return await analytics_service.run_analysis(email, data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history")
async def get_history(email: str = Depends(get_current_user)):
    cursor = db_client.db.predictions.find({"user_email": email}).sort("timestamp", -1)
    history = await cursor.to_list(length=100)
    # Convert ObjectIDs to strings for JSON
    for item in history:
        item["_id"] = str(item["_id"])
    return history
