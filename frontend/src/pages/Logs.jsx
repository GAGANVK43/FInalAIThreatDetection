import React, { useState, useEffect } from 'react';
import { Terminal, Search, Play, Pause, Info } from 'lucide-react';
import { mockDataService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Logs() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [paused, setPaused] = useState(false);
  const [userLogs, setUserLogs] = useState([]);

  const userId = user?.user_id || 1;

  useEffect(() => {
    loadLogs();
  }, [userId]);

  const loadLogs = async () => {
    const res = await mockDataService.getThreatLogs(userId);
    setUserLogs(res.items || []);
  };

  // Convert user scans into terminal telemetry log format
  const terminalLogs = userLogs.map(item => {
    const sev = (item.severity || 'LOW').toUpperCase();
    const time = (item.timestamp || '').split(' ')[1] || '12:00:00';
    return {
      time,
      level: sev === 'CRITICAL' ? 'CRITICAL' : (sev === 'HIGH' ? 'HIGH' : 'INFO'),
      sys: 'XGBOOST-ENGINE',
      msg: `Payload parsed '${item.input_text || 'Threat Item'}' -> Classified ${item.predicted_attack || item.attack_type}. Action: ${item.response_action || 'Logged'}`
    };
  });

  const filteredLogs = terminalLogs.filter(l => {
    const matchSearch = l.msg.toLowerCase().includes(search.toLowerCase()) || l.sys.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'ALL' || l.level === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div className="cyber-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Terminal size={28} className="glow-cyan" />
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>LIVE SOC TERMINAL TELEMETRY LOGS</h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Color-coded terminal stream of kernel events, WAF rules, and XGBoost inferences.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setPaused(!paused)}
            style={{
              background: paused ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)',
              border: `1px solid ${paused ? 'rgba(239,68,68,0.4)' : 'rgba(16,185,129,0.4)'}`,
              color: paused ? '#ef4444' : '#10b981',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {paused ? <Play size={14} /> : <Pause size={14} />} {paused ? 'RESUME STREAM' : 'PAUSE STREAM'}
          </button>
        </div>
      </div>

      {/* Terminal Container */}
      <div className="cyber-card" style={{ padding: '20px', background: '#05080e', border: '1px solid var(--border-glow)' }}>
        
        {/* Terminal Top Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }} />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ position: 'relative', width: '200px' }}>
              <Search size={14} style={{ position: 'absolute', left: '8px', top: '8px', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Filter terminal string..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  padding: '4px 8px 4px 28px',
                  borderRadius: '6px',
                  fontSize: '0.76rem',
                  outline: 'none'
                }}
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                background: '#0d1321',
                border: '1px solid var(--border-cyan)',
                color: '#fff',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.76rem',
                outline: 'none'
              }}
            >
              <option value="ALL" style={{ background: '#0d1321', color: '#fff' }}>ALL LEVELS</option>
              <option value="CRITICAL" style={{ background: '#0d1321', color: '#ef4444' }}>CRITICAL</option>
              <option value="HIGH" style={{ background: '#0d1321', color: '#f59e0b' }}>HIGH</option>
              <option value="INFO" style={{ background: '#0d1321', color: '#38bdf8' }}>INFO</option>
            </select>
          </div>
        </div>

        {/* Console Content */}
        <div className="font-mono" style={{ fontSize: '0.8rem', lineHeight: '1.7', height: '360px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {filteredLogs.length === 0 ? (
            <div style={{ color: '#64748b', fontStyle: 'italic', padding: '20px 0' }}>
              [SYSTEM-DAEMON] Live terminal telemetry stream initialized. Waiting for threat scan events...
            </div>
          ) : (
            filteredLogs.map((log, idx) => {
              const isCrit = log.level === 'CRITICAL';
              const isHigh = log.level === 'HIGH';
              const color = isCrit ? '#ef4444' : (isHigh ? '#f59e0b' : '#38bdf8');
              return (
                <div key={idx} style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ color: '#64748b' }}>[{log.time}]</span>
                  <span style={{ color, fontWeight: 700, width: '70px' }}>{log.level}</span>
                  <span style={{ color: '#c084fc', fontWeight: 600 }}>[{log.sys}]</span>
                  <span style={{ color: '#cbd5e1' }}>{log.msg}</span>
                </div>
              );
            })
          )}
        </div>

      </div>

    </div>
  );
}
