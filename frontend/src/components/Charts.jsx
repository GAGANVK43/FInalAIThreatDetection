import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { Activity, PieChart as PieIcon, TrendingUp } from 'lucide-react';

const categoryColorMap = {
  'DDoS': '#a855f7',
  'Phishing': '#f59e0b',
  'Malware': '#ef4444',
  'Executable Malware Binary': '#ef4444',
  'Ransomware': '#ec4899',
  'SQL Injection': '#38bdf8',
  'Safe / Legitimate Link': '#10b981',
  'Clean & Verified File': '#10b981'
};

export function ThreatTimelineChart({ logs = [] }) {
  const buckets = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
  
  // Initialize multi-category time bucket map
  const timelineMap = {};
  buckets.forEach(b => {
    timelineMap[b] = {
      time: b,
      DDoS: 0,
      Phishing: 0,
      Malware: 0,
      SQL_Injection: 0,
      Ransomware: 0,
      Safe_Links: 0
    };
  });

  const currentHour = new Date().getHours();

  logs.forEach(log => {
    let hour = currentHour;
    if (log.timestamp && log.timestamp.includes(':')) {
      const parts = log.timestamp.split(' ');
      const timePart = parts.length > 1 ? parts[1] : parts[0];
      const parsedHour = parseInt(timePart.split(':')[0], 10);
      if (!isNaN(parsedHour)) hour = parsedHour;
    }

    let bucket = '12:00';
    if (hour < 4) bucket = '00:00';
    else if (hour < 8) bucket = '04:00';
    else if (hour < 12) bucket = '08:00';
    else if (hour < 16) bucket = '12:00';
    else if (hour < 20) bucket = '16:00';
    else bucket = '20:00';

    const cat = (log.predicted_attack || log.attack_type || '').toLowerCase();
    if (cat.includes('ddos')) timelineMap[bucket].DDoS++;
    else if (cat.includes('phish')) timelineMap[bucket].Phishing++;
    else if (cat.includes('malware') || cat.includes('exe')) timelineMap[bucket].Malware++;
    else if (cat.includes('sql')) timelineMap[bucket].SQL_Injection++;
    else if (cat.includes('ransom')) timelineMap[bucket].Ransomware++;
    else if (cat.includes('safe') || cat.includes('clean')) timelineMap[bucket].Safe_Links++;
    else timelineMap[bucket].Malware++;
  });

  const chartData = buckets.map(b => timelineMap[b]);

  return (
    <div className="cyber-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <Activity size={20} className="glow-cyan" />
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>24-Hour Threat Volatility Stream</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {logs.length === 0 ? 'No scan activity recorded yet' : 'Real-time attack volume across major categories from your scans'}
          </p>
        </div>
      </div>

      <div style={{ width: '100%', height: 280 }}>
        {logs.length === 0 ? (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            <Activity size={40} style={{ opacity: 0.3, marginBottom: '8px' }} />
            <span style={{ fontSize: '0.82rem' }}>Timeline will render when you scan payloads</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorDDoS" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPhishing" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorMalware" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSQLi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSafe" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: '#0d1321', borderColor: 'rgba(56,189,248,0.4)', borderRadius: '10px', color: '#fff' }}
                itemStyle={{ fontWeight: 700 }}
                labelStyle={{ color: '#fff', fontWeight: 700 }}
              />
              <Area type="monotone" dataKey="DDoS" stroke="#a855f7" fillOpacity={1} fill="url(#colorDDoS)" stackId="1" />
              <Area type="monotone" dataKey="Phishing" stroke="#f59e0b" fillOpacity={1} fill="url(#colorPhishing)" stackId="1" />
              <Area type="monotone" dataKey="Malware" stroke="#ef4444" fillOpacity={1} fill="url(#colorMalware)" stackId="1" />
              <Area type="monotone" dataKey="SQL_Injection" stroke="#38bdf8" fillOpacity={1} fill="url(#colorSQLi)" stackId="1" />
              <Area type="monotone" dataKey="Safe_Links" stroke="#10b981" fillOpacity={1} fill="url(#colorSafe)" stackId="1" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export function AttackCategoryDonutChart({ logs = [] }) {
  const counts = {};
  logs.forEach(log => {
    const cat = log.predicted_attack || log.attack_type || 'Unknown';
    counts[cat] = (counts[cat] || 0) + 1;
  });

  const categoryData = Object.entries(counts).map(([name, value]) => ({
    name,
    value,
    color: categoryColorMap[name] || '#38bdf8'
  }));

  return (
    <div className="cyber-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <PieIcon size={20} className="glow-emerald" />
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Attack Vector Spectrum</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {logs.length === 0 ? 'No category distribution data' : 'Categorical distribution of your threat scans'}
          </p>
        </div>
      </div>

      <div style={{ width: '100%', height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {logs.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            <PieIcon size={40} style={{ opacity: 0.3, margin: '0 auto 8px' }} />
            <span style={{ fontSize: '0.82rem', display: 'block' }}>No threat category data yet</span>
          </div>
        ) : (
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
              <Tooltip
                contentStyle={{ background: '#0d1321', borderColor: 'rgba(56,189,248,0.4)', borderRadius: '10px', color: '#fff' }}
                itemStyle={{ color: '#38bdf8', fontWeight: 700 }}
                labelStyle={{ color: '#fff', fontWeight: 700 }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export function WeeklyTrendBarChart({ logs = [] }) {
  const dayCounts = { 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0 };

  logs.forEach(() => {
    dayCounts['Wed']++;
  });

  const weeklyData = Object.entries(dayCounts).map(([day, count]) => ({
    day,
    Events: count,
    Mitigated: count
  }));

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
        {logs.length === 0 ? (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            <TrendingUp size={40} style={{ opacity: 0.3, marginBottom: '8px' }} />
            <span style={{ fontSize: '0.82rem' }}>Weekly trends will render when you perform scans</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: '#0d1321', borderColor: 'rgba(56,189,248,0.4)', borderRadius: '10px', color: '#fff' }}
                itemStyle={{ color: '#38bdf8', fontWeight: 700 }}
                labelStyle={{ color: '#fff', fontWeight: 700 }}
              />
              <Legend />
              <Bar dataKey="Events" fill="#0284c7" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Mitigated" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
