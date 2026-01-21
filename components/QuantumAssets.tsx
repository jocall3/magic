import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { 
    Atom, Zap, Share2, TrendingUp, History, Database, Cpu, Loader2, 
    MessageSquare, Send, Shield, Lock, FileText, Activity, 
    AlertTriangle, CheckCircle, XCircle, Plus, Search, 
    BarChart3, PieChart, Globe, Server, Terminal, Key,
    CreditCard, DollarSign, Briefcase, UserCheck, Eye,
    RefreshCw, Download, Upload, Settings, Bell,
    ChevronRight, ChevronDown, Maximize2, Minimize2
} from 'lucide-react';
import { 
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
    CartesianGrid, LineChart, Line, BarChart, Bar, Legend, ComposedChart,
    ReferenceLine
} from 'recharts';
import { GoogleGenAI } from "@google/genai";

// =================================================================================================
// QUANTUM FINANCIAL: THE GOLDEN TICKET EXPERIENCE
// =================================================================================================
// Philosophy:
// - This is a "Test Drive". The user is in the driver's seat.
// - "Bells and Whistles" are mandatory. High polish, elite feel.
// - No Pressure. Just pure, unadulterated financial power.
// - Security is paramount. Audit everything.
// =================================================================================================

// --- TYPES & INTERFACES ---

interface Asset {
    id: string;
    name: string;
    symbol: string;
    balance: number;
    rate: number;
    color: string;
    allocation: number;
    risk: 'Low' | 'Medium' | 'High' | 'Critical';
    type: 'Fiat' | 'Crypto' | 'Bond' | 'Commodity' | 'Equity';
}

interface AuditLog {
    id: string;
    timestamp: string;
    action: string;
    user: string;
    status: 'Success' | 'Failed' | 'Pending' | 'Warning';
    details: string;
    hash: string;
}

interface ChatMessage {
    id: string;
    role: 'user' | 'ai' | 'system';
    content: string;
    timestamp: Date;
    isTyping?: boolean;
}

interface SecurityAlert {
    id: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    message: string;
    timestamp: string;
    active: boolean;
}

// --- MOCK DATA GENERATORS ---

const generateMockAssets = (): Asset[] => [
    { id: 'cpc', name: 'Quantum Credits', symbol: 'QCR', balance: 45020.55, rate: 12.5, color: '#00f3ff', allocation: 35, risk: 'Medium', type: 'Crypto' },
    { id: 'dst', name: 'Global Liquidity', symbol: 'GLQ', balance: 128090.00, rate: 45.2, color: '#bc13fe', allocation: 45, risk: 'Low', type: 'Fiat' },
    { id: 'qbt', name: 'Sovereign Bonds', symbol: 'SVB', balance: 51200.00, rate: 0.8, color: '#ffffff', allocation: 10, risk: 'Low', type: 'Bond' },
    { id: 'nrg', name: 'Eco-Energy Futures', symbol: 'EEF', balance: 8890.45, rate: 8.4, color: '#00ff9d', allocation: 10, risk: 'High', type: 'Commodity' },
];

const generateChartData = (points: number) => {
    const data = [];
    let value = 1000;
    for (let i = 0; i < points; i++) {
        value += (Math.random() - 0.45) * 50;
        data.push({
            time: new Date(Date.now() - (points - i) * 60000).toLocaleTimeString(),
            value: Math.max(0, value),
            volume: Math.floor(Math.random() * 1000),
            prediction: value + (Math.random() - 0.5) * 20
        });
    }
    return data;
};

