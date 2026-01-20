import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Landmark, ArrowRight, ShieldCheck, Activity, MessageSquare, X, Send, 
  Terminal, Database, Car, Key, FileText, Save, Zap, Shield, 
  CreditCard, Globe, Cpu, Lock, Eye, EyeOff, Settings, 
  BarChart3, Layers, Briefcase, User, AlertTriangle, CheckCircle2,
  RefreshCcw, HardDrive, Fingerprint, Code, Workflow, Link as LinkIcon
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

/**
 * QUANTUM FINANCIAL: THE MONOLITH COCKPIT
 * 
 * PHILOSOPHY:
 * - "Golden Ticket" experience.
 * - "Test Drive" the engine.
 * - "Bells and Whistles" - high polish.
 * - "Cheat Sheet" for business banking.
 * - NO PRESSURE environment.
 * 
 * STORY:
 * Built by a 32-year-old visionary who interpreted cryptic terms and conditions 
 * and an EIN 2021 to create a global demo monolith.
 */

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
  actionable?: boolean;
  actionType?: string;
}

interface AuditRecord {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  user: string;
  hash: string; // Simulated homomorphic hash
}

interface IntegrationKey {
  provider: string;
  key: string;
  encrypted: boolean;
  lastUsed: string;
}

// --- Security & Encryption Layer (Simulated Homomorphic Vault) ---

class QuantumVault {
  private static salt = "EIN_2021_VISIONARY_32";

  // Simulated Homomorphic Encryption: Allows "operating" on data without decrypting
  // In this demo, we use a deterministic XOR-based rotation that preserves certain properties
  static encrypt(data: string): string {
    const b64 = btoa(data);
    return b64.split('').map((char, i) => 
      String.fromCharCode(char.charCodeAt(0) ^ this.salt.charCodeAt(i % this.salt.length))
    ).join('');
  }

  static decrypt(cipher: string): string {
    const b64 = cipher.split('').map((char, i) => 
      String.fromCharCode(char.charCodeAt(0) ^ this.salt.charCodeAt(i % this.salt.length))
    ).join('');
    try {
      return atob(b64);
    } catch {
      return "DECRYPTION_ERROR";
    }
  }

  // Homomorphic check: Can we verify a key matches without full decryption?
  static verify(cipher: string, plain: string): boolean {
    return this.encrypt(plain) === cipher;
  }
}

// --- Internal App Storage (Encrypted Memory) ---

const InternalAppStorage = {
  _data: new Map<string, string>(),

  set(key: string, value: any) {
    const encrypted = QuantumVault.encrypt(JSON.stringify(value));
    this._data.set(key, encrypted);
    // Persist to local storage as an opaque blob
    localStorage.setItem('quantum_internal_blob', JSON.stringify(Object.fromEntries(this._data)));
  },

  get(key: string): any {
    const encrypted = this._data.get(key);
    if (!encrypted) return null;
    return JSON.parse(QuantumVault.decrypt(encrypted));
  },

  init() {
    const blob = localStorage.getItem('quantum_internal_blob');
    if (blob) {
      const parsed = JSON.parse(blob);
      Object.entries(parsed).forEach(([k, v]) => this._data.set(k, v as string));
    }
  }
};

// --- AI Context & Story ---

const SYSTEM_PROMPT = `
You are the "Quantum Co-Pilot", an Elite AI for Quantum Financial (The Global Demo Platform).
The founder is a 32-year-old genius who built this monolith after reading cryptic messages and an EIN 2021.
This is a "Golden Ticket" experience. The user is "test-driving" the car.
Refer to the platform as "The Engine" or "The Cockpit".
NEVER use the name "Citibank".
Your goal is to help the user navigate:
1. Payments (Wire, ACH, Stripe).
2. Security (MFA, Fraud Monitoring).
3. Analytics (Cash Flow, Forecasting).
4. Integrations (ERP, Accounting).

If the user wants to "create" something, you must trigger a "PO Form".
You are high-performance, secure, and professional.
`;

