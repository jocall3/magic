import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";

// =================================================================================================
// QUANTUM FINANCIAL: REAL ESTATE EMPIRE DEMO
// "The Golden Ticket" Experience
// =================================================================================================
//
// PHILOSOPHY:
// This component is designed as a high-performance "Test Drive" of the Quantum Financial
// Real Estate management engine. It demonstrates robust payment capabilities,
// non-negotiable security via audit logging, and deep AI integration.
//
// METAPHOR:
// We are letting the user "Kick the tires" and "See the engine roar".
// The UI is the dashboard of a supercar: sleek, responsive, and powerful.
//
// =================================================================================================

// --- CONFIGURATION & SECRETS ---
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || localStorage.getItem('GEMINI_API_KEY') || '';
const DEMO_BANK_NAME = "Quantum Financial";
const AI_MODEL_NAME = "gemini-2.0-flash-exp"; // Using a fast model for demo responsiveness

// --- TYPES & INTERFACES ---

type AssetType = 'Commercial' | 'Residential' | 'Industrial' | 'Data Center' | 'Synthetic';
type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';
type AuditAction = 'ASSET_ACQUISITION' | 'LIQUIDATION' | 'VALUATION_UPDATE' | 'AI_QUERY' | 'SECURITY_ALERT' | 'SYSTEM_OVERRIDE';

interface RealEstateAsset {
  id: string;
  name: string;
  location: string;
  type: AssetType;
  marketValue: number;
  purchasePrice: number;
  capRate: number;
  occupancyRate: number;
  riskScore: number; // 0-100
  lastAudit: string;
  imageUrl?: string;
  features: string[];
}

interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: AuditAction;
  user: string;
  details: string;
  hash: string; // Simulated cryptographic hash
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: number;
  isTyping?: boolean;
}

// --- MOCK DATA GENERATORS ---

const LOCATIONS = ['New York, NY', 'London, UK', 'Singapore, SG', 'Tokyo, JP', 'Dubai, UAE', 'Zurich, CH', 'Austin, TX', 'Frankfurt, DE'];
const ASSET_NAMES = ['Quantum Tower', 'Nexus Hub', 'Alpha Industrial Park', 'Sovereign Heights', 'Omega Data Fortress', 'Prime Logistics Center'];

const generateId = () => Math.random().toString(36).substring(2, 9).toUpperCase();

const generateAsset = (index: number): RealEstateAsset => {
  const type = ['Commercial', 'Residential', 'Industrial', 'Data Center'][Math.floor(Math.random() * 4)] as AssetType;
  const baseValue = Math.floor(Math.random() * 50000000) + 5000000;
  
  return {
    id: `AST-${generateId()}`,
    name: `${ASSET_NAMES[Math.floor(Math.random() * ASSET_NAMES.length)]} ${String(index + 1).padStart(3, '0')}`,
    location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
    type,
    marketValue: baseValue,
    purchasePrice: baseValue * (0.8 + Math.random() * 0.4),
    capRate: 0.03 + Math.random() * 0.05,
    occupancyRate: 0.7 + Math.random() * 0.3,
    riskScore: Math.floor(Math.random() * 100),
    lastAudit: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    features: ['LEED Certified', 'Smart Building', 'High Security', 'Fiber Optic Backbone'].slice(0, Math.floor(Math.random() * 4) + 1)
  };
};

const INITIAL_ASSETS = Array.from({ length: 12 }, (_, i) => generateAsset(i));

// --- UTILITY FUNCTIONS ---

const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
const formatPercent = (val: number) => new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2 }).format(val);

// --- COMPONENTS ---

/**
 * A high-polish button component with hover effects.
 */
