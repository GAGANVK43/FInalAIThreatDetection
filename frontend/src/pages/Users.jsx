import React, { useState } from 'react';
import { Users as UsersIcon, UserPlus, Shield, Trash2, Edit, CheckCircle } from 'lucide-react';
import Modal from '../components/Modal';
import { useNotification } from '../context/NotificationContext';

export default function Users() {
  const { addNotification } = useNotification();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('Senior SOC Analyst');

  const [usersList, setUsersList] = useState([
    { id: 1, name: 'Alex Mercer', email: 'alex.mercer@cyberdefense.sec', role: 'SOC Lead Analyst', status: 'ACTIVE', lastActive: '2 mins ago' },
    { id: 2, name: 'Sarah Connor', email: 'sarah.c@cyberdefense.sec', role: 'Incident Responder', status: 'ACTIVE', lastActive: '15 mins ago' },
    { id: 3, name: 'Marcus Vance', email: 'marcus.v@cyberdefense.sec', role: 'ML Security Engineer', status: 'ACTIVE', lastActive: '1 hour ago' },
    { id: 4, name: 'Elena Rostova', email: 'elena.r@cyberdefense.sec', role: 'Threat Hunter', status: 'OFFLINE', lastActive: '2 days ago' }
  ]);

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!userName || !userEmail) return;
    const newUser = {
      id: Date.now(),
      name: userName,
      email: userEmail,
      role: userRole,
      status: 'ACTIVE',
      lastActive: 'Just now'
    };
    setUsersList([...usersList, newUser]);
    setIsAddOpen(false);
    setUserName('');
    setUserEmail('');
    addNotification('success', 'User Added', `Created SOC profile for ${userName}`);
  };

  const handleDeleteUser = (id, name) => {
    setUsersList(usersList.filter(u => u.id !== id));
    addNotification('info', 'User Revoked', `Revoked access for ${name}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div className="cyber-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <UsersIcon size={28} className="glow-purple" />
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>SOC USER & ROLE MANAGEMENT</h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Manage SOC analyst access privileges, RBAC permissions, and team credentials.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          style={{
            background: 'linear-gradient(135deg, #a855f7, #7e22ce)',
            color: '#fff',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '10px',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <UserPlus size={16} /> Provision New SOC Analyst
        </button>
      </div>

      {/* Table */}
      <div className="cyber-card" style={{ padding: '24px' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-cyan)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 14px' }}>ANALYST NAME</th>
                <th style={{ padding: '12px 14px' }}>WORK EMAIL</th>
                <th style={{ padding: '12px 14px' }}>ASSIGNED RBAC ROLE</th>
                <th style={{ padding: '12px 14px' }}>STATUS</th>
                <th style={{ padding: '12px 14px' }}>LAST SESSION</th>
                <th style={{ padding: '12px 14px' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((usr) => (
                <tr key={usr.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#fff' }}>{usr.name}</td>
                  <td className="font-mono" style={{ padding: '12px 14px', color: 'var(--neon-cyan)' }}>{usr.email}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ background: 'rgba(168,85,247,0.15)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.3)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>
                      {usr.role}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ color: usr.status === 'ACTIVE' ? '#10b981' : '#94a3b8', fontWeight: 700, fontSize: '0.74rem' }}>
                      ● {usr.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-muted)', fontSize: '0.76rem' }}>{usr.lastActive}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <button
                      onClick={() => handleDeleteUser(usr.id, usr.name)}
                      style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Provision New Analyst Credential">
        <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Full Name</label>
            <input
              type="text"
              placeholder="e.g. David Vance"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              style={{ width: '100%', background: 'rgba(8,12,20,0.9)', border: '1px solid var(--border-cyan)', color: '#fff', padding: '8px 12px', borderRadius: '8px', fontSize: '0.84rem', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Work Email</label>
            <input
              type="email"
              placeholder="david.vance@cyberdefense.sec"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              style={{ width: '100%', background: 'rgba(8,12,20,0.9)', border: '1px solid var(--border-cyan)', color: '#fff', padding: '8px 12px', borderRadius: '8px', fontSize: '0.84rem', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '6px' }}>RBAC Role</label>
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              style={{ width: '100%', background: 'rgba(8,12,20,0.9)', border: '1px solid var(--border-cyan)', color: '#fff', padding: '8px 12px', borderRadius: '8px', fontSize: '0.84rem', outline: 'none' }}
            >
              <option value="Senior SOC Analyst">Senior SOC Analyst</option>
              <option value="SOC Lead Analyst">SOC Lead Analyst</option>
              <option value="Incident Responder">Incident Responder</option>
              <option value="ML Security Engineer">ML Security Engineer</option>
              <option value="Threat Hunter">Threat Hunter</option>
            </select>
          </div>

          <button
            type="submit"
            style={{ marginTop: '10px', background: 'linear-gradient(135deg, #a855f7, #7e22ce)', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer' }}
          >
            Create Credentials
          </button>
        </form>
      </Modal>

    </div>
  );
}
