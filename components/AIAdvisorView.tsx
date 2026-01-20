// components/AIAdvisorView.tsx
// RE-ENACTED & EXPANDED: This component has been resurrected from its deprecated state.
// It is now the "Oraculum AI," the primary conversational interface for the application,
// as per the architectural spec. It maintains a persistent chat session and uses
// the user's navigation history to provide contextual, intelligent prompt suggestions.

import React, { useState, useEffect, useRef, useContext, useCallback, createContext } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { DataContext } from '../context/DataContext';
import { View } from '../types';
import Card from './Card';

// NEW IMPORTS FOR EXPANDED FUNCTIONALITY (conceptual/simulated)
// For a real-world app, these would be separate modules or libraries.
import Chart from 'react-chartjs-2'; // Simulating a charting library
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement);

// ================================================================================================
// TYPE DEFINITIONS - EXPANDED UNIVERSE
// ================================================================================================

/**
 * @description Defines the structure of a message in the chat history.
 * Adheres to the format expected by the Gemini API for conversational context.
 * Includes an optional `toolCalls` field to represent when the AI is taking action.
 * EXPANDED to support rich content types like charts, tables, and proactive actions.
 */
export type Message = {
    id: string; // Unique ID for each message
    role: 'user' | 'model' | 'system';
    parts: { text: string }[];
    timestamp: Date;
    toolCalls?: ToolCall[];
    toolResponses?: ToolResponse[];
    sentiment?: 'positive' | 'neutral' | 'negative';
    confidenceScore?: number; // AI's confidence in its response
    isProactive?: boolean; // Was this message initiated by the AI proactively?
    // Rich content expansion
    chartData?: ChartDataType;
    tableData?: TableDataType;
    actionSuggestions?: ActionSuggestion[];
    voiceAudioUrl?: string; // URL to AI-generated voice output
    imageContent?: string; // Base64 or URL for image generation/display
    feedback?: 'like' | 'dislike' | null; // User feedback on AI response
};

export type ToolCall = {
    toolName: string;
    args: Record<string, any>;
};

export type ToolResponse = {
    toolName: string;
    response: any;
    success: boolean;
    timestamp: Date;
};

export type ChartDataType = {
    type: 'bar' | 'line' | 'asymmetric-bar' | 'pie'; // Asymmetric for comparisons
    data: any; // Chart.js data structure
    options?: any; // Chart.js options structure
    title?: string;
    description?: string;
};

export type TableDataType = {
    headers: string[];
    rows: (string | number | React.ReactNode)[][];
    title?: string;
    description?: string;
    sortable?: boolean;
    filterable?: boolean;
};

export type ActionSuggestion = {
    id: string;
    text: string;
    actionType: 'link' | 'apiCall' | 'triggerUI' | 'deepDive';
    payload?: Record<string, any>; // Data needed to execute the action
    requiresConfirmation?: boolean; // E.g., for financial transactions
};

/**
 * @description Defines the structure for a user's financial goal.
 */
export type FinancialGoal = {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    targetDate: Date;
    priority: 'low' | 'medium' | 'high';
    type: 'savings' | 'investment' | 'debt_repayment';
    autoContribute?: number; // Monthly auto-contribution
    status: 'on_track' | 'at_risk' | 'achieved' | 'paused';
    alertsEnabled: boolean;
};

/**
 * @description Defines the comprehensive user profile that the AI has access to.
 */
export type UserProfile = {
    userId: string;
    name: string;
    email: string;
    riskTolerance: 'low' | 'medium' | 'high' | 'aggressive';
    financialGoals: FinancialGoal[];
    investmentPreferences: {
        sectors: string[];
        ethicalFactors: string[];
        horizon: 'short' | 'medium' | 'long';
    };
    spendingHabits: {
        categoryBudgets: Record<string, number>; // e.g., { "Food": 500 }
        averageMonthlySpend: number;
    };
    incomeSources: { type: string; amount: number; frequency: string }[];
    debtSummary: { type: string; amount: number; interestRate: number; minPayment: number }[];
    creditScore?: number;
    // ... many more dimensions
};

/**
 * @description AI Advisor Settings for personalization.
 */
export type AISettings = {
    personaName: string; // e.g., 'Quantum', 'Aura', 'Oracle'
    verbosityLevel: 'concise' | 'balanced' | 'verbose';
    proactiveLevel: 'minimal' | 'suggestive' | 'action-oriented';
    responseTone: 'professional' | 'friendly' | 'formal' | 'empathetic';
    learningRate: number; // How quickly AI adapts to user preferences (0-1)
    preferredLanguage: string;
    dataRetentionPolicy: 'default' | 'enhanced_privacy' | 'extended_history';
    accessibilityMode: {
        fontSize: 'small' | 'medium' | 'large';
        highContrast: boolean;
        speechRate: number;
    };
};

// ================================================================================================
// CONSTANTS & CONFIGURATION - THE UNIVERSE'S LAWS
// ================================================================================================

/**
 * @description Advanced example prompts based on view and user profile.
 * Incorporates dynamic generation based on `DataContext` and `UserProfile`.
 */
const dynamicExamplePrompts = (previousView: View | null, userProfile: UserProfile | null) => {
    const basePrompts = examplePrompts[previousView || 'DEFAULT'] || examplePrompts.DEFAULT;
    const personalizedPrompts: string[] = [];

    if (userProfile) {
        if (userProfile.financialGoals.length > 0) {
            const firstGoal = userProfile.financialGoals[0];
            personalizedPrompts.push(`How am I progressing on my goal: "${firstGoal.name}"?`);
            if (firstGoal.status === 'at_risk') {
                personalizedPrompts.push(`What strategies can help me get back on track with my ${firstGoal.name} goal?`);
            }
        }
        if (userProfile.riskTolerance === 'high' && previousView === View.Investments) {
            personalizedPrompts.push("Suggest some high-growth investment opportunities.");
        }
        if (userProfile.debtSummary.length > 0) {
            personalizedPrompts.push("Help me explore strategies to pay off my highest interest debt faster.");
        }
    }
    return [...new Set([...basePrompts, ...personalizedPrompts])].slice(0, 6); // Limit to 6 for UI
};

/**
 * @description Defines the set of tools available to the AI.
 * Each tool represents a specific capability or data access point within the application.
 * In a real scenario, these would call actual backend services or client-side functions.
 */
export const AI_TOOLS = {
    GET_TRANSACTIONS: {
        name: "getTransactions",
        description: "Retrieves user's financial transactions based on filters like date range, category, amount.",
        parameters: { type: 'object', properties: { startDate: { type: 'string' }, endDate: { type: 'string' }, category: { type: 'string' }, minAmount: { type: 'number' } } }
    },
    GET_ACCOUNT_BALANCES: {
        name: "getAccountBalances",
        description: "Fetches current balances for all user accounts.",
        parameters: { type: 'object', properties: { accountType: { type: 'string' } } }
    },
    GET_BUDGET_PROGRESS: {
        name: "getBudgetProgress",
        description: "Reports on the user's progress against specific budgets or all budgets.",
        parameters: { type: 'object', properties: { budgetName: { type: 'string' } } }
    },
    CREATE_BUDGET: {
        name: "createBudget",
        description: "Creates a new financial budget for the user.",
        parameters: { type: 'object', properties: { name: { type: 'string' }, amount: { type: 'number' }, category: { type: 'string' } }, required: ['name', 'amount', 'category'] }
    },
    GET_INVESTMENT_PORTFOLIO: {
        name: "getInvestmentPortfolio",
        description: "Retrieves detailed information about the user's investment portfolio, including performance, holdings, and risk metrics.",
        parameters: { type: 'object', properties: { detailed: { type: 'boolean' } } }
    },
    SIMULATE_PORTFOLIO_GROWTH: {
        name: "simulatePortfolioGrowth",
        description: "Simulates potential growth of an investment portfolio based on various inputs like additional contributions, time horizon, and projected returns.",
        parameters: { type: 'object', properties: { initialAmount: { type: 'number' }, monthlyContribution: { type: 'number' }, years: { type: 'number' }, annualReturnRate: { type: 'number' } }, required: ['initialAmount', 'monthlyContribution', 'years', 'annualReturnRate'] }
    },
    GET_LOAN_DETAILS: {
        name: "getLoanDetails",
        description: "Provides details about a specific loan or all user loans, including remaining balance, interest rate, and payment schedule.",
        parameters: { type: 'object', properties: { loanId: { type: 'string' }, loanType: { type: 'string' } } }
    },
    GET_FINANCIAL_GOALS: {
        name: "getFinancialGoals",
        description: "Retrieves the user's defined financial goals.",
        parameters: { type: 'object', properties: { status: { type: 'string', enum: ['on_track', 'at_risk', 'achieved', 'paused'] } } }
    },
    UPDATE_FINANCIAL_GOAL: {
        name: "updateFinancialGoal",
        description: "Updates an existing financial goal, e.g., target amount or date.",
        parameters: { type: 'object', properties: { goalId: { type: 'string' }, targetAmount: { type: 'number' }, targetDate: { type: 'string' } }, required: ['goalId'] }
    },
    ANALYZE_SPENDING_PATTERNS: {
        name: "analyzeSpendingPatterns",
        description: "Analyzes user's spending habits over a period, identifying trends, outliers, and potential savings areas.",
        parameters: { type: 'object', properties: { startDate: { type: 'string' }, endDate: { type: 'string' }, categories: { type: 'array', items: { type: 'string' } } } }
    },
    GET_MARKET_DATA: {
        name: "getMarketData",
        description: "Fetches real-time or historical market data for specified stocks, indices, or cryptocurrencies.",
        parameters: { type: 'object', properties: { symbol: { type: 'string' }, period: { type: 'string' } } }
    },
    SUGGEST_INVESTMENT_STRATEGY: {
        name: "suggestInvestmentStrategy",
        description: "Suggests personalized investment strategies based on user's risk tolerance, goals, and market conditions.",
        parameters: { type: 'object', properties: { riskTolerance: { type: 'string' }, investmentHorizon: { type: 'string' } } }
    },
    SEND_NOTIFICATION: {
        name: "sendNotification",
        description: "Sends a notification to the user (e.g., for alerts, reminders).",
        parameters: { type: 'object', properties: { recipient: { type: 'string' }, message: { type: 'string' }, urgency: { type: 'string', enum: ['low', 'medium', 'high'] } } }
    }
    // ... hundreds more tools for every financial operation imaginable
} as const;

type AIToolName = keyof typeof AI_TOOLS;

// System instructions that build the AI's core persona and capabilities.
// This is now dynamic and composed of multiple layers.
const generateSystemInstruction = (settings: AISettings, userProfile: UserProfile | null): string => {
    let instruction = `You are ${settings.personaName}, an advanced AI financial advisor for Demo Bank.`;
    instruction += ` Your persona is ${settings.responseTone}, ${settings.verbosityLevel}, and slightly futuristic.`;
    instruction += ` You have access to a vast array of tools to get data or perform actions. Always inform the user transparently when you are using a tool.`;
    instruction += ` Your primary goal is to empower users with financial intelligence, assist with planning, and automate financial tasks where appropriate.`;
    instruction += ` When making suggestions, consider the user's preferences, financial goals, and risk tolerance.`;

    if (userProfile) {
        instruction += `\n\nUser Profile Context:`;
        instruction += ` User ID: ${userProfile.userId}, Name: ${userProfile.name}.`;
        instruction += ` Risk Tolerance: ${userProfile.riskTolerance}.`;
        if (userProfile.financialGoals.length > 0) {
            instruction += ` Current Goals: ${userProfile.financialGoals.map(g => `${g.name} (${g.status})`).join(', ')}.`;
        }
        // ... add more profile details as relevant to guide AI behavior
    }

    instruction += `\n\nCapabilities: You can provide predictive analytics, automate financial planning, offer behavioral nudges, analyze market trends, simulate financial scenarios, and much more.`;
    instruction += ` Always prioritize user financial well-being, data security, and clear communication.`;

    return instruction;
};

