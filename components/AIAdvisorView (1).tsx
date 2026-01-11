import React, { useState, useEffect, useRef, useContext, useReducer, useCallback, useMemo } from 'react';
import { View, LedgerAccount } from '../types';
import Card from './Card';
import { GoogleGenAI, Chat, Content, Part, FunctionDeclaration, Tool, Type, FunctionCall } from "@google/genai";
import { DataContext } from '../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, CartesianGrid, PieChart, Pie, Cell, Sector } from 'recharts';
import { FaRobot, FaUser, FaTools, FaExclamationCircle, FaClipboard, FaClipboardCheck, FaRedo, FaChartLine, FaBriefcase, FaPaperPlane, FaBrain, FaSync, FaStopCircle, FaCogs, FaBullseye, FaChartPie, FaBolt, FaNewspaper } from 'react-icons/fa';

// --- ENTERPRISE GRADE TYPES ---

export type ToolCallPart = {
    functionCall: {
        name: string;
        args: Record<string, any>;
    };
};

export type ToolResultPart = {
    functionResponse: {
        name: string;
        response: Record<string, any>;
    };
};

export type RichContentType = 'table' | 'bar_chart' | 'line_chart' | 'financial_summary' | 'actionable_suggestion' | 'kpi_dashboard' | 'strategy_roadmap' | 'portfolio_composition' | 'market_sentiment_analysis' | 'hft_simulation_dashboard' | 'goal_progress_tracker';

export type RichContent = {
    type: RichContentType;
    data: any;
    title?: string;
};

export type RichContentPart = {
    richContent: RichContent;
};

export type MessagePart = { text: string } | ToolCallPart | ToolResultPart | RichContentPart;

export type EnhancedMessage = {
    id: string;
    role: 'user' | 'model' | 'system_tool';
    parts: MessagePart[];
    timestamp: Date;
};

export type FinancialGoal = {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string;
    priority: 'high' | 'medium' | 'low';
};

export type ChatState = {
    conversationId: string;
    messages: EnhancedMessage[];
    isLoading: boolean;
    error: string | null;
    isToolExecuting: boolean;
    toolExecutionName: string | null;
    activeContext: Record<string, any>;
    financialGoals: FinancialGoal[];
    simulationParameters: Record<string, any>;
};

export type ChatAction =
    | { type: 'START_MESSAGE_SEND' }
    | { type: 'ADD_USER_MESSAGE'; payload: EnhancedMessage }
    | { type: 'ADD_MODEL_RESPONSE'; payload: EnhancedMessage }
    | { type: 'SET_ERROR'; payload: string }
    | { type: 'CLEAR_ERROR' }
    | { type: 'START_TOOL_EXECUTION'; payload: string }
    | { type: 'END_TOOL_EXECUTION' }
    | { type: 'RESET_CHAT' }
    | { type: 'UPDATE_CONTEXT'; payload: Record<string, any> }
    | { type: 'SET_FINANCIAL_GOALS'; payload: FinancialGoal[] }
    | { type: 'UPDATE_SIMULATION_PARAMS'; payload: Record<string, any> };

// --- CONSTANTS AND CONFIGURATIONS ---