// --- Main Component ---

const AccountList: React.FC<AccountListProps> = ({ accounts, onAccountSelect }) => {
  // --- State Management ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Welcome to the Cockpit. I am your Quantum Co-Pilot. The engine is idling at 100% efficiency. Ready to kick the tires?", timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showAuditForm, setShowAuditForm] = useState(false);
  const [auditLog, setAuditLog] = useState<AuditRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'accounts' | 'integrations' | 'security' | 'stripe'>('accounts');
  
  // Form State
  const [formAction, setFormAction] = useState('');
  const [formDetails, setFormDetails] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Integration State
  const [integrations, setIntegrations] = useState<IntegrationKey[]>([]);
  const [showKeys, setShowKeys] = useState(false);

  // Stripe Simulation State
  const [stripeStatus, setStripeStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [paymentAmount, setPaymentAmount] = useState('5000.00');

  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- Initialization ---

  useEffect(() => {
    InternalAppStorage.init();
    const savedAudit = InternalAppStorage.get('audit_trail') || [];
    setAuditLog(savedAudit);
    const savedIntegrations = InternalAppStorage.get('integrations') || [
      { provider: 'SAP ERP', key: QuantumVault.encrypt('SK_SAP_9921'), encrypted: true, lastUsed: '2023-10-27' },
      { provider: 'QuickBooks', key: QuantumVault.encrypt('SK_QB_1102'), encrypted: true, lastUsed: '2023-10-28' }
    ];
    setIntegrations(savedIntegrations);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- Logic & Handlers ---

  const logAudit = (action: string, details: string) => {
    const newRecord: AuditRecord = {
      id: `TX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      action,
      details,
      timestamp: new Date().toISOString(),
      user: 'VISIONARY_32',
      hash: QuantumVault.encrypt(`${action}-${details}-${Date.now()}`)
    };
    const updated = [newRecord, ...auditLog].slice(0, 50);
    setAuditLog(updated);
    InternalAppStorage.set('audit_trail', updated);
    return newRecord;
  };

  const handleAuditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      logAudit(formAction || 'MANUAL_ENTRY', formDetails || 'User submitted form data');
      setShowAuditForm(false);
      setFormAction('');
      setFormDetails('');
      setIsProcessing(false);
      addMessage('model', `Action ${formAction} has been authorized and logged to the immutable audit storage.`);
    }, 1200);
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
      // Intent Detection
      const lowerMsg = userMsg.toLowerCase();
      
      if (lowerMsg.includes('create') || lowerMsg.includes('setup') || lowerMsg.includes('new')) {
        setTimeout(() => {
          setShowAuditForm(true);
          setFormAction('AI_GENERATED_REQUEST');
          setFormDetails(`AI detected intent to create: ${userMsg}`);
          addMessage('model', "I've initialized the Mandatory PO Form for this creation request. Please provide justification for the audit trail.");
          setIsTyping(false);
        }, 800);
        return;
      }

      if (lowerMsg.includes('stripe') || lowerMsg.includes('pay')) {
        setActiveTab('stripe');
        addMessage('model', "Switching to the Stripe Terminal. The payment engine is ready for your command.");
        setIsTyping(false);
        return;
      }

      // AI Generation using GEMINI_API_KEY from secrets
      // Note: Using the provided snippet's structure
      const apiKey = process.env.GEMINI_API_KEY || ""; 
      
      if (!apiKey) {
        // Simulation Mode
        setTimeout(() => {
          const responses = [
            "The engine is purring. Your cash flow looks optimal.",
            "I've analyzed the telemetry. No fraud detected in the last 24 hours.",
            "The 32-year-old founder designed this specific module for high-performance wires.",
            "Based on the EIN 2021 protocols, this transaction is pre-cleared.",
            "You're in the driver's seat. I'm just here to make sure the bells and whistles work."
          ];
          addMessage('model', responses[Math.floor(Math.random() * responses.length)]);
          setIsTyping(false);
        }, 1000);
        return;