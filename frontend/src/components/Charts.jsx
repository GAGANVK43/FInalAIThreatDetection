import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend, LineChart, Line
} from 'recharts';
import { Activity, PieChart as PieIcon, BarChart3, TrendingUp } from 'lucide-react';

const timelineData = [
  { time: '00:00', DDoS: 400, Phishing: 240, Malware: 180, Ransomware: 90 },
  { time: '04:00', DDoS: 300, Phishing: 139, Malware: 220, Ransomware: 110 },
  { time: '08:00', DDoS: 580, Phishing: 480, Malware: 390, Ransomware: 210 },
  { time: '12:00', DDoS: 890, Phishing: 680, Malware: 450, Ransomware: 340 },
  { time: '16:00', DDoS: 720, Phishing: 590, Malware: 380, Ransomware: 290 },
  { time: '20:00', DDoS: 610, Phishing: 420, Malware: 290, Ransomware: 190 },
];

const categoryData = [
  { name: 'DDoS Floods', value: 42100, color: '#ef4444' },
  { name: 'Phishing Links', value: 38200, color: '#f59e0b' },
  { name: 'Malware Payloads', value: 21400, color: '#a855f7' },
  { name: 'Ransomware', value: 12100, color: '#ec4899' },
  { name: 'SQL Injection', value: 11050, color: '#38bdf8' },
];

const weeklyData = [
  { day: 'Mon', Events: 12400, Mitigated: 11900 },
  { day: 'Tue', Events: 15800, Mitigated: 15200 },
  { day: 'Wed', Events: 18900, Mitigated: 18100 },
  { day: 'Thu', Events: 14200, Mitigated: 13800 },
  { day: 'Fri', Events: 21000, Mitigated: 20400 },
  { day: 'Sat', Events: 9800, Mitigated: 9600 },
  { day: 'Sun', Events: 8400, Mitigated: 8300 },
];

export function ThreatTimelineChart() {
  return (
    <div className="cyber-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <Activity size={20} className="glow-cyan" />
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>24-Hour Threat Volatility Stream</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Real-time attack volume across major categories</p>
        </div>
      </div>
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={timelineData}>
            <defs>
              <linearGradient id="colorDDoS" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPhishing" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorMalware" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip contentStyle={{ background: '#0d1321', borderColor: 'rgba(56,189,248,0.3)', borderRadius: '10px' }} />
            <Area type="monotone" dataKey="DDoS" stroke="#ef4444" fillOpacity={1} fill="url(#colorDDoS)" />
            <Area type="monotone" dataKey="Phishing" stroke="#f59e0b" fillOpacity={1} fill="url(#colorPhishing)" />
            <Area type="monotone" dataKey="Malware" stroke="#a855f7" fillOpacity={1} fill="url(#colorMalware)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function AttackCategoryDonutChart() {
  return (
    <div className="cyber-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <PieIcon size={20} className="glow-emerald" />
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Attack Vector Spectrum</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Categorical distribution of threat payloads</p>
        </div>
      </div>
      <div style={{ width: '100%', height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={5}
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: '#0d1321', borderColor: 'rgba(56,189,248,0.3)', borderRadius: '10px' }} />
            <Legend verticalAlign="bottom" height={36} formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>{value}</span>} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function WeeklyTrendBarChart() {
  return (
    <div className="cyber-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <TrendingUp size={20} className="glow-purple" />
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Weekly Incident Mitigation Trend</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Ingested events vs. Automated resolutions</p>
        </div>
      </div>
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip contentStyle={{ background: '#0d1321', borderColor: 'rgba(56,189,248,0.3)', borderRadius: '10px' }} />
            <Legend />
            <Bar dataKey="Events" fill="#0284c7" radius={[6, 6, 0, 0]} />
            <Bar dataKey="Mitigated" fill="#10b981" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
