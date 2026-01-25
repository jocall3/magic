import React, { useState, useEffect, useRef, useContext, useCallback, createContext } from 'react';
import { GoogleGenAI, ChatSession } from "@google/genai";
import { DataContext } from '../context/DataContext';
import { View } from '../types';
import Card from './Card';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

// ================================================================================================
// TYPE DEFINITIONS & AUDIT LOGGING
// ================================================================================================

export type AuditEntry = {
    timestamp: Date;
    action: string;
    actor: 'user' | 'ai' | 'system';
    details: string;
    securityLevel: 'standard' | 'elevated' | 'critical';
};

export type Message = {
    id: string;
    role: 'user' | 'model' | 'system';
    parts: { text: string }[];
    timestamp: Date;
    chartData?: any;
    tableData?: any;
    actionSuggestions?: ActionSuggestion[];
    isSecurityAlert?: boolean;
    auditRef?: string;
};

export type ActionSuggestion = {
    id: string;
    text: string;
    actionType: 'payment' | 'integration' | 'analytics' | 'security';
    payload?: any;
};

// ================================================================================================
// QUANTUM FINANCIAL TOOLS (WIRE, ACH, ERP, FRAUD)
// ================================================================================================

export const QUANTUM_TOOLS = {
    INITIATE_WIRE: {
        name: "initiateWireTransfer",
        description: "Initiates a high-value international or domestic wire transfer. Requires MFA simulation.",
        parameters: { type: 'object', properties: { amount: { type: 'number' }, recipient: { type: 'string' }, currency: { type: 'string' } } }
    },
    INITIATE_ACH: {
        name: "initiateACHCollection",
        description: "Sets up an ACH batch collection for payroll or vendor payments.",
        parameters: { type: 'object', properties: { batchName: { type: 'string' }, totalAmount: { type: 'number' } } }
    },
    SYNC_ERP: {
        name: "syncAccountingSoftware",
        description: "Synchronizes real-time banking data with ERP systems like SAP, Oracle, or NetSuite.",
        parameters: { type: 'object', properties: { system: { type: 'string' }, direction: { type: 'string' } } }
    },
    FRAUD_CHECK: {
        name: "runFraudAnalysis",
        description: "Executes a heuristic scan on recent transactions to identify anomalies or velocity risks.",
        parameters: { type: 'object', properties: { timeframe: { type: 'string' } } }
    }
};

// ================================================================================================
// CORE COMPONENT
// ================================================================================================

