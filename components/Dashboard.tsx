import React, { useContext, useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { 
    Database, Zap, Globe, Target, Cpu, Landmark, CheckCircle, Crown, Code, 
    Fingerprint, ShieldCheck, Activity, Send, Bot, ShieldAlert, History, 
    BarChart3, Layers, Network, Lock, Terminal, Radio, HardDrive, 
    ArrowUpRight, ArrowDownLeft, RefreshCcw, Search, Filter, Settings,
    Eye, EyeOff, AlertTriangle, ZapOff, Briefcase, Globe2, PieChart,
    TrendingUp, Wallet, CreditCard, FileText, Share2, Download, Trash2
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import BalanceSummary from './BalanceSummary';
import RecentTransactions from './RecentTransactions';
import WealthTimeline from './WealthTimeline';
import { AIInsights } from './AIInsights';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View, Transaction } from '../types';

/**
 * QUANTUM FINANCIAL - NEXUS OS v4.0
 * 
 * PHILOSOPHY:
 * - "Golden Ticket" Experience: High-polish, elite performance.
 * - "Test Drive": Interactive elements that simulate real-world banking power.
 * - "Bells and Whistles": Advanced AI integration, real-time audit trails, and fraud monitoring.
 * - "Cheat Sheet": Simplified access to complex global financial tools.
 * 
 * TECHNICAL ARCHITECTURE:
 * - Monolithic Dashboard Component for maximum performance and state cohesion.
 * - Integrated Gemini AI Core for natural language command processing.
 * - Immutable Audit Storage for all sensitive operations.
 * - Multi-factor simulation and Fraud detection visualization.
 */

// ================================================================================================
// TYPES & INTERFACES
// ================================================================================================

interface AuditEntry {
    id: string;
    timestamp: string;
    action: string;
    actor: string;
    details: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    status: 'verified' | 'pending' | 'flagged';
}

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
    metadata?: any;
}

interface FraudSignal {
    id: string;
    origin: string;
    type: string;
    riskScore: number;
    timestamp: string;
    status: 'intercepted' | 'monitoring' | 'cleared';
}

// ================================================================================================
// SUB-COMPONENTS (INTERNAL MONOLITH)
// ================================================================================================

/**
 * @component AuditLedger
 * @description Displays an immutable record of all system actions.
 */
