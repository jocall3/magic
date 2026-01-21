import React, { useState, useMemo, useEffect, FC, useCallback, useRef } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, AreaChart, Area, BarChart, Bar 
} from 'recharts';
import { GoogleGenAI } from "@google/genai";

// ================================================================================================
// QUANTUM FINANCIAL: SOVEREIGN COMMAND CENTER (v4.0 - THE GOLDEN TICKET)
// PHILOSOPHY: TEST DRIVE THE ENGINE. KICK THE TIRES. SEE THE ROAR.
// NO PRESSURE. HIGH PERFORMANCE. ELITE SECURITY.
// ================================================================================================

/**
 * @description 
 * This is a "Golden Ticket" experience for a global financial institution.
 * It is a "Cheat Sheet" for business banking, designed to let users "Test Drive" 
 * the high-performance code engine. 
 * 
 * TECHNICAL STACK:
 * - AI: Google Gemini Flash 1.5 (via GEMINI_API_KEY)
 * - Analytics: Recharts High-Fidelity Visualization
 * - Security: Simulated MFA & Real-time Fraud Vectoring
 * - Audit: Persistent Action Logging (Audit Storage)
 */

// --- TYPES & INTERFACES ---

type ViewState = 'DASHBOARD' | 'PAYMENTS' | 'SECURITY' | 'ANALYTICS' | 'INTEGRATIONS' | 'AUDIT_VAULT';

interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  status: 'SUCCESS' | 'WARNING' | 'CRITICAL';
  details: string;
}

interface Transaction {
  id: string;
  date: string;
  amount: number;
  recipient: string;
  type: 'WIRE' | 'ACH' | 'INTERNAL';
  status: 'SETTLED' | 'PENDING' | 'FLAGGED';
}

interface FraudAlert {
  id: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  message: string;
  vector: string;
}

// --- MOCK DATA GENERATORS ---

const generateFinancials = () => Array.from({ length: 20 }, (_, i) => ({
  time: `${i}:00`,
  liquidity: 4500000 + Math.random() * 1000000,
  outflow: 200000 + Math.random() * 50000,
  risk: Math.random() * 10,
}));

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 'TX-9921', date: '2024-10-24', amount: 1250000, recipient: 'Global Logistics Corp', type: 'WIRE', status: 'SETTLED' },
  { id: 'TX-9922', date: '2024-10-24', amount: 45000, recipient: 'Cloud Systems Inc', type: 'ACH', status: 'SETTLED' },
  { id: 'TX-9923', date: '2024-10-25', amount: 890000, recipient: 'Nexus Ventures', type: 'WIRE', status: 'PENDING' },
];

// --- COMPONENTS ---

const Card: FC<{ title: string; children: React.ReactNode; className?: string; subtitle?: string }> = ({ title, children, className = "", subtitle }) => (
  <div className={`bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 shadow-2xl transition-all duration-500 hover:border-cyan-500/50 ${className}`}>
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-lg font-bold text-white tracking-tight uppercase">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
    </div>
    {children}
  </div>
);

const Modal: FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gradient-to-r from-gray-900 to-black">
          <h2 className="text-xl font-bold text-white uppercase tracking-widest">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
};

// --- MAIN APPLICATION MONOLITH ---

const QuantumWeaverView: FC = () => {
  // State Management
  const [activeView, setActiveView] = useState<ViewState>('DASHBOARD');
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [fraudAlerts] = useState<FraudAlert[]>([
    { id: 'F-1', severity: 'LOW', message: 'Unusual login location detected: Singapore', vector: 'IP_GEOLOCATION' },
    { id: 'F-2', severity: 'HIGH', message: 'Velocity limit exceeded on ACH batch', vector: 'TRANSACTION_VOLUME' }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // AI Initialization
  const genAI = useMemo(() => new GoogleGenAI(process.env.GEMINI_API_KEY || ""), []);
  const model = useMemo(() => genAI.getGenerativeModel({ model: "gemini-1.5-flash" }), [genAI]);

  // Audit Logger
  const logAction = useCallback((action: string, details: string, status: AuditEntry['status'] = 'SUCCESS') => {
    const newEntry: AuditEntry = {
      id: `AUDIT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action,
      user: 'James B. OCallaghan III',
      status,
      details
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  }, []);

  // AI Command Handler
  const handleAiChat = async () => {
    if (!chatInput.trim()) return;
    setIsAiLoading(true);
    const prompt = `
      You are the Quantum Financial AI Core. 
      Current App State:
      - Balance: $45,200,340.00
      - Active View: ${activeView}
      - MFA: ${mfaEnabled ? 'Enabled' : 'Disabled'}
      - Recent Transactions: ${transactions.length}
      
      User Message: "${chatInput}"
      
      Instructions:
      1. Be elite, professional, and secure.
      2. If the user wants to send money, explain the process.
      3. If the user asks about security, mention our multi-vector fraud monitoring.
      4. Do NOT mention Citibank. Use "Quantum Financial".
      5. Keep it concise but high-performance.
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      setAiResponse(response.text());
      logAction('AI_QUERY', `User asked: ${chatInput}`);
    } catch (error) {
      setAiResponse("System Error: AI Core synchronization failed. Check API Key.");
    } finally {
      setIsAiLoading(false);
      setChatInput('');
    }
  };

  // Payment Execution
  const executePayment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const amount = Number(formData.get('amount'));
    const recipient = formData.get('recipient') as string;
    
    const newTx: Transaction = {
      id: `TX-${Math.floor(Math.random() * 10000)}`,
      date: new Date().toISOString().split('T')[0],
      amount,
      recipient,
      type: 'WIRE',
      status: 'PENDING'
    };

    setTransactions(prev => [newTx, ...prev]);
    logAction('PAYMENT_INITIATED', `Sent $${amount} to ${recipient}`, 'SUCCESS');
    setIsPaymentModalOpen(false);
    alert("Payment Dispatched to Clearing House.");
  };

  // UI Render Helpers
  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card title="Total Liquidity" subtitle="Real-time Cash Position">
          <div className="text-3xl font-black text-white">$45,200,340.00</div>
          <div className="flex items-center mt-2 text-green-400 text-xs font-bold">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 10l7-7 7 7M5 14l7 7 7-7" strokeWidth="2"></path></svg>
            +12.4% vs Last Quarter
          </div>
        </Card>
        <Card title="Risk Vector" subtitle="Heuristic Analysis">
          <div className="text-3xl font-black text-cyan-400">0.04%