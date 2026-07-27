import subprocess
import sys
import time
import os

def main():
    print("=" * 60)
    print("      AI-DRIVEN THREAT DETECTION SYSTEM LAUNCHER      ")
    print("=" * 60)
    
    root_dir = os.path.dirname(os.path.abspath(__file__))
    frontend_dir = os.path.join(root_dir, "frontend")

    print("\n[1/3] Starting FastAPI AI Backend Server on http://127.0.0.1:8000 ...")
    backend_proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "backend.app.main:app", "--host", "127.0.0.1", "--port", "8000", "--reload"],
        cwd=root_dir
    )

    time.sleep(3)

    print("\n[2/3] Starting Vite React Frontend Dashboard on http://localhost:5173 ...")
    frontend_proc = subprocess.Popen(
        ["npm.cmd" if os.name == 'nt' else "npm", "run", "dev"],
        cwd=frontend_dir
    )

    print("\n" + "=" * 60)
    print(" SUCCESS! All services are running.")
    print("  Backend API:   http://127.0.0.1:8000")
    print("  API Docs:      http://127.0.0.1:8000/docs")
    print("  Frontend SOC:  http://localhost:5173")
    print("=" * 60)
    print("\nPress Ctrl+C in terminal to stop all servers.\n")

    try:
        backend_proc.wait()
        frontend_proc.wait()
    except KeyboardInterrupt:
        print("\nShutting down servers...")
        backend_proc.terminate()
        frontend_proc.terminate()

if __name__ == "__main__":
    main()