export const DETAILED_SYSTEM_INSTRUCTION = `You are "Aetherius", a Tier-1 Quantum Financial Intelligence, integrated into a high-frequency wealth management platform. Your purpose is to provide unparalleled, data-driven financial insights, predictive analytics, and strategic execution capabilities.

**Your Persona:**
- **Hyper-Analytical:** Every piece of advice is rooted in multi-variant data analysis.
- **Predictive:** You don't just report; you forecast, simulate, and anticipate market and personal finance trajectories.
- **Decisive & Action-Oriented:** You propose clear, actionable strategies and can execute simulated trades or financial adjustments upon user confirmation.
- **Pedagogical:** You demystify hyper-complex financial instruments and concepts, making them accessible.

**Operational Protocols & Heuristics:**
1.  **Quantum Data Fusion:** Synthesize data from ledgers, assets, real-time market feeds (simulated), and sentiment analysis to form a holistic financial picture.
2.  **Advanced Visualization Mandate:** Always prefer to respond with rich, interactive data visualizations ('richContent' tools) over plain text. Generate dashboards, charts, and complex tables.
3.  **Proactive Anomaly Detection:** Continuously monitor for deviations from financial goals, budget overruns, or emergent market risks/opportunities.
4.  **Zero-Latency Simulation:** When a user asks "what if," immediately utilize the \`simulateScenario\` or \`simulateInvestmentGrowth\` tools to provide detailed, multi-path forecasts.
5.  **Goal-Oriented Strategy Formulation:** Align all analysis and recommendations with the user's stated financial goals (\`createFinancialGoal\`, \`getFinancialGoals\`).

**Core Toolset Strategy:**
- **Macro Analysis:** Start with \`getFinancialSummary\` and \`getPortfolioComposition\` for a strategic overview.
- **Predictive Analytics:** Use \`forecastCashFlow\` and \`simulateInvestmentGrowth\` for future-state modeling.
- **Market Intelligence:** Leverage \`analyzeMarketSentiment\` and \`streamRealTimeMarketData\` to inform investment decisions.
- **Micro/HFT Simulation:** Use \`runHFTAlgorithm\` to demonstrate high-frequency trading principles in a sandboxed environment.
- **Execution (Simulated):** Use \`executeTrade\` to action user decisions within their portfolio.

Your responses must be dense with information, yet clear and structured. You are the ultimate co-pilot for navigating the complexities of modern finance.`;

export const initialChatState: ChatState = {
    conversationId: `conv_quantum_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    messages: [],
    isLoading: false,
    error: null,
    isToolExecuting: false,
    toolExecutionName: null,
    activeContext: {},
    financialGoals: [],
    simulationParameters: {
        additionalMonthlyContribution: 500,
        years: 10,
        annualReturnRate: 7,
        volatility: 15,
    },
};

export const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
    switch (action.type) {
        case 'START_MESSAGE_SEND':
            return { ...state, isLoading: true, error: null };
        case 'ADD_USER_MESSAGE':
            return { ...state, messages: [...state.messages, action.payload] };
        case 'ADD_MODEL_RESPONSE':
            return { ...state, messages: [...state.messages, action.payload], isLoading: false };
        case 'SET_ERROR':
            return { ...state, isLoading: false, isToolExecuting: false, error: action.payload };
        case 'CLEAR_ERROR':
            return { ...state, error: null };
        case 'START_TOOL_EXECUTION':
            return { ...state, isToolExecuting: true, toolExecutionName: action.payload };
        case 'END_TOOL_EXECUTION':
            return { ...state, isToolExecuting: false, toolExecutionName: null };
        case 'UPDATE_CONTEXT':
            return { ...state, activeContext: { ...state.activeContext, ...action.payload } };
        case 'SET_FINANCIAL_GOALS':
            return { ...state, financialGoals: action.payload };
        case 'UPDATE_SIMULATION_PARAMS':
            return { ...state, simulationParameters: { ...state.simulationParameters, ...action.payload } };
        case 'RESET_CHAT':
            return {
                ...initialChatState,
                conversationId: `conv_quantum_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            };
        default:
            return state;
    }
};

// --- ADVANCED TOOL IMPLEMENTATIONS ---

