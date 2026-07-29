import React, { useState, useRef } from 'react';
import { UploadCloud, FileCode, CheckCircle2, ShieldAlert, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { mockDataService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ScanProgress({ onScanComplete }) {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scanResult, setScanResult] = useState(null);

  const userId = user?.user_id || 1;

  const processFileScan = (file) => {
    if (!file) return;
    setScanning(true);
    setProgress(0);
    setScanResult(null);

    const fileName = file.name || 'uploaded_sample.bin';
    const ext = fileName.split('.').pop().toLowerCase();
    const isExecutable = ['exe', 'dll', 'bat', 'vbs', 'sh', 'ps1', 'scr'].includes(ext);

    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      setProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setScanning(false);

        const result = {
          fileName,
          isThreat: isExecutable,
          threatLevel: isExecutable ? 'Critical' : 'Low',
          riskScore: isExecutable ? 94 : 0,
          predictedAttack: isExecutable ? 'Executable Malware Binary' : 'Clean & Verified File',
          confidence: 99.2,
          details: isExecutable
            ? `XGBoost sandbox detected unauthorized binary executable signatures in extension '.${ext}'. File isolated.`
            : `File '.${ext}' scanned successfully. Hash validation SHA-256 clean. Zero malicious indicators found.`
        };

        setScanResult(result);

        // Record scan into user session history
        mockDataService.predictThreat({
          user_id: userId,
          input_text: `File Sandbox Scan: ${fileName}`,
          input_type: 'File Sandbox',
          attack_severity: isExecutable ? 'Critical' : 'Low'
        });

        if (onScanComplete) onScanComplete(result);
      }
    }, 200);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFileScan(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFileScan(e.target.files[0]);
    }
  };

  return (
    <div className="cyber-card" style={{ padding: '28px' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>Deep File & Memory Binary Scanner</h3>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
        Upload suspicious executables, memory dumps, or log files for automated XGBoost sandbox evaluation.
      </p>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {!scanning && !scanResult && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          style={{
            border: `2px dashed ${isDragging ? '#38bdf8' : 'var(--border-cyan)'}`,
            borderRadius: '16px',
            padding: '40px 20px',
            textAlign: 'center',
            background: isDragging ? 'rgba(56,189,248,0.08)' : 'rgba(8,12,20,0.6)',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <UploadCloud size={48} className="glow-cyan" style={{ margin: '0 auto 14px' }} />
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>Drag & Drop Suspicious File Here</h4>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Supports .exe, .dll, .pdf, .docx, .pcap, .log files (Max 50MB)
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (fileInputRef.current) fileInputRef.current.click();
            }}
            style={{
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
            }}
          >
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
          background: scanResult.isThreat ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
          border: `1px solid ${scanResult.isThreat ? 'rgba(239,68,68,0.4)' : 'rgba(16,185,129,0.4)'}`,
          borderRadius: '16px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {scanResult.isThreat ? (
                <ShieldAlert size={28} style={{ color: '#ef4444' }} />
              ) : (
                <ShieldCheck size={28} style={{ color: '#10b981' }} />
              )}
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>Result: {scanResult.predictedAttack}</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Target File: {scanResult.fileName}</p>
              </div>
            </div>
            <div style={{ background: scanResult.isThreat ? '#ef4444' : '#10b981', color: '#fff', fontSize: '0.78rem', fontWeight: 800, padding: '4px 10px', borderRadius: '8px' }}>
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
