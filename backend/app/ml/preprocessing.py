import os
import pandas as pd
import numpy as np
from typing import Tuple, List, Dict, Any, Optional
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.impute import SimpleImputer
import joblib

from backend.app.ml.utils import logger, MODEL_DIR, DEFAULT_DATASET_PATH

class DataPreprocessor:
    """
    Production-ready Preprocessing Pipeline:
    - Auto Dataset Loading
    - Missing Value Imputation
    - Duplicate Removal
    - Categorical & Label Encoding
    - Standardization & Scaling
    """
    def __init__(self):
        self.scaler = StandardScaler()
        self.target_encoder = LabelEncoder()
        self.imputer_num = SimpleImputer(strategy='median')
        self.feature_cols: List[str] = []
        self.classes_: List[str] = []

    def load_dataset(self, filepath: Optional[str] = None) -> pd.DataFrame:
        path = filepath or DEFAULT_DATASET_PATH
        if not os.path.exists(path):
            alt_path = os.path.join(os.path.dirname(DEFAULT_DATASET_PATH), "datasets", "ai_ml_cybersecurity_dataset.csv")
            if os.path.exists(alt_path):
                path = alt_path
            else:
                raise FileNotFoundError(f"Cybersecurity dataset not found at {path}")

        logger.info(f"Loading cybersecurity dataset from: {path}")
        df = pd.read_csv(path)
        logger.info(f"Initial raw dataset shape: {df.shape}")

        # Remove Duplicate Records
        initial_count = len(df)
        df = df.drop_duplicates().reset_index(drop=True)
        logger.info(f"Removed {initial_count - len(df)} duplicate records. Current shape: {df.shape}")

        # Handle Missing Values
        df = df.dropna(subset=['Attack Type']) if 'Attack Type' in df.columns else df
        return df

    def fit_transform(self, df: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray]:
        """
        Fits preprocessor on dataframe and transforms features (X) and targets (y).
        """
        df_clean = df.copy()

        # Extract Target Label
        if 'Attack Type' not in df_clean.columns:
            raise KeyError("Dataset missing target column 'Attack Type'")

        y_raw = df_clean['Attack Type'].astype(str)
        y_encoded = self.target_encoder.fit_transform(y_raw)
        self.classes_ = list(self.target_encoder.classes_)
        logger.info(f"Target classes encoded: {self.classes_}")

        # Feature Extraction & Scaling
        X_df = self.transform_raw_features(df_clean)
        self.feature_cols = list(X_df.columns)

        X_imputed = self.imputer_num.fit_transform(X_df)
        X_scaled = self.scaler.fit_transform(X_imputed)

        return X_scaled, y_encoded

    def transform(self, df: pd.DataFrame) -> np.ndarray:
        """
        Transforms raw feature dataframe during inference.
        """
        X_df = self.transform_raw_features(df)
        
        # Ensure all columns match training schema
        for col in self.feature_cols:
            if col not in X_df.columns:
                X_df[col] = 0
        X_df = X_df[self.feature_cols]

        X_imputed = self.imputer_num.transform(X_df)
        X_scaled = self.scaler.transform(X_imputed)
        return X_scaled

    def transform_raw_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Derives numerical feature vectors from raw cybersecurity logs/payloads.
        """
        df_feat = pd.DataFrame()

        # 1. User Agent / Text Length & Indicators
        ua_series = df['User Agent'].fillna('') if 'User Agent' in df.columns else pd.Series([''] * len(df))
        df_feat['ua_length'] = ua_series.apply(len)
        df_feat['is_bot'] = ua_series.apply(lambda ua: 1 if any(b in str(ua).lower() for b in ['bot', 'crawler', 'spider', 'curl', 'python', 'wget']) else 0)
        df_feat['is_mozilla'] = ua_series.apply(lambda ua: 1 if 'mozilla' in str(ua).lower() else 0)

        # 2. Data Exfiltration Flag
        if 'Data Exfiltrated' in df.columns:
            df_feat['data_exfil'] = df['Data Exfiltrated'].apply(lambda x: 1 if str(x).lower() in ['true', '1'] else 0)
        else:
            df_feat['data_exfil'] = 0

        # 3. Source & Destination IP Octet Decomposition
        src_ip = df['Source IP'].fillna('0.0.0.0') if 'Source IP' in df.columns else pd.Series(['0.0.0.0'] * len(df))
        dst_ip = df['Destination IP'].fillna('0.0.0.0') if 'Destination IP' in df.columns else pd.Series(['0.0.0.0'] * len(df))

        def get_octet(ip_series, idx):
            def parse_oct(val):
                try:
                    return int(str(val).split('.')[idx])
                except:
                    return 0
            return ip_series.apply(parse_oct)

        df_feat['src_first_octet'] = get_octet(src_ip, 0)
        df_feat['src_last_octet'] = get_octet(src_ip, -1)
        df_feat['dst_first_octet'] = get_octet(dst_ip, 0)
        df_feat['dst_last_octet'] = get_octet(dst_ip, -1)

        # 4. Severity Mapping
        sev_map = {'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1}
        sev_series = df['Attack Severity'].fillna('Medium') if 'Attack Severity' in df.columns else pd.Series(['Medium'] * len(df))
        df_feat['severity_score'] = sev_series.map(lambda s: sev_map.get(str(s).capitalize(), 2))

        return df_feat

    def save(self, filepath: Optional[str] = None) -> str:
        save_path = filepath or os.path.join(MODEL_DIR, "preprocessor.pkl")
        joblib.dump(self, save_path)
        logger.info(f"Saved DataPreprocessor pipeline to {save_path}")
        return save_path

    @classmethod
    def load(cls, filepath: Optional[str] = None) -> "DataPreprocessor":
        load_path = filepath or os.path.join(MODEL_DIR, "preprocessor.pkl")
        if not os.path.exists(load_path):
            raise FileNotFoundError(f"Preprocessor file not found at {load_path}")
        logger.info(f"Loaded DataPreprocessor from {load_path}")
        return joblib.load(load_path)
