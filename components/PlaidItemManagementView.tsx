// components/PlaidItemManagementView.tsx

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";

/**
 * =================================================================================================
 * QUANTUM FINANCIAL - DATA NETWORK CONTROL CENTER (DNCC)
 * =================================================================================================
 * 
 * "The Golden Ticket" Experience.
 * 
 * This component represents the pinnacle of financial data management. 
 * It allows the user to "Test Drive" the capabilities of the Quantum Financial Data Network.
 * 
 * PHILOSOPHY:
 * - Elite Performance: Instant interactions, real-time data simulation.
 * - Security First: Comprehensive audit logging and threat detection simulation.
 * - AI-Driven: Integrated Gemini-3-Flash-Preview for intelligent insights.
 * - "Kick the Tires": Full simulation capabilities for webhooks and data events.
 * 
 * @version 4.0.0-ALPHA-QUANTUM
 * @author James Burvel oCallaghan III (Architect)
 */

// =================================================================================================
// 1. CONFIGURATION & TYPES
// =================================================================================================

const GEMINI_MODEL = "gemini-2.0-flash-exp"; // Using the latest fast model
const DEMO_BANK_NAME = "Quantum Financial";
const APP_VERSION = "v4.2.0 (Sovereign Build)";

// --- Types ---

type Tab = 'overview' | 'applications' | 'security' | 'simulation' | 'audit';
type Severity = 'low' | 'medium' | 'high' | 'critical';
type ConnectionStatus = 'active' | 'degraded' | 'disconnected' | 'syncing';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
  hash: string; // Simulated cryptographic hash
}

interface PlaidProduct {
  name: string;
  status: 'active' | 'inactive' | 'pending';
  lastSync: string;
}

interface ConnectedApp {
  id: string;
  name: string;
  logo: string; // SVG path or URL
  accessLevel: 'read-only' | 'write' | 'admin';
  scopes: string[];
  connectedSince: string;
  dataVolume: string;
  riskScore: number; // 0-100
}

interface SecurityAlert {
  id: string;
  type: string;
  severity: Severity;
  message: string;
  timestamp: string;
  resolved: boolean;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: string;
}

// =================================================================================================
// 2. MOCK DATA GENERATORS (The "Engine")
// =================================================================================================

const generateId = () => Math.random().toString(36).substring(2, 15);

const MOCK_APPS: ConnectedApp[] = [
  {
    id: 'app_venmo_x88',
    name: 'Venmo (Global)',
    logo: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z',
    accessLevel: 'write',
    scopes: ['transactions', 'auth', 'identity'],
    connectedSince: '2023-11-15T08:00:00Z',
    dataVolume: '4.2 GB',
    riskScore: 12,
  },
  {
    id: 'app_robinhood_q99',
    name: 'Robinhood Markets',
    logo: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z',
    accessLevel: 'read-only',
    scopes: ['investments', 'balance'],
    connectedSince: '2024-01-10T14:30:00Z',
    dataVolume: '1.8 GB',
    riskScore: 45,
  },
  {
    id: 'app_turbotax_z11',
    name: 'Intuit TurboTax',
    logo: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z',
    accessLevel: 'read-only',
    scopes: ['transactions', 'liabilities', 'identity'],
    connectedSince: '2024-03-01T09:15:00Z',
    dataVolume: '850 MB',
    riskScore: 5,
  },
];

const MOCK_ALERTS: SecurityAlert[] = [
  { id: 'al_1', type: 'Anomaly', severity: 'medium', message: 'Unusual access pattern detected from IP 192.168.x.x', timestamp: '2024-05-20T10:00:00Z', resolved: false },
  { id: 'al_2', type: 'Policy', severity: 'low', message: 'Data sharing policy updated for "Investments"', timestamp: '2024-05-19T14:20:00Z', resolved: true },
];

// =================================================================================================
// 3. UTILITY FUNCTIONS
// =================================================================================================

const formatDate = (isoString: string) => {
  return new Date(isoString).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
};

const hashString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return '0x' + Math.abs(hash).toString(16).padStart(16, '0');
};

// =================================================================================================
// 4. SUB-COMPONENTS (The "Bells and Whistles")
// =================================================================================================

// --- Icons (SVG) ---
const Icons = {
  Shield: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  Activity: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  Database: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>,
  Cpu: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>,
  Lock: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
  Terminal: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Zap: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  Bot: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Send: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
  AlertTriangle: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  CheckCircle: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  XCircle: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
};

