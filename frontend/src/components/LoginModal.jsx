import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Mail, Phone, Lock, User, ArrowRight, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function LoginModal() {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [tab, setTab] = useState('gmail'); // 'gmail' or 'mobile'
  
  // Inputs
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Password strength checks
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const isPasswordStrong = hasMinLength && hasUpper && hasNumber && hasSpecial;

  const validateInputs = () => {
    const cleanId = identifier.trim();
    if (!cleanId) {
      return `Please enter your ${tab === 'gmail' ? 'Gmail / Email address' : 'Mobile phone number'}.`;
    }

    if (tab === 'gmail') {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(cleanId)) {
        return "Invalid Email format! Please enter a proper email (e.g. user@gmail.com).";
      }
    } else {
      const cleanPhone = cleanId.replace(/[\s\-()]/g, '');
      const phoneRegex = /^\+?[0-9]{8,15}$/;
      if (!phoneRegex.test(cleanPhone)) {
        return "Invalid Mobile Phone Number format! (Must be 8 to 15 digits).";
      }
    }

    if (isRegister) {
      if (!name.trim()) return "Please enter your full name for registration.";
      if (!isPasswordStrong) {
        return "Password must be at least 8 characters long, include an uppercase letter (A-Z), a number (0-9), and a special character (!@#$%^&*).";
      }
    } else {
      if (!password) return "Please enter your account password.";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valError = validateInputs();
    if (valError) {
      setErrorMsg(valError);
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    let res;
    if (isRegister) {
      res = await register(identifier.trim(), tab, name.trim(), password);
    } else {
      res = await login(identifier.trim(), tab, password);
    }

    setSubmitting(false);
    if (!res.success) {
      setErrorMsg(res.error);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(5, 8, 15, 0.95)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '460px',
        width: '100%',
        padding: '36px 28px',
        position: 'relative',
        boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 40px rgba(56,189,248,0.2)',
        border: '1px solid rgba(56,189,248,0.3)'
      }}>
        
        {/* Top Logo */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            margin: '0 auto 12px auto',
            background: 'linear-gradient(135deg, rgba(56,189,248,0.2), rgba(16,185,129,0.2))',
            borderRadius: '16px',
            border: '1px solid rgba(56,189,248,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldAlert size={32} className="glow-text-cyan" />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
            {isRegister ? 'CREATE ACCOUNT' : 'SECURITY LOGIN'}
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {isRegister ? 'Register your email or mobile with a strong password' : 'Sign in with your Email / Mobile & Password'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: 'rgba(15,23,42,0.9)',
          borderRadius: '10px',
          padding: '4px',
          marginBottom: '20px',
          border: '1px solid var(--border-color)'
        }}>
          <button
            type="button"
            onClick={() => { setTab('gmail'); setErrorMsg(''); setIdentifier(''); setPassword(''); }}
            style={{
              padding: '8px 12px',
              border: 'none',
              borderRadius: '8px',
              background: tab === 'gmail' ? 'linear-gradient(135deg, #0284c7, #0369a1)' : 'transparent',
              color: tab === 'gmail' ? '#fff' : 'var(--text-muted)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <Mail size={14} /> Gmail Login
          </button>

          <button
            type="button"
            onClick={() => { setTab('mobile'); setErrorMsg(''); setIdentifier(''); setPassword(''); }}
            style={{
              padding: '8px 12px',
              border: 'none',
              borderRadius: '8px',
              background: tab === 'mobile' ? 'linear-gradient(135deg, #0284c7, #0369a1)' : 'transparent',
              color: tab === 'mobile' ? '#fff' : 'var(--text-muted)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <Phone size={14} /> Mobile Login
          </button>
        </div>

        {errorMsg && (
          <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#fca5a5', padding: '10px 14px', borderRadius: '8px', fontSize: '0.78rem', marginBottom: '16px' }}>
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {isRegister && (
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="cyber-input"
                  style={{ paddingLeft: '38px' }}
                  placeholder="e.g. Alex Mercer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isRegister}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
              {tab === 'gmail' ? 'Gmail / Email Address:' : 'Mobile Phone Number:'}
            </label>
            <div style={{ position: 'relative' }}>
              {tab === 'gmail' ? (
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              ) : (
                <Phone size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              )}
              <input
                type={tab === 'gmail' ? 'email' : 'tel'}
                className="cyber-input"
                style={{ paddingLeft: '38px' }}
                placeholder={tab === 'gmail' ? 'user@gmail.com' : '+91 9876543210'}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
              Account Password:
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                type="password"
                className="cyber-input"
                style={{ paddingLeft: '38px' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Password Strength Rules on Registration */}
            {isRegister && password.length > 0 && (
              <div style={{ marginTop: '8px', background: 'rgba(15,23,42,0.8)', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.72rem' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Password Requirements:</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                  <span style={{ color: hasMinLength ? 'var(--primary-emerald)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {hasMinLength ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />} 8+ characters
                  </span>
                  <span style={{ color: hasUpper ? 'var(--primary-emerald)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {hasUpper ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />} Uppercase (A-Z)
                  </span>
                  <span style={{ color: hasNumber ? 'var(--primary-emerald)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {hasNumber ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />} Number (0-9)
                  </span>
                  <span style={{ color: hasSpecial ? 'var(--primary-emerald)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {hasSpecial ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />} Special (!@#$)
                  </span>
                </div>
              </div>
            )}
          </div>

          <button type="submit" className="cyber-button" style={{ width: '100%', justifyContent: 'center', marginTop: '6px' }} disabled={submitting}>
            {submitting ? <RefreshCw className="spin" size={16} /> : <ArrowRight size={16} />}
            {submitting ? 'Processing...' : (isRegister ? 'Register Account' : 'Sign In with Password')}
          </button>
        </form>

        {/* Toggle Sign In / Register */}
        <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {isRegister ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setIsRegister(false); setErrorMsg(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--primary-cyan)', fontWeight: 700, cursor: 'pointer' }}
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => { setIsRegister(true); setErrorMsg(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--primary-cyan)', fontWeight: 700, cursor: 'pointer' }}
              >
                Create Account
              </button>
            </span>
          )}
        </div>

      </div>
    </div>
  );
}