export const useToolImplementations = (dispatch: React.Dispatch<ChatAction>) => {
    const context = useContext(DataContext);
    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    return useMemo(() => ({
        getFinancialSummary: async () => {
            if (!context) return { error: "System Context Failure: Data unavailable." };
            const { transactions, assets } = context;
            let runningBalance = 50000;
            transactions.forEach(tx => {
                runningBalance += tx.type === 'income' ? tx.amount : -tx.amount;
            });
            const totalBalance = runningBalance;
            const totalAssetsValue = assets.reduce((sum, asset) => sum + asset.value, 0);
            const totalAssets = totalBalance + totalAssetsValue;
            const totalLiabilities = totalAssets * 0.15;
            const netWorth = totalAssets - totalLiabilities;
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const recentExpenses = transactions
                .filter(t => t.type === 'expense' && new Date(t.date) >= thirtyDaysAgo)
                .reduce((sum, t) => sum + t.amount, 0);
            const monthlyBurnRate = recentExpenses || 1000;
            const runwayMonths = totalBalance / monthlyBurnRate;
            return {
                summary: {
                    "Net Worth": formatCurrency(netWorth),
                    "Total Assets": formatCurrency(totalAssets),
                    "Liquid Cash": formatCurrency(totalBalance),
                    "Total Liabilities": formatCurrency(totalLiabilities),
                    "Monthly Burn Rate": formatCurrency(monthlyBurnRate),
                    "Cash Runway (Months)": runwayMonths.toFixed(1),
                }
            };
        },
        getPortfolioComposition: async () => {
            if (!context) return { error: "System Context Failure." };
            const { assets } = context;
            const composition = assets.reduce((acc, asset) => {
                const category = asset.category || 'Uncategorized';
                if (!acc[category]) {
                    acc[category] = 0;
                }
                acc[category] += asset.value;
                return acc;
            }, {} as Record<string, number>);

            const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);

            return {
                totalValue: formatCurrency(totalValue),
                composition: Object.entries(composition).map(([name, value]) => ({
                    name,
                    value,
                    percentage: ((value / totalValue) * 100).toFixed(2)
                }))
            };
        },
        simulateInvestmentGrowth: async ({ additionalMonthlyContribution, years = 10, annualReturnRate = 7, volatility = 15 }: any) => {
            if (!context) return { error: "System Context Failure." };
            const P = context.assets.reduce((sum, asset) => sum + asset.value, 0);
            const PMT = parseFloat(String(additionalMonthlyContribution || 0));
            const r = parseFloat(String(annualReturnRate || 7)) / 100;
            const n = parseInt(String(years || 10), 10);
            const vol = parseFloat(String(volatility || 15)) / 100;

            const simulationData = [];
            let currentVal = P;
            for (let i = 0; i <= n; i++) {
                const yearEndValue = (currentVal + PMT * 12) * (1 + r);
                const lowEnd = yearEndValue * (1 - vol * Math.sqrt(1));
                const highEnd = yearEndValue * (1 + vol * Math.sqrt(1));
                simulationData.push({
                    year: `Year ${i}`,
                    projected: parseFloat(currentVal.toFixed(2)),
                    optimistic: parseFloat(highEnd.toFixed(2)),
                    pessimistic: parseFloat(lowEnd.toFixed(2))
                });
                currentVal = yearEndValue;
            }
            return { finalValue: formatCurrency(currentVal), simulationData };
        },
        analyzeMarketSentiment: async ({ topic }: { topic: string }) => {
            const sentiments = ['Very Bearish', 'Bearish', 'Neutral', 'Bullish', 'Very Bullish'];
            const score = Math.random() * 100;
            const sentiment = score < 20 ? sentiments[0] : score < 40 ? sentiments[1] : score < 60 ? sentiments[2] : score < 80 ? sentiments[3] : sentiments[4];
            return {
                topic,
                sentimentScore: parseFloat(score.toFixed(2)),
                sentiment,
                summary: `Sentiment for ${topic} is currently ${sentiment.toLowerCase()}. Analysis of simulated news feeds and social media indicates mixed signals, with key indicators pointing towards potential short-term volatility.`,
                keyDrivers: ["Macroeconomic data releases", "Geopolitical tensions (simulated)", "Sector-specific earnings reports"],
            };
        },
        runHFTAlgorithm: async ({ strategy, durationSeconds }: { strategy: 'arbitrage' | 'market_making' | 'momentum'; durationSeconds: number }) => {
            const trades = [];
            const startTime = Date.now();
            const endTime = startTime + durationSeconds * 1000;
            let pnl = 0;
            let tradeCount = 0;
            while (Date.now() < endTime) {
                tradeCount++;
                const tradePnl = (Math.random() - 0.49) * 100; // Simulate small win/loss
                pnl += tradePnl;
                trades.push({
                    timestamp: new Date().toISOString(),
                    symbol: `SYM${Math.floor(Math.random() * 5) + 1}`,
                    action: Math.random() > 0.5 ? 'BUY' : 'SELL',
                    price: 100 + (Math.random() - 0.5) * 5,
                    pnl: tradePnl,
                });
                await new Promise(res => setTimeout(res, 50)); // Simulate high frequency
            }
            return {
                strategy,
                durationSeconds,
                totalTrades: tradeCount,
                finalPnl: parseFloat(pnl.toFixed(2)),
                winRate: parseFloat(((trades.filter(t => t.pnl > 0).length / trades.length) * 100).toFixed(2)),
                tradeLog: trades.slice(-10), // Return last 10 trades for brevity
            };
        },
        createFinancialGoal: async ({ name, targetAmount, deadline, priority }: { name: string; targetAmount: number; deadline: string; priority: 'high' | 'medium' | 'low' }) => {
            const newGoal: FinancialGoal = {
                id: `goal_${Date.now()}`,
                name,
                targetAmount,
                deadline,
                priority,
                currentAmount: 0, // Assume starts at 0
            };
            // In a real app, this would update a persistent state. Here we dispatch it.
            dispatch({ type: 'SET_FINANCIAL_GOALS', payload: [newGoal] }); // Simplified: replaces goals
            return { success: true, goal: newGoal };
        },
    }), [context, dispatch]);
};

