import React, { useState, useEffect, useRef } from 'react';
import { Landmark, ArrowRight, ShieldCheck, Activity, MessageSquare, X, Send, Terminal, Database, Car, Key, FileText, Save } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// --- Types & Interfaces ---

export interface CustomerAccount {
  id: string;
  accountNumberDisplay: string;
  name: string;
  balance: number;
  type: string;
  mask?: string;
  status: string;
  institutionId?: string;
}

interface AccountListProps {
  accounts: CustomerAccount[];
  onAccountSelect?: (accountId: string) => void;
}

interface ChatMessage {
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: number;
}

interface AuditRecord {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  user: string;
}

// --- Context & Configuration ---

// We sanitize the provided text to remove the specific bank name as requested
const CONTEXT_STORY = `
You are the AI assistant for a 32-year-old visionary who took a global bank's framework and transformed it into this "Demo Company" based on an interpretation of terms and conditions. 
The user is "test-driving" this financial vehicle. It's like test-driving a car – they get to kick the tires, see all the bells and whistles.
This platform is a secret weapon. It allows users to virtually walk through the entire platform.
Key features: Efficiency, clarity, international payments, fraud protection, cash flow insights.
The user experience is paramount. 
Do NOT use the name "Citibank". Refer to it as "The Global Demo Platform" or "The Engine".
If asked about the founder: He is 32, read the cryptic messages and an EIN 2021, and built this monolith.
`;

// --- Components ---

