import React from 'react';
import { BarChart3, PieChart, ShieldAlert } from 'lucide-react';

export default function VisualCharts({ stats }) {
  if (!stats) return null;

  const attackDist = stats.attack_distribution || {};
  const severityDist = stats.severity_distribution || {};
  const totalEvents = stats.total_events || 1;

  const attackColors = {
    'DDoS': '#ef4444',
    'Ransomware': '#f59e0b',
    'Malware': '#a855f7',
    'Phishing': '#38bdf8',
    'SQL Injection': '#10b981',
    'Insider Threat': '#ec4899'
  };

  const severityColors = {
    'Critical': '#ef4444',
    'High': '#f59e0b',
    'Medium': '#38bdf8',
    'Low': '#10b981'
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
      
      {/* Attack Categories Breakdown */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <BarChart3 size={20} className="glow-text-cyan" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Attack Type Distribution</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Object.entries(attackDist).map(([type, count]) => {
            const pct = Math.round((count / totalEvents) * 100);
            const color = attackColors[type] || '#38bdf8';
            return (
              <div key={type}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600 }}>{type}</span>
                  <span style={{ color: 'var(--text-muted)' }} className="font-mono">{count.toLocaleString()} ({pct}%)</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '4px', transition: 'width 0.4s ease' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Severity Breakdown & Top Target IPs */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <PieChart size={20} className="glow-text-emerald" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Threat Severity Spectrum</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          {Object.entries(severityDist).map(([sev, count]) => {
            const pct = Math.round((count / totalEvents) * 100);
            const color = severityColors[sev] || '#38bdf8';
            return (
              <div key={sev}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600 }}>{sev} Severity</span>
                  <span style={{ color: 'var(--text-muted)' }} className="font-mono">{count.toLocaleString()} ({pct}%)</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '4px', transition: 'width 0.4s ease' }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Top Target Destination IPs */}
        {stats.top_dest_ips && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              Top Targeted Target Destination IPs
            </span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {Object.entries(stats.top_dest_ips).map(([ip, cnt]) => (
                <span key={ip} className="font-mono" style={{ fontSize: '0.75rem', background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)', padding: '4px 8px', borderRadius: '6px', color: 'var(--primary-cyan)' }}>
                  {ip} ({cnt})
                </span>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
