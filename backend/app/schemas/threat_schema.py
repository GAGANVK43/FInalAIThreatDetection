from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class SingleThreatRequest(BaseModel):
    source_ip: Optional[str] = "192.168.1.45"
    destination_ip: Optional[str] = "10.0.0.1"
    user_agent: Optional[str] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    attack_severity: Optional[str] = "High"
    data_exfiltrated: Optional[bool] = False
    input_text: Optional[str] = "http://paypal-security-verify.xyz/login.php"

class BatchThreatRequest(BaseModel):
    records: List[SingleThreatRequest]

class PredictionResponse(BaseModel):
    predicted_class: int
    attack_type: str
    confidence: float
    probabilities: Dict[str, float]
    shap_explanation: Dict[str, float]
    risk_score: int
    recommended_actions: List[str]

class ModelInfoResponse(BaseModel):
    model_name: str = "XGBoost Classifier"
    version: str = "2.0.0"
    hyperparameters: Dict[str, Any]
    feature_count: int
    supported_classes: List[str]
    training_status: str

class HealthResponse(BaseModel):
    status: str = "healthy"
    service: str = "AI Threat Detection Service"
    model_loaded: bool
    version: str = "2.0.0"