const AccountList: React.FC<AccountListProps> = ({ accounts, onAccountSelect }) => {
  // State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Welcome to the cockpit. I'm your co-pilot for this test drive. Ready to kick the tires?", timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showAuditForm, setShowAuditForm] = useState(false);
  const [auditLog, setAuditLog] = useState<AuditRecord[]>([]);
  
  // Form State
  const [formAction, setFormAction] = useState('');
  const [formDetails, setFormDetails] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Effects
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Load audit log from local storage
    const saved = localStorage.getItem('demo_audit_log');
    if (saved) setAuditLog(JSON.parse(saved));
  }, []);

  // --- Logic ---

  const saveAudit = (action: string, details: string) => {
    const newRecord: AuditRecord = {
      id: Math.random().toString(36).substr(2, 9),
      action,
      details,
      timestamp: new Date().toISOString(),
      user: 'Authorized_User_32'
    };
    const updatedLog = [newRecord, ...auditLog];
    setAuditLog(updatedLog);
    localStorage.setItem('demo_audit_log', JSON.stringify(updatedLog));
    return newRecord;
  };

  const handleAuditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveAudit(formAction || 'MANUAL_ENTRY', formDetails || 'User submitted form data');
    setShowAuditForm(false);
    setFormAction('');
    setFormDetails('');
    // Notify AI context
    addMessage('system', `User submitted audit form: ${formAction}`);
  };

  const addMessage = (role: 'user' | 'model' | 'system', text: string) => {
    setMessages(prev => [...prev, { role, text, timestamp: Date.now() }]);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    addMessage('user', userMsg);
    setIsTyping(true);

    try {
      // Check for "create" intent to trigger form
      if (userMsg.toLowerCase().includes('create') || userMsg.toLowerCase().includes('form') || userMsg.toLowerCase().includes('audit')) {
        setTimeout(() => {
            setShowAuditForm(true);
            addMessage('model', "I've pulled up the requisite PO form for that action. Please document this interaction for the audit storage.");
            setIsTyping(false);
        }, 800);
        return;
      }

      if (!apiKey) {
        // Simulation Mode if no key provided
        setTimeout(() => {
          const responses = [
            "I'm analyzing the telemetry. The engine is purring.",
            "That's a great question about the chassis of our financial system. It's built for speed.",
            "I can see you're checking the bells and whistles. This feature streamlines your cash flow significantly.",
            "Based on the terms and conditions, this operation is fully compliant. Proceeding with the demo.",
            "You're in the driver's seat. Where to next?"
          ];
          const randomResponse = responses[Math.floor(Math.random() * responses.length)];
          addMessage('model', randomResponse + " (Note: Enter Gemini API Key in settings for live AI generation)");
          setIsTyping(false);
        }, 1000);
        return;
      }

      // Real AI Call
      const genAI = new GoogleGenAI({ apiKey }); // Using the requested import style, assuming constructor takes object
      // Note: The import provided in prompt is `import { GoogleGenAI } from "@google/genai";`
      // The usage in prompt was `const ai = new GoogleGenAI({});` then `ai.models.generateContent`.
      // We adapt to that structure.
      
      // @ts-ignore - Handling potential library version differences dynamically
      const ai = new GoogleGenAI({ apiKey }); 
      const model = ai.models.generateContent ? ai.models : ai.getGenerativeModel({ model: "gemini-1.5-flash" }); 

      // Construct prompt
      const fullPrompt = `${CONTEXT_STORY}\n\nUser: ${userMsg}`;
      
      let responseText = "System Error.";
      
      if (ai.models && ai.models.generateContent) {
         // Prompt specific syntax
         const result = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: fullPrompt,
         });
         responseText = result.text || result.response?.text() || "No response text.";
      } else {
         // Fallback standard SDK syntax
         const result = await model.generateContent(fullPrompt);
         responseText = result.response.text();
      }

      addMessage('model', responseText);

    } catch (error) {
      console.error("AI Error", error);
      addMessage('model', "Engine stall. Please check your API Key or connection. " + (error as any).message);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="relative min-h-[600px] bg-black/90 rounded-3xl overflow-hidden border border-gray-800 shadow-2xl font-sans">
      
      {/* --- Header / Dashboard Top --- */}
      <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-black flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Car className="text-cyan-500" /> 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">
              DEMO CO. COCKPIT
            </span>
          </h2>
          <p className="text-xs text-gray-500 font-mono mt-1">EIN: 2021 // GLOBAL_INTERPRETATION_LAYER</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setShowAuditForm(true)}
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-mono rounded border border-gray-700 transition-colors flex items-center gap-2"
            >
                <FileText size={12} /> PO_FORM
            </button>
            <button 
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={`px-4 py-2 rounded-full font-bold text-sm transition-all duration-300 flex items-center gap-2 ${isChatOpen ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'bg-gray-800 text-cyan-400 border border-cyan-500/30'}`}
            >
                <MessageSquare size={16} />
                {isChatOpen ? 'CLOSE COMMS' : 'AI CO-PILOT'}
            </button>
        </div>
      </div>

      <div className="flex h-full relative">
        
        {/* --- Main Account List Content --- */}
        <div className={`flex-1 p-6 transition-all duration-500 ${isChatOpen ? 'w-2/3 pr-4' : 'w-full'}`}>
            <div className="mb-6 p-4 bg-emerald-900/10 border border-emerald-500/20 rounded-xl flex items-start gap-3">
                <Activity className="text-emerald-500 mt-1" size={20} />
                <div>
                    <h3 className="text-emerald-400 font-bold text-sm uppercase tracking-wider">System Status: Optimized</h3>
                    <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                        You are currently test-driving the enterprise suite. Kick the tires. Check the bells and whistles. 
                        This is the golden ticket to seeing powerful features in action before committing.
                    </p>
                </div>
            </div>

            <div className="space-y-3">
            {accounts.map((account) => (
                <div
                key={account.id}
                onClick={() => {
                    onAccountSelect?.(account.id);
                    saveAudit('ACCOUNT_ACCESS', `Accessed account ${account.mask}`);
                }}
                className="group p-5 bg-gray-900/50 border border-gray-800 rounded-2xl hover:border-cyan-500/40 hover:bg-gray-900 transition-all duration-300 cursor-pointer flex justify-between items-center shadow-lg relative overflow-hidden backdrop-blur-sm"
                >
                <div className="absolute inset-y-0 left-0 w-1 bg-cyan-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-center duration-300"></div>
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all"></div>
                
                <div className="flex items-center gap-5 relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-black border border-gray-800 flex items-center justify-center text-gray-500 group-hover:text-cyan-400 group-hover:border-cyan-500/30 transition-all shadow-inner">
                    <Landmark size={22} />
                    </div>
                    <div>
                    <p className="text-base font-bold text-gray-100 group-hover:text-white tracking-tight">{account.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-tighter bg-black/50 px-1.5 py-0.5 rounded">****{account.mask || 'XXXX'}</span>
                        <span className="text-[10px] font-bold text-emerald-500/80 uppercase px-1.5 py-0.5 bg-emerald-500/5 border border-emerald-500/20 rounded flex items-center gap-1">
                            <ShieldCheck size={8} /> SYNCED
                        </span>
                    </div>
                    </div>
                </div>
                <div className="text-right relative z-10">
                    <p className="text-lg font-mono font-bold text-white tracking-tight">${account.balance.toLocaleString()}</p>
                    <div className="flex items-center justify-end gap-1 text-[10px] text-gray-500 group-hover:text-cyan-400 transition-colors font-bold tracking-widest mt-1">
                        INSPECT <ArrowRight size={10} />
                    </div>
                </div>
                </div>
            ))}
            {accounts.length === 0 && (
                <div className="py-20 text-center border-2 border-dashed border-gray-800 rounded-2xl">
                    <div className="text-gray-600 font-mono text-xs uppercase tracking-[0.2em] mb-2">Zero Accounts Linked</div>
                    <button onClick={() => setShowAuditForm(true)} className="text-cyan-500 hover:text-cyan-400 text-sm underline">Initiate Setup Form</button>
                </div>
            )}
            </div>

            {/* Audit Log Preview */}
            <div className="mt-8 border-t border-gray-800 pt-6">
                <h4 className="text-xs font-mono text-gray-500 uppercase mb-3 flex items-center gap-2">
                    <Database size={12} /> Audit Storage (Local)
                </h4>
                <div className="bg-black rounded-lg border border-gray-800 p-2 max-h-32 overflow-y-auto font-mono text-[10px] text-gray-400 space-y-1 custom-scrollbar">
                    {auditLog.length === 0 && <div className="text-gray-700 italic p-2">No audit trails found.</div>}
                    {auditLog.map((log) => (
                        <div key={log.id} className="flex gap-2 border-b border-gray-900 pb-1 last:border-0">
                            <span className="text-cyan-700">[{log.timestamp.split('T')[1].split('.')[0]}]</span>
                            <span className="text-emerald-700">{log.action}</span>
                            <span className="text-gray-600 truncate">{log.details}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* --- AI Monolith Sidebar --- */}
        <div className={`fixed inset-y-0 right-0 w-96 bg-gray-950 border-l border-gray-800 transform transition-transform duration-300 ease-in-out z-50 shadow-2xl flex flex-col ${isChatOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-800 bg-gray-900 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-bold text-white tracking-wider">AI CO-PILOT</span>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                    <X size={18} />
                </button>
            </div>

            {/* API Key Input (Hidden/Settings style) */}
            <div className="px-4 py-2 bg-black border-b border-gray-800">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Key size={10} />
                    <span className="text-[10px] uppercase">Gemini API Key (Optional for Sim)</span>
                </div>
                <input 
                    type="password" 
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter key to go live..."
                    className="w-full bg-gray-900 border border-gray-800 rounded px-2 py-1 text-xs text-cyan-500 focus:outline-none focus:border-cyan-500/50"
                />
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/50 custom-scrollbar">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                            msg.role === 'user' 
                            ? 'bg-cyan-900/20 text-cyan-100 border border-cyan-500/20 rounded-tr-none' 
                            : 'bg-gray-900 text-gray-300 border border-gray-800 rounded-tl-none'
                        }`}>
                            {msg.role === 'model' && <Terminal size={12} className="mb-1 text-emerald-500/50" />}
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-gray-900 p-3 rounded-2xl rounded-tl-none border border-gray-800 flex gap-1">
                            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-75"></div>
                            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-gray-900 border-t border-gray-800">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Ask about cash flow, fraud, or setup..."
                        className="w-full bg-black border border-gray-700 rounded-xl pl-4 pr-10 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors placeholder-gray-600"
                    />
                    <button 
                        onClick={handleSendMessage}
                        className="absolute right-2 top-2 p-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
                    >
                        <Send size={14} />
                    </button>
                </div>
                <div className="mt-2 text-[10px] text-gray-600 text-center">
                    AI can make mistakes. Review generated financial advice.
                </div>
            </div>
        </div>

      </div>

      {/* --- PO / Audit Form Modal --- */}
      {showAuditForm && (
        <div className="absolute inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <FileText className="text-cyan-500" size={18} />
                        MANDATORY PO / AUDIT FORM
                    </h3>
                    <button onClick={() => setShowAuditForm(false)} className="text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleAuditSubmit} className="p-6 space-y-4">
                    <div className="p-3 bg-yellow-900/20 border border-yellow-700/30 rounded text-xs text-yellow-200/80 mb-4">
                        NOTICE: All interactions are recorded for the 2021 EIN Audit Trail. Please be specific.
                    </div>
                    
                    <div>
                        <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Action Type</label>
                        <select 
                            value={formAction} 
                            onChange={(e) => setFormAction(e.target.value)}
                            className="w-full bg-black border border-gray-700 rounded-lg p-2.5 text-sm text-white focus:border-cyan-500 outline-none"
                            required
                        >
                            <option value="">Select Action...</option>
                            <option value="CREATE_ACCOUNT">Create New Account</option>
                            <option value="TRANSFER_FUNDS">Transfer Funds</option>
                            <option value="GENERATE_REPORT">Generate Report</option>
                            <option value="TEST_DRIVE_FEATURE">Test Drive Feature</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Justification / Details</label>
                        <textarea 
                            value={formDetails}
                            onChange={(e) => setFormDetails(e.target.value)}
                            className="w-full bg-black border border-gray-700 rounded-lg p-2.5 text-sm text-white focus:border-cyan-500 outline-none h-24 resize-none"
                            placeholder="Describe the necessity of this action..."
                            required
                        />
                    </div>

                    <div className="pt-2 flex gap-3">
                        <button 
                            type="button" 
                            onClick={() => setShowAuditForm(false)}
                            className="flex-1 py-2.5 bg-transparent border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors text-sm font-bold"
                        >
                            CANCEL
                        </button>
                        <button 
                            type="submit"
                            className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors text-sm font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(8,145,178,0.4)]"
                        >
                            <Save size={16} /> SUBMIT TO STORAGE
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { bg: #000; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
      `}</style>
    </div>
  );
};

export default AccountList;
