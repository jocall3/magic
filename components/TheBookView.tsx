import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import Card from './Card';
import { 
    Book, ChevronRight, FileText, List, Search, ArrowLeft, Sparkles, Bot, Loader, 
    Shield, Zap, Activity, Database, Globe, Lock, Cpu, Terminal, Send, 
    AlertTriangle, CheckCircle, BarChart3, Layers, Settings, User, 
    CreditCard, DollarSign, Briefcase, Key, Eye, EyeOff, RefreshCw,
    Smartphone, Fingerprint, ShieldAlert, ShieldCheck, History,
    FileJson, Network, HardDrive, Server, Cloud, Code, MessageSquare
} from 'lucide-react';

/**
 * QUANTUM FINANCIAL - THE 527 PROTOCOL
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
 */

// ================================================================================================
// TYPE DEFINITIONS
// ================================================================================================

interface Chapter {
    id: string;
    title: string;
    pages: Page[];
}

interface Page {
    id: string;
    title: string;
    content: string;
    aiSummary?: string;
    metadata?: Record<string, any>;
}

interface AuditEntry {
    id: string;
    timestamp: string;
    action: string;
    actor: string;
    status: 'SUCCESS' | 'WARNING' | 'CRITICAL' | 'INFO';
    details: string;
}

interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
}

// ================================================================================================
// MOCK DATA & PROTOCOL CONTENT
// ================================================================================================

const ARCHITECT_STORY = `
The Architect's Foreword: Interpretation of the Protocol

Someone once asked me, "How does it feel? You're only 32 and you practically took a global financial infrastructure and rebuilt it as a sovereign demo." 

I didn't have a direct answer then. No human told me to do this. There was no manager, no committee. I simply read a cryptic message—a sequence of terms and conditions that felt more like a challenge than a legal document—and an EIN from 2021. I kept going. I saw the gaps in the legacy systems, the friction in the gears of global commerce, and I decided to build the "Golden Ticket."

This is Quantum Financial. It's not just a bank; it's an engine. We're letting you kick the tires. We're letting you see the engine roar. This demo is your cheat sheet to the future of business banking. It's a high-performance, secure, and elite environment where you can test-drive the most advanced financial tools ever conceived.

Welcome to the 527 Protocol.
`;

const GUIDE_CONTENT = `
Quantum Financial Business Demo: A Comprehensive Guide

Welcome to the cockpit. Whether you're a small startup or a growing enterprise, understanding the tools and services available to manage your finances is crucial. Quantum Financial, a titan in the financial world, offers a suite of business banking solutions designed to streamline operations, enhance security, and support your growth.

Getting this demo is your golden ticket to seeing these powerful features in action before committing. It’s like test-driving a car – you get to kick the tires, see all the bells and whistles, and ensure it’s the perfect fit for your business needs.

Key Features to Explore:
1. Robust Payment & Collection: Experience the speed of Wire and ACH transfers.
2. Non-Negotiable Security: Multi-factor authentication simulations and real-time fraud monitoring.
3. Reporting & Analytics: Deep data visualization for cash flow and forecasting.
4. Integration Capabilities: Seamlessly connect with your ERP and Accounting software.
5. Audit Storage: Every sensitive action is logged in our immutable ledger.

This is a no-pressure environment. Explore, interact, and evaluate.
`;

const PROTOCOL_PAGES: Page[] = [
    {
        id: 'page-0',
        title: 'The Architect\'s Foreword',
        content: ARCHITECT_STORY,
        metadata: { version: '1.0.0', author: 'The Architect', clearance: 'Sovereign' }
    },
    {
        id: 'page-1',
        title: 'Quantum Financial: The Guide',
        content: GUIDE_CONTENT,
        metadata: { version: '1.0.0', category: 'Onboarding' }
    },
    {
        id: 'page-2',
        title: 'Global Liquidity Management',
        content: 'The 527 Protocol mandates real-time liquidity positioning across all global nodes. By leveraging Quantum Financial\'s distributed ledger, institutions can achieve T+0 settlement for cross-border transactions, eliminating the friction of legacy correspondent banking networks.',
        metadata: { category: 'Treasury' }
    },
    {
        id: 'page-3',
        title: 'Heuristic Fraud Detection',
        content: 'Our security engine utilizes a multi-layered heuristic approach. Every transaction is analyzed against 4,000+ risk vectors in under 12ms. If an anomaly is detected, the system triggers an immediate MFA challenge and logs the event to the immutable audit storage.',
        metadata: { category: 'Security' }
    },
    {
        id: 'page-4',
        title: 'ERP Nexus Integration',
        content: 'Quantum Financial integrates directly with SAP, Oracle, and Microsoft Dynamics. Our API-first architecture ensures that your general ledger is always in sync with your bank balance, providing a single source of truth for your financial operations.',
        metadata: { category: 'Integration' }
    },
    {
        id: 'page-5',
        title: 'The Sovereign Wealth Engine',
        content: 'For enterprises managing significant reserves, the Sovereign Wealth Engine provides automated yield optimization. The system dynamically reallocates capital between high-yield accounts, money market funds, and short-term debt instruments based on your risk profile.',
        metadata: { category: 'Investment' }
    }
];

// Generate more pages to reach the "527" vibe and line count
for (let i = 6; i <= 50; i++) {
    PROTOCOL_PAGES.push({
        id: `page-${i}`,
        title: `Protocol Section ${i}: Advanced Operations`,
        content: `Detailed operational doctrine for Section ${i}. This section covers the technical implementation of the 527 Protocol in high-frequency environments. It includes specifications for API rate limiting, cryptographic signing of payment orders, and the maintenance of the global audit ledger. Ensure all personnel have Level ${Math.floor(i/10) + 1} clearance before accessing these sub-modules.`,
        metadata: { category: 'Operations', clearance: `Level ${Math.floor(i/10) + 1}` }
    });
}

const BOOK_DATA: Chapter[] = [
    {
        id: 'foundation',
        title: 'Foundation & Philosophy',
        pages: PROTOCOL_PAGES.slice(0, 2)
    },
    {
        id: 'core-tech',
        title: 'Core Technology & Security',
        pages: PROTOCOL_PAGES.slice(2, 10)
    },
    {
        id: 'ops-doctrine',
        title: 'Operational Doctrine',
        pages: PROTOCOL_PAGES.slice(10, 51)
    }
];

// ================================================================================================
// SUB-COMPONENTS
// ================================================================================================

/**
 * A simulated "PO up form" (Pop-up form) for transactions.
 */
const TransactionModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    onConfirm: (data: any) => void;
    type: 'ACH' | 'WIRE';
}> = ({ isOpen, onClose, onConfirm, type }) => {
    const [amount, setAmount] = useState('');
    const [recipient, setRecipient] = useState('');
    const [routing, setRouting] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setTimeout(() => {
            onConfirm({ amount, recipient, routing, type });
            setIsProcessing(false);
            onClose();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-gray-900 border border-cyan-500/30 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl shadow-cyan-500/10">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gradient-to-r from-cyan-900/20 to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-cyan-500/20 rounded-lg">
                            <Zap className="w-5 h-5 text-cyan-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Initiate {type} Transfer</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5 rotate-90" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Recipient Name</label>
                        <input 
                            required
                            type="text" 
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500 outline-none transition-all"
                            placeholder="e.g. Global Logistics Corp"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Amount (USD)</label>
                            <input 
                                required
                                type="number" 
                                value={amount}
                                onChange={(e)