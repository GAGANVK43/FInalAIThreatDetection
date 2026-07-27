import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Cpu, Zap, RefreshCw, Link as LinkIcon, MessageSquare, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function AITester({ onThreatAnalyzed }) {
  const { user } = useAuth();
  const [inputText, setInputText] = useState('http://paypal-verify-account.xyz/login.php');
  const [inputType, setInputType] = useState('auto');
  const [sourceIp, setSourceIp] = useState('192.168.1.45');
  const [destIp, setDestIp] = useState('10.0.0.1');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const presets = [
    {
      label: 'Phishing URL Link',
      type: 'url',
      text: 'http://paypal-security-update-verify.xyz/login.php?user=auth',
      icon: LinkIcon,
      color: '#f59e0b'
    },
    {
      label: 'Malware Download URL',
      type: 'url',
      text: 'http://185.220.101.4/invoices/urgent_payment_receipt.exe',
      icon: LinkIcon,
      color: '#ef4444'
    },
    {
      label: 'Phishing SMS / Message',
      type: 'message',
      text: 'URGENT: Your bank account is suspended! Verify identity immediately at http://verify-bank.top to restore access.',
      icon: MessageSquare,
      color: '#f59e0b'
    },
    {
      label: 'DDoS Packet Flood',
      type: 'message',
      text: 'GET /api/v1/resource HTTP/1.1 GET /api/v1/resource HTTP/1.1 GET /api/v1/resource HTTP/1.1 GET /api/v1/resource HTTP/1.1',
      icon: ShieldAlert,
      color: '#a855f7'
    },
    {
      label: 'Legitimate / Safe Link',
      type: 'url',
      text: 'https://github.com/security/bulletins/overview',
      icon: CheckCircle2,
      color: '#10b981'
    }
  ];

  const handlePresetSelect = (preset) => {
    setInputText(preset.text);
    setInputType(preset.type);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.user_id,
          input_text: inputText,
          input_type: inputType,
          source_ip: sourceIp,
          destination_ip: destIp
        })
      });
      const data = await response.json();
      setResult(data);
      if (onThreatAnalyzed) onThreatAnalyzed(data);
    } catch (err) {
      console.error('Error scanning threat:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Cpu className="glow-text-cyan" size={26} />
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Real-Time Link, Message & Threat Detector</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Paste any URL link or text message below — every scan is logged to your account session!</p>
          </div>
        </div>
      </div>

      {/* Preset Buttons */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', marginRight: '4px' }}>
          Sample Test Presets:
        </span>
        {presets.map((p, idx) => {
          const IconComp = p.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handlePresetSelect(p)}
              style={{
                background: 'rgba(15,23,42,0.9)',
                border: `1px solid ${p.color}40`,
                color: '#fff',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <IconComp size={14} style={{ color: p.color }} />
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Form & Results Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Form Inputs */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-cyan)', marginBottom: '6px', display: 'block' }}>
              Paste URL Link or Message Text to Scan:
            </label>
            <textarea
              className="cyber-input"
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. http://suspicious-domain.xyz/login.php or Urgent: Verify account credentials now..."
              style={{ resize: 'vertical' }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Simulated Source IP</label>
              <input 
                type="text" 
                className="cyber-input" 
                value={sourceIp}
                onChange={(e) => setSourceIp(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Destination IP</label>
              <input 
                type="text" 
                className="cyber-input" 
                value={destIp}
                onChange={(e) => setDestIp(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="cyber-button" style={{ marginTop: '4px', justifyContent: 'center' }} disabled={loading}>
            {loading ? <RefreshCw className="spin" size={16} /> : <Zap size={16} />}
            {loading ? 'Scanning with AI & Saving Log...' : 'Scan & Log Threat Analysis'}
          </button>
        </form>

        {/* AI Output Card */}
        <div style={{
          background: 'rgba(9, 13, 22, 0.9)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          {result ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>INPUT TYPE: <strong style={{ color: '#fff' }}>{result.input_type}</strong></span>
                <span className={`badge badge-${result.severity.toLowerCase()}`}>
                  {result.severity} SEVERITY
                </span>
              </div>

              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <h3 className="glow-text-cyan font-mono" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
                  {result.predicted_attack}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  AI Confidence: <strong style={{ color: 'var(--primary-emerald)' }}>{result.confidence}%</strong>
                </p>
              </div>

              {/* Risk Gauge */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>THREAT RISK SCORE</span>
                  <span style={{ fontWeight: 700, color: result.risk_score > 70 ? 'var(--danger-red)' : (result.risk_score > 30 ? 'var(--warning-amber)' : 'var(--primary-emerald)') }}>
                    {result.risk_score} / 100
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${result.risk_score}%`,
                    height: '100%',
                    background: result.risk_score > 70 ? 'linear-gradient(90deg, #f59e0b, #ef4444)' : 'linear-gradient(90deg, #10b981, #38bdf8)',
                    transition: 'width 0.4s ease'
                  }} />
                </div>
              </div>

              {/* Extracted Indicators */}
              <div style={{ background: 'rgba(15,23,42,0.9)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(56,189,248,0.2)', marginBottom: '12px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-cyan)', marginBottom: '6px' }}>
                  DETECTED THREAT INDICATORS:
                </div>
                <ul style={{ paddingLeft: '18px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {result.indicators.map((ind, i) => (
                    <li key={i} style={{ marginBottom: '3px' }}>{ind}</li>
                  ))}
                </ul>
              </div>

              {/* Action protocols */}
              <div style={{ background: 'rgba(15,23,42,0.9)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.2)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-emerald)', marginBottom: '6px' }}>
                  RECOMMENDED MITIGATION STEPS:
                </div>
                <ul style={{ paddingLeft: '18px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {result.recommended_actions.map((act, i) => (
                    <li key={i} style={{ marginBottom: '3px' }}>{act}</li>
                  ))}
                </ul>
              </div>

            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px 10px' }}>
              <Zap size={36} style={{ color: 'var(--primary-cyan)', opacity: 0.5, marginBottom: '10px' }} />
              <p style={{ fontSize: '0.85rem' }}>Scan a link or message to see instant AI threat analysis and record it to your session.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
