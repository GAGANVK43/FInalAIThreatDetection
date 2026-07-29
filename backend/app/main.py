import os
import re
import json
import sqlite3
import pandas as pd
import numpy as np
import joblib
from urllib.parse import urlparse
from fastapi import FastAPI, Query, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from backend.app.database.db import get_db, init_db, hash_password
from backend.app.api.endpoints import router as ml_router
from backend.app.services.threat_service import ThreatDetectionService
from backend.app.ml.train import XGBoostTrainer

app = FastAPI(
    title="AI Threat Detection Platform",
    description="Production XGBoost Threat Analytics & User Session Management API",
    version="2.0.0"
)

# Enable CORS for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Modular ML Router (/predict, /batch-predict, /model-info, /model-metrics, /health)
app.include_router(ml_router)

threat_service = ThreatDetectionService()

@app.on_event("startup")
def startup():
    init_db()
    # Check if XGBoost model is trained, if not train it automatically
    model_file = os.path.join(os.path.dirname(__file__), "ml", "model", "xgboost_model.pkl")
    if not os.path.exists(model_file):
        try:
            print("[Backend Startup] Pre-trained XGBoost model not found. Initializing pipeline training...")
            trainer = XGBoostTrainer()
            trainer.train_pipeline()
        except Exception as e:
            print(f"[Backend Warning] Auto-training failed: {e}")

# Validation Helpers
EMAIL_REGEX = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
PHONE_REGEX = r"^\+?[0-9]{8,15}$"

def validate_email(email: str) -> bool:
    return bool(re.match(EMAIL_REGEX, email))

def validate_phone(phone: str) -> bool:
    clean_phone = re.sub(r'[\s\-()]', '', phone)
    return bool(re.match(PHONE_REGEX, clean_phone))

def is_strong_password(password: str) -> bool:
    if len(password) < 8:
        return False
    if not re.search(r"[A-Z]", password):
        return False
    if not re.search(r"[0-9]", password):
        return False
    if not re.search(r"[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?]", password):
        return False
    return True

# Pydantic Request Models for User Session
class RegisterRequest(BaseModel):
    identifier: str
    login_type: str
    name: str
    password: str

class LoginRequest(BaseModel):
    identifier: str
    login_type: str
    password: str

class UserThreatScanRequest(BaseModel):
    user_id: int
    input_text: str
    input_type: Optional[str] = "auto"
    source_ip: Optional[str] = "192.168.1.45"
    destination_ip: Optional[str] = "10.0.0.1"

# ROOT ENDPOINT
@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "AI Threat Detection Engine",
        "model_type": "XGBoost Classifier",
        "version": "2.0.0",
        "endpoints": {
            "predict": "/predict",
            "batch_predict": "/batch-predict",
            "model_info": "/model-info",
            "model_metrics": "/model-metrics",
            "health": "/health"
        }
    }

# AUTH ENDPOINTS
@app.post("/api/auth/register")
def register_user(payload: RegisterRequest):
    identifier = payload.identifier.strip().lower()
    if not identifier:
        raise HTTPException(status_code=400, detail="Email or Mobile number is required.")

    if payload.login_type == "gmail":
        if not validate_email(identifier):
            raise HTTPException(status_code=400, detail="Invalid Email format! Must be valid e.g. user@gmail.com")
    elif payload.login_type == "mobile":
        if not validate_phone(identifier):
            raise HTTPException(status_code=400, detail="Invalid Mobile Phone Number format! (8-15 digits required)")

    if not is_strong_password(payload.password):
        raise HTTPException(
            status_code=400,
            detail="Password is too weak! Must be at least 8 characters long, contain an uppercase letter (A-Z), a number (0-9), and a special character (!@#$%^&*)."
        )

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE identifier = ?", (identifier,))
    existing = cursor.fetchone()

    if existing:
        conn.close()
        raise HTTPException(status_code=400, detail="An account with this email or mobile number already exists. Please login instead.")

    pwd_hash = hash_password(payload.password)
    cursor.execute(
        "INSERT INTO users (identifier, login_type, name, password_hash) VALUES (?, ?, ?, ?)",
        (identifier, payload.login_type, payload.name, pwd_hash)
    )
    conn.commit()
    user_id = cursor.lastrowid
    conn.close()

    return {
        "status": "success",
        "user": {
            "user_id": user_id,
            "identifier": identifier,
            "login_type": payload.login_type,
            "name": payload.name
        }
    }

