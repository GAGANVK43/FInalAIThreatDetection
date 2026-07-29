import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Shield, Mail, Lock, User as UserIcon, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Register() {
  const { register } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // Password Requirements Checks
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const isPasswordValid = hasMinLength && hasUpper && hasNumber && hasSpecial;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !identifier || !password) {
      addNotification('error', 'Form Error', 'Please complete all required fields');
      return;
    }
    if (!isPasswordValid) {
      addNotification('error', 'Weak Password', 'Password does not satisfy security guidelines');
      return;
    }
    await register(identifier, 'gmail', name, password);
    addNotification('success', 'Account Registered', 'Your SOC analyst profile has been activated');
    navigate('/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at center, rgba(168,85,247,0.15) 0%, rgba(8,12,20,0.95) 70%)',
      padding: '20px'
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="cyber-card"
        style={{
          maxWidth: '460px',
          width: '100%',
          padding: '36px',
          background: 'rgba(13, 19, 33, 0.95)',
          border: '1px solid var(--border-glow)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            margin: '0 auto 12px',
            background: 'linear-gradient(135deg, rgba(168,85,247,0.25), rgba(56,189,248,0.25))',
            borderRadius: '16px',
            border: '1px solid rgba(168,85,247,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Shield size={32} className="glow-purple" />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>REGISTER <span className="glow-purple">SOC PROFILE</span></h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Initialize Security Operations Access Credentials
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              Full Analyst Name
            </label>
            <div style={{ position: 'relative' }}>
              <UserIcon size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Alex Mercer"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
              Work Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                type="email"
                placeholder="alex.mercer@cyberdefense.sec"
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
              Create Master Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          {/* Password Checklist */}
          <div style={{ background: 'rgba(8,12,20,0.8)', padding: '12px', borderRadius: '10px', fontSize: '0.74rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: 600, marginBottom: '2px' }}>Security Strength Checklist:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: hasMinLength ? '#10b981' : '#94a3b8' }}>
              {hasMinLength ? <CheckCircle2 size={14} /> : <XCircle size={14} />} At least 8 characters long
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: hasUpper ? '#10b981' : '#94a3b8' }}>
              {hasUpper ? <CheckCircle2 size={14} /> : <XCircle size={14} />} At least one uppercase letter (A-Z)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: hasNumber ? '#10b981' : '#94a3b8' }}>
              {hasNumber ? <CheckCircle2 size={14} /> : <XCircle size={14} />} At least one numeric digit (0-9)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: hasSpecial ? '#10b981' : '#94a3b8' }}>
              {hasSpecial ? <CheckCircle2 size={14} /> : <XCircle size={14} />} At least one special symbol (!@#$%^&*)
            </div>
          </div>

          <button
            type="submit"
            style={{
              marginTop: '10px',
              background: 'linear-gradient(135deg, #a855f7, #7e22ce)',
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
              boxShadow: '0 4px 15px rgba(168,85,247,0.3)'
            }}
          >
            Create SOC Account <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Already registered?{' '}
          <Link to="/login" style={{ color: 'var(--neon-purple)', fontWeight: 700, textDecoration: 'none' }}>
            Sign In Here
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