// --- UI Components ---

const QuantumCard: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode; className?: string; action?: React.ReactNode }> = ({ title, icon, children, className = "", action }) => (
  <div className={`bg-gray-900/80 backdrop-blur-md border border-gray-700/50 rounded-xl overflow-hidden shadow-xl ${className}`}>
    <div className="px-6 py-4 border-b border-gray-700/50 flex justify-between items-center bg-gradient-to-r from-gray-900 to-gray-800">
      <div className="flex items-center space-x-3">
        {icon && <div className="text-cyan-400">{icon}</div>}
        <h3 className="text-lg font-semibold text-gray-100 tracking-wide">{title}</h3>
      </div>
      {action && <div>{action}</div>}
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const colors: Record<string, string> = {
    active: 'bg-green-900/30 text-green-400 border-green-500/30',
    inactive: 'bg-gray-700/30 text-gray-400 border-gray-600/30',
    pending: 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30',
    critical: 'bg-red-900/30 text-red-400 border-red-500/30',
    high: 'bg-orange-900/30 text-orange-400 border-orange-500/30',
    medium: 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30',
    low: 'bg-blue-900/30 text-blue-400 border-blue-500/30',
  };
  const style = colors[status.toLowerCase()] || colors.inactive;
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${style} uppercase tracking-wider`}>
      {status}
    </span>
  );
};

const ProgressBar: React.FC<{ value: number; color?: string }> = ({ value, color = "bg-cyan-500" }) => (
  <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
    <div className={`${color} h-1.5 rounded-full transition-all duration-500 ease-out`} style={{ width: `${value}%` }}></div>
  </div>
);

// =================================================================================================
// 5. MAIN COMPONENT
// =================================================================================================

interface PlaidItemManagementViewProps {
  accessToken?: string;
}

export const PlaidItemManagementView: React.FC<PlaidItemManagementViewProps> = ({ accessToken }) => {
  // --- State ---
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [connectedApps, setConnectedApps] = useState<ConnectedApp[]>(MOCK_APPS);
  const [alerts, setAlerts] = useState<SecurityAlert[]>(MOCK_ALERTS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 'msg_init', sender: 'ai', text: `Welcome to ${DEMO_BANK_NAME} Data Network Control. I am Quantum Core, your AI security analyst. How can I assist with your data topology today?`, timestamp: new Date().toISOString() }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [geminiKey, setGeminiKey] = useState<string>(process.env.GEMINI_API_KEY || '');
  
  // Refs for scrolling
  const chatEndRef = useRef<HTMLDivElement>(null);
  const auditEndRef = useRef<HTMLDivElement>(null);

  // --- Helpers ---

  const addAuditLog = useCallback((action: string, details: string) => {
    const newEntry: AuditLogEntry = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      action,
      actor: 'User (Admin)',
      details,
      hash: hashString(action + details + Date.now()),
    };
    setAuditLog(prev => [newEntry, ...prev]);
  }, []);

  const scrollToBottom = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom(chatEndRef);
  }, [chatMessages]);

  // --- AI Integration ---

  const handleAIChat = async () => {
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: generateId(),
      sender: 'user',
      text: chatInput,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    addAuditLog('AI_INTERACTION', `User queried Quantum Core: "${userMsg.text.substring(0, 20)}..."`);

    // Simulate "Thinking"
    const thinkingMsgId = generateId();
    setChatMessages(prev => [...prev, { id: thinkingMsgId, sender: 'ai', text: 'Analyzing neural pathways...', timestamp: new Date().toISOString() }]);

    try {
      let responseText = "I am currently in offline mode. Please provide a valid GEMINI_API_KEY to activate my full cognitive functions.";

      if (geminiKey) {
        const ai = new GoogleGenAI({ apiKey: geminiKey });
        const model = ai.getGenerativeModel({ 
            model: GEMINI_MODEL,
            systemInstruction: `You are Quantum Core, the advanced AI for ${DEMO_BANK_NAME}. You are professional, elite, and concise. You manage financial data integrations. You are currently in a "Test Drive" demo environment. Never mention being an AI language model. Speak as a secure system interface.`
        });
        
        const result = await model.generateContent(userMsg.text);
        responseText = result.response.text();
      } else {
        // Fallback simulation if no key
        await new Promise(r => setTimeout(r, 1500));
        if (userMsg.text.toLowerCase().includes('risk')) responseText = "Based on current heuristics, the risk vector is nominal. App 'Robinhood Markets' shows elevated data throughput, but within tolerance.";
        else if (userMsg.text.toLowerCase().includes('status')) responseText = "All systems operational. Data mesh integrity is at 99.99%. Encryption protocols are active.";
        else responseText = "I've logged that request. As this is a demo environment, I can simulate that action if you navigate to the Simulation tab.";
      }

      setChatMessages(prev => prev.map(msg => msg.id === thinkingMsgId ? { ...msg, text: responseText } : msg));
      addAuditLog('AI_RESPONSE', 'Quantum Core generated response.');

    } catch (error) {
      console.error("AI Error", error);
      setChatMessages(prev => prev.map(msg => msg.id === thinkingMsgId ? { ...msg, text: "Handshake failed. Secure connection to Neural Core interrupted." } : msg));
    }
  };

  // --- Actions ---

  const revokeAccess = (appId: string) => {
    if (window.confirm("CONFIRMATION REQUIRED: Revoking access will immediately sever the data link. This action is logged.")) {
      setConnectedApps(prev => prev.filter(app => app.id !== appId));
      addAuditLog('ACCESS_REVOKED', `Revoked access for App ID: ${appId}`);
      setAlerts(prev => [{ id: generateId(), type: 'Security', severity: 'low', message: `Access revoked for application ${appId}`, timestamp: new Date().toISOString(), resolved: true }, ...prev]);
    }
  };

  const runSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimulationProgress(0);
    addAuditLog('SIMULATION_START', 'Initiated "Red Team" breach simulation protocol.');

    const interval = setInterval(() => {
      setSimulationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSimulating(false);
          addAuditLog('SIMULATION_COMPLETE', 'Simulation finished. No vulnerabilities found.');
          setAlerts(prev => [{ id: generateId(), type: 'System', severity: 'low', message: 'Penetration test completed successfully.', timestamp: new Date().toISOString(), resolved: true }, ...prev]);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  // --- Renderers ---

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <QuantumCard title="Network Health" icon={<Icons.Activity />} className="col-span-2">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-gray-400 text-sm">System Status</p>
            <p className="text-2xl font-bold text-green-400">OPERATIONAL</p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm">Uptime</p>
            <p className="text-xl font-mono text-white">99.999%</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300">API Latency (Global)</span>
              <span className="text-cyan-400">12ms</span>
            </div>
            <ProgressBar value={12} color="bg-cyan-500" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300">Threat Detection Load</span>
              <span className="text-purple-400">45%</span>
            </div>
            <ProgressBar value={45} color="bg-purple-500" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300">Data Throughput</span>
              <span className="text-green-400">1.2 GB/s</span>
            </div>
            <ProgressBar value={78} color="bg-green-500" />
          </div>
        </div>
      </QuantumCard>

      <QuantumCard title="Security Posture" icon={<Icons.Shield />}>
        <div className="flex flex-col items-center justify-center h-full py-4">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full text-gray-700" viewBox="0 0 36 36">
              <path className="text-gray-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2" />
              <path className="text-cyan-500 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]" strokeDasharray="92, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
            <div className="absolute text-center">
              <span className="text-3xl font-bold text-white">92</span>
              <span className="block text-xs text-gray-400">SCORE</span>
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-gray-300">
            Your data perimeter is secure. <br/>
            <span className="text-cyan-400 cursor-pointer hover:underline" onClick={() => setActiveTab('security')}>View 2 Alerts</span>
          </p>
        </div>
      </QuantumCard>

      <QuantumCard title="Active Connections" icon={<Icons.Database />} className="col-span-1 md:col-span-3">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-gray-700">
                <th className="p-4">Application</th>
                <th className="p-4">Access Level</th>
                <th className="p-4">Data Volume</th>
                <th className="p-4">Risk Score</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-300">
              {connectedApps.map(app => (
                <tr key={app.id} className="hover:bg-gray-800/50 transition-colors border-b border-gray-800 last:border-0">
                  <td className="p-4 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d={app.logo} /></svg>
                    </div>
                    <span className="font-medium text-white">{app.name}</span>
                  </td>
                  <td className="p-4"><StatusBadge status={app.accessLevel} /></td>
                  <td className="p-4 font-mono">{app.dataVolume}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-700 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${app.riskScore > 50 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${app.riskScore}%` }}></div>
                      </div>
                      <span className="text-xs">{app.riskScore}</span>
                    </div>
                  </td>
                  <td className="p-4"><span className="flex items-center text-green-400"><span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>Active</span></td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => revokeAccess(app.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20 px-3 py-1 rounded transition-colors text-xs font-medium border border-red-900/30"
                    >
                      REVOKE
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </QuantumCard>
    </div>
  );

  const renderSimulation = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Simulation Lab</h2>
        <p className="text-gray-300 max-w-2xl mx-auto mb-8">
          Test your infrastructure against simulated real-world events. 
          Trigger webhooks, simulate fraud attempts, and stress-test your integration logic in a safe, sandboxed environment.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <button 
            onClick={runSimulation}
            disabled={isSimulating}
            className="group relative overflow-hidden bg-gray-800 hover:bg-gray-700 border border-gray-600 p-6 rounded-lg transition-all text-left"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500 group-hover:h-full transition-all"></div>
            <div className="flex items-center justify-between mb-2">
              <Icons.Shield />
              <span className="text-xs text-red-400 font-mono">RED TEAM</span>
            </div>
            <h3 className="text-lg font-bold text-white">Breach Sim</h3>
            <p className="text-xs text-gray-400 mt-1">Simulate unauthorized access attempt.</p>
          </button>

          <button 
            onClick={() => {
                addAuditLog('WEBHOOK_TEST', 'Triggered TRANSACTIONS_SYNC_UPDATES webhook.');
                setAlerts(prev => [{ id: generateId(), type: 'Webhook', severity: 'low', message: 'Webhook received: TRANSACTIONS_SYNC', timestamp: new Date().toISOString(), resolved: true }, ...prev]);
            }}
            className="group relative overflow-hidden bg-gray-800 hover:bg-gray-700 border border-gray-600 p-6 rounded-lg transition-all text-left"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 group-hover:h-full transition-all"></div>
            <div className="flex items-center justify-between mb-2">
              <Icons.Zap />
              <span className="text-xs text-blue-400 font-mono">WEBHOOKS</span>
            </div>
            <h3 className="text-lg font-bold text-white">Sync Event</h3>
            <p className="text-xs text-gray-400 mt-1">Fire a mock transaction sync webhook.</p>
          </button>

          <button 
            onClick={() => {
                addAuditLog('LATENCY_TEST', 'Injected 5000ms artificial latency.');
                alert("Network latency injected. System may appear slow for 5 seconds.");
            }}
            className="group relative overflow-hidden bg-gray-800 hover:bg-gray-700 border border-gray-600 p-6 rounded-lg transition-all text-left"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500 group-hover:h-full transition-all"></div>
            <div className="flex items-center justify-between mb-2">
              <Icons.Activity />
              <span className="text-xs text-yellow-400 font-mono">STRESS TEST</span>
            </div>
            <h3 className="text-lg font-bold text-white">Load Spike</h3>
            <p className="text-xs text-gray-400 mt-1">Simulate 10x traffic surge.</p>
          </button>
        </div>

        {isSimulating && (
          <div className="mt-8 max-w-md mx-auto">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Running Heuristics...</span>
              <span>{simulationProgress}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <div className="bg-red-500 h-full transition-all duration-100" style={{ width: `${simulationProgress}%` }}></div>
            </div>
            <div className="mt-2 font-mono text-xs text-red-400 animate-pulse">
              > INJECTING SQL VECTORS... BLOCKED<br/>
              > ATTEMPTING XSS... BLOCKED<br/>
              > BRUTE FORCE AUTH... MITIGATED
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderAuditLog = () => (
    <QuantumCard title="Immutable Audit Ledger" icon={<Icons.Terminal />}>
      <div className="h-[500px] overflow-y-auto font-mono text-xs bg-black/50 p-4 rounded-lg border border-gray-800">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-black/90 text-gray-500 border-b border-gray-800">
            <tr>
              <th className="pb-2">TIMESTAMP</th>
              <th className="pb-2">ACTOR</th>
              <th className="pb-2">ACTION</th>
              <th className="pb-2">DETAILS</th>
              <th className="pb-2 text-right">HASH</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {auditLog.map(log => (
              <tr key={log.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                <td className="py-2 pr-4 text-gray-500 whitespace-nowrap">{formatDate(log.timestamp)}</td>
                <td className="py-2 pr-4 text-cyan-600">{log.actor}</td>
                <td className="py-2 pr-4 font-bold text-white">{log.action}</td>
                <td className="py-2 pr-4 text-gray-400">{log.details}</td>
                <td className="py-2 text-right text-gray-600 truncate max-w-[100px]" title={log.hash}>{log.hash}</td>
              </tr>
            ))}
            <div ref={auditEndRef} />
          </tbody>
        </table>
        {auditLog.length === 0 && (
          <div className="text-center text-gray-600 py-10">
            -- NO AUDIT RECORDS FOUND --
          </div>
        )}
      </div>
    </QuantumCard>
  );

  // --- Main Layout ---

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-cyan-500/30">
      {/* Top Bar */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <span className="font-bold text-white text-lg">Q</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">{DEMO_BANK_NAME}</h1>
              <p className="text-xs text-gray-400 tracking-widest uppercase">Data Network Control Center</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-2 text-xs font-mono text-gray-500">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>SYSTEM ONLINE</span>
              <span className="text-gray-700">|</span>
              <span>{APP_VERSION}</span>
            </div>
            <div className="flex items-center space-x-3">
                <button className="p-2 text-gray-400 hover:text-white transition-colors relative">
                    <Icons.AlertTriangle />
                    {alerts.filter(a => !a.resolved).length > 0 && (
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                </button>
                <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs font-bold text-cyan-500">
                    JB
                </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation Tabs */}
        <nav className="flex space-x-1 bg-gray-900/50 p-1 rounded-xl mb-8 border border-gray-800 w-fit">
          {(['overview', 'applications', 'security', 'simulation', 'audit'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                  setActiveTab(tab);
                  addAuditLog('NAVIGATE', `User switched to tab: ${tab.toUpperCase()}`);
              }}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize
                ${activeTab === tab 
                  ? 'bg-gray-800 text-white shadow-lg shadow-black/20' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'}
              `}
            >
              {tab}
            </button>
          ))}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'applications' && (
                <QuantumCard title="Connected Applications" icon={<Icons.Database />}>
                    <p className="text-gray-400 mb-4">Manage third-party access to your financial data lake.</p>
                    {/* Re-using the table from overview but expanded logic could go here */}
                    {renderOverview()} 
                </QuantumCard>
            )}
            {activeTab === 'security' && (
                <QuantumCard title="Security Alerts" icon={<Icons.Shield />}>
                    <div className="space-y-4">
                        {alerts.map(alert => (
                            <div key={alert.id} className={`p-4 rounded-lg border ${alert.resolved ? 'border-gray-800 bg-gray-900/50 opacity-50' : 'border-red-900/50 bg-red-900/10'}`}>
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center space-x-3">
                                        {alert.resolved ? <Icons.CheckCircle /> : <Icons.AlertTriangle />}
                                        <div>
                                            <h4 className={`font-bold ${alert.resolved ? 'text-gray-400' : 'text-red-400'}`}>{alert.type} Alert</h4>
                                            <p className="text-sm text-gray-300">{alert.message}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-mono text-gray-500">{formatDate(alert.timestamp)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </QuantumCard>
            )}
            {activeTab === 'simulation' && renderSimulation()}
            {activeTab === 'audit' && renderAuditLog()}
          </div>

          {/* AI Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <QuantumCard title="Quantum Core" icon={<Icons.Bot />} className="h-[600px] flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                  {chatMessages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`
                        max-w-[85%] rounded-2xl px-4 py-3 text-sm
                        ${msg.sender === 'user' 
                          ? 'bg-cyan-600 text-white rounded-br-none' 
                          : 'bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700'}
                      `}>
                        {msg.text}
                        <div className="mt-1 text-[10px] opacity-50 text-right">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                
                <div className="relative">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAIChat()}
                    placeholder="Ask Quantum Core..."
                    className="w-full bg-gray-950 border border-gray-700 rounded-xl pl-4 pr-10 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                  <button 
                    onClick={handleAIChat}
                    className="absolute right-2 top-2 p-1.5 text-cyan-500 hover:text-cyan-400 hover:bg-cyan-900/20 rounded-lg transition-colors"
                  >
                    <Icons.Send />
                  </button>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-800">
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-2 block">Gemini API Key (Optional)</label>
                    <input 
                        type="password" 
                        value={geminiKey}
                        onChange={(e) => setGeminiKey(e.target.value)}
                        placeholder="Enter key for live AI..."
                        className="w-full bg-gray-900 border border-gray-800 rounded px-2 py-1 text-xs text-gray-400 focus:border-gray-600 focus:outline-none"
                    />
                </div>
              </QuantumCard>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default PlaidItemManagementView;