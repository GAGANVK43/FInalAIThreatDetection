import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import UserProfileModal from './UserProfileModal';
import { ShieldAlert, LogOut, Radio, Mail, Phone, UserCheck } from 'lucide-react';

export default function Header({ systemStats }) {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
      <header className="glass-panel" style={{ padding: '18px 24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          
          {/* Brand Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(56,189,248,0.2), rgba(16,185,129,0.2))',
              padding: '12px',
              borderRadius: '12px',
              border: '1px solid rgba(56,189,248,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldAlert size={28} className="glow-text-cyan" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
                AI THREAT DETECTION <span className="glow-text-cyan">CENTER</span>
              </h1>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Radio size={12} style={{ color: 'var(--primary-emerald)' }} /> Real-time Link, Message & Incident Scanner
              </p>
            </div>
          </div>

          {/* User Profile & Logout */}
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              
              {/* Profile Card Button */}
              <button
                onClick={() => setShowProfile(true)}
                title="View Security Profile & Detection History"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'rgba(15,23,42,0.9)',
                  padding: '6px 14px',
                  borderRadius: '24px',
                  border: '1px solid rgba(56,189,248,0.4)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0284c7, #10b981)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '0.85rem'
                }}>
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {user.name} <UserCheck size={12} style={{ color: 'var(--primary-emerald)' }} />
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--primary-cyan)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {user.login_type === 'gmail' ? <Mail size={10} /> : <Phone size={10} />}
                    {user.identifier}
                  </span>
                </div>
              </button>

              {/* Logout Button */}
              <button
                onClick={logout}
                title="Sign Out"
                style={{
                  background: 'rgba(239,68,68,0.15)',
                  color: '#fca5a5',
                  border: '1px solid rgba(239,68,68,0.3)',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                <LogOut size={14} /> Exit
              </button>

            </div>
          )}

        </div>
      </header>

      {/* User Security Profile Modal */}
      {showProfile && (
        <UserProfileModal onClose={() => setShowProfile(false)} />
      )}
    </>
  );
}