@app.post("/api/auth/login")
def login_user(payload: LoginRequest):
    identifier = payload.identifier.strip().lower()

    if payload.login_type == "gmail" and not validate_email(identifier):
        raise HTTPException(status_code=400, detail="Invalid Email format! Must be a valid email e.g. user@gmail.com")

    pwd_hash = hash_password(payload.password)

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, identifier, login_type, name, password_hash FROM users WHERE identifier = ?",
        (identifier,)
    )
    user = cursor.fetchone()
    conn.close()

    if not user:
        raise HTTPException(status_code=404, detail="Account not found. Please click 'Create Account' to register.")

    if user["password_hash"] != pwd_hash:
        raise HTTPException(status_code=401, detail="Incorrect password. Please check your credentials.")

    return {
        "status": "success",
        "user": {
            "user_id": user["id"],
            "identifier": user["identifier"],
            "login_type": user["login_type"],
            "name": user["name"]
        }
    }

# USER PROFILE
@app.get("/api/user/profile")
def get_user_profile(user_id: int):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT id, identifier, login_type, name, created_at FROM users WHERE id = ?", (user_id,))
    user = cursor.fetchone()
    if not user:
        conn.close()
        raise HTTPException(status_code=404, detail="User profile not found")

    cursor.execute("SELECT COUNT(*) as total FROM user_scans WHERE user_id = ?", (user_id,))
    total_scans = cursor.fetchone()["total"]

    cursor.execute("SELECT COUNT(*) as critical FROM user_scans WHERE user_id = ? AND severity = 'Critical'", (user_id,))
    critical_threats = cursor.fetchone()["critical"]

    cursor.execute("SELECT AVG(risk_score) as avg_risk FROM user_scans WHERE user_id = ?", (user_id,))
    avg_risk_row = cursor.fetchone()["avg_risk"]
    avg_risk = round(float(avg_risk_row), 1) if avg_risk_row is not None else 0.0

    cursor.execute("SELECT predicted_attack, COUNT(*) as cnt FROM user_scans WHERE user_id = ? GROUP BY predicted_attack", (user_id,))
    category_counts = {row["predicted_attack"]: row["cnt"] for row in cursor.fetchall()}

    cursor.execute("""
        SELECT id, input_text, input_type, predicted_attack, risk_score, severity, timestamp
        FROM user_scans
        WHERE user_id = ?
        ORDER BY id DESC
        LIMIT 5
    """, (user_id,))
    recent_scans = [dict(r) for r in cursor.fetchall()]

    conn.close()

    security_score = max(10, min(100, int(100 - avg_risk)))

    return {
        "user_info": {
            "id": user["id"],
            "name": user["name"],
            "identifier": user["identifier"],
            "login_type": user["login_type"],
            "member_since": user["created_at"]
        },
        "stats": {
            "total_scans": total_scans,
            "critical_threats": critical_threats,
            "avg_risk": avg_risk,
            "security_score": security_score,
            "phishing_caught": category_counts.get("Phishing", 0),
            "malware_intercepted": category_counts.get("Malware", 0),
            "ddos_detected": category_counts.get("DDoS", 0),
            "sqli_blocked": category_counts.get("SQL Injection", 0),
            "clean_links": category_counts.get("Safe / Legitimate Link", 0) + category_counts.get("Safe / Clean Message", 0)
        },
        "recent_scans": recent_scans
    }

