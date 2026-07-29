import os
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, List, Optional

from backend.app.ml.utils import logger, MODEL_DIR
from backend.app.ml.preprocessing import DataPreprocessor
from backend.app.ml.feature_engineering import FeatureEngineer
from backend.app.ml.explain import SHAPExplainer

class XGBoostPredictor:
    """
    Inference Engine:
    - Loads preprocessor, feature engineer & XGBoost model
    - Executes single and batch threat predictions
    - Returns prediction class, attack type, confidence, class probabilities, and SHAP explainability.
    """
    _instance: Optional["XGBoostPredictor"] = None

    def __init__(self):
        self.preprocessor: Optional[DataPreprocessor] = None
        self.feature_engineer: Optional[FeatureEngineer] = None
        self.model: Any = None
        self.explainer: Optional[SHAPExplainer] = None
        self.load_model_artifacts()

    @classmethod
    def get_instance(cls) -> "XGBoostPredictor":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def load_model_artifacts(self) -> None:
        try:
            model_file = os.path.join(MODEL_DIR, "xgboost_model.pkl")
            if os.path.exists(model_file):
                self.model = joblib.load(model_file)
                self.preprocessor = DataPreprocessor.load()
                self.feature_engineer = FeatureEngineer.load()
                self.explainer = SHAPExplainer(self.model)
                logger.info("Loaded XGBoost Inference Engine & SHAP Explainer successfully.")
            else:
                logger.warning("XGBoost model file not found. Run training pipeline first.")
        except Exception as e:
            logger.error(f"Error loading model artifacts: {e}")

    def predict_single(self, record: Dict[str, Any]) -> Dict[str, Any]:
        """
        Inference on a single log record / payload.
        """
        df = pd.DataFrame([record])
        return self.predict_batch([record])[0]

    def predict_batch(self, records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Inference on a batch of log records / payloads.
        """
        if self.model is None or self.preprocessor is None:
            self.load_model_artifacts()
            if self.model is None:
                raise RuntimeError("XGBoost model is not loaded. Train the model first.")

        df = pd.DataFrame(records)
        X_scaled = self.preprocessor.transform(df)
        X_selected = self.feature_engineer.transform(X_scaled)

        preds = self.model.predict(X_selected)
        probs = self.model.predict_proba(X_selected) if hasattr(self.model, "predict_proba") else None

        classes = self.preprocessor.classes_
        feature_names = [self.preprocessor.feature_cols[i] for i in self.feature_engineer.selected_indices]

        results = []
        for i, pred_idx in enumerate(preds):
            pred_idx = int(pred_idx)
            attack_type = classes[pred_idx] if pred_idx < len(classes) else "Unknown"

            prob_dist = {}
            confidence = 0.95
            if probs is not None:
                prob_vec = probs[i]
                confidence = float(np.max(prob_vec))
                for c_idx, c_name in enumerate(classes):
                    prob_dist[c_name] = round(float(prob_vec[c_idx]), 4)

            # SHAP Explanation for sample i
            shap_dict = {}
            if self.explainer:
                shap_dict = self.explainer.explain_sample(X_selected[i:i+1], feature_names)

            results.append({
                "predicted_class": pred_idx,
                "attack_type": attack_type,
                "confidence": round(confidence * 100, 1),
                "probabilities": prob_dist,
                "shap_explanation": shap_dict
            })

        return results
