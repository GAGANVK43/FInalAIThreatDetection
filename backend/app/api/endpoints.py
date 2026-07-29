import json
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any

from backend.app.schemas.threat_schema import (
    SingleThreatRequest, BatchThreatRequest, PredictionResponse,
    ModelInfoResponse, HealthResponse
)
from backend.app.services.threat_service import ThreatDetectionService
from backend.app.database.db import get_db

router = APIRouter()
threat_service = ThreatDetectionService()

@router.get("/health", response_model=HealthResponse)
def health_check():
    model_loaded = threat_service.predictor.model is not None
    return {
        "status": "healthy" if model_loaded else "degraded",
        "service": "AI Threat Detection Engine",
        "model_loaded": model_loaded,
        "version": "2.0.0"
    }

@router.post("/predict")
def predict_threat(payload: SingleThreatRequest):
    try:
        data_dict = payload.model_dump() if hasattr(payload, 'model_dump') else payload.dict()
        res = threat_service.predict_threat(data_dict)

        # Save to SQLite Database for user history and dashboard stats
        user_id = data_dict.get("user_id") or 1
        input_text = data_dict.get("input_text") or data_dict.get("User Agent") or "Payload Inspection"
        category = res.get("attack_type") or res.get("predicted_attack") or "Unknown"
        risk_score = res.get("risk_score") or 50
        severity_label = "Critical" if risk_score > 75 else ("High" if risk_score > 50 else ("Medium" if risk_score > 25 else "Low"))

        try:
            conn = get_db()
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO user_scans (
                    user_id, input_text, input_type, predicted_attack, risk_score,
                    severity, indicators, recommended_actions, source_ip, destination_ip
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                user_id,
                input_text,
                data_dict.get("input_type") or "URL / Payload Text",
                category,
                risk_score,
                severity_label,
                json.dumps(res.get("indicators", [])),
                json.dumps(res.get("recommended_actions", [])),
                data_dict.get("source_ip") or "192.168.1.45",
                data_dict.get("destination_ip") or "10.0.0.1"
            ))
            conn.commit()
            scan_id = cursor.lastrowid
            conn.close()
            res["scan_id"] = scan_id
        except Exception as db_err:
            print(f"[DB Save Warning] {db_err}")

        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/batch-predict")
def batch_predict_threats(payload: BatchThreatRequest):
    try:
        records = [r.model_dump() if hasattr(r, 'model_dump') else r.dict() for r in payload.records]
        res = threat_service.predict_batch(records)
        return {"batch_size": len(res), "predictions": res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/model-info")
def get_model_info():
    return threat_service.get_model_info()

@router.get("/model-metrics")
def get_model_metrics():
    return threat_service.get_model_metrics()
