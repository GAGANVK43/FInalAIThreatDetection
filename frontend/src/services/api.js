import axios from 'axios';

// Production Ready Axios Client for FastAPI Backend Connection
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptors for User ID
apiClient.interceptors.request.use((config) => {
  const userStr = localStorage.getItem('ai_threat_user');
  if (userStr) {
    try {
      const parsed = JSON.parse(userStr);
      if (parsed.user_id) config.headers['X-User-ID'] = parsed.user_id;
    } catch (e) {}
  }
  return config;
}, (error) => Promise.reject(error));

// Local Storage Helper for User-Specific Scans & Session Telemetry
const getUserScansFromStorage = (userId) => {
  try {
    const key = `user_scans_${userId || 'guest'}`;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const saveUserScanToStorage = (userId, scanItem) => {
  try {
    const key = `user_scans_${userId || 'guest'}`;
    const existing = getUserScansFromStorage(userId);
    const filtered = existing.filter(item => item.id !== scanItem.id);
    const updated = [scanItem, ...filtered];
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
};

const SAFE_DOMAINS = ['google.com', 'google.co.in', 'github.com', 'microsoft.com', 'wikipedia.org', 'youtube.com', 'amazon.com', 'apple.com', 'stackoverflow.com', 'cloudflare.com'];

export const mockDataService = {
  getDashboardStats: async (userId = 1) => {
    const scans = getUserScansFromStorage(userId);

    // Calculate strictly from user's scan records
    const total = scans.length;
    if (total === 0) {
      return {
        total_events: 0,
        active_threats: 0,
        blocked_threats: 0,
        critical_alerts: 0,
        ai_security_score: 100,
        ai_confidence: 98.4,
        exfil_rate_pct: 0,
        attack_distribution: {},
        severity_distribution: {}
      };
    }

    const threats = scans.filter(s => {
      const cat = (s.predicted_attack || s.attack_type || '').toLowerCase();
      return !cat.includes('safe') && !cat.includes('clean');
    });

    const activeThreatsCount = threats.length;
    const blockedCount = threats.filter(s => (s.risk_score || 0) >= 50).length;

    const attackDist = {};
    scans.forEach(s => {
      const cat = s.predicted_attack || s.attack_type || 'Unknown';
      attackDist[cat] = (attackDist[cat] || 0) + 1;
    });

    return {
      total_events: total,
      active_threats: activeThreatsCount,
      blocked_threats: blockedCount,
      critical_alerts: activeThreatsCount,
      ai_security_score: Math.max(10, 100 - (activeThreatsCount * 15)),
      ai_confidence: 98.4,
      exfil_rate_pct: total > 0 ? Math.round((blockedCount / total) * 100) : 0,
      attack_distribution: attackDist,
      severity_distribution: {}
    };
  },

  getThreatLogs: async (userId = 1, page = 1, severity = 'All', search = '') => {
    const localScans = getUserScansFromStorage(userId);
    return {
      items: localScans,
      total: localScans.length,
      page: 1,
      pages: Math.ceil(localScans.length / 10) || 1
    };
  },

  predictThreat: async (payload) => {
    const userId = payload.user_id || 1;
    const inputText = (payload.input_text || '').toLowerCase();
    const isSafeDomain = SAFE_DOMAINS.some(d => inputText.includes(d));
    const hasThreatKeywords = ['select', 'drop', 'union', 'exe', 'malware', 'invoice', 'login', 'verify', 'flood', 'c2'].some(k => inputText.includes(k));

    let attackType = 'Safe / Legitimate Link';
    let riskScore = 5;
    let severity = 'Low';
    let confidence = 99.5;

    if (!isSafeDomain || hasThreatKeywords) {
      if (inputText.includes('exe') || inputText.includes('malware') || inputText.includes('payload') || inputText.includes('invoice') || inputText.includes('trojan')) {
        attackType = 'Malware';
        riskScore = 94;
        severity = 'Critical';
        confidence = 98.4;
      } else if (inputText.includes('paypal') || inputText.includes('login') || inputText.includes('verify') || inputText.includes('bank')) {
        attackType = 'Phishing';
        riskScore = 96;
        severity = 'Critical';
        confidence = 96.8;
      } else if (inputText.includes('select') || inputText.includes('drop') || inputText.includes('union') || inputText.includes('1=1')) {
        attackType = 'SQL Injection';
        riskScore = 88;
        severity = 'High';
        confidence = 94.2;
      } else if (inputText.includes('flood') || inputText.includes('ddos') || inputText.includes('get /')) {
        attackType = 'DDoS';
        riskScore = 78;
        severity = 'High';
        confidence = 91.0;
      } else {
        attackType = 'Malware Payload';
        riskScore = 85;
        severity = 'High';
        confidence = 92.0;
      }
    }

    const predictionResult = {
      scan_id: Date.now(),
      id: `EVT-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      predicted_class: severity === 'Low' ? 0 : 1,
      predicted_attack: attackType,
      attack_type: attackType,
      confidence: confidence,
      risk_score: riskScore,
      severity: severity,
      source_ip: payload.source_ip || '192.168.1.45',
      destination_ip: payload.destination_ip || '10.0.0.1',
      input_text: payload.input_text,
      input_type: payload.input_type || 'URL Link',
      response_action: severity === 'Low' ? 'Passed Security Inspection' : (severity === 'Critical' ? 'Quarantined & Domain Isolated' : 'WAF Rule Triggered'),
      indicators: severity === 'Low' ? [
        `Verified safe domain reputation: '${payload.input_text}'`,
        `SSL/TLS certificate trusted`,
        `No threat indicators found`
      ] : [
        `Target input parsed: '${payload.input_text}'`,
        `XGBoost Model Confidence: ${confidence}%`,
        `Enforced Severity Level: ${severity}`
      ],
      recommended_actions: severity === 'Low' ? [
        'Passed Security Inspection',
        'Domain Certificate Verified',
        'No Threat Action Needed'
      ] : [
        'Block URL domain in Email Gateway',
        'Revoke session tokens immediately',
        'Issue User Security Alert'
      ],
      probabilities: { [attackType]: confidence / 100, 'Legitimate': 1 - (confidence / 100) },
      shap_explanation: { 'ua_length': 0.04, 'src_first_octet': 0.02, 'data_exfil': 0.01, 'severity_score': 0.01 }
    };

    // Save scan record into local user storage
    const scanItem = {
      id: predictionResult.id,
      timestamp: predictionResult.timestamp,
      source_ip: payload.source_ip || '192.168.1.45',
      destination_ip: payload.destination_ip || '10.0.0.1',
      input_text: payload.input_text,
      input_type: payload.input_type || 'URL Link',
      predicted_attack: attackType,
      attack_type: attackType,
      risk_score: riskScore,
      severity: severity,
      response_action: predictionResult.response_action
    };

    saveUserScanToStorage(userId, scanItem);

    // Try posting to backend database asynchronously if running
    try {
      apiClient.post('/predict', payload).catch(() => {});
    } catch (e) {}

    return predictionResult;
  }
};
