import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import Card from './Card';
import type { FeatureDetails } from '../types';

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================

const DEMO_BANK_NAME = "Quantum Financial";
const AI_MODEL_NAME = "gemini-2.0-flash-exp"; // Fallback to stable if preview fails, but we try preview first.
const SYSTEM_INSTRUCTION = `
You are the AI Concierge for ${DEMO_BANK_NAME} (formerly referenced as Citibank in legacy documentation). 
Your goal is to provide a "Golden Ticket" experience. 
Tone: Elite, Professional, High-Performance, Secure. 
Metaphor: Let the user "kick the tires" and "see the engine roar".
Do NOT use the name "Citibank". Use "${DEMO_BANK_NAME}".
The user is testing a business banking demo.
If asked about features, explain:
- Robust Payment & Collection (Wire, ACH)
- Security (MFA, Fraud Monitoring)
- Reporting & Analytics
- Integration (ERP, Accounting)
`;

// ============================================================================
// ASSETS & ICONS (Inline for self-containment)
// ============================================================================

const Icons = {
  Lock: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
  Shield: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  Chart: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>,
  Globe: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Zap: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  Send: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
  Terminal: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Check: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  X: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  Eye: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
};

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED' | 'SECURE';
  details: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'ai' | 'system';
  content: string;
  timestamp: number;
}

