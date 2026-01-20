import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import Card from './Card';
import { DataContext } from '../context/DataContext';
import { 
    Bot, Send, Loader2, Cpu, User, Sparkles, ShieldCheck, 
    Zap, Lock, Database, Activity, CreditCard, Globe, 
    Key, Terminal, BarChart3, Layers, Settings, AlertCircle,
    ChevronRight, Fingerprint, Eye, EyeOff, Trash2, Plus
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

/**
 * QUANTUM FINANCIAL - SOVEREIGN AI ADVISOR MONOLITH
 * 
 * PHILOSOPHY:
 * - "Golden Ticket" Experience: High polish, elite performance.
 * - "Test Drive": Interactive, responsive, no-pressure.
 * - "Bells and Whistles": Homomorphic encryption simulation, Stripe integration, Audit logging.
 * - "Cheat Sheet": Direct access to complex banking tools via AI.
 */

// --- SECURE INTERNAL STORAGE (HOMOMORPHIC SIMULATION) ---
// This storage exists only in the app's memory (Ref), not the browser's localStorage.
const INTERNAL_VAULT = {
    keys: new Map<string, string>(),
    auditLog: [] as any[],
};

const AIAdvisorView: React.FC = () => {
    const context = useContext(DataContext);
    const { askSovereignAI } = context || { askSovereignAI: async (t: string) => "Context Error" };
    
    // --- STATE MANAGEMENT ---
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string, action?: string}[]>([
        { role: 'ai', text: 'Welcome to Quantum Financial. I am your Sovereign AI. Think of this as your golden ticket to global banking. Kick the tires. See the engine roar. How shall we optimize your reality today?' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [isVaultOpen, setIsVaultOpen] = useState(false);
    const [isAuditOpen, setIsAuditOpen] = useState(false);
    const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
    const [isWireModalOpen, setIsWireModalOpen] = useState(false);
    const [showKey, setShowKey] = useState<string | null>(null);
    const [auditLogs, setAuditLogs] = useState<any[]>([]);
    const [vaultKeys, setVaultKeys] = useState<{id: string, name: string, value: string}[]>([]);
    
    const scrollRef = useRef<HTMLDivElement>(null);
    const vaultRef = useRef(INTERNAL_VAULT);

    // --- AI INITIALIZATION (GOOGLE GENAI) ---
    const aiClient = useMemo(() => {
        // Using the provided snippet structure and Vercel secrets
        return new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY || 'DEMO_KEY_ACTIVE'
        });
    }, []);

    // --- AUDIT LOGGING SYSTEM ---
    const logAction = (action: string, details: any) => {
        const entry = {
            timestamp: new Date().toISOString(),
            action,
            details,
            id: Math.random().toString(36).substring(7),
            status: 'SECURED_AND_LOGGED'
        };
        vaultRef.current.auditLog.unshift(entry);
        setAuditLogs([...vaultRef.current.auditLog]);
    };

    // --- HOMOMORPHIC ENCRYPTION SIMULATION ---
    // Simulates performing operations on encrypted data without decryption
    const homomorphicProcess = (data: string) => {
        const salt = "QUANTUM_SALT_2024";
        const encrypted = btoa(data + salt).split('').reverse().join('');
        return `0x_HOMO_${encrypted}`;
    };

    // --- STRIPE SIMULATION ---
    const handleStripePayment = async (amount: number) => {
        setIsLoading(true);
        logAction('STRIPE_INITIATED', { amount, currency: 'USD' });
        
        // Simulate network latency
        await new Promise(r => setTimeout(r, 1500));
        
        logAction('STRIPE_SUCCESS', { transactionId: `pi_${Math.random().toString(36).substr(2, 9)}` });
        setMessages(prev => [...prev, { 
            role: 'ai', 
            text: `Payment of $${amount} processed successfully via Stripe Integration. Transaction logged in Audit Storage.` 
        }]);
        setIsLoading(false);
        setIsStripeModalOpen(false);
    };

    // --- AI COMMAND PARSER ---
    const processAICommand = async (text: string) => {
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes('wire') || lowerText.includes('transfer')) {
            setIsWireModalOpen(true);
            return "Opening the Secure Wire Transfer terminal. Please review the parameters.";
        }
        
        if (lowerText.includes('stripe') || lowerText.includes('pay')) {
            setIsStripeModalOpen(true);
            return "Initializing Stripe Payment Gateway. Secure tunnel established.";
        }

        if (lowerText.includes('vault') || lowerText.includes('key')) {
            setIsVaultOpen(true);
            return "Accessing the Homomorphic Key Vault. All data is encrypted at rest and in transit.";
        }

        if (lowerText.includes('audit') || lowerText.includes('log')) {
            setIsAuditOpen(true);
            return "Retrieving the immutable Audit Trail for your session.";
        }

        // Default AI Response using Google GenAI
        try {
            const response = await aiClient.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: `You are the Sovereign AI for Quantum Financial, an elite business banking platform. 
                The user says: "${text}". 
                Respond in a professional, high-performance, secure tone. 
                Mention features like ACH, Wire, Fraud Monitoring, or ERP integration if relevant. 
                Do NOT mention Citibank. Use "Quantum Financial".`,
            });
            return response.text || "Command processed. System optimal.";
        } catch (e) {
            // Fallback to context AI if GenAI fails or key is missing
            return await askSovereignAI(text);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        
        const userText = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userText }]);
        setIsLoading(true);
        
        logAction('USER_PROMPT', { text: userText });
        
        const responseText = await processAICommand(userText);
        
        setMessages(prev => [...prev, { role: 'ai', text: responseText }]);
        setIsLoading(false);
    };

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // --- UI COMPONENTS ---

    const Modal = ({ isOpen, onClose, title, children }: any) => {
        if (!isOpen) return null;
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="w-full max-w-2xl bg-gray-900 border border-indigo-500/30 rounded-3xl shadow-2xl overflow-hidden">
                    <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-indigo-500/5">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Zap className="text-indigo-400" size={20} />
                            {title}
                        </h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                            <Trash2 size={20} />
                        </button>
                    </div>
                    <div className="p-8">
                        {children}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700 h-[calc(100vh-100px)] flex flex-col">
            {/* Header: Elite Branding */}
            <header className="flex justify-between items-end border-b border-gray-800 pb-6 shrink-0">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="px-2 py-0.5 bg-indigo-500 text-[10px] font-black text-white rounded uppercase tracking-tighter">Elite</div>
                        <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Quantum Financial</h2>
                    </div>
                    <p className="text-indigo-400 text-[10px] font-mono tracking-[0.3em] uppercase">Neural_Banking_Core // Station_Alpha</p>
                </div>
                <div className="flex gap-4">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Security Status</span>
                        <div className="flex items-center gap-2 text-emerald-400">
                            <ShieldCheck size={14} />
                            <span className="text-xs font-mono font-bold">HOMOMORPHIC_ENCRYPTION_ACTIVE</span>
                        </div>
                    </div>
                    <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400 flex items-center gap-3">
                        <Activity className="animate-pulse" size={18} />
                        <div className="flex flex-col">
                            <span className="text-[9px] font-bold uppercase tracking-tighter opacity-60">System Load</span>
                            <span className="text-[10px] font-bold font-mono">0.0004ms Latency</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Main Chat Interface */}
                <Card className="flex-[2] flex flex-col overflow-hidden bg-black/60 border-indigo-900/30 relative group">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.05),transparent)] pointer-events-none"></div>
                    
                    {/* Chat Feed */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar relative z-10">