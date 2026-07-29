import React, { useState } from 'react';
import { mockDataService } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { Cpu, ShieldAlert, Sparkles, Activity, CheckCircle2, AlertTriangle, ArrowRight, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Prediction() {
  const { addNotification } = useNotification();
  const [inputText, setInputText] = useState('http://paypal-security-update-verify.xyz/login.php');
  const [severity, setSeverity] = useState('High');
  const [dataExfil, setDataExfil] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!inputText) {
      addNotification('error', 'Input Error', 'Please specify a URL link or payload snippet');
      return;
    }
    setAnalyzing(true);
    setResult(null);

    const payload = {
      user_id: 1,
      input_text: inputText,
      attack_severity: severity,
      data_exfiltrated: dataExfil
    };

    const res = await mockDataService.predictThreat(payload);
    setTimeout(() => {
      setResult(res);
      setAnalyzing(false);
      addNotification('success', 'XGBoost Prediction Complete', `Classified as ${res.attack_type} with ${res.confidence}% confidence`);
    }, 600);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div className="cyber-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Cpu size={28} className="glow-cyan" />
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>XGBoost AI THREAT PREDICTION & SHAP EXPLAINABILITY</h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Run multi-class threat classification and evaluate feature attribution impacts.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
        
        {/* Prediction Form */}
        <div className="cyber-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>Input Threat Telemetry Payload</h3>

          <form onSubmit={handlePredict} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                URL Link / HTTP User Agent / Query String
              </label>
              <textarea
                rows={4}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter suspicious link e.g. http://paypal-verify-login.xyz/..."
                style={{
                  width: '100%',
                  background: 'rgba(8,12,20,0.9)',
                  border: '1px solid var(--border-cyan)',
                  color: '#fff',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  fontSize: '0.84rem',
                  outline: 'none',
                  fontFamily: 'monospace'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Target Severity Level
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(8,12,20,0.9)',
                    border: '1px solid var(--border-cyan)',
                    color: '#fff',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    outline: 'none'
                  }}
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Data Exfiltration Flag
                </label>
                <select
                  value={dataExfil ? 'True' : 'False'}
                  onChange={(e) => setDataExfil(e.target.value === 'True')}
                  style={{
                    width: '100%',
                    background: 'rgba(8,12,20,0.9)',
                    border: '1px solid var(--border-cyan)',
                    color: '#fff',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    outline: 'none'
                  }}
                >
                  <option value="True">Yes (Exfiltration Suspicious)</option>
                  <option value="False">No (Standard Traffic)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={analyzing}
              style={{
                marginTop: '10px',
                background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
                color: '#fff',
                border: 'none',
                padding: '12px',
                borderRadius: '10px',
                fontSize: '0.88rem',
                fontWeight: 800,
                cursor: analyzing ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(2,132,199,0.3)'
              }}
            >
              {analyzing ? (
                <>Evaluating XGBoost Rules...</>
              ) : (
                <>Run AI Prediction & SHAP Analysis <Sparkles size={16} /></>
              )}
            </button>
          </form>
        </div>

        {/* Prediction Results Panel */}
        <div className="cyber-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>Inference & SHAP Explainability Result</h3>

          {result ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Category & Confidence */}
              <div style={{
                background: 'rgba(239,68,68,0.12)',
                border: '1px solid rgba(239,68,68,0.4)',
                borderRadius: '14px',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#fca5a5', fontWeight: 700, textTransform: 'uppercase' }}>Classified Threat Vector</span>
                  <h4 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>{result.attack_type}</h4>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>XGBoost Confidence</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8' }} className="font-mono">{result.confidence}%</div>
                </div>
              </div>

              {/* SHAP Feature Importance Graph Placeholder */}
              <div>
                <h4 style={{ fontSize: '0.84rem', fontWeight: 700, color: '#fff', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BarChart2 size={16} className="glow-cyan" /> SHAP Feature Attribution Impact:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {Object.entries(result.shap_explanation || {}).map(([feat, score], idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '3px' }}>
                        <span className="font-mono" style={{ color: '#cbd5e1' }}>{feat}</span>
                        <span className="font-mono" style={{ color: '#38bdf8', fontWeight: 700 }}>+{score}</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(100, score * 200)}%`, height: '100%', background: 'linear-gradient(90deg, #0284c7, #38bdf8)', borderRadius: '3px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Mitigation Protocol */}
              <div>
                <h4 style={{ fontSize: '0.84rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>Automated SOC Mitigation Actions:</h4>
                <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '0.78rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {result.recommended_actions?.map((act, idx) => (
                    <li key={idx}>{act}</li>
                  ))}
                </ul>
              </div>

            </motion.div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <Cpu size={48} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <p style={{ fontSize: '0.84rem' }}>Submit a payload above to generate real-time prediction probabilities & SHAP feature impacts.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
