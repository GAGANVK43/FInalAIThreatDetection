import React, { useState } from 'react';
import { ShieldAlert, Zap, Cpu, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { mockDataService } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { motion } from 'framer-motion';

export default function ThreatDetection() {
  const { addNotification } = useNotification();
  const [inputUrl, setInputUrl] = useState('http://malware-drop.cc/urgent_invoice.exe');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!inputUrl) return;
    setScanning(true);
    setResult(null);

    const res = await mockDataService.predictThreat({ input_text: inputUrl, attack_severity: 'Critical' });
    setTimeout(() => {
      setResult(res);
      setScanning(false);
      addNotification('success', 'Threat Analyzed', `Result: ${res.attack_type} (${res.confidence}% confidence)`);
    }, 500);
  };

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
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '24px', background: 'rgba(8,12,20,0.8)', border: '1px solid var(--border-cyan)', borderRadius: '14px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Classified Threat Category</span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ef4444' }}>{result.attack_type}</h3>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Confidence Score</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#38bdf8' }}>{result.confidence}%</div>
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
                  <span key={idx} style={{ background: 'rgba(56,189,248,0.15)', color: '#38bdf8', padding: '4px 10px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 700, border: '1px solid rgba(56,189,248,0.3)' }}>
                    {act}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

    </div>
  );
}