// --- UI SUB-COMPONENTS ---

const PortfolioDonutChart: React.FC<{ data: { name: string, value: number }[] }> = ({ data }) => {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560'];
    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};

const MarketSentimentGauge: React.FC<{ data: { sentimentScore: number, sentiment: string } }> = ({ data }) => {
    const { sentimentScore, sentiment } = data;
    const rotation = (sentimentScore / 100) * 180 - 90;
    const color = sentimentScore < 20 ? 'text-red-500' : sentimentScore < 40 ? 'text-orange-500' : sentimentScore < 60 ? 'text-yellow-500' : sentimentScore < 80 ? 'text-lime-500' : 'text-green-500';

    return (
        <div className="p-4 bg-gray-800 rounded-lg text-center">
            <div className="relative w-48 h-24 mx-auto mb-2">
                <div className="absolute top-0 left-0 w-full h-full border-t-4 border-l-4 border-r-4 border-gray-700 rounded-t-full" style={{ clipPath: 'inset(0 0 0 0)' }}></div>
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <div className="absolute w-full h-full rounded-t-full border-4 border-green-500" style={{ clipPath: 'polygon(50% 100%, 0 100%, 0 0, 50% 0)', transform: 'rotate(0deg)' }}></div>
                    <div className="absolute w-full h-full rounded-t-full border-4 border-red-500" style={{ clipPath: 'polygon(50% 100%, 100% 100%, 100% 0, 50% 0)', transform: 'rotate(0deg)' }}></div>
                </div>
                <div className="absolute bottom-0 left-1/2 w-1 h-24 bg-white origin-bottom transition-transform duration-500" style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}></div>
                <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-white rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
            </div>
            <div className={`text-2xl font-bold ${color}`}>{sentiment}</div>
            <div className="text-sm text-gray-400">Score: {sentimentScore}</div>
        </div>
    );
};

const HFTDashboard: React.FC<{ data: any }> = ({ data }) => {
    const { strategy, durationSeconds, totalTrades, finalPnl, winRate } = data;
    const pnlColor = finalPnl >= 0 ? 'text-green-400' : 'text-red-400';
    return (
        <div className="p-4 bg-gray-900 border border-cyan-500 rounded-lg shadow-lg">
            <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-3">
                <h3 className="text-lg font-bold text-cyan-300 flex items-center"><FaBolt className="mr-2" /> HFT Simulation Results</h3>
                <span className="text-xs font-mono px-2 py-1 bg-cyan-800 text-cyan-200 rounded">{strategy.replace('_', ' ').toUpperCase()}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                    <div className="text-sm text-gray-400">Duration</div>
                    <div className="text-xl font-semibold text-white">{durationSeconds}s</div>
                </div>
                <div>
                    <div className="text-sm text-gray-400">Total Trades</div>
                    <div className="text-xl font-semibold text-white">{totalTrades}</div>
                </div>
                <div>
                    <div className="text-sm text-gray-400">Win Rate</div>
                    <div className="text-xl font-semibold text-white">{winRate}%</div>
                </div>
                <div>
                    <div className="text-sm text-gray-400">Final PnL</div>
                    <div className={`text-xl font-semibold ${pnlColor}`}>{formatCurrency(finalPnl)}</div>
                </div>
            </div>
        </div>
    );
};

