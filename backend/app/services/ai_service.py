
import os
from @google/genai import GoogleGenAI
from typing import Dict, Any

class AIService:
    def __init__(self):
        self.api_key = os.environ.get("API_KEY")

    async def generate_retention_intelligence(self, customer_data: Dict[str, Any], prob: float) -> Dict[str, str]:
        """Generates analytical insights using the Gemini reasoning engine."""
        ai = GoogleGenAI(apiKey=os.environ.get("API_KEY", ""))
        
        system_instruction = """
        You are the 'ChurnSense Analytics Engine'. Your objective is to perform a qualitative audit on customer data 
        and output high-impact retention maneuvers. 
        Maintain a professional, enterprise-grade tone. Do not use conversational filler.
        Format:
        1. STRATEGIC ANALYSIS: Data-driven outlook.
        2. HINDI INSIGHT: Professional Hinglish translation for field personnel.
        3. ACTIONS: 3 direct retention tactics.
        4. DRIVERS: Top 3 predictive features contributing to the result.
        """

        prompt = f"""
        Profile Audit: {customer_data}
        Inference Probability: {prob}%
        
        Execute the analysis as per the configured system logic.
        """
        
        try:
            response = await ai.models.generateContent({
                "model": "gemini-3-pro-preview",
                "contents": prompt,
                "config": {
                    "systemInstruction": system_instruction,
                    "thinkingConfig": {"thinkingBudget": 8192}
                }
            })
            return {"raw_text": response.text or "Error: Analysis engine timeout."}
        except Exception as e:
            return {"error": f"Internal Engine Error: {str(e)}"}

ai_service = AIService()