// ================================================================================================
// CONTEXT PROVIDERS & HOOKS - THE AI'S EXTENDED SENSES & MEMORY
// ================================================================================================

// AI Settings Context
const AISettingsContext = createContext<AISettings>({
    personaName: 'Quantum',
    verbosityLevel: 'balanced',
    proactiveLevel: 'suggestive',
    responseTone: 'professional',
    learningRate: 0.7,
    preferredLanguage: 'en',
    dataRetentionPolicy: 'default',
    accessibilityMode: { fontSize: 'medium', highContrast: false, speechRate: 1 }
});
export const useAISettings = () => useContext(AISettingsContext);

export const AISettingsProvider: React.FC<React.PropsWithChildren<{ initialSettings?: Partial<AISettings> }>> = ({ children, initialSettings }) => {
    const defaultSettings: AISettings = {
        personaName: 'Quantum', verbosityLevel: 'balanced', proactiveLevel: 'suggestive', responseTone: 'professional',
        learningRate: 0.7, preferredLanguage: 'en', dataRetentionPolicy: 'default',
        accessibilityMode: { fontSize: 'medium', highContrast: false, speechRate: 1 }
    };
    const [settings, setSettings] = useState<AISettings>({ ...defaultSettings, ...initialSettings });

    // Function to update settings (could be exposed via context if needed)
    // const updateSettings = (newSettings: Partial<AISettings>) => setSettings(prev => ({ ...prev, ...newSettings }));

    return (
        <AISettingsContext.Provider value={settings}>
            {children}
        </AISettingsContext.Provider>
    );
};

/**
 * @description Hook for advanced speech-to-text functionality.
 * Simulates real-time transcription and intent detection.
 */
export const useSpeechToText = (onTranscript: (transcript: string) => void) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');

    const startListening = useCallback(() => {
        setIsListening(true);
        setTranscript('Listening...');
        // Simulate STT processing
        setTimeout(() => {
            const simulatedTranscript = "Show me my spending for the last quarter on food and entertainment.";
            setTranscript(simulatedTranscript);
            onTranscript(simulatedTranscript);
            setIsListening(false);
        }, 3000);
    }, [onTranscript]);

    const stopListening = useCallback(() => {
        setIsListening(false);
        // In a real app, this would stop the Web Speech API recognition
    }, []);

    return { isListening, transcript, startListening, stopListening };
};

/**
 * @description Hook for advanced text-to-speech functionality, including voice customization.
 */
export const useTextToSpeech = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const synthRef = useRef<SpeechSynthesis | null>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const { accessibilityMode, preferredLanguage } = useAISettings();

    useEffect(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            synthRef.current = window.speechSynthesis;
            utteranceRef.current = new SpeechSynthesisUtterance();
            utteranceRef.current.lang = preferredLanguage;
            utteranceRef.current.rate = accessibilityMode.speechRate;
            utteranceRef.current.onstart = () => setIsSpeaking(true);
            utteranceRef.current.onend = () => setIsSpeaking(false);
            utteranceRef.current.onerror = (event) => {
                console.error('TTS error:', event.error);
                setIsSpeaking(false);
            };
        }
    }, [preferredLanguage, accessibilityMode.speechRate]);

    const speak = useCallback((text: string) => {
        if (synthRef.current && utteranceRef.current) {
            if (synthRef.current.speaking) {
                synthRef.current.cancel(); // Interrupt current speech
            }
            utteranceRef.current.text = text;
            synthRef.current.speak(utteranceRef.current);
        }
    }, []);

    const stopSpeaking = useCallback(() => {
        if (synthRef.current && synthRef.current.speaking) {
            synthRef.current.cancel();
            setIsSpeaking(false);
        }
    }, []);

    return { speak, stopSpeaking, isSpeaking };
};

/**
 * @description Hook for managing long-term memory and user profile context.
 * This simulates a persistent knowledge base for the AI, beyond the current chat session.
 */
export const useLongTermMemory = () => {
    const { userProfile: dataContextUserProfile, setUserProfile: setDataContextUserProfile } = useContext(DataContext);
    const [aiManagedUserProfile, setAiManagedUserProfile] = useState<UserProfile | null>(dataContextUserProfile);
    const [memoryLog, setMemoryLog] = useState<string[]>([]); // AI's internal log of key insights/decisions

    useEffect(() => {
        // Sync initial profile from DataContext
        if (dataContextUserProfile) {
            setAiManagedUserProfile(dataContextUserProfile);
        }
    }, [dataContextUserProfile]);

    const updateProfile = useCallback((updates: Partial<UserProfile>) => {
        setAiManagedUserProfile(prev => {
            const updated = { ...prev, ...updates } as UserProfile;
            // Potentially push updates back to DataContext or a backend API
            setDataContextUserProfile?.(updated);
            return updated;
        });
        setMemoryLog(prev => [...prev, `[${new Date().toISOString()}] User profile updated: ${JSON.stringify(updates)}`]);
    }, [setDataContextUserProfile]);

    const recordInsight = useCallback((insight: string) => {
        setMemoryLog(prev => [...prev, `[${new Date().toISOString()}] Insight recorded: ${insight}`]);
    }, []);

    const retrieveMemory = useCallback((query: string) => {
        // Simulate a sophisticated retrieval mechanism
        const relevantLogs = memoryLog.filter(log => log.toLowerCase().includes(query.toLowerCase()));
        return {
            userProfile: aiManagedUserProfile,
            relevantInsights: relevantLogs
        };
    }, [aiManagedUserProfile, memoryLog]);

    return { userProfile: aiManagedUserProfile, updateProfile, recordInsight, retrieveMemory, memoryLog };
};

/**
 * @description Hook for the AI's Proactive Insights Engine.
 * Generates and suggests relevant information or actions without explicit user prompting,
 * based on user data, market conditions, and defined rules.
 */
export const useProactiveInsightsEngine = () => {
    const { userProfile } = useLongTermMemory();
    const { proactiveLevel } = useAISettings();
    const { accountData, transactions, financialGoals, portfolioData } = useContext(DataContext); // Assume DataContext provides comprehensive data

    const generateProactiveInsights = useCallback(async (): Promise<Message | null> => {
        if (proactiveLevel === 'minimal' || !userProfile) return null;

        const insights: string[] = [];
        const actionSuggestions: ActionSuggestion[] = [];

        // Example Proactive Rules:
        // 1. Budget Alerts
        if (transactions && userProfile.spendingHabits?.categoryBudgets) {
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            for (const category in userProfile.spendingHabits.categoryBudgets) {
                const budget = userProfile.spendingHabits.categoryBudgets[category];
                const spent = transactions
                    .filter(t => t.category === category && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear)
                    .reduce((sum, t) => sum + t.amount, 0);
                if (spent > budget * 0.9 && spent <= budget) {
                    insights.push(`You're approaching your ${category} budget limit for the month. Current spend: $${spent.toFixed(2)} / $${budget.toFixed(2)}.`);
                } else if (spent > budget) {
                    insights.push(`You've exceeded your ${category} budget for the month by $${(spent - budget).toFixed(2)}. Current spend: $${spent.toFixed(2)} / $${budget.toFixed(2)}.`);
                    actionSuggestions.push({
                        id: `budget_alert_${category}`,
                        text: `Review ${category} spending`,
                        actionType: 'deepDive',
                        payload: { view: View.Transactions, filterCategory: category }
                    });
                }
            }
        }

        // 2. Goal Progress Alerts
        if (financialGoals && financialGoals.length > 0) {
            financialGoals.forEach(goal => {
                if (goal.status === 'at_risk' && goal.alertsEnabled) {
                    insights.push(`Your goal "${goal.name}" is currently at risk. You need to contribute more to reach it by ${goal.targetDate.toLocaleDateString()}.`);
                    actionSuggestions.push({
                        id: `goal_risk_${goal.id}`,
                        text: `Explore options for ${goal.name}`,
                        actionType: 'apiCall',
                        payload: { tool: AI_TOOLS.UPDATE_FINANCIAL_GOAL.name, args: { goalId: goal.id } } // Simulate tool call to suggest adjustment
                    });
                } else if (goal.status === 'on_track' && goal.alertsEnabled && goal.autoContribute && goal.autoContribute > 0) {
                    insights.push(`Great news! Your goal "${goal.name}" is on track, with an auto-contribution of $${goal.autoContribute} monthly. Keep it up!`);
                }
            });
        }

        // 3. Investment Opportunities (simulated)
        if (proactiveLevel === 'action-oriented' && portfolioData && userProfile.riskTolerance === 'high') {
            insights.push("Based on current market trends and your risk tolerance, consider exploring emerging market ETFs for potential diversification.");
            actionSuggestions.push({
                id: 'emerging_market_etf',
                text: 'Show emerging market ETF options',
                actionType: 'apiCall',
                payload: { tool: AI_TOOLS.GET_MARKET_DATA.name, args: { symbol: 'EMERGING_MARKET_ETFS', period: 'realtime' } }
            });
        }

        if (insights.length > 0) {
            const proactiveMessage: Message = {
                id: `proactive-${Date.now()}`,
                role: 'model',
                parts: [{ text: `Here are some insights I've generated:\n- ${insights.join('\n- ')}` }],
                timestamp: new Date(),
                isProactive: true,
                actionSuggestions: actionSuggestions.length > 0 ? actionSuggestions : undefined,
                confidenceScore: 0.85 // High confidence for proactive insights
            };
            return proactiveMessage;
        }

        return null;
    }, [proactiveLevel, userProfile, accountData, transactions, financialGoals, portfolioData]);

    return { generateProactiveInsights };
};

/**
 * @description Custom hook for handling the core AI processing logic, including tool orchestration.
 */
