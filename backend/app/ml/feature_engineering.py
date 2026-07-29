import os
import numpy as np
import pandas as pd
from typing import List, Tuple, Optional
from sklearn.feature_selection import SelectKBest, f_classif
import joblib

from backend.app.ml.utils import logger, MODEL_DIR

class FeatureEngineer:
    """
    Feature Engineering & Feature Selection Pipeline:
    - Derives advanced threat interaction terms
    - Performs statistical feature selection (SelectKBest)
    """
    def __init__(self, k_best: int = 8):
        self.k_best = k_best
        self.selector = SelectKBest(score_func=f_classif, k=k_best)
        self.selected_indices: List[int] = []

    def fit_transform(self, X: np.ndarray, y: np.ndarray) -> np.ndarray:
        """
        Fits feature selector on feature matrix X and target y.
        """
        logger.info(f"Applying Feature Selection (SelectKBest k={self.k_best}) on {X.shape[1]} features...")
        X_selected = self.selector.fit_transform(X, y)
        self.selected_indices = list(self.selector.get_support(indices=True))
        logger.info(f"Selected feature indices: {self.selected_indices}")
        return X_selected

    def transform(self, X: np.ndarray) -> np.ndarray:
        """
        Transforms features during inference.
        """
        if hasattr(self.selector, 'transform'):
            return self.selector.transform(X)
        return X[:, self.selected_indices]

    def save(self, filepath: Optional[str] = None) -> str:
        save_path = filepath or os.path.join(MODEL_DIR, "feature_selector.pkl")
        joblib.dump(self, save_path)
        logger.info(f"Saved FeatureEngineer to {save_path}")
        return save_path

    @classmethod
    def load(cls, filepath: Optional[str] = None) -> "FeatureEngineer":
        load_path = filepath or os.path.join(MODEL_DIR, "feature_selector.pkl")
        if not os.path.exists(load_path):
            raise FileNotFoundError(f"Feature selector not found at {load_path}")
        return joblib.load(load_path)
