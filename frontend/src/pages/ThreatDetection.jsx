import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Zap } from 'lucide-react';
import ThreatTable from '../components/ThreatTable';
import { mockDataService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { motion } from 'framer-motion';

const threatThemeMap = {
  'Phishing': { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.4)', textLight: '#fcd34d' },
  'Malware': { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.4)', textLight: '#fca5a5' },
  'Executable Malware Binary': { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.4)', textLight: '#fca5a5' },
  'DDoS': { color: '#a855f7', bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.4)', textLight: '#c084fc' },
  'SQL Injection': { color: '#38bdf8', bg: 'rgba(56,189,248,0.12)', border: 'rgba(56,189,248,0.4)', textLight: '#7dd3fc' },
  'Ransomware': { color: '#ec4899', bg: 'rgba(236,72,153,0.12)', border: 'rgba(236,72,153,0.4)', textLight: '#f472b6' },
  'Safe / Legitimate Link': { color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.4)', textLight: '#6ee7b7' },
  'Clean & Verified File': { color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.4)', textLight: '#6ee7b7' }
};

export default function ThreatDetection({ onSelectLog }) {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [inputUrl, setInputUrl] = useState('http://paypal-verify-account.xyz/login.php');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [logs, setLogs] = useState([]);

  const userId = user?.user_id || 1;

  useEffect(() => {
    loadLogs();
  }, [userId]);

  const loadLogs = async () => {
    const res = await mockDataService.getThreatLogs(userId);
    setLogs(res.items || []);
  };

  const handleScan = async (e) => {
    e.preventDefault();
    if (!inputUrl) return;
    setScanning(true);
    setResult(null);

    const res = await mockDataService.predictThreat({ user_id: userId, input_text: inputUrl, attack_severity: 'Critical' });
    setTimeout(() => {
      setResult(res);
      setScanning(false);
      loadLogs();
      const isSafe = (res.attack_type || '').includes('Safe') || res.severity === 'Low';
      addNotification(
        isSafe ? 'info' : 'success',
        isSafe ? 'Payload Verified Safe' : 'Threat Analyzed & Recorded',
        `Result: ${res.attack_type || res.predicted_attack} (${res.confidence}% confidence)`
      );
    }, 500);
  };

  const attackCategory = result ? (result.attack_type || result.predicted_attack || 'Malware') : '';
  const theme = threatThemeMap[attackCategory] || (result && (result.severity === 'Low' || attackCategory.includes('Safe'))
    ? threatThemeMap['Safe / Legitimate Link']
    : threatThemeMap['Malware']);

  const isSafeResult = result && ((result.attack_type || '').includes('Safe') || result.severity === 'Low');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div className="cyber-card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>REAL-TIME LINK & PAYLOAD INSPECTOR</h2>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          Instant XGBoost feature extraction across URLs, email lures, and raw payload text.
        </p>
      </div>

      <div className="cyber-card" style={{ padding: '24px' }}>
        <form onSubmit={handleScan} style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Paste URL / Email Text / Payload String..."
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            style={{
              flex: 1,
              minWidth: '280px',
              background: 'rgba(8,12,20,0.9)',
              border: '1px solid var(--border-cyan)',
              color: '#fff',
              padding: '12px 16px',
              borderRadius: '10px',
              fontSize: '0.88rem',
              outline: 'none',
              fontFamily: 'monospace'
            }}
          />
          <button
            type="submit"
            disabled={scanning}
            style={{
              background: 'linear-gradient(135deg, #0284c7, #0369a1)',
              color: '#fff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '10px',
              fontSize: '0.88rem',
              fontWeight: 800,
              cursor: scanning ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {scanning ? 'Analyzing...' : <>Inspect Payload <Zap size={16} /></>}
          </button>
        </form>

        {result && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} style={{
            marginTop: '24px',
            background: theme.bg,
            border: `1px solid ${theme.border}`,
            borderRadius: '14px',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {isSafeResult ? <ShieldCheck size={28} style={{ color: theme.color }} /> : <ShieldAlert size={28} style={{ color: theme.color }} />}
                <div>
                  <span style={{ fontSize: '0.74rem', color: theme.textLight, fontWeight: 700, textTransform: 'uppercase' }}>
                    {isSafeResult ? 'Security Inspection Result' : 'Classified Threat Category'}
                  </span>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: theme.color }}>
                    {attackCategory}
                  </h3>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Confidence Score</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: theme.color }}>{result.confidence}%</div>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>Identified Risk Indicators:</h4>
              <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '0.78rem', color: '#cbd5e1' }}>
                {result.indicators?.map((ind, idx) => <li key={idx}>{ind}</li>)}
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>Enforced SOC Protocol:</h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {result.recommended_actions?.map((act, idx) => (
                  <span key={idx} style={{
                    background: theme.bg,
                    color: theme.color,
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    border: `1px solid ${theme.border}`
                  }}>
                    {act}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Scanned Threat Logs Table */}
      <ThreatTable logs={logs} onSelectLog={onSelectLog} />

    </div>
  );
}
