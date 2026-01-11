import React, { useState, useEffect, useRef, useCallback, useContext, useReducer, useMemo } from 'react';
import { View, Transaction } from '../types';
import { DataContext } from '../context/DataContext';

// --- Enhanced Type Definitions for a more complex system ---
type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking' | 'error';
type VoiceMode = 'general' | 'confirm_payment' | 'confirm_trade' | 'data_exploration';

interface ConfirmationPayload {
    type: 'payment' | 'trade';
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
}

type Action =
    | { type: 'OPEN_MODAL' }
    | { type: 'CLOSE_MODAL' }
    | { type: 'SET_VOICE_STATE'; payload: VoiceState }
    | { type: 'SET_TRANSCRIPT'; payload: string }
    | { type: 'SET_AI_RESPONSE'; payload: { text: string; speak?: boolean } }
    | { type: 'SET_ERROR'; payload: string }
    | { type: 'REQUEST_CONFIRMATION'; payload: ConfirmationPayload }
    | { type: 'RESET' };

// --- State Management via Reducer for complex interactions ---
const initialState: VoiceAssistantState = {
    isModalOpen: false,
    voiceState: 'idle',
    voiceMode: 'general',
    transcript: '',
    aiResponse: 'Hello! How can I help you?',
    confirmationPayload: null,
    error: null,
};

function voiceReducer(state: VoiceAssistantState, action: Action): VoiceAssistantState {
    switch (action.type) {
        case 'OPEN_MODAL':
            return { ...initialState, isModalOpen: true };
        case 'CLOSE_MODAL':
            return { ...state, isModalOpen: false };
        case 'SET_VOICE_STATE':
            return { ...state, voiceState: action.payload, error: action.payload === 'error' ? state.error : null };
        case 'SET_TRANSCRIPT':
            return { ...state, transcript: action.payload };
        case 'SET_AI_RESPONSE':
            return { ...state, aiResponse: action.payload.text };
        case 'SET_ERROR':
            return { ...state, voiceState: 'error', error: action.payload, aiResponse: `Error: ${action.payload}` };
        case 'REQUEST_CONFIRMATION':
            return {
                ...state,
                voiceMode: action.payload.type === 'payment' ? 'confirm_payment' : 'confirm_trade',
                confirmationPayload: action.payload,
            };
        case 'RESET':
            return {
                ...state,
                voiceMode: 'general',
                confirmationPayload: null,
                transcript: '',
                voiceState: 'idle',
            };
        default:
            return state;
    }
}

// --- Gemini-powered Action Definition ---
type AiAction =
    | { type: 'navigate'; view: View }
    | { type: 'speak'; text: string }
    | { type: 'request_payment_confirmation'; recipient: string; amount: number }
    | { type: 'request_trade_confirmation'; action: 'buy' | 'sell'; shares: number; ticker: string }
    | { type: 'query_stock_price'; ticker: string }
    | { type: 'query_spending'; period: 'last_month' }
    | { type: 'unhandled'; reason?: string };


