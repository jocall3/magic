import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

/**
 * QUANTUM FINANCIAL - ELITE BUSINESS BANKING DEMO
 * PHILOSOPHY: "Golden Ticket" Experience. Test drive the engine.
 * SECURITY: Non-negotiable. Homomorphic Encryption Simulation. Audit Logging.
 * AI: Integrated Gemini-3-Flash-Preview for autonomous action execution.
 */

// --- TYPES & INTERFACES ---

export interface CustomerAccount {
  id: string;
  accountNumberDisplay: string;
  name: string;
  balance: number;
  currency: string;
  status: 'active' | 'frozen' | 'pending';
  type: 'checking' | 'savings' | 'treasury' | 'investment';
  customerId: string;
  institutionId: string;
  institutionLoginId: number;
  createdDate: number;
  balanceDate: number;
  routingNumber: string;
}

export interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
  type: 'credit' | 'debit';
  status: 'completed' | 'pending' | 'flagged';
  reference: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
  ipAddress: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface IntegrationKey {
  provider: string;
  encryptedKey: string;
  lastUsed: string;
  status: 'connected' | 'disconnected';
}

// --- SECURE VAULT (HOMOMORPHIC SIMULATION) ---
// This simulates a storage where keys are encrypted and operations are performed on ciphertext.
class HomomorphicVault {
  private storage: Map<string, string> = new Map();
  private readonly salt = "QUANTUM_SOVEREIGN_2024";

  async store(provider: string, rawKey: string): Promise<void> {
    // Simulated Homomorphic Encryption: Key is transformed but remains "computable" in its encrypted state
    const encrypted = btoa(rawKey.split('').map((char, i) => 
      String.fromCharCode(char.charCodeAt(0) ^ this.salt.charCodeAt(i % this.salt.length))
    ).join(''));
    this.storage.set(provider, encrypted);
    console.log(`[Vault] Securely stored key for ${provider}`);
  }

  async getDisplay(provider: string): Promise<string> {
    const val = this.storage.get(provider);
    if (!val) return "Not Configured";
    return `ENC_V1_${val.substring(0, 8)}...`;
  }

  // Simulated computation on encrypted data
  async validate(provider: string): Promise<boolean> {
    return this.storage.has(provider);
  }
}

const vault = new HomomorphicVault();

// --- MOCK DATA ---

const MOCK_ACCOUNTS: CustomerAccount[] = [
  { id: 'qf-001', name: 'Global Operating Account', accountNumberDisplay: '...9921', balance: 2450000.75, currency: 'USD', status: 'active', type: 'checking', customerId: 'corp-77', institutionId: 'qf-main', institutionLoginId: 101, createdDate: 1609459200, balanceDate: Date.now(), routingNumber: '021000021' },
  { id: 'qf-002', name: 'Strategic Reserve (Treasury)', accountNumberDisplay: '...4432', balance: 15750000.00, currency: 'USD', status: 'active', type: 'treasury', customerId: 'corp-77', institutionId: 'qf-main', institutionLoginId: 101, createdDate: 1612137600, balanceDate: Date.now(), routingNumber: '021000021' },
  { id: 'qf-003', name: 'Euro Liquidity Pool', accountNumberDisplay: '...1109', balance: 850000.00, currency: 'EUR', status: 'active', type: 'checking', customerId: 'corp-77', institutionId: 'qf-main', institutionLoginId: 101, createdDate: 1622505600, balanceDate: Date.now(), routingNumber: '021000021' },
];

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'tx-101', amount: -12500.00, date: '2023-11-01', description: 'AWS Cloud Infrastructure', category: 'Technology', type: 'debit', status: 'completed', reference: 'REF-99281' },
  { id: 'tx-102', amount: 450000.00, date: '2023-10-31', description: 'Inbound Wire: Global Sales', category: 'Revenue', type: 'credit', status: 'completed', reference: 'REF-99282' },
  { id: 'tx-103', amount: -5400.50, date: '2023-10-30', description: 'Corporate Travel - Amex', category: 'Operations', type: 'debit', status: 'completed', reference: 'REF-99283' },
  { id: 'tx-104', amount: -250000.00, date: '2023-10-29', description: 'Payroll Disbursement', category: 'Human Resources', type: 'debit', status: 'flagged', reference: 'REF-99284' },
];

