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

app = FastAPI(
    title="AI Threat Detection Engine",
    description="User Profile & Password-Protected Threat Intelligence Platform",
    version="5.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODEL_PATH = os.path.join(BASE_DIR, "backend", "app", "ai", "saved_model.pkl")

ml_artifact = None

@app.on_event("startup")
def startup():
    init_db()
    global ml_artifact
    if os.path.exists(MODEL_PATH):
        try:
            ml_artifact = joblib.load(MODEL_PATH)
        except Exception as e:
            print(f"[Backend Warning] Could not load model: {e}")

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

# Pydantic Schemas
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

# Threat Analytics Logic
SUSPICIOUS_TLDS = ['.xyz', '.cc', '.top', '.tk', '.ru', '.biz', '.info', '.work', '.click', '.gq', '.ml', '.cf', '.ga']
PHISHING_KEYWORDS = ['login', 'verify', 'account', 'bank', 'update', 'paypal', 'secure', 'signin', 'credential', 'password', 'wallet', 'suspend', 'confirm', 'billing']
MALWARE_EXTENSIONS = ['.exe', '.scr', '.vbs', '.bat', '.apk', '.js', '.ps1', '.zip', '.rar', '.iso', '.dmg', '.sh']
URGENCY_PHRASES = ['urgent', 'immediately', 'suspended', 'account blocked', 'verify now', 'action required', 'unauthorized access', 'security breach', 'won a prize']
SQLI_PATTERNS = [r"select\s+.*\s+from", r"union\s+select", r"drop\s+table", r"or\s+'1'='1'", r"or\s+1=1"]

def analyze_url(url_str: str) -> Dict[str, Any]:
    url_str_clean = url_str.strip()
    if not (url_str_clean.startswith("http://") or url_str_clean.startswith("https://")):
        url_str_clean = "http://" + url_str_clean

    parsed = urlparse(url_str_clean)
    hostname = (parsed.hostname or "").lower()
    path = (parsed.path or "").lower()
    query = (parsed.query or "").lower()
    full_url = url_str_clean.lower()

    indicators = []
    threat_category = "Legitimate Link"
    base_risk = 10

    if re.match(r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$", hostname):
        indicators.append("Host is a raw IP address instead of domain name")
        base_risk += 35

    for tld in SUSPICIOUS_TLDS:
        if hostname.endswith(tld):
            indicators.append(f"High-risk untrusted TLD: '{tld}'")
            base_risk += 30
            break

    for ext in MALWARE_EXTENSIONS:
        if path.endswith(ext) or ext in query:
            indicators.append(f"Executable malware payload extension: '{ext}'")
            threat_category = "Malware"
            base_risk += 45
            break

    phish_matches = [kw for kw in PHISHING_KEYWORDS if kw in full_url]
    if phish_matches:
        indicators.append(f"Phishing keyword lures found: {', '.join(phish_matches[:3])}")
        base_risk += 35
        if threat_category != "Malware":
            threat_category = "Phishing"

    if hostname.count('.') > 3:
        indicators.append("Deceptive nested subdomain spoofing")
        base_risk += 15

    for pat in SQLI_PATTERNS:
        if re.search(pat, query):
            indicators.append("SQL Injection attack payload detected in query string")
            threat_category = "SQL Injection"
            base_risk += 40
            break

    risk_score = min(99, max(5, base_risk))
    if risk_score > 70 and threat_category == "Legitimate Link":
        threat_category = "Phishing"

    return {
        "detected_type": "URL Link",
        "category": threat_category if risk_score > 25 else "Safe / Legitimate Link",
        "risk_score": risk_score,
        "indicators": indicators if indicators else ["No threat indicators found in URL."],
        "confidence": 94.5 if risk_score > 50 else 98.5
    }

def analyze_message(msg_str: str) -> Dict[str, Any]:
    msg_lower = msg_str.lower()
    indicators = []
    threat_category = "Normal Message"
    base_risk = 10

    found_urgency = [phrase for phrase in URGENCY_PHRASES if phrase in msg_lower]
    found_phish_kw = [kw for kw in PHISHING_KEYWORDS if kw in msg_lower]

    if found_urgency or found_phish_kw:
        threat_category = "Phishing"
        base_risk += 40
        if found_urgency:
            indicators.append(f"Urgent social engineering pressure: '{found_urgency[0]}'")
        if found_phish_kw:
            indicators.append(f"Credential harvesting trigger words: {', '.join(found_phish_kw[:3])}")

    urls = re.findall(r'https?://[^\s]+', msg_str)
    if urls:
        indicators.append(f"Contains external link: {urls[0]}")
        url_res = analyze_url(urls[0])
        base_risk += int(url_res['risk_score'] * 0.5)
        if url_res['risk_score'] > 60:
            threat_category = url_res['category']
            indicators.extend(url_res['indicators'])

    for ext in MALWARE_EXTENSIONS:
        if ext in msg_lower:
            indicators.append(f"Mentions executable download attachment ('{ext}')")
            threat_category = "Malware"
            base_risk += 35
            break

    for pat in SQLI_PATTERNS:
        if re.search(pat, msg_lower):
            indicators.append("Malicious SQL syntax payload pattern detected")
            threat_category = "SQL Injection"
            base_risk += 45
            break

    if len(msg_str) > 2000 or msg_lower.count("get ") > 10:
        indicators.append("Excessive payload repetition / HTTP flood signature")
        threat_category = "DDoS"
        base_risk += 40

    risk_score = min(99, max(5, base_risk))

    return {
        "detected_type": "Message Text",
        "category": threat_category if risk_score > 25 else "Safe / Clean Message",
        "risk_score": risk_score,
        "indicators": indicators if indicators else ["Message content appears clean with no threat indicators."],
        "confidence": 92.0 if risk_score > 50 else 97.5
    }

# REGISTER WITH STRICT VALIDATIONS
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

# LOGIN
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

# GET USER PROFILE
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

# USER PREDICT & STORE THREAT
@app.post("/api/predict")
def predict_and_store_threat(payload: UserThreatScanRequest):
    input_str = (payload.input_text or "").strip()
    if not input_str:
        raise HTTPException(status_code=400, detail="Input text is required")

    is_url = input_str.startswith("http://") or input_str.startswith("https://") or ("." in input_str and "/" in input_str and " " not in input_str)

    if is_url or payload.input_type == "url":
        analysis = analyze_url(input_str)
    else:
        analysis = analyze_message(input_str)

    category = analysis["category"]
    risk_score = analysis["risk_score"]
    confidence = analysis["confidence"]
    indicators = analysis["indicators"]

    severity_label = "Critical" if risk_score > 75 else ("High" if risk_score > 50 else ("Medium" if risk_score > 25 else "Low"))

    actions_map = {
        "Phishing": ["Block URL domain in Email & DNS Filter", "Revoke compromised session tokens", "Issue User Security Alert"],
        "Malware": ["Quarantine executable file payload", "Isolate host computer from local network", "Run EDR Deep Endpoint Scan"],
        "DDoS": ["Enable Cloudflare/AWS Shield Rate Limiting", "Null-route offending Source IP", "Scale Server Load Balancer"],
        "SQL Injection": ["Enable Web Application Firewall (WAF) Rule", "Sanitize SQL parameters", "Block IP on Perimeter Firewall"]
    }

    recommended_actions = actions_map.get(
        category.replace(" Safe / Legitimate Link", "").replace(" Safe / Clean Message", "").strip(),
        ["Monitor traffic stream", "Log event for security audit"]
    )

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
        analysis["detected_type"],
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
        "input_type": analysis["detected_type"],
        "predicted_attack": category,
        "confidence": confidence,
        "risk_score": risk_score,
        "severity": severity_label,
        "indicators": indicators,
        "recommended_actions": recommended_actions,
        "source_ip": payload.source_ip,
        "destination_ip": payload.destination_ip,
        "timestamp": "Just now"
    }

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
