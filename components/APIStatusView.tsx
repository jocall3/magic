import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { APIStatus } from '../types';
import { ResponsiveContainer, AreaChart, Area, Tooltip as RechartsTooltip, YAxis, XAxis, CartesianGrid } from 'recharts';
import { GoogleGenAI } from "@google/genai";

/**
 * QUANTUM FINANCIAL - ELITE BUSINESS DEMO ENGINE
 * "The Golden Ticket Experience"
 * 
 * SECURITY PROTOCOL: AES-GCM Simulated Homomorphic Encryption
 * AUDIT PROTOCOL: Real-time Immutable Ledger
 * AI ENGINE: Gemini 3 Flash Preview (Quantum Integration)
 */

// --- ENCRYPTION & SECURITY UTILITIES (HOMOMORPHIC SIMULATION) ---
const SECURITY_CONFIG = {
    ALGORITHM: 'AES-GCM',
    SALT: 'QUANTUM_FINANCIAL_SECURE_SALT_2024',
    ITERATIONS: 100000
};

class HomomorphicVault {
    private storage: Map<string, { ciphertext: string; tag: string }>;
    private auditLog: (msg: string) => void;

    constructor(logger: (msg: string) => void) {
        this.storage = new Map();
        this.auditLog = logger;
    }

    // Simulating homomorphic property: Operating on encrypted data
    // In this demo, we "update" the encrypted state without exposing the raw key to the UI
    async storeSecret(key: string, value: string) {
        const encoder = new TextEncoder();
        const data = encoder.encode(value);
        // Simulated encryption process
        const encrypted = btoa(value); // Simplified for demo, but treated as opaque
        this.storage.set(key, { ciphertext: encrypted, tag: 'SECURE_HASH_v1' });
        this.auditLog(`SECURITY: Secret stored for integration [${key}] using Homomorphic Vault.`);
    }

    getSecret(key: string): string {
        const entry = this.storage.get(key);
        if (!entry) return '';
        this.auditLog(`SECURITY: Accessing encrypted reference for [${key}]. Raw data remains in isolated memory.`);
        return entry.ciphertext;
    }

    hasSecret(key: string): boolean {
        return this.storage.has(key);
    }
}

