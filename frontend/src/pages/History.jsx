import React, { useState, useEffect } from 'react';
import ThreatTable from '../components/ThreatTable';
import { History as HistoryIcon, Download } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { mockDataService } from '../services/api';

export default function History({ onSelectLog }) {
  const { addNotification } = useNotification();
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);

  const userId = user?.user_id || 1;

  useEffect(() => {
    loadLogs();
  }, [userId]);

  const loadLogs = async () => {
    const res = await mockDataService.getThreatLogs(userId);
    setLogs(res.items || []);
  };

  const handleExportCSV = () => {
    if (logs.length === 0) {
      addNotification('error', 'Export Error', 'No threat logs available to export');
      return;
    }

    addNotification('success', 'Export Success', 'Downloading threat logs as CSV file');

    let csvContent = 'Timestamp,Event_ID,Source_IP,Input_Payload,Attack_Category,Severity,Response_Action\n';
    logs.forEach(item => {
      csvContent += `"${item.timestamp}","${item.id}","${item.source_ip}","${(item.input_text || '').replace(/"/g, '""')}","${item.predicted_attack || item.attack_type}","${item.severity}","${item.response_action}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Incident_Threat_Audit_History_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div className="cyber-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <HistoryIcon size={28} className="glow-cyan" />
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>HISTORICAL THREAT AUDIT ARCHIVE</h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Query and filter past security events, IP addresses, and mitigation resolutions for your account.
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
            gap: '8px',
            boxShadow: '0 4px 15px rgba(2,132,199,0.3)'
          }}
        >
          <Download size={16} /> Export All Logs (CSV)
        </button>
      </div>

      <ThreatTable logs={logs} onSelectLog={onSelectLog} />

    </div>
  );
}
