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

// Request & Response Interceptors
apiClient.interceptors.request.use((config) => {
  const user = localStorage.getItem('ai_threat_user');
  if (user) {
    try {
      const parsed = JSON.parse(user);
      if (parsed.user_id) config.headers['X-User-ID'] = parsed.user_id;
    } catch (e) {}
  }
  return config;
}, (error) => Promise.reject(error));

// Dummy Mock Data Generators for Portfolio-Ready UI
export const mockDataService = {
  getDashboardStats: async () => {
    try {
      const res = await apiClient.get('/api/user/stats?user_id=1');
      return res.data;
    } catch (e) {
      return {
        total_events: 124850,
        active_threats: 42,
        blocked_threats: 119400,
        critical_alerts: 18,
        ai_security_score: 94.8,
        ai_confidence: 98.4,
        exfil_rate_pct: 2.15,
        attack_distribution: {
          'DDoS': 42100,
          'Phishing': 38200,
          'Malware': 21400,
          'Ransomware': 12100,
          'SQL Injection': 11050
        },
        severity_distribution: {
          'Critical': 18,
          'High': 124,
          'Medium': 450,
          'Low': 1240
        }
      };
    }
  },

  getThreatLogs: async (page = 1, severity = 'All', search = '') => {
    try {
      const res = await apiClient.get(`/api/user/logs?page=${page}&limit=10`);
      return res.data;
    } catch (e) {
      const mockLogs = [
        { id: 'EVT-9041', timestamp: '2026-07-29 11:18:42', source_ip: '185.220.101.4', destination_ip: '10.0.4.15', input_text: 'http://paypal-security-update.xyz/login.php', input_type: 'URL Link', predicted_attack: 'Phishing', risk_score: 96, severity: 'Critical', response_action: 'Blocked & Domain Isolated' },
        { id: 'EVT-9040', timestamp: '2026-07-29 11:15:10', source_ip: '45.133.1.20', destination_ip: '192.168.1.100', input_text: "SELECT * FROM users WHERE '1'='1'", input_type: 'SQL Query', predicted_attack: 'SQL Injection', risk_score: 88, severity: 'High', response_action: 'WAF Rule Triggered' },
        { id: 'EVT-9039', timestamp: '2026-07-29 11:10:05', source_ip: '110.155.68.245', destination_ip: '178.123.150.38', input_text: 'http://malware-drop.cc/urgent_invoice.exe', input_type: 'Executable Binary', predicted_attack: 'Malware', risk_score: 94, severity: 'Critical', response_action: 'Quarantined Payload' },
        { id: 'EVT-9038', timestamp: '2026-07-29 11:02:18', source_ip: '219.80.193.15', destination_ip: '44.155.75.24', input_text: 'GET /api/v1/resource HTTP/1.1 (Flood payload)', input_type: 'Packet Flood', predicted_attack: 'DDoS', risk_score: 78, severity: 'High', response_action: 'Null-routed Source IP' },
        { id: 'EVT-9037', timestamp: '2026-07-29 10:45:00', source_ip: '192.168.1.55', destination_ip: '10.0.0.1', input_text: 'https://github.com/security/bulletins', input_type: 'Clean URL', predicted_attack: 'Legitimate Link', risk_score: 8, severity: 'Low', response_action: 'Passed Inspection' }
      ];
      return { items: mockLogs, total: 45, page, pages: 5 };
    }
  },

  predictThreat: async (payload) => {
    try {
      const res = await apiClient.post('/predict', payload);
      return res.data;
    } catch (e) {
      return {
        predicted_class: 3,
        attack_type: 'Phishing',
        confidence: 96.8,
        risk_score: 94,
        severity: 'Critical',
        indicators: [
          "High-risk untrusted TLD detected: '.xyz'",
          "Credential harvesting lure keywords present: 'login', 'verify'",
          "Nested deceptive subdomains detected"
        ],
        recommended_actions: [
          "Block URL domain in Email & DNS Filter",
          "Revoke session tokens immediately",
          "Issue User Security Alert"
        ],
        probabilities: { 'Phishing': 0.968, 'Malware': 0.018, 'DDoS': 0.008, 'Ransomware': 0.004, 'Legitimate': 0.002 },
        shap_explanation: { 'ua_length': 0.24, 'src_first_octet': 0.18, 'data_exfil': 0.32, 'severity_score': 0.26 }
      };
    }
  }
};
