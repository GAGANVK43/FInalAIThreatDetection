import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, ShieldCheck, Key, Lock, Mail, Calendar, Award } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div className="cyber-card" style={{ padding: '28px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #0284c7, #10b981)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 800,
          fontSize: '2rem',
          boxShadow: '0 0 20px rgba(2,132,199,0.4)'
        }}>
          {user?.name ? user.name[0].toUpperCase() : 'A'}
        </div>

        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>{user?.name || 'Alex Mercer'}</h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--neon-cyan)', fontWeight: 600 }}>{user?.role || 'Senior SOC Analyst'}</p>
          <div style={{ display: 'flex', gap: '14px', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={14} /> {user?.identifier || 'alex.mercer@cyberdefense.sec'}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Award size={14} /> Security clearance Level 5</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <div className="cyber-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px', color: '#fff' }}>Analyst Security Shield Score</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#10b981' }} className="font-mono">98/100</div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>2FA Hardware Key Enabled & Session Encrypted</p>
        </div>

        <div className="cyber-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px', color: '#fff' }}>Total Neutralizations Managed</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#38bdf8' }} className="font-mono">1,485</div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Across Phishing, DDoS, and Malware payloads</p>
        </div>
      </div>

    </div>
  );
}
