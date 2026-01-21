import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";

// ============================================================================
// QUANTUM FINANCIAL - BUSINESS DEMO CORE
// ============================================================================
// "Kick the tires. See the engine roar."
// This component is a self-contained "Golden Ticket" experience for business banking.
// It replaces the standard Plaid Identity view with a comprehensive Enterprise Dashboard.

// ----------------------------------------------------------------------------
// 1. ICONS & ASSETS (Self-Contained SVGs for High Polish)
// ----------------------------------------------------------------------------

const Icons = {
  Shield: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Lock: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Globe: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Activity: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  FileText: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  CheckCircle: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  AlertTriangle: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Search: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Menu: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  X: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Send: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  RefreshCw: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  ChevronRight: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  ChevronDown: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  CreditCard: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  DollarSign: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  PieChart: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>,
  BarChart2: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  User: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Settings: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Database: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
  Eye: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Terminal: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>,
  Briefcase: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  TrendingUp: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Zap: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Server: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>,
  Key: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>,
  Bot: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>
};

// ----------------------------------------------------------------------------
// 2. TYPES & INTERFACES
// ----------------------------------------------------------------------------

type Tab = 'dashboard' | 'identity' | 'payments' | 'security' | 'audit' | 'reports';

interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
  status: 'success' | 'warning' | 'failure';
  hash: string;
}

interface BankAccount {
  id: string;
  name: string;
  number: string;
  balance: number;
  currency: string;
  status: 'active' | 'frozen' | 'audit';
  type: 'checking' | 'savings' | 'treasury';
}

interface Transaction {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  status: 'posted' | 'pending' | 'flagged';
  category: string;
  riskScore: number;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'ai' | 'system';
  content: string;
  timestamp: number;
  isTyping?: boolean;
}

// ----------------------------------------------------------------------------
// 3. MOCK DATA (The "Golden Ticket" Content)
// ----------------------------------------------------------------------------

const MOCK_ACCOUNTS: BankAccount[] = [
  { id: 'acc_001', name: 'Global Operating', number: '**** 4291', balance: 12450000.00, currency: 'USD', status: 'active', type: 'treasury' },
  { id: 'acc_002', name: 'Payroll Reserve', number: '**** 8821', balance: 450000.00, currency: 'USD', status: 'active', type: 'checking' },
  { id: 'acc_003', name: 'Euro Liquidity', number: '**** 1102', balance: 2100000.00, currency: 'EUR', status: 'active', type: 'savings' },
  { id: 'acc_004', name: 'APAC Growth Fund', number: '**** 9934', balance: 850000000, currency: 'JPY', status: 'audit', type: 'treasury' },
];

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'tx_1', date: '2024-05-20', merchant: 'AWS Cloud Services', amount: -12450.00, status: 'posted', category: 'Infrastructure', riskScore: 12 },
  { id: 'tx_2', date: '2024-05-19', merchant: 'Global Steel Corp', amount: -450000.00, status: 'pending', category: 'Supply Chain', riskScore: 45 },
  { id: 'tx_3', date: '2024-05-19', merchant: 'Inbound Wire: Client X', amount: 2500000.00, status: 'posted', category: 'Revenue', riskScore: 5 },
  { id: 'tx_4', date: '2024-05-18', merchant: 'Unknown Vendor', amount: -12.99, status: 'flagged', category: 'Uncategorized', riskScore: 98 },
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: 'log_1', timestamp: '2024-05-20 09:00:01', action: 'SYSTEM_INIT', user: 'SYSTEM', details: 'Quantum Core initialized successfully.', status: 'success', hash: '0x9a...f2' },
  { id: 'log_2', timestamp: '2024-05-20 09:05:22', action: 'USER_LOGIN', user: 'j.doe@demo.com', details: 'MFA Verified via Biometric.', status: 'success', hash: '0x1b...c4' },
  { id: 'log_3', timestamp: '2024-05-20 10:12:00', action: 'DATA_SYNC', user: 'SYSTEM', details: 'Synced with Global Ledger.', status: 'success', hash: '0x7d...e1' },
];

// ----------------------------------------------------------------------------
// 4. HELPER COMPONENTS
// ----------------------------------------------------------------------------

