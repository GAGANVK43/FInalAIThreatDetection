import React from 'react';
import { ThreatTimelineChart, AttackCategoryDonutChart, WeeklyTrendBarChart } from '../components/Charts';
import { BarChart3, TrendingUp, Cpu, Filter } from 'lucide-react';

export default function Analytics() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div className="cyber-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BarChart3 size={28} className="glow-purple" />
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>CYBER TELEMETRY ANALYTICS & TRENDS</h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Multi-dimensional threat analytics, seasonal attack curves, and risk breakdown matrices.
            </p>
          </div>
        </div>
      </div>

      {/* Main Charts Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        <ThreatTimelineChart />
        <AttackCategoryDonutChart />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        <WeeklyTrendBarChart />
        
        {/* Attack Heatmap Matrix */}
        <div className="cyber-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>Weekly Threat Volatility Heatmap</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '20px' }}>Hourly peak attack frequency breakdown</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center' }}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <span key={day} style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>{day}</span>
            ))}

            {Array.from({ length: 28 }).map((_, i) => {
              const opacity = [0.2, 0.4, 0.7, 0.9, 0.3, 0.85, 0.5][i % 7];
              return (
                <div
                  key={i}
                  style={{
                    height: '32px',
                    borderRadius: '6px',
                    background: `rgba(239, 68, 68, ${opacity})`,
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: '#fff'
                  }}
                  title={`Hour interval #${i}: ${(opacity * 100).toFixed(0)}% attack load`}
                >
                  {(opacity * 100).toFixed(0)}%
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