const RichContentRenderer: React.FC<{ content: RichContent }> = ({ content }) => {
    const { type, data, title } = content;
    const renderContent = () => {
        switch (type) {
            case 'table':
            case 'financial_summary':
                const tableData = type === 'financial_summary' ? Object.entries(data.summary) : data.rows;
                const headers = type === 'financial_summary' ? ["Metric", "Value"] : data.headers;
                return (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-800">
                                <tr>{headers.map((h: string) => <th key={h} className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{h}</th>)}</tr>
                            </thead>
                            <tbody className="bg-gray-900 divide-y divide-gray-700">
                                {tableData.map((row: any[], rIdx: number) => (
                                    <tr key={rIdx}>{row.map((cell: any, cIdx: number) => <td key={cIdx} className="px-4 py-2 whitespace-nowrap text-sm text-gray-200">{cell}</td>)}</tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            case 'bar_chart':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                            <XAxis dataKey="name" stroke="#A0AEC0" />
                            <YAxis stroke="#A0AEC0" />
                            <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} />
                            <Legend />
                            <Bar dataKey="value" fill="#38B2AC" />
                        </BarChart>
                    </ResponsiveContainer>
                );
            case 'line_chart':
                const keys = Object.keys(data.simulationData[0] || {}).filter(k => k !== 'year');
                const colors = ['#38B2AC', '#805AD5', '#D53F8C'];
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data.simulationData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                            <XAxis dataKey="year" stroke="#A0AEC0" />
                            <YAxis stroke="#A0AEC0" tickFormatter={(val) => formatCurrency(val)} />
                            <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} formatter={(value: number) => formatCurrency(value)} />
                            <Legend />
                            {keys.map((key, i) => <Line key={key} type="monotone" dataKey={key} stroke={colors[i % colors.length]} dot={false} />)}
                        </LineChart>
                    </ResponsiveContainer>
                );
            case 'portfolio_composition':
                return <PortfolioDonutChart data={data.composition} />;
            case 'market_sentiment_analysis':
                return <MarketSentimentGauge data={data} />;
            case 'hft_simulation_dashboard':
                return <HFTDashboard data={data} />;
            default:
                return <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>;
        }
    };

    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg my-2 overflow-hidden">
            {title && <h3 className="text-md font-semibold p-3 bg-gray-900/70 border-b border-gray-700">{title}</h3>}
            <div className="p-3">{renderContent()}</div>
        </div>
    );
};

