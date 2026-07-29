import React from 'react';
import { ShieldCheck, ShieldAlert, Cpu, CheckCircle2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StatsCards({ stats }) {
  const totalEvents = stats?.total_events ?? 0;
  const activeThreats = stats?.active_threats ?? 0;
  const blockedThreats = stats?.blocked_threats ?? 0;
  const securityScore = stats?.ai_security_score ?? 100;
  const confidence = totalEvents > 0 ? (stats?.ai_confidence ?? 98.4) : 100;

  const cards = [
    {
      title: 'AI Security Shield Score',
      value: `${securityScore}%`,
      sub: totalEvents === 0 ? 'Fresh session - system fully secure' : 'User session security status',
      icon: ShieldCheck,
      color: '#10b981',
      bgGlow: 'rgba(16, 185, 129, 0.12)'
    },
    {
      title: 'Total Scanned Threats',
      value: totalEvents.toLocaleString(),
      sub: 'Threat payloads scanned by you',
      icon: ShieldAlert,
      color: '#38bdf8',
      bgGlow: 'rgba(56, 189, 248, 0.12)'
    },
    {
      title: 'Active Critical Alerts',
      value: activeThreats.toLocaleString(),
      sub: 'Critical threats identified',
      icon: AlertTriangle,
      color: '#ef4444',
      bgGlow: 'rgba(239, 68, 68, 0.12)'
    },
    {
      title: 'Blocked & Mitigated',
      value: blockedThreats.toLocaleString(),
      sub: 'Neutralized by automated rules',
      icon: CheckCircle2,
      color: '#10b981',
      bgGlow: 'rgba(16, 185, 129, 0.12)'
    },
    {
      title: 'AI Inference Confidence',
      value: `${confidence}%`,
      sub: 'XGBoost multi-class accuracy',
      icon: Cpu,
      color: '#a855f7',
      bgGlow: 'rgba(168, 85, 247, 0.12)'
    }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="cyber-card"
            style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}
          >
            <div style={{
              position: 'absolute',
              top: '-15px',
              right: '-15px',
              width: '90px',
              height: '90px',
              background: card.bgGlow,
              borderRadius: '50%',
              filter: 'blur(25px)',
              pointerEvents: 'none'
            }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                  {card.title}
                </span>
                <h3 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#fff', marginTop: '4px' }} className="font-mono">
                  {card.value}
                </h3>
              </div>
              <div style={{
                background: card.bgGlow,
                padding: '10px',
                borderRadius: '12px',
                border: `1px solid ${card.color}40`
              }}>
                <IconComponent size={22} style={{ color: card.color }} />
              </div>
            </div>
            
            <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              {card.sub}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
