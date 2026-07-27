import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginModal from './components/LoginModal';
import Header from './components/Header';
import KPICards from './components/KPICards';
import AITester from './components/AITester';
import VisualCharts from './components/VisualCharts';
import ThreatLogsTable from './components/ThreatLogsTable';

function DashboardContent() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchUserStats = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/user/stats?user_id=${user.user_id}`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching user stats:', err);
    }
  };

  useEffect(() => {
    fetchUserStats();
  }, [user, refreshKey]);

  const handleThreatAnalyzed = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--primary-cyan)' }}>
        Loading AI Threat Detection Engine...
      </div>
    );
  }

  if (!user) {
    return <LoginModal />;
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 16px' }}>
      <Header systemStats={stats} />
      <KPICards stats={stats} />
      <AITester onThreatAnalyzed={handleThreatAnalyzed} />
      <VisualCharts stats={stats} />
      <ThreatLogsTable refreshTrigger={refreshKey} />
      
      <footer style={{ textAlign: 'center', margin: '30px 0 10px 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        AI Threat Detection System &bull; Active User Session: {user.identifier} ({user.login_type.toUpperCase()})
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  );
}