const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string; action?: React.ReactNode }> = ({ children, className = '', title, action }) => (
  <div className={`bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-xl overflow-hidden shadow-xl ${className}`}>
    {(title || action) && (
      <div className="px-6 py-4 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/30">
        {title && <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">{title}</h3>}
        {action && <div>{action}</div>}
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

const Badge: React.FC<{ children: React.ReactNode; variant?: 'success' | 'warning' | 'danger' | 'neutral' }> = ({ children, variant = 'neutral' }) => {
  const colors = {
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    neutral: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[variant]}`}>
      {children}
    </span>
  );
};

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost' }> = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/20',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-100',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-500/20',
    ghost: 'bg-transparent hover:bg-slate-800 text-slate-400 hover:text-slate-200',
  };
  return (
    <button className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({ label, className = '', ...props }) => (
  <div className="space-y-1">
    {label && <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</label>}
    <input className={`w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all ${className}`} {...props} />
  </div>
);

// ----------------------------------------------------------------------------
// 5. MAIN COMPONENT: PlaidIdentityView (The Monolith)
// ----------------------------------------------------------------------------

const PlaidIdentityView: React.FC = () => {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [accounts, setAccounts] = useState<BankAccount[]>(MOCK_ACCOUNTS);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 'msg_0', role: 'ai', content: "Welcome to Quantum Financial. I am your Sovereign AI Architect. How can I assist with your treasury operations today?", timestamp: Date.now() }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({ recipient: '', amount: '', reference: '' });
  const [securityAlert, setSecurityAlert] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- AI CONFIGURATION ---
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''; 
  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  // --- EFFECTS ---
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiOpen]);

  // --- LOGIC: AUDIT SYSTEM ---
  const logAction = useCallback((action: string, details: string, status: 'success' | 'warning' | 'failure' = 'success') => {
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      action,
      user: 'CURRENT_USER', // In a real app, this comes from auth context
      details,
      status,
      hash: `0x${Math.random().toString(16).substr(2, 8)}...` // Simulated hash
    };
    setAuditLogs(prev => [newLog, ...prev]);
  }, []);

  // --- LOGIC: AI HANDLER ---
  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = { id: `msg_${Date.now()}`, role: 'user', content: chatInput, timestamp: Date.now() };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    try {
      // 1. Construct Context for AI
      const context = `
        You are the AI core for "Quantum Financial", a high-end business banking demo.
        Current User Context:
        - Total Balance: $${accounts.reduce((acc, curr) => acc + (curr.currency === 'USD' ? curr.balance : 0), 0).toLocaleString()}
        - Active Accounts: ${accounts.length}
        - Recent Transactions: ${transactions.slice(0, 3).map(t => `${t.merchant} ($${t.amount})`).join(', ')}
        
        Capabilities:
        - You can "create invoice" (simulated).
        - You can "flag transaction" (simulated).
        - You can "analyze spending".
        
        Tone: Elite, Professional, Secure, "Golden Ticket".
        If the user asks to do something, confirm it and pretend to execute it.
        If the user asks about the company, say: "Quantum Financial is the premier digital fortress for your capital."
      `;

      // 2. Call Gemini
      let responseText = "I'm sorry, I cannot connect to the Quantum Core at this moment.";
      
      if (GEMINI_API_KEY) {
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent([context, chatInput]);
        responseText = result.response.text();
      } else {
        // Fallback simulation if no key
        await new Promise(r => setTimeout(r, 1500));
        if (chatInput.toLowerCase().includes('invoice')) responseText = "I've drafted that invoice for you. It's ready for review in the Payments module.";
        else if (chatInput.toLowerCase().includes('fraud')) responseText = "I've initiated a deep-scan of recent transactions. No anomalies detected in the last 400ms.";
        else responseText = "I've processed your request. The Quantum Ledger has been updated.";
      }

      // 3. Process Commands (Simple Heuristics for Demo)
      if (chatInput.toLowerCase().includes('create account')) {
        const newAcc: BankAccount = {
            id: `acc_${Date.now()}`,
            name: 'AI Generated Holdings',
            number: '**** 0000',
            balance: 0,
            currency: 'USD',
            status: 'active',
            type: 'savings'
        };
        setAccounts(prev => [...prev, newAcc]);
        logAction('AI_ACTION', 'Created new account via AI command');
      }

      const aiMsg: ChatMessage = { id: `msg_${Date.now() + 1}`, role: 'ai', content: responseText, timestamp: Date.now() };
      setChatMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("AI Error", error);
      const errorMsg: ChatMessage = { id: `msg_${Date.now() + 1}`, role: 'system', content: "Connection to Neural Core interrupted.", timestamp: Date.now() };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // --- LOGIC: PAYMENTS ---
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPaymentModal(false);
    logAction('PAYMENT_INIT', `Wire transfer of $${paymentForm.amount} to ${paymentForm.recipient}`, 'success');
    
    // Simulate processing
    setTimeout(() => {
        setSecurityAlert('Large transaction detected. AI Fraud check passed.');
        setTimeout(() => setSecurityAlert(null), 4000);
    }, 1000);

    setPaymentForm({ recipient: '', amount: '', reference: '' });
  };

  // --- RENDERERS ---

  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Hero Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-cyan-500/30">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Liquidity</p>
              <h2 className="text-3xl font-bold text-white mt-2">$14,995,000.00</h2>
              <div className="flex items-center mt-2 text-emerald-400 text-sm">
                <Icons.TrendingUp className="w-4 h-4 mr-1" />
                <span>+2.4% this week</span>
              </div>
            </div>
            <div className="p-3 bg-cyan-500/20 rounded-lg">
              <Icons.Globe className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Active Operations</p>
              <h2 className="text-3xl font-bold text-white mt-2">1,242</h2>
              <div className="flex items-center mt-2 text-slate-400 text-sm">
                <span>Transactions processed today</span>
              </div>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Icons.Activity className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Security Status</p>
              <h2 className="text-3xl font-bold text-emerald-400 mt-2">OPTIMAL</h2>
              <div className="flex items-center mt-2 text-slate-400 text-sm">
                <Icons.Shield className="w-4 h-4 mr-1 text-emerald-400" />
                <span>Zero threats detected</span>
              </div>
            </div>
            <div className="p-3 bg-emerald-500/20 rounded-lg">
              <Icons.Lock className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account List */}
        <div className="lg:col-span-2 space-y-6">
          <Card title={<><Icons.Briefcase className="w-5 h-5 text-cyan-400" /> Corporate Accounts</>}>
            <div className="space-y-4">
              {accounts.map(acc => (
                <div key={acc.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-cyan-500/50 transition-colors group cursor-pointer" onClick={() => logAction('VIEW_ACCOUNT', `Viewed details for ${acc.name}`)}>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${acc.type === 'treasury' ? 'bg-amber-500/20 text-amber-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                      <Icons.CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">{acc.name}</h4>
                      <p className="text-sm text-slate-500">{acc.number} • {acc.type.toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-slate-200">{acc.currency === 'USD' ? '$' : acc.currency === 'EUR' ? '€' : '¥'}{acc.balance.toLocaleString()}</p>
                    <Badge variant={acc.status === 'active' ? 'success' : 'warning'}>{acc.status.toUpperCase()}</Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-700/50 flex justify-end">
               <Button variant="ghost" onClick={() => setActiveTab('identity')}>View All Accounts <Icons.ChevronRight className="w-4 h-4 ml-1" /></Button>
            </div>
          </Card>

          <Card title={<><Icons.TrendingUp className="w-5 h-5 text-purple-400" /> Recent Activity</>}>
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="text-xs uppercase bg-slate-800/50 text-slate-300">
                        <tr>
                            <th className="px-4 py-3 rounded-l-lg">Date</th>
                            <th className="px-4 py-3">Merchant</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3">Risk Score</th>
                            <th className="px-4 py-3 text-right rounded-r-lg">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                        {transactions.map(tx => (
                            <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                                <td className="px-4 py-3">{tx.date}</td>
                                <td className="px-4 py-3 font-medium text-slate-200">{tx.merchant}</td>
                                <td className="px-4 py-3"><Badge variant="neutral">{tx.category}</Badge></td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full ${tx.riskScore > 50 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${tx.riskScore}%` }}></div>
                                        </div>
                                        <span className={tx.riskScore > 50 ? 'text-rose-400' : 'text-emerald-400'}>{tx.riskScore}</span>
                                    </div>
                                </td>
                                <td className={`px-4 py-3 text-right font-mono ${tx.amount > 0 ? 'text-emerald-400' : 'text-slate-200'}`}>
                                    {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
          </Card>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
            <Card className="bg-gradient-to-b from-cyan-900/20 to-slate-900 border-cyan-500/20">
                <div className="text-center p-4">
                    <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <Icons.Zap className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Quick Actions</h3>
                    <p className="text-sm text-slate-400 mb-6">Execute high-value operations securely.</p>
                    <div className="space-y-3">
                        <Button className="w-full" onClick={() => setShowPaymentModal(true)}>
                            <Icons.Send className="w-4 h-4" /> Initiate Wire
                        </Button>
                        <Button className="w-full" variant="secondary" onClick={() => logAction('REPORT_GEN', 'Generated daily liquidity report')}>
                            <Icons.FileText className="w-4 h-4" /> Export Reports
                        </Button>
                        <Button className="w-full" variant="secondary" onClick={() => setActiveTab('security')}>
                            <Icons.Shield className="w-4 h-4" /> Security Center
                        </Button>
                    </div>
                </div>
            </Card>

            <Card title="System Status">
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">API Gateway</span>
                        <span className="flex items-center text-emerald-400"><div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div> Operational</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Fraud Engine</span>
                        <span className="flex items-center text-emerald-400"><div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div> Active</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Ledger Sync</span>
                        <span className="flex items-center text-emerald-400"><div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div> 12ms Latency</span>
                    </div>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );

  const renderIdentity = () => (
    <div className="space-y-6 animate-in slide-in-from-right duration-500">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Corporate Identity & KYC</h2>
            <Button variant="secondary"><Icons.RefreshCw className="w-4 h-4" /> Refresh Data</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Entity Profile">
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg">
                        <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center text-2xl font-bold text-slate-300">QF</div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Quantum Financial Corp.</h3>
                            <p className="text-slate-400">DUNS: 12-345-6789</p>
                        </div>
                        <div className="ml-auto">
                            <Badge variant="success"><Icons.CheckCircle className="w-3 h-3 inline mr-1" /> VERIFIED</Badge>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-slate-500">Incorporation</p>
                            <p className="text-slate-200">Delaware, USA</p>
                        </div>
                        <div>
                            <p className="text-slate-500">Tax ID (EIN)</p>
                            <p className="text-slate-200">**-***4291</p>
                        </div>
                        <div>
                            <p className="text-slate-500">Address</p>
                            <p className="text-slate-200">101 Quantum Way, NY</p>
                        </div>
                        <div>
                            <p className="text-slate-500">Primary Contact</p>
                            <p className="text-slate-200">James B. O'Callaghan</p>
                        </div>
                    </div>
                </div>
            </Card>
            <Card title="Beneficial Owners">
                <div className="space-y-4">
                    {[1, 2].map(i => (
                        <div key={i} className="flex items-center justify-between p-3 border border-slate-700 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center"><Icons.User className="w-5 h-5 text-slate-400" /></div>
                                <div>
                                    <p className="font-medium text-slate-200">Director {i}</p>
                                    <p className="text-xs text-slate-500">25% Ownership</p>
                                </div>
                            </div>
                            <Badge variant="success">KYC PASSED</Badge>
                        </div>
                    ))}
                    <div className="p-4 bg-cyan-900/20 border border-cyan-500/30 rounded-lg text-sm text-cyan-200">
                        <Icons.Lock className="w-4 h-4 inline mr-2" />
                        All sensitive PII is encrypted using AES-256 and stored in our immutable audit vault.
                    </div>
                </div>
            </Card>
        </div>
    </div>
  );

  const renderAudit = () => (
    <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Immutable Audit Vault</h2>
            <div className="flex gap-2">
                <Button variant="secondary"><Icons.Download className="w-4 h-4" /> Export CSV</Button>
                <Button variant="secondary"><Icons.Filter className="w-4 h-4" /> Filter</Button>
            </div>
        </div>
        <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-slate-800 text-slate-200 uppercase text-xs font-bold">
                        <tr>
                            <th className="px-6 py-4">Timestamp</th>
                            <th className="px-6 py-4">Action</th>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Details</th>
                            <th className="px-6 py-4">Hash</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {auditLogs.map(log => (
                            <tr key={log.id} className="hover:bg-slate-800/50 transition-colors font-mono">
                                <td className="px-6 py-4 text-slate-500">{log.timestamp}</td>
                                <td className="px-6 py-4 font-bold text-cyan-400">{log.action}</td>
                                <td className="px-6 py-4 text-slate-300">{log.user}</td>
                                <td className="px-6 py-4 text-slate-400">{log.details}</td>
                                <td className="px-6 py-4 text-xs text-slate-600">{log.hash}</td>
                                <td className="px-6 py-4">
                                    <Badge variant={log.status === 'success' ? 'success' : log.status === 'warning' ? 'warning' : 'danger'}>
                                        {log.status.toUpperCase()}
                                    </Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    </div>
  );

  // --- MAIN LAYOUT ---

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Icons.Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Quantum Financial
            </span>
            <span className="ml-2 px-2 py-0.5 rounded bg-slate-800 text-xs text-slate-400 border border-slate-700">DEMO ENV</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Icons.PieChart },
              { id: 'identity', label: 'Identity', icon: Icons.User },
              { id: 'payments', label: 'Payments', icon: Icons.DollarSign },
              { id: 'audit', label: 'Audit', icon: Icons.Database },
              { id: 'security', label: 'Security', icon: Icons.Shield },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                  activeTab === item.id 
                    ? 'bg-slate-800 text-cyan-400 shadow-inner' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button 
                onClick={() => setIsAiOpen(!isAiOpen)}
                className={`p-2 rounded-full transition-all ${isAiOpen ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            >
                <Icons.Bot className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-slate-900"></div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Security Alert Banner */}
        {securityAlert && (
            <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center gap-3 text-amber-400 animate-pulse">
                <Icons.AlertTriangle className="w-5 h-5" />
                <span className="font-medium">{securityAlert}</span>
            </div>
        )}

        {/* Tab Content */}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'identity' && renderIdentity()}
        {activeTab === 'audit' && renderAudit()}
        {(activeTab === 'payments' || activeTab === 'security') && (
            <div className="flex flex-col items-center justify-center h-96 text-center space-y-4">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center">
                    <Icons.Lock className="w-10 h-10 text-slate-500" />
                </div>
                <h3 className="text-xl font-bold text-white">Restricted Access</h3>
                <p className="text-slate-400 max-w-md">This module requires elevated privileges. Please use the AI Assistant to request a temporary access token or navigate back to the Dashboard.</p>
                <Button onClick={() => setActiveTab('dashboard')}>Return to Dashboard</Button>
            </div>
        )}
      </main>

      {/* AI Chat Sidebar (The "Engine Roar") */}
      <div className={`fixed inset-y-0 right-0 w-96 bg-slate-900/95 backdrop-blur-xl border-l border-slate-700 shadow-2xl transform transition-transform duration-300 z-50 flex flex-col ${isAiOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-800/50">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                    <Icons.Bot className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                    <h3 className="font-bold text-white">Quantum Core</h3>
                    <p className="text-xs text-emerald-400 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Online</p>
                </div>
            </div>
            <button onClick={() => setIsAiOpen(false)} className="text-slate-400 hover:text-white"><Icons.X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                        msg.role === 'user' 
                            ? 'bg-cyan-600 text-white rounded-br-none' 
                            : msg.role === 'system'
                            ? 'bg-rose-900/30 text-rose-200 border border-rose-500/30'
                            : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                    }`}>
                        {msg.content}
                    </div>
                </div>
            ))}
            {isTyping && (
                <div className="flex justify-start">
                    <div className="bg-slate-800 p-3 rounded-2xl rounded-bl-none border border-slate-700 flex gap-1">
                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75"></span>
                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150"></span>
                    </div>
                </div>
            )}
            <div ref={chatEndRef} />
        </div>

        <div className="p-4 border-t border-slate-700 bg-slate-800/30">
            <form onSubmit={handleAiSubmit} className="relative">
                <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask Quantum Core..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
                <button type="submit" className="absolute right-2 top-2 p-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors">
                    <Icons.Send className="w-4 h-4" />
                </button>
            </form>
            <p className="text-xs text-slate-500 mt-2 text-center">
                AI can execute trades, generate reports, and audit logs.
            </p>
        </div>
      </div>

      {/* Payment Modal (PO up form) */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2"><Icons.Send className="w-5 h-5 text-cyan-400" /> Initiate Wire Transfer</h3>
                    <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-white"><Icons.X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handlePaymentSubmit} className="p-6 space-y-4">
                    <