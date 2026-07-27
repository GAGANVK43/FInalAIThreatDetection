import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, ShieldCheck, Mail, Phone, Calendar, AlertTriangle, ShieldAlert, X, Activity, CheckCircle2 } from 'lucide-react';

export default function UserProfileModal({ onClose }) {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.user_id) {
      fetch(`/api/user/profile?user_id=${user.user_id}`)
        .then(res => res.json())
        .then(data => {
          setProfileData(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching profile:', err);
          setLoading(false);
        });
    }
  }, [user]);

  if (!user) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(5, 8, 15, 0.88)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '680px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '28px',
        position: 'relative',
        boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(56,189,248,0.2)',
        border: '1px solid rgba(56,189,248,0.3)'
      }}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255,255,255,0.08)',
            border: 'none',
            color: 'var(--text-muted)',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={18} />
        </button>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--primary-cyan)' }}>
            Loading User Security Profile...
          </div>
        ) : profileData ? (
          <div>
            
            {/* User Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '20px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0284c7, #10b981)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '1.8rem',
                fontWeight: 800,
                boxShadow: '0 0 20px rgba(56,189,248,0.4)'
              }}>
                {profileData.user_info.name[0].toUpperCase()}
              </div>

              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
                  {profileData.user_info.name}
                </h2>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary-cyan)' }}>
                    {profileData.user_info.login_type === 'gmail' ? <Mail size={14} /> : <Phone size={14} />}
                    {profileData.user_info.identifier}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} /> Member Since: {profileData.user_info.member_since ? profileData.user_info.member_since.split(' ')[0] : 'Today'}
                  </span>
                </div>
              </div>
            </div>

            {/* Health & Score Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              
              <div style={{ background: 'rgba(15,23,42,0.9)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <ShieldCheck size={36} className="glow-text-emerald" />
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Security Health Index</span>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-emerald)' }} className="font-mono">
                    {profileData.stats.security_score}% SHIELD
                  </h3>
                </div>
              </div>

              <div style={{ background: 'rgba(15,23,42,0.9)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(56,189,248,0.3)', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <Activity size={36} className="glow-text-cyan" />
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Avg Risk Exposure</span>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-cyan)' }} className="font-mono">
                    {profileData.stats.avg_risk} / 100
                  </h3>
                </div>
              </div>

            </div>

            {/* Threat Detections Breakdown */}
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Historical Threat Interceptions ({profileData.stats.total_scans} Total Scans)
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#fcd34d', textTransform: 'uppercase', display: 'block' }}>Phishing Caught</span>
                <strong style={{ fontSize: '1.4rem', color: '#fff' }} className="font-mono">{profileData.stats.phishing_caught}</strong>
              </div>

              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#fca5a5', textTransform: 'uppercase', display: 'block' }}>Malware Blocked</span>
                <strong style={{ fontSize: '1.4rem', color: '#fff' }} className="font-mono">{profileData.stats.malware_intercepted}</strong>
              </div>

              <div style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#c084fc', textTransform: 'uppercase', display: 'block' }}>DDoS Floods</span>
                <strong style={{ fontSize: '1.4rem', color: '#fff' }} className="font-mono">{profileData.stats.ddos_detected}</strong>
              </div>

              <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#6ee7b7', textTransform: 'uppercase', display: 'block' }}>Clean / Safe Scans</span>
                <strong style={{ fontSize: '1.4rem', color: '#fff' }} className="font-mono">{profileData.stats.clean_links}</strong>
              </div>
            </div>

            {/* Recent Audit Timeline */}
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Recent Detection Timeline
            </h4>

            {profileData.recent_scans.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No threat scans recorded yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {profileData.recent_scans.map((scan) => (
                  <div key={scan.id} style={{ background: 'rgba(15,23,42,0.8)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', display: 'block' }}>
                        {scan.predicted_attack}
                      </span>
                      <span className="font-mono" style={{ fontSize: '0.74rem', color: 'var(--primary-cyan)' }}>
                        {scan.input_text}
                      </span>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span className={`badge badge-${scan.severity.toLowerCase()}`}>
                        {scan.severity}
                      </span>
                      <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                        {scan.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        ) : null}

      </div>
    </div>
  );
}
