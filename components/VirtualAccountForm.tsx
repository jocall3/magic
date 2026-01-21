import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { GoogleGenAI } from "@google/genai";
import {
  VirtualAccount,
} from '../types';
import { useInternalAccounts } from '../hooks/useInternalAccounts';
import { useCounterparties } from '../hooks/useCounterparties';

/**
 * QUANTUM FINANCIAL - VIRTUAL ACCOUNT ENGINE V4.0
 * 
 * PHILOSOPHY:
 * - This is a "Golden Ticket" experience.
 * - We are letting the user "Test Drive" the car (the code).
 * - It must have "Bells and Whistles" - distinct features, high polish.
 * - It is a "Cheat Sheet" for business banking.
 * - NO PRESSURE environment.
 * - Metaphor: Kick the tires. See the engine roar.
 * 
 * SYSTEM ORIGIN:
 * Architect: James Burvel oCallaghan III (32)
 * Interpretation: Cryptic message & EIN 2021
 * Mission: Transform global banking demos into high-performance sovereign states.
 * 
 * SECURITY PROTOCOL:
 * - Multi-factor auth simulations.
 * - Fraud monitoring (Heuristic Analysis).
 * - Audit Storage: Every sensitive action is logged.
 */

// ================================================================================================
// TYPE DEFINITIONS & INTERFACES
// ================================================================================================

interface VirtualAccountCreateRequest {
    name: string;
    description?: string;
    counterparty_id?: string;
    internal_account_id: string;
    debit_ledger_account_id?: string;
    credit_ledger_account_id?: string;
    metadata?: Record<string, string>;
    account_details?: any[];
    routing_details?: any[];
}

interface VirtualAccountUpdateRequest {
    name?: string;
    description?: string;
    metadata?: Record<string, string>;
}

interface VirtualAccountFormProps {
  initialValues?: VirtualAccount;
  onSubmit: (
    data: VirtualAccountCreateRequest | VirtualAccountUpdateRequest,
  ) => void;
  isSubmitting: boolean;
  error?: string;
}

interface AuditEntry {
    id: string;
    timestamp: string;
    action: string;
    actor: string;
    status: 'SUCCESS' | 'WARNING' | 'CRITICAL';
    details: string;
}

interface ChatMessage {
    role: 'user' | 'ai' | 'system';
    content: string;
    timestamp: string;
}

// ================================================================================================
// INTERNAL UI COMPONENTS (Self-Contained)
// ================================================================================================

const QuantumInput: React.FC<{
    label: string;
    error?: string;
    placeholder?: string;
    type?: string;
    [key: string]: any;
}> = React.forwardRef(({ label, error, placeholder, type = "text", ...props }, ref: any) => (
    <div className="flex flex-col space-y-1 w-full">
        <label className="text-xs font-bold uppercase tracking-widest text-cyan-500/80 ml-1">
            {label}
        </label>
        <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            className={`
                bg-gray-900/80 border-2 transition-all duration-300 px-4 py-3 rounded-lg text-white placeholder-gray-600
                focus:outline-none focus:ring-2 focus:ring-cyan-500/20
                ${error ? 'border-red-500/50 focus:border-red-500' : 'border-gray-800 focus:border-cyan-500/50'}
            `}
            {...props}
        />
        {error && <span className="text-[10px] text-red-400 font-medium ml-1">{error}</span>}
    </div>
));

const QuantumButton: React.FC<{
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    isLoading?: boolean;
    [key: string]: any;
}> = ({ children, variant = 'primary', isLoading, ...props }) => {
    const variants = {
        primary: 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/20',
        secondary: 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700',
        danger: 'bg-red-900/40 hover:bg-red-800/60 text-red-200 border border-red-500/30',
        ghost: 'bg-transparent hover:bg-white/5 text-gray-400 hover:text-white'
    };

    return (
        <button
            className={`
                relative overflow-hidden px-6 py-3 rounded-lg font-bold text-sm transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2
                active:scale-95 ${variants[variant]}
            `}
            {...props}
        >
            {isLoading ? (
                <div className="flex items-center space-x-2">
                    <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Processing...</span>
                </div>
            ) : children}
        </button>
    );
};

// ================================================================================================
// MAIN COMPONENT
// ================================================================================================

const VirtualAccountForm: React.FC<VirtualAccountFormProps> = ({
  initialValues,
  onSubmit,
  isSubmitting,
  error,
}) => {
  // --- STATE MANAGEMENT ---
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'system', content: 'Quantum AI Core Initialized. Ready to assist with Virtual Account Architecture.', timestamp: new Date().toLocaleTimeString() }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingData, setPendingData] = useState<any>(null);
  const [mfaVerified, setMfaVerified] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [fraudScore, setFraudScore] = useState(0);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- FORM INITIALIZATION ---
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VirtualAccountCreateRequest & VirtualAccountUpdateRequest>({
    defaultValues: initialValues || {
        name: '', description: '', counterparty_id: '', internal_account_id: '',
        debit_ledger_account_id: '', credit_ledger_account_id: '', metadata: {},
        account_details: [], routing_details: [],
    },
  });

  const { data: internalAccounts } = useInternalAccounts();
  const { data: counterparties } = useCounterparties();
  const formValues = watch();

  // --- AI INTEGRATION (GEMINI) ---
  const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY || '');
  
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const logAction = useCallback((action: string, details: string, status: AuditEntry['status'] = 'SUCCESS') => {
    const newEntry: AuditEntry = {
        id: `LOG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        timestamp: new Date().toISOString(),
        action,
        actor: 'SYSTEM_ARCHITECT_JAMES',
        status,
        details
    };
    setAuditLogs(prev => [newEntry, ...prev].slice(0, 50));
  }, []);

  const handleAiChat = async () => {
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = { role: 'user', content: chatInput, timestamp: new Date().toLocaleTimeString() };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsAiThinking(true);
    logAction('AI_QUERY', `User asked: ${chatInput.substring(0, 30)}...`);

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
        const prompt = `
            You are the Quantum Financial AI Assistant. 
            Context: We are in a high-performance business banking demo.
            The user is interacting with a Virtual Account Form.
            Current Form State: ${JSON.stringify(formValues)}
            Available Internal Accounts: ${JSON.stringify(internalAccounts?.map(a => a.name))}
            Available Counterparties: ${JSON.stringify(counterparties?.map(c => c.name))}
            
            Instructions:
            1. Be elite, professional, and helpful.
            2. If the user asks to "fill the form" or "help me set up", provide a JSON block at the end of your response starting with [ACTION:UPDATE_FORM] followed by a JSON object of fields to update.
            3. Mention that this is a "Golden Ticket" experience and they are "Kicking the tires" of the engine.
            4. Do NOT use the name Citibank. Use Quantum Financial.
            5. Reference the EIN 2021 as a system validation key if appropriate.
            
            User Message: ${chatInput}
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        // Parse actions
        if (responseText.includes('[ACTION:UPDATE_FORM]')) {
            const parts = responseText.split('[ACTION:UPDATE_FORM]');
            const jsonStr = parts[1].trim();
            try {
                const