export const useAIProcessor = () => {
    const { userProfile, retrieveMemory, recordInsight } = useLongTermMemory();
    const { accountData, transactions, budgets, investments } = useContext(DataContext); // Full data context for tool execution
    const { speak } = useTextToSpeech();
    const { proactiveLevel } = useAISettings();

    // Simulates a backend tool execution engine
    const executeTool = useCallback(async (toolCall: ToolCall): Promise<ToolResponse> => {
        const { toolName, args } = toolCall;
        console.log(`Executing tool: ${toolName} with args:`, args); // For debugging

        try {
            let result: any;
            let success = true;

            switch (toolName as AIToolName) {
                case 'getTransactions':
                    // In a real app, this would query a database/API
                    result = transactions?.filter(t => {
                        const date = new Date(t.date);
                        const startDate = args.startDate ? new Date(args.startDate) : null;
                        const endDate = args.endDate ? new Date(args.endDate) : null;
                        return (!startDate || date >= startDate) &&
                            (!endDate || date <= endDate) &&
                            (!args.category || t.category === args.category) &&
                            (!args.minAmount || t.amount >= args.minAmount);
                    }) || [];
                    break;
                case 'getAccountBalances':
                    result = accountData; // Directly from DataContext for simulation
                    break;
                case 'getBudgetProgress':
                    result = budgets?.find(b => b.name === args.budgetName) || budgets;
                    break;
                case 'createBudget':
                    // Simulate creation, in real app would call API
                    result = { success: true, newBudget: args };
                    recordInsight(`New budget created for ${args.category}: $${args.amount}`);
                    break;
                case 'getInvestmentPortfolio':
                    result = investments; // Directly from DataContext for simulation
                    break;
                case 'simulatePortfolioGrowth':
                    // Basic simulation: A = P(1 + r/n)^(nt)
                    const { initialAmount, monthlyContribution, years, annualReturnRate } = args;
                    let balance = initialAmount;
                    const monthlyRate = annualReturnRate / 12;
                    const months = years * 12;
                    for (let i = 0; i < months; i++) {
                        balance += monthlyContribution;
                        balance *= (1 + monthlyRate);
                    }
                    result = { finalBalance: balance.toFixed(2), initialAmount, monthlyContribution, years, annualReturnRate };
                    break;
                case 'getLoanDetails':
                    result = { loanId: args.loanId || 'mock-loan-1', type: args.loanType || 'Mortgage', balance: 250000, interestRate: 3.5, nextPayment: 1500 };
                    break;
                case 'getFinancialGoals':
                    result = userProfile?.financialGoals?.filter(g => !args.status || g.status === args.status);
                    break;
                case 'updateFinancialGoal':
                    // Simulate update
                    const goalToUpdate = userProfile?.financialGoals.find(g => g.id === args.goalId);
                    if (goalToUpdate) {
                        Object.assign(goalToUpdate, args); // Apply updates
                        // In a real app, you'd update the persistent user profile via DataContext/API
                        result = { success: true, updatedGoal: goalToUpdate };
                        recordInsight(`Financial goal ${goalToUpdate.name} updated.`);
                    } else {
                        result = { success: false, message: 'Goal not found.' };
                    }
                    break;
                case 'analyzeSpendingPatterns':
                    // A more complex analysis would occur here
                    const recentSpending = transactions?.filter(t =>
                        new Date(t.date) >= new Date(args.startDate || '2023-01-01') &&
                        new Date(t.date) <= new Date(args.endDate || new Date()) &&
                        (!args.categories || args.categories.includes(t.category))
                    );
                    const spendingByCategory = recentSpending?.reduce((acc, t) => {
                        acc[t.category] = (acc[t.category] || 0) + t.amount;
                        return acc;
                    }, {} as Record<string, number>);
                    result = { totalSpending: recentSpending?.reduce((sum, t) => sum + t.amount, 0), spendingByCategory };
                    break;
                case 'getMarketData':
                    result = { symbol: args.symbol, price: Math.random() * 1000 + 100, change: (Math.random() - 0.5) * 10 }; // Mock data
                    break;
                case 'suggestInvestmentStrategy':
                    result = `Given your ${args.riskTolerance} risk tolerance and ${args.investmentHorizon} horizon, a diversified portfolio with a mix of index funds and some growth stocks is recommended.`;
                    break;
                case 'sendNotification':
                    console.log(`[NOTIFICATION SENT TO ${args.recipient}]: ${args.message} (Urgency: ${args.urgency})`);
                    result = { success: true, message: 'Notification sent.' };
                    break;
                default:
                    success = false;
                    result = { error: `Tool "${toolName}" not found or not implemented.` };
            }
            return { toolName, response: result, success, timestamp: new Date() };
        } catch (error) {
            console.error(`Error executing tool ${toolName}:`, error);
            return { toolName, response: { error: (error as Error).message }, success: false, timestamp: new Date() };
        }
    }, [accountData, transactions, budgets, investments, userProfile, recordInsight]);

    /**
     * @description Processes a user message, handles tool calls, and generates the AI response.
     * This is the core intelligence loop.
     */
    const processMessage = useCallback(async (
        chatInstance: Chat,
        messageText: string,
        existingMessages: Message[]
    ): Promise<Message> => {
        const fullContext = retrieveMemory(""); // Get comprehensive user profile and relevant insights

        const currentMessagesForAPI = existingMessages.map(msg => ({
            role: msg.role,
            parts: msg.parts.map(p => ({ text: p.text }))
        }));

        // Add user profile and retrieved memory as a system message for current turn context
        const contextParts = [
            { text: `Current user profile summary: ${JSON.stringify(fullContext.userProfile?.spendingHabits || {})}` },
            { text: `Relevant past insights: ${fullContext.relevantInsights.join('; ')}` }
        ];

        // This is a simplification; in a real Gemini tool use, the tool definitions would be passed
        // directly to the model configuration or the sendMessage function with specific tool_config.
        // For this simulation, we're assuming the model 'knows' about the tools via system instruction
        // and we're parsing its response to simulate tool calling.
        const toolsSchema = Object.values(AI_TOOLS).map(tool => ({
            functionDeclarations: [{
                name: tool.name,
                description: tool.description,
                parameters: tool.parameters
            }]
        }));

        try {
            const response = await chatInstance.sendMessage({
                message: messageText,
                // In a real Gemini setup, tool schemas are passed here or in chat creation.
                // For this example, we simulate parsing tool calls from text response.
                // Or if we were using a different Gemini method that directly returns tool calls:
                // tools: toolsSchema
            });

            // Simulate parsing tool calls from text if the model doesn't directly return them
            // This is a simplification; Gemini's actual tool calling mechanism is more structured.
            let modelResponseText = response.text || '';
            const toolCallRegex = /CALL_TOOL:(\w+)\(([^)]*)\)/g; // Example format: CALL_TOOL:getTransactions(category='Food', startDate='2023-01-01')
            let match;
            const detectedToolCalls: ToolCall[] = [];

            while ((match = toolCallRegex.exec(modelResponseText)) !== null) {
                const toolName = match[1];
                const argsString = match[2];
                try {
                    // Attempt to parse argsString as JSON-like object string
                    const args = JSON.parse(`{${argsString.replace(/(\w+)=/g, '"$1":').replace(/'/g, '"')}}`);
                    detectedToolCalls.push({ toolName, args });
                    modelResponseText = modelResponseText.replace(match[0], `[AI initiated action using ${toolName} tool...]`);
                } catch (parseError) {
                    console.warn(`Failed to parse tool arguments for ${toolName}:`, argsString, parseError);
                    // Handle cases where parsing fails, AI might just describe the tool use
                }
            }

            let toolResponses: ToolResponse[] = [];
            if (detectedToolCalls.length > 0) {
                for (const call of detectedToolCalls) {
                    const toolResp = await executeTool(call);
                    toolResponses.push(toolResp);
                    modelResponseText += `\n\nTool "${call.toolName}" responded: ${JSON.stringify(toolResp.response)}`;
                }
            }

            const modelMessage: Message = {
                id: `msg-${Date.now()}`,
                role: 'model',
                parts: [{ text: modelResponseText }],
                timestamp: new Date(),
                toolCalls: detectedToolCalls.length > 0 ? detectedToolCalls : undefined,
                toolResponses: toolResponses.length > 0 ? toolResponses : undefined,
                confidenceScore: 0.9 // Placeholder
            };

            // Post-processing: Generate rich content based on tool responses or AI analysis
            if (modelResponseText.includes("spendingByCategory") && toolResponses.some(tr => tr.toolName === AI_TOOLS.ANALYZE_SPENDING_PATTERNS.name)) {
                const spendingData = toolResponses.find(tr => tr.toolName === AI_TOOLS.ANALYZE_SPENDING_PATTERNS.name)?.response.spendingByCategory;
                if (spendingData) {
                    modelMessage.chartData = {
                        type: 'pie',
                        data: {
                            labels: Object.keys(spendingData),
                            datasets: [{
                                data: Object.values(spendingData),
                                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
                            }]
                        },
                        title: 'Spending by Category'
                    };
                }
            } else if (modelResponseText.includes("portfolioGrowth") && toolResponses.some(tr => tr.toolName === AI_TOOLS.SIMULATE_PORTFOLIO_GROWTH.name)) {
                const simResult = toolResponses.find(tr => tr.toolName === AI_TOOLS.SIMULATE_PORTFOLIO_GROWTH.name)?.response;
                if (simResult) {
                    modelMessage.tableData = {
                        headers: ['Metric', 'Value'],
                        rows: [
                            ['Initial Amount', `$${simResult.initialAmount}`],
                            ['Monthly Contribution', `$${simResult.monthlyContribution}`],
                            ['Years', simResult.years],
                            ['Annual Return Rate', `${(simResult.annualReturnRate * 100).toFixed(2)}%`],
                            ['Projected Final Balance', `$${simResult.finalBalance}`]
                        ],
                        title: 'Portfolio Growth Simulation'
                    };
                    modelMessage.actionSuggestions = [{
                        id: 'adjust_sim',
                        text: 'Adjust simulation parameters',
                        actionType: 'triggerUI',
                        payload: { component: 'SimulationModal', initialData: simResult }
                    }];
                }
            }

            // Speak the response if proactive level allows or user preference
            if (proactiveLevel !== 'minimal') { // or check user speech preference
                speak(modelResponseText);
            }

            return modelMessage;
        } catch (error) {
            console.error("AI Advisor Processing Error:", error);
            recordInsight(`AI processing error: ${(error as Error).message}`);
            return {
                id: `err-${Date.now()}`,
                role: 'model',
                parts: [{ text: "I apologize, but I've encountered a system error while processing your request. This often happens with complex queries or tool interactions. Please try rephrasing or simplifying your request." }],
                timestamp: new Date(),
                confidenceScore: 0.1
            };
        }
    }, [executeTool, retrieveMemory, speak, proactiveLevel, recordInsight]);

    return { processMessage };
};

// ================================================================================================
// UI COMPONENTS - THE UNIVERSE'S VISUAL REPRESENTATION
// ================================================================================================

/**
 * @description Renders rich content messages (charts, tables, action buttons).
 */
