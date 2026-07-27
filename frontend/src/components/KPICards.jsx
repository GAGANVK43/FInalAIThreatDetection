import React from 'react';
import { ShieldAlert, AlertTriangle, DatabaseZap, CheckCircle2 } from 'lucide-react';

export default function KPICards({ stats }) {
  if (!stats) return null;

  const cards = [
    {
      title: 'Total Analyzed Threats',
      value: stats.total_events ? stats.total_events.toLocaleString() : '0',
      sub: 'Ingested security logs',
      icon: ShieldAlert,
      color: '#38bdf8',
      bgGlow: 'rgba(56, 189, 248, 0.1)'
    },
    {
      title: 'Critical Severity Alerts',
      value: stats.severity_distribution ? (stats.severity_distribution.Critical || 0).toLocaleString() : '0',
      sub: 'Immediate action required',
      icon: AlertTriangle,
      color: '#ef4444',
      bgGlow: 'rgba(239, 68, 68, 0.1)'
    },
    {
      title: 'Data Exfiltration Rate',
      value: `${stats.exfil_rate_pct || 0}%`,
      sub: `${stats.exfiltrated_count ? stats.exfiltrated_count.toLocaleString() : '0'} confirmed breaches`,
      icon: DatabaseZap,
      color: '#f59e0b',
      bgGlow: 'rgba(245, 158, 11, 0.1)'
    },
    {
      title: 'Eradication & Mitigated',
      value: stats.action_distribution ? (stats.action_distribution.Eradicated || 0).toLocaleString() : '0',
      sub: 'Neutralized by SOC Response',
      icon: CheckCircle2,
      color: '#10b981',
      bgGlow: 'rgba(16, 185, 129, 0.1)'
    }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' }}>
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div key={idx} className="glass-panel" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute',
              top: '-10px',
              right: '-10px',
              width: '80px',
              height: '80px',
              background: card.bgGlow,
              borderRadius: '50%',
              filter: 'blur(20px)',
              pointerEvents: 'none'
            }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {card.title}
                </span>
                <h3 className="font-mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
                  {card.value}
                </h3>
              </div>
              <div style={{
                background: card.bgGlow,
                padding: '10px',
                borderRadius: '10px',
                border: `1px solid ${card.color}40`
              }}>
                <IconComponent size={22} style={{ color: card.color }} />
              </div>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {card.sub}
            </p>
          </div>
        );
      })}
    </div>
  );
}
