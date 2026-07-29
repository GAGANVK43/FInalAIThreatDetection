import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Eye, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const categoryStyleMap = {
  'Phishing': { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.35)' },
  'Malware': { color: '#ef4444', bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.35)' },
  'Executable Malware Binary': { color: '#ef4444', bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.35)' },
  'DDoS': { color: '#a855f7', bg: 'rgba(168,85,247,0.15)', border: 'rgba(168,85,247,0.35)' },
  'SQL Injection': { color: '#38bdf8', bg: 'rgba(56,189,248,0.15)', border: 'rgba(56,189,248,0.35)' },
  'Ransomware': { color: '#ec4899', bg: 'rgba(236,72,153,0.15)', border: 'rgba(236,72,153,0.35)' },
  'Safe / Legitimate Link': { color: '#10b981', bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.35)' },
  'Clean & Verified File': { color: '#10b981', bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.35)' },
};

export default function ThreatTable({ logs = [], onSelectLog }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  const filteredLogs = logs.filter(log => {
    const srcIp = log.source_ip || '';
    const attack = log.predicted_attack || log.attack_type || '';
    const input = log.input_text || '';
    const matchesSearch = srcIp.includes(searchTerm) || attack.toLowerCase().includes(searchTerm.toLowerCase()) || input.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSev = severityFilter === 'All' || (log.severity || '').toLowerCase() === severityFilter.toLowerCase();
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
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Real-time event stream of your scanned threat payloads</p>
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
              background: '#0d1321',
              border: '1px solid var(--border-cyan)',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              outline: 'none'
            }}
          >
            <option value="All" style={{ background: '#0d1321', color: '#fff' }}>All Severity</option>
            <option value="Critical" style={{ background: '#0d1321', color: '#ef4444' }}>Critical</option>
            <option value="High" style={{ background: '#0d1321', color: '#f59e0b' }}>High</option>
            <option value="Medium" style={{ background: '#0d1321', color: '#eab308' }}>Medium</option>
            <option value="Low" style={{ background: '#0d1321', color: '#10b981' }}>Low</option>
          </select>
        </div>
      </div>

      {displayedLogs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', background: 'rgba(8,12,20,0.6)', borderRadius: '12px', border: '1px solid var(--border-cyan)' }}>
          <ShieldCheck size={48} className="glow-cyan" style={{ margin: '0 auto 12px' }} />
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>No Threat Scans Recorded Yet</h4>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '420px', margin: '6px auto 16px' }}>
            Your security dashboard is clean! Analyze suspicious URLs or upload files to begin generating AI threat intelligence telemetry for your account.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/detection" style={{ background: 'linear-gradient(135deg, #0284c7, #0369a1)', color: '#fff', padding: '8px 16px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={14} /> Scan URL / Payload
            </Link>
            <Link to="/scan" style={{ background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.3)', color: '#38bdf8', padding: '8px 16px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none' }}>
              Upload Sandbox File
            </Link>
          </div>
        </div>
      ) : (
        <>
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
                  const attackCategory = log.predicted_attack || log.attack_type || 'Malware';
                  const catStyle = categoryStyleMap[attackCategory] || { color: '#38bdf8', bg: 'rgba(56,189,248,0.15)', border: 'rgba(56,189,248,0.35)' };
                  const sevClass = (log.severity || 'Low').toLowerCase();

                  return (
                    <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }}>
                      <td className="font-mono" style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>{log.id}</td>
                      <td className="font-mono" style={{ padding: '12px 14px', color: 'var(--text-muted)', fontSize: '0.76rem' }}>{log.timestamp}</td>
                      <td className="font-mono" style={{ padding: '12px 14px', color: 'var(--neon-cyan)' }}>{log.source_ip}</td>
                      <td className="font-mono" style={{ padding: '12px 14px', color: '#fff', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={log.input_text}>
                        {log.input_text}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '3px 10px',
                          borderRadius: '8px',
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          color: catStyle.color,
                          background: catStyle.bg,
                          border: `1px solid ${catStyle.border}`
                        }}>
                          {attackCategory}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
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
        </>
      )}

    </div>
  );
}