// --- STYLED COMPONENTS (IN-FILE) ---
const StatusIndicator: React.FC<{ status: APIStatus['status'] }> = ({ status }) => {
    const colors = {
        'Operational': { bg: 'bg-green-500/20', text: 'text-green-300', dot: 'bg-green-400' },
        'Degraded Performance': { bg: 'bg-yellow-500/20', text: 'text-yellow-300', dot: 'bg-yellow-400' },
        'Partial Outage': { bg: 'bg-orange-500/20', text: 'text-orange-300', dot: 'bg-orange-400' },
        'Major Outage': { bg: 'bg-red-500/20', text: 'text-red-300', dot: 'bg-red-400' },
    };
    const style = colors[status] || colors['Operational'];
    return (
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tighter ${style.bg} ${style.text} border border-white/10 shadow-lg`}>
            <div className={`w-2 h-2 rounded-full animate-pulse ${style.dot}`}></div>
            {status}
        </div>
    );
};

// --- MAIN VIEW COMPONENT ---
const APIStatusView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("APIStatusView must be within a DataProvider.");
    const { apiStatus } = context;

    // --- STATE MANAGEMENT ---
    const [auditLogs, setAuditLogs] = useState<{ id: string; timestamp: string; message: string; type: 'info' | 'security' | 'ai' }[]>([]);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
        { role: 'ai', content: "Welcome to Quantum Financial. I am your AI Treasury Assistant. How can I help you optimize your global operations today?" }
    ]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showStripeModal, setShowStripeModal] = useState(false);
    const [stripeAmount, setStripeAmount] = useState('5000.00');
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');
    
    // --- REFS ---
    const auditEndRef = useRef<HTMLDivElement>(null);
    const vault = useRef(new HomomorphicVault((msg) => addAuditLog(msg, 'security')));

    // --- UTILITIES ---
    const addAuditLog = (message: string, type: 'info' | 'security' | 'ai' = 'info') => {
        const newLog = {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString(),
            message,
            type
        };
        setAuditLogs(prev => [newLog, ...prev].slice(0, 50));
    };

    useEffect(() => {
        addAuditLog("SYSTEM: API Status Monitor Initialized.", "info");
        addAuditLog("SECURITY: Homomorphic Vault Memory Isolation Active.", "security");
    }, []);

    // --- AI INTEGRATION ---
    const handleAIChat = async () => {
        if (!chatInput.trim()) return;

        const userMsg = chatInput;
        setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setChatInput('');
        setIsProcessing(true);
        addAuditLog(`AI: Processing request - "${userMsg.substring(0, 30)}..."`, "ai");

        try {
            // Using the requested GoogleGenAI package and model
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
            
            const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: `You are the Quantum Financial AI Assistant. 
                The user is in the API Status and Integration view. 
                Context: This is a high-performance business banking demo. 
                User says: ${userMsg}
                If they want to "pay", "stripe", or "transfer", tell them to use the Stripe Simulator.
                If they want to "secure" or "encrypt", explain the Homomorphic Vault.
                Keep it elite, professional, and secure.`
            });

            const aiText = response.text || "I have processed your request within the Quantum Secure Layer. How else may I assist your treasury needs?";
            setChatMessages(prev => [...prev, { role: 'ai', content: aiText }]);
            addAuditLog("AI: Response generated successfully.", "ai");
        } catch (error) {
            console.error("AI Error:", error);
            setChatMessages(prev => [...prev, { role: 'ai', content: "I apologize, but I am currently performing a security handshake. Please try again in a moment." }]);
            addAuditLog("AI: Error encountered during generation.", "security");
        } finally {
            setIsProcessing(false);
        }
    };

    // --- STRIPE SIMULATION ---
    const handleStripePayment = async () => {
        setPaymentStatus('processing');
        addAuditLog(`STRIPE: Initiating payment of $${stripeAmount} via encrypted gateway.`, "info");
        
        // Simulate network latency
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setPaymentStatus('success');
        addAuditLog(`STRIPE: Payment SUCCESS. Transaction ID: TXN_${Math.random().toString(36).toUpperCase().substr(2, 12)}`, "security");
        
        setTimeout(() => {
            setShowStripeModal(false);
            setPaymentStatus('idle');
        }, 1500);
    };

    // --- DATA VISUALIZATION ---
    const liveTrafficData = useMemo(() => Array.from({ length: 30 }, (_, i) => ({
        time: `${i}:00`,
        plaid: 85 + Math.random() * 15,
        stripe: 70 + Math.random() * 25,
        gemini: 40 + Math.random() * 40,
        quantum: 95 + Math.random() * 5
    })), []);

    return (
        <div className="relative min-h-screen bg-[#0a0a0c] text-slate-200 p-4 md:p-8 font-sans selection:bg-cyan-500/30">
            {/* BACKGROUND DECOR */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto space-y-8">
                {/* HEADER SECTION */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-8">
                    <div>
                        <h1 className="text-5xl font-black tracking-tighter text-white italic">
                            QUANTUM<span className="text-cyan-400">FINANCIAL</span>
                        </h1>
                        <p className="text-slate-400 mt-2 font-medium tracking-widest uppercase text-xs">
                            Global Treasury Control Center • <span className="text-cyan-500">Elite Access</span>
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setShowStripeModal(true)}
                            className="px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-cyan-400 transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        >
                            KICK THE TIRES (STRIPE)
                        </button>
                        <button 
                            onClick={() => setIsChatOpen(!isChatOpen)}
                            className="px-6 py-3 bg-cyan-600 text-white font-bold rounded-full hover:bg-cyan-500 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                        >
                            AI ASSISTANT
                        </button>
                    </div>
                </header>

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT COLUMN: API STATUS */}
                    <div className="lg:col-span-2 space-y-8">
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <span className="w-2 h-8 bg-cyan-500 rounded-full"></span>
                                    System Connectivity
                                </h2>
                                <span className="text-xs font-mono text-slate-500">REF: QF-STATUS-992</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {apiStatus.map(api => (
                                    <div key={api.provider} className="group p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all hover:border-cyan-500/50 shadow-xl">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">{api.provider}</h4>
                                                <p className="text-xs text-slate-500 font-mono mt-1">Latency: {api.responseTime}ms</p>
                                            </div>
                                            <StatusIndicator status={api.status} />
                                        </div>
                                        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                                            <div className="bg-cyan-500 h-full w-[85%] animate-pulse"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* TRAFFIC CHART */}
                        <Card title="Quantum Real-Time Traffic (Req/Sec)">
                            <div className="h-[350px] w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={liveTrafficData}>
                                        <defs>
                                            <linearGradient id="colorQuantum" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                        <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                                        <RechartsTooltip 
                                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                                            itemStyle={{ color: '#fff', fontSize: '12px' }}
                                        />
                                        <Area type="monotone" dataKey="quantum" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorQuantum)" />
                                        <Area type="monotone" dataKey="stripe" stroke="#10b981" strokeWidth={2} fill="transparent" />
                                        <Area type="monotone" dataKey="plaid" stroke="#6366f1" strokeWidth={2} fill="transparent" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: AUDIT & SECURITY */}
                    <div className="space-y-8">
                        <section className="bg-black/40 border border-white/10 rounded-3xl p-6 h-full flex flex-col shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-white uppercase tracking-widest">Audit Ledger</h3>
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar max-h-[600px]">
                                {auditLogs.map(log => (
                                    <div key={log.id} className="text-xs font-mono border-l-2 border-white/10 pl-4 py-1 hover:border-cyan-500 transition-colors">
                                        <div className="flex justify-between text-slate-500 mb-1">
                                            <span>[{log.type.toUpperCase()}]</span>
                                            <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                                        </div>
                                        <p className={`${log.type === 'security' ? 'text-cyan-400' : log.type === 'ai' ? 'text-purple-400' : 'text-slate-300'}`}>
                                            {log.message}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-6 border-t border-white/10">
                                <div className="p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                                    <p className="text-[10px] text-cyan-300 font-bold uppercase mb-2">Vault Status</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-white">Homomorphic Encryption</span>
                                        <span className="text-xs text-cyan-400 font-bold">ACTIVE</span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {/* AI CHAT OVERLAY */}
            {isChatOpen && (
                <div className="fixed bottom-8 right-8 w-[400px] h-[600px] bg-[#0f172a] border border-white/20 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-10">
                    <div className="p-6 bg-gradient-to-r from-cyan-600 to-blue-700 flex justify-between items-center">
                        <div>
                            <h3 className="text-white font-bold">Quantum AI Assistant</h3>
                            <p className="text-cyan-100 text-[10px] uppercase tracking-widest">Secure Session Active</p>
                        </div>
                        <button onClick={() => setIsChatOpen(false)} className="text-white/50 hover:text-white">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                        {chatMessages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-cyan-600 text-white rounded-tr-none' : 'bg-white/5 text-slate-300 border border-white/10 rounded-tl-none'}`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isProcessing && (
                            <div className="flex justify-start">
                                <div className="bg-white/5 p-4 rounded-2xl animate-pulse text-cyan-400 text-xs font-bold">
                                    QUANTUM PROCESSING...
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="p-4 bg-white/5 border-t border-white/10">
                        <div className="relative">
                            <input 
                                type="text" 
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAIChat()}
                                placeholder="Ask Quantum AI..."
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-cyan-500 transition-all"
                            />
                            <button 
                                onClick={handleAIChat}
                                className="absolute right-2 top-2 p-1.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* STRIPE MODAL SIMULATOR */}
            {showStripeModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95">
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold text-slate-900">Quantum Pay</h2>
                                <button onClick={() => setShowStripeModal(false)} className="text-slate-400 hover:text-slate-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Amount (USD)</label>
                                    <input 
                                        type="text" 
                                        value={stripeAmount}
                                        onChange={(e) => setStripeAmount(e.target.value)}
                                        className="w-full text-3xl font-bold text-slate-900 border-b-2 border-slate-100 focus:border-cyan-500 outline-none pb-2 transition-all"
                                    />
                                </div>

                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-8 bg-slate-800 rounded flex items-center justify-center text-[10px] text-white font-bold">VISA</div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-slate-900">•••• •••• •••• 4242</p>
                                            <p className="text-xs text-slate-500">Exp: 12/26</p>
                                        </div>
                                    </div>
                                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Secure Payment via Stripe Gateway</div>
                                </div>

                                <button 
                                    onClick={handleStripePayment}
                                    disabled={paymentStatus !== 'idle'}
                                    className={`w-full py-4 rounded-xl font-bold text-white transition-all transform active:scale-95 ${
                                        paymentStatus === 'success' ? 'bg-green-500' : 'bg-slate-900 hover:bg-black'
                                    }`}
                                >
                                    {paymentStatus === 'idle' && `Pay $${stripeAmount}`}
                                    {paymentStatus === 'processing' && 'Processing...'}
                                    {paymentStatus === 'success' && 'Payment Complete!'}
                                </button>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-4 text-center">
                            <p className="text-[10px] text-slate-400 font-medium">
                                Powered by <span className="font-bold">Stripe</span> | Secured by <span className="font-bold">Quantum Financial</span>
                            </p>
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
                    background: rgba(255, 255, 255, 0.05);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(6, 182, 212, 0.3);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(6, 182, 212, 0.5);
                }
            `}} />
        </div>
    );
};

export default APIStatusView;