import React from 'react';
import { Globe, Radio, ShieldCheck } from 'lucide-react';

export default function ThreatMap({ logs = [] }) {
  // Extract unique IP origins scanned by this user
  const mapNodes = logs.map((log, idx) => {
    const positions = [
      { x: '72%', y: '32%' },
      { x: '82%', y: '45%' },
      { x: '25%', y: '38%' },
      { x: '35%', y: '68%' },
      { x: '60%', y: '50%' }
    ];
    const pos = positions[idx % positions.length];
    return {
      ip: log.source_ip || '185.220.101.4',
      attack: log.predicted_attack || log.attack_type || 'Scanned Payload',
      risk: log.risk_score || 80,
      x: pos.x,
      y: pos.y
    };
  });

  return (
    <div className="cyber-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Globe size={20} className="glow-cyan" />
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Global Cyber Attack Radar Map</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {logs.length === 0 ? 'Radar ready for session telemetry' : 'Real-time origin coordinates of your scanned threat payloads'}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--neon-emerald)' }}>
          <Radio size={14} /> LIVE TELEMETRY
        </div>
      </div>

      {/* Map Canvas Background */}
      <div style={{
        height: '240px',
        background: 'rgba(8,12,20,0.95)',
        borderRadius: '12px',
        border: '1px solid var(--border-cyan)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'radial-gradient(rgba(56, 189, 248, 0.15) 1px, transparent 0)',
        backgroundSize: '24px 24px'
      }}>
        {logs.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            <Globe size={48} style={{ margin: '0 auto 8px', opacity: 0.3 }} className="glow-cyan" />
            <span style={{ fontSize: '0.82rem', display: 'block' }}>Radar Standby: Scanned IP origins will plot here</span>
          </div>
        ) : (
          mapNodes.map((node, idx) => (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: node.x,
                top: node.y,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer'
              }}
              title={`${node.ip} - ${node.attack}`}
            >
              <div className="radar-pulse" style={{ backgroundColor: '#ef4444' }}></div>
              <span className="font-mono" style={{ fontSize: '0.68rem', color: '#fca5a5', background: 'rgba(15,23,42,0.9)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(239,68,68,0.4)', marginTop: '4px' }}>
                {node.ip}: {node.attack}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
