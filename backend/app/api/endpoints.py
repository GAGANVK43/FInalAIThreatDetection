from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any

from backend.app.schemas.threat_schema import (
    SingleThreatRequest, BatchThreatRequest, PredictionResponse,
    ModelInfoResponse, HealthResponse
)
from backend.app.services.threat_service import ThreatDetectionService

router = APIRouter()
threat_service = ThreatDetectionService()

@router.get("/health", response_model=HealthResponse)
def health_check():
    """
    Service Health Check
    """
    model_loaded = threat_service.predictor.model is not None
    return {
        "status": "healthy" if model_loaded else "degraded",
        "service": "AI Threat Detection Engine",
        "model_loaded": model_loaded,
        "version": "2.0.0"
    }

@router.post("/predict")
def predict_threat(payload: SingleThreatRequest):
    """
    Single Threat Prediction with XGBoost + SHAP Explanation
    """
    try:
        data_dict = payload.model_dump() if hasattr(payload, 'model_dump') else payload.dict()
        res = threat_service.predict_threat(data_dict)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/batch-predict")
def batch_predict_threats(payload: BatchThreatRequest):
    """
    Batch Threat Prediction
    """
    try:
        records = [r.model_dump() if hasattr(r, 'model_dump') else r.dict() for r in payload.records]
        res = threat_service.predict_batch(records)
        return {"batch_size": len(res), "predictions": res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/model-info")
def get_model_info():
    """
    Get XGBoost Model Metadata & Parameters
    """
    return threat_service.get_model_info()

@router.get("/model-metrics")
def get_model_metrics():
    """
    Get Model Evaluation Metrics (Accuracy, Precision, Recall, F1, ROC-AUC, Confusion Matrix)
    """
    return threat_service.get_model_metrics()
