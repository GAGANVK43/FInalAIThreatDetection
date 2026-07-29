import os
import json
import logging
from typing import Dict, Any

# Setup Production Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("AI-Threat-Detection-ML")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ML_DIR = os.path.join(BASE_DIR, "app", "ml")
DATASET_DIR = os.path.join(ML_DIR, "dataset")
MODEL_DIR = os.path.join(ML_DIR, "model")

os.makedirs(DATASET_DIR, exist_ok=True)
os.makedirs(MODEL_DIR, exist_ok=True)

DEFAULT_DATASET_PATH = os.path.join(BASE_DIR, "..", "datasets", "ai_ml_cybersecurity_dataset.csv")

def save_json(data: Dict[str, Any], filepath: str) -> None:
    """Utility to save dictionary as JSON file."""
    try:
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=4)
        logger.info(f"Successfully saved JSON to {filepath}")
    except Exception as e:
        logger.error(f"Failed to save JSON to {filepath}: {e}")

def load_json(filepath: str) -> Dict[str, Any]:
    """Utility to load JSON file as dictionary."""
    try:
        if not os.path.exists(filepath):
            return {}
        with open(filepath, 'r') as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Failed to load JSON from {filepath}: {e}")
        return {}
