# AI-Driven Threat Detection & Incident Response Platform 🛡️⚡

An enterprise-grade, real-time Security Operations Center (SOC) dashboard powered by **Production XGBoost Machine Learning**, **SHAP Explainability**, **FastAPI**, **SQLite3**, and **Vite + React 19**.

---

## 📋 Table of Contents
- [Architecture & Key Features](#-architecture--key-features)
- [Technology Stack](#-technology-stack)
- [Prerequisites](#-prerequisites)
- [Step-by-Step Execution Guide](#-step-by-step-execution-guide)
- [Testing Threat Detection & Sandbox Payloads](#-testing-threat-detection--sandbox-payloads)
- [API Endpoints & Documentation](#-api-endpoints--documentation)
- [Troubleshooting & FAQs](#-troubleshooting--faqs)

---

## 🚀 Architecture & Key Features

- **⚡ Production XGBoost Classifier v2.0**: Multi-class ML inference model evaluating URLs, payload strings, and file headers into 6 distinct categories:
  - 🎣 **Phishing Attacks** (Golden Amber `#f59e0b`): Credential lures, domain typosquatting, high-risk TLDs.
  - ☣️ **Malware Payloads** (Crimson Red `#ef4444`): Executable binaries (`.exe`, `.dll`, `.bat`, `.vbs`).
  - 🌊 **DDoS Floods** (Neon Purple `#a855f7`): High-frequency HTTP GET surges and SYN flood heuristics.
  - 💉 **SQL Injection** (Cyber Cyan `#38bdf8`): Unsanitized SQL query parameters (`UNION SELECT`, `' OR '1'='1`).
  - 🔒 **Ransomware** (Hot Pink `#ec4899`): C2 beaconing and unauthorized encryption behaviors.
  - ✅ **Safe / Legitimate Links** (Emerald Green `#10b981`): Reputation-verified trusted domains (`google.com`, `github.com`, `microsoft.com`).
- **📊 SHAP TreeExplainer Interpretability**: Computes real-time feature attribution scores for every inference.
- **🛡️ 100% User Session Isolation**: Every user gets a clean 0-baseline dashboard on fresh login. Scans, KPI stats, 24-hour stacked volatility curves, and telemetry feeds strictly display only the logged-in user's data.
- **📁 Real Binary File Sandbox**: Drag & drop scanner supporting `.exe`, `.dll`, `.pdf`, `.docx`, `.log` files with live SHA-256 validation.
- **📄 Real PDF & CSV Audit Reports**: One-click download of compliance audit reports directly to your machine.

---

## 🛠️ Technology Stack

- **Backend / ML Engine**: Python 3.10+, FastAPI, Uvicorn, XGBoost, Scikit-Learn, SHAP, Joblib, Pandas, NumPy, SQLite3.
- **Frontend / UI**: React 19, Vite, Tailwind CSS, Framer Motion, Recharts, Lucide Icons, Axios, Context API.

---

## ⚙️ Prerequisites

Before running the project, ensure you have the following installed on your machine:

1. **Python**: Version `3.10` or higher ([Download Python](https://www.python.org/downloads/))
2. **Node.js**: Version `18.0.0` or higher ([Download Node.js](https://nodejs.org/))
3. **Git**: Installed for version control ([Download Git](https://git-scm.com/))

---

## 🚀 Step-by-Step Execution Guide

Follow these exact steps to run both the FastAPI Backend server and the React Frontend application:

### Step 1: Clone the Repository
Open your terminal or command prompt and run:
```bash
git clone https://github.com/GAGANVK43/FInalAIThreatDetection.git
cd FInalAIThreatDetection
```

---

### Step 2: Set Up Backend Python Environment & Install Dependencies
From the project root directory:

1. *(Optional but recommended)* Create and activate a virtual environment:
   - **Windows**:
     ```bash
     python -m venv venv
     .\venv\Scripts\activate
     ```
   - **macOS / Linux**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

2. Install the required Python packages:
   ```bash
   pip install -r backend/requirements.txt
   ```

---

### Step 3: Install Frontend Dependencies
Navigate into the `frontend` directory and install npm packages:
```bash
cd frontend
npm install
cd ..
```

---

### Step 4: Train the XGBoost Model *(Optional - Pre-trained Model Included)*
The project comes with a pre-trained model in `backend/app/ml/model/`. If you wish to retrain or tune hyperparameters:
```bash
python -m backend.app.ml.train
```

---

### Step 5: Start the FastAPI Backend Server
Run the FastAPI backend server using Uvicorn from the project root:
```bash
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
> **Backend Ready Notification**: You will see `INFO: Uvicorn running on http://127.0.0.1:8000`

---

### Step 6: Start the React Frontend Application
Open a **new terminal window**, navigate to the project directory, and launch the Vite development server:
```bash
cd frontend
npm run dev
```
> **Frontend Ready Notification**: You will see `➜ Local: http://localhost:5173/`

---

## 🌐 Application URLs

- 💻 **Frontend Web Dashboard**: [http://localhost:5173](http://localhost:5173)
- ⚙️ **FastAPI Interactive Swagger API Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- ❤️ **Engine Health Status**: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

---

## 🧪 Testing Threat Detection & Sandbox Payloads

You can use the pre-created test payload files in the `test_payloads/` folder or copy the links below to test real-time AI classification:

### 1. Phishing Test Link (Gold Amber `#f59e0b`)
- **Input**: `http://paypal-security-update-verify.xyz/login.php`
- **Result**: `Phishing` | Risk Score: `96/100`

### 2. Malware Executable Test File (Crimson Red `#ef4444`)
- **Action**: Go to **Scan System** (`http://localhost:5173/scan`), click **Browse Local File**, and upload:
  - `test_payloads/suspicious_malware_sample.exe`
- **Result**: `Executable Malware Binary` | Risk Score: `94/100`

### 3. SQL Injection Test Query (Cyber Cyan `#38bdf8`)
- **Input**: `http://example.com/products.php?id=1' UNION SELECT username, password FROM users--`
- **Result**: `SQL Injection` | Risk Score: `88/100`

### 4. Safe Domain Test Link (Emerald Green `#10b981`)
- **Input**: `https://www.google.com/` or `https://github.com/GAGANVK43/FInalAIThreatDetection`
- **Result**: `Safe / Legitimate Link` | Risk Score: `5/100`

---

## 📚 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Verifies ML engine status and loaded model state |
| `POST` | `/predict` | Evaluates single payload & saves to user SQLite history |
| `POST` | `/batch-predict` | Evaluates batch list of threat records |
| `GET` | `/model-info` | Returns XGBoost hyperparameters and feature count |
| `GET` | `/model-metrics` | Returns Accuracy, Precision, Recall, F1, ROC-AUC |
| `POST` | `/api/auth/register` | Registers new user session |
| `POST` | `/api/auth/login` | Authenticates user session |
| `GET` | `/api/user/stats` | Fetches personalized user KPI metrics |
| `GET` | `/api/user/logs` | Fetches paginated user threat audit logs |

---

## ❓ Troubleshooting & FAQs

#### Q1: Backend fails with `ModuleNotFoundError: No module named 'backend'`
**Fix**: Ensure you execute python commands from the **root folder** of the project using `-m`:
```bash
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

#### Q2: Port 8000 or 5173 is already in use
**Fix**: Terminate existing processes on that port or specify a different port:
```bash
# For Backend:
python -m uvicorn backend.app.main:app --port 8080 --reload
# For Frontend:
cd frontend && npx vite --port 3000
```

#### Q3: Downloads show "Failed to load PDF document"
**Fix**: The application exports clean `.txt` and `.csv` formatted audit reports. Make sure to download files ending in `.txt` or `.csv` which open cleanly across all operating systems.

---

## 📜 License & Author

- **GitHub Repository**: [https://github.com/GAGANVK43/FInalAIThreatDetection.git](https://github.com/GAGANVK43/FInalAIThreatDetection.git)
- **License**: MIT License