# USER PREDICT (Invokes XGBoost Engine & Stores to SQLite)
@app.post("/api/predict")
def predict_and_store_threat(payload: UserThreatScanRequest):
    input_str = (payload.input_text or "").strip()
    if not input_str:
        raise HTTPException(status_code=400, detail="Input text is required")

    data_dict = {
        "input_text": input_str,
        "User Agent": input_str,
        "Source IP": payload.source_ip,
        "Destination IP": payload.destination_ip,
        "Attack Severity": "High",
        "Data Exfiltrated": False
    }

    # Execute XGBoost Prediction & SHAP
    xgb_res = threat_service.predict_threat(data_dict)

    category = xgb_res["attack_type"]
    risk_score = xgb_res["risk_score"]
    confidence = xgb_res["confidence"]
    recommended_actions = xgb_res["recommended_actions"]
    severity_label = "Critical" if risk_score > 75 else ("High" if risk_score > 50 else ("Medium" if risk_score > 25 else "Low"))

    indicators = [f"XGBoost Model Confidence: {confidence}%", f"Attack Vector Classified: {category}"]
    for k, v in xgb_res.get("shap_explanation", {}).items():
        if abs(v) > 0.05:
            indicators.append(f"SHAP feature impact '{k}': {v}")

    # Store in User's DB History
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO user_scans (
            user_id, input_text, input_type, predicted_attack, risk_score,
            severity, indicators, recommended_actions, source_ip, destination_ip
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        payload.user_id,
        input_str,
        "URL / Text Payload",
        category,
        risk_score,
        severity_label,
        json.dumps(indicators),
        json.dumps(recommended_actions),
        payload.source_ip,
        payload.destination_ip
    ))
    conn.commit()
    scan_id = cursor.lastrowid
    conn.close()

    return {
        "scan_id": scan_id,
        "input_analyzed": input_str,
        "input_type": "URL / Text Payload",
        "predicted_attack": category,
        "confidence": confidence,
        "risk_score": risk_score,
        "severity": severity_label,
        "indicators": indicators,
        "recommended_actions": recommended_actions,
        "probabilities": xgb_res.get("probabilities", {}),
        "shap_explanation": xgb_res.get("shap_explanation", {}),
        "source_ip": payload.source_ip,
        "destination_ip": payload.destination_ip,
        "timestamp": "Just now"
    }

# USER DASHBOARD STATS
@app.get("/api/user/stats")
def get_user_stats(user_id: int):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) as total FROM user_scans WHERE user_id = ?", (user_id,))
    total_scans = cursor.fetchone()["total"]

    cursor.execute("SELECT COUNT(*) as critical FROM user_scans WHERE user_id = ? AND severity = 'Critical'", (user_id,))
    critical_alerts = cursor.fetchone()["critical"]

    cursor.execute("SELECT COUNT(*) as exfil FROM user_scans WHERE user_id = ? AND risk_score > 60", (user_id,))
    high_risk_threats = cursor.fetchone()["exfil"]

    cursor.execute("SELECT predicted_attack, COUNT(*) as cnt FROM user_scans WHERE user_id = ? GROUP BY predicted_attack", (user_id,))
    attack_rows = cursor.fetchall()
    attack_distribution = {row["predicted_attack"]: row["cnt"] for row in attack_rows}

    cursor.execute("SELECT severity, COUNT(*) as cnt FROM user_scans WHERE user_id = ? GROUP BY severity", (user_id,))
    sev_rows = cursor.fetchall()
    severity_distribution = {row["severity"]: row["cnt"] for row in sev_rows}

    conn.close()

    exfil_rate = round((high_risk_threats / total_scans * 100), 2) if total_scans > 0 else 0.0

    return {
        "total_events": total_scans,
        "critical_alerts": critical_alerts,
        "high_risk_threats": high_risk_threats,
        "exfil_rate_pct": exfil_rate,
        "attack_distribution": attack_distribution,
        "severity_distribution": severity_distribution
    }

# USER LOG HISTORY TABLE
@app.get("/api/user/logs")
def get_user_logs(user_id: int, page: int = 1, limit: int = 10):
    conn = get_db()
    cursor = conn.cursor()

    offset = (page - 1) * limit
    cursor.execute("SELECT COUNT(*) as total FROM user_scans WHERE user_id = ?", (user_id,))
    total = cursor.fetchone()["total"]

    cursor.execute("""
        SELECT id, input_text, input_type, predicted_attack, risk_score, severity,
               indicators, recommended_actions, source_ip, destination_ip, timestamp
        FROM user_scans
        WHERE user_id = ?
        ORDER BY id DESC
        LIMIT ? OFFSET ?
    """, (user_id, limit, offset))

    rows = cursor.fetchall()
    conn.close()

    items = []
    for r in rows:
        items.append({
            "id": r["id"],
            "input_text": r["input_text"],
            "input_type": r["input_type"],
            "predicted_attack": r["predicted_attack"],
            "risk_score": r["risk_score"],
            "severity": r["severity"],
            "indicators": json.loads(r["indicators"]),
            "recommended_actions": json.loads(r["recommended_actions"]),
            "source_ip": r["source_ip"],
            "destination_ip": r["destination_ip"],
            "timestamp": r["timestamp"]
        })

    pages = (total + limit - 1) // limit if total > 0 else 1

    return {
        "items": items,
        "total": total,
        "page": page,
        "pages": pages
    }

@app.post("/api/user/clear-history")
def clear_user_history(user_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM user_scans WHERE user_id = ?", (user_id,))
    conn.commit()
    conn.close()
    return {"status": "cleared"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
