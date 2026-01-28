
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime

class ChurnRequest(BaseModel):
    name: str
    tenure: int = Field(..., ge=0)
    monthly_charges: float = Field(..., ge=0)
    contract: str = Field(..., pattern="^(Month-to-month|One year|Two year)$")
    internet_service: str = Field(default="Fiber optic")
    support_calls: int = Field(default=0)
    is_senior_citizen: bool = False
    algorithm: str = "XGBoost"

class RiskMetrics(BaseModel):
    accuracy: float
    precision: float
    recall: float
    f1: float
    auc: float
    cv_mean_auc: float
    cv_std_auc: float

class ChurnAnalysisResponse(BaseModel):
    prediction_id: str
    timestamp: datetime
    probability: float
    risk_level: str
    confidence_score: float  # New metric: Ensemble stability
    drivers: List[str]
    strategies: List[str]
    insight_eng: str
    insight_hindi: str
    metrics: RiskMetrics
    feature_importance: Dict[str, float]
