import React from 'react';
import { FileText, Download, Calendar } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

export default function Reports() {
  const { addNotification } = useNotification();
  const { user } = useAuth();

  const reports = [
    {
      title: 'SOC Executive Monthly Threat Audit Report (July 2026)',
      filename: 'SOC_Executive_Threat_Audit_Report.txt',
      mimeType: 'text/plain',
      date: '2026-07-29',
      type: 'Text Executive Audit Report',
      size: '4.2 KB'
    },
    {
      title: 'XGBoost Model Performance & SHAP Evaluation Report',
      filename: 'XGBoost_Model_Metrics_Evaluation.csv',
      mimeType: 'text/csv',
      date: '2026-07-28',
      type: 'CSV Performance Audit Dump',
      size: '1.8 KB'
    },
    {
      title: 'Incident Response & Mitigation Action Logs',
      filename: 'Incident_Response_Action_Logs.csv',
      mimeType: 'text/csv',
      date: '2026-07-25',
      type: 'CSV Mitigation Telemetry',
      size: '12.4 KB'
    },
  ];

  const handleDownload = (rep) => {
    addNotification('success', 'Download Complete', `Saved ${rep.filename} to Downloads folder`);

    let content = '';
    if (rep.filename.endsWith('.csv')) {
      content = `Timestamp,Event_ID,Analyst,Classified_Threat,Confidence_Score,Risk_Score,Enforced_Protocol\n` +
        `2026-07-29 11:22:04,EVT-9832,${user?.name || 'SOC Analyst'},Phishing,96.8%,94,Block URL Domain & Revoke Session\n` +
        `2026-07-29 11:18:02,EVT-8472,${user?.name || 'SOC Analyst'},Malware,98.4%,98,Isolate Endpoint & Quarantine Executable\n` +
        `2026-07-29 10:45:12,EVT-3129,${user?.name || 'SOC Analyst'},SQL Injection,94.2%,88,Enable WAF Rule #408 & Sanitize SQL\n`;
    } else {
      content = `=================================================================\nCYBERSHIELD AI - EXECUTIVE THREAT AUDIT REPORT\nReport Title: ${rep.title}\nDate: ${rep.date}\nGenerated For Analyst: ${user?.name || 'SOC Analyst'} (${user?.identifier || 'alex.mercer@cyberdefense.sec'})\nEngine: XGBoost Classifier v2.0 with SHAP Explainability\n=================================================================\n\nSUMMARY OF MITIGATION TELEMETRY:\n- Total Session Scans Inspected: 100%\n- Average Mitigation Accuracy: 98.4%\n- Enforced SOC Protocols: WAF Rule #408, IP Null-routing, Domain Isolation\n\n[End of Audit File]\n`;
    }

    const blob = new Blob([content], { type: `${rep.mimeType};charset=utf-8` });
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
              Export compliance audits, executive summaries, and raw incident CSV telemetry.
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
              <Download size={16} /> Download File ({rep.filename.split('.').pop().toUpperCase()})
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
