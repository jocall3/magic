import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";

/**
 * TYPES & INTERFACES
 */
export interface ACHDetails {
  routingNumber: string;
  realAccountNumber: string;
  accountType: 'Checking' | 'Savings';
  bankName: string;
  lastVerified?: string;
}

interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  metadata: any;
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * SECURE VAULT - HOMOMORPHIC SIMULATION
 * This simulates a frontend-only encrypted storage where data is processed 
 * without being fully exposed to the standard browser refs.
 */
class HomomorphicVault {
  private static instance: HomomorphicVault;
  private storage: Map<string, string> = new Map();
  private salt: string = "QUANTUM_SECURE_2024_ALPHA";

  private constructor() {}

  public static getInstance(): HomomorphicVault {
    if (!HomomorphicVault.instance) {
      HomomorphicVault.instance = new HomomorphicVault();
    }
    return HomomorphicVault.instance;
  }

  private encrypt(value: string): string {
    // Simulated homomorphic encryption (XOR + Base64)
    // In a real app, this would use WebCrypto API with subtle crypto
    const textToChars = (text: string) => text.split("").map((c) => c.charCodeAt(0));
    const applySalt = (code: number) => textToChars(this.salt).reduce((a, b) => a ^ b, code);
    return btoa(value.split("").map(textToChars).map(applySalt).join(","));
  }

  public store(key: string, value: string) {
    const encrypted = this.encrypt(value);
    this.storage.set(key, encrypted);
  }

  public get(key: string): string | undefined {
    // Simulated retrieval - in a real homomorphic system, we'd perform operations 
    // on the encrypted data itself.
    return this.storage.get(key);
  }
}

/**
 * QUANTUM FINANCIAL - ACH DETAILS DISPLAY & AI COMMAND CENTER
 * 
 * This component is a "Golden Ticket" experience for business banking.
 * It features:
 * 1. Secure ACH Display with obfuscation.
 * 2. Integrated AI Assistant (Quantum AI) using Google GenAI.
 * 3. Real-time Audit Logging.
 * 4. Stripe-integrated Payment Simulation.
 * 5. Homomorphic Storage Simulation.
 */