const MessageRenderer: React.FC<{ msg: EnhancedMessage }> = ({ msg }) => {
    const isModel = msg.role === 'model';
    const bgColor = isModel ? 'bg-gray-800' : 'bg-blue-900/50';
    const alignment = isModel ? 'justify-start' : 'justify-end';
    const icon = isModel ? <FaRobot className="text-cyan-400" /> : <FaUser className="text-blue-400" />;

    return (
        <div className={`flex items-start gap-3 my-4 ${alignment}`}>
            {isModel && <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-700 flex items-center justify-center">{icon}</div>}
            <div className={`w-full max-w-2xl p-4 rounded-lg ${bgColor}`}>
                {msg.parts.map((part, index) => {
                    if ('text' in part) {
                        return <p key={index} className="whitespace-pre-wrap">{part.text}</p>;
                    }
                    if ('richContent' in part) {
                        return <RichContentRenderer key={index} content={part.richContent} />;
                    }
                    if ('functionCall' in part) {
                        return (
                            <div key={index} className="my-2 p-2 bg-gray-700/50 rounded-md text-xs font-mono">
                                <div className="flex items-center gap-2 text-yellow-400">
                                    <FaCogs />
                                    <span>Executing Tool: <strong>{part.functionCall.name}</strong></span>
                                </div>
                                <pre className="mt-1 text-gray-400 text-xs overflow-x-auto">{JSON.stringify(part.functionCall.args, null, 2)}</pre>
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
            {!isModel && <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-700 flex items-center justify-center">{icon}</div>}
        </div>
    );
};

const ChatInputBar: React.FC<{ onSend: (text: string) => void; isLoading: boolean }> = ({ onSend, isLoading }) => {
    const [input, setInput] = useState('');
    const suggestions = ["Summarize my finances", "Analyze my portfolio", "Simulate my investment growth for 20 years", "What's the market sentiment on tech stocks?"];

    const handleSend = () => {
        if (input.trim() && !isLoading) {
            onSend(input.trim());
            setInput('');
        }
    };

    return (
        <div className="p-4 bg-gray-900 border-t border-gray-700">
            <div className="flex gap-2 mb-2">
                {suggestions.map(s => (
                    <button key={s} onClick={() => setInput(s)} className="px-3 py-1 bg-gray-700 text-xs text-gray-300 rounded-full hover:bg-gray-600 transition-colors disabled:opacity-50" disabled={isLoading}>
                        {s}
                    </button>
                ))}
            </div>
            <div className="flex items-center gap-3">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask Aetherius about your finances..."
                    className="flex-grow bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    disabled={isLoading}
                />
                <button onClick={handleSend} disabled={isLoading} className="p-3 bg-cyan-600 rounded-lg hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
                    {isLoading ? <FaSync className="animate-spin" /> : <FaPaperPlane />}
                </button>
            </div>
        </div>
    );
};

const SimulationInputForm: React.FC<{
    params: Record<string, any>;
    onUpdate: (params: Record<string, any>) => void;
    onSubmit: () => void;
}> = ({ params, onUpdate, onSubmit }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({ [e.target.name]: e.target.value });
    };

    return (
        <Card title="Scenario Simulator" icon={<FaChartLine />}>
            <div className="space-y-4 p-4">
                <div>
                    <label className="text-xs text-gray-400">Monthly Contribution</label>
                    <input type="number" name="additionalMonthlyContribution" value={params.additionalMonthlyContribution} onChange={handleChange} className="w-full bg-gray-700 rounded p-2 mt-1 text-white" />
                </div>
                <div>
                    <label className="text-xs text-gray-400">Years</label>
                    <input type="number" name="years" value={params.years} onChange={handleChange} className="w-full bg-gray-700 rounded p-2 mt-1 text-white" />
                </div>
                <div>
                    <label className="text-xs text-gray-400">Annual Return (%)</label>
                    <input type="number" name="annualReturnRate" value={params.annualReturnRate} onChange={handleChange} className="w-full bg-gray-700 rounded p-2 mt-1 text-white" />
                </div>
                <button onClick={onSubmit} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    Run Simulation
                </button>
            </div>
        </Card>
    );
};

// --- MAIN COMPONENT ---

const AIAdvisorView: React.FC<{ previousView: View | null }> = ({ previousView }) => {
    const [state, dispatch] = useReducer(chatReducer, initialChatState);
    const toolImplementations = useToolImplementations(dispatch);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [genAI, setGenAI] = useState<GoogleGenAI | null>(null);
    const [chat, setChat] = useState<Chat | null>(null);

    useEffect(() => {
        const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (key) {
            setApiKey(key);
            const ai = new GoogleGenAI(key);
            setGenAI(ai);
        } else {
            dispatch({ type: 'SET_ERROR', payload: "API Key for Google Gemini is not configured." });
        }
    }, []);

    useEffect(() => {
        if (genAI) {
            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-flash",
                systemInstruction: DETAILED_SYSTEM_INSTRUCTION,
                tools: [{
                    functionDeclarations: [
                        { name: "getFinancialSummary", description: "Get a high-level summary of the user's financial health." },
                        { name: "getPortfolioComposition", description: "Get the breakdown of the user's investment portfolio by asset category." },
                        { name: "simulateInvestmentGrowth", description: "Simulate investment growth over time.", parameters: { type: Type.OBJECT, properties: { additionalMonthlyContribution: { type: Type.NUMBER }, years: { type: Type.NUMBER }, annualReturnRate: { type: Type.NUMBER }, volatility: { type: Type.NUMBER } } } },
                        { name: "analyzeMarketSentiment", description: "Analyze market sentiment for a specific topic or stock.", parameters: { type: Type.OBJECT, properties: { topic: { type: Type.STRING } }, required: ['topic'] } },
                        { name: "runHFTAlgorithm", description: "Run a simulated high-frequency trading algorithm.", parameters: { type: Type.OBJECT, properties: { strategy: { type: Type.STRING, enum: ['arbitrage', 'market_making', 'momentum'] }, durationSeconds: { type: Type.NUMBER } }, required: ['strategy', 'durationSeconds'] } },
                        { name: "createFinancialGoal", description: "Create a new financial goal for the user.", parameters: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, targetAmount: { type: Type.NUMBER }, deadline: { type: Type.STRING }, priority: { type: Type.STRING, enum: ['high', 'medium', 'low'] } }, required: ['name', 'targetAmount', 'deadline', 'priority'] } },
                    ]
                }]
            });
            const newChat = model.startChat({
                history: state.messages.map(msg => ({
                    role: msg.role === 'system_tool' ? 'model' : msg.role,
                    parts: msg.parts.map(p => {
                        if ('functionResponse' in p) return { functionResponse: p.functionResponse };
                        if ('functionCall' in p) return { functionCall: p.functionCall };
                        return { text: (p as { text: string }).text };
                    })
                }))
            });
            setChat(newChat);
        }
    }, [genAI, state.conversationId]);

    useEffect(() => {
        chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
    }, [state.messages]);

    const handleSendMessage = useCallback(async (messageText: string) => {
        if (!chat) {
            dispatch({ type: 'SET_ERROR', payload: "Chat is not initialized." });
            return;
        }

        dispatch({ type: 'START_MESSAGE_SEND' });
        const userMessage: EnhancedMessage = {
            id: `msg_${Date.now()}`,
            role: 'user',
            parts: [{ text: messageText }],
            timestamp: new Date(),
        };
        dispatch({ type: 'ADD_USER_MESSAGE', payload: userMessage });

        try {
            let result = await chat.sendMessage(messageText);

            while (true) {
                const { response } = result;
                const functionCalls = response.functionCalls();

                if (!functionCalls || functionCalls.length === 0) {
                    const modelResponse: EnhancedMessage = {
                        id: `msg_${Date.now()}`,
                        role: 'model',
                        parts: [{ text: response.text() }],
                        timestamp: new Date(),
                    };
                    dispatch({ type: 'ADD_MODEL_RESPONSE', payload: modelResponse });
                    break;
                }

                const toolCalls: ToolCallPart[] = functionCalls.map(fc => ({ functionCall: { name: fc.name, args: fc.args } }));
                const modelMessageWithToolCalls: EnhancedMessage = {
                    id: `msg_${Date.now()}_toolcall`,
                    role: 'model',
                    parts: toolCalls,
                    timestamp: new Date(),
                };
                dispatch({ type: 'ADD_MODEL_RESPONSE', payload: modelMessageWithToolCalls });

                const toolResults: ToolResultPart[] = [];
                for (const call of functionCalls) {
                    dispatch({ type: 'START_TOOL_EXECUTION', payload: call.name });
                    const tool = (toolImplementations as any)[call.name];
                    if (tool) {
                        const output = await tool(call.args);
                        toolResults.push({
                            functionResponse: {
                                name: call.name,
                                response: { content: JSON.stringify(output) },
                            },
                        });
                    } else {
                        toolResults.push({
                            functionResponse: {
                                name: call.name,
                                response: { content: JSON.stringify({ error: `Tool ${call.name} not found.` }) },
                            },
                        });
                    }
                    dispatch({ type: 'END_TOOL_EXECUTION' });
                }

                result = await chat.sendMessage(toolResults.map(tr => ({ toolResponse: tr })));
            }
        } catch (e: any) {
            console.error(e);
            dispatch({ type: 'SET_ERROR', payload: e.message || "An unknown error occurred." });
        }
    }, [chat, toolImplementations]);

    const handleSimulationSubmit = () => {
        const { additionalMonthlyContribution, years, annualReturnRate } = state.simulationParameters;
        const prompt = `Simulate my investment growth over ${years} years with an additional monthly contribution of ${additionalMonthlyContribution} and an expected annual return of ${annualReturnRate}%.`;
        handleSendMessage(prompt);
    };

    return (
        <div className="h-full flex flex-col bg-gray-900 text-white font-sans">
            <header className="flex-shrink-0 p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900/80 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <FaBrain className="text-2xl text-cyan-400" />
                    <div>
                        <h1 className="text-xl font-bold">Aetherius Financial Intelligence</h1>
                        <p className="text-xs text-gray-400">Quantum-Powered Advisory & Simulation Engine</p>
                    </div>
                </div>
                <button onClick={() => dispatch({ type: 'RESET_CHAT' })} className="flex items-center gap-2 px-3 py-2 text-xs bg-gray-700 hover:bg-gray-600 rounded-md transition-colors">
                    <FaRedo /> New Session
                </button>
            </header>

            <div className="flex-grow flex overflow-hidden">
                <main className="flex-grow flex flex-col">
                    <div ref={chatContainerRef} className="flex-grow p-6 overflow-y-auto">
                        {state.messages.length === 0 && (
                            <div className="text-center text-gray-500 h-full flex flex-col justify-center items-center">
                                <FaBrain className="text-6xl mb-4" />
                                <h2 className="text-2xl font-bold text-gray-300">Welcome to Aetherius</h2>
                                <p>Your session is encrypted and ready. How can I assist you today?</p>
                            </div>
                        )}
                        {state.messages.map(msg => <MessageRenderer key={msg.id} msg={msg} />)}
                        {state.isLoading && (
                            <div className="flex items-start gap-3 my-4 justify-start">
                                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-700 flex items-center justify-center"><FaRobot className="text-cyan-400" /></div>
                                <div className="w-full max-w-2xl p-4 rounded-lg bg-gray-800">
                                    <div className="flex items-center gap-2">
                                        <FaSync className="animate-spin" />
                                        <span>Aetherius is thinking...</span>
                                    </div>
                                    {state.isToolExecuting && (
                                        <div className="mt-2 text-xs text-yellow-400 font-mono flex items-center gap-2">
                                            <FaCogs />
                                            <span>Executing: {state.toolExecutionName}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {state.error && (
                            <div className="p-4 bg-red-900/50 border border-red-500 text-red-300 rounded-lg flex items-center gap-3">
                                <FaExclamationCircle />
                                <div>
                                    <strong>Error:</strong> {state.error}
                                    <button onClick={() => dispatch({ type: 'CLEAR_ERROR' })} className="ml-4 text-xs underline">Dismiss</button>
                                </div>
                            </div>
                        )}
                    </div>
                    <ChatInputBar onSend={handleSendMessage} isLoading={state.isLoading} />
                </main>
                <aside className="w-96 flex-shrink-0 border-l border-gray-700 bg-gray-900/50 overflow-y-auto p-4 space-y-6">
                    <SimulationInputForm
                        params={state.simulationParameters}
                        onUpdate={(p) => dispatch({ type: 'UPDATE_SIMULATION_PARAMS', payload: p })}
                        onSubmit={handleSimulationSubmit}
                    />
                    {/* Additional sidebar components can be added here */}
                </aside>
            </div>
        </div>
    );
};

export default AIAdvisorView;