import React, { useState } from 'react';
import { Settings as SettingsIcon, Shield, Bell, Lock, Key, Server, Save } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

export default function Settings() {
  const { addNotification } = useNotification();
  const [apiKey, setApiKey] = useState('cs_live_9048f8a1e2b3c4d5e6f7a8b9c0d1e2f3');
  const [apiUrl, setApiUrl] = useState('http://127.0.0.1:8000');
  const [autoBlock, setAutoBlock] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    addNotification('success', 'Settings Saved', 'SOC Configuration parameters updated');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div className="cyber-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <SettingsIcon size={28} className="glow-cyan" />
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>SYSTEM & FASTAPI INTEGRATION SETTINGS</h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Configure FastAPI backend URL targets, API tokens, and automated mitigation policies.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* API Settings */}
        <div className="cyber-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Server size={18} className="glow-cyan" /> FastAPI Backend Connection Target
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                FastAPI Server Base URL
              </label>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                style={{ width: '100%', background: 'rgba(8,12,20,0.9)', border: '1px solid var(--border-cyan)', color: '#fff', padding: '8px 12px', borderRadius: '8px', fontSize: '0.84rem', outline: 'none', fontFamily: 'monospace' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                XGBoost Engine API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                style={{ width: '100%', background: 'rgba(8,12,20,0.9)', border: '1px solid var(--border-cyan)', color: '#fff', padding: '8px 12px', borderRadius: '8px', fontSize: '0.84rem', outline: 'none', fontFamily: 'monospace' }}
              />
            </div>
          </div>
        </div>

        {/* Automated Policy Controls */}
        <div className="cyber-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={18} className="glow-emerald" /> Automated SOC Defense Policies
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.84rem', color: '#fff', cursor: 'pointer' }}>
              <input type="checkbox" checked={autoBlock} onChange={(e) => setAutoBlock(e.target.checked)} style={{ accentColor: '#38bdf8' }} />
              Auto-null-route Source IPs when Risk Score exceeds 90/100
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.84rem', color: '#fff', cursor: 'pointer' }}>
              <input type="checkbox" checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} style={{ accentColor: '#38bdf8' }} />
              Send instant SMTP email alerts to SOC team on Critical events
            </label>
          </div>
        </div>

        <button
          type="submit"
          style={{
            alignSelf: 'flex-start',
            background: 'linear-gradient(135deg, #0284c7, #0369a1)',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '10px',
            fontSize: '0.88rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Save size={16} /> Save Configuration
        </button>

      </form>

    </div>
  );
}
