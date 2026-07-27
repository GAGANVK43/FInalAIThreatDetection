import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const API_BASE_URL = 'http://127.0.0.1:8000';

async function apiFetch(path, options) {
  try {
    const res = await fetch(path, options);
    return res;
  } catch (err) {
    // Fallback to absolute URL if relative proxy fails
    const fullUrl = API_BASE_URL + path;
    console.log(`[API Fetch Fallback] Trying ${fullUrl}`);
    const res = await fetch(fullUrl, options);
    return res;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('ai_threat_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse stored user:', e);
      }
    }
    setLoading(false);
  }, []);

  const login = async (identifier, loginType, password) => {
    try {
      const res = await apiFetch('/api/auth/login', {
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
      return { success: false, error: data.detail || 'Login failed' };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: 'Cannot connect to backend server (127.0.0.1:8000). Please check server.' };
    }
  };

  const register = async (identifier, loginType, name, password) => {
    try {
      const res = await apiFetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, login_type: loginType, name, password })
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setUser(data.user);
        localStorage.setItem('ai_threat_user', JSON.stringify(data.user));
        return { success: true };
      }
      return { success: false, error: data.detail || 'Registration failed' };
    } catch (err) {
      console.error('Register error:', err);
      return { success: false, error: 'Cannot connect to backend server (127.0.0.1:8000). Please check server.' };
    }
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
