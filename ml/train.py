import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
import joblib

def extract_features(df):
    """
    Feature engineering from cybersecurity log dataset
    """
    df = df.copy()
    
    # Feature 1: User Agent length & signature flags
    df['ua_length'] = df['User Agent'].fillna('').apply(len)
    df['is_bot'] = df['User Agent'].fillna('').apply(lambda ua: 1 if any(b in ua.lower() for b in ['bot', 'crawler', 'spider', 'curl', 'python', 'wget']) else 0)
    df['is_mozilla'] = df['User Agent'].fillna('').apply(lambda ua: 1 if 'mozilla' in ua.lower() else 0)
    
    # Feature 2: Data Exfiltrated boolean to int
    if 'Data Exfiltrated' in df.columns:
        df['data_exfil_int'] = df['Data Exfiltrated'].apply(lambda x: 1 if str(x).lower() in ['true', '1'] else 0)
    else:
        df['data_exfil_int'] = 0
        
    # Feature 3: IP address octet extraction
    def get_first_octet(ip_str):
        try:
            return int(str(ip_str).split('.')[0])
        except:
            return 0
            
    def get_last_octet(ip_str):
        try:
            return int(str(ip_str).split('.')[-1])
        except:
            return 0
            
    df['src_first_octet'] = df['Source IP'].apply(get_first_octet)
    df['src_last_octet'] = df['Source IP'].apply(get_last_octet)
    df['dst_first_octet'] = df['Destination IP'].apply(get_first_octet)
    df['dst_last_octet'] = df['Destination IP'].apply(get_last_octet)
    
    # Feature 4: Severity score map
    sev_map = {'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1}
    df['severity_score'] = df['Attack Severity'].map(lambda s: sev_map.get(str(s).capitalize(), 2))
    
    return df

def train():
    dataset_path = os.path.join('datasets', 'ai_ml_cybersecurity_dataset.csv')
    if not os.path.exists(dataset_path):
        # fallback path
        dataset_path = r'C:\Users\Admin\OneDrive\Documents\AI_Threat_Dataset_Project\ai_ml_cybersecurity_dataset.csv'
        
    print(f"Loading dataset from {dataset_path}...")
    df = pd.read_csv(dataset_path)
    print(f"Dataset loaded. Total rows: {len(df)}")
    
    df_feat = extract_features(df)
    
    feature_cols = [
        'ua_length', 'is_bot', 'is_mozilla', 'data_exfil_int',
        'src_first_octet', 'src_last_octet', 'dst_first_octet', 'dst_last_octet',
        'severity_score'
    ]
    
    X = df_feat[feature_cols]
    y = df_feat['Attack Type']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    print("Training Random Forest Classifier...")
    model = RandomForestClassifier(n_estimators=100, max_depth=15, random_state=42, n_jobs=-1)
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {acc * 100:.2f}%")
    print("\nClassification Report:\n", classification_report(y_test, y_pred))
    
    # Save artifacts
    save_dir = os.path.join('backend', 'app', 'ai')
    os.makedirs(save_dir, exist_ok=True)
    
    model_path = os.path.join(save_dir, 'saved_model.pkl')
    joblib.dump({
        'model': model,
        'feature_cols': feature_cols,
        'classes': list(model.classes_)
    }, model_path)
    print(f"Model successfully saved to {model_path}")

if __name__ == '__main__':
    train()