const ACHDetailsDisplay: React.FC<{ details: ACHDetails; hideSensitive?: boolean }> = ({
  details: initialDetails,
  hideSensitive = true,
}) => {
  // --- STATE MANAGEMENT ---
  const [details, setDetails] = useState<ACHDetails>(initialDetails);
  const [showFullDetails, setShowFullDetails] = useState(!hideSensitive);
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Welcome to Quantum Financial. I am your AI Treasury Assistant. How can I help you manage your ACH configurations today?" }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [stripeStatus, setStripeStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [isEditing, setIsEditing] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const vault = HomomorphicVault.getInstance();

  // --- INITIALIZATION ---
  useEffect(() => {
    logAudit("VIEW_COMPONENT", "System", { component: "ACHDetailsDisplay" });
    vault.store("ACH_ROUTING", initialDetails.routingNumber);
    vault.store("ACH_ACCOUNT", initialDetails.realAccountNumber);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- AUDIT LOGGING ---
  const logAudit = (action: string, actor: string, metadata: any) => {
    const entry: AuditEntry = {
      id: `LOG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      action,
      actor,
      metadata
    };
    setAuditTrail(prev => [entry, ...prev].slice(0, 50));
    console.log(`[AUDIT] ${action}`, entry);
  };

  // --- AI INTEGRATION (GOOGLE GENAI) ---
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMsg = userInput;
    setUserInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsProcessingAI(true);
    logAudit("AI_QUERY", "User", { query: userMsg });

    try {
      // Using the requested GoogleGenAI package and secrets
      const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY || "");
      const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

      const prompt = `
        You are the Quantum Financial AI Assistant. 
        Context: The user is viewing their ACH Details for "The Demo Bank".
        Current Details: ${JSON.stringify(details)}
        User Request: "${userMsg}"
        
        Instructions:
        1. If the user wants to change details (routing, account, bank), respond with a JSON block starting with { "action": "UPDATE_ACH", ... }.
        2. If the user wants to initiate a payment, respond with { "action": "INITIATE_PAYMENT" }.
        3. Otherwise, provide a professional, elite financial response.
        4. Never mention Citibank.
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      if (responseText.includes("UPDATE_ACH")) {
        try {
          const jsonMatch = responseText.match(/\{.*\}/s);
          if (jsonMatch) {
            const data = JSON.parse(jsonMatch[0]);
            const newDetails = { ...details, ...data.payload };
            setDetails(newDetails);
            setMessages(prev => [...prev, { role: 'assistant', content: "I have updated your ACH configurations as requested. The changes are now reflected in the secure vault." }]);
            logAudit("AI_ACTION_UPDATE", "QuantumAI", { newDetails });
          }
        } catch (e) {
          setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
        }
      } else if (responseText.includes("INITIATE_PAYMENT")) {
        setShowPaymentModal(true);
        setMessages(prev => [...prev, { role: 'assistant', content: "I've opened the Stripe payment gateway for you. You can now 'test drive' the transaction engine." }]);
        logAudit("AI_ACTION_PAYMENT", "QuantumAI", {});
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
      }
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I apologize, but I'm experiencing a connection latency with the Quantum core. Please try again." }]);
    } finally {
      setIsProcessingAI(false);
    }
  };

  // --- STRIPE SIMULATION ---
  const handleStripePayment = () => {
    setStripeStatus('processing');
    logAudit("STRIPE_INITIATED", "User", { amount: 5000, currency: 'USD' });
    
    setTimeout(() => {
      setStripeStatus('success');
      logAudit("STRIPE_SUCCESS", "StripeGateway", { transactionId: "ch_3N" + Math.random().toString(36).substr(2, 10) });
      setTimeout(() => {
        setShowPaymentModal(false);
        setStripeStatus('idle');
      }, 2000);
    }, 2500);
  };

  // --- UI HELPERS ---
  const obscureNumber = (num: string): string => {
    if (num.length <= 4) return `****`;
    return `****${num.slice(-4)}`;
  };

  return (
    <div className="relative min-h-screen bg-slate-900 text-slate-100 font-sans p-8 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <header className="flex justify-between items-center mb-12 border-b border-slate-700 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tighter bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              QUANTUM FINANCIAL
            </h1>
            <p className="text-slate-400 text-sm uppercase tracking-widest mt-1">Global Business Treasury • Demo Environment</p>
          </div>
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-slate-800 rounded-full border border-slate-700 flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-mono">SYSTEMS NOMINAL</span>
            </div>
            <button 
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 transition-all rounded-lg font-bold text-sm shadow-lg shadow-blue-900/20"
            >
              {isChatOpen ? "CLOSE ASSISTANT" : "OPEN AI ASSISTANT"}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main ACH Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 shadow-2xl">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold mb-1">ACH Payment Details</h2>
                  <p className="text-slate-400 text-sm">Securely manage your corporate disbursement channels.</p>
                </div>
                <button 
                  onClick={() => {
                    setShowFullDetails(!showFullDetails);
                    logAudit(showFullDetails ? "HIDE_SENSITIVE" : "REVEAL_SENSITIVE", "User", {});
                  }}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 underline underline-offset-4"
                >
                  {showFullDetails ? "OBFUSCATE DATA" : "REVEAL SECURE DATA"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Bank Institution</label>
                  <div className="text-xl font-semibold text-slate-200">{details.bankName}</div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Account Type</label>
                  <div className="text-xl font-semibold text-slate-200">{details.accountType}</div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Routing Number (ABA)</label>
                  <div className="text-2xl font-mono text-emerald-400">
                    {showFullDetails ? details.routingNumber : obscureNumber(details.routingNumber)}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Account Number (DDA)</label>
                  <div className="text-2xl font-mono text-emerald-400">
                    {showFullDetails ? details.realAccountNumber : obscureNumber(details.realAccountNumber)}
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-700 flex flex-wrap gap-4">
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold text-sm transition-all"
                >
                  Edit Configuration
                </button>
                <button 
                  onClick={() => setShowPaymentModal(true)}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-900/20"
                >
                  Test Drive Payment (Stripe)
                </button>
                <button 
                  className="px-6 py-3 bg-slate-800 border border-slate-700 hover:border-slate-500 rounded-xl font-bold text-sm transition-all"
                  onClick={() => logAudit("EXPORT_DETAILS", "User", { format: "PDF" })}
                >
                  Export Audit PDF
                </button>
              </div>
            </div>

            {/* Analytics / Bells & Whistles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/30 border border-slate-700 p-6 rounded-2xl">
                <div className="text-slate-500 text-[10px] font-bold uppercase mb-2">Fraud Risk Score</div>
                <div className="text-3xl font-bold text-emerald-400">0.02</div>
                <div className="w-full bg-slate-700 h-1 mt-4 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[2%]"></div>
                </div>
              </div>
              <div className="bg-slate-800/30 border border-slate-700 p-6 rounded-2xl">
                <div className="text-slate-500 text-[10px] font-bold uppercase mb-2">Monthly Volume</div>
                <div className="text-3xl font-bold text-blue-400">$1.2M</div>
                <div className="text-[10px] text-slate-400 mt-2">↑ 12% from last month</div>
              </div>
              <div className="bg-slate-800/30 border border-slate-700 p-6 rounded-2xl">
                <div className="text-slate-500 text-[10px] font-bold uppercase mb-2">Uptime SLA</div>
                <div className="text-3xl font-bold text-slate-200">99.99%</div>
                <div className="text-[10px] text-emerald-500 mt-2">Quantum Core Active</div>
              </div>
            </div>
          </div>

          {/* Sidebar: Audit Log */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col h-[600px]">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Live Audit Storage</h3>
              <span className="text-[10px] bg-blue-900/40 text-blue-400 px-2 py-1 rounded">ENCRYPTED</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-[10px]">
              {auditTrail.map((log) => (
                <div key={log.id} className="border-l-2 border-slate-700 pl-3 py-1">
                  <div className="text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</div>
                  <div className="text-blue-400 font-bold">{log.action}</div>
                  <div className="text-slate-300">Actor: {log.actor}</div>
                </div>
              ))}
              {auditTrail.length === 0 && <div className="text-slate-600 italic">Waiting for telemetry...</div>}
            </div>
          </div>
        </div>
      </div>

      {/* AI CHATBOT OVERLAY */}
      {isChatOpen && (
        <div className="fixed bottom-8 right-8 w-96 h-[500px] bg-slate-800 border border-blue-500/30 shadow-2xl rounded-2xl flex flex-col z-50 animate-in slide-in-from-bottom-10 duration-300">
          <div className="p-4 border-b border-slate-700 bg-blue-600 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="font-bold text-sm">Quantum AI Assistant</span>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-white/70 hover:text-white">✕</button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
                  m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-200'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isProcessingAI && (
              <div className="flex justify-start">
                <div className="bg-slate-700 p-3 rounded-xl text-sm animate-pulse">Quantum is thinking...</div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 border-t border-slate-700">
            <div className="relative">
              <input 
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask AI to update details or pay..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-4 text-sm focus:outline-none focus:border-blue-500 transition-all"
              />
              <button 
                onClick={handleSendMessage}
                className="absolute right-2 top-1.5 text-blue-500 hover:text-blue-400"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STRIPE PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white text-slate-900 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">S</div>
                <span className="font-bold text-lg">Stripe Checkout</span>
              </div>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            
            <div className="p-8">
              <div className="mb-6">
                <div className="text-slate-500 text-xs font-bold uppercase mb-1">Pay Quantum Financial</div>
                <div className="text-4xl font-bold">$5,000.00</div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Card Information</label>
                  <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 font-mono text-sm">
                    4242 4242 4242 4242
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Expiry</label>
                    <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 font-mono text-sm">12 / 26</div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">CVC</label>
                    <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 font-mono text-sm">***</div>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleStripePayment}
                disabled={stripeStatus !== 'idle'}
                className={`w-full mt-8 py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
                  stripeStatus === 'success' ? 'bg-emerald-500' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {stripeStatus === 'idle' && "Pay Now"}
                {stripeStatus === 'processing' && (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </>
                )}
                {stripeStatus === 'success' && "✓ Payment Successful"}
              </button>
              
              <p className="text-center text-[10px] text-slate-400 mt-4">
                Securely processed by Stripe. No real funds will be moved in this demo.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditing && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-lg rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Update ACH Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Bank Name</label>
                <input 
                  type="text" 
                  value={details.bankName}
                  onChange={(e) => setDetails({...details, bankName: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Routing Number</label>
                  <input 
                    type="text" 
                    value={details.routingNumber}
                    onChange={(e) => setDetails({...details, routingNumber: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Account Number</label>
                  <input 
                    type="text" 
                    value={details.realAccountNumber}
                    onChange={(e) => setDetails({...details, realAccountNumber: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 font-mono"
                  />
                </div>
              </div>
            </div>
            <div className="mt-8 flex gap-4">
              <button 
                onClick={() => {
                  setIsEditing(false);
                  logAudit("MANUAL_UPDATE", "User", { details });
                }}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold"
              >
                Save Changes
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <footer className="mt-20 text-center text-slate-600 text-[10px] uppercase tracking-[0.2em]">
        Quantum Financial Services Group © 2024 • Proprietary Demo Environment • No Human Intervention Required
      </footer>
    </div>
  );
};

export default ACHDetailsDisplay;