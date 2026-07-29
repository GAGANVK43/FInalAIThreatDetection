import React from 'react';
import { Globe, MapPin, ShieldAlert, Radio } from 'lucide-react';

export default function ThreatMap() {
  const attackOrigins = [
    { country: 'Eastern Europe Node', ip: '185.220.101.4', attack: 'DDoS Flood', risk: 96, x: '72%', y: '32%' },
    { country: 'East Asia Gateway', ip: '103.22.201.12', attack: 'Malware Exfil', risk: 92, x: '82%', y: '45%' },
    { country: 'North America Subnet', ip: '45.133.1.20', attack: 'SQL Injection', risk: 88, x: '25%', y: '38%' },
    { country: 'South America Server', ip: '177.85.12.90', attack: 'Phishing Gateway', risk: 84, x: '35%', y: '68%' },
  ];

  return (
    <div className="cyber-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Globe size={20} className="glow-cyan" />
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Global Cyber Attack Radar Map</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Real-time origin coordinates of intercepted attack vectors</p>
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
        {attackOrigins.map((node, idx) => (
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
            title={`${node.country} (${node.ip}) - ${node.attack}`}
          >
            <div className="radar-pulse" style={{ backgroundColor: '#ef4444' }}></div>
            <span className="font-mono" style={{ fontSize: '0.68rem', color: '#fca5a5', background: 'rgba(15,23,42,0.9)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(239,68,68,0.4)', marginTop: '4px' }}>
              {node.country}: {node.attack}
            </span>
          </div>
        ))}

        <div style={{ textAlign: 'center', opacity: 0.25, pointerEvents: 'none' }}>
          <Globe size={120} className="glow-cyan" />
        </div>
      </div>
    </div>
  );
}
