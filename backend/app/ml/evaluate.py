import os
import json
import numpy as np
import pandas as pd
from typing import Dict, Any, List
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, classification_report
)

from backend.app.ml.utils import logger, save_json, MODEL_DIR

class ModelEvaluator:
    """
    Evaluation Engine:
    Computes Accuracy, Precision, Recall, F1, ROC-AUC, Confusion Matrix, Classification Report
    """
    @staticmethod
    def evaluate(
        model: Any,
        X_test: np.ndarray,
        y_test: np.ndarray,
        target_names: List[str],
        feature_names: List[str]
    ) -> Dict[str, Any]:
        logger.info("Evaluating XGBoost model performance on Test Dataset...")

        y_pred = model.predict(X_test)
        
        # Probabilities for ROC-AUC
        y_proba = model.predict_proba(X_test) if hasattr(model, "predict_proba") else None

        acc = float(accuracy_score(y_test, y_pred))
        prec = float(precision_score(y_test, y_pred, average='weighted', zero_division=0))
        rec = float(recall_score(y_test, y_pred, average='weighted', zero_division=0))
        f1 = float(f1_score(y_test, y_pred, average='weighted', zero_division=0))

        # ROC-AUC calculation
        roc_auc = None
        if y_proba is not None:
            try:
                if len(target_names) == 2:
                    roc_auc = float(roc_auc_score(y_test, y_proba[:, 1]))
                else:
                    roc_auc = float(roc_auc_score(y_test, y_proba, multi_class='ovr', average='weighted'))
            except Exception as e:
                logger.warning(f"Could not compute ROC-AUC: {e}")

        # Confusion Matrix & Classification Report
        cm = confusion_matrix(y_test, y_pred).tolist()
        report = classification_report(y_test, y_pred, target_names=target_names, output_dict=True, zero_division=0)

        # Feature Importance Mapping
        importance_map = {}
        if hasattr(model, "feature_importances_"):
            importances = model.feature_importances_
            for i, imp in enumerate(importances):
                feat_name = feature_names[i] if i < len(feature_names) else f"feature_{i}"
                importance_map[feat_name] = float(imp)

        metrics = {
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4),
            "roc_auc": round(roc_auc, 4) if roc_auc is not None else "N/A",
            "confusion_matrix": cm,
            "target_classes": target_names,
            "feature_importance": importance_map,
            "classification_report": report
        }

        # Save to JSON
        metrics_file = os.path.join(MODEL_DIR, "metrics.json")
        save_json(metrics, metrics_file)

        logger.info(f"Model Evaluation Completed! Accuracy: {acc * 100:.2f}%, F1-Score: {f1:.4f}")
        return metrics
