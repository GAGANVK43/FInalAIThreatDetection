import React, { useState, useEffect } from 'react';
import { Radio, Cpu, HardDrive, Wifi, Activity, ShieldAlert, Server, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LiveMonitoring() {
  const [cpu, setCpu] = useState(38);
  const [ram, setRam] = useState(62);
  const [network, setNetwork] = useState(1450);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(Math.floor(30 + Math.random() * 25));
      setRam(Math.floor(58 + Math.random() * 8));
      setNetwork(Math.floor(1200 + Math.random() * 600));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div className="cyber-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>REAL-TIME SOC TELEMETRY MONITORING</h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Live hardware resource consumption, network bandwidth spikes, and running threat inspections.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(16,185,129,0.15)', padding: '8px 14px', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', fontSize: '0.8rem', fontWeight: 700 }}>
          <div className="radar-pulse"></div> STREAM CONNECTED
        </div>
      </div>

      {/* Resource Telemetry Gauges */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        
        {/* CPU */}
        <div className="cyber-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Cpu size={22} className="glow-cyan" />
              <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>CPU Utilization</span>
            </div>
            <span className="font-mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#38bdf8' }}>{cpu}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${cpu}%`, height: '100%', background: 'linear-gradient(90deg, #0284c7, #38bdf8)', transition: 'width 0.5s' }} />
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '8px', display: 'block' }}>
            8 Core Intel Xeon E5 @ 3.40GHz
          </span>
        </div>

        {/* RAM */}
        <div className="cyber-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <HardDrive size={22} className="glow-purple" />
              <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>RAM Consumption</span>
            </div>
            <span className="font-mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#c084fc' }}>{ram}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${ram}%`, height: '100%', background: 'linear-gradient(90deg, #a855f7, #c084fc)', transition: 'width 0.5s' }} />
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '8px', display: 'block' }}>
            19.8 GB / 32.0 GB Allocated
          </span>
        </div>

        {/* Network */}
        <div className="cyber-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Wifi size={22} className="glow-emerald" />
              <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>Network Bandwidth</span>
            </div>
            <span className="font-mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981' }}>{network} Mbps</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, (network / 2500) * 100)}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #34d399)', transition: 'width 0.5s' }} />
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '8px', display: 'block' }}>
            Peak Throughput 10 Gbps SFP+ Fiber
          </span>
        </div>

      </div>

      {/* Running Background Scans Table */}
      <div className="cyber-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>Active Background Telemetry Workers</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-cyan)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px 14px' }}>PROCESS ID</th>
                <th style={{ padding: '10px 14px' }}>WORKER TASK</th>
                <th style={{ padding: '10px 14px' }}>THREAD TARGET</th>
                <th style={{ padding: '10px 14px' }}>STATUS</th>
                <th style={{ padding: '10px 14px' }}>CPU %</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td className="font-mono" style={{ padding: '10px 14px', color: 'var(--neon-cyan)' }}>PID-8841</td>
                <td style={{ padding: '10px 14px', fontWeight: 700, color: '#fff' }}>XGBoost Live Packet Inspector</td>
                <td className="font-mono" style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>eth0 / 192.168.1.0/24</td>
                <td style={{ padding: '10px 14px', color: '#10b981', fontWeight: 700 }}>RUNNING</td>
                <td className="font-mono" style={{ padding: '10px 14px', color: '#fff' }}>14.2%</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td className="font-mono" style={{ padding: '10px 14px', color: 'var(--neon-cyan)' }}>PID-8842</td>
                <td style={{ padding: '10px 14px', fontWeight: 700, color: '#fff' }}>SHAP Explanation Matrix Generator</td>
                <td className="font-mono" style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Model Inference Queue</td>
                <td style={{ padding: '10px 14px', color: '#10b981', fontWeight: 700 }}>RUNNING</td>
                <td className="font-mono" style={{ padding: '10px 14px', color: '#fff' }}>8.6%</td>
              </tr>
              <tr>
                <td className="font-mono" style={{ padding: '10px 14px', color: 'var(--neon-cyan)' }}>PID-8843</td>
                <td style={{ padding: '10px 14px', fontWeight: 700, color: '#fff' }}>SQLite Audit Log Archiver</td>
                <td className="font-mono" style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>/backend/database.db</td>
                <td style={{ padding: '10px 14px', color: '#38bdf8', fontWeight: 700 }}>IDLE SCAN</td>
                <td className="font-mono" style={{ padding: '10px 14px', color: '#fff' }}>0.4%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
