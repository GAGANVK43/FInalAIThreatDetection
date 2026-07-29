import React from 'react';
import { Radio, ShieldAlert, CheckCircle, Info } from 'lucide-react';

export default function ActivityFeed({ logs = [] }) {
  return (
    <div className="cyber-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
        <Radio size={20} className="glow-cyan" />
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Live SOC Activity Ticker</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {logs.length === 0 ? 'No activity events recorded yet' : 'Real-time rule executions from your scans'}
          </p>
        </div>
      </div>

      {logs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)' }}>
          <Info size={36} style={{ margin: '0 auto 8px', opacity: 0.3 }} />
          <span style={{ fontSize: '0.82rem', display: 'block' }}>No recent activity. Perform a threat scan to view activity stream logs.</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {logs.slice(0, 5).map((log, idx) => {
            const isCrit = (log.severity || '').toLowerCase() === 'critical';
            const isHigh = (log.severity || '').toLowerCase() === 'high';
            const type = isCrit ? 'critical' : (isHigh ? 'warning' : 'info');
            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.82rem' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  marginTop: '6px',
                  backgroundColor: type === 'critical' ? '#ef4444' : (type === 'warning' ? '#f59e0b' : '#38bdf8'),
                  boxShadow: `0 0 8px ${type === 'critical' ? '#ef4444' : (type === 'warning' ? '#f59e0b' : '#38bdf8')}`
                }} />
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#fff', fontWeight: 600 }}>
                    {log.response_action || 'Scanned Payload'}: {log.input_text || log.predicted_attack}
                  </p>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{log.timestamp}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