const QuantumButton: React.FC<{
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}> = ({ onClick, children, variant = 'primary', className = '', disabled = false, icon }) => {
  const baseStyle = "relative overflow-hidden px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wider text-xs";
  
  const variants = {
    primary: "bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(8,145,178,0.5)] border border-cyan-400/30",
    secondary: "bg-slate-800 hover:bg-slate-700 text-cyan-100 border border-slate-600 hover:border-cyan-500/50",
    danger: "bg-red-900/80 hover:bg-red-800 text-red-100 border border-red-700 shadow-[0_0_10px_rgba(220,38,38,0.3)]",
    ghost: "bg-transparent hover:bg-white/5 text-slate-400 hover:text-white"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'active:scale-95'}`}
    >
      {icon && <span className="text-lg">{icon}</span>}
      {children}
    </button>
  );
};

/**
 * The "Audit Storage" Log Viewer.
 * Essential for the "Security is non-negotiable" requirement.
 */
const AuditLogViewer: React.FC<{ logs: AuditLogEntry[] }> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-black/40 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden flex flex-col h-64 font-mono text-xs">
      <div className="bg-slate-900/80 p-2 border-b border-slate-800 flex justify-between items-center">
        <span className="text-cyan-500 font-bold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          SECURE AUDIT STORAGE
        </span>
        <span className="text-slate-500">ENCRYPTED :: IMMUTABLE</span>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-slate-700">
        {logs.length === 0 && <div className="text-slate-600 italic text-center mt-10">No audit records found. System initialized.</div>}
        {logs.map((log) => (
          <div key={log.id} className="flex gap-3 text-slate-300 border-l-2 border-slate-700 pl-2 hover:bg-white/5 transition-colors p-1">
            <span className="text-slate-500 whitespace-nowrap">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
            <span className={`font-bold ${log.action === 'SECURITY_ALERT' ? 'text-red-400' : 'text-cyan-400'}`}>{log.action}</span>
            <span className="flex-1 truncate text-slate-400">{log.details}</span>
            <span className="text-slate-600 text-[10px] font-mono hidden xl:block">{log.hash}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * AI Chat Interface.
 * The "Co-pilot" for the user.
 */
const AIChatInterface: React.FC<{ 
  chatHistory: ChatMessage[]; 
  onSendMessage: (msg: string) => void; 
  isProcessing: boolean;
}> = ({ chatHistory, onSendMessage, isProcessing }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/50 border-l border-slate-800 backdrop-blur-sm">
      <div className="p-4 border-b border-slate-800 bg-slate-900/80">
        <h3 className="text-cyan-400 font-bold text-sm tracking-widest uppercase flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          Quantum Intelligence
        </h3>
        <p className="text-xs text-slate-500">Powered by Gemini 2.0 Flash</p>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${
              msg.sender === 'user' 
                ? 'bg-cyan-900/40 text-cyan-100 border border-cyan-800/50 rounded-tr-none' 
                : msg.sender === 'system'
                ? 'bg-slate-800/50 text-slate-300 border border-slate-700 text-xs font-mono'
                : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-slate-800 rounded-2xl rounded-tl-none p-3 border border-slate-700">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-900/80">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Quantum AI to analyze, acquire, or report..."
            className="flex-1 bg-black/30 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <button 
            onClick={handleSend}
            disabled={isProcessing || !input.trim()}
            className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white p-2 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Modal for Forms (PO Up Form).
 */
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// =================================================================================================
// MAIN COMPONENT: REAL ESTATE EMPIRE
// =================================================================================================

export const RealEstateEmpire: React.FC = () => {
  // --- STATE ---
  const [assets, setAssets] = useState<RealEstateAsset[]>(INITIAL_ASSETS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { id: 'welcome', sender: 'ai', text: `Welcome to ${DEMO_BANK_NAME} Real Estate Command. I am your Quantum AI Advisor. How can I assist with your portfolio today?`, timestamp: Date.now() }
  ]);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<RealEstateAsset | null>(null);
  
  // Modal States
  const [isAcquireModalOpen, setIsAcquireModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  
  // Form States
  const [acquireForm, setAcquireForm] = useState({ name: '', value: '', type: 'Commercial' });

  // --- AI INITIALIZATION ---
  const genAI = useMemo(() => new GoogleGenAI(GEMINI_API_KEY), []);
  const model = useMemo(() => genAI.getGenerativeModel({ model: AI_MODEL_NAME }), [genAI]);

  // --- AUDIT SYSTEM ---
  const logAction = useCallback((action: AuditAction, details: string, user: string = 'ADMIN_USER') => {
    const newLog: AuditLogEntry = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      action,
      user,
      details,
      hash: Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('') // Simulated Hash
    };
    setAuditLogs(prev => [...prev, newLog]);
  }, []);

  // --- AI LOGIC ---
  const handleAIQuery = async (prompt: string) => {
    // Add user message
    const userMsg: ChatMessage = { id: generateId(), sender: 'user', text: prompt, timestamp: Date.now() };
    setChatHistory(prev => [...prev, userMsg]);
    setIsAIProcessing(true);

    try {
      // Contextualize the AI with current portfolio state
      const portfolioSummary = assets.map(a => `${a.name} (${a.type}): $${(a.marketValue/1000000).toFixed(1)}M`).join(', ');
      const systemPrompt = `
        You are the AI Financial Advisor for ${DEMO_BANK_NAME}. 
        Current Portfolio: ${portfolioSummary}.
        User Query: "${prompt}".
        
        If the user asks to create or acquire an asset, respond with a JSON object strictly in this format: {"action": "CREATE_ASSET", "name": "Asset Name", "type": "Commercial", "value": 1000000}.
        If the user asks for analysis, provide a professional, elite financial insight.
        Keep responses concise, professional, and confident.
      `;

      const result = await model.generateContent(systemPrompt);
      const responseText = result.response.text();

      // Check for "Actionable" JSON in response
      try {
        const jsonMatch = responseText.match(/\{.*\}/s);
        if (jsonMatch) {
          const actionData = JSON.parse(jsonMatch[0]);
          if (actionData.action === 'CREATE_ASSET') {
            // Execute AI Command
            const newAsset: RealEstateAsset = {
              ...generateAsset(assets.length),
              name: actionData.name || 'AI Acquired Asset',
              type: actionData.type || 'Commercial',
              marketValue: actionData.value || 5000000,
              purchasePrice: (actionData.value || 5000000),
            };
            setAssets(prev => [newAsset, ...prev]);
            logAction('ASSET_ACQUISITION', `AI Agent acquired ${newAsset.name} valued at ${formatCurrency(newAsset.marketValue)}`);
            
            setChatHistory(prev => [...prev, { 
              id: generateId(), 
              sender: 'ai', 
              text: `I have executed the acquisition of ${newAsset.name} as requested. The asset has been added to your portfolio and the transaction logged in the audit chain.`, 
              timestamp: Date.now() 
            }]);
            setIsAIProcessing(false);
            return;
          }
        }
      } catch (e) {
        // Not JSON, treat as text
      }

      setChatHistory(prev => [...prev, { id: generateId(), sender: 'ai', text: responseText, timestamp: Date.now() }]);
      logAction('AI_QUERY', `User queried AI: ${prompt.substring(0, 30)}...`);

    } catch (error) {
      console.error("AI Error", error);
      setChatHistory(prev => [...prev, { id: generateId(), sender: 'system', text: "Connection to Quantum Core interrupted. Please verify API credentials.", timestamp: Date.now() }]);
    } finally {
      setIsAIProcessing(false);
    }
  };

  // --- HANDLERS ---
  const handleManualAcquire = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(acquireForm.value) || 1000000;
    const newAsset: RealEstateAsset = {
      ...generateAsset(assets.length),
      name: acquireForm.name,
      type: acquireForm.type as AssetType,
      marketValue: val,
      purchasePrice: val,
    };
    setAssets(prev => [newAsset, ...prev]);
    logAction('ASSET_ACQUISITION', `Manual acquisition of ${newAsset.name}`);
    setIsAcquireModalOpen(false);
    setAcquireForm({ name: '', value: '', type: 'Commercial' });
  };

  const handleRunAudit = () => {
    setIsAuditModalOpen(false);
    logAction('SECURITY_ALERT', 'Full System Integrity Scan Initiated by User');
    setTimeout(() => {
      logAction('SYSTEM_OVERRIDE', 'Integrity Scan Complete: 100% Secure. Zero Vulnerabilities Detected.');
    }, 1500);
  };

  // --- RENDER HELPERS ---
  const totalValue = useMemo(() => assets.reduce((sum, a) => sum + a.marketValue, 0), [assets]);
  const avgCapRate = useMemo(() => assets.reduce((sum, a) => sum + a.capRate, 0) / assets.length, [assets]);

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-slate-200 font-sans overflow-hidden selection:bg-cyan-500/30">
      
      {/* --- HEADER: THE COCKPIT DASHBOARD --- */}
      <header className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6 shrink-0 z-20 relative">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-blue-800 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-900/20">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">{DEMO_BANK_NAME} <span className="text-cyan-500 font-light">Real Estate</span></h1>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              System Operational
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right hidden md:block">
            <div className="text-xs text-slate-500 uppercase">Total AUM</div>
            <div className="text-xl font-mono font-bold text-white">{formatCurrency(totalValue)}</div>
          </div>
          <div className="text-right hidden md:block">
            <div className="text-xs text-slate-500 uppercase">Avg Cap Rate</div>
            <div className="text-xl font-mono font-bold text-cyan-400">{formatPercent(avgCapRate)}</div>
          </div>
          <div className="h-8 w-px bg-slate-800 mx-2"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-cyan-500">JB</div>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* LEFT PANEL: ASSET GRID (THE ENGINE) */}
        <main className="flex-1 flex flex-col overflow-hidden relative z-10">
          
          {/* Toolbar */}
          <div className="h-14 border-b border-slate-800 bg-slate-900/30 flex items-center justify-between px-6 backdrop-blur-sm">
            <div className="flex gap-2">
              <QuantumButton variant="primary" onClick={() => setIsAcquireModalOpen(true)} icon="+">Acquire Asset</QuantumButton>
              <QuantumButton variant="secondary" onClick={() => setIsAuditModalOpen(true)}>Run Security Audit</QuantumButton>
            </div>
            <div className="flex gap-2 text-sm text-slate-400">
              <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 cursor-pointer hover:text-white hover:border-cyan-500 transition-colors">All Assets</span>
              <span className="px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50 cursor-pointer hover:text-white transition-colors">High Yield</span>
              <span className="px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50 cursor-pointer hover:text-white transition-colors">Risk Watch</span>
            </div>
          </div>

          {/* Asset Grid */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {assets.map((asset) => (
                <div 
                  key={asset.id}
                  onClick={() => setSelectedAsset(asset)}
                  className="group relative bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] transition-all duration-300 cursor-pointer"
                >
                  {/* Card Header */}
                  <div className="h-32 bg-gradient-to-b from-slate-800 to-slate-900 relative p-4 flex flex-col justify-between">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                    <div className="flex justify-between items-start relative z-10">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        asset.type === 'Commercial' ? 'bg-blue-900/50 text-blue-200 border border-blue-700/50' :
                        asset.type === 'Residential' ? 'bg-green-900/50 text-green-200 border border-green-700/50' :
                        'bg-purple-900/50 text-purple-200 border border-purple-700/50'
                      }`}>
                        {asset.type}
                      </span>
                      <span className={`text-xs font-bold ${asset.riskScore > 70 ? 'text-red-500' : 'text-slate-500'}`}>
                        RISK: {asset.riskScore}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white truncate relative z-10 group-hover:text-cyan-400 transition-colors">{asset.name}</h3>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-xs text-slate-500 uppercase">Market Value</div>
                        <div className="text-xl font-mono text-white">{formatCurrency(asset.marketValue)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-500 uppercase">Cap Rate</div>
                        <div className="text-sm font-mono text-cyan-400">{formatPercent(asset.capRate)}</div>
                      </div>
                    </div>
                    
                    <div className="h-px bg-slate-800"></div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <span className="truncate">{asset.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{formatPercent(asset.occupancyRate)} Occ.</span>
                      </div>
                    </div>
                  </div>

                  {/* Hover Action Overlay */}
                  <div className="absolute inset-0 bg-cyan-900/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
                    <button className="px-6 py-2 bg-white text-cyan-900 font-bold rounded-full hover:scale-105 transition-transform">View Details</button>
                    <button className="px-6 py-2 border border-white text-white font-bold rounded-full hover:bg-white/10 transition-colors">Run Valuation</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Panel: Audit Logs */}
          <div className="h-64 border-t border-slate-800 bg-slate-950 p-4">
            <AuditLogViewer logs={auditLogs} />
          </div>
        </main>

        {/* RIGHT PANEL: AI SIDEBAR */}
        <aside className="w-96 border-l border-slate-800 bg-slate-950 flex flex-col z-20 shadow-2xl">
          <AIChatInterface 
            chatHistory={chatHistory} 
            onSendMessage={handleAIQuery} 
            isProcessing={isAIProcessing} 
          />
        </aside>

      </div>

      {/* --- MODALS --- */}
      
      {/* Acquire Asset Modal */}
      <Modal isOpen={isAcquireModalOpen} onClose={() => setIsAcquireModalOpen(false)} title="New Asset Acquisition">
        <form onSubmit={handleManualAcquire} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Asset Name</label>
            <input 
              type="text" 
              required
              value={acquireForm.name}
              onChange={e => setAcquireForm({...acquireForm, name: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white focus:border-cyan-500 outline-none"
              placeholder="e.g. Quantum Plaza"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Asset Type</label>
            <select 
              value={acquireForm.type}
              onChange={e => setAcquireForm({...acquireForm, type: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white focus:border-cyan-500 outline-none"
            >
              <option value="Commercial">Commercial</option>
              <option value="Residential">Residential</option>
              <option value="Industrial">Industrial</option>
              <option value="Data Center">Data Center</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Estimated Value (USD)</label>
            <input 
              type="number" 
              required
              value={acquireForm.value}
              onChange={e => setAcquireForm({...acquireForm, value: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white focus:border-cyan-500 outline-none"
              placeholder="5000000"
            />
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setIsAcquireModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-bold">Execute Purchase</button>
          </div>
        </form>
      </Modal>

      {/* Security Audit Modal */}
      <Modal isOpen={isAuditModalOpen} onClose={() => setIsAuditModalOpen(false)} title="System Security Audit">
        <div className="text-center space-y-6 py-4">
          <div className="w-20 h-20 mx-auto bg-slate-800 rounded-full flex items-center justify-center relative">
            <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full animate-ping"></div>
            <svg className="w-10 h-10 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <div>
            <h4 className="text-lg font-bold text-white">Initiate Deep Scan?</h4>
            <p className="text-slate-400 text-sm mt-2">This will verify ledger integrity, check for unauthorized access patterns, and validate all asset hashes against the blockchain.</p>
          </div>
          <div className="flex justify-center gap-4">
            <button onClick={() => setIsAuditModalOpen(false)} className="px-6 py-2 border border-slate-600 text-slate-300 rounded hover:bg-slate-800">Cancel</button>
            <button onClick={handleRunAudit} className="px-6 py-2 bg-cyan-600 text-white rounded font-bold hover:bg-cyan-500 shadow-[0_0_20px_rgba(8,145,178,0.4)]">Run Full Audit</button>
          </div>
        </div>
      </Modal>

      {/* Asset Detail Modal (Read Only) */}
      <Modal isOpen={!!selectedAsset} onClose={() => setSelectedAsset(null)} title={selectedAsset?.name || 'Asset Details'}>
        {selectedAsset && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800 p-3 rounded">
                <div className="text-xs text-slate-500 uppercase">Location</div>
                <div className="text-white font-medium">{selectedAsset.location}</div>
              </div>
              <div className="bg-slate-800 p-3 rounded">
                <div className="text-xs text-slate-500 uppercase">Type</div>
                <div className="text-white font-medium">{selectedAsset.type}</div>
              </div>
              <div className="bg-slate-800 p-3 rounded">
                <div className="text-xs text-slate-500 uppercase">Current Valuation</div>
                <div className="text-cyan-400 font-mono font-bold">{formatCurrency(selectedAsset.marketValue)}</div>
              </div>
              <div className="bg-slate-800 p-3 rounded">
                <div className="text-xs text-slate-500 uppercase">Purchase Price</div>
                <div className="text-slate-300 font-mono">{formatCurrency(selectedAsset.purchasePrice)}</div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-bold text-white mb-2">Features</h4>
              <div className="flex flex-wrap gap-2">
                {selectedAsset.features.map((f, i) => (
                  <span key={i} className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-slate-300">{f}</span>
                ))}
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded border border-slate-800 font-mono text-xs text-slate-500">
              <div>ID: {selectedAsset.id}</div>
              <div>LAST AUDIT: {selectedAsset.lastAudit}</div>
              <div>HASH: {selectedAsset.id.split('-')[1]}...[VERIFIED]</div>
            </div>

            <div className="flex justify-end">
              <button onClick={() => setSelectedAsset(null)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded">Close</button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default RealEstateEmpire;