// --- HELPER COMPONENTS ---

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-gray-900 border border-cyan-500/30 rounded-2xl w-full max-w-2xl shadow-2xl shadow-cyan-500/20 overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-6 border-b border-gray-800 bg-gray-900/50">
                    <h3 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                        <Terminal className="text-cyan-400" size={20} />
                        {title}
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <XCircle size={24} />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const colors: Record<string, string> = {
        Success: 'bg-green-500/20 text-green-400 border-green-500/30',
        Failed: 'bg-red-500/20 text-red-400 border-red-500/30',
        Pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        Warning: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        Active: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    };
    const style = colors[status] || colors.Pending;
    return (
        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${style}`}>
            {status}
        </span>
    );
};

// =================================================================================================
// MAIN COMPONENT: QUANTUM ASSETS
// =================================================================================================

const QuantumAssets: React.FC = () => {
    // --- CONTEXT & STATE ---
    const { sovereignCredits, deductCredits, geminiApiKey, userProfile } = useContext(DataContext)!;
    
    // Core State
    const [assets, setAssets] = useState<Asset[]>(generateMockAssets());
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);
    const [chartData, setChartData] = useState(generateChartData(50));
    
    // UI State
    const [isSimulating, setIsSimulating] = useState(false);
    const [entanglementLevel, setEntanglementLevel] = useState(87.4);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'assets' | 'security' | 'reports'>('dashboard');
    const [showGuide, setShowGuide] = useState(false);
    const [showAddAssetModal, setShowAddAssetModal] = useState(false);
    
    // AI Chat State
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        { id: 'init', role: 'system', content: 'Quantum AI Core Online. Secure Channel Established.', timestamp: new Date() },
        { id: 'welcome', role: 'ai', content: 'Welcome to Quantum Financial. I am your dedicated AI architect. How can I assist with your portfolio today?', timestamp: new Date() }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [isAiProcessing, setIsAiProcessing] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Refs
    const chartInterval = useRef<NodeJS.Timeout | null>(null);

    // --- INITIALIZATION & EFFECTS ---

    useEffect(() => {
        // Simulate live data feed
        const interval = setInterval(() => {
            setEntanglementLevel(prev => Math.min(100, Math.max(0, prev + (Math.random() - 0.5) * 2)));
            
            setChartData(prev => {
                const last = prev[prev.length - 1];
                const newValue = Math.max(0, last.value + (Math.random() - 0.48) * 20);
                const newPoint = {
                    time: new Date().toLocaleTimeString(),
                    value: newValue,
                    volume: Math.floor(Math.random() * 1000),
                    prediction: newValue + (Math.random() - 0.5) * 15
                };
                return [...prev.slice(1), newPoint];
            });

            // Randomly update asset prices
            setAssets(prev => prev.map(a => ({
                ...a,
                balance: a.balance * (1 + (Math.random() - 0.5) * 0.001),
                rate: a.rate + (Math.random() - 0.5) * 0.1
            })));

        }, 2000);

        // Initial Audit Log
        addAuditLog('System', 'Initialization', 'Quantum Core modules loaded successfully.');

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    // --- CORE FUNCTIONS ---

    const addAuditLog = (user: string, action: string, details: string, status: AuditLog['status'] = 'Success') => {
        const newLog: AuditLog = {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString(),
            user,
            action,
            details,
            status,
            hash: '0x' + Math.random().toString(16).substr(2, 32) // Mock hash
        };
        setAuditLogs(prev => [newLog, ...prev].slice(0, 100));
    };

    const handleSimulate = () => {
        if (!deductCredits(1000)) {
            addAuditLog('User', 'Simulation', 'Insufficient credits for simulation.', 'Failed');
            return;
        }
        setIsSimulating(true);
        addAuditLog('User', 'Simulation', 'Started Monte Carlo simulation on portfolio assets.');
        
        setTimeout(() => {
            setIsSimulating(false);
            addAuditLog('System', 'Simulation', 'Simulation complete. Network resonance increased by 0.15%.');
            setSecurityAlerts(prev => [{
                id: Date.now().toString(),
                severity: 'Low',
                message: 'Simulation detected minor volatility in emerging markets.',
                timestamp: new Date().toLocaleTimeString(),
                active: true
            }, ...prev]);
        }, 3000);
    };

    // --- AI INTEGRATION ---

    const processAiCommand = async (prompt: string) => {
        setIsAiProcessing(true);
        
        // Add user message
        const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: prompt, timestamp: new Date() };
        setChatMessages(prev => [...prev, userMsg]);
        setChatInput('');

        try {
            let aiResponseText = '';
            
            if (geminiApiKey) {
                // REAL AI MODE
                const genAI = new GoogleGenAI({ apiKey: geminiApiKey });
                const model = genAI.getGenerativeModel({ 
                    model: "gemini-1.5-flash",
                    systemInstruction: `
                        You are the AI Core for "Quantum Financial" (formerly a demo for a major bank, but we don't say that name). 
                        Your tone is Elite, Professional, Secure, and High-Performance.
                        You are helping a user "Test Drive" this financial dashboard.
                        You can "create" assets, "run" simulations, or "analyze" data by outputting JSON commands.
                        
                        If the user asks to create an asset, output a JSON block like:
                        \`\`\`json
                        { "action": "create_asset", "data": { "name": "Asset Name", "symbol": "SYM", "balance": 1000, "type": "Crypto" } }
                        \`\`\`
                        
                        If the user asks to run a simulation, output:
                        \`\`\`json
                        { "action": "run_simulation" }
                        \