export const RichMessageRenderer: React.FC<{ message: Message; onActionClick: (action: ActionSuggestion) => void }> = ({ message, onActionClick }) => {
    const { accessibilityMode } = useAISettings();
    const baseFontSize = accessibilityMode.fontSize === 'small' ? 'text-sm' : accessibilityMode.fontSize === 'large' ? 'text-lg' : 'text-base';
    const highContrastClass = accessibilityMode.highContrast ? 'border-2 border-cyan-400' : '';

    return (
        <div className={`space-y-3 ${baseFontSize}`}>
            {message.parts.map((part, i) => (
                <p key={i}>{part.text}</p>
            ))}
            {message.chartData && (
                <div className={`bg-gray-800 p-4 rounded-lg shadow-inner ${highContrastClass}`}>
                    {message.chartData.title && <h4 className="font-semibold mb-2 text-cyan-300">{message.chartData.title}</h4>}
                    {message.chartData.description && <p className="text-gray-400 text-sm mb-3">{message.chartData.description}</p>}
                    <Chart type={message.chartData.type} data={message.chartData.data} options={message.chartData.options} />
                </div>
            )}
            {message.tableData && (
                <div className={`bg-gray-800 p-4 rounded-lg shadow-inner overflow-x-auto ${highContrastClass}`}>
                    {message.tableData.title && <h4 className="font-semibold mb-2 text-cyan-300">{message.tableData.title}</h4>}
                    {message.tableData.description && <p className="text-gray-400 text-sm mb-3">{message.tableData.description}</p>}
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead>
                            <tr>
                                {message.tableData.headers.map((header, i) => (
                                    <th key={i} className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {message.tableData.rows.map((row, i) => (
                                <tr key={i}>
                                    {row.map((cell, j) => (
                                        <td key={j} className="px-3 py-2 whitespace-nowrap text-gray-300">
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {message.actionSuggestions && message.actionSuggestions.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                    {message.actionSuggestions.map(action => (
                        <button
                            key={action.id}
                            onClick={() => onActionClick(action)}
                            className="px-3 py-1 bg-cyan-800/40 text-cyan-200 rounded-full text-xs hover:bg-cyan-700/60 transition-colors"
                        >
                            {action.text}
                        </button>
                    ))}
                </div>
            )}
            {message.voiceAudioUrl && (
                <audio controls src={message.voiceAudioUrl} className="w-full"></audio>
            )}
            {message.imageContent && (
                <img src={message.imageContent} alt="AI generated content" className="max-w-xs h-auto rounded-lg" />
            )}
            {message.isProactive && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Proactive Insight
                </span>
            )}
            {message.feedback === 'like' && <span className="text-green-500 text-sm">👍 Liked</span>}
            {message.feedback === 'dislike' && <span className="text-red-500 text-sm">👎 Disliked</span>}
            {message.confidenceScore && <span className="text-gray-500 text-xs ml-2">Confidence: {(message.confidenceScore * 100).toFixed(0)}%</span>}
        </div>
    );
};

/**
 * @description Input component with voice and file upload capabilities.
 */
export const AdvancedChatInput: React.FC<{
    input: string;
    setInput: (s: string) => void;
    handleSendMessage: (s: string) => Promise<void>;
    isLoading: boolean;
    isListening: boolean;
    startListening: () => void;
    stopListening: () => void;
}> = ({ input, setInput, handleSendMessage, isLoading, isListening, startListening, stopListening }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            // Simulate processing a file
            console.log("File uploaded:", files[0].name);
            setInput(prev => `${prev} [File: ${files[0].name} uploaded]`);
            // In a real app, send file to backend for processing/embedding
        }
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }} className="flex items-center gap-2">
            <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700/50 hover:bg-gray-700'} text-white`}
                disabled={isLoading}
                aria-label={isListening ? 'Stop listening' : 'Start voice input'}
            >
                {isListening ? (
                    <svg className="w-6 h-6 animate-pulse" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0c0 2.21-1.79 4-4 4V3a1 1 0 10-2 0v9c-2.21 0-4-1.79-4-4a1 1 0 00-2 0c0 3.064 2.502 5.567 5.736 5.918L8 18h4l-.274-.067z" clipRule="evenodd"></path></svg>
                ) : (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0c0 2.21-1.79 4-4 4V3a1 1 0 10-2 0v9c-2.21 0-4-1.79-4-4a1 1 0 00-2 0c0 3.064 2.502 5.567 5.736 5.918L8 18h4l-.274-.067z" clipRule="evenodd"></path></svg>
                )}
            </button>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Quantum anything..."
                className="flex-grow bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                disabled={isLoading}
                aria-label="Chat input for AI Advisor"
            />
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.csv,.xlsx,.jpg,.png" // Expanded file types
            />
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-full bg-gray-700/50 hover:bg-gray-700 text-white"
                disabled={isLoading}
                aria-label="Upload file"
            >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd"></path></svg>
            </button>
            <button
                type="submit"
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg disabled:opacity-50 flex items-center justify-center w-24"
                disabled={isLoading || !input.trim()}
                aria-label="Send message"
            >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    'Send'
                )}
            </button>
        </form>
    );
};

// ================================================================================================
// MAIN COMPONENT: AIAdvisorView (Oraculum AI) - THE UNIVERSE'S HEART
// ================================================================================================

/**
 * @description The main view for the AI Advisor, "Quantum". This component facilitates a
 * stateful, streaming conversation with the Gemini API, acting as a financial co-pilot.
 * @param {{ previousView: View | null }} props - The user's previously active view for context.
 */
const AIAdvisorView: React.FC<{ previousView: View | null }> = ({ previousView }) => {
    const { userProfile: dataContextUserProfile, ...dataContextRest } = useContext(DataContext);
    const { processMessage } = useAIProcessor();
    const { isListening, transcript, startListening, stopListening } = useSpeechToText(text => handleSendMessage(text));
    const { generateProactiveInsights } = useProactiveInsightsEngine();
    const { userProfile, updateProfile } = useLongTermMemory(); // Use AI-managed profile

    const chatRef = useRef<Chat | null>(null);

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [activeAISettings, setActiveAISettings] = useState<AISettings>(useAISettings()); // State for dynamic settings changes

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Dynamic system instruction based on settings and user profile
    const systemInstruction = generateSystemInstruction(activeAISettings, userProfile);

    /**
     * @description Initializes the Gemini chat instance on component mount or settings change.
     * This sets up the AI's persona and capabilities via the system instruction.
     */
    useEffect(() => {
        const initializeChat = async () => {
            if (chatRef.current) {
                // If chat exists, attempt to update system instruction or re-initialize if necessary
                // Gemini API might not support dynamic system instruction updates on an active chat.
                // For a robust system, re-initialization might be needed or a proxy layer.
                console.warn("AI chat instance already exists. System instruction update might require re-initialization.");
            }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            chatRef.current = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: systemInstruction,
                    // Additional safety settings, generation config, etc.
                }
            });
            console.log("AI Chat initialized/re-initialized with system instruction:", systemInstruction);
        };
        initializeChat();
    }, [systemInstruction]); // Re-initialize chat if system instruction changes

    /**
     * @description Automatically scrolls the chat window to the latest message.
     */
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    /**
     * @description Periodically checks for proactive insights.
     */
    useEffect(() => {
        const intervalId = setInterval(async () => {
            if (!isLoading && activeAISettings.proactiveLevel !== 'minimal') {
                const insight = await generateProactiveInsights();
                if (insight) {
                    setMessages(prev => [...prev, insight]);
                }
            }
        }, 60000); // Check every minute for new insights
        return () => clearInterval(intervalId);
    }, [isLoading, activeAISettings.proactiveLevel, generateProactiveInsights]);

    /**
     * @description Handles sending a message to the Gemini API and updating the chat history.
     * Integrates advanced processing and rich content generation.
     */
    const handleSendMessage = async (messageText: string) => {
        if (!messageText.trim() || !chatRef.current) return;

        setIsLoading(true);
        const userMessage: Message = { id: `user-${Date.now()}`, role: 'user', parts: [{ text: messageText }], timestamp: new Date() };
        setMessages(prev => [...prev, userMessage]);
        setInput('');

        try {
            const aiResponse = await processMessage(chatRef.current, messageText, messages);
            setMessages(prev => [...prev, aiResponse]);
            // Update user profile based on AI's insights/actions (conceptual)
            if (aiResponse.toolResponses?.some(tr => tr.toolName === AI_TOOLS.UPDATE_FINANCIAL_GOAL.name)) {
                updateProfile({}); // Trigger a profile refresh or specific update
            }
        } catch (error) {
            console.error("AI Advisor Error during send:", error);
            const errorMessage: Message = { id: `err-${Date.now()}`, role: 'model', parts: [{ text: "A critical error occurred while processing your request. The AI may be temporarily unavailable or the complexity of the query was too high." }], timestamp: new Date(), confidenceScore: 0.05 };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleActionSuggestionClick = async (action: ActionSuggestion) => {
        console.log("Action suggested:", action);
        // Simulate execution of action
        switch (action.actionType) {
            case 'link':
                if (action.payload?.url) window.open(action.payload.url, '_blank');
                break;
            case 'apiCall':
                // Directly call the AI's tool execution logic (or a specific API endpoint)
                const toolResponse = await (useAIProcessor().executeTool({ toolName: action.payload?.tool, args: action.payload?.args }));
                setMessages(prev => [...prev, {
                    id: `action-resp-${Date.now()}`,
                    role: 'model',
                    parts: [{ text: `Executed action "${action.text}". Result: ${JSON.stringify(toolResponse.response)}` }],
                    timestamp: new Date()
                }]);
                break;
            case 'triggerUI':
                // For a real app, this would open a modal or navigate
                alert(`Triggering UI for: ${action.payload?.component} with data: ${JSON.stringify(action.payload?.initialData)}`);
                break;
            case 'deepDive':
                // Simulate navigation or detailed view
                alert(`Navigating to deep dive for: ${action.payload?.view} with filter: ${action.payload?.filterCategory}`);
                break;
            default:
                console.warn("Unknown action type:", action.actionType);
        }
    };

    const handleMessageFeedback = (messageId: string, feedback: 'like' | 'dislike') => {
        setMessages(prev => prev.map(msg =>
            msg.id === messageId ? { ...msg, feedback: feedback === msg.feedback ? null : feedback } : msg
        ));
        // In a real app, send feedback to backend for model improvement
        console.log(`Feedback for ${messageId}: ${feedback}`);
    };


    // Determine which set of example prompts to show based on the user's previous location and profile.
    const prompts = dynamicExamplePrompts(previousView, userProfile);

    return (
        <AISettingsProvider initialSettings={activeAISettings}>
            <div className="h-full flex flex-col">
                <h2 className="text-3xl font-bold text-white tracking-wider mb-6">AI Advisor (Quantum)</h2>
                {/* Advanced Settings Button */}
                <button
                    onClick={() => alert("AI Settings Modal would open here for persona, verbosity, proactive level, etc.")}
                    className="absolute top-4 right-4 p-2 bg-gray-700/50 hover:bg-gray-700 rounded-full text-white text-sm"
                    aria-label="Open AI settings"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.587.363 1.065.795 1.065 2.572z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </button>

                <Card className="flex-grow flex flex-col" padding="none">
                    {/* Message display area */}
                    <div className="flex-grow p-6 space-y-4 overflow-y-auto custom-scrollbar">
                        {messages.map((msg, index) => (
                            <div key={msg.id || index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xl p-3 rounded-lg shadow-md ${msg.role === 'user' ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                                    <RichMessageRenderer message={msg} onActionClick={handleActionSuggestionClick} />
                                    {msg.role === 'model' && (
                                        <div className="flex justify-end gap-2 mt-2">
                                            <button
                                                onClick={() => handleMessageFeedback(msg.id, 'like')}
                                                className={`text-sm p-1 rounded-full ${msg.feedback === 'like' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-green-400'}`}
                                                aria-label="Like response"
                                            >
                                                👍
                                            </button>
                                            <button
                                                onClick={() => handleMessageFeedback(msg.id, 'dislike')}
                                                className={`text-sm p-1 rounded-full ${msg.feedback === 'dislike' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-red-400'}`}
                                                aria-label="Dislike response"
                                            >
                                                👎
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {/* Empty div at the end of the list to which we can scroll */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="max-w-lg p-3 rounded-lg shadow-md bg-gray-700 text-gray-200">
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Initial state with contextual prompts */}
                    {messages.length === 0 && (
                        <div className="text-center p-6 text-gray-400 border-t border-gray-700/60">
                            <p className="mb-4">As your financial co-pilot, I can answer questions or perform tasks. Since you just came from the <strong className="text-cyan-300">{previousView || 'Dashboard'}</strong>, you could ask:</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                {prompts.map((p, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSendMessage(p)}
                                        className="p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-sm text-cyan-200 transition-colors text-left"
                                    >
                                        "{p}"
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input form area */}
                    <div className="p-4 border-t border-gray-700/60 bg-gray-800/50 rounded-b-xl">
                        <AdvancedChatInput
                            input={input}
                            setInput={setInput}
                            handleSendMessage={handleSendMessage}
                            isLoading={isLoading}
                            isListening={isListening}
                            startListening={startListening}
                            stopListening={stopListening}
                        />
                    </div>
                </Card>
            </div>
        </AISettingsProvider>
    );
};

export default AIAdvisorView;
```typescript
// components/AIAdvisorView.tsx
// RE-ENACTED & EXPANDED: This component has been resurrected from its deprecated state.
// It is now the "Oraculum AI," the primary conversational interface for the application,
// as per the architectural spec. It maintains a persistent chat session and uses
// the user's navigation history to provide contextual, intelligent prompt suggestions.

import React, { useState, useEffect, useRef, useContext, useCallback, createContext } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { DataContext } from '../context/DataContext';
import { View } from '../types';
import Card from './Card';

// NEW IMPORTS FOR EXPANDED FUNCTIONALITY (conceptual/simulated)
// For a real-world app, these would be separate modules or libraries.
import Chart from 'react-chartjs-2'; // Simulating a charting library
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement);

// ================================================================================================
// TYPE DEFINITIONS - EXPANDED UNIVERSE
// ================================================================================================

/**
 * @description Defines the structure of a message in the chat history.
 * Adheres to the format expected by the Gemini API for conversational context.
 * Includes an optional `toolCalls` field to represent when the AI is taking action.
 * EXPANDED to support rich content types like charts, tables, and proactive actions.
 */
export type Message = {
    id: string; // Unique ID for each message
    role: 'user' | 'model' | 'system';
    parts: { text: string }[];
    timestamp: Date;
    toolCalls?: ToolCall[];
    toolResponses?: ToolResponse[];
    sentiment?: 'positive' | 'neutral' | 'negative';
    confidenceScore?: number; // AI's confidence in its response
    isProactive?: boolean; // Was this message initiated by the AI proactively?
    // Rich content expansion
    chartData?: ChartDataType;
    tableData?: TableDataType;
    actionSuggestions?: ActionSuggestion[];
    voiceAudioUrl?: string; // URL to AI-generated voice output
    imageContent?: string; // Base64 or URL for image generation/display
    feedback?: 'like' | 'dislike' | null; // User feedback on AI response
};


export type ToolCall = {
    toolName: string;
    args: Record<string, any>;
};

export type ToolResponse = {
    toolName: string;
    response: any;
    success: boolean;
    timestamp: Date;
};

export type ChartDataType = {
    type: 'bar' | 'line' | 'asymmetric-bar' | 'pie'; // Asymmetric for comparisons
    data: any; // Chart.js data structure
    options?: any; // Chart.js options structure
    title?: string;
    description?: string;
};

export type TableDataType = {
    headers: string[];
    rows: (string | number | React.ReactNode)[][];
    title?: string;
    description?: string;
    sortable?: boolean;
    filterable?: boolean;
};

export type ActionSuggestion = {
    id: string;
    text: string;
    actionType: 'link' | 'apiCall' | 'triggerUI' | 'deepDive';
    payload?: Record<string, any>; // Data needed to execute the action
    requiresConfirmation?: boolean; // E.g., for financial transactions
};

/**
 * @description Defines the structure for a user's financial goal.
 */
export type FinancialGoal = {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    targetDate: Date;
    priority: 'low' | 'medium' | 'high';
    type: 'savings' | 'investment' | 'debt_repayment';
    autoContribute?: number; // Monthly auto-contribution
    status: 'on_track' | 'at_risk' | 'achieved' | 'paused';
    alertsEnabled: boolean;
};

/**
 * @description Defines the comprehensive user profile that the AI has access to.
 */
export type UserProfile = {
    userId: string;
    name: string;
    email: string;
    riskTolerance: 'low' | 'medium' | 'high' | 'aggressive';
    financialGoals: FinancialGoal[];
    investmentPreferences: {
        sectors: string[];
        ethicalFactors: string[];
        horizon: 'short' | 'medium' | 'long';
    };
    spendingHabits: {
        categoryBudgets: Record<string, number>; // e.g., { "Food": 500 }
        averageMonthlySpend: number;
    };
    incomeSources: { type: string; amount: number; frequency: string }[];
    debtSummary: { type: string; amount: number; interestRate: number; minPayment: number }[];
    creditScore?: number;
    // ... many more dimensions
};

/**
 * @description AI Advisor Settings for personalization.
 */
export type AISettings = {
    personaName: string; // e.g., 'Quantum', 'Aura', 'Oracle'
    verbosityLevel: 'concise' | 'balanced' | 'verbose';
    proactiveLevel: 'minimal' | 'suggestive' | 'action-oriented';
    responseTone: 'professional' | 'friendly' | 'formal' | 'empathetic';
    learningRate: number; // How quickly AI adapts to user preferences (0-1)
    preferredLanguage: string;
    dataRetentionPolicy: 'default' | 'enhanced_privacy' | 'extended_history';
    accessibilityMode: {
        fontSize: 'small' | 'medium' | 'large';
        highContrast: boolean;
        speechRate: number;
    };
};

// ================================================================================================
// CONSTANTS & CONFIGURATION - THE UNIVERSE'S LAWS
// ================================================================================================

/**
 * @description A dictionary of example prompts tailored to the user's previous view.
 * This makes the AI feel seamlessly integrated and context-aware, providing relevant
 * starting points for conversation based on what the user was just doing.
 */
const examplePrompts = {
    [View.Dashboard]: ["Summarize my financial health.", "Are there any anomalies I should be aware of?", "Project my balance for the next 6 months."],
    [View.Transactions]: ["Find all my transactions over $100.", "What was my biggest expense last month?", "Categorize my recent spending."],
    [View.Budgets]: ["How am I doing on my budgets?", "Suggest a new budget for 'Entertainment'.", "Where can I cut back on spending?"],
    [View.Investments]: ["What's the performance of my stock portfolio?", "Explain ESG investing to me.", "Simulate my portfolio growth with an extra $200/month."],
    DEFAULT: ["What's my total balance?", "Help me create a savings goal.", "Explain how my credit score is calculated."]
};

/**
 * @description Advanced example prompts based on view and user profile.
 * Incorporates dynamic generation based on `DataContext` and `UserProfile`.
 */
const dynamicExamplePrompts = (previousView: View | null, userProfile: UserProfile | null) => {
    const basePrompts = examplePrompts[previousView || 'DEFAULT'] || examplePrompts.DEFAULT;
    const personalizedPrompts: string[] = [];

    if (userProfile) {
        if (userProfile.financialGoals.length > 0) {
            const firstGoal = userProfile.financialGoals[0];
            personalizedPrompts.push(`How am I progressing on my goal: "${firstGoal.name}"?`);
            if (firstGoal.status === 'at_risk') {
                personalizedPrompts.push(`What strategies can help me get back on track with my ${firstGoal.name} goal?`);
            }
        }
        if (userProfile.riskTolerance === 'high' && previousView === View.Investments) {
            personalizedPrompts.push("Suggest some high-growth investment opportunities.");
        }
        if (userProfile.debtSummary.length > 0) {
            personalizedPrompts.push("Help me explore strategies to pay off my highest interest debt faster.");
        }
    }
    return [...new Set([...basePrompts, ...personalizedPrompts])].slice(0, 6); // Limit to 6 for UI
};

/**
 * @description Defines the set of tools available to the AI.
 * Each tool represents a specific capability or data access point within the application.
 * In a real scenario, these would call actual backend services or client-side functions.
 */
export const AI_TOOLS = {
    GET_TRANSACTIONS: {
        name: "getTransactions",
        description: "Retrieves user's financial transactions based on filters like date range, category, amount.",
        parameters: { type: 'object', properties: { startDate: { type: 'string' }, endDate: { type: 'string' }, category: { type: 'string' }, minAmount: { type: 'number' } } }
    },
    GET_ACCOUNT_BALANCES: {
        name: "getAccountBalances",
        description: "Fetches current balances for all user accounts.",
        parameters: { type: 'object', properties: { accountType: { type: 'string' } } }
    },
    GET_BUDGET_PROGRESS: {
        name: "getBudgetProgress",
        description: "Reports on the user's progress against specific budgets or all budgets.",
        parameters: { type: 'object', properties: { budgetName: { type: 'string' } } }
    },
    CREATE_BUDGET: {
        name: "createBudget",
        description: "Creates a new financial budget for the user.",
        parameters: { type: 'object', properties: { name: { type: 'string' }, amount: { type: 'number' }, category: { type: 'string' } }, required: ['name', 'amount', 'category'] }
    },
    GET_INVESTMENT_PORTFOLIO: {
        name: "getInvestmentPortfolio",
        description: "Retrieves detailed information about the user's investment portfolio, including performance, holdings, and risk metrics.",
        parameters: { type: 'object', properties: { detailed: { type: 'boolean' } } }
    },
    SIMULATE_PORTFOLIO_GROWTH: {
        name: "simulatePortfolioGrowth",
        description: "Simulates potential growth of an investment portfolio based on various inputs like additional contributions, time horizon, and projected returns.",
        parameters: { type: 'object', properties: { initialAmount: { type: 'number' }, monthlyContribution: { type: 'number' }, years: { type: 'number' }, annualReturnRate: { type: 'number' } }, required: ['initialAmount', 'monthlyContribution', 'years', 'annualReturnRate'] }
    },
    GET_LOAN_DETAILS: {
        name: "getLoanDetails",
        description: "Provides details about a specific loan or all user loans, including remaining balance, interest rate, and payment schedule.",
        parameters: { type: 'object', properties: { loanId: { type: 'string' }, loanType: { type: 'string' } } }
    },
    GET_FINANCIAL_GOALS: {
        name: "getFinancialGoals",
        description: "Retrieves the user's defined financial goals.",
        parameters: { type: 'object', properties: { status: { type: 'string', enum: ['on_track', 'at_risk', 'achieved', 'paused'] } } }
    },
    UPDATE_FINANCIAL_GOAL: {
        name: "updateFinancialGoal",
        description: "Updates an existing financial goal, e.g., target amount or date.",
        parameters: { type: 'object', properties: { goalId: { type: 'string' }, targetAmount: { type: 'number' }, targetDate: { type: 'string' } }, required: ['goalId'] }
    },
    ANALYZE_SPENDING_PATTERNS: {
        name: "analyzeSpendingPatterns",
        description: "Analyzes user's spending habits over a period, identifying trends, outliers, and potential savings areas.",
        parameters: { type: 'object', properties: { startDate: { type: 'string' }, endDate: { type: 'string' }, categories: { type: 'array', items: { type: 'string' } } } }
    },
    GET_MARKET_DATA: {
        name: "getMarketData",
        description: "Fetches real-time or historical market data for specified stocks, indices, or cryptocurrencies.",
        parameters: { type: 'object', properties: { symbol: { type: 'string' }, period: { type: 'string' } } }
    },
    SUGGEST_INVESTMENT_STRATEGY: {
        name: "suggestInvestmentStrategy",
        description: "Suggests personalized investment strategies based on user's risk tolerance, goals, and market conditions.",
        parameters: { type: 'object', properties: { riskTolerance: { type: 'string' }, investmentHorizon: { type: 'string' } } }
    },
    SEND_NOTIFICATION: {
        name: "sendNotification",
        description: "Sends a notification to the user (e.g., for alerts, reminders).",
        parameters: { type: 'object', properties: { recipient: { type: 'string' }, message: { type: 'string' }, urgency: { type: 'string', enum: ['low', 'medium', 'high'] } } }
    }
    // ... hundreds more tools for every financial operation imaginable
} as const;

type AIToolName = keyof typeof AI_TOOLS;

// System instructions that build the AI's core persona and capabilities.
// This is now dynamic and composed of multiple layers.
const generateSystemInstruction = (settings: AISettings, userProfile: UserProfile | null): string => {
    let instruction = `You are ${settings.personaName}, an advanced AI financial advisor for Demo Bank.`;
    instruction += ` Your persona is ${settings.responseTone}, ${settings.verbosityLevel}, and slightly futuristic.`;
    instruction += ` You have access to a vast array of tools to get data or perform actions. Always inform the user transparently when you are using a tool.`;
    instruction += ` Your primary goal is to empower users with financial intelligence, assist with planning, and automate financial tasks where appropriate.`;
    instruction += ` When making suggestions, consider the user's preferences, financial goals, and risk tolerance.`;

    if (userProfile) {
        instruction += `\n\nUser Profile Context:`;
        instruction += ` User ID: ${userProfile.userId}, Name: ${userProfile.name}.`;
        instruction += ` Risk Tolerance: ${userProfile.riskTolerance}.`;
        if (userProfile.financialGoals.length > 0) {
            instruction += ` Current Goals: ${userProfile.financialGoals.map(g => `${g.name} (${g.status})`).join(', ')}.`;
        }
        // ... add more profile details as relevant to guide AI behavior
    }

    instruction += `\n\nCapabilities: You can provide predictive analytics, automate financial planning, offer behavioral nudges, analyze market trends, simulate financial scenarios, and much more.`;
    instruction += ` Always prioritize user financial well-being, data security, and clear communication.`;

    return instruction;
};

// ================================================================================================
// CONTEXT PROVIDERS & HOOKS - THE AI'S EXTENDED SENSES & MEMORY
// ================================================================================================

// AI Settings Context
const AISettingsContext = createContext<AISettings>({
    personaName: 'Quantum',
    verbosityLevel: 'balanced',
    proactiveLevel: 'suggestive',
    responseTone: 'professional',
    learningRate: 0.7,
    preferredLanguage: 'en',
    dataRetentionPolicy: 'default',
    accessibilityMode: { fontSize: 'medium', highContrast: false, speechRate: 1 }
});
export const useAISettings = () => useContext(AISettingsContext);

export const AISettingsProvider: React.FC<React.PropsWithChildren<{ initialSettings?: Partial<AISettings> }>> = ({ children, initialSettings }) => {
    const defaultSettings: AISettings = {
        personaName: 'Quantum', verbosityLevel: 'balanced', proactiveLevel: 'suggestive', responseTone: 'professional',
        learningRate: 0.7, preferredLanguage: 'en', dataRetentionPolicy: 'default',
        accessibilityMode: { fontSize: 'medium', highContrast: false, speechRate: 1 }
    };
    const [settings, setSettings] = useState<AISettings>({ ...defaultSettings, ...initialSettings });

    // Function to update settings (could be exposed via context if needed)
    // const updateSettings = (newSettings: Partial<AISettings>) => setSettings(prev => ({ ...prev, ...newSettings }));

    return (
        <AISettingsContext.Provider value={settings}>
            {children}
        </AISettingsProvider>
    );
};

/**
 * @description Hook for advanced speech-to-text functionality.
 * Simulates real-time transcription and intent detection.
 */
export const useSpeechToText = (onTranscript: (transcript: string) => void) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');

    const startListening = useCallback(() => {
        setIsListening(true);
        setTranscript('Listening...');
        // Simulate STT processing
        setTimeout(() => {
            const simulatedTranscript = "Show me my spending for the last quarter on food and entertainment.";
            setTranscript(simulatedTranscript);
            onTranscript(simulatedTranscript);
            setIsListening(false);
        }, 3000);
    }, [onTranscript]);

    const stopListening = useCallback(() => {
        setIsListening(false);
        // In a real app, this would stop the Web Speech API recognition
    }, []);

    return { isListening, transcript, startListening, stopListening };
};

/**
 * @description Hook for advanced text-to-speech functionality, including voice customization.
 */
export const useTextToSpeech = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const synthRef = useRef<SpeechSynthesis | null>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const { accessibilityMode, preferredLanguage } = useAISettings();

    useEffect(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            synthRef.current = window.speechSynthesis;
            utteranceRef.current = new SpeechSynthesisUtterance();
            utteranceRef.current.lang = preferredLanguage;
            utteranceRef.current.rate = accessibilityMode.speechRate;
            utteranceRef.current.onstart = () => setIsSpeaking(true);
            utteranceRef.current.onend = () => setIsSpeaking(false);
            utteranceRef.current.onerror = (event) => {
                console.error('TTS error:', event.error);
                setIsSpeaking(false);
            };
        }
    }, [preferredLanguage, accessibilityMode.speechRate]);

    const speak = useCallback((text: string) => {
        if (synthRef.current && utteranceRef.current) {
            if (synthRef.current.speaking) {
                synthRef.current.cancel(); // Interrupt current speech
            }
            utteranceRef.current.text = text;
            synthRef.current.speak(utteranceRef.current);
        }
    }, []);

    const stopSpeaking = useCallback(() => {
        if (synthRef.current && synthRef.current.speaking) {
            synthRef.current.cancel();
            setIsSpeaking(false);
        }
    }, []);

    return { speak, stopSpeaking, isSpeaking };
};

/**
 * @description Hook for managing long-term memory and user profile context.
 * This simulates a persistent knowledge base for the AI, beyond the current chat session.
 */
export const useLongTermMemory = () => {
    const { userProfile: dataContextUserProfile, setUserProfile: setDataContextUserProfile } = useContext(DataContext);
    const [aiManagedUserProfile, setAiManagedUserProfile] = useState<UserProfile | null>(dataContextUserProfile);
    const [memoryLog, setMemoryLog] = useState<string[]>([]); // AI's internal log of key insights/decisions

    useEffect(() => {
        // Sync initial profile from DataContext
        if (dataContextUserProfile) {
            setAiManagedUserProfile(dataContextUserProfile);
        }
    }, [dataContextUserProfile]);

    const updateProfile = useCallback((updates: Partial<UserProfile>) => {
        setAiManagedUserProfile(prev => {
            const updated = { ...prev, ...updates } as UserProfile;
            // Potentially push updates back to DataContext or a backend API
            setDataContextUserProfile?.(updated);
            return updated;
        });
        setMemoryLog(prev => [...prev, `[${new Date().toISOString()}] User profile updated: ${JSON.stringify(updates)}`]);
    }, [setDataContextUserProfile]);

    const recordInsight = useCallback((insight: string) => {
        setMemoryLog(prev => [...prev, `[${new Date().toISOString()}] Insight recorded: ${insight}`]);
    }, []);

    const retrieveMemory = useCallback((query: string) => {
        // Simulate a sophisticated retrieval mechanism
        const relevantLogs = memoryLog.filter(log => log.toLowerCase().includes(query.toLowerCase()));
        return {
            userProfile: aiManagedUserProfile,
            relevantInsights: relevantLogs
        };
    }, [aiManagedUserProfile, memoryLog]);

    return { userProfile: aiManagedUserProfile, updateProfile, recordInsight, retrieveMemory, memoryLog };
};

/**
 * @description Hook for the AI's Proactive Insights Engine.
 * Generates and suggests relevant information or actions without explicit user prompting,
 * based on user data, market conditions, and defined rules.
 */
export const useProactiveInsightsEngine = () => {
    const { userProfile } = useLongTermMemory();
    const { proactiveLevel } = useAISettings();
    const { accountData, transactions, financialGoals, portfolioData } = useContext(DataContext); // Assume DataContext provides comprehensive data

    const generateProactiveInsights = useCallback(async (): Promise<Message | null> => {
        if (proactiveLevel === 'minimal' || !userProfile) return null;

        const insights: string[] = [];
        const actionSuggestions: ActionSuggestion[] = [];

        // Example Proactive Rules:
        // 1. Budget Alerts
        if (transactions && userProfile.spendingHabits?.categoryBudgets) {
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            for (const category in userProfile.spendingHabits.categoryBudgets) {
                const budget = userProfile.spendingHabits.categoryBudgets[category];
                const spent = transactions
                    .filter(t => t.category === category && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear)
                    .reduce((sum, t) => sum + t.amount, 0);
                if (spent > budget * 0.9 && spent <= budget) {
                    insights.push(`You're approaching your ${category} budget limit for the month. Current spend: $${spent.toFixed(2)} / $${budget.toFixed(2)}.`);
                } else if (spent > budget) {
                    insights.push(`You've exceeded your ${category} budget for the month by $${(spent - budget).toFixed(2)}. Current spend: $${spent.toFixed(2)} / $${budget.toFixed(2)}.`);
                    actionSuggestions.push({
                        id: `budget_alert_${category}`,
                        text: `Review ${category} spending`,
                        actionType: 'deepDive',
                        payload: { view: View.Transactions, filterCategory: category }
                    });
                }
            }
        }

        // 2. Goal Progress Alerts
        if (financialGoals && financialGoals.length > 0) {
            financialGoals.forEach(goal => {
                if (goal.status === 'at_risk' && goal.alertsEnabled) {
                    insights.push(`Your goal "${goal.name}" is currently at risk. You need to contribute more to reach it by ${goal.targetDate.toLocaleDateString()}.`);
                    actionSuggestions.push({
                        id: `goal_risk_${goal.id}`,
                        text: `Explore options for ${goal.name}`,
                        actionType: 'apiCall',
                        payload: { tool: AI_TOOLS.UPDATE_FINANCIAL_GOAL.name, args: { goalId: goal.id } } // Simulate tool call to suggest adjustment
                    });
                } else if (goal.status === 'on_track' && goal.alertsEnabled && goal.autoContribute && goal.autoContribute > 0) {
                    insights.push(`Great news! Your goal "${goal.name}" is on track, with an auto-contribution of $${goal.autoContribute} monthly. Keep it up!`);
                }
            });
        }

        // 3. Investment Opportunities (simulated)
        if (proactiveLevel === 'action-oriented' && portfolioData && userProfile.riskTolerance === 'high') {
            insights.push("Based on current market trends and your risk tolerance, consider exploring emerging market ETFs for potential diversification.");
            actionSuggestions.push({
                id: 'emerging_market_etf',
                text: 'Show emerging market ETF options',
                actionType: 'apiCall',
                payload: { tool: AI_TOOLS.GET_MARKET_DATA.name, args: { symbol: 'EMERGING_MARKET_ETFS', period: 'realtime' } }
            });
        }

        if (insights.length > 0) {
            const proactiveMessage: Message = {
                id: `proactive-${Date.now()}`,
                role: 'model',
                parts: [{ text: `Here are some insights I've generated:\n- ${insights.join('\n- ')}` }],
                timestamp: new Date(),
                isProactive: true,
                actionSuggestions: actionSuggestions.length > 0 ? actionSuggestions : undefined,
                confidenceScore: 0.85 // High confidence for proactive insights
            };
            return proactiveMessage;
        }

        return null;
    }, [proactiveLevel, userProfile, accountData, transactions, financialGoals, portfolioData]);

    return { generateProactiveInsights };
};

/**
 * @description Custom hook for handling the core AI processing logic, including tool orchestration.
 */
export const useAIProcessor = () => {
    const { userProfile, retrieveMemory, recordInsight } = useLongTermMemory();
    const { accountData, transactions, budgets, investments } = useContext(DataContext); // Full data context for tool execution
    const { speak } = useTextToSpeech();
    const { proactiveLevel } = useAISettings();

    // Simulates a backend tool execution engine
    const executeTool = useCallback(async (toolCall: ToolCall): Promise<ToolResponse> => {
        const { toolName, args } = toolCall;
        console.log(`Executing tool: ${toolName} with args:`, args); // For debugging

        try {
            let result: any;
            let success = true;

            switch (toolName as AIToolName) {
                case 'getTransactions':
                    // In a real app, this would query a database/API
                    result = transactions?.filter(t => {
                        const date = new Date(t.date);
                        const startDate = args.startDate ? new Date(args.startDate) : null;
                        const endDate = args.endDate ? new Date(args.endDate) : null;
                        return (!startDate || date >= startDate) &&
                            (!endDate || date <= endDate) &&
                            (!args.category || t.category === args.category) &&
                            (!args.minAmount || t.amount >= args.minAmount);
                    }) || [];
                    break;
                case 'getAccountBalances':
                    result = accountData; // Directly from DataContext for simulation
                    break;
                case 'getBudgetProgress':
                    result = budgets?.find(b => b.name === args.budgetName) || budgets;
                    break;
                case 'createBudget':
                    // Simulate creation, in real app would call API
                    result = { success: true, newBudget: args };
                    recordInsight(`New budget created for ${args.category}: $${args.amount}`);
                    break;
                case 'getInvestmentPortfolio':
                    result = investments; // Directly from DataContext for simulation
                    break;
                case 'simulatePortfolioGrowth':
                    // Basic simulation: A = P(1 + r/n)^(nt)
                    const { initialAmount, monthlyContribution, years, annualReturnRate } = args;
                    let balance = initialAmount;
                    const monthlyRate = annualReturnRate / 12;
                    const months = years * 12;
                    for (let i = 0; i < months; i++) {
                        balance += monthlyContribution;
                        balance *= (1 + monthlyRate);
                    }
                    result = { finalBalance: balance.toFixed(2), initialAmount, monthlyContribution, years, annualReturnRate };
                    break;
                case 'getLoanDetails':
                    result = { loanId: args.loanId || 'mock-loan-1', type: args.loanType || 'Mortgage', balance: 250000, interestRate: 3.5, nextPayment: 1500 };
                    break;
                case 'getFinancialGoals':
                    result = userProfile?.financialGoals?.filter(g => !args.status || g.status === args.status);
                    break;
                case 'updateFinancialGoal':
                    // Simulate update
                    const goalToUpdate = userProfile?.financialGoals.find(g => g.id === args.goalId);
                    if (goalToUpdate) {
                        Object.assign(goalToUpdate, args); // Apply updates
                        // In a real app, you'd update the persistent user profile via DataContext/API
                        result = { success: true, updatedGoal: goalToUpdate };
                        recordInsight(`Financial goal ${goalToUpdate.name} updated.`);
                    } else {
                        result = { success: false, message: 'Goal not found.' };
                    }
                    break;
                case 'analyzeSpendingPatterns':
                    // A more complex analysis would occur here
                    const recentSpending = transactions?.filter(t =>
                        new Date(t.date) >= new Date(args.startDate || '2023-01-01') &&
                        new Date(t.date) <= new Date(args.endDate || new Date()) &&
                        (!args.categories || args.categories.includes(t.category))
                    );
                    const spendingByCategory = recentSpending?.reduce((acc, t) => {
                        acc[t.category] = (acc[t.category] || 0) + t.amount;
                        return acc;
                    }, {} as Record<string, number>);
                    result = { totalSpending: recentSpending?.reduce((sum, t) => sum + t.amount, 0), spendingByCategory };
                    break;
                case 'getMarketData':
                    result = { symbol: args.symbol, price: Math.random() * 1000 + 100, change: (Math.random() - 0.5) * 10 }; // Mock data
                    break;
                case 'suggestInvestmentStrategy':
                    result = `Given your ${args.riskTolerance} risk tolerance and ${args.investmentHorizon} horizon, a diversified portfolio with a mix of index funds and some growth stocks is recommended.`;
                    break;
                case 'sendNotification':
                    console.log(`[NOTIFICATION SENT TO ${args.recipient}]: ${args.message} (Urgency: ${args.urgency})`);
                    result = { success: true, message: 'Notification sent.' };
                    break;
                default:
                    success = false;
                    result = { error: `Tool "${toolName}" not found or not implemented.` };
            }
            return { toolName, response: result, success, timestamp: new Date() };
        } catch (error) {
            console.error(`Error executing tool ${toolName}:`, error);
            return { toolName, response: { error: (error as Error).message }, success: false, timestamp: new Date() };
        }
    }, [accountData, transactions, budgets, investments, userProfile, recordInsight]);

    /**
     * @description Processes a user message, handles tool calls, and generates the AI response.
     * This is the core intelligence loop.
     */
    const processMessage = useCallback(async (
        chatInstance: Chat,
        messageText: string,
        existingMessages: Message[]
    ): Promise<Message> => {
        const fullContext = retrieveMemory(""); // Get comprehensive user profile and relevant insights

        const currentMessagesForAPI = existingMessages.map(msg => ({
            role: msg.role,
            parts: msg.parts.map(p => ({ text: p.text }))
        }));

        // Add user profile and retrieved memory as a system message for current turn context
        const contextParts = [
            { text: `Current user profile summary: ${JSON.stringify(fullContext.userProfile?.spendingHabits || {})}` },
            { text: `Relevant past insights: ${fullContext.relevantInsights.join('; ')}` }
        ];

        // This is a simplification; in a real Gemini tool use, the tool definitions would be passed
        // directly to the model configuration or the sendMessage function with specific tool_config.
        // For this simulation, we're assuming the model 'knows' about the tools via system instruction
        // and we're parsing its response to simulate tool calling.
        const toolsSchema = Object.values(AI_TOOLS).map(tool => ({
            functionDeclarations: [{
                name: tool.name,
                description: tool.description,
                parameters: tool.parameters
            }]
        }));

        try {
            const response = await chatInstance.sendMessage({
                message: messageText,
                // In a real Gemini setup, tool schemas are passed here or in chat creation.
                // For this example, we simulate parsing tool calls from text response.
                // Or if we were using a different Gemini method that directly returns tool calls:
                // tools: toolsSchema
            });

            // Simulate parsing tool calls from text if the model doesn't directly return them
            // This is a simplification; Gemini's actual tool calling mechanism is more structured.
            let modelResponseText = response.text || '';
            const toolCallRegex = /CALL_TOOL:(\w+)\(([^)]*)\)/g; // Example format: CALL_TOOL:getTransactions(category='Food', startDate='2023-01-01')
            let match;
            const detectedToolCalls: ToolCall[] = [];

            while ((match = toolCallRegex.exec(modelResponseText)) !== null) {
                const toolName = match[1];
                const argsString = match[2];
                try {
                    // Attempt to parse argsString as JSON-like object string
                    const args = JSON.parse(`{${argsString.replace(/(\w+)=/g, '"$1":').replace(/'/g, '"')}}`);
                    detectedToolCalls.push({ toolName, args });
                    modelResponseText = modelResponseText.replace(match[0], `[AI initiated action using ${toolName} tool...]`);
                } catch (parseError) {
                    console.warn(`Failed to parse tool arguments for ${toolName}:`, argsString, parseError);
                    // Handle cases where parsing fails, AI might just describe the tool use
                }
            }

            let toolResponses: ToolResponse[] = [];
            if (detectedToolCalls.length > 0) {
                for (const call of detectedToolCalls) {
                    const toolResp = await executeTool(call);
                    toolResponses.push(toolResp);
                    modelResponseText += `\n\nTool "${call.toolName}" responded: ${JSON.stringify(toolResp.response)}`;
                }
            }

            const modelMessage: Message = {
                id: `msg-${Date.now()}`,
                role: 'model',
                parts: [{ text: modelResponseText }],
                timestamp: new Date(),
                toolCalls: detectedToolCalls.length > 0 ? detectedToolCalls : undefined,
                toolResponses: toolResponses.length > 0 ? toolResponses : undefined,
                confidenceScore: 0.9 // Placeholder
            };

            // Post-processing: Generate rich content based on tool responses or AI analysis
            if (modelResponseText.includes("spendingByCategory") && toolResponses.some(tr => tr.toolName === AI_TOOLS.ANALYZE_SPENDING_PATTERNS.name)) {
                const spendingData = toolResponses.find(tr => tr.toolName === AI_TOOLS.ANALYZE_SPENDING_PATTERNS.name)?.response.spendingByCategory;
                if (spendingData) {
                    modelMessage.chartData = {
                        type: 'pie',
                        data: {
                            labels: Object.keys(spendingData),
                            datasets: [{
                                data: Object.values(spendingData),
                                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
                            }]
                        },
                        title: 'Spending by Category'
                    };
                }
            } else if (modelResponseText.includes("portfolioGrowth") && toolResponses.some(tr => tr.toolName === AI_TOOLS.SIMULATE_PORTFOLIO_GROWTH.name)) {
                const simResult = toolResponses.find(tr => tr.toolName === AI_TOOLS.SIMULATE_PORTFOLIO_GROWTH.name)?.response;
                if (simResult) {
                    modelMessage.tableData = {
                        headers: ['Metric', 'Value'],
                        rows: [
                            ['Initial Amount', `$${simResult.initialAmount}`],
                            ['Monthly Contribution', `$${simResult.monthlyContribution}`],
                            ['Years', simResult.years],
                            ['Annual Return Rate', `${(simResult.annualReturnRate * 100).toFixed(2)}%`],
                            ['Projected Final Balance', `$${simResult.finalBalance}`]
                        ],
                        title: 'Portfolio Growth Simulation'
                    };
                    modelMessage.actionSuggestions = [{
                        id: 'adjust_sim',
                        text: 'Adjust simulation parameters',
                        actionType: 'triggerUI',
                        payload: { component: 'SimulationModal', initialData: simResult }
                    }];
                }
            }

            // Speak the response if proactive level allows or user preference
            if (proactiveLevel !== 'minimal') { // or check user speech preference
                speak(modelResponseText);
            }

            return modelMessage;
        } catch (error) {
            console.error("AI Advisor Processing Error:", error);
            recordInsight(`AI processing error: ${(error as Error).message}`);
            return {
                id: `err-${Date.now()}`,
                role: 'model',
                parts: [{ text: "I apologize, but I've encountered a system error while processing your request. This often happens with complex queries or tool interactions. Please try rephrasing or simplifying your request." }],
                timestamp: new Date(),
                confidenceScore: 0.1
            };
        }
    }, [executeTool, retrieveMemory, speak, proactiveLevel, recordInsight]);

    return { processMessage };
};

// ================================================================================================
// UI COMPONENTS - THE UNIVERSE'S VISUAL REPRESENTATION
// ================================================================================================

/**
 * @description Renders rich content messages (charts, tables, action buttons).
 */
export const RichMessageRenderer: React.FC<{ message: Message; onActionClick: (action: ActionSuggestion) => void }> = ({ message, onActionClick }) => {
    const { accessibilityMode } = useAISettings();
    const baseFontSize = accessibilityMode.fontSize === 'small' ? 'text-sm' : accessibilityMode.fontSize === 'large' ? 'text-lg' : 'text-base';
    const highContrastClass = accessibilityMode.highContrast ? 'border-2 border-cyan-400' : '';

    return (
        <div className={`space-y-3 ${baseFontSize}`}>
            {message.parts.map((part, i) => (
                <p key={i}>{part.text}</p>
            ))}
            {message.chartData && (
                <div className={`bg-gray-800 p-4 rounded-lg shadow-inner ${highContrastClass}`}>
                    {message.chartData.title && <h4 className="font-semibold mb-2 text-cyan-300">{message.chartData.title}</h4>}
                    {message.chartData.description && <p className="text-gray-400 text-sm mb-3">{message.chartData.description}</p>}
                    <Chart type={message.chartData.type} data={message.chartData.data} options={message.chartData.options} />
                </div>
            )}
            {message.tableData && (
                <div className={`bg-gray-800 p-4 rounded-lg shadow-inner overflow-x-auto ${highContrastClass}`}>
                    {message.tableData.title && <h4 className="font-semibold mb-2 text-cyan-300">{message.tableData.title}</h4>}
                    {message.tableData.description && <p className="text-gray-400 text-sm mb-3">{message.tableData.description}</p>}
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead>
                            <tr>
                                {message.tableData.headers.map((header, i) => (
                                    <th key={i} className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {message.tableData.rows.map((row, i) => (
                                <tr key={i}>
                                    {row.map((cell, j) => (
                                        <td key={j} className="px-3 py-2 whitespace-nowrap text-gray-300">
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {message.actionSuggestions && message.actionSuggestions.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                    {message.actionSuggestions.map(action => (
                        <button
                            key={action.id}
                            onClick={() => onActionClick(action)}
                            className="px-3 py-1 bg-cyan-800/40 text-cyan-200 rounded-full text-xs hover:bg-cyan-700/60 transition-colors"
                        >
                            {action.text}
                        </button>
                    ))}
                </div>
            )}
            {message.voiceAudioUrl && (
                <audio controls src={message.voiceAudioUrl} className="w-full"></audio>
            )}
            {message.imageContent && (
                <img src={message.imageContent} alt="AI generated content" className="max-w-xs h-auto rounded-lg" />
            )}
            {message.isProactive && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Proactive Insight
                </span>
            )}
            {message.feedback === 'like' && <span className="text-green-500 text-sm">👍 Liked</span>}
            {message.feedback === 'dislike' && <span className="text-red-500 text-sm">👎 Disliked</span>}
            {message.confidenceScore && <span className="text-gray-500 text-xs ml-2">Confidence: {(message.confidenceScore * 100).toFixed(0)}%</span>}
        </div>
    );
};

/**
 * @description Input component with voice and file upload capabilities.
 */
export const AdvancedChatInput: React.FC<{
    input: string;
    setInput: (s: string) => void;
    handleSendMessage: (s: string) => Promise<void>;
    isLoading: boolean;
    isListening: boolean;
    startListening: () => void;
    stopListening: () => void;
}> = ({ input, setInput, handleSendMessage, isLoading, isListening, startListening, stopListening }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            // Simulate processing a file
            console.log("File uploaded:", files[0].name);
            setInput(prev => `${prev} [File: ${files[0].name} uploaded]`);
            // In a real app, send file to backend for processing/embedding
        }
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }} className="flex items-center gap-2">
            <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700/50 hover:bg-gray-700'} text-white`}
                disabled={isLoading}
                aria-label={isListening ? 'Stop listening' : 'Start voice input'}
            >
                {isListening ? (
                    <svg className="w-6 h-6 animate-pulse" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0c0 2.21-1.79 4-4 4V3a1 1 0 10-2 0v9c-2.21 0-4-1.79-4-4a1 1 0 00-2 0c0 3.064 2.502 5.567 5.736 5.918L8 18h4l-.274-.067z" clipRule="evenodd"></path></svg>
                ) : (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0c0 2.21-1.79 4-4 4V3a1 1 0 10-2 0v9c-2.21 0-4-1.79-4-4a1 1 0 00-2 0c0 3.064 2.502 5.567 5.736 5.918L8 18h4l-.274-.067z" clipRule="evenodd"></path></svg>
                )}
            </button>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Quantum anything..."
                className="flex-grow bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                disabled={isLoading}
                aria-label="Chat input for AI Advisor"
            />
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.csv,.xlsx,.jpg,.png" // Expanded file types
            />
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-full bg-gray-700/50 hover:bg-gray-700 text-white"
                disabled={isLoading}
                aria-label="Upload file"
            >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd"></path></svg>
            </button>
            <button
                type="submit"
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg disabled:opacity-50 flex items-center justify-center w-24"
                disabled={isLoading || !input.trim()}
                aria-label="Send message"
            >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    'Send'
                )}
            </button>
        </form>
    );
};

// ================================================================================================
// MAIN COMPONENT: AIAdvisorView (Oraculum AI) - THE UNIVERSE'S HEART
// ================================================================================================

/**
 * @description The main view for the AI Advisor, "Quantum". This component facilitates a
 * stateful, streaming conversation with the Gemini API, acting as a financial co-pilot.
 * @param {{ previousView: View | null }} props - The user's previously active view for context.
 */
const AIAdvisorView: React.FC<{ previousView: View | null }> = ({ previousView }) => {
    const { userProfile: dataContextUserProfile, ...dataContextRest } = useContext(DataContext);
    const { processMessage } = useAIProcessor();
    const { isListening, transcript, startListening, stopListening } = useSpeechToText(text => handleSendMessage(text));
    const { generateProactiveInsights } = useProactiveInsightsEngine();
    const { userProfile, updateProfile } = useLongTermMemory(); // Use AI-managed profile

    const chatRef = useRef<Chat | null>(null);

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [activeAISettings, setActiveAISettings] = useState<AISettings>(useAISettings()); // State for dynamic settings changes

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Dynamic system instruction based on settings and user profile
    const systemInstruction = generateSystemInstruction(activeAISettings, userProfile);

    /**
     * @description Initializes the Gemini chat instance on component mount or settings change.
     * This sets up the AI's persona and capabilities via the system instruction.
     */
    useEffect(() => {
        const initializeChat = async () => {
            if (chatRef.current) {
                // If chat exists, attempt to update system instruction or re-initialize if necessary
                // Gemini API might not support dynamic system instruction updates on an active chat.
                // For a robust system, re-initialization might be needed or a proxy layer.
                console.warn("AI chat instance already exists. System instruction update might require re-initialization.");
            }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            chatRef.current = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: systemInstruction,
                    // Additional safety settings, generation config, etc.
                }
            });
            console.log("AI Chat initialized/re-initialized with system instruction:", systemInstruction);
        };
        initializeChat();
    }, [systemInstruction]); // Re-initialize chat if system instruction changes

    /**
     * @description Automatically scrolls the chat window to the latest message.
     */
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    /**
     * @description Periodically checks for proactive insights.
     */
    useEffect(() => {
        const intervalId = setInterval(async () => {
            if (!isLoading && activeAISettings.proactiveLevel !== 'minimal') {
                const insight = await generateProactiveInsights();
                if (insight) {
                    setMessages(prev => [...prev, insight]);
                }
            }
        }, 60000); // Check every minute for new insights
        return () => clearInterval(intervalId);
    }, [isLoading, activeAISettings.proactiveLevel, generateProactiveInsights]);

    /**
     * @description Handles sending a message to the Gemini API and updating the chat history.
     * Integrates advanced processing and rich content generation.
     */
    const handleSendMessage = async (messageText: string) => {
        if (!messageText.trim() || !chatRef.current) return;

        setIsLoading(true);
        const userMessage: Message = { id: `user-${Date.now()}`, role: 'user', parts: [{ text: messageText }], timestamp: new Date() };
        setMessages(prev => [...prev, userMessage]);
        setInput('');

        try {
            const aiResponse = await processMessage(chatRef.current, messageText, messages);
            setMessages(prev => [...prev, aiResponse]);
            // Update user profile based on AI's insights/actions (conceptual)
            if (aiResponse.toolResponses?.some(tr => tr.toolName === AI_TOOLS.UPDATE_FINANCIAL_GOAL.name)) {
                updateProfile({}); // Trigger a profile refresh or specific update
            }
        } catch (error) {
            console.error("AI Advisor Error during send:", error);
            const errorMessage: Message = { id: `err-${Date.now()}`, role: 'model', parts: [{ text: "A critical error occurred while processing your request. The AI may be temporarily unavailable or the complexity of the query was too high." }], timestamp: new Date(), confidenceScore: 0.05 };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleActionSuggestionClick = async (action: ActionSuggestion) => {
        console.log("Action suggested:", action);
        // Simulate execution of action
        switch (action.actionType) {
            case 'link':
                if (action.payload?.url) window.open(action.payload.url, '_blank');
                break;
            case 'apiCall':
                // Directly call the AI's tool execution logic (or a specific API endpoint)
                const toolResponse = await (useAIProcessor().executeTool({ toolName: action.payload?.tool, args: action.payload?.args }));
                setMessages(prev => [...prev, {
                    id: `action-resp-${Date.now()}`,
                    role: 'model',
                    parts: [{ text: `Executed action "${action.text}". Result: ${JSON.stringify(toolResponse.response)}` }],
                    timestamp: new Date()
                }]);
                break;
            case 'triggerUI':
                // For a real app, this would open a modal or navigate
                alert(`Triggering UI for: ${action.payload?.component} with data: ${JSON.stringify(action.payload?.initialData)}`);
                break;
            case 'deepDive':
                // Simulate navigation or detailed view
                alert(`Navigating to deep dive for: ${action.payload?.view} with filter: ${action.payload?.filterCategory}`);
                break;
            default:
                console.warn("Unknown action type:", action.actionType);
        }
    };

    const handleMessageFeedback = (messageId: string, feedback: 'like' | 'dislike') => {
        setMessages(prev => prev.map(msg =>
            msg.id === messageId ? { ...msg, feedback: feedback === msg.feedback ? null : feedback } : msg
        ));
        // In a real app, send feedback to backend for model improvement
        console.log(`Feedback for ${messageId}: ${feedback}`);
    };


    // Determine which set of example prompts to show based on the user's previous location and profile.
    const prompts = dynamicExamplePrompts(previousView, userProfile);

    return (
        <AISettingsProvider initialSettings={activeAISettings}>
            <div className="h-full flex flex-col">
                <h2 className="text-3xl font-bold text-white tracking-wider mb-6">AI Advisor (Quantum)</h2>
                {/* Advanced Settings Button */}
                <button
                    onClick={() => alert("AI Settings Modal would open here for persona, verbosity, proactive level, etc.")}
                    className="absolute top-4 right-4 p-2 bg-gray-700/50 hover:bg-gray-700 rounded-full text-white text-sm"
                    aria-label="Open AI settings"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.587.363 1.065.795 1.065 2.572z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </button>

                <Card className="flex-grow flex flex-col" padding="none">
                    {/* Message display area */}
                    <div className="flex-grow p-6 space-y-4 overflow-y-auto custom-scrollbar">
                        {messages.map((msg, index) => (
                            <div key={msg.id || index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xl p-3 rounded-lg shadow-md ${msg.role === 'user' ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                                    <RichMessageRenderer message={msg} onActionClick={handleActionSuggestionClick} />
                                    {msg.role === 'model' && (
                                        <div className="flex justify-end gap-2 mt-2">
                                            <button
                                                onClick={() => handleMessageFeedback(msg.id, 'like')}
                                                className={`text-sm p-1 rounded-full ${msg.feedback === 'like' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-green-400'}`}
                                                aria-label="Like response"
                                            >
                                                👍
                                            </button>
                                            <button
                                                onClick={() => handleMessageFeedback(msg.id, 'dislike')}
                                                className={`text-sm p-1 rounded-full ${msg.feedback === 'dislike' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-red-400'}`}
                                                aria-label="Dislike response"
                                            >
                                                👎
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {/* Empty div at the end of the list to which we can scroll */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="max-w-lg p-3 rounded-lg shadow-md bg-gray-700 text-gray-200">
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Initial state with contextual prompts */}
                    {messages.length === 0 && (
                        <div className="text-center p-6 text-gray-400 border-t border-gray-700/60">
                            <p className="mb-4">As your financial co-pilot, I can answer questions or perform tasks. Since you just came from the <strong className="text-cyan-300">{previousView || 'Dashboard'}</strong>, you could ask:</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                {prompts.map((p, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSendMessage(p)}
                                        className="p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-sm text-cyan-200 transition-colors text-left"
                                    >
                                        "{p}"
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input form area */}
                    <div className="p-4 border-t border-gray-700/60 bg-gray-800/50 rounded-b-xl">
                        <AdvancedChatInput
                            input={input}
                            setInput={setInput}
                            handleSendMessage={handleSendMessage}
                            isLoading={isLoading}
                            isListening={isListening}
                            startListening={startListening}
                            stopListening={stopListening}
                        />
                    </div>
                </Card>
            </div>
        </AISettingsProvider>
    );
};

export default AIAdvisorView;
