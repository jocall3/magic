import React, { useState, useEffect, useMemo, useContext, useRef, useCallback } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { 
  Activity, 
  Clock, 
  ShieldCheck, 
  DollarSign, 
  Sparkles, 
  Zap, 
  Gauge, 
  MessageSquare, 
  Send, 
  ShieldAlert, 
  Lock, 
  Key, 
  Database, 
  Cpu, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw, 
  Terminal,
  Layers,
  Fingerprint,
  Globe,
  CreditCard,
  Wallet,
  History,
  Settings,
  Eye,
  EyeOff,
  ChevronRight,
  Plus,
  Download,
  Share2,
  Trash2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

/**
 * QUANTUM FINANCIAL NEXUS - ACCOUNT CORE
 * 
 * PHILOSOPHY: 
 * - "Golden Ticket" Experience.
 * - High-Performance Financial Engine.
 * - Homomorphic Encryption Simulation for Key Storage.
 * - Integrated AI Pilot (Gemini 3 Flash).
 * - Real-time Audit Logging.
 */

// --- TYPES & INTERFACES ---

interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  severity: 'INFO' | 'WARN' | 'CRITICAL';
  metadata: any;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  type?: 'text' | 'action' | 'data';
}

interface EncryptedKey {
  id: string;
  label: string;
  cipher: string; // Simulated homomorphic cipher
  checksum: string;
  createdAt: string;
}

interface AccountDetailsProps {
  customerId: string;
  accountId: string;
}

// --- UTILITIES: CRYPTO & AUDIT ---

/**
 * SIMULATED HOMOMORPHIC ENCRYPTION ENGINE
 * In a real production environment, this would use libraries like Microsoft SEAL or Concrete.
 * For this "Golden Ticket" demo, we simulate the ability to perform operations on encrypted data.
 */
const QuantumVault = {
  encrypt: (data: string): string => {
    const b64 = btoa(data);
    return `HE_V1_${b64.split('').reverse().join('')}_SIG_${Math.random().toString(36).substring(7)}`;
  },
  decrypt: (cipher: string): string => {
    if (!cipher.startsWith('HE_V1_')) return 'INVALID_CIPHER';
    const core = cipher.split('_')[2];
    return atob(core.split('').reverse().join(''));
  },
  // Simulated homomorphic check: verify key without decrypting
  verifyIntegrity: (cipher: string): boolean => {
    return cipher.includes('_SIG_') && cipher.length > 20;
  }
};

// --- MAIN COMPONENT ---

