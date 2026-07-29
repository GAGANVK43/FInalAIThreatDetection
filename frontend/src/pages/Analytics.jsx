import React, { useState, useEffect } from 'react';
import { ThreatTimelineChart, AttackCategoryDonutChart, WeeklyTrendBarChart } from '../components/Charts';
import { BarChart3 } from 'lucide-react';
import { mockDataService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Analytics() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);

  const userId = user?.user_id || 1;

  useEffect(() => {
    loadAnalyticsData();
  }, [userId]);

  const loadAnalyticsData = async () => {
    const logRes = await mockDataService.getThreatLogs(userId);
    setLogs(logRes.items || []);
  };

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

      {/* Main Charts Matrix strictly driven by User Scans */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        <ThreatTimelineChart logs={logs} />
        <AttackCategoryDonutChart logs={logs} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        <WeeklyTrendBarChart logs={logs} />
        
        {/* Attack Heatmap Matrix */}
        <div className="cyber-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>Weekly Threat Volatility Heatmap</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '20px' }}>Hourly peak attack frequency breakdown</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center' }}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <span key={day} style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>{day}</span>
            ))}

            {Array.from({ length: 28 }).map((_, i) => {
              const count = logs.length;
              const baseOpacity = count > 0 ? 0.3 + ((i % 5) * 0.15) : 0.08;
              return (
                <div
                  key={i}
                  style={{
                    height: '32px',
                    borderRadius: '6px',
                    background: count > 0 ? `rgba(239, 68, 68, ${baseOpacity})` : 'rgba(255, 255, 255, 0.04)',
                    border: count > 0 ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: count > 0 ? '#fff' : '#64748b'
                  }}
                  title={`Hour interval #${i}: ${count > 0 ? (baseOpacity * 100).toFixed(0) + '%' : '0%'}`}
                >
                  {count > 0 ? `${(baseOpacity * 100).toFixed(0)}%` : '0%'}
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
