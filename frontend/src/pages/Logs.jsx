import React, { useState } from 'react';
import { Terminal, Search, Filter, Play, Pause, Trash2 } from 'lucide-react';

export default function Logs() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [paused, setPaused] = useState(false);

  const rawLogs = [
    { time: '11:22:04.120', level: 'CRITICAL', sys: 'XGBOOST-ENGINE', msg: 'High risk Phishing lure detected on domain paypal-security-update.xyz. Action: Isolated' },
    { time: '11:21:45.002', level: 'HIGH', sys: 'WAF-FILTER', msg: 'Rule #408 triggered: Unsanitized SQL parameters detected in GET request string.' },
    { time: '11:20:12.890', level: 'INFO', sys: 'SYSTEM-DAEMON', msg: 'SQLite DB WAL checkpoint completed successfully. 124 entries committed.' },
    { time: '11:18:02.550', level: 'CRITICAL', sys: 'EDR-AGENT', msg: 'Trojan payload executable signature matched SHA256: e3b0c44298fc1c149afbf4c8996fb924' },
    { time: '11:15:30.400', level: 'WARN', sys: 'NET-HEURISTICS', msg: 'TCP SYN flood spike detected on eth0 from subnet 219.80.193.0/24' },
    { time: '11:12:10.110', level: 'INFO', sys: 'SHAP-EXPLAINER', msg: 'Generated TreeExplainer matrix for sample EVT-9839 in 12ms.' }
  ];

  const filteredLogs = rawLogs.filter(l => {
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
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.76rem',
                outline: 'none'
              }}
            >
              <option value="ALL">ALL LEVELS</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="WARN">WARN</option>
              <option value="INFO">INFO</option>
            </select>
          </div>
        </div>

        {/* Console Content */}
        <div className="font-mono" style={{ fontSize: '0.8rem', lineHeight: '1.7', height: '360px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {filteredLogs.map((log, idx) => {
            const isCrit = log.level === 'CRITICAL';
            const isHigh = log.level === 'HIGH';
            const isWarn = log.level === 'WARN';
            const color = isCrit ? '#ef4444' : (isHigh ? '#f59e0b' : (isWarn ? '#eab308' : '#38bdf8'));
            return (
              <div key={idx} style={{ display: 'flex', gap: '10px' }}>
                <span style={{ color: '#64748b' }}>[{log.time}]</span>
                <span style={{ color, fontWeight: 700, width: '70px' }}>{log.level}</span>
                <span style={{ color: '#c084fc', fontWeight: 600 }}>[{log.sys}]</span>
                <span style={{ color: '#cbd5e1' }}>{log.msg}</span>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
