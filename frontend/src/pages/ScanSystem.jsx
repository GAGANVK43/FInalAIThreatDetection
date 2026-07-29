import React from 'react';
import ScanProgress from '../components/ScanProgress';
import { ShieldCheck, Cpu, HardDrive, Network, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ScanSystem() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div className="cyber-card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>SYSTEM SCAN & BINARY ANALYSIS</h2>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Execute automated deep memory inspection, network packet heuristics, and binary file sandbox evaluation.
        </p>
      </div>

      {/* Main Drag & Drop Sandbox Scanner */}
      <ScanProgress />

      {/* Auxiliary Scanner Telemetry Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        
        <div className="cyber-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <Cpu size={22} className="glow-cyan" />
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Kernel Memory Sandbox</h4>
              <span style={{ fontSize: '0.72rem', color: 'var(--neon-emerald)' }}>Engine Status: READY</span>
            </div>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Monitors process memory allocation for buffer overflow attempts and DLL injection.
          </p>
        </div>

        <div className="cyber-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <Network size={22} className="glow-purple" />
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Packet Heuristic Inspector</h4>
              <span style={{ fontSize: '0.72rem', color: 'var(--neon-emerald)' }}>Engine Status: ACTIVE</span>
            </div>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Parses raw PCAP network frames to detect C2 heartbeats and TCP SYN flood anomalies.
          </p>
        </div>

        <div className="cyber-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <HardDrive size={22} className="glow-emerald" />
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>File Integrity Monitor</h4>
              <span style={{ fontSize: '0.72rem', color: 'var(--neon-emerald)' }}>Engine Status: MONITORING</span>
            </div>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Real-time hash validation (SHA-256) across critical system executables and DLLs.
          </p>
        </div>

      </div>

    </div>
  );
}
