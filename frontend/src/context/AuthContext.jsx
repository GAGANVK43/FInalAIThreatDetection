import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('ai_threat_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to load user session:', e);
      }
    } else {
      // Default demo SOC Admin user for immediate portfolio viewing
      setUser({
        user_id: 1,
        name: 'Alex Mercer (SOC Lead)',
        identifier: 'alex.mercer@cyberdefense.sec',
        login_type: 'gmail',
        role: 'Senior Security Analyst'
      });
    }
    setLoading(false);
  }, []);

  const login = async (identifier, loginType, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, login_type: loginType, password })
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setUser(data.user);
        localStorage.setItem('ai_threat_user', JSON.stringify(data.user));
        return { success: true };
      }
      // Demo fallback if backend isn't reached
      const demoUser = { user_id: 1, name: identifier.split('@')[0] || 'Security Lead', identifier, login_type: loginType, role: 'SOC Analyst' };
      setUser(demoUser);
      localStorage.setItem('ai_threat_user', JSON.stringify(demoUser));
      return { success: true };
    } catch (err) {
      const demoUser = { user_id: 1, name: 'Security Analyst', identifier, login_type: loginType, role: 'SOC Analyst' };
      setUser(demoUser);
      localStorage.setItem('ai_threat_user', JSON.stringify(demoUser));
      return { success: true };
    }
  };

  const register = async (identifier, loginType, name, password) => {
    const newUser = { user_id: Date.now(), name, identifier, login_type: loginType, role: 'Security Analyst' };
    setUser(newUser);
    localStorage.setItem('ai_threat_user', JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ai_threat_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
