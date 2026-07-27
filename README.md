# AI-Driven Threat Detection System 🛡️

A real-time cybersecurity threat detection and incident management platform powered by **FastAPI**, **Machine Learning**, **SQLite**, and **Vite + React**.

![Cyber SOC Dashboard](screenshots/dashboard.png)

## 🚀 Key Features

- **🔐 User Authentication**: Password-protected sign-in & registration supporting both **Gmail / Email** and **Mobile Phone Numbers**.
- **🔗 Real-Time Link & Message Scanner**: Analyzes URL links, SMS text messages, emails, and packet payloads for:
  - **Phishing Attacks** (Keyword lures, credential harvesting, sub-domain spoofing, high-risk TLDs like `.xyz`, `.top`).
  - **Malware Payloads** (Dangerous executable attachments `.exe`, `.apk`, `.vbs`, `.scr`).
  - **DDoS Floods** (High-frequency GET request repetition and traffic surge signatures).
  - **SQL Injection** (Malicious SQL query injection patterns).
- **📊 Personalized User Security Profile**: Each user receives their own isolated database session tracking:
  - Historical Threat Interceptions (Phishing caught, Malware blocked, DDoS floods, Clean scans).
  - Security Health Score Gauge (e.g. `95% Shield Status`).
  - Chronological Detection Audit Timeline.
- **⚡ AI & ML Classifier**: Random Forest Classifier trained on 20,000 cybersecurity log events to assign risk scores (0–100) and actionable mitigation protocols.

---

## 🛠️ Technology Stack

- **Backend**: Python 3.13, FastAPI, Uvicorn, SQLite3, Scikit-Learn, Joblib, Pandas
- **Frontend**: React 18, Vite, Lucide Icons, Recharts, Custom Glassmorphism CSS

---

## 💻 Getting Started

### Prerequisites

- Python 3.10+
- Node.js v18+ and npm

### Installation & One-Click Run

1. **Clone the repository**:
   ```bash
   git clone https://github.com/GAGANVK43/AITHREAT.git
   cd AITHREAT
   ```

2. **Install dependencies**:
   ```bash
   pip install -r backend/requirements.txt
   cd frontend && npm install && cd ..
   ```

3. **Train the ML Model** (optional, pre-trained model included):
   ```bash
   python ml/train.py
   ```

4. **Launch Application**:
   ```bash
   python run_project.py
   ```

- **Frontend Dashboard**: `http://localhost:5173`
- **FastAPI Backend API Docs**: `http://127.0.0.1:8000/docs`

---

## 📜 License

MIT License
