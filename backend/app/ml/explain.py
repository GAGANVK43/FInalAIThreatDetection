import numpy as np
import pandas as pd
import shap
from typing import Dict, Any, List, Optional
from backend.app.ml.utils import logger

class SHAPExplainer:
    """
    SHAP Explainability Engine:
    Uses TreeExplainer to generate local feature contributions for XGBoost inference.
    """
    def __init__(self, model: Any):
        self.model = model
        self.explainer = None
        try:
            self.explainer = shap.TreeExplainer(model)
            logger.info("Initialized SHAP TreeExplainer for XGBoost model.")
        except Exception as e:
            logger.warning(f"Could not initialize SHAP TreeExplainer: {e}")

    def explain_sample(self, X_sample: np.ndarray, feature_names: List[str]) -> Dict[str, float]:
        """
        Computes SHAP feature importance impact for a single prediction sample.
        """
        if self.explainer is None:
            return {f: 0.0 for f in feature_names}

        try:
            shap_values = self.explainer.shap_values(X_sample)

            # Handle multiclass or 2D/3D array outputs
            if isinstance(shap_values, list):
                # Take average magnitude across classes
                mean_shap = np.mean([np.abs(sv[0]) for sv in shap_values], axis=0)
            elif len(shap_values.shape) == 3:
                mean_shap = np.mean(np.abs(shap_values[0]), axis=0)
            else:
                mean_shap = np.abs(shap_values[0])

            explanation = {}
            for idx, feat in enumerate(feature_names):
                val = float(mean_shap[idx]) if idx < len(mean_shap) else 0.0
                explanation[feat] = round(val, 4)

            return explanation
        except Exception as e:
            logger.warning(f"SHAP explanation failed: {e}")
            return {f: 0.0 for f in feature_names}