// --- Mock Gemini AI Service ---
// In a real application, this would be a call to a backend service that interacts with the Google Gemini API.
// This mock simulates the AI's ability to understand natural language and return structured data for the app to execute.
const getAiAction = async (command: string, context: { transactions: Transaction[] }): Promise<AiAction> => {
    await new Promise(res => setTimeout(res, 600 + Math.random() * 800)); // Simulate network latency and AI "thinking" time
    const lowerCommand = command.toLowerCase().trim();

    // Navigation
    const navMatch = lowerCommand.match(/^(show|go to|take me to|open|view) (my )?(.+)$/i);
    if (navMatch) {
        const spokenView = navMatch[3].trim().replace(/\.$/, '');
        const normalize = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '');
        const aliases: { [key: string]: string } = { home: 'dashboard', overview: 'dashboard', sso: 'singlesignon', plaid: 'datanetwork', stripe: 'payments', marqeta: 'cardprograms', cards: 'cardprograms', budgets: 'budgeting', transactions: 'transaction-history' };
        const searchKey = normalize(spokenView);
        const canonicalKey = aliases[searchKey] || searchKey;
        const targetView = Object.values(View).find(v => normalize(v) === canonicalKey);
        if (targetView) {
            return { type: 'navigate', view: targetView };
        }
    }

    // Send Money
    const payMatch = lowerCommand.match(/^(pay|send) (.+?) \$?(\d+(\.\d{1,2})?)/i);
    if (payMatch) {
        const recipient = payMatch[2].trim();
        const amount = parseFloat(payMatch[3]);
        return { type: 'request_payment_confirmation', recipient, amount };
    }

    // Trading
    const tradeMatch = lowerCommand.match(/^(buy|sell) (\d+) shares? of ([a-zA-Z]+)/i);
    if (tradeMatch) {
        const [, action, sharesStr, ticker] = tradeMatch;
        const shares = parseInt(sharesStr, 10);
        return { type: 'request_trade_confirmation', action: action as 'buy' | 'sell', shares, ticker };
    }

    const priceMatch = lowerCommand.match(/^(what's|what is) the price of ([a-zA-Z]+)/i);
    if (priceMatch) {
        const ticker = priceMatch[2];
        return { type: 'query_stock_price', ticker };
    }

    // Data Query
    if (lowerCommand.includes('spending last month')) {
        return { type: 'query_spending', period: 'last_month' };
    }

    // Fallback
    return { type: 'unhandled', reason: 'Command not recognized' };
};


// --- Mock High-Frequency Trading API ---
const mockTradingApi = {
    fetchStockPrice: async (ticker: string): Promise<number> => {
        await new Promise(res => setTimeout(res, 400 + Math.random() * 400));
        const hash = ticker.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
        const basePrice = (Math.abs(hash) % 500) + 10;
        return parseFloat((basePrice + (Math.random() - 0.5) * (basePrice * 0.1)).toFixed(2));
    },
    executeTrade: async (ticker: string, shares: number, action: 'buy' | 'sell'): Promise<{ success: boolean; cost: number }> => {
        await new Promise(res => setTimeout(res, 700 + Math.random() * 500));
        const price = await mockTradingApi.fetchStockPrice(ticker);
        const cost = price * shares;
        console.log(`TRADE EXECUTED: ${action.toUpperCase()} ${shares} shares of ${ticker.toUpperCase()} @ $${price}/share for a total of $${cost.toFixed(2)}`);
        return { success: true, cost };
    }
};

// --- Advanced UI Components ---
const MicIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-8 w-8"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
);

const SpinnerIcon = ({ className }: { className?: string }) => (
    <svg className={className || "h-12 w-12 animate-spin"} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const VoiceWaveVisualizer: React.FC<{ state: VoiceState }> = ({ state }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        const isListening = state === 'listening';
        const isProcessing = state === 'processing';
        let t = 0;

        const render = () => {
            t += 0.05;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
            gradient.addColorStop(0, '#06b6d4');
            gradient.addColorStop(0.5, '#22d3ee');
            gradient.addColorStop(1, '#67e8f9');
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;

            ctx.beginPath();
            for (let x = 0; x < canvas.width; x++) {
                const amplitude = isListening ? 20 + 15 * Math.sin(x * 0.1 + t) : isProcessing ? 5 + 3 * Math.sin(t * 5) : 2;
                const frequency = isListening ? 0.05 + 0.02 * Math.cos(t) : 0.1;
                const y = canvas.height / 2 + amplitude * Math.sin(x * frequency + t);
                ctx.lineTo(x, y);
            }
            ctx.stroke();
            animationFrameId = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrameId);
    }, [state]);

    return <canvas ref={canvasRef} width="400" height="60" className="w-full h-16" />;
};

