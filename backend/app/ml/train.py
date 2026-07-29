import os
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, Optional
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from xgboost import XGBClassifier

from backend.app.ml.utils import logger, MODEL_DIR
from backend.app.ml.preprocessing import DataPreprocessor
from backend.app.ml.feature_engineering import FeatureEngineer
from backend.app.ml.evaluate import ModelEvaluator

class XGBoostTrainer:
    """
    Production Training Pipeline for XGBoost Cybersecurity Threat Classifier:
    - Preprocessing & Encoding
    - Feature Engineering & Selection
    - Hyperparameter Tuning (RandomizedSearchCV)
    - Cross-validation & Overfitting prevention
    - Evaluation & Model Serialization
    """
    def __init__(self):
        self.preprocessor = DataPreprocessor()
        self.feature_engineer = FeatureEngineer(k_best=8)
        self.model: Optional[XGBClassifier] = None

    def train_pipeline(self, dataset_path: Optional[str] = None) -> Dict[str, Any]:
        logger.info("================ Starting XGBoost Training Pipeline ================")

        # 1. Load Dataset & Preprocess
        df = self.preprocessor.load_dataset(dataset_path)
        X, y = self.preprocessor.fit_transform(df)

        # 2. Feature Selection
        X_selected = self.feature_engineer.fit_transform(X, y)

        # 3. Train / Validation / Test Split (70% Train, 15% Val, 15% Test)
        X_train, X_temp, y_train, y_temp = train_test_split(
            X_selected, y, test_size=0.30, random_state=42, stratify=y
        )
        X_val, X_test, y_val, y_test = train_test_split(
            X_temp, y_temp, test_size=0.50, random_state=42, stratify=y_temp
        )

        logger.info(f"Dataset Split -> Train: {X_train.shape[0]}, Val: {X_val.shape[0]}, Test: {X_test.shape[0]}")

        # 4. Hyperparameter Search Space
        param_dist = {
            'n_estimators': [50, 100, 150],
            'max_depth': [6, 10, 14],
            'learning_rate': [0.03, 0.1, 0.2],
            'subsample': [0.8, 1.0],
            'colsample_bytree': [0.8, 1.0],
            'gamma': [0, 0.1, 0.2],
            'min_child_weight': [1, 3]
        }

        base_xgb = XGBClassifier(
            eval_metric='mlogloss',
            random_state=42,
            n_jobs=-1
        )

        logger.info("Executing RandomizedSearchCV for XGBoost Hyperparameter Tuning...")
        search = RandomizedSearchCV(
            estimator=base_xgb,
            param_distributions=param_dist,
            n_iter=5,
            cv=3,
            scoring='accuracy',
            random_state=42,
            n_jobs=-1
        )
        search.fit(X_train, y_train)

        self.model = search.best_estimator_
        logger.info(f"Optimal Hyperparameters selected: {search.best_params_}")

        # 5. Fit Best Model with Validation Set Evaluation
        self.model.fit(
            X_train, y_train,
            eval_set=[(X_val, y_val)],
            verbose=False
        )

        # 6. Evaluation
        feature_names = [self.preprocessor.feature_cols[i] for i in self.feature_engineer.selected_indices]
        target_names = self.preprocessor.classes_

        metrics = ModelEvaluator.evaluate(
            model=self.model,
            X_test=X_test,
            y_test=y_test,
            target_names=target_names,
            feature_names=feature_names
        )

        # 7. Save Models & Pipelines
        self.save_artifacts()

        logger.info("================ XGBoost Training Pipeline Finished Successfully ================")
        return metrics

    def save_artifacts(self) -> None:
        self.preprocessor.save()
        self.feature_engineer.save()

        model_path = os.path.join(MODEL_DIR, "xgboost_model.pkl")
        joblib.dump(self.model, model_path)
        logger.info(f"Saved XGBoost model to {model_path}")

        # Backward Compatibility Save for root saved_model.pkl
        legacy_path = os.path.join(MODEL_DIR, "..", "saved_model.pkl")
        joblib.dump({
            'model': self.model,
            'preprocessor': self.preprocessor,
            'feature_engineer': self.feature_engineer,
            'classes': self.preprocessor.classes_
        }, legacy_path)
        logger.info(f"Saved legacy model bundle to {legacy_path}")

if __name__ == '__main__':
    trainer = XGBoostTrainer()
    trainer.train_pipeline()