const AuditLedger: React.FC<{ logs: AuditEntry[] }> = ({ logs }) => (
    <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <History className="text-cyan-400 w-5 h-5" />
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Immutable Audit Trail</h3>
            </div>
            <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[10px] text-gray-500 font-mono uppercase">Syncing to DLT...</span>
            </div>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {logs.map((log) => (
                <div key={log.id} className="p-3 bg-black/40 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors group">
                    <div className="flex justify-between items-start mb-1">
                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            log.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                            log.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                            'bg-cyan-500/20 text-cyan-400'
                        }`}>
                            {log.action}
                        </span>
                        <span className="text-[9px] text-gray-600 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2 group-hover:text-gray-300 transition-colors">{log.details}</p>
                    <div className="mt-2 flex items-center justify-between">
                        <span className="text-[9px] text-gray-500 italic">Actor: {log.actor}</span>
                        <div className="flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-green-500/50" />
                            <span className="text-[8px] text-green-500/50 uppercase font-bold">Verified</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

/**
 * @component FraudRadar
 * @description Visualizes real-time security threats and fraud monitoring.
 */
const FraudRadar: React.FC<{ signals: FraudSignal[] }> = ({ signals }) => (
    <div className="space-y-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <ShieldAlert className="text-red-400 w-5 h-5" />
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Quantum Fraud Shield</h3>
            </div>
            <div className="px-2 py-1 bg-red-500/10 border border-red-500/30 rounded text-[10px] text-red-400 font-bold">
                ACTIVE MONITORING
            </div>
        </div>
        <div className="relative h-32 bg-black/60 rounded-xl border border-gray-800 overflow-hidden flex items-center justify-center">
            {/* Radar Animation */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-cyan-500 rounded-full animate-ping"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-cyan-500/50 rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 w-full h-[1px] bg-cyan-500/30 animate-[spin_4s_linear_infinite]"></div>
            </div>
            <div className="z-10 text-center">
                <p className="text-2xl font-black text-white font-mono">0.02%</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Global Threat Index</p>
            </div>
        </div>
        <div className="space-y-2">
            {signals.map(signal => (
                <div key={signal.id} className="flex items-center justify-between p-2 bg-gray-900/50 rounded-lg border border-gray-800/50">
                    <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${signal.riskScore > 70 ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-200 uppercase">{signal.type}</p>
                            <p className="text-[9px] text-gray-500 font-mono">{signal.origin}</p>
                        </div>
                    </div>
                    <span className="text-[10px] font-mono text-gray-400">Score: {signal.riskScore}</span>
                </div>
            ))}
        </div>
    </div>
);

/**
 * @component PaymentTerminal
 * @description High-performance interface for Wire and ACH transfers.
 */
const PaymentTerminal: React.FC<{ onAction: (type: string, data: any) => void }> = ({ onAction }) => {
    const [amount, setAmount] = useState('');
    const [recipient, setRecipient] = useState('');
    const [method, setMethod] = useState<'WIRE' | 'ACH'>('WIRE');

    const handleTransfer = () => {
        if (!amount || !recipient) return;
        onAction('PAYMENT_INITIATED', { amount, recipient, method });
        setAmount('');
        setRecipient('');
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2 p-1 bg-black/40 rounded-lg border border-gray-800">
                <button 
                    onClick={() => setMethod('WIRE')}
                    className={`flex-1 py-2 text-[10px] font-bold rounded-md transition-all ${method === 'WIRE' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    GLOBAL WIRE
                </button>
                <button 
                    onClick={() => setMethod('ACH')}
                    className={`flex-1 py-2 text-[10px] font-bold rounded-md transition-all ${method === 'ACH' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    DOMESTIC ACH
                </button>
            </div>
            <div className="space-y-3">
                <div>
                    <label className="text-[9px] font-bold text-gray-500 uppercase mb-1 block">Recipient Identifier (IBAN/Routing)</label>
                    <input 
                        type="text" 
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder="Enter destination..."
                        className="w-full bg-black/60 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500 outline-none transition-colors font-mono"
                    />
                </div>
                <div>
                    <label className="text-[9px] font-bold text-gray-500 uppercase mb-1 block">Amount (USD)</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-mono">$</span>
                        <input 
                            type="number" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-black/60 border border-gray-800 rounded-lg pl-8 pr-3 py-2 text-sm text-white focus:border-cyan-500 outline-none transition-colors font-mono"
                        />
                    </div>
                </div>
                <button 
                    onClick={handleTransfer}
                    className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-cyan-900/20 transition-all active:scale-[0.98]"
                >
                    Authorize Capital Flow
                </button>
            </div>
            <div className="flex items-center gap-2 justify-center opacity-50">
                <Lock className="w-3 h-3 text-gray-500" />
                <span className="text-[8px] text-gray-500 uppercase font-bold">AES-256 Quantum Encrypted Session</span>
            </div>
        </div>
    );
};

// ================================================================================================
// MAIN DASHBOARD COMPONENT
// ================================================================================================

const Dashboard: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("Dashboard requires DataContext.");

    const { 
        transactions, financialGoals, setActiveView, creditScore, 
        rewardPoints, assets, isProductionApproved, plaidProducts,
        addTransaction, showNotification
    } = context;

    // --- STATE ---
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([
        { id: '1', timestamp: new Date().toISOString(), action: 'SYSTEM_BOOT', actor: 'KERNEL', details: 'Quantum Financial Nexus OS initialized successfully.', severity: 'low', status: 'verified' },
        { id: '2', timestamp: new Date().toISOString(), action: 'AUTH_SYNC', actor: 'USER_01', details: 'Biometric handshake completed via secure enclave.', severity: 'low', status: 'verified' }
    ]);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        { id: '1', role: 'assistant', content: "Welcome to Quantum Financial. I am your Neural Strategist. How can I assist your capital management today?", timestamp: new Date().toISOString() }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [fraudSignals, setFraudSignals] = useState<FraudSignal[]>([
        { id: 'f1', origin: 'IP: 192.168.1.105', type: 'VELOCITY_CHECK', riskScore: 12, timestamp: new Date().toISOString(), status: 'monitoring' },
        { id: 'f2', origin: 'GEO: Moscow, RU', type: 'IMPOSSIBLE_TRAVEL', riskScore: 88, timestamp: new Date().toISOString(), status: 'intercepted' }
    ]);
    const [isStressTesting, setIsStressTesting] = useState(false);
    const [engineLoad, setEngineLoad] = useState(12);

    const chatEndRef = useRef<HTMLDivElement>(null);

    // --- AI CORE INTEGRATION ---
    const genAI = useMemo(() => {
        const key = process.env.GEMINI_API_KEY || "DUMMY_KEY";
        return new GoogleGenAI(key);
    }, []);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [chatMessages]);

    const logAction = useCallback((action: string, details: string, severity: AuditEntry['severity'] = 'low') => {
        const newEntry: AuditEntry = {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString(),
            action,
            actor: 'James B. oCallaghan III',
            details,
            severity,
            status: 'verified'
        };
        setAuditLogs(prev => [newEntry, ...prev]);
    }, []);

    const handleAiCommand = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!chatInput.trim() || isAiLoading) return;

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: chatInput,
            timestamp: new Date().toISOString()
        };

        setChatMessages(prev => [...prev, userMsg]);
        setChatInput('');
        setIsAiLoading(true);
        logAction('AI_QUERY', `User requested: "${userMsg.content.substring(0, 30)}..."`);

        try {
            // Simulate AI processing or call real API if key exists
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            
            const systemPrompt = `
                You are the Quantum Financial Neural Strategist. 
                You are helping a high-net-worth individual manage their global bank demo.
                The user is "James". The bank is "Quantum Financial".
                Be elite, professional, and high-performance.
                If the user asks to "send money" or "transfer", tell them you've prepared the payment terminal.
                If they ask about "fraud", point them to the Fraud Shield.
                Keep responses concise and data-driven.
            `;

            let responseText = "";
            
            if (process.env.GEMINI_API_KEY) {
                const result = await model.generateContent([systemPrompt, chatInput]);
                responseText = result.response.text();
            } else {
                // Fallback for demo environment without key
                await new Promise(r => setTimeout(r, 1000));
                if (chatInput.toLowerCase().includes('send') || chatInput.toLowerCase().includes('wire')) {
                    responseText = "I have initialized the Global Wire terminal. Please specify the recipient and amount for authorization.";
                } else if (chatInput.toLowerCase().includes('fraud')) {
                    responseText = "The Quantum Fraud Shield is currently operating at 99.9% efficiency. One high-risk attempt from Moscow was intercepted 4 minutes ago.";
                } else {
                    responseText = "Analysis complete. Your portfolio is currently optimized for the current market volatility. Would you like to see a stress test of your liquidity?";
                }
            }

            const assistantMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: responseText,
                timestamp: new Date().toISOString()
            };

            setChatMessages(prev => [...prev, assistantMsg]);
        } catch (error) {
            console.error("AI Error:", error);
            showNotification("Neural Link Interrupted", "error");
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleSystemAction = (type: string, data: any) => {
        if (type === 'PAYMENT_INITIATED') {
            logAction('CAPITAL_OUTFLOW', `Authorized ${data.method} of $${data.amount} to ${data.recipient}`, 'high');
            showNotification(`Transfer of $${data.amount} initiated.`, 'success');
            
            // Add to mock transactions
            const newTx: Transaction = {
                id: `tx-${Date.now()}`,
                type: 'expense',
                category: 'Transfer',
                description: `Wire to ${data.recipient}`,
                amount: parseFloat(data.amount),
                date: new Date().toISOString(),
                currency: 'USD',
                metadata: { method: data.method, status: 'PENDING' }
            };
            addTransaction(newTx);
        }
    };

    const runStressTest = () => {
        setIsStressTesting(true);
        logAction('STRESS_TEST', 'Initiating full-scale liquidity engine stress test.', 'medium');
        
        let progress = 12;
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 15);
            setEngineLoad(progress);
            if (progress >= 100) {
                clearInterval(interval);
                setIsStressTesting(false);
                setEngineLoad(12);
                logAction('STRESS_TEST_COMPLETE', 'Liquidity engine passed with 100% resilience.', 'low');
                showNotification("Stress Test Passed: 100% Resilience", "success");
            }
        }, 200);
    };

    // --- CALCULATIONS ---
    const totalManagedValue = useMemo(() => assets.reduce((sum, a) => sum + a.value, 0), [assets]);

    return (
        <div className="space-y-8 animate-in fade-in duration-700 p-2 md:p-6 bg-gray-950 min-h-screen text-gray-200 font-sans selection:bg-cyan-500/30">
            
            {/* ELITE HEADER */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-gray-800/50 pb-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                         <div className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/30 rounded text-[10px] text-cyan-400 font-black tracking-widest uppercase">Quantum Financial</div>
                         <div className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded text-[10px] text-emerald-400 font-black tracking-widest uppercase">Tier 1 Liquidity</div>
                         <div className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/30 rounded text-[10px] text-purple-400 font-black tracking-widest uppercase">AI-Driven</div>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase font-mono italic leading-none">
                        Nexus <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">OS</span>
                    </h1>
                    <div className="flex items-center gap-4">
                        <p className="text-gray-500 font-mono text-xs tracking-widest uppercase flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            System Status: <span className="text-green-400">Optimal</span>
                        </p>
                        <span className="text-gray-800">|</span>
                        <p className="text-gray-500 font-mono text-xs tracking-widest uppercase">
                            Latency: <span className="text-cyan-400">1.2ms</span>
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button 
                        onClick={runStressTest}
                        disabled={isStressTesting}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${
                            isStressTesting 
                            ? 'bg-orange-500/20 border-orange-500/50 text-orange-400' 
                            : 'bg-gray-900 hover:bg-gray-800 border-gray-700 text-gray-400'
                        }`}
                    >
                        {isStressTesting ? <RefreshCcw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                        {isStressTesting ? `Stress Testing: ${engineLoad}%` : 'Kick the Tires'}
                    </button>
                    <button onClick={() => setActiveView(View.ComplianceOracle)} className="px-4 py-2 bg-indigo-900/20 hover:bg-indigo-900/40 border border-indigo-500/50 rounded-xl text-[10px] font-black text-indigo-300 flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(99,102,241,0.1)] uppercase tracking-widest">
                        <ShieldCheck size={14} /> Audit Compliance
                    </button>
                    <button onClick={() => setActiveView(View.SendMoney)} className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 rounded-xl text-white text-[10px] font-black shadow-lg shadow-cyan-500/20 transition-all active:scale-95 uppercase tracking-[0.2em]">
                        Initiate Capital Flow
                    </button>
                </div>
            </header>

            {/* PERFORMANCE METRICS DECK */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <Card className="border-cyan-500/20 bg-cyan-950/5 text-center py-6 group hover:border-cyan-500/50 transition-all relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Fingerprint className="w-8 h-8 mx-auto text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-3xl font-black text-white font-mono">{(creditScore.score/100).toFixed(2)}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Trust Score (Q-Resistant)</p>
                </Card>
                <Card className="border-purple-500/20 bg-purple-950/5 text-center py-6 group hover:border-purple-500/50 transition-all relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Activity className="w-8 h-8 mx-auto text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-3xl font-black text-white font-mono">{plaidProducts.length}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Active Protocols</p>
                </Card>
                <Card className="border-green-500/20 bg-green-950/5 text-center py-6 group hover:border-green-500/50 transition-all relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Database className="w-8 h-8 mx-auto text-green-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-3xl font-black text-white font-mono">100%</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Ledger Integrity</p>
                </Card>
                <Card className="border-emerald-500/20 bg-emerald-950/5 text-center py-6 group hover:border-emerald-500/50 transition-all relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CheckCircle className="w-8 h-8 mx-auto text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-3xl font-black text-white font-mono">VERIFIED</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Identity Verified</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* LEFT COLUMN: VISUAL DATA & AI COMMAND */}
                <div className="lg:col-span-8 space-y-8">
                    
                    {/* WEALTH TOPOLOGY */}
                    <Card title="Sovereign Wealth Topology" className="h-[450px] relative overflow-hidden bg-black/40 border-indigo-900/50 p-0">
                        <div className="absolute top-6 left-6 z-10 flex gap-2">
                            <span className="px-3 py-1.5 bg-indigo-900/40 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold font-mono rounded-lg backdrop-blur">MULTIVERSE_PROJECTION_V6</span>
                            <span className="px-3 py-1.5 bg-black/60 border border-gray-800 text-gray-400 text-[10px] font-bold font-mono rounded-lg backdrop-blur">REAL_TIME_SYNC</span>
                        </div>
                        <div className="absolute top-6 right-6 z-10">
                            <div className="flex items-center gap-2 text-emerald-400 font-mono text-sm font-black">
                                <TrendingUp className="w-4 h-4" />
                                +12.4% YTD
                            </div>
                        </div>
                        <WealthTimeline />
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <BalanceSummary />
                        
                        {/* AI COMMAND CENTER */}
                        <Card className="border-cyan-500/30 bg-black/40 flex flex-col h-[400px]">
                            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Bot className="text-cyan-400 w-5 h-5" />
                                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Neural Strategist</h3>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                                    <span className="text-[9px] text-cyan-500 font-mono uppercase">Online</span>
                                </div>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                                {chatMessages.map(msg => (
                                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                                            msg.role === 'user' 
                                            ? 'bg-cyan-600 text-white rounded-tr-none' 
                                            : 'bg-gray-800/50 text-gray-300 border border-gray-700 rounded-tl-none'
                                        }`}>
                                            {msg.content}
                                            <div className={`mt-1 text-[8px] opacity-50 font-mono ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                                                {new Date(msg.timestamp).toLocaleTimeString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {isAiLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-gray-800/50 p-3 rounded-2xl rounded-tl-none border border-gray-700 flex gap-1">
                                            <span className="w-1 h-1 bg-cyan-500 rounded-full animate-bounce"></span>
                                            <span className="w-1 h-1 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                            <span className="w-1 h-1 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            <form onSubmit={handleAiCommand} className="p-4 border-t border-gray-800 bg-gray-900/30">
                                <div className="relative">
                                    <input 
                                        type="text"
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        placeholder="Command the system..."
                                        className="w-full bg-black/60 border border-gray-700 rounded-xl pl-4 pr-12 py-3 text-xs text-white focus:border-cyan-500 outline-none transition-all placeholder:text-gray-600"
                                    />
                                    <button 
                                        type="submit"
                                        disabled={isAiLoading}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-cyan-500 hover:text-cyan-400 transition-colors"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                            </form>
                        </Card>
                    </div>
                </div>

                {/* RIGHT COLUMN: TACTICAL SIDEBAR */}
                <div className="lg:col-span-4 space-y-8">
                    
                    {/* PAYMENT TERMINAL */}
                    <Card title="Capital Deployment" className="border-cyan-500/20 bg-cyan-950/5 p-6">
                        <PaymentTerminal onAction={handleSystemAction} />
                    </Card>

                    {/* FRAUD SHIELD */}
                    <Card className="border-red-500/20 bg-red-950/5 p-6">
                        <FraudRadar signals={fraudSignals} />
                    </Card>

                    {/* AUDIT LEDGER */}
                    <Card className="border-gray-800 bg-black/40 p-6 h-[400px]">
                        <AuditLedger logs={auditLogs} />
                    </Card>

                    {/* SYSTEM AUTHORITY */}
                    <Card title="Production Authority" className="border-indigo-500/20 bg-indigo-950/5 p-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-black/40 rounded-2xl border border-indigo-500/20 group hover:border-indigo-500/50 transition-all">
                                <div className="p-2 bg-indigo-500/10 rounded-lg">
                                    <Code className="text-indigo-400 w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white uppercase">License: Enterprise v4</p>
                                    <p className="text-[10px] text-gray-400 font-mono">Quantum Financial Institutional Standard</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-emerald-500/20 group hover:border-emerald-500/50 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                                        <Landmark className="text-emerald-400 w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white uppercase">Net Liquidity</p>
                                        <p className="text-[10px] text-gray-400 font-mono">Verified Reserves</p>
                                    </div>
                                </div>
                                <span className="text-lg font-black text-white">${(totalManagedValue / 1000000).toFixed(2)}M</span>
                            </div>
                        </div>
                    </Card>

                    {/* STRATEGIC ALLOCATION */}
                    <Card title="Strategic Phase Allocation" className="border-green-500/20 p-6">
                        <div className="space-y-6">
                            {[
                                { name: "Phase 0: Launch", pct: 100, color: 'from-cyan-500 to-blue-500' },
                                { name: "Phase 1: Deep Insights", pct: 85, color: 'from-blue-500 to-indigo-500' },
                                { name: "Phase 2: Wealth Sync", pct: 42, color: 'from-indigo-500 to-purple-500' },
                                { name: "Phase 3: Autonomous Trading", pct: 12, color: 'from-purple-500 to-pink-500' }
                            ].map(phase => (
                                <div key={phase.name} className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-gray-300">{phase.name}</span>
                                        <span className="text-green-400 font-mono">{phase.pct}%</span>
                                    </div>
                                    <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                                        <div 
                                            className={`bg-gradient-to-r ${phase.color} h-full transition-all duration-1000`} 
                                            style={{ width: `${phase.pct}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                            <button onClick={() => setActiveView(View.FinancialGoals)} className="w-full py-3 bg-gray-900 hover:bg-gray-800 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] transition-all border border-gray-800">Review Full Protocol</button>
                        </div>
                    </Card>
                </div>

                {/* FULL WIDTH: TRANSACTION LEDGER */}
                <div className="lg:col-span-12">
                    <RecentTransactions transactions={transactions.slice(0, 15)} setActiveView={setActiveView} />
                </div>
            </div>

            {/* FOOTER STATUS BAR */}
            <footer className="mt-12 pt-8 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-4 opacity-50">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Globe2 className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Global Node: Singapore-01</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">FIPS 140-2 Level 4</span>
                    </div>
                </div>
                <div className="text-[10px] font-mono uppercase tracking-tighter">
                    © 2024 Quantum Financial Services Group. All Rights Reserved. Unauthorized access is logged and prosecuted.
                </div>
            </footer>

            {/* STRESS TEST OVERLAY */}
            {isStressTesting && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-gray-900 border border-orange-500/50 rounded-3xl p-8 text-center space-y-6 shadow-[0_0_50px_rgba(249,115,22,0.2)]">
                        <div className="relative w-24 h-24 mx-auto">
                            <div className="absolute inset-0 border-4 border-orange-500/20 rounded-full"></div>
                            <div 
                                className="absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent animate-spin"
                                style={{ animationDuration: '0.5s' }}
                            ></div>
                            <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-orange-500 animate-pulse" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black text-white uppercase italic">Engine Stress Test</h2>
                            <p className="text-gray-400 text-sm">Simulating 1,000,000 concurrent global transactions to verify liquidity resilience.</p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-mono text-orange-500">
                                <span>LOAD_FACTOR</span>
                                <span>{engineLoad}%</span>
                            </div>
                            <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                                <div className="bg-orange-500 h-full transition-all duration-200" style={{ width: `${engineLoad}%` }}></div>
                            </div>
                        </div>
                        <div className="text-[10px] font-mono text-gray-500 animate-pulse">
                            EXECUTING: HEURISTIC_RISK_ANALYSIS_V4...
                        </div>
                    </div>
                </div>
            )}

            {/* CUSTOM SCROLLBAR STYLES */}
            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #1f2937;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #374151;
                }
            `}} />
        </div>
    );
};

export default Dashboard;