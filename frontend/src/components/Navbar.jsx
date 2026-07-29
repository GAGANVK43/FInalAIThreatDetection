import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Search, Bell, ShieldCheck, User, Moon, Sun, AlertTriangle, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ onOpenProfile }) {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [unreadCount, setUnreadCount] = useState(3);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/history?search=${encodeURIComponent(search)}`);
    }
  };

  const handleNotificationClick = () => {
    addNotification('info', 'SOC Alert Dispatch', 'System running at 99.8% threat mitigation efficiency.');
    setUnreadCount(0);
  };

  return (
    <header className="cyber-card" style={{
      margin: '16px 16px 20px 16px',
      padding: '14px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '20px'
    }}>
      
      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} style={{ position: 'relative', maxWidth: '380px', width: '100%' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Search Threat IP / Domain / File Hash..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            background: 'rgba(8,12,20,0.8)',
            border: '1px solid var(--border-cyan)',
            color: '#fff',
            padding: '8px 14px 8px 36px',
            borderRadius: '10px',
            fontSize: '0.84rem',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
        />
      </form>

      {/* Right Tools & User Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        
        {/* System Radar Health Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(8,12,20,0.8)',
          padding: '6px 12px',
          borderRadius: '8px',
          border: '1px solid var(--border-cyan)',
          fontSize: '0.78rem'
        }}>
          <div className="radar-pulse"></div>
          <span style={{ fontWeight: 600, color: 'var(--neon-emerald)' }}>SOC RADAR ACTIVE</span>
        </div>

        {/* Notifications Icon */}
        <button
          onClick={handleNotificationClick}
          style={{
            position: 'relative',
            background: 'rgba(8,12,20,0.8)',
            border: '1px solid var(--border-cyan)',
            color: '#fff',
            padding: '8px',
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: '#ef4444',
              color: '#fff',
              fontSize: '0.65rem',
              fontWeight: 800,
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--bg-dark)'
            }}>
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Profile Menu Button */}
        {user && (
          <button
            onClick={onOpenProfile}
            style={{
              background: 'rgba(8,12,20,0.8)',
              border: '1px solid var(--border-cyan)',
              padding: '4px 12px 4px 6px',
              borderRadius: '24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
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
              {user.name ? user.name[0].toUpperCase() : 'A'}
            </div>
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', display: 'block' }}>
                {user.name}
              </span>
              <span style={{ fontSize: '0.68rem', color: 'var(--neon-cyan)' }}>
                {user.role || 'Senior SOC Analyst'}
              </span>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
          </button>
        )}

      </div>

    </header>
  );
}
