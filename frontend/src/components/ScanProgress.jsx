import React, { useState } from 'react';
import { UploadCloud, FileCode, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ScanProgress({ onScanComplete }) {
  const [isDragging, setIsDragging] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scanResult, setScanResult] = useState(null);

  const startScan = (fileName = 'security_audit_payload.exe') => {
    setScanning(true);
    setProgress(0);
    setScanResult(null);

    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      setProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setScanning(false);
        const result = {
          fileName,
          threatLevel: 'Critical',
          riskScore: 94,
          predictedAttack: 'Malware Exfiltration',
          confidence: 98.4,
          details: 'XGBoost multi-class classifier flagged Trojan binary payload heuristics & unauthorized socket connection requests.'
        };
        setScanResult(result);
        if (onScanComplete) onScanComplete(result);
      }
    }, 200);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      startScan(e.dataTransfer.files[0].name);
    }
  };

  return (
    <div className="cyber-card" style={{ padding: '28px' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>Deep File & Memory Binary Scanner</h3>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
        Upload suspicious executables, memory dumps, or log files for automated XGBoost sandbox evaluation.
      </p>

      {!scanning && !scanResult && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${isDragging ? '#38bdf8' : 'var(--border-cyan)'}`,
            borderRadius: '16px',
            padding: '40px 20px',
            textAlign: 'center',
            background: isDragging ? 'rgba(56,189,248,0.08)' : 'rgba(8,12,20,0.6)',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onClick={() => startScan()}
        >
          <UploadCloud size={48} className="glow-cyan" style={{ margin: '0 auto 14px' }} />
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>Drag & Drop Suspicious File Here</h4>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Supports .exe, .dll, .pdf, .docx, .pcap, .log files (Max 50MB)
          </p>
          <button style={{
            marginTop: '16px',
            background: 'linear-gradient(135deg, #0284c7, #0369a1)',
            color: '#fff',
            border: 'none',
            padding: '10px 24px',
            borderRadius: '10px',
            fontSize: '0.84rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(2,132,199,0.3)'
          }}>
            Browse Local File
          </button>
        </div>
      )}

      {/* Progress View */}
      {scanning && (
        <div style={{ textAlign: 'center', padding: '30px 0' }}>
          <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 20px' }}>
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="50"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="10"
                strokeDasharray="314"
                strokeDashoffset={314 - (314 * progress) / 100}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
                style={{ transition: 'stroke-dashoffset 0.2s linear' }}
              />
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontWeight: 800, fontSize: '1.2rem', color: '#fff' }}>
              {progress}%
            </div>
          </div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>Scanning File Binary Signatures...</h4>
          <p style={{ fontSize: '0.78rem', color: 'var(--neon-cyan)', marginTop: '4px' }}>Analyzing features with XGBoost AI Engine</p>
        </div>
      )}

      {/* Result Card */}
      {scanResult && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.4)',
          borderRadius: '16px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ShieldAlert size={28} style={{ color: '#ef4444' }} />
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>Threat Detected: {scanResult.predictedAttack}</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Target File: {scanResult.fileName}</p>
              </div>
            </div>
            <div style={{ background: '#ef4444', color: '#fff', fontSize: '0.78rem', fontWeight: 800, padding: '4px 10px', borderRadius: '8px' }}>
              RISK SCORE: {scanResult.riskScore}/100
            </div>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.5' }}>
            {scanResult.details}
          </p>
          <button onClick={() => setScanResult(null)} style={{
            marginTop: '16px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            Scan Another File
          </button>
        </motion.div>
      )}

    </div>
  );
}
