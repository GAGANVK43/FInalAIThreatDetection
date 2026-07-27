import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ListFilter, ChevronLeft, ChevronRight, AlertCircle, Trash2 } from 'lucide-react';

export default function ThreatLogsTable({ refreshTrigger }) {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchUserLogs = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/user/logs?user_id=${user.user_id}&page=${page}&limit=10`);
      const data = await res.json();
      setLogs(data.items || []);
      setTotalPages(data.pages || 1);
      setTotalLogs(data.total || 0);
    } catch (err) {
      console.error('Error fetching user logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserLogs();
  }, [user, page, refreshTrigger]);

  const handleClearHistory = async () => {
    if (!user || !window.confirm('Are you sure you want to clear your scan history?')) return;
    try {
      await fetch(`/api/user/clear-history?user_id=${user.user_id}`, { method: 'POST' });
      fetchUserLogs();
    } catch (err) {
      console.error('Error clearing history:', err);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      
      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ListFilter className="glow-text-cyan" size={22} />
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Your Personalized Scan Audit Logs</h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Showing {totalLogs} total scan events for {user ? user.name : 'Session'}</p>
          </div>
        </div>

        {logs.length > 0 && (
          <button
            onClick={handleClearHistory}
            style={{
              background: 'rgba(239,68,68,0.1)',
              color: '#fca5a5',
              border: '1px solid rgba(239,68,68,0.3)',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem'
            }}
          >
            <Trash2 size={14} /> Clear History
          </button>
        )}
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="cyber-table">
          <thead>
            <tr>
              <th>TIMESTAMP</th>
              <th>INPUT TEXT / URL</th>
              <th>TYPE</th>
              <th>PREDICTED THREAT</th>
              <th>RISK SCORE</th>
              <th>SEVERITY</th>
              <th>INDICATORS DETECTED</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  Loading your history...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No scans performed yet! Use the Threat Detector above to test links and messages.
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const sev = (log.severity || 'Low').toLowerCase();
                const isHighRisk = log.risk_score > 60;
                return (
                  <tr key={log.id}>
                    <td className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {log.timestamp}
                    </td>
                    <td className="font-mono" style={{ color: 'var(--primary-cyan)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={log.input_text}>
                      {log.input_text}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '4px' }}>
                        {log.input_type}
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: '#fff' }}>{log.predicted_attack}</strong>
                    </td>
                    <td className="font-mono">
                      <span style={{ color: isHighRisk ? 'var(--danger-red)' : 'var(--primary-emerald)', fontWeight: 700 }}>
                        {log.risk_score} / 100
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${sev}`}>
                        {log.severity}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '260px' }}>
                      {Array.isArray(log.indicators) ? log.indicators.join(' • ') : log.indicators}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {logs.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Page <strong style={{ color: '#fff' }}>{page}</strong> of <strong style={{ color: '#fff' }}>{totalPages}</strong>
          </span>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                background: 'rgba(15,23,42,0.8)',
                color: page === 1 ? 'var(--text-muted)' : '#fff',
                border: '1px solid var(--border-color)',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: page === 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.8rem'
              }}
            >
              <ChevronLeft size={16} /> Prev
            </button>

            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                background: 'rgba(15,23,42,0.8)',
                color: page === totalPages ? 'var(--text-muted)' : '#fff',
                border: '1px solid var(--border-color)',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: page === totalPages ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.8rem'
              }}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