const AccountDetails: React.FC<AccountDetailsProps> = ({ customerId, accountId }) => {
  const context = useContext(DataContext);
  
  // -- STATE MANAGEMENT --
  const [balanceHistory, setBalanceHistory] = useState<{ date: string; balance: number; volume: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>([]);
  const [vaultKeys, setVaultKeys] = useState<EncryptedKey[]>([]);
  const [showVault, setShowVault] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'security' | 'audit'>('overview');
  
  // Modals
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // -- MEMOIZED DATA --
  const account = useMemo(() => {
    return context?.linkedAccounts.find(a => a.id === accountId) || context?.linkedAccounts[0];
  }, [context, accountId]);

  // -- AUDIT LOGGING --
  const logAction = useCallback((action: string, severity: AuditEntry['severity'] = 'INFO', metadata: any = {}) => {
    const entry: AuditEntry = {
      id: `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      action,
      actor: 'SYSTEM_USER_01',
      severity,
      metadata
    };
    setAuditTrail(prev => [entry, ...prev].slice(0, 100));
    console.log(`[AUDIT] ${action}`, metadata);
  }, []);

  // -- INITIALIZATION --
  useEffect(() => {
    // Generate synthetic high-fidelity data
    const history = Array.from({ length: 30 }, (_, i) => {
        const base = (account?.balance || 1250000);
        const variance = 0.85 + Math.random() * 0.3;
        return {
            date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            balance: base * variance,
            volume: Math.random() * 50000
        };
    });
    setBalanceHistory(history);
    
    // Initial Audit
    logAction('ACCOUNT_VIEW_INITIALIZED', 'INFO', { accountId, customerId });

    // Initial Keys
    setVaultKeys([
      { 
        id: 'K-992', 
        label: 'ERP_INTEGRATION_PROD', 
        cipher: QuantumVault.encrypt('sk_live_quantum_9928374'), 
        checksum: '0x882...F21',
        createdAt: new Date().toISOString() 
      }
    ]);

    setLoading(false);
  }, [account, accountId, customerId, logAction]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // -- AI ENGINE (GEMINI 3 FLASH) --
  const askAI = async (customPrompt?: string) => {
    const input = customPrompt || userInput;
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: input,
        timestamp: new Date()
    };

    setChatHistory(prev => [...prev, userMsg]);
    setUserInput("");
    setIsAiLoading(true);

    try {
        // Using the requested GoogleGenAI package with Vercel secrets
        const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY || 'DEMO_MODE_KEY');
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const systemContext = `
            You are the "Quantum Financial Nexus AI Pilot". 
            This is a "Golden Ticket" business banking demo.
            Tone: Elite, Professional, High-Performance, Secure.
            Metaphor: Test-driving a luxury high-performance car.
            
            Capabilities:
            - You can trigger actions: [CREATE_PAYMENT], [GENERATE_KEY], [VIEW_AUDIT], [DOWNLOAD_REPORT].
            - You explain complex financial data simply.
            - You NEVER mention "Citibank". Use "Quantum Financial" or "The Demo Bank".
            - You are helping the user "kick the tires" of this financial engine.
            
            Current Account State:
            - Name: ${account?.name}
            - Balance: $${account?.balance}
            - Status: SECURE / ALPHA TIER
            
            If the user wants to pay or create something, include the action tag in your response.
        `;

        const result = await model.generateContent([systemContext, input]);
        const response = await result.response;
        const text = response.text();

        const aiMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: text,
            timestamp: new Date()
        };

        setChatHistory(prev => [...prev, aiMsg]);
        logAction('AI_INTERACTION', 'INFO', { prompt: input, responseLength: text.length });

        // Handle simulated actions triggered by AI
        if (text.includes('[CREATE_PAYMENT]')) setShowPaymentModal(true);
        if (text.includes('[GENERATE_KEY]')) setShowKeyModal(true);
        if (text.includes('[VIEW_AUDIT]')) setActiveTab('audit');

    } catch (error) {
        console.error("AI Error:", error);
        const fallbackMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: "I've encountered a telemetry glitch in the AI core, but the engine is still roaring. It's like test-driving a car – you get to kick the tires, see all the bells and whistles, and ensure it's the perfect fit. How can I assist with your liquidity today?",
            timestamp: new Date()
        };
        setChatHistory(prev => [...prev, fallbackMsg]);
    } finally {
        setIsAiLoading(false);
    }
  };

  // -- ACTION HANDLERS --

  const handleStripePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);
    logAction('STRIPE_PAYMENT_INITIATED', 'INFO', { amount: 50000, currency: 'USD' });
    
    // Simulate Stripe Processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessingPayment(false);
    setShowPaymentModal(false);
    logAction('STRIPE_PAYMENT_SUCCESS', 'INFO', { transactionId: 'ch_3NqW...z91' });
    
    const successMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'system',
        content: "Payment successful. $50,000.00 has been injected into the liquidity pool. The engine is running at peak efficiency.",
        timestamp: new Date(),
        type: 'action'
    };
    setChatHistory(prev => [...prev, successMsg]);
  };

  const generateNewKey = (label: string) => {
    const newKey: EncryptedKey = {
        id: `K-${Math.floor(Math.random() * 1000)}`,
        label: label || 'NEW_INTEGRATION',
        cipher: QuantumVault.encrypt(`sk_test_${Math.random().toString(36).substring(7)}`),
        checksum: `0x${Math.random().toString(16).substring(2, 8).toUpperCase()}...`,
        createdAt: new Date().toISOString()
    };
    setVaultKeys(prev => [...prev, newKey]);
    logAction('ENCRYPTED_KEY_GENERATED', 'WARN', { label, keyId: newKey.id });
    setShowKeyModal(false);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-cyan-500 font-mono">
        <RefreshCw className="animate-spin mb-4" size={48} />
        <p className="animate-pulse tracking-[0.5em]">INITIALIZING_QUANTUM_CORE...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-8 font-sans selection:bg-cyan-500/30">
      
      {/* --- HEADER / TELEMETRY --- */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-2 w-2 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em]">System Status: Optimal</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white flex items-center gap-3">
            {account?.name || 'QUANTUM_VAULT'} 
            <span className="text-sm font-mono bg-white/5 border border-white/10 px-2 py-1 rounded text-slate-400">
              ID: {accountId.substring(0, 8)}...
            </span>
          </h1>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setShowPaymentModal(true)}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-[0_0_20px_rgba(8,145,178,0.3)]"
          >
            <Plus size={18} /> INJECT LIQUIDITY
          </button>
          <button 
            onClick={() => setShowVault(!showVault)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all border ${showVault ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
          >
            <Lock size={18} /> {showVault ? 'CLOSE VAULT' : 'OPEN VAULT'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT COLUMN: MAIN INTERFACE (8 COLS) --- */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* TABS */}
          <div className="flex gap-1 bg-white/5 p-1 rounded-2xl border border-white/10 w-fit">
            {(['overview', 'analytics', 'security', 'audit'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-cyan-500 text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* BALANCE HERO */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-black border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <DollarSign size={120} />
                  </div>
                  <p className="text-xs font-black text-cyan-500 uppercase tracking-[0.2em] mb-2">Available Liquidity</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black text-white tracking-tighter">
                      ${(account?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-emerald-500 font-bold flex items-center gap-1 text-sm">
                      <ArrowUpRight size={16} /> +2.4%
                    </span>
                  </div>
                  <div className="mt-8 flex gap-8">
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Pending Wires</p>
                      <p className="text-xl font-mono text-white">$12,400.00</p>
                    </div>
                    <div className="h-10 w-[1px] bg-white/10" />
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Daily Limit</p>
                      <p className="text-xl font-mono text-white">$5,000,000.00</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400">
                        <ShieldCheck size={24} />
                      </div>
                      <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black rounded border border-emerald-500/20">ACTIVE</span>
                    </div>
                    <h4 className="font-bold text-white mb-1">Alpha Tier Security</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">Multi-factor biometric auth and homomorphic key encryption enabled.</p>
                  </div>
                  <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-colors">
                    MANAGE PROTOCOLS
                  </button>
                </div>
              </div>

              {/* CHART SECTION */}
              <Card title="Liquidity Flux (30-Day Telemetry)" icon={<Activity className="text-cyan-500" />}>
                <div className="h-[300px] w-full mt-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={balanceHistory}>
                      <defs>
                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        stroke="#475569" 
                        fontSize={10} 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b' }}
                      />
                      <YAxis hide domain={['dataMin - 50000', 'dataMax + 50000']} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }}
                        itemStyle={{ color: '#22d3ee' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="balance" 
                        stroke="#06b6d4" 
                        strokeWidth={4} 
                        fillOpacity={1} 
                        fill="url(#colorBalance)" 
                        animationDuration={1500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in zoom-in-95 duration-500">
              <Card title="Transaction Volume" icon={<BarChart className="text-indigo-400" />}>
                <div className="h-[250px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={balanceHistory.slice(-10)}>
                      <Bar dataKey="volume" fill="#6366f1" radius={[4, 4, 0, 0]}>
                        {balanceHistory.slice(-10).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#818cf8'} />
                        ))}
                      </Bar>
                      <XAxis dataKey="date" hide />
                      <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#0f172a', border: 'none' }} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              <Card title="Global Exposure" icon={<Globe className="text-emerald-400" />}>
                <div className="space-y-4 mt-4">
                  {[
                    { region: 'North America', value: 65, color: 'bg-cyan-500' },
                    { region: 'EMEA', value: 20, color: 'bg-indigo-500' },
                    { region: 'APAC', value: 15, color: 'bg-emerald-500' },
                  ].map((r) => (
                    <div key={r.region}>
                      <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
                        <span>{r.region}</span>
                        <span>{r.value}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${r.color}`} style={{ width: `${r.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-indigo-500 rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.4)]">
                    <Lock className="text-white" size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">Quantum Vault Storage</h3>
                    <p className="text-slate-400">Homomorphic encryption ensures your API keys and secrets are never visible in plain text, even to the system memory.</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {vaultKeys.map(key => (
                    <div key={key.id} className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-2xl hover:border-indigo-500/50 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-white/5 rounded-lg text-slate-500 group-hover:text-indigo-400 transition-colors">
                          <Key size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{key.label}</p>
                          <p className="text-[10px] font-mono text-slate-500">{key.cipher.substring(0, 40)}...</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                          <p className="text-[10px] font-black text-slate-500 uppercase">Checksum</p>
                          <p className="text-[10px] font-mono text-emerald-500">{key.checksum}</p>
                        </div>
                        <button 
                          onClick={() => {
                            logAction('KEY_DELETION_ATTEMPT', 'CRITICAL', { keyId: key.id });
                            setVaultKeys(prev => prev.filter(k => k.id !== key.id));
                          }}
                          className="p-2 hover:bg-red-500/10 hover:text-red-500 text-slate-600 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => setShowKeyModal(true)}
                    className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-slate-500 hover:border-indigo-500/50 hover:text-indigo-400 transition-all flex items-center justify-center gap-2 font-bold text-sm"
                  >
                    <Plus size={18} /> GENERATE NEW ENCRYPTED KEY
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="bg-black border border-white/10 rounded-3xl overflow-hidden animate-in fade-in duration-500">
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h3 className="font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <Terminal size={18} className="text-cyan-500" />
                  System Audit Trail
                </h3>
                <button className="text-[10px] font-bold text-cyan-500 hover:underline">EXPORT_LOGS.CSV</button>
              </div>
              <div className="max-h-[500px] overflow-y-auto font-mono text-[11px]">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-slate-900 text-slate-500 uppercase">
                    <tr>
                      <th className="p-4">Timestamp</th>
                      <th className="p-4">Action</th>
                      <th className="p-4">Severity</th>
                      <th className="p-4">Metadata</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {auditTrail.map((log) => (
                      <tr key={log.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                        <td className="p-4 font-bold text-white">{log.action}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded ${
                            log.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-500' : 
                            log.severity === 'WARN' ? 'bg-yellow-500/20 text-yellow-500' : 
                            'bg-cyan-500/20 text-cyan-500'
                          }`}>
                            {log.severity}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500 truncate max-w-[200px]">{JSON.stringify(log.metadata)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* --- RIGHT COLUMN: AI PILOT & CHAT (4 COLS) --- */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* AI PILOT PANEL */}
          <div className="bg-gradient-to-b from-slate-900 to-black border border-cyan-500/30 rounded-3xl flex flex-col h-[700px] shadow-2xl shadow-cyan-900/20 relative overflow-hidden">
            
            {/* AI Header */}
            <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-10 w-10 bg-cyan-500 rounded-full flex items-center justify-center text-black">
                    <Cpu size={24} />
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 border-2 border-slate-900 rounded-full" />
                </div>
                <div>
                  <h3 className="font-black text-white text-sm uppercase tracking-tighter">Nexus AI Pilot</h3>
                  <p className="text-[10px] text-cyan-500 font-bold uppercase">Gemini 3 Flash Core</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-1.5 w-1.5 bg-cyan-500 rounded-full animate-pulse" />
                <div className="h-1.5 w-1.5 bg-cyan-500 rounded-full animate-pulse delay-75" />
                <div className="h-1.5 w-1.5 bg-cyan-500 rounded-full animate-pulse delay-150" />
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {chatHistory.length === 0 && (
                <div className="text-center py-10 space-y-4">
                  <div className="inline-block p-4 bg-white/5 rounded-full text-cyan-500 mb-2">
                    <Sparkles size={32} />
                  </div>
                  <h4 className="text-white font-bold">Welcome to the Driver's Seat</h4>
                  <p className="text-xs text-slate-400 leading-relaxed px-6">
                    I am your financial co-pilot. Kick the tires, see the engine roar, and let's explore your "Golden Ticket" to global banking.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 px-4">
                    {['Create Payment', 'Audit Logs', 'Security Check'].map(suggestion => (
                      <button 
                        key={suggestion}
                        onClick={() => askAI(suggestion)}
                        className="text-[10px] font-bold px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg hover:bg-cyan-500 hover:text-black transition-all"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {chatHistory.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-cyan-600 text-white rounded-tr-none' 
                      : msg.role === 'system'
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-tl-none'
                        : 'bg-white/5 border border-white/10 text-slate-300 rounded-tl-none'
                  }`}>
                    {msg.content}
                    <div className="mt-2 text-[9px] opacity-50 font-mono">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {isAiLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none">
                    <div className="flex gap-1">
                      <div className="h-1.5 w-1.5 bg-cyan-500 rounded-full animate-bounce" />
                      <div className="h-1.5 w-1.5 bg-cyan-500 rounded-full animate-bounce delay-75" />
                      <div className="h-1.5 w-1.5 bg-cyan-500 rounded-full animate-bounce delay-150" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-black/50 border-t border-white/10">
              <form 
                onSubmit={(e) => { e.preventDefault(); askAI(); }}
                className="relative"
              >
                <input 
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Ask the Pilot..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-4 pr-14 text-sm focus:outline-none focus:border-cyan-500/50 transition-all"
                />
                <button 
                  type="submit"
                  disabled={isAiLoading || !userInput.trim()}
                  className="absolute right-2 top-2 h-10 w-10 bg-cyan-500 text-black rounded-lg flex items-center justify-center hover:bg-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                </button>
              </form>
              <p className="text-[9px] text-center text-slate-600 mt-3 font-bold uppercase tracking-widest">
                Quantum Financial Nexus v4.0.2-Stable
              </p>
            </div>
          </div>

          {/* QUICK STATS CARD */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Network Telemetry</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">API Latency</span>
                <span className="text-xs font-mono text-emerald-500">12ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Encryption Load</span>
                <span className="text-xs font-mono text-cyan-500">0.02%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Audit Sync</span>
                <span className="text-xs font-mono text-indigo-500">REAL-TIME</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODALS (POPUPS) --- */}

      {/* STRIPE PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-white/10 rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/10 bg-gradient-to-r from-cyan-600 to-blue-600">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-white/20 rounded-2xl text-white">
                  <CreditCard size={32} />
                </div>
                <button onClick={() => setShowPaymentModal(false)} className="text-white/50 hover:text-white">
                  <Trash2 size={24} />
                </button>
              </div>
              <h3 className="text-2xl font-black text-white mt-4">Inject Liquidity</h3>
              <p className="text-white/70 text-sm">Powered by Stripe Connect</p>
            </div>
            <form onSubmit={handleStripePayment} className="p-8 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Amount (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input 
                    type="number" 
                    defaultValue="50000"
                    className="w-full bg-black border border-white/10 rounded-xl py-4 pl-8 pr-4 text-xl font-mono text-white focus:border-cyan-500 outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Source</label>
                  <select className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs text-white outline-none">
                    <option>External Treasury</option>
                    <option>Operating Account</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Speed</label>
                  <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 text-[10px] font-bold">
                    <Zap size={14} /> INSTANT
                  </div>
                </div>
              </div>
              <button 
                type="submit"
                disabled={isProcessingPayment}
                className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-black rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {isProcessingPayment ? <RefreshCw className="animate-spin" /> : 'CONFIRM TRANSACTION'}
              </button>
              <p className="text-[9px] text-slate-500 text-center uppercase font-bold">
                Securely processed via Quantum Shield Protocol
              </p>
            </form>
          </div>
        </div>
      )}

      {/* KEY GENERATION MODAL */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-white/10 rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/10 bg-indigo-600">
              <h3 className="text-2xl font-black text-white">Generate Encrypted Key</h3>
              <p className="text-white/70 text-sm">Homomorphic Vault Integration</p>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Integration Label</label>
                <input 
                  id="keyLabel"
                  type="text" 
                  placeholder="e.g. SAP_ERP_PROD"
                  className="w-full bg-black border border-white/10 rounded-xl py-4 px-4 text-sm text-white focus:border-indigo-500 outline-none"
                />
              </div>
              <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                <div className="flex gap-3">
                  <ShieldAlert className="text-indigo-400 shrink-0" size={20} />
                  <p className="text-[11px] text-indigo-300 leading-relaxed">
                    This key will be stored using <strong>Homomorphic Encryption</strong>. You can perform API operations without the system ever decrypting the raw secret into memory.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowKeyModal(false)}
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all"
                >
                  CANCEL
                </button>
                <button 
                  onClick={() => {
                    const label = (document.getElementById('keyLabel') as HTMLInputElement)?.value;
                    generateNewKey(label);
                  }}
                  className="flex-1 py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-black rounded-xl transition-all"
                >
                  GENERATE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AccountDetails;