import React from 'react';
import { FileText, Download, CheckCircle2, ShieldAlert, Calendar } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

export default function Reports() {
  const { addNotification } = useNotification();

  const reports = [
    { title: 'SOC Executive Monthly Threat Audit Report (July 2026)', date: '2026-07-29', type: 'PDF Executive Summary', size: '4.2 MB' },
    { title: 'XGBoost Model Performance & SHAP Evaluation Report', date: '2026-07-28', type: 'JSON & CSV Metrics Dump', size: '1.8 MB' },
    { title: 'Incident Response & Mitigation Action Logs', date: '2026-07-25', type: 'CSV Export Audit', size: '12.4 MB' },
  ];

  const handleDownload = (title) => {
    addNotification('success', 'Download Started', `Downloading ${title}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div className="cyber-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FileText size={28} className="glow-cyan" />
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>EXECUTIVE CYBERSECURITY AUDIT REPORTS</h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Export compliance audits, PDF executive summaries, and raw incident CSV telemetry.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {reports.map((rep, idx) => (
          <div key={idx} className="cyber-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--neon-cyan)', fontSize: '0.74rem', fontWeight: 700, marginBottom: '8px' }}>
                <Calendar size={14} /> {rep.date}
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>{rep.title}</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Type: {rep.type} ({rep.size})</p>
            </div>

            <button
              onClick={() => handleDownload(rep.title)}
              style={{
                marginTop: '20px',
                background: 'rgba(56,189,248,0.15)',
                border: '1px solid rgba(56,189,248,0.3)',
                color: '#38bdf8',
                padding: '10px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Download size={16} /> Download Report
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
