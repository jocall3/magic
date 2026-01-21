import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
    Container, Row, Col, Card, Button, Tabs, Tab, 
    Form, Modal, Table, Badge, ProgressBar, ListGroup, 
    InputGroup, Spinner, Alert, Nav, Navbar 
} from 'react-bootstrap';
import { GoogleGenAI } from "@google/genai";

/**
 * ================================================================================================
 * QUANTUM FINANCIAL - VENTURE CAPITAL DESK (MONOLITHIC DEMO)
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
 * SECURITY:
 * - Multi-factor auth simulations.
 * - Fraud monitoring.
 * - Audit Storage: Every sensitive action is logged.
 * 
 * AI INTEGRATION:
 * - Powered by Gemini-3-Flash-Preview.
 * - Context-aware chat bar.
 * - Ability to interact with the app state.
 * 
 * AUTHOR: James Burvel oCallaghan III (Sovereign Architect)
 * EIN: 2021 (Legacy Reference)
 * ================================================================================================
 */

// --- TYPES & INTERFACES ---

interface AuditLog {
    id: string;
    timestamp: string;
    action: string;
    actor: string;
    details: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

interface Deal {
    id: string;
    companyName: string;
    sector: string;
    valuation: number;
    fundingRound: string;
    status: 'DUE_DILIGENCE' | 'NEGOTIATION' | 'APPROVED' | 'REJECTED' | 'CLOSED';
    riskScore: number;
    aiSentiment: string;
    lastUpdated: string;
}

interface PortfolioCompany {
    id: string;
    name: string;
    equity: number;
    investedAmount: number;
    currentValue: number;
    burnRate: number;
    runwayMonths: number;
    hq: string;
    ceo: string;
}

interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
}

// --- CONSTANTS & MOCK DATA ---

const SECTORS = ['FinTech', 'BioTech', 'Quantum Computing', 'SpaceTech', 'AI/ML', 'Clean Energy'];
const ROUNDS = ['Seed', 'Series A', 'Series B', 'Series C', 'Growth'];

const INITIAL_DEALS: Deal[] = [
    { id: 'D-001', companyName: 'Nexus Neural', sector: 'AI/ML', valuation: 45000000, fundingRound: 'Series A', status: 'DUE_DILIGENCE', riskScore: 24, aiSentiment: 'Highly Bullish', lastUpdated: new Date().toISOString() },
    { id: 'D-002', companyName: 'Orbit Logistics', sector: 'SpaceTech', valuation: 120000000, fundingRound: 'Series B', status: 'NEGOTIATION', riskScore: 68, aiSentiment: 'Cautious', lastUpdated: new Date().toISOString() },
    { id: 'D-003', companyName: 'GreenFusion', sector: 'Clean Energy', valuation: 85000000, fundingRound: 'Series A', status: 'APPROVED', riskScore: 12, aiSentiment: 'Stable Growth', lastUpdated: new Date().toISOString() },
    { id: 'D-004', companyName: 'Quantum Ledger', sector: 'FinTech', valuation: 250000000, fundingRound: 'Series C', status: 'CLOSED', riskScore: 5, aiSentiment: 'Market Leader', lastUpdated: new Date().toISOString() },
];

const INITIAL_PORTFOLIO: PortfolioCompany[] = [
    { id: 'P-001', name: 'Aether Bio', equity: 12.5, investedAmount: 5000000, currentValue: 18000000, burnRate: 250000, runwayMonths: 14, hq: 'Zurich, CH', ceo: 'Dr. Elena Vance' },
    { id: 'P-002', name: 'Titan Robotics', equity: 8.2, investedAmount: 12000000, currentValue: 45000000, burnRate: 800000, runwayMonths: 8, hq: 'Tokyo, JP', ceo: 'Kenji Sato' },
    { id: 'P-003', name: 'Solaris Grid', equity: 15.0, investedAmount: 3000000, currentValue: 12500000, burnRate: 120000, runwayMonths: 22, hq: 'Austin, TX', ceo: 'Sarah Jenkins' },
];

// --- STYLES (Glassmorphism & Elite UI) ---

const styles = {
    glassCard: {
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '15px',
        color: '#fff',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    },
    sidebar: {
        height: '100vh',
        position: 'sticky' as 'sticky',
        top: 0,
        background: '#0a0a0a',
        borderRight: '1px solid #333',
        padding: '20px',
        overflowY: 'auto' as 'auto',
    },
    chatBar: {
        position: 'fixed' as 'fixed',
        bottom: '20px',
        right: '20px',
        width: '400px',
        height: '500px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column' as 'column',
    },
    quantumTicker: {
        background: '#000',
        color: '#0f0',
        fontFamily: 'monospace',
        padding: '5px 0',
        fontSize: '0.8rem',
        overflow: 'hidden',
        whiteSpace: 'nowrap' as 'nowrap',
    }
};

// --- MAIN COMPONENT ---

const VentureCapitalDeskView = () => {
    // --- STATE ---
    const [activeTab, setActiveTab] = useState('dashboard');
    const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
    const [portfolio, setPortfolio] = useState<PortfolioCompany[]>(INITIAL_PORTFOLIO);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
    const [showInvestmentModal, setShowInvestmentModal] = useState(false);
    const [mfaVerified, setMfaVerified] = useState(false);
    const [isSystemLoading, setIsSystemLoading] = useState(true);
    
    // AI State
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
        { role: 'assistant', content: "Welcome to Quantum Financial's VC Desk. I am your Sovereign Strategist. How can I help you navigate the markets today?", timestamp: new Date().toLocaleTimeString() }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isAiThinking, setIsAiThinking] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // --- HELPERS ---

    const logAction = useCallback((action: string, details: string, severity: AuditLog['severity'] = 'LOW') => {
        const newLog: AuditLog = {
            id: `LOG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            timestamp: new Date().toISOString(),
            action,
            actor: 'James B. oCallaghan III',
            details,
            severity
        };
        setAuditLogs(prev => [newLog, ...prev]);
        console.log(`[AUDIT STORAGE] ${action}: ${details}`);
    }, []);

    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

    // --- AI LOGIC ---

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    useEffect(() => {
        // Simulate system boot
        setTimeout(() => {
            setIsSystemLoading(false);
            logAction('SYSTEM_BOOT', 'Quantum Financial VC Desk initialized successfully.', 'LOW');
        }, 2000);
    }, [logAction]);

    const handleAiCommand = async (input: string) => {
        if (!input.trim()) return;

        const userMsg: ChatMessage = { role: 'user', content: input, timestamp: new Date().toLocaleTimeString() };
        setChatHistory(prev => [...prev, userMsg]);
        setUserInput('');
        setIsAiThinking(true);

        try {
            const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY || "DEMO_KEY");
            const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

            const systemPrompt = `
                You are the "Sovereign Strategist", an elite AI for Quantum Financial.
                Context: You are managing a Venture Capital Desk.
                Current App State:
                - Active Tab: ${activeTab}
                - Total Deals: ${deals.length}
                - Portfolio Companies: ${portfolio.length}
                
                Instructions:
                1. Be professional, elite, and high-performance.
                2. You can "interact" with the app. If the user asks to see something, tell them you are switching tabs.
                3. If the user asks to create a deal, provide a JSON-like response in your text that I can parse.
                4. Use the metaphor of "test driving a car" or "engine roar" occasionally.
                5. Never mention Citibank.
                
                User said: ${input}
            `;

            const result = await model.generateContent(systemPrompt);
            const responseText = result.response.text();

            // Logic to "interact" with the app based on AI response
            if (responseText.toLowerCase().