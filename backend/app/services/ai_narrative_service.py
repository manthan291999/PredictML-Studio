from openai import OpenAI
import json
import os
from typing import Dict, Any

class AINarrativeService:
    """
    Translates SHAP metrics and prediction numbers into a structured plain-English narrative for the user.
    Uses OpenAI's JSON mode to ensure the payload is immediately usable by the frontend.
    """
    
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY", "")
        if self.api_key:
            self.client = OpenAI(api_key=self.api_key)
        else:
            self.client = None
            
    def generate_narrative(
        self, 
        prediction_value: float, 
        problem_type: str, 
        shap_contributions: list,
        target_column: str
    ) -> Dict[str, Any]:
        """
        Takes the numerical outputs and passes them to the LLM.
        """
        # If API key is not present, return a fallback template
        if not self.client:
            return {
                "summary": f"The model predicted {prediction_value} for {target_column}. (Configure OPENAI_API_KEY for AI analysis)",
                "top_drivers": [f"{item['feature']} contributed {item['shap_contribution']:.4f}" for item in shap_contributions[:3]],
                "caveats": ["AI overview unavailable without API key."],
                "confidence_note": "Based purely on mathematical SHAP computation."
            }

        # Build context prompt
        context = {
            "target": target_column,
            "problem": problem_type,
            "predicted": prediction_value,
            "top_factors": shap_contributions[:5] # Only send top 5 to save tokens
        }
        
        prompt = f"""
        You are an expert Data Scientist explaining a machine learning prediction to a business user.
        Analyze the following prediction details and SHAP feature contributions.
        
        Context: {json.dumps(context, indent=2)}
        
        Provide a structured JSON output with the following keys:
        - "summary": A 1-2 sentence plain-English summary of the prediction.
        - "top_drivers": A list of 2-3 strings explaining how the top features pushed the prediction up or down in simple terms.
        - "caveats": A list of 1-2 strings noting any potential data limits or reasons for caution.
        - "confidence_note": A brief comforting or cautious note about model reliability.
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4-turbo-preview",
                response_format={ "type": "json_object" },
                messages=[
                    {"role": "system", "content": "You output strictly valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3
            )
            
            result = json.loads(response.choices[0].message.content)
            return result
        except Exception as e:
            return {
                "summary": "AI generation failed.",
                "top_drivers": [],
                "caveats": [f"Error contacting LLM: {str(e)}"],
                "confidence_note": "N/A"
            }