const ConfirmationView: React.FC<{
    payload: ConfirmationPayload;
    onConfirm: () => void;
    onCancel: () => void;
}> = ({ payload, onConfirm, onCancel }) => {
    return (
        <div className="bg-gray-900/50 p-6 rounded-lg border border-yellow-500/50">
            <h4 className="text-xl font-bold text-yellow-300 mb-3">Please Confirm</h4>
            {payload.type === 'payment' && (
                <p className="text-lg text-white">
                    Send <span className="font-bold text-cyan-300">${payload.details.amount.toFixed(2)}</span> to <span className="font-bold text-cyan-300">{payload.details.recipient}</span>?
                </p>
            )}
            {payload.type === 'trade' && (
                <p className="text-lg text-white">
                    {payload.details.action === 'buy' ? 'Buy' : 'Sell'} <span className="font-bold text-cyan-300">{payload.details.shares}</span> shares of <span className="font-bold text-cyan-300">{payload.details.ticker.toUpperCase()}</span>?
                </p>
            )}
            <p className="text-sm text-gray-400 mt-2">Say "Confirm" or "Yes" to proceed, or "Cancel" to go back.</p>
            <div className="flex justify-center gap-4 mt-6">
                <button onClick={onConfirm} className="px-8 py-3 bg-green-600 hover:bg-green-500 rounded-lg text-white font-bold transition-all">Confirm</button>
                <button onClick={onCancel} className="px-8 py-3 bg-red-600 hover:bg-red-500 rounded-lg text-white font-bold transition-all">Cancel</button>
            </div>
        </div>
    );
};

