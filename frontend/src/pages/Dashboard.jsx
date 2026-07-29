import React, { useState, useEffect } from 'react';
import StatsCards from '../components/StatsCards';
import { ThreatTimelineChart, AttackCategoryDonutChart } from '../components/Charts';
import ThreatTable from '../components/ThreatTable';
import ThreatMap from '../components/ThreatMap';
import ActivityFeed from '../components/ActivityFeed';
import { mockDataService } from '../services/api';
import { Shield, Zap, RefreshCw, FileText, Download, Sliders, Radio } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard({ onSelectLog }) {
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    const statRes = await mockDataService.getDashboardStats();
    const logRes = await mockDataService.getThreatLogs();
    setStats(statRes);
    setLogs(logRes.items || []);
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Hero Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="cyber-card"
        style={{
          padding: '24px 30px',
          background: 'linear-gradient(135deg, rgba(2,132,199,0.18), rgba(168,85,247,0.12))',
          border: '1px solid rgba(56,189,248,0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{
              background: 'rgba(16,185,129,0.2)',
              color: '#10b981',
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(16,185,129,0.4)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Radio size={12} className="glow-emerald" /> THREAT ENGINE v3.2 ACTIVE
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
            Enterprise Security Operations Center (SOC)
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#cbd5e1', marginTop: '4px' }}>
            Real-time cyber telemetry, automated XGBoost threat neutralization, and SHAP explainability.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={loadDashboardData}
            style={{
              background: 'rgba(8,12,20,0.8)',
              border: '1px solid var(--border-cyan)',
              color: '#fff',
              padding: '10px 16px',
              borderRadius: '10px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh Stream
          </button>
        </div>
      </motion.div>

      {/* KPI Stats Cards */}
      <StatsCards stats={stats} />

      {/* Main Grid Section: Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        <ThreatTimelineChart />
        <AttackCategoryDonutChart />
      </div>

      {/* Map & Live Activity Ticker */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        <ThreatMap />
        <ActivityFeed />
      </div>

      {/* High Density Threat Table Stream */}
      <ThreatTable logs={logs} onSelectLog={onSelectLog} />

    </div>
  );
}
