import React, { useState } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, ShieldAlert, AlertCircle, Eye, Download, CheckCircle2 } from 'lucide-react';

export default function ThreatTable({ logs = [], onSelectLog }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  const defaultLogs = logs.length > 0 ? logs : [
    { id: 'EVT-9841', timestamp: '2026-07-29 11:22:01', source_ip: '185.220.101.4', destination_ip: '10.0.4.15', input_text: 'http://paypal-security-update-verify.xyz/login.php', input_type: 'URL Link', predicted_attack: 'Phishing', risk_score: 96, severity: 'Critical', response_action: 'Blocked & Isolated' },
    { id: 'EVT-9840', timestamp: '2026-07-29 11:19:40', source_ip: '45.133.1.20', destination_ip: '192.168.1.100', input_text: "SELECT * FROM users WHERE '1'='1'", input_type: 'SQL Query', predicted_attack: 'SQL Injection', risk_score: 88, severity: 'High', response_action: 'WAF Rule Triggered' },
    { id: 'EVT-9839', timestamp: '2026-07-29 11:15:10', source_ip: '110.155.68.245', destination_ip: '178.123.150.38', input_text: 'http://malware-drop.cc/urgent_invoice.exe', input_type: 'Executable Binary', predicted_attack: 'Malware', risk_score: 94, severity: 'Critical', response_action: 'Quarantined Payload' },
    { id: 'EVT-9838', timestamp: '2026-07-29 11:08:18', source_ip: '219.80.193.15', destination_ip: '44.155.75.24', input_text: 'GET /api/v1/resource HTTP/1.1 (Flood payload)', input_type: 'Packet Flood', predicted_attack: 'DDoS', risk_score: 78, severity: 'High', response_action: 'Null-routed Source IP' },
    { id: 'EVT-9837', timestamp: '2026-07-29 10:45:00', source_ip: '192.168.1.55', destination_ip: '10.0.0.1', input_text: 'https://github.com/security/bulletins', input_type: 'Clean URL', predicted_attack: 'Legitimate Link', risk_score: 8, severity: 'Low', response_action: 'Passed Inspection' },
    { id: 'EVT-9836', timestamp: '2026-07-29 10:30:12', source_ip: '103.22.201.12', destination_ip: '172.16.0.4', input_text: 'Wget/1.21.3 (Ransomware C2 Ping)', input_type: 'C2 Handshake', predicted_attack: 'Ransomware', risk_score: 92, severity: 'Critical', response_action: 'Endpoint LAN Isolated' }
  ];

  const filteredLogs = defaultLogs.filter(log => {
    const matchesSearch = log.source_ip.includes(searchTerm) || log.predicted_attack.toLowerCase().includes(searchTerm.toLowerCase()) || log.input_text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSev = severityFilter === 'All' || log.severity.toLowerCase() === severityFilter.toLowerCase();
    return matchesSearch && matchesSev;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const displayedLogs = filteredLogs.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="cyber-card" style={{ padding: '24px' }}>
      
      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Security Incident Activity Feed</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Real-time event stream from SOC telemetry</p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '220px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '11px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search IP / Payload / Category..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              style={{
                width: '100%',
                background: 'rgba(8,12,20,0.9)',
                border: '1px solid var(--border-cyan)',
                color: '#fff',
                padding: '6px 12px 6px 32px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                outline: 'none'
              }}
            />
          </div>

          <select
            value={severityFilter}
            onChange={(e) => { setSeverityFilter(e.target.value); setPage(1); }}
            style={{
              background: 'rgba(8,12,20,0.9)',
              border: '1px solid var(--border-cyan)',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              outline: 'none'
            }}
          >
            <option value="All">All Severity</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-cyan)', textAlign: 'left', color: 'var(--text-muted)' }}>
              <th style={{ padding: '12px 14px' }}>EVENT ID</th>
              <th style={{ padding: '12px 14px' }}>TIMESTAMP</th>
              <th style={{ padding: '12px 14px' }}>SOURCE IP</th>
              <th style={{ padding: '12px 14px' }}>INPUT PAYLOAD / LINK</th>
              <th style={{ padding: '12px 14px' }}>ATTACK CATEGORY</th>
              <th style={{ padding: '12px 14px' }}>SEVERITY</th>
              <th style={{ padding: '12px 14px' }}>ACTION TAKEN</th>
              <th style={{ padding: '12px 14px' }}>DETAILS</th>
            </tr>
          </thead>
          <tbody>
            {displayedLogs.map((log) => {
              const sevClass = (log.severity || 'Low').toLowerCase();
              return (
                <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }}>
                  <td className="font-mono" style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>{log.id}</td>
                  <td className="font-mono" style={{ padding: '12px 14px', color: 'var(--text-muted)', fontSize: '0.76rem' }}>{log.timestamp}</td>
                  <td className="font-mono" style={{ padding: '12px 14px', color: 'var(--neon-cyan)' }}>{log.source_ip}</td>
                  <td className="font-mono" style={{ padding: '12px 14px', color: '#fff', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={log.input_text}>
                    {log.input_text}
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#fff' }}>{log.predicted_attack}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      background: sevClass === 'critical' ? 'rgba(239,68,68,0.15)' : (sevClass === 'high' ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)'),
                      color: sevClass === 'critical' ? '#fca5a5' : (sevClass === 'high' ? '#fcd34d' : '#6ee7b7'),
                      border: `1px solid ${sevClass === 'critical' ? 'rgba(239,68,68,0.3)' : (sevClass === 'high' ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.3)')}`
                    }}>
                      {log.severity}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '0.76rem', color: 'var(--text-muted)' }}>{log.response_action}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <button
                      onClick={() => onSelectLog && onSelectLog(log)}
                      style={{
                        background: 'rgba(56,189,248,0.1)',
                        border: '1px solid rgba(56,189,248,0.3)',
                        color: 'var(--neon-cyan)',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.72rem'
                      }}
                    >
                      <Eye size={12} /> Inspect
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        <span>Page <strong>{page}</strong> of <strong>{totalPages}</strong></span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ background: 'rgba(8,12,20,0.8)', border: '1px solid var(--border-cyan)', color: '#fff', padding: '4px 10px', borderRadius: '6px', cursor: page === 1 ? 'not-allowed' : 'pointer' }}>
            Prev
          </button>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ background: 'rgba(8,12,20,0.8)', border: '1px solid var(--border-cyan)', color: '#fff', padding: '4px 10px', borderRadius: '6px', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}>
            Next
          </button>
        </div>
      </div>

    </div>
  );
}