const VoiceModal: React.FC<{
    state: VoiceAssistantState;
    onClose: () => void;
    processUtterance: (utterance: string) => void;
    confirmAction: () => void;
    cancelAction: () => void;
}> = ({ state, onClose, processUtterance, confirmAction, cancelAction }) => {
    const { voiceState, transcript, aiResponse, confirmationPayload } = state;
    const commands = ["Show my dashboard", "What was my total spending last month?", "Pay Alex Ray $50 for dinner", "What's the price of TSLA?", "Buy 10 shares of GOOG"];

    const stateText: { [key in VoiceState]: string } = {
        idle: 'Ready',
        listening: 'Listening...',
        processing: 'Thinking...',
        speaking: 'Speaking...',
        error: 'Error'
    };

    const Icon = useMemo(() => {
        switch (voiceState) {
            case 'processing': return <SpinnerIcon className="h-12 w-12 text-cyan-300" />;
            default: return <MicIcon className="h-12 w-12 text-cyan-300" />;
        }
    }, [voiceState]);

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-md animate-fade-in" onClick={onClose}>
            <div className="bg-gray-800 rounded-2xl p-8 max-w-2xl w-full text-center border border-gray-700 shadow-2xl shadow-cyan-500/10" onClick={e => e.stopPropagation()}>
                <div className="relative w-24 h-24 mx-auto rounded-full bg-cyan-500/20 flex items-center justify-center mb-4">
                    {voiceState === 'listening' && <div className="absolute inset-0 rounded-full bg-cyan-500/30 animate-ping"></div>}
                    {Icon}
                </div>
                <h3 className="text-2xl font-bold text-white min-h-[2.25rem]">{stateText[voiceState]}</h3>
                <p className="text-gray-300 mt-2 mb-4 min-h-[1.5rem] italic">{transcript || ' '}</p>
                <VoiceWaveVisualizer state={voiceState} />
                <div className="min-h-[7rem] text-center flex items-center justify-center my-4 p-4 bg-gray-900/50 rounded-lg">
                    {confirmationPayload ? (
                        <ConfirmationView payload={confirmationPayload} onConfirm={confirmAction} onCancel={cancelAction} />
                    ) : (
                        <p className="text-lg text-cyan-200">{aiResponse}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <p className="text-sm text-gray-500">Or try saying:</p>
                    {commands.slice(0, 3).map(cmd => (
                        <button key={cmd} onClick={() => processUtterance(cmd)} className="w-full text-left p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-cyan-200 transition-colors">
                            "{cmd}"
                        </button>
                    ))}
                </div>
            </div>
            <style>{`
                @keyframes fade-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

// --- Main Voice Control Component ---
interface VoiceControlProps {
    setActiveView: (view: View) => void;
}

const VoiceControl: React.FC<VoiceControlProps> = ({ setActiveView }) => {
    const [state, dispatch] = useReducer(voiceReducer, initialState);
    const { voiceState, confirmationPayload } = state;

    const recognitionRef = useRef<any>(null);
    const dataContext = useContext(DataContext);
    const isMounted = useRef(false);

    const speak = useCallback((text: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (!isMounted.current) return reject();
            dispatch({ type: 'SET_AI_RESPONSE', payload: { text } });
            dispatch({ type: 'SET_VOICE_STATE', payload: 'speaking' });
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onend = () => { if (isMounted.current) resolve(); };
            utterance.onerror = (e) => {
                if (isMounted.current) dispatch({ type: 'SET_ERROR', payload: "Sorry, I couldn't speak." });
                reject(e);
            };
            window.speechSynthesis.speak(utterance);
        });
    }, []);

    const startListening = useCallback(() => {
        if (recognitionRef.current && voiceState !== 'listening') {
            dispatch({ type: 'SET_TRANSCRIPT', payload: '' });
            try {
                recognitionRef.current.start();
            } catch (error) {
                console.warn("Speech recognition already started.", error);
            }
        }
    }, [voiceState]);

    const processUtterance = useCallback(async (command: string) => {
        if (!isMounted.current) return;
        dispatch({ type: 'SET_TRANSCRIPT', payload: command });
        dispatch({ type: 'SET_VOICE_STATE', payload: 'processing' });
        const lowerCommand = command.toLowerCase().trim();

        // --- Confirmation Logic ---
        if (confirmationPayload) {
            if (['yes', 'confirm', 'proceed', 'do it'].includes(lowerCommand)) {
                await confirmationPayload.onConfirm();
            } else if (['no', 'cancel', 'stop'].includes(lowerCommand)) {
                dispatch({ type: 'RESET' });
                await speak("Action cancelled.");
            } else {
                await speak("Please say 'Confirm' or 'Cancel'.");
            }
            if (isMounted.current) startListening();
            return;
        }

        // --- Gemini-Powered Command Processing ---
        const aiAction = await getAiAction(command, { transactions: dataContext?.transactions || [] });

        switch (aiAction.type) {
            case 'navigate': {
                setActiveView(aiAction.view);
                const formatForTTS = (v: string) => v.replace(/-/g, ' ').replace(/\b(ai|sso|api)\b/gi, m => m.toUpperCase());
                await speak(`Navigating to ${formatForTTS(aiAction.view)}.`);
                dispatch({ type: 'CLOSE_MODAL' });
                break;
            }

            case 'request_payment_confirmation': {
                const { recipient, amount } = aiAction;
                dispatch({
                    type: 'REQUEST_CONFIRMATION',
                    payload: {
                        type: 'payment',
                        details: { recipient, amount },
                        onConfirm: async () => {
                            if (!dataContext) return;
                            const newTx: Transaction = { id: `tx_voice_${Date.now()}`, type: 'expense', category: 'Transfer', description: `Sent to ${recipient}`, amount, date: new Date().toISOString().split('T')[0] };
                            dataContext.addTransaction(newTx);
                            dispatch({ type: 'RESET' });
                            await speak(`Okay, I've sent $${amount} to ${recipient}.`);
                            if (isMounted.current) dispatch({ type: 'CLOSE_MODAL' });
                        }
                    }
                });
                await speak(`Just to confirm, you want to send $${amount} to ${recipient}?`);
                if (isMounted.current) startListening();
                break;
            }

            case 'request_trade_confirmation': {
                const { action, shares, ticker } = aiAction;
                dispatch({
                    type: 'REQUEST_CONFIRMATION',
                    payload: {
                        type: 'trade',
                        details: { action, shares, ticker },
                        onConfirm: async () => {
                            const result = await mockTradingApi.executeTrade(ticker, shares, action);
                            dispatch({ type: 'RESET' });
                            if (result.success) {
                                await speak(`Trade executed. You ${action === 'buy' ? 'bought' : 'sold'} ${shares} shares of ${ticker.toUpperCase()}.`);
                            } else {
                                await speak(`Sorry, the trade for ${ticker.toUpperCase()} failed.`);
                            }
                        }
                    }
                });
                await speak(`Confirm: ${action} ${shares} shares of ${ticker.toUpperCase()}?`);
                if (isMounted.current) startListening();
                break;
            }

            case 'query_stock_price': {
                const { ticker } = aiAction;
                await speak(`One moment, fetching the price for ${ticker.toUpperCase()}.`);
                const price = await mockTradingApi.fetchStockPrice(ticker);
                await speak(`The current price of ${ticker.toUpperCase()} is $${price}.`);
                if (isMounted.current) startListening();
                break;
            }

            case 'query_spending': {
                if (dataContext && aiAction.period === 'last_month') {
                    const lastMonth = new Date();
                    lastMonth.setMonth(lastMonth.getMonth() - 1);
                    const total = dataContext.transactions
                        .filter(t => new Date(t.date).getMonth() === lastMonth.getMonth() && t.type === 'expense')
                        .reduce((sum, t) => sum + t.amount, 0);
                    await speak(`Your total spending last month was $${total.toFixed(2)}.`);
                    if (isMounted.current) startListening();
                }
                break;
            }

            case 'speak': {
                await speak(aiAction.text);
                if (isMounted.current) startListening();
                break;
            }

            case 'unhandled':
            default: {
                await speak("I'm sorry, I didn't understand that. Please try again.");
                if (isMounted.current) startListening();
                break;
            }
        }
    }, [setActiveView, dataContext, speak, startListening, confirmationPayload]);

    useEffect(() => {
        isMounted.current = true;
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            dispatch({ type: 'SET_ERROR', payload: "Your browser doesn't support voice control." });
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        recognitionRef.current = recognition;

        recognition.onresult = (event: any) => {
            const finalTranscript = event.results[event.results.length - 1][0].transcript;
            if (finalTranscript) processUtterance(finalTranscript.trim());
        };
        recognition.onerror = (event: any) => dispatch({ type: 'SET_ERROR', payload: event.error });
        recognition.onstart = () => { if (isMounted.current) dispatch({ type: 'SET_VOICE_STATE', payload: 'listening' }); };
        recognition.onend = () => { if (isMounted.current && voiceState === 'listening') dispatch({ type: 'SET_VOICE_STATE', payload: 'idle' }); };

        return () => {
            isMounted.current = false;
            if (recognitionRef.current) recognitionRef.current.abort();
            window.speechSynthesis.cancel();
        };
    }, [processUtterance, voiceState]);

    const openModal = () => {
        dispatch({ type: 'OPEN_MODAL' });
        setTimeout(startListening, 300);
    };

    const closeModal = () => {
        dispatch({ type: 'CLOSE_MODAL' });
        if (recognitionRef.current) recognitionRef.current.stop();
        window.speechSynthesis.cancel();
    };

    const confirmAction = () => processUtterance('confirm');
    const cancelAction = () => processUtterance('cancel');

    return (
        <>
            <button
                onClick={openModal}
                className="fixed bottom-8 right-8 w-16 h-16 bg-cyan-600 hover:bg-cyan-500 rounded-full shadow-lg flex items-center justify-center text-white z-40 transition-transform hover:scale-110"
                aria-label="Activate Voice Control"
            >
                <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse"></div>
                <MicIcon />
            </button>
            {state.isModalOpen && (
                <VoiceModal
                    state={state}
                    onClose={closeModal}
                    processUtterance={processUtterance}
                    confirmAction={confirmAction}
                    cancelAction={cancelAction}
                />
            )}
        </>
    );
};

export default VoiceControl;