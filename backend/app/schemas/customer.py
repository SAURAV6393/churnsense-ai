
from pydantic import BaseModel, Field
from typing import Optional, List

class CustomerRequest(BaseModel):
    name: str = Field(..., example="Saurav Rajput")
    tenure: int = Field(..., ge=0, example=24)
    monthly_charges: float = Field(..., ge=0, example=85.50)
    total_charges: Optional[float] = None
    contract: str = Field(..., example="One year")
    internet_service: str = Field(default="Fiber optic")
    support_calls: int = Field(default=0, ge=0)
    algorithm: str = Field(default="Random Forest")

class PredictionMetrics(BaseModel):
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    auc_roc: float

class ChurnResponse(BaseModel):
    customer_name: str
    churn_probability: float
    risk_level: str
    key_factors: List[str]
    retention_strategies: List[str]
    executive_insight: str
    hindi_insight: str
    model_metrics: PredictionMetrics
