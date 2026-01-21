import React, { useState, useEffect, useRef, useCallback, useContext, useReducer, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { View, Transaction, Notification } from '../types';
import { DataContext } from '../context/DataContext';

/**
 * QUANTUM FINANCIAL - SOVEREIGN AI COMMAND CENTER
 * 
 * PHILOSOPHY:
 * - This is a "Golden Ticket" experience.
 * - We are letting the user "Test Drive" the car (the code).
 * - It must have "Bells and Whistles" - distinct features, high polish.
 * - It is a "Cheat Sheet" for business banking.
 * - NO PRESSURE environment.
 * - Metaphor: Kick the tires. See the engine roar.
 * 
 * TECHNICAL ARCHITECTURE:
 * - Robust Payment & Collection capabilities (Wire, ACH).
 * - Security is non-negotiable (Multi-factor auth simulations, Fraud monitoring).
 * - Reporting & Analytics (Data visualization).
 * - Integration capabilities (ERP, Accounting).
 * - AUDIT STORAGE: Every sensitive action must be logged.
 */

// ================================================================================================
// TYPE DEFINITIONS & CONSTANTS
// ================================================================================================

type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking' | 'error' | 'authenticating';
type VoiceMode = 'general' | 'confirm_payment' | 'confirm_trade' | 'data_exploration' | 'mfa_verification';

interface AuditEntry {
    id: string;
    timestamp: string;
    action: string;
    actor: string;
    details: string;
    riskScore: number;
    status: 'SUCCESS' | 'FLAGGED' | 'DENIED';
}

interface ConfirmationPayload {
    type: 'payment' | 'trade' | 'integration' | 'security_update';
    details: any;
    onConfirm: () => Promise<void>;
}

interface VoiceAssistantState {
    isModalOpen: boolean;
    voiceState: VoiceState;
    voiceMode: VoiceMode;
    transcript: string;
    aiResponse: string;
    confirmationPayload: ConfirmationPayload | null;
    error: string | null;
    auditLogs: AuditEntry[];
    isTestDriveMode: boolean;
    mfaCode: string;
    inputMfa: string;
}

type Action =
    | { type: 'OPEN_MODAL' }
    | { type: 'CLOSE_MODAL' }
    | { type: 'SET_VOICE_STATE'; payload: VoiceState }
    | { type: 'SET_TRANSCRIPT'; payload: string }
    | { type: 'SET_AI_RESPONSE'; payload: { text: string; speak?: boolean } }
    | { type: 'SET_ERROR'; payload: string }
    | { type: 'REQUEST_CONFIRMATION'; payload: ConfirmationPayload }
    | { type: 'LOG_AUDIT'; payload: AuditEntry }
    | { type: 'TOGGLE_TEST_DRIVE' }
    | { type: 'SET_MFA'; payload: { code: string; mode: VoiceMode } }
    | { type: 'UPDATE_MFA_INPUT'; payload: string }
    | { type: 'RESET' };

const INITIAL_STATE: VoiceAssistantState = {
    isModalOpen: false,
    voiceState: 'idle',
    voiceMode: 'general',
    transcript: '',
    aiResponse: "Welcome to the Quantum Financial Command Center. I am your Sovereign AI. How shall we optimize your global liquidity today?",
    confirmationPayload: null,
    error: null,
    auditLogs: [],
    isTestDriveMode: true,
    mfaCode: '',
    inputMfa: '',
};

// ================================================================================================
// REDUCER LOGIC
// ================================================================================================

function voiceReducer(state: VoiceAssistantState, action: Action): VoiceAssistantState {
    switch (action.type) {
        case 'OPEN_MODAL':
            return { ...state, isModalOpen: true, voiceState: 'idle' };
        case 'CLOSE_MODAL':
            return { ...state, isModalOpen: false, voiceState: 'idle' };
        case 'SET_VOICE_STATE':
            return { ...state, voiceState: action.payload, error: action.payload === 'error' ? state.error : null };
        case 'SET_TRANSCRIPT':
            return { ...state, transcript: action.payload };
        case 'SET_AI_RESPONSE':
            return { ...state, aiResponse: action.payload.text };
        case 'SET_ERROR':
            return { ...state, voiceState: 'error', error: action.payload, aiResponse: `System Alert: ${action.payload}` };
        case 'REQUEST_CONFIRMATION':
            return {
                ...state,
                voiceMode: action.payload.type === 'payment' ? 'confirm_payment' : 'confirm_trade',
                confirmationPayload: action.payload,
            };
        case 'LOG_AUDIT':
            return { ...state, auditLogs: [action.payload, ...state.auditLogs].slice(0, 50) };
        case 'TOGGLE_TEST_DRIVE':
            return { ...state, isTestDriveMode: !state.isTestDriveMode };
        case 'SET_MFA':
            return { ...state, mfaCode: action.payload.code, voiceMode: action.payload.mode, voiceState: 'authenticating' };
        case 'UPDATE_MFA_INPUT':
            return { ...state, inputMfa: action.payload };
        case 'RESET':
            return {
                ...state,
                voiceMode: 'general',
                confirmationPayload: null,
                transcript: '',
                voiceState: 'idle',
                inputMfa: '',
                mfaCode: '',
            };
        default:
            return state;
    }
}

// ================================================================================================
// AI ENGINE (GEMINI INTEGRATION)
// ================================================================================================

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenAI(GEMINI_API_KEY);

interface AiActionResponse {
    type: 'navigate' | 'payment' | 'audit_query' | 'erp_sync' | 'fraud_check' | 'speak' | 'unhandled';
    view?: View;
    recipient?: string;
    amount?: number;
    text?: string;
    reason?: string;
}

/**
 * The core intelligence of the Command Center.
 * It interprets natural language into actionable banking operations.
 */
const processAiIntelligence = async (prompt: string, context: any): Promise<AiActionResponse> => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
        
        const systemInstruction = `
            You are the Quantum Financial Sovereign AI. 
            You manage a global financial institution's business demo.
            Tone: Elite, Professional, Secure, High-Performance.
            Metaphors: "Golden Ticket", "Test Drive", "Kick the tires", "Engine roar".
            
            Context:
            - User is James, a high-net-worth architect.
            - Company: Quantum Financial (NEVER say Citibank).
            - Capabilities: Wire transfers, ACH, ERP Sync, Fraud Monitoring, Audit Logs.
            
            Rules:
            - If the user wants to see a page, return type: 'navigate' and the view name.
            - If the user wants to send money, return type: 'payment', recipient, and amount.
            - If the user asks about security or logs, return type: 'audit_query'.
            - If the user wants to sync data, return type: 'erp_sync'.
            - Otherwise, return type: 'speak' with a helpful response.
            
            Return ONLY a JSON object.
        `;

        const result = await model.generateContent([systemInstruction, prompt]);
        const responseText = result.response.text();
        
        // Clean JSON from potential markdown fences
        const cleanJson = responseText.replace(/```json|```/g, "").trim();
        return JSON.parse(cleanJson) as AiActionResponse;
    } catch (e) {
        console.error("AI Intelligence Failure:", e);
        return { type: 'speak', text: "I'm experiencing a momentary synchronization delay in my neural pathways. How else can I assist?" };
    }
};

