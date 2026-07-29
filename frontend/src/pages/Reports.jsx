import React from 'react';
import { FileText, Download, Calendar } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

export default function Reports() {
  const { addNotification } = useNotification();
  const { user } = useAuth();

  const reports = [
    { title: 'SOC Executive Monthly Threat Audit Report (July 2026)', filename: 'SOC_Executive_Threat_Audit_Report.pdf', date: '2026-07-29', type: 'PDF Executive Summary', size: '4.2 MB' },
    { title: 'XGBoost Model Performance & SHAP Evaluation Report', filename: 'XGBoost_Model_Metrics_Evaluation.csv', date: '2026-07-28', type: 'JSON & CSV Metrics Dump', size: '1.8 MB' },
    { title: 'Incident Response & Mitigation Action Logs', filename: 'Incident_Response_Action_Logs.csv', date: '2026-07-25', type: 'CSV Export Audit', size: '12.4 MB' },
  ];

  const handleDownload = (rep) => {
    addNotification('success', 'Download Started', `Downloading ${rep.filename}`);

    // Generate real downloadable Blob content
    const content = `=================================================================\nCYBERSHIELD AI - EXECUTIVE THREAT AUDIT REPORT\nReport Title: ${rep.title}\nDate: ${rep.date}\nGenerated For Analyst: ${user?.name || 'SOC Analyst'} (${user?.identifier || 'alex.mercer@cyberdefense.sec'})\nEngine: XGBoost Classifier v2.0 with SHAP Explainability\n=================================================================\n\nSUMMARY OF MITIGATION TELEMETRY:\n- Total Session Scans Inspected: 100%\n- Average Mitigation Accuracy: 98.4%\n- Enforced SOC Protocols: WAF Rule #408, IP Null-routing, Domain Isolation\n\n[End of Audit File]\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = rep.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
              onClick={() => handleDownload(rep)}
              style={{
                marginTop: '20px',
                background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                border: 'none',
                color: '#fff',
                padding: '10px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(2,132,199,0.3)'
              }}
            >
              <Download size={16} /> Download File
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
