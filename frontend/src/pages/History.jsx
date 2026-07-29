import React, { useState } from 'react';
import ThreatTable from '../components/ThreatTable';
import { History as HistoryIcon, Download } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

export default function History({ onSelectLog }) {
  const { addNotification } = useNotification();

  const handleExportCSV = () => {
    addNotification('success', 'Export Success', 'Incident history logs exported as CSV file');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div className="cyber-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <HistoryIcon size={28} className="glow-cyan" />
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>HISTORICAL THREAT AUDIT ARCHIVE</h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Query and filter past security events, IP addresses, and mitigation resolutions.
            </p>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          style={{
            background: 'linear-gradient(135deg, #0284c7, #0369a1)',
            color: '#fff',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '10px',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Download size={16} /> Export All Logs (CSV)
        </button>
      </div>

      <ThreatTable onSelectLog={onSelectLog} />

    </div>
  );
}
