import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import Profile from '../pages/Profile';

import Dashboard from '../pages/Dashboard';
import ThreatDetection from '../pages/ThreatDetection';
import LiveMonitoring from '../pages/LiveMonitoring';
import ScanSystem from '../pages/ScanSystem';
import Prediction from '../pages/Prediction';
import Reports from '../pages/Reports';
import Analytics from '../pages/Analytics';
import History from '../pages/History';
import Logs from '../pages/Logs';
import Users from '../pages/Users';
import Settings from '../pages/Settings';
import Login from '../pages/Login';
import Register from '../pages/Register';

export default function AppRoutes() {
  const [selectedLog, setSelectedLog] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <Routes>
      {/* Auth Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Main SOC Dashboard Application Shell */}
      <Route
        path="/*"
        element={
          <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)' }}>
            
            {/* Enterprise Cyber Sidebar */}
            <Sidebar />

            {/* Main Content View Container */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              
              {/* Navbar with Search & Profile */}
              <Navbar onOpenProfile={() => setIsProfileOpen(true)} />

              {/* Dynamic Page Views */}
              <main style={{ flex: 1, padding: '0 16px 24px 16px' }}>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard onSelectLog={(log) => setSelectedLog(log)} />} />
                  <Route path="/detection" element={<ThreatDetection />} />
                  <Route path="/scan" element={<ScanSystem />} />
                  <Route path="/prediction" element={<Prediction />} />
                  <Route path="/monitoring" element={<LiveMonitoring />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/history" element={<History onSelectLog={(log) => setSelectedLog(log)} />} />
                  <Route path="/logs" element={<Logs />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </main>

            </div>

            {/* Inspect Threat Detail Modal */}
            <Modal isOpen={Boolean(selectedLog)} onClose={() => setSelectedLog(null)} title={`Threat Event Telemetry: ${selectedLog?.id || ''}`}>
              {selectedLog && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.84rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Target Input / Payload:</span>
                    <div className="font-mono" style={{ background: 'rgba(8,12,20,0.9)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-cyan)', color: '#fff', wordBreak: 'break-all', marginTop: '4px' }}>
                      {selectedLog.input_text}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Classified Threat:</span>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ef4444' }}>{selectedLog.predicted_attack}</h4>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Calculated Risk Score:</span>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8' }} className="font-mono">{selectedLog.risk_score}/100</h4>
                    </div>
                  </div>

                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Source & Destination IP:</span>
                    <p className="font-mono" style={{ color: '#fff' }}>{selectedLog.source_ip} ➔ {selectedLog.destination_ip}</p>
                  </div>

                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Enforced SOC Response:</span>
                    <p style={{ color: '#10b981', fontWeight: 700 }}>{selectedLog.response_action}</p>
                  </div>
                </div>
              )}
            </Modal>

            {/* User Profile Modal */}
            <Modal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} title="Analyst Security Profile">
              <Profile />
            </Modal>

          </div>
        }
      />
    </Routes>
  );
}
