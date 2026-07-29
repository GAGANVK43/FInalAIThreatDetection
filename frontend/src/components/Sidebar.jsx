import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Scan,
  Cpu,
  Radio,
  ShieldAlert,
  BarChart3,
  FileText,
  History,
  Terminal,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  Shield
} from 'lucide-react';

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Threat Detection', path: '/detection', icon: ShieldAlert, badge: 'AI Live' },
    { label: 'Scan System', path: '/scan', icon: Scan },
    { label: 'AI Prediction', path: '/prediction', icon: Cpu },
    { label: 'Live Monitoring', path: '/monitoring', icon: Radio, pulse: true },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Reports', path: '/reports', icon: FileText },
    { label: 'Threat History', path: '/history', icon: History },
    { label: 'Security Logs', path: '/logs', icon: Terminal },
    { label: 'User Management', path: '/users', icon: Users },
    { label: 'System Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="cyber-card" style={{
      width: '260px',
      minHeight: 'calc(100vh - 32px)',
      margin: '16px 0 16px 16px',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'sticky',
      top: '16px'
    }}>
      
      {/* Brand Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px', padding: '0 8px' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(56,189,248,0.25), rgba(168,85,247,0.25))',
            padding: '10px',
            borderRadius: '12px',
            border: '1px solid rgba(56,189,248,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Shield size={26} className="glow-cyan" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
              CYBER<span className="glow-cyan">SHIELD</span> AI
            </h1>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              SOC Enterprise v3.2
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {navItems.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <NavLink
                key={idx}
                to={item.path}
                className={({ isActive }) => `
                  nav-item-link
                  ${isActive ? 'active-nav' : ''}
                `}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  color: isActive ? '#fff' : '#94a3b8',
                  background: isActive ? 'linear-gradient(90deg, rgba(56,189,248,0.18), rgba(2,132,199,0.08))' : 'transparent',
                  border: isActive ? '1px solid rgba(56,189,248,0.35)' : '1px solid transparent',
                  transition: 'all 0.2s ease'
                })}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <IconComp size={18} style={{ color: item.pulse ? '#10b981' : undefined }} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    background: 'rgba(56,189,248,0.2)',
                    color: '#38bdf8',
                    padding: '2px 6px',
                    borderRadius: '6px',
                    border: '1px solid rgba(56,189,248,0.3)'
                  }}>
                    {item.badge}
                  </span>
                )}

                {item.pulse && (
                  <div className="radar-pulse"></div>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Logout */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            background: 'rgba(239,68,68,0.1)',
            color: '#fca5a5',
            border: '1px solid rgba(239,68,68,0.25)',
            padding: '10px 14px',
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.82rem',
            fontWeight: 600,
            transition: 'all 0.2s'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LogOut size={16} />
            <span>Sign Out</span>
          </div>
          <ChevronRight size={14} />
        </button>
      </div>

    </aside>
  );
}