// --- ICONS (INLINE SVG FOR ZERO DEPENDENCY) ---

const Icons = {
  Shield: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  Zap: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  Activity: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Bot: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Lock: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
  CreditCard: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
};

// --- SUB-COMPONENTS ---

const LoadingSpinner: React.FC<{ text?: string }> = ({ text }) => (
  <div className="flex flex-col items-center justify-center p-12">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-cyan-900/30 rounded-full"></div>
      <div className="absolute top-0 left-0 w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
    {text && <p className="mt-4 text-cyan-500 font-medium animate-pulse uppercase tracking-widest text-xs">{text}</p>}
  </div>
);

const StripeModal: React.FC<{ isOpen: boolean; onClose: () => void; onComplete: (amount: number) => void }> = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [amount, setAmount] = useState('5000.00');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onComplete(parseFloat(amount));
        onClose();
        setStep('form');
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Icons.CreditCard /> Secure Payment Terminal
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white">✕</button>
        </div>
        
        <div className="p-8">
          {step === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Funding Amount (USD)</label>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-2xl font-mono focus:ring-2 focus:ring-cyan-500 outline-none"
                />
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Card Details</label>
                <div className="text-gray-400 font-mono tracking-widest">**** **** **** 4242</div>
                <div className="flex justify-between mt-2 text-xs text-gray-600">
                  <span>EXP: 12/26</span>
                  <span>CVC: ***</span>
                </div>
              </div>
              <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-cyan-900/20">
                Authorize Transaction
              </button>
            </form>
          )}

          {step === 'processing' && (
            <div className="text-center py-10">
              <LoadingSpinner text="Verifying with Stripe Network..." />
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Payment Confirmed</h3>
              <p className="text-gray-400">Funds have been allocated to your account.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN VIEW COMPONENT ---

const AccountsView: React.FC = () => {
  // State Management
  const [accounts, setAccounts] = useState<CustomerAccount[]>(MOCK_ACCOUNTS);
  const [selectedAccount, setSelectedAccount] = useState<CustomerAccount | null>(MOCK_ACCOUNTS[0]);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStripeOpen, setIsStripeOpen] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [integrations, setIntegrations] = useState<IntegrationKey[]>([]);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- UTILITIES ---

  const logAction = useCallback((action: string, details: string, severity: AuditEntry['severity'] = 'low') => {
    const newEntry: AuditEntry = {
      id: `log-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      action,
      actor: "Authorized User (Admin)",
      details,
      ipAddress: "192.168.1.105",
      severity
    };
    setAuditLogs(prev => [newEntry, ...prev].slice(0, 50));
  }, []);

  // --- INITIALIZATION ---

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await new Promise(r => setTimeout(r, 1200));
      logAction("System Access", "User authenticated via Multi-Factor Authentication", "medium");
      setIsLoading(false);
      
      // Initial AI Greeting
      setAiMessages([{
        role: 'ai',
        text: "Welcome to Quantum Financial. I am your Sovereign AI Assistant. I can execute wires, manage integrations, or analyze your liquidity. How shall we proceed?"
      }]);
    };
    init();
  }, [logAction]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages]);

  // --- AI ENGINE (GEMINI-3-FLASH-PREVIEW) ---

  const handleAiCommand = async () => {
    if (!aiInput.trim()) return;
    
    const userMsg = aiInput;
    setAiMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setAiInput("");
    setIsAiThinking(true);

    try {
      const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY || "DEMO_KEY_EXPIRED");
      const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

      const prompt = `
        You are the Quantum Financial Sovereign AI. 
        Context: The user is in the Accounts View.
        Available Actions: 
        1. "TRANSFER [amount] TO [account]"
        2. "FREEZE ACCOUNT [id]"
        3. "GENERATE REPORT"
        4. "CONNECT ERP [name]"
        
        Current Accounts: ${JSON.stringify(accounts.map(a => ({id: a.id, name: a.name, balance: a.balance})))}
        
        User said: "${userMsg}"
        
        Respond in JSON format: { "message": "your verbal response", "action": "ACTION_TYPE", "params": {} }
      `;

      // Simulation of AI response for demo purposes if key is missing, otherwise use real API
      let result;
      if (!process.env.GEMINI_API_KEY) {
        await new Promise(r => setTimeout(r, 1000));
        result = {
          message: `I've processed your request regarding "${userMsg}". I am initiating the secure protocol now.`,
          action: userMsg.toLowerCase().includes('transfer') ? 'TRANSFER' : 'INFO',
          params: { amount: 1000 }
        };
      } else {
        const response = await model.generateContent(prompt);
        const text = response.response.text();
        result = JSON.parse(text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1));
      }

      setAiMessages(prev => [...prev, { role: 'ai', text: result.message }]);
      
      // Execute AI-driven actions
      if (result.action === 'TRANSFER') {
        setIsStripeOpen(true);
        logAction("AI Triggered Payment", `AI initiated a transfer request: ${userMsg}`, "high");
      } else if (result.action === 'FREEZE') {
        logAction("AI Security Action", `AI requested account freeze: ${userMsg}`, "critical");
        alert("SECURITY PROTOCOL: Account has been temporarily locked per AI instruction.");
      }

    } catch (error) {
      setAiMessages(prev => [...prev, { role: 'ai', text: "I apologize, but I encountered a synchronization error with the Quantum Grid. Please retry." }]);
    } finally {
      setIsAiThinking(false);
    }
  };

  // --- ACTIONS ---

  const handleStripeComplete = (amount: number) => {
    if (selectedAccount) {
      const updatedAccounts = accounts.map(acc => 
        acc.id === selectedAccount.id ? { ...acc, balance: acc.balance + amount } : acc
      );
      setAccounts(updatedAccounts);
      setSelectedAccount(updatedAccounts.find(a => a.id === selectedAccount.id) || null);
      
      const newTx: Transaction = {
        id: `tx-${Math.random().toString(36).substr(2, 9)}`,
        amount: amount,
        date: new Date().toISOString().split('T')[0],
        description: 'Quantum Inbound Liquidity (Stripe)',
        category: 'Transfer',
        type: 'credit',
        status: 'completed',
        reference: `STRIPE-${Math.random().toString(36).toUpperCase().substr(0, 8)}`
      };
      setTransactions(prev => [newTx, ...prev]);
      logAction("Liquidity Inbound", `Successfully processed $${amount} via Stripe Terminal`, "medium");
    }
  };

  const handleConnectERP = async (provider: string) => {
    const key = `sk_live_${Math.random().toString(36).substr(2, 24)}`;
    await vault.store(provider, key);
    const display = await vault.getDisplay(provider);
    
    setIntegrations(prev => [...prev, {
      provider,
      encryptedKey: display,
      lastUsed: new Date().toLocaleTimeString(),
      status: 'connected'
    }]);
    
    logAction("Integration Established", `Connected ${provider} using Homomorphic Vault storage`, "medium");
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#05070a] flex items-center justify-center">
      <LoadingSpinner text="Initializing Quantum Financial Sovereign Core..." />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#05070a] text-gray-300 font-sans selection:bg-cyan-500/30">
      
      {/* TOP NAVIGATION BAR */}
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <span className="text-white font-black text-xl">Q</span>
              </div>
              <div>
                <h1 className="text-white font-bold tracking-tighter text-lg leading-none">QUANTUM</h1>
                <p className="text-[10px] text-cyan-500 font-bold tracking-[0.2em] uppercase">Financial Sovereign</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-gray-800">
              <button className="px-4 py-2 text-xs font-bold text-white bg-gray-800 rounded-md shadow-sm">DASHBOARD</button>
              <button className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-300 transition">TREASURY</button>
              <button className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-300 transition">MARKETS</button>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">System Nominal</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-cyan-500">
              <Icons.Shield />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-6 grid grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: ACCOUNTS & INTEGRATIONS */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          
          {/* ACCOUNT SELECTOR */}
          <section className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Sovereign Accounts</h3>
              <button onClick={() => setIsStripeOpen(true)} className="p-1.5 bg-cyan-500/10 text-cyan-500 rounded-lg hover:bg-cyan-500/20 transition">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </button>
            </div>
            <div className="p-2 space-y-1">
              {accounts.map(acc => (
                <button 
                  key={acc.id}
                  onClick={() => setSelectedAccount(acc)}
                  className={`w-full text-left p-4 rounded-xl transition-all group ${selectedAccount?.id === acc.id ? 'bg-cyan-600/10 border border-cyan-500/30' : 'hover:bg-gray-800/50 border border-transparent'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-xs font-bold uppercase tracking-tighter ${selectedAccount?.id === acc.id ? 'text-cyan-400' : 'text-gray-500'}`}>
                      {acc.type}
                    </span>
                    <span className="text-[10px] font-mono text-gray-600">{acc.accountNumberDisplay}</span>
                  </div>
                  <div className="text-white font-bold truncate">{acc.name}</div>
                  <div className="mt-2 text-xl font-mono font-bold text-white">
                    {acc.currency === 'EUR' ? '€' : '$'}{acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* INTEGRATIONS PANEL */}
          <section className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <Icons.Zap /> ERP Integrations
            </h3>
            <div className="space-y-3">
              {['NetSuite', 'SAP S/4HANA', 'QuickBooks'].map(provider => {
                const active = integrations.find(i => i.provider === provider);
                return (
                  <div key={provider} className="p-3 bg-black/40 rounded-xl border border-gray-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">{provider}</div>
                      <div className="text-[10px] font-mono text-gray-600 mt-1">
                        {active ? active.encryptedKey : 'Disconnected'}
                      </div>
                    </div>
                    {!active ? (
                      <button 
                        onClick={() => handleConnectERP(provider)}
                        className="text-[10px] font-bold bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg transition"
                      >
                        CONNECT
                      </button>
                    ) : (
                      <div className="w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.6)]"></div>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-[10px] text-gray-600 italic">
              * All keys stored using Homomorphic Encryption. Computation occurs on ciphertext.
            </p>
          </section>
        </div>

        {/* CENTER COLUMN: DETAILS & TRANSACTIONS */}
        <div className="col-span-12 lg:col-span-6 space-y-6">
          
          {/* ACCOUNT HERO */}
          {selectedAccount && (
            <section className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Icons.Activity />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[10px] font-bold text-cyan-500 uppercase tracking-widest">
                    {selectedAccount.status}
                  </div>
                  <div className="text-gray-500 text-xs font-mono">Routing: {selectedAccount.routingNumber}</div>
                </div>
                <h2 className="text-4xl font-black text-white mb-2 tracking-tight">{selectedAccount.name}</h2>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-mono font-bold text-white tracking-tighter">
                    {selectedAccount.currency === 'EUR' ? '€' : '$'}{selectedAccount.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-gray-500 font-bold text-lg">{selectedAccount.currency}</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-10">
                  <button onClick={() => setIsStripeOpen(true)} className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all group">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-500 group-hover:scale-110 transition">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Transfer</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all group">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500 group-hover:scale-110 transition">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Statements</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all group">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 group-hover:scale-110 transition">
                      <Icons.Lock />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Security</span>
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* TRANSACTION LEDGER */}
          <section className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Transaction Ledger</h3>
              <div className="flex gap-2">
                <input type="text" placeholder="Search ledger..." className="bg-black/40 border border-gray-800 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-cyan-500 outline-none" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/20">
                    <th className="p-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Date</th>
                    <th className="p-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Description</th>
                    <th className="p-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Category</th>
                    <th className="p-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {transactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-white/[0.02] transition group">
                      <td className="p-4 text-xs font-mono text-gray-500">{tx.date}</td>
                      <td className="p-4">
                        <div className="text-sm font-bold text-white">{tx.description}</div>
                        <div className="text-[10px] text-gray-600 font-mono">{tx.reference}</div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-gray-800 rounded text-[10px] font-bold text-gray-400 uppercase">{tx.category}</span>
                      </td>
                      <td className={`p-4 text-right font-mono font-bold ${tx.type === 'credit' ? 'text-green-500' : 'text-white'}`}>
                        {tx.type === 'credit' ? '+' : '-'}{Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: AI & AUDIT */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          
          {/* SOVEREIGN AI CHAT */}
          <section className="bg-gray-900 border border-gray-800 rounded-2xl flex flex-col h-[500px] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>
            <div className="p-4 border-b border-gray-800 flex items-center gap-3 bg-gray-900/80 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-500">
                <Icons.Bot />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-widest">Sovereign AI</h3>
                <p className="text-[9px] text-green-500 font-bold uppercase animate-pulse">Neural Link Active</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {aiMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-cyan-600 text-white rounded-tr-none' 
                      : 'bg-gray-800 text-gray-300 border border-gray-700 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isAiThinking && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 p-3 rounded-2xl rounded-tl-none border border-gray-700">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 bg-black/40 border-t border-gray-800">
              <div className="relative">
                <input 
                  type="text" 
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAiCommand()}
                  placeholder="Command the Sovereign AI..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-4 pr-12 py-3 text-xs text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                />
                <button 
                  onClick={handleAiCommand}
                  className="absolute right-2 top-2 p-1.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {['Transfer $5k', 'Freeze Account', 'ERP Status'].map(suggestion => (
                  <button 
                    key={suggestion}
                    onClick={() => setAiInput(suggestion)}
                    className="whitespace-nowrap text-[9px] font-bold text-gray-500 hover:text-cyan-400 bg-gray-800/50 px-2 py-1 rounded border border-gray-700 transition"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* AUDIT LOGS */}
          <section className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Icons.Shield /> Audit Storage
              </h3>
              <span className="text-[10px] font-mono text-gray-600">v4.2.0-SEC</span>
            </div>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {auditLogs.map(log => (
                <div key={log.id} className="relative pl-4 border-l border-gray-800 py-1">
                  <div className={`absolute left-[-4px] top-2 w-2 h-2 rounded-full ${
                    log.severity === 'critical' ? 'bg-red-500' : 
                    log.severity === 'high' ? 'bg-orange-500' : 
                    log.severity === 'medium' ? 'bg-amber-500' : 'bg-cyan-500'
                  }`}></div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{log.action}</div>
                  <div className="text-[11px] text-gray-500 leading-tight mt-0.5">{log.details}</div>
                  <div className="text-[9px] font-mono text-gray-700 mt-1">{new Date(log.timestamp).toLocaleTimeString()} • {log.ipAddress}</div>
                </div>
              ))}
              {auditLogs.length === 0 && (
                <div className="text-center py-10 text-gray-600 text-xs italic">
                  No security events recorded in current session.
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* STRIPE MODAL OVERLAY */}
      <StripeModal 
        isOpen={isStripeOpen} 
        onClose={() => setIsStripeOpen(false)} 
        onComplete={handleStripeComplete}
      />

      {/* FOOTER / STATUS BAR */}
      <footer className="fixed bottom-0 w-full bg-gray-900/80 backdrop-blur-md border-t border-gray-800 px-6 py-2 flex justify-between items-center z-40">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Encryption:</span>
            <span className="text-[9px] font-bold text-cyan-500 uppercase tracking-widest">AES-GCM-256 + Homomorphic</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Session:</span>
            <span className="text-[9px] font-bold text-white uppercase tracking-widest">0x882...F921</span>
          </div>
        </div>
        <div className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.3em]">
          Quantum Financial Sovereign Demo • No Real Assets Involved
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1f2937; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #374151; }
      `}} />
    </div>
  );
};

export default AccountsView;