const AIAdvisorView: React.FC<{ previousView: View | null }> = ({ previousView }) => {
    const context = useContext(DataContext);
    const [messages, setMessages] = useState<Message[]>([]);
    const [auditTrail, setAuditTrail] = useState<AuditEntry[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isMfaActive, setIsMfaActive] = useState(false);
    
    const chatRef = useRef<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Audit Storage Simulation
    const logAction = useCallback((action: string, actor: 'user' | 'ai' | 'system', details: string, level: AuditEntry['securityLevel'] = 'standard') => {
        const entry: AuditEntry = { timestamp: new Date(), action, actor, details, securityLevel: level };
        setAuditTrail(prev => [...prev, entry]);
        console.log(`[AUDIT LOG]: ${entry.timestamp.toISOString()} | ${entry.actor.toUpperCase()} | ${entry.action} | ${entry.details}`);
    }, []);

    useEffect(() => {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
        chatRef.current = ai.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "You are the Quantum Financial AI Advisor. You provide elite, secure, and high-performance business banking insights. You can simulate Wire transfers, ACH collections, and ERP integrations. Always maintain a professional, secure tone. Mention that every action is logged in the secure audit vault."
        }).startChat({
            history: [],
            generationConfig: { maxOutputTokens: 1200 },
        });
        
        logAction("Session Initialized", "system", "Quantum AI Core connected to secure terminal.", "standard");
    }, [logAction]);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    const handleSendMessage = async (text: string, isAutoAction = false) => {
        if (!text.trim() || !chatRef.current) return;
        
        setIsLoading(true);
        const userMsg: Message = { id: Date.now().toString(), role: 'user', parts: [{ text }], timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        
        logAction("User Message", "user", text, isAutoAction ? "elevated" : "standard");

        try {
            // Simulate Tool Logic for Demo "Bells and Whistles"
            let responseText = "";
            let chartData = null;
            let actionSuggestions: ActionSuggestion[] = [];

            if (text.toLowerCase().includes("wire")) {
                responseText = "I have prepared the Wire Transfer protocol. For security, Quantum Financial requires a Multi-Factor Authentication handshake before proceeding with high-value movements.";
                setIsMfaActive(true);
                logAction("Wire Protocol Triggered", "ai", "Awaiting MFA verification for outbound wire.", "critical");
            } else if (text.toLowerCase().includes("health") || text.toLowerCase().includes("summarize")) {
                responseText = "Analyzing your global liquidity position. Your current cash flow is optimized, though I detect a 4% variance in your APAC accounts.";
                chartData = {
                    type: 'line',
                    data: {
                        labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
                        datasets: [{
                            label: 'Liquidity (USD Millions)',
                            data: [42, 45, 44, 48, 52, 51],
                            borderColor: '#06b6d4',
                            backgroundColor: 'rgba(6, 182, 212, 0.1)',
                            fill: true,
                            tension: 0.4
                        }]
                    }
                };
                actionSuggestions = [
                    { id: '1', text: 'Sync with NetSuite', actionType: 'integration' },
                    { id: '2', text: 'Run Fraud Scan', actionType: 'security' }
                ];
            } else {
                const result = await chatRef.current.sendMessage(text);
                responseText = result.response.text();
            }

            const modelMsg: Message = { 
                id: (Date.now() + 1).toString(), 
                role: 'model', 
                parts: [{ text: responseText }], 
                timestamp: new Date(),
                chartData,
                actionSuggestions
            };
            
            setMessages(prev => [...prev, modelMsg]);
            logAction("AI Response Generated", "ai", "Response delivered to secure terminal.", "standard");

        } catch (e) {
            setMessages(prev => [...prev, { id: 'err', role: 'model', parts: [{ text: "Quantum Core connection interrupted. Re-establishing secure link..." }], timestamp: new Date() }]);
        } finally { 
            setIsLoading(false); 
        }
    };

    const verifyMfa = () => {
        setIsMfaActive(false);
        logAction("MFA Verified", "system", "Biometric/Token handshake successful.", "critical");
        handleSendMessage("MFA Verified. Proceed with the secure wire transfer authorization.", true);
    };

    const examplePrompts = {
        [View.Dashboard]: ["Summarize my financial health.", "Run a fraud analysis on today's batch.", "Project my EOD liquidity."],
        [View.Transactions]: ["Find wires over $50,000.", "Sync recent ACH with ERP.", "Identify duplicate vendor payments."],
        DEFAULT: ["Initiate a domestic wire.", "Check ERP integration status.", "Show my audit trail summary."]
    };

    const prompts = examplePrompts[previousView || 'DEFAULT'] || examplePrompts.DEFAULT;

    return (
        <div className="h-full flex flex-col bg-slate-950 text-slate-200 font-sans">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-extrabold text-white tracking-tighter uppercase italic">Quantum AI Advisor</h2>
                    <p className="text-cyan-500 text-xs font-mono tracking-widest">SECURE TERMINAL // AUDIT LOGGING ACTIVE</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-md flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Vault Status: Encrypted</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-grow overflow-hidden">
                {/* Main Chat Area */}
                <Card className="lg:col-span-3 flex flex-col border-slate-800 bg-slate-900/50 backdrop-blur-xl" padding="none">
                    <div className="flex-grow p-6 space-y-6 overflow-y-auto custom-scrollbar">
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
                                <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center border border-cyan-500/20">
                                    <svg className="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Welcome to Quantum Financial Intelligence</h3>
                                    <p className="text-slate-400 max-w-md mx-auto mt-2">Your elite advisor for global treasury management, secure payments, and real-time analytics.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-2xl">
                                    {prompts.map((p, i) => (
                                        <button key={i} onClick={() => handleSendMessage(p)} className="p-4 bg-slate-800/50 hover:bg-cyan-900/20 hover:border-cyan-500/50 rounded-xl text-cyan-200 text-xs font-bold transition-all border border-slate-700 text-left flex flex-col justify-between group">
                                            <span>"{p}"</span>
                                            <span className="text-[10px] text-slate-500 mt-2 group-hover:text-cyan-400">Execute Command â†’</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-5 rounded-2xl shadow-2xl ${msg.role === 'user' ? 'bg-cyan-700 text-white ml-12' : 'bg-slate-800 border border-slate-700 text-slate-200 mr-12'}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-50">{msg.role === 'user' ? 'Authorized User' : 'Quantum AI'}</span>
                                        <span className="text-[10px] opacity-30">{msg.timestamp.toLocaleTimeString()}</span>
                                    </div>
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.parts[0].text}</p>
                                    
                                    {msg.chartData && (
                                        <div className="mt-4 p-4 bg-slate-950 rounded-xl border border-slate-700">
                                            <Chart type={msg.chartData.type} data={msg.chartData.data} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                                        </div>
                                    )}

                                    {msg.actionSuggestions && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {msg.actionSuggestions.map(action => (
                                                <button key={action.id} onClick={() => handleSendMessage(action.text)} className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-md text-[10px] font-bold text-cyan-400 hover:bg-cyan-500/20 transition-all">
                                                    {action.text}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isMfaActive && (
                            <div className="flex justify-start">
                                <div className="bg-amber-900/20 border border-amber-500/50 p-6 rounded-2xl w-full max-w-md">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center">
                                            <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                        </div>
                                        <div>
                                            <h4 className="text-amber-500 font-bold text-sm">MFA Challenge Required</h4>
                                            <p className="text-amber-200/60 text-[10px]">High-value transaction detected.</p>
                                        </div>
                                    </div>
                                    <button onClick={verifyMfa} className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-black text-xs rounded-lg transition-all shadow-lg shadow-amber-900/40">
                                        VERIFY BIOMETRICS
                                    </button>
                                </div>
                            </div>
                        )}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-slate-800 p-4 rounded-2xl flex items-center gap-3 border border-slate-700">
                                    <div className="flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                    </div>
                                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Quantum Processing...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 border-t border-slate-800 bg-slate-950/50">
                        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }} className="flex gap-3">
                            <div className="relative flex-grow">
                                <input 
                                    type="text" 
                                    value={input} 
                                    onChange={(e) => setInput(e.target.value)} 
                                    placeholder="Enter command or query..." 
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-5 py-4 text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600" 
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                                    <kbd className="hidden md:inline-flex items-center px-2 py-1 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-500 font-mono">CMD + K</kbd>
                                </div>
                            </div>
                            <button 
                                type="submit" 
                                disabled={isLoading || !input.trim()} 
                                className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-lg shadow-cyan-900/20"
                            >
                                Execute
                            </button>
                        </form>
                        <div className="mt-3 flex justify-between items-center px-2">
                            <div className="flex gap-4">
                                <span className="text-[9px] text-slate-500 font-bold uppercase">Wire: Ready</span>
                                <span className="text-[9px] text-slate-500 font-bold uppercase">ACH: Ready</span>
                                <span className="text-[9px] text-slate-500 font-bold uppercase">ERP: Connected</span>
                            </div>
                            <span className="text-[9px] text-slate-600 font-mono">v4.2.0-PRO</span>
                        </div>
                    </div>
                </Card>

                {/* Audit Sidebar */}
                <div className="hidden lg:flex flex-col gap-6">
                    <Card className="flex-grow border-slate-800 bg-slate-900/80" padding="none">
                        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secure Audit Vault</h3>
                            <div className="w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
                        </div>
                        <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar max-h-[500px]">
                            {auditTrail.slice().reverse().map((entry, idx) => (
                                <div key={idx} className="border-l-2 border-slate-800 pl-3 py-1">
                                    <div className="flex justify-between items-start">
                                        <span className={`text-[9px] font-bold uppercase ${entry.securityLevel === 'critical' ? 'text-amber-500' : 'text-cyan-500'}`}>
                                            {entry.action}
                                        </span>
                                        <span className="text-[8px] text-slate-600 font-mono">{entry.timestamp.toLocaleTimeString()}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{entry.details}</p>
                                </div>
                            ))}
                            {auditTrail.length === 0 && (
                                <div className="text-center py-10">
                                    <p className="text-[10px] text-slate-600 uppercase font-bold">No logs in current session</p>
                                </div>
                            )}
                        </div>
                    </Card>
                    
                    <Card className="border-slate-800 bg-cyan-950/20">
                        <h4 className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-3">System Integration</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-slate-400">SAP S/4HANA</span>
                                <span className="text-[9px] font-bold text-green-500">ACTIVE</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-slate-400">Oracle Cloud</span>
                                <span className="text-[9px] font-bold text-green-500">ACTIVE</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-slate-400">SWIFT Network</span>
                                <span className="text-[9px] font-bold text-cyan-500">STANDBY</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AIAdvisorView;