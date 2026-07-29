import os
from typing import Dict, Any, List
from backend.app.ml.predict import XGBoostPredictor
from backend.app.ml.utils import load_json, MODEL_DIR, logger

class ThreatDetectionService:
    """
    Business logic layer for threat detection and model metadata.
    """
    def __init__(self):
        self.predictor = XGBoostPredictor.get_instance()

    def predict_threat(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes single prediction with risk score & actions mapping.
        """
        res = self.predictor.predict_single(payload)

        # Risk Score Mapping
        attack_type = res["attack_type"]
        confidence = res["confidence"]
        sev = str(payload.get("attack_severity", "High")).capitalize()
        sev_map = {"Critical": 85, "High": 65, "Medium": 45, "Low": 25}
        base_risk = sev_map.get(sev, 50)
        risk_score = min(99, max(10, base_risk + int((confidence / 100) * 15)))

        actions_map = {
            "Phishing": ["Block URL domain in Email Gateway & DNS Filter", "Revoke compromised session tokens", "Issue User Security Alert"],
            "Malware": ["Quarantine executable file payload", "Isolate host computer from local network", "Run EDR Deep Endpoint Scan"],
            "DDoS": ["Enable Cloudflare/AWS Shield Rate Limiting", "Null-route offending Source IP", "Scale Server Load Balancer"],
            "SQL Injection": ["Enable Web Application Firewall (WAF) Rule", "Sanitize SQL parameters", "Block IP on Perimeter Firewall"],
            "Ransomware": ["Disconnect storage network adapter", "Block Command & Control (C2) IPs", "Initiate Emergency System Backup Recovery"]
        }

        actions = actions_map.get(attack_type, ["Monitor traffic log stream", "Log incident for audit"])

        res["risk_score"] = risk_score
        res["recommended_actions"] = actions
        return res

    def predict_batch(self, records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Executes batch predictions.
        """
        results = self.predictor.predict_batch(records)
        for i, res in enumerate(results):
            payload = records[i]
            sev = str(payload.get("attack_severity", "High")).capitalize()
            base_risk = {"Critical": 85, "High": 65, "Medium": 45, "Low": 25}.get(sev, 50)
            res["risk_score"] = min(99, max(10, base_risk + int((res["confidence"] / 100) * 15)))
            res["recommended_actions"] = ["Isolate Host", "Block IP"]
        return results

    def get_model_info(self) -> Dict[str, Any]:
        """
        Returns model metadata & hyperparameters.
        """
        model = self.predictor.model
        params = model.get_params() if hasattr(model, "get_params") else {}
        # Clean numpy types for JSON
        clean_params = {k: str(v) for k, v in params.items()}
        classes = self.predictor.preprocessor.classes_ if self.predictor.preprocessor else []
        feat_cols = self.predictor.preprocessor.feature_cols if self.predictor.preprocessor else []

        return {
            "model_name": "XGBoost Classifier",
            "version": "2.0.0",
            "hyperparameters": clean_params,
            "feature_count": len(feat_cols),
            "supported_classes": list(classes),
            "training_status": "TRAINED_AND_ACTIVE" if model is not None else "NOT_TRAINED"
        }

    def get_model_metrics(self) -> Dict[str, Any]:
        """
        Returns saved model evaluation metrics JSON.
        """
        metrics_file = os.path.join(MODEL_DIR, "metrics.json")
        return load_json(metrics_file)
