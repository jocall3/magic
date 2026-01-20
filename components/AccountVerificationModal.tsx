import React, { useState, useEffect, FC, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Zap, 
  Lock, 
  Cpu, 
  Activity, 
  MessageSquare, 
  Send, 
  CheckCircle, 
  AlertTriangle, 
  ChevronRight, 
  Database, 
  Key, 
  Eye, 
  EyeOff,
  Terminal,
  CreditCard,
  RefreshCw,
  Search,
  Settings,
  UserCheck
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

/**
 * QUANTUM FINANCIAL - ELITE BUSINESS DEMO
 * COMPONENT: AccountVerificationModal
 * 
 * PHILOSOPHY: 
 * - "Golden Ticket" Experience.
 * - Homomorphic Encryption Simulation for internal state.
 * - Integrated Quantum AI Assistant (Gemini-3-Flash).
 * - Full Audit Logging.
 * - Stripe-Grade Verification Simulation.
 */

// --- TYPES & INTERFACES ---

interface ExternalAccount {
  id: string;
  party_name: string;
  verification_status: 'unverified' | 'pending_verification' | 'verified';
  account_type: string;
  routing_number: string;
  account_number_suffix: string;
}

interface InternalAccount {
  id: string;
  name: string;
  currency: string;
  balance: number;
}

interface AuditLogEntry {
  timestamp: string;
  action: string;
  actor: string;
  metadata: any;
  securityLevel: 'Standard' | 'Elevated' | 'Critical';
}

interface AccountVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  externalAccount: ExternalAccount | null;
}

type VerificationStep = 'initiate' | 'confirm' | 'security_check' | 'success';

// --- HOMOMORPHIC ENCRYPTION SIMULATION ---
// This class simulates operating on encrypted data without decrypting it.
class QuantumVault {
  private static instance: QuantumVault;
  private storage: Map<string, { cipher: string; noise: string }> = new Map();

  private constructor() {}

  static getInstance() {
    if (!QuantumVault.instance) QuantumVault.instance = new QuantumVault();
    return QuantumVault.instance;
  }

  // Simulates a homomorphic "Add" or "Store"
  async secureStore(key: string, value: string): Promise<void> {
    const cipher = btoa(`ENC_${value}_${Math.random()}`);
    const noise = Math.random().toString(36).substring(7);
    this.storage.set(key, { cipher, noise });
    console.log(`[QuantumVault] Securely stored ${key} with homomorphic noise.`);
  }

  // Simulates a homomorphic comparison (checking if input matches encrypted value without full decryption)
  async blindVerify(key: string, input: string): Promise<boolean> {
    const stored = this.storage.get(key);
    if (!stored) return false;
    const decoded = atob(stored.cipher);
    return decoded.includes(`ENC_${input}_`);
  }
}

// --- UI COMPONENTS (ELITE POLISH) ---

const QuantumButton: FC<any> = ({ children, variant = 'primary', isLoading, ...props }) => {
  const baseStyles = "relative px-6 py-3 rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden group";
  const variants: any = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700",
    ghost: "bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white",
    danger: "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`} disabled={isLoading} {...props}>
      <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-25deg] -translate-x-full group-hover:translate-x-[250%] transition-transform duration-1000" />
      {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : children}
    </button>
  );
};

const QuantumInput: FC<any> = ({ label, icon: Icon, ...props }) => (
  <div className="space-y-2 w-full">
    {label && <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</label>}
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />}
      <input 
        className={`w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 ${Icon ? 'pl-10' : 'px-4'} pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all`}
        {...props}
      />
    </div>
  </div>
);

const AuditBadge: FC<{ level: string }> = ({ level }) => {
  const colors: any = {
    Standard: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Elevated: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Critical: "bg-red-500/10 text-red-400 border-red-500/20"
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded border font-mono ${colors[level]}`}>
      {level}
    </span>
  );
};

// --- MAIN COMPONENT ---

export const AccountVerificationModal: FC<AccountVerificationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  externalAccount,
}) => {
  // State Management
  const [step, setStep] = useState<VerificationStep>('initiate');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [amounts, setAmounts] = useState(['', '']);
  const [internalAccounts, setInternalAccounts] = useState<InternalAccount[]>([]);
  const [selectedInternalAccountId, setSelectedInternalAccountId] = useState<string>('');
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [showAudit, setShowAudit] = useState(false);
  
  // AI State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'ai', content: string}[]>([]);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Refs for Secure Storage
  const vault = useMemo(() => QuantumVault.getInstance(), []);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize AI
  const ai = useMemo(() => {
    const apiKey = process.env.GEMINI_API_KEY || "DEMO_KEY";
    return new GoogleGenAI(apiKey);
  }, []);

  // --- LOGGING UTILITY ---
  const addAuditLog = useCallback((action: string, metadata: any = {}, level: AuditLogEntry['securityLevel'] = 'Standard') => {
    const entry: AuditLogEntry = {
      timestamp: new Date().toISOString(),
      action,
      actor: 'System/User',
      metadata,
      securityLevel: level
    };
    setAuditLogs(prev => [entry, ...prev].slice(0, 50));
    console.log(`[AUDIT] ${action}`, metadata);
  }, []);

  // --- AI LOGIC ---
  const handleAiChat = async (overridePrompt?: string) => {
    const prompt = overridePrompt || chatInput;
    if (!prompt.trim()) return;

    const userMsg = { role: 'user' as const, content: prompt };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsAiThinking(true);
    addAuditLog("AI_QUERY_INITIATED", { prompt }, "Standard");

    try {
      const model = ai.getGenerativeModel({ model: "gemini-3-flash-preview" });
      
      const systemContext = `
        You are the Quantum Financial Elite Assistant. 
        You are helping a user verify an external bank account for ${externalAccount?.party_name}.
        Current Step: ${step}.
        The user is in a "Golden Ticket" demo environment.
        Tone: Professional, Secure, High-Performance.
        You can trigger actions by including specific tags in your response:
        [ACTION:START_VERIFICATION] - To start the micro-deposit process.
        [ACTION:COMPLETE_VERIFICATION] - To finish verification.
        [ACTION:SHOW_AUDIT] - To show the audit trail.
        Do not mention Citibank. Use "Quantum Financial".
      `;

      const result = await model.generateContent([systemContext, ...chatMessages.map(m => m.content), prompt]);
      const responseText = result.response.text();

      // Parse Actions
      if (responseText.includes('[ACTION:START_VERIFICATION]')) handleStartVerification();
      if (responseText.includes('[ACTION:COMPLETE_VERIFICATION]')) handleCompleteVerification();
      if (responseText.includes('[ACTION:SHOW_AUDIT]')) setShowAudit(true);

      setChatMessages(prev => [...prev, { role: 'ai', content: responseText.replace(/\[ACTION:.*\]/g, '') }]);
      addAuditLog("AI_RESPONSE_RECEIVED", { length: responseText.length }, "Standard");
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'ai', content: "I apologize, but my neural link is experiencing latency. Please proceed manually or try again." }]);
      addAuditLog("AI_ERROR", { error: err }, "Elevated");
    } finally {
      setIsAiThinking(false);
    }
  };

  // --- BUSINESS LOGIC ---

  useEffect(() => {
    if (isOpen && externalAccount) {