interface DemoState {
  balance: number;
  activeRegion: string;
  securityLevel: 'STANDARD' | 'ELEVATED' | 'MAXIMUM';
  pendingApprovals: number;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * @component AuditLogger
 * @description Displays a real-time scrolling log of system actions.
 * "AUDIT STORAGE: Every sensitive action must be logged."
 */
const AuditLogger: React.FC<{ logs: AuditLogEntry[] }> = ({ logs }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="bg-black/80 border border-gray-800 rounded-lg p-4 font-mono text-xs h-48 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-2 border-b border-gray-800 pb-2">
        <span className="text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <Icons.Shield /> Secure Audit Storage
        </span>
        <span className="text-green-500 animate-pulse">● LIVE</span>
      </div>
      <div className="overflow-y-auto flex-1 space-y-1 scrollbar-thin scrollbar-thumb-gray-700">
        {logs.map((log) => (
          <div key={log.id} className="flex gap-2 text-gray-300 hover:bg-gray-900/50 p-1 rounded transition-colors">
            <span className="text-gray-500">[{log.timestamp}]</span>
            <span className={`font-bold ${
              log.status === 'SUCCESS' ? 'text-green-400' : 
              log.status === 'SECURE' ? 'text-cyan-400' : 
              log.status === 'FAILED' ? 'text-red-400' : 'text-yellow-400'
            }`}>{log.status}</span>
            <span className="text-white">{log.action}</span>
            <span className="text-gray-600 truncate">- {log.details}</span>
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
};

/**
 * @component PopupForm
 * @description A generic modal for "PO up form" requirements.
 */
const PopupForm: React.FC<{ 
  isOpen: boolean; 
  title: string; 
  onClose: () => void; 
  onSubmit: (data: any) => void;
  children: React.ReactNode 
}> = ({ isOpen, title, onClose, onSubmit, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gray-900 border border-cyan-500/30 rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        <div className="bg-gray-800/50 p-4 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Icons.Lock /> {title}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <Icons.X />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
        <div className="bg-gray-800/50 p-4 border-t border-gray-700 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors">Cancel</button>
          <button 
            onClick={() => onSubmit({})} 
            className="px-4 py-2 text-sm bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold shadow-lg shadow-cyan-500/20 transition-all"
          >
            Execute Securely
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * @component AIChat
 * @description The "Chat Bar" powered by Gemini.
 */
const AIChat: React.FC<{ 
  messages: ChatMessage[]; 
  onSendMessage: (msg: string) => void; 
  isTyping: boolean;
}> = ({ messages, onSendMessage, isTyping }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[400px] bg-gray-900/50 border border-gray-700 rounded-xl overflow-hidden">
      <div className="bg-gray-800/80 p-3 border-b border-gray-700 flex justify-between items-center">
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
          <Icons.Zap /> Quantum AI Concierge
        </span>
        <span className="text-[10px] text-gray-500">Powered by Gemini 2.0</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.filter(m => m.role !== 'system').map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
              msg.role === 'user' 
                ? 'bg-cyan-900/30 text-cyan-100 border border-cyan-500/30 rounded-br-none' 
                : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-bl-none'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-800 p-3 rounded-lg rounded-bl-none border border-gray-700">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-3 bg-gray-800/50 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about cash flow, fraud, or global payments..."
            className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="p-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Icons.Send />
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface PaywallProps {
  details: FeatureDetails;
  onUnlock: () => void;
}

const Paywall: React.FC<PaywallProps> = ({ details, onUnlock }) => {
  // --- STATE ---
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 'init', role: 'system', content: SYSTEM_INSTRUCTION, timestamp: Date.now() },
    { id: 'welcome', role: 'ai', content: `Welcome to ${DEMO_BANK_NAME}. I am your dedicated AI financial strategist. How can I assist with your global operations today?`, timestamp: Date.now() }
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [demoState, setDemoState] = useState<DemoState>({
    balance: 24500000.00,
    activeRegion: 'North America',
    securityLevel: 'ELEVATED',
    pendingApprovals: 3
  });
  
  // Modal States
  const [showWireModal, setShowWireModal] = useState(false);
  const [wireDetails, setWireDetails] = useState({ recipient: '', amount: '' });

  // --- LOGGING SYSTEM ---
  const addLog = useCallback((action: string, status: AuditLogEntry['status'], details: string) => {
    const newLog: AuditLogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString().split('T')[1].replace('Z', ''),
      action,
      status,
      details
    };
    setLogs(prev => [...prev, newLog]);
  }, []);

  // --- AI INTEGRATION ---
  const handleSendMessage = async (content: string) => {
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content, timestamp: Date.now() };
    setChatMessages(prev => [...prev, userMsg]);
    setIsAiTyping(true);
    addLog('AI_INTERACTION', 'PENDING', 'Processing user query via Gemini Node');

    try {
      // Initialize Gemini
      // NOTE: In a real app, ensure process.env.GEMINI_API_KEY is available.
      // If not, we simulate a response to keep the demo alive.
      const apiKey = process.env.GEMINI_API_KEY || ''; 
      
      let aiResponseText = "";

      if (apiKey) {
        const genAI = new GoogleGenAI({ apiKey });
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.0-flash-exp",
            systemInstruction: SYSTEM_INSTRUCTION
        });

        const chat = model.startChat({
            history: chatMessages.map(m => ({
                role: m.role === 'ai' ? 'model' : m.role,
                parts: [{ text: m.content }]
            })).filter(m => m.role !== 'system')
        });

        const result = await chat.sendMessage(content);
        aiResponseText = result.response.text();
      } else {
        // Fallback simulation if no key provided
        await new Promise(r => setTimeout(r, 1500));
        aiResponseText = `[DEMO MODE - NO API KEY] I understand you're asking about "${content}". In the live ${DEMO_BANK_NAME} environment, I would provide real-time analytics. Currently, I can show you our Wire Transfer capabilities or Security Audit logs.`;
      }

      const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'ai', content: aiResponseText, timestamp: Date.now() };
      setChatMessages(prev => [...prev, aiMsg]);
      addLog('AI_INTERACTION', 'SUCCESS', 'Response generated successfully');

      // "Create the shit it needs" - Simple heuristic to trigger UI actions based on chat
      if (content.toLowerCase().includes('wire') || content.toLowerCase().includes('transfer')) {
        setShowWireModal(true);
        addLog('UI_AUTOMATION', 'SECURE', 'AI triggered Wire Transfer Modal');
      }

    } catch (error) {
      console.error("AI Error:", error);
      addLog('AI_INTERACTION', 'FAILED', 'Connection to Neural Core interrupted');
      setChatMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'ai', 
        content: "I apologize, but I'm experiencing a momentary disconnect from the secure core. Please try again.", 
        timestamp: Date.now() 
      }]);
    } finally {
      setIsAiTyping(false);
    }
  };

  // --- ACTIONS ---
  const handleWireSubmit = () => {
    addLog('WIRE_TRANSFER', 'PENDING', `Initiating transfer of ${wireDetails.amount || '$0.00'}...`);
    setTimeout(() => {
      addLog('FRAUD_CHECK', 'SECURE', 'Scanning recipient against OFAC lists...');
      setTimeout(() => {
        addLog('WIRE_TRANSFER', 'SUCCESS', 'Funds released. Trace ID: #TRX-9982-Q');
        setDemoState(prev => ({ ...prev, balance: prev.balance - (parseFloat(wireDetails.amount) || 0) }));
        setShowWireModal(false);
        setWireDetails({ recipient: '', amount: '' });
      }, 1200);
    }, 800);
  };

  // --- RENDER ---
  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6 animate-in fade-in zoom-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="text-center py-8 relative overflow-hidden rounded-2xl bg-gradient-to-b from-gray-900 to-black border border-gray-800">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-cyan-900/20 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-4">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            Live Demo Environment
          </div>
          <h1 className="text-5xl font-black text-white tracking-tight mb-2">
            {DEMO_BANK_NAME}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Experience the future of institutional finance. Kick the tires. See the engine roar.
          </p>
        </div>
        
        {/* Background decorative elements */}
        <div className="absolute top-1/2 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: AI CONCIERGE (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card variant="interactive" className="h-full border-cyan-500/20">
            <div className="p-4">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Icons.Terminal /> Command Center
              </h3>
              <AIChat 
                messages={chatMessages} 
                onSendMessage={handleSendMessage} 
                isTyping={isAiTyping} 
              />
              <div className="mt-4 p-4 bg-blue-900/20 rounded-lg border border-blue-500/20">
                <h4 className="text-xs font-bold text-blue-400 uppercase mb-2">Suggested Commands</h4>
                <div className="flex flex-wrap gap-2">
                  {["Initiate Wire", "Show Fraud Reports", "Analyze Cash Flow", "Audit Logs"].map(cmd => (
                    <button 
                      key={cmd}
                      onClick={() => handleSendMessage(cmd)}
                      className="text-[10px] px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded border border-gray-600 transition-colors"
                    >
                      {cmd}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: DASHBOARD & FEATURES (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* METRICS ROW */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card variant="default" className="bg-gradient-to-br from-gray-800 to-gray-900">
              <div className="p-4">
                <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Global Liquidity</div>
                <div className="text-2xl font-mono text-white font-bold">
                  ${demoState.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div className="text-green-400 text-xs mt-2 flex items-center gap-1">
                  <Icons.Chart /> +2.4% vs Last Close
                </div>
              </div>
            </Card>
            <Card variant="default">
              <div className="p-4">
                <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Security Posture</div>
                <div className="text-2xl font-mono text-cyan-400 font-bold flex items-center gap-2">
                  <Icons.Shield /> {demoState.securityLevel}
                </div>
                <div className="text-gray-500 text-xs mt-2">
                  Real-time threat monitoring active
                </div>
              </div>
            </Card>
            <Card variant="default">
              <div className="p-4">
                <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Pending Actions</div>
                <div className="text-2xl font-mono text-yellow-400 font-bold">
                  {demoState.pendingApprovals}
                </div>
                <div className="text-gray-500 text-xs mt-2">
                  Requires executive authorization
                </div>
              </div>
            </Card>
          </div>

          {/* MAIN FEATURE AREA */}
          <Card variant="outline" className="min-h-[300px] relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
            <div className="p-6 relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Enterprise Capabilities</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setShowWireModal(true); addLog('USER_ACTION', 'PENDING', 'Opened Wire Transfer Form'); }}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Icons.Send /> New Transfer
                  </button>
                  <button 
                    onClick={() => addLog('REPORT_GEN', 'SUCCESS', 'Generated Q3 Financial Outlook PDF')}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Icons.Chart /> Reports
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg group-hover:bg-purple-500 group-hover:text-white transition-colors">
                        <Icons.Globe />
                      </div>
                      <h4 className="font-bold text-gray-200">Global Payments</h4>
                    </div>
                    <p className="text-xs text-gray-400">
                      Execute cross-border transactions in 140+ currencies with real-time FX rates and automated hedging.
                    </p>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-green-500/20 text-green-400 rounded-lg group-hover:bg-green-500 group-hover:text-white transition-colors">
                        <Icons.Lock />
                      </div>
                      <h4 className="font-bold text-gray-200">Fraud Protection</h4>
                    </div>
                    <p className="text-xs text-gray-400">
                      AI-driven anomaly detection monitors every transaction. Biometric approval workflows included.
                    </p>
                  </div>
                </div>

                {/* Simulated Chart/Graph Area */}
                <div className="bg-gray-900/80 rounded-xl border border-gray-800 p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-gray-500 uppercase">Cash Flow Velocity</span>
                    <span className="text-xs text-green-400">+12.5%</span>
                  </div>
                  <div className="flex items-end justify-between h-32 gap-2">
                    {[40, 65, 45, 80, 55, 90, 70, 85].map((h, i) => (
                      <div key={i} className="w-full bg-cyan-900/30 rounded-t-sm relative group">
                        <div 
                          className="absolute bottom-0 left-0 right-0 bg-cyan-500/50 group-hover:bg-cyan-400 transition-all duration-300"
                          style={{ height: `${h}%` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-gray-600 font-mono">
                    <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* AUDIT LOG */}
          <AuditLogger logs={logs} />

        </div>
      </div>

      {/* FOOTER / UNLOCK CTA */}
      <div className="mt-12 text-center">
        <div className="inline-block p-[1px] rounded-xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500">
          <button 
            onClick={onUnlock} 
            className="px-12 py-4 bg-gray-900 rounded-xl text-white font-bold text-lg hover:bg-gray-800 transition-all active:scale-95 flex items-center gap-3"
          >
            <span>Unlock Full Platform Access</span>
            <Icons.Zap />
          </button>
        </div>
        <p className="mt-4 text-xs text-gray-500 max-w-md mx-auto">
          By proceeding, you acknowledge that this is a demonstration environment. 
          {DEMO_BANK_NAME} utilizes advanced AI for simulation purposes.
        </p>
      </div>

      {/* MODALS */}
      <PopupForm 
        isOpen={showWireModal} 
        onClose={() => setShowWireModal(false)} 
        title="Initiate Secure Wire"
        onSubmit={handleWireSubmit}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Beneficiary Name</label>
            <input 
              type="text" 
              className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white focus:border-cyan-500 outline-none"
              placeholder="e.g. Acme Corp International"
              value={wireDetails.recipient}
              onChange={e => setWireDetails({...wireDetails, recipient: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Amount (USD)</label>
            <input 
              type="number" 
              className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white focus:border-cyan-500 outline-none"
              placeholder="0.00"
              value={wireDetails.amount}
              onChange={e => setWireDetails({...wireDetails, amount: e.target.value})}
            />
          </div>
          <div className="p-3 bg-yellow-900/20 border border-yellow-600/30 rounded text-xs text-yellow-200 flex gap-2">
            <Icons.Eye />
            <span>This transaction will be logged in the immutable audit trail.</span>
          </div>
        </div>
      </PopupForm>

    </div>
  );
};

export default Paywall;