
import numpy as np
from typing import Dict, Any

class ChurnMLEngine:
    def __init__(self):
        # In a real production system, we would load a serialized .pkl model
        # Here we simulate the ML pipeline logic for ChurnSense AI
        pass

    def calculate_probability(self, data: Dict[str, Any]) -> float:
        """
        Simulates the logic of a Random Forest / XGBoost model.
        Weights features based on typical churn indicators.
        """
        score = 0
        
        # Tenure logic (Low tenure = High risk)
        if data['tenure'] < 6: score += 40
        elif data['tenure'] < 12: score += 20
        
        # Contract logic
        if data['contract'] == 'Month-to-month': score += 30
        
        # Charges logic
        if data['monthly_charges'] > 80: score += 15
        
        # Support logic
        if data['support_calls'] > 3: score += 25
        
        # Normalizing to 0-100%
        return min(99.9, max(1.1, float(score)))

    def get_metrics(self, algorithm: str) -> Dict[str, float]:
        """Returns baseline metrics for the selected algorithm."""
        baselines = {
            "Random Forest": {"acc": 0.89, "pre": 0.87, "rec": 0.84, "f1": 0.85, "auc": 0.91},
            "XGBoost": {"acc": 0.92, "pre": 0.90, "rec": 0.88, "f1": 0.89, "auc": 0.94},
            "Logistic Regression": {"acc": 0.81, "pre": 0.79, "rec": 0.76, "f1": 0.77, "auc": 0.85}
        }
        return baselines.get(algorithm, baselines["Random Forest"])

ml_engine = ChurnMLEngine()
