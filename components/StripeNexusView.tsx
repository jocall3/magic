import React, { useState, useContext, useEffect, useRef, useCallback } from 'react';
import { DataContext } from '../context/DataContext';
import { 
  Zap, Users, Layers, CheckCircle2, Shield, BarChart3, 
  Terminal, Send, Lock, AlertTriangle, Cpu, Activity, 
  Globe, Database, Briefcase, Settings, Info, Play, 
  RefreshCw, Trash2, Eye, EyeOff, ChevronRight, 
  MessageSquare, Sparkles, Gauge, Key, History, 
  FileText, CreditCard, DollarSign, ArrowRightLeft,
  Search, Filter, Download, Plus, X, UserCheck
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

/**
 * ================================================================================================
 * QUANTUM FINANCIAL NEXUS - THE GOLDEN TICKET BUSINESS DEMO
 * ================================================================================================
 * 
 * PHILOSOPHY:
 * - This is a "Golden Ticket" experience.
 * - We are letting the user "Test Drive" the car (the code).
 * - It must have "Bells and Whistles" - distinct features, high polish.
 * - It is a "Cheat Sheet" for business banking.
 * - NO PRESSURE environment.
 * - Metaphor: Kick the tires. See the engine roar.
 * 
 * TECHNICAL REQUIREMENTS:
 * - Robust Payment & Collection capabilities (Wire, ACH).
 * - Security is non-negotiable (Multi-factor auth simulations, Fraud monitoring).
 * - Reporting & Analytics (Data visualization).
 * - Integration capabilities (ERP, Accounting).
 * - AUDIT STORAGE: Every sensitive action must be logged.
 * 
 * TONE:
 * - Elite, Professional, High-Performance, Secure.
 * - Do NOT use the name "Citibank" in the UI. Use "The Demo Bank" or "Quantum Financial".
 * 
 * AUTHOR: James Burvel oCallaghan III (Sovereign Architect)
 * VERSION: 4.0.0-QUANTUM-FLUX
 * ================================================================================================
 */

// --- TYPES & INTERFACES ---

type Tab = 'PAYMENTS' | 'ENTITIES' | 'VIRTUAL_LEDGER' | 'RECONCILIATION' | 'SECURITY' | 'ANALYTICS' | 'INTEGRATION' | 'AUDIT';

interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  ip: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
}

interface PaymentIntent {
  id: string;
  status: 'Succeeded' | 'Pending' | 'Failed' | 'Requires Action';
  amount: number;
  customer: string;
  date: string;
  type: 'ACH' | 'WIRE' | 'INTERNAL';
  currency: string;
}

// --- LOCAL COMPONENTS (Self-Contained) ---

const Card: React.FC<{ 
  title?: string; 
  subtitle?: string; 
  children: React.ReactNode; 
  className?: string;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
}> = ({ title, subtitle, children, className = '', icon, footer }) => (
  <div className={`bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:border-cyan-500/40 group ${className}`}>
    {(title || icon) && (
      <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gradient-to-r from-gray-900/80 to-transparent">
        <div className="flex items-center gap-3">
          {icon && <div className="text-cyan-400 group-hover:scale-110 transition-transform duration-300">{icon}</div>}
          <div>
            {title && <h3 className="text-sm font-black text-white uppercase tracking-widest">{title}</h3>}
            {subtitle && <p className="text-[10px] text-gray-500 font-mono uppercase">{subtitle}</p>}
          </div>
        </div>
        <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
      </div>
    )}
    <div className="p-6">{children}</div>
    {footer && <div className="px-6 py-3 bg-black/40 border-t border-gray-800">{footer}</div>}
  </div>
);

const Modal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: React.ReactNode 
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-gray-900 border border-cyan-500/30 rounded-3xl w-full max-w-2xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.15)]">
        <div className="px-8 py-6 border-b border-gray-800 flex justify-between items-center bg-gradient-to-r from-cyan-950/20 to-transparent">
          <h2 className="text-xl font-black text-white uppercase tracking-tighter italic flex items-center gap-3">
            <Zap className="text-cyan-400" size={20} /> {title}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

const StripeNexusView: React.FC = () => {
  // Context & State
  const dataContext = useContext(DataContext);
  if (!dataContext) throw new Error("StripeNexusView must be used within a DataProvider");
  const { deductCredits, showNotification } = dataContext;

  const [activeTab, setActiveTab] = useState<Tab>('PAYMENTS');
  const [isEngineRunning, setIsEngineRunning] = useState(false);
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'ai', content: "Welcome to the Quantum Financial Nexus. I am your Sovereign Strategist. How can I optimize your capital flow today?", timestamp: new Date().toLocaleTimeString() }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [mfaStep, setMfaStep] = useState<'FORM' | 'CHALLENGE' | 'SUCCESS'>('FORM');
  const [engineHorsepower, setEngineHorsepower] = useState(0);
  const [isTurboMode, setIsTurboMode] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Mock Data
  const [payments, setPayments] = useState<PaymentIntent[]>([
    { id: 'PI_771_ALPHA', status: 'Succeeded', amount: 1250000, customer: 'Global Logistics Inc', date: '2025-01-22 14:30', type: 'WIRE', currency: 'USD' },
    { id: 'PI_772_BETA', status: 'Pending', amount: 540000, customer: 'Alpha Ventures', date: '2025-01-22 14:45', type: 'ACH', currency: 'USD' },
    { id: 'PI_773_GAMMA', status: 'Failed', amount: 98000, customer: 'Gamma Systems', date: '2025-01-21 09:00', type: 'INTERNAL', currency: 'EUR' },
    { id: 'PI_774_DELTA', status: 'Requires Action', amount: 2500000, customer: 'Quantum Research Lab', date: '2025-01-22 16:00', type: 'WIRE', currency: 'USD' }
  ]);

  // --- LOGIC & HANDLERS ---

  const logAudit = useCallback((action: string, details: string, severity: AuditEntry['severity'] = 'low') => {
    const newEntry: AuditEntry = {
      id: `AUDIT_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      action,
      user: "James B. oCallaghan III",
      details,
      severity,
      ip: "192.168.1.77"
    };
    setAuditTrail(prev => [newEntry, ...prev]);
    // Persist to local storage for "Audit Storage" requirement
    const existing = JSON.parse(localStorage.getItem('quantum_audit_log') || '[]');
    localStorage.setItem('quantum_audit_log', JSON.stringify([newEntry, ...existing].slice(0, 100)));
  }, []);

  const handleEngineToggle = () => {
    const newState = !isEngineRunning;
    setIsEngineRunning(newState);
    logAudit(newState ? "ENGINE_START" : "ENGINE_STOP", `System ignition sequence ${newState ? 'initiated' : 'terminated'}.`, 'medium');
    showNotification(newState ? "Quantum Engine Online" : "Quantum Engine Offline", newState ? "success" : "warning");
    
    if (newState) {
      let hp = 0;
      const interval = setInterval(() => {
        hp += 150;
        setEngineHorsepower(hp);
        if (hp >= 1200) clearInterval(interval);
      }, 50);
    } else {
      setEngineHorsepower(0);
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMfaStep('CHALLENGE');
    logAudit("PAYMENT_INITIATION", "New high-value wire transfer requested. MFA triggered.", "high");
  };

  const verifyMfa = () => {
    setMfaStep('SUCCESS');
    logAudit("MFA_VERIFIED