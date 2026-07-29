import React, { createContext, useContext, useState } from 'react';
import { ShieldAlert, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addNotification = (type, title, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeNotification(id);
    }, 4500);
  };

  const removeNotification = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification }}>
      {children}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 99999, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="cyber-card"
              style={{
                minWidth: '320px',
                padding: '14px 18px',
                background: 'rgba(13, 19, 33, 0.95)',
                border: toast.type === 'error' ? '1px solid rgba(239,68,68,0.5)' : (toast.type === 'success' ? '1px solid rgba(16,185,129,0.5)' : '1px solid rgba(56,189,248,0.5)'),
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}
            >
              {toast.type === 'error' && <ShieldAlert size={20} className="glow-red" />}
              {toast.type === 'success' && <CheckCircle size={20} className="glow-emerald" />}
              {toast.type === 'warning' && <AlertTriangle size={20} style={{ color: '#f59e0b' }} />}
              {toast.type === 'info' && <Info size={20} className="glow-cyan" />}

              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{toast.title}</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>{toast.message}</p>
              </div>

              <button onClick={() => removeNotification(toast.id)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}