// ================================================================================================
// SUB-COMPONENTS (UI & UTILS)
// ================================================================================================

const AuditLogStream: React.FC<{ logs: AuditEntry[] }> = ({ logs }) => (
    <div className="mt-6 bg-black/40 rounded-xl border border-gray-800 p-4 h-48 overflow-y-auto font-mono text-[10px]">
        <div className="flex justify-between items-center mb-2 border-b border-gray-800 pb-1">
            <span className="text-cyan-500 uppercase tracking-widest font-bold">Live Audit Stream</span>
            <span className="text-gray-500">SECURE_CHANNEL_77</span>
        </div>
        {logs.length === 0 && <div className="text-gray-600 italic">Waiting for system events...</div>}
        {logs.map(log => (
            <div key={log.id} className="mb-1 flex gap-2">
                <span className="text-gray-500">[{log.timestamp.split('T')[1].split('.')[0]}]</span>
                <span className={log.status === 'SUCCESS' ? 'text-green-400' : 'text-red-400'}>{log.status}</span>
                <span className="text-gray-300">{log.action}</span>
                <span className="text-cyan-700">-> {log.details}</span>
            </div>
        ))}
    </div>
);

const QuantumWave: React.FC<{ state: VoiceState }> = ({ state }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let t = 0;

        const render = () => {
            t += 0.05;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const isActive = state === 'listening' || state === 'processing' || state === 'speaking';
            const amplitude = isActive ? 25 : 5;
            const speed = isActive ? 0.1 : 0.02;

            ctx.beginPath();
            ctx.lineWidth = 2;
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
            gradient.addColorStop(0, '#0891b2');
            gradient.addColorStop(0.5, '#22d3ee');
            gradient.addColorStop(1, '#0891b2');
            ctx.strokeStyle = gradient;

            for (let x = 0; x