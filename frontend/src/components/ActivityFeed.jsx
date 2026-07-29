import React from 'react';
import { Activity, ShieldAlert, CheckCircle, Radio, Server } from 'lucide-react';

export default function ActivityFeed() {
  const activities = [
    { time: 'Just now', text: 'Intercepted Phishing Link domain paypal-security.xyz', type: 'critical' },
    { time: '2 mins ago', text: 'Auto-null-routed DDoS source IP 185.220.101.4', type: 'warning' },
    { time: '5 mins ago', text: 'Completed automated deep XGBoost binary memory scan', type: 'info' },
    { time: '12 mins ago', text: 'Quarantined Trojan malware executable drop payload', type: 'critical' },
    { time: '18 mins ago', text: 'WAF Rule #408 triggered for SQL Parameter Injection', type: 'warning' },
  ];

  return (
    <div className="cyber-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
        <Radio size={20} className="glow-cyan" />
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Live SOC Activity Ticker</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Automated rule executions & threat neutralizations</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {activities.map((act, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.82rem' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              marginTop: '6px',
              backgroundColor: act.type === 'critical' ? '#ef4444' : (act.type === 'warning' ? '#f59e0b' : '#38bdf8'),
              boxShadow: `0 0 8px ${act.type === 'critical' ? '#ef4444' : (act.type === 'warning' ? '#f59e0b' : '#38bdf8')}`
            }} />
            <div style={{ flex: 1 }}>
              <p style={{ color: '#fff', fontWeight: 600 }}>{act.text}</p>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{act.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
