import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Shield, Mail, Lock, Smartphone, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const { login } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const [loginType, setLoginType] = useState('gmail');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      addNotification('error', 'Validation Error', 'Please enter your credentials');
      return;
    }
    const res = await login(identifier, loginType, password);
    if (res.success) {
      addNotification('success', 'Authentication Granted', 'Welcome back to CYBERSHIELD SOC Console');
      navigate('/dashboard');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at center, rgba(14,165,233,0.15) 0%, rgba(8,12,20,0.95) 70%)',
      padding: '20px'
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="cyber-card"
        style={{
          maxWidth: '440px',
          width: '100%',
          padding: '36px',
          background: 'rgba(13, 19, 33, 0.95)',
          border: '1px solid var(--border-glow)'
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            margin: '0 auto 12px',
            background: 'linear-gradient(135deg, rgba(56,189,248,0.25), rgba(168,85,247,0.25))',
            borderRadius: '16px',
            border: '1px solid rgba(56,189,248,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Shield size={32} className="glow-cyan" />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>CYBER<span className="glow-cyan">SHIELD</span> AI</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Enterprise Security Operations Console
          </p>
        </div>

        {/* Tab Selection */}
        <div style={{ display: 'flex', background: 'rgba(8,12,20,0.8)', padding: '4px', borderRadius: '10px', marginBottom: '20px' }}>
          <button
            onClick={() => setLoginType('gmail')}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: loginType === 'gmail' ? 'rgba(56,189,248,0.2)' : 'transparent',
              color: loginType === 'gmail' ? '#38bdf8' : '#94a3b8'
            }}
          >
            Gmail Account
          </button>
          <button
            onClick={() => setLoginType('mobile')}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: loginType === 'mobile' ? 'rgba(56,189,248,0.2)' : 'transparent',
              color: loginType === 'mobile' ? '#38bdf8' : '#94a3b8'
            }}
          >
            Mobile OTP / SMS
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              {loginType === 'gmail' ? 'Work Email Address' : 'Mobile Phone Number'}
            </label>
            <div style={{ position: 'relative' }}>
              {loginType === 'gmail' ? (
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              ) : (
                <Smartphone size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              )}
              <input
                type={loginType === 'gmail' ? 'email' : 'text'}
                placeholder={loginType === 'gmail' ? 'admin@cyberdefense.sec' : '+1 (555) 019-2834'}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(8,12,20,0.9)',
                  border: '1px solid var(--border-cyan)',
                  color: '#fff',
                  padding: '10px 12px 10px 38px',
                  borderRadius: '10px',
                  fontSize: '0.84rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(8,12,20,0.9)',
                  border: '1px solid var(--border-cyan)',
                  color: '#fff',
                  padding: '10px 38px 10px 38px',
                  borderRadius: '10px',
                  fontSize: '0.84rem',
                  outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '12px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: '#38bdf8' }}
              />
              Remember SOC Session
            </label>
            <a href="#forgot" onClick={(e) => { e.preventDefault(); addNotification('info', 'Password Reset', 'Contact your System Security Administrator.'); }} style={{ color: 'var(--neon-cyan)', textDecoration: 'none' }}>
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            style={{
              marginTop: '10px',
              background: 'linear-gradient(135deg, #0284c7, #0369a1)',
              color: '#fff',
              border: 'none',
              padding: '12px',
              borderRadius: '10px',
              fontSize: '0.9rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(2,132,199,0.3)'
            }}
          >
            Authenticate & Access <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Need new SOC credentials?{' '}
          <Link to="/register" style={{ color: 'var(--neon-cyan)', fontWeight: 700, textDecoration: 'none' }}>
            Request Access
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
