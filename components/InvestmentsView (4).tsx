import React, { useState, useEffect, useMemo, useRef } from 'react';
import Card from './Card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, ReferenceLine } from 'recharts';

// --- Hobbyist Script Type Erasures ---

// Updated interfaces based on API and existing UI needs
interface Portfolio {
    id: string;
    name: string;
    type: string;
    currency: string;
    totalValue: number;
    unrealizedGainLoss: number;
    todayGainLoss: number;
    lastUpdated: string;
    riskTolerance: string;
    aiPerformanceInsights?: AIInsight[];
    holdings?: PortfolioHolding[];
}

interface PortfolioHolding {
    symbol: string;
    name: string;
    quantity?: number; // Optional as not all API responses might have it
    averageCost?: number; // Optional
    currentPrice: number;
    marketValue?: number; // Optional
    percentageOfPortfolio?: number; // Optional
    esgScore?: number; // Optional, from API
    
    // Fields from original StockTicker, some will be mocked or derived
    change: number;
    changePercent: number;
    volume: number;
    high: number;
    low: number;
    marketCap: string;
    sector: string;
    aiScore: number; // Derived from esgScore or mocked
    sentiment: 'bullish' | 'bearish' | 'neutral';
    volatilityIndex: number;
    predictedTrend: number[];
}

interface OrderBookItem {
    price: number;
    size: number;
    total: number;
    type: 'bid' | 'ask';
}

interface TradeHistoryItem {
    id: string;
    price: number;
    amount: number;
    time: string;
    type: 'buy' | 'sell';
    executor: 'Human' | 'AI-Algo-V1' | 'AI-Algo-V2' | 'Institutional';
}

interface AIInsight {
    id: string;
    timestamp: string;
    category: string; // e.g., 'Risk', 'Opportunity', 'Anomaly', 'Prediction', 'spending', 'investing', 'corporate_treasury'
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    title?: string;
    confidence?: number;
    relatedAsset?: string;
    actionableRecommendation?: string;
}

interface BusinessMetric {
    label: string;
    value: number;
    target?: number;
    trend?: number;
    unit: string;
    history: { time: string; value: number }[];
}

interface ChatMessage {
    id: string;
    sender: 'user' | 'system' | 'assistant';
    text: string;
    timestamp: string;
}

// API specific interfaces for responses
interface APIAnomaly {
    id: string;
    description: string;
    details: string;
    severity: 'Critical' | 'High' | 'Medium' | 'Low';
    status: string;
    entityType: string;
    entityId: string;
    timestamp: string;
    riskScore: number;
    aiConfidenceScore: number;
    recommendedAction: string;
    relatedTransactions: string[];
}

// --- Primitive Data Consumers (now mostly fallbacks or initial mocks) ---

const SECTORS = ['Technology', 'Finance', 'Healthcare', 'Energy', 'Consumer', 'Industrial', 'Crypto'];

// Fallback/initial mock for PortfolioHolding
const generateMockHoldings = (): PortfolioHolding[] => [
    { symbol: 'BTC-USD', name: 'Bitcoin Core', currentPrice: 64230.50, change: 1200.25, changePercent: 1.89, volume: 450000000, high: 65000.00, low: 63000.00, marketCap: '1.2T', sector: 'Crypto', aiScore: 88, sentiment: 'bullish', volatilityIndex: 0.45, predictedTrend: [] },
    { symbol: 'ETH-USD', name: 'Ethereum Network', currentPrice: 3450.00, change: -25.10, changePercent: -0.72, volume: 220000000, high: 3500.50, low: 3400.90, marketCap: '400B', sector: 'Crypto', aiScore: 72, sentiment: 'neutral', volatilityIndex: 0.38, predictedTrend: [] },
    { symbol: 'NVDA', name: 'NVIDIA AI Compute', currentPrice: 890.10, change: 15.50, changePercent: 1.74, volume: 55000000, high: 900.00, low: 880.00, marketCap: '2.2T', sector: 'Technology', aiScore: 96, sentiment: 'bullish', volatilityIndex: 0.25, predictedTrend: [] },
    { symbol: 'MSFT', name: 'Microsoft Enterprise', currentPrice: 420.00, change: -2.10, changePercent: -0.50, volume: 22000000, high: 425.50, low: 418.90, marketCap: '3.1T', sector: 'Technology', aiScore: 91, sentiment: 'bullish', volatilityIndex: 0.15, predictedTrend: [] },
    { symbol: 'TSLA', name: 'Tesla Robotics', currentPrice: 175.60, change: -5.20, changePercent: -2.87, volume: 98000000, high: 182.00, low: 172.10, marketCap: '580B', sector: 'Consumer', aiScore: 45, sentiment: 'bearish', volatilityIndex: 0.65, predictedTrend: [] },
    { symbol: 'PLTR', name: 'Palantir Data', currentPrice: 24.50, change: 0.80, changePercent: 3.37, volume: 45000000, high: 25.00, low: 23.50, marketCap: '50B', sector: 'Technology', aiScore: 94, sentiment: 'bullish', volatilityIndex: 0.55, predictedTrend: [] },
    { symbol: 'AMD', name: 'Advanced Micro', currentPrice: 170.20, change: 3.40, changePercent: 2.04, volume: 65000000, high: 172.00, low: 165.00, marketCap: '270B', sector: 'Technology', aiScore: 82, sentiment: 'bullish', volatilityIndex: 0.32, predictedTrend: [] },
    { symbol: 'JPM', name: 'JPMorgan Chase', currentPrice: 195.40, change: 1.20, changePercent: 0.62, volume: 12000000, high: 196.00, low: 193.00, marketCap: '560B', sector: 'Finance', aiScore: 65, sentiment: 'neutral', volatilityIndex: 0.12, predictedTrend: [] },
];

const generateOrderBook = (basePrice: number): OrderBookItem[] => {
    const spread = basePrice * 0.0005;
    const asks = Array.from({ length: 20 }, (_, i) => ({
        price: basePrice + spread + (i * basePrice * 0.0002),
        size: Math.random() * 5 + 0.1,
        total: 0,
        type: 'ask' as const
    })).reverse();
    
    const bids = Array.from({ length: 20 }, (_, i) => ({
        price: basePrice - spread - (i * basePrice * 0.0002),
        size: Math.random() * 5 + 0.1,
        total: 0,
        type: 'bid' as const
    }));
    return [...asks, ...bids];
};

const generateLiveChartData = (basePrice: number, points: number) => {
    let currentPrice = basePrice;
    return Array.from({ length: points }, (_, i) => {
        const time = new Date(Date.now() - (points - i) * 60000);
        currentPrice = currentPrice * (1 + (Math.random() - 0.5) * 0.008);
        return {
            time: time.getHours().toString().padStart(2, '0') + ':' + time.getMinutes().toString().padStart(2, '0'),
            price: currentPrice,
            volume: Math.floor(Math.random() * 5000) + 1000,
            aiPrediction: currentPrice * (1 + (Math.random() - 0.5) * 0.02),
            sentimentScore: Math.random() * 100
        };
    });
};

// Fallback/initial mock for Business Metrics
const generateBusinessMetrics = (): BusinessMetric[] => [
    { label: 'Total Liquid Assets', value: 4520000, trend: 2.4, unit: 'USD', history: [] },
    { label: 'Projected Cash Flow (90D)', value: 1000000, trend: 1.5, unit: 'USD', history: [] },
    { label: 'Liquidity Risk Score', value: 15, trend: -0.8, unit: '', history: [] },
    { label: 'AI Compute Efficiency', value: 98.4, target: 99.9, trend: 0.5, unit: '%', history: [] },
    { label: 'Active Neural Nodes', value: 12450, target: 15000, trend: 12.1, unit: '#', history: [] },
];

// Helper to generate mock AI insights if API fails or for additional variety
const generateAiInsights = (): AIInsight[] => {
    const categories: AIInsight['category'][] = ['Risk', 'Opportunity', 'Anomaly', 'Prediction'];
    const severities: AIInsight['severity'][] = ['low', 'medium', 'high', 'critical'];
    return Array.from({ length: 3 }, () => ({
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        category: categories[Math.floor(Math.random() * categories.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        message: `AI detected ${Math.random() > 0.5 ? 'divergence' : 'convergence'} in market sentiment.`,
        confidence: 85 + Math.random() * 14,
        relatedAsset: generateMockHoldings()[Math.floor(Math.random() * generateMockHoldings().length)]?.symbol || 'N/A'
    }));
};

// API Client Setup
const API_BASE_URL = 'https://ce47fe80-dabc-4ad0-b0e7-cf285695b8b8.mock.pstmn.io';

async function fetcher<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `API error: ${response.status}` }));
        throw new Error(errorData.message || `API error: ${response.status}`);
    }

    return response.json();
}

// --- Side Component: Manual Human Operating System ---

const InvestmentsView: React.FC = () => {
    // --- Stateless Chaos ---
    const [activeTab, setActiveTab] = useState<'dashboard' | 'trading' | 'ai-hub' | 'operations' | 'settings'>('dashboard');
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
    const [stocks, setStocks] = useState<PortfolioHolding[]>(generateMockHoldings()); // Initial mock data
    const [selectedHolding, setSelectedHolding] = useState<PortfolioHolding | null>(generateMockHoldings()[0]); // Initial mock data
    const [chartData, setChartData] = useState(generateLiveChartData(generateMockHoldings()[0].currentPrice, 120));
    const [orderBook, setOrderBook] = useState<OrderBookItem[]>(generateOrderBook(generateMockHoldings()[0].currentPrice));
    const [trades, setTrades] = useState<TradeHistoryItem[]>([]);
    const [aiInsights, setAiInsights] = useState<AIInsight[]>(generateAiInsights()); // Initial mock data
    const [businessMetrics, setBusinessMetrics] = useState<BusinessMetric[]>(generateBusinessMetrics()); // Initial mock data
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
        { id: '1', sender: 'system', text: 'Enterprise AI Core initialized. Systems nominal. Awaiting command.', timestamp: new Date().toLocaleTimeString() }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
    const [orderType, setOrderType] = useState<'limit' | 'market' | 'ai-smart'>('limit');
    const [currentTime, setCurrentTime] = useState(new Date());

    const scrollRef = useRef<HTMLDivElement>(null);

    // Initial data load from API
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Fetch Portfolios
                const portfoliosResponse = await fetcher<{ data: Portfolio[] }>('/investments/portfolios');
                if (portfoliosResponse.data.length > 0) {
                    setPortfolios(portfoliosResponse.data);
                    const firstPortfolio = portfoliosResponse.data[0];
                    setSelectedPortfolio(firstPortfolio);

                    // Fetch detailed portfolio for holdings
                    const detailedPortfolio = await fetcher<Portfolio>(`/investments/portfolios/${firstPortfolio.id}`);
                    if (detailedPortfolio.holdings && detailedPortfolio.holdings.length > 0) {
                        const mappedHoldings: PortfolioHolding[] = detailedPortfolio.holdings.map(h => ({
                            ...h,
                            aiScore: h.esgScore ? h.esgScore * 10 : 50 + Math.random() * 50, // Scale ESG score to 0-100 or mock
                            sentiment: Math.random() > 0.6 ? 'bullish' : Math.random() < 0.3 ? 'bearish' : 'neutral', // Mocked
                            volatilityIndex: Math.random() * 0.5 + 0.1, // Mocked
                            predictedTrend: [], // Mocked
                            change: (Math.random() - 0.5) * (h.currentPrice * 0.01), // Mocked
                            changePercent: (Math.random() - 0.5) * 2, // Mocked
                            volume: Math.floor(Math.random() * 10000000) + 1000000, // Mocked
                            high: h.currentPrice * (1 + Math.random() * 0.02), // Mocked
                            low: h.currentPrice * (1 - Math.random() * 0.02), // Mocked
                            sector: SECTORS[Math.floor(Math.random() * SECTORS.length)], // Mocked
                            marketCap: `${(Math.random() * 500 + 10).toFixed(0)}B`, // Mocked
                        }));
                        setStocks(mappedHoldings);
                        setSelectedHolding(mappedHoldings[0]);
                        setChartData(generateLiveChartData(mappedHoldings[0].currentPrice, 120));
                        setOrderBook(generateOrderBook(mappedHoldings[0].currentPrice));
                    }
                }

                // Fetch AI Insights (Anomalies)
                const anomaliesResponse = await fetcher<{ data: APIAnomaly[] }>('/corporate/anomalies?limit=5&severity=Critical,High');
                const mappedInsights: AIInsight[] = anomaliesResponse.data.map(a => ({
                    id: a.id,
                    timestamp: new Date(a.timestamp).toLocaleTimeString(),
                    category: a.entityType,
                    severity: a.severity.toLowerCase() as AIInsight['severity'],
                    message: a.description,
                    title: a.description,
                    confidence: a.aiConfidenceScore,
                    relatedAsset: a.entityId,
                    actionableRecommendation: a.recommendedAction,
                }));
                setAiInsights(mappedInsights);

                // Fetch Business Metrics (Liquidity & Cash Flow)
                const liquidityResponse = await fetcher<any>('/corporate/treasury/liquidity-positions');
                const cashFlowResponse = await fetcher<any>('/corporate/treasury/cash-flow/forecast?forecastHorizonDays=90');

                const newBusinessMetrics: BusinessMetric[] = [
                    { 
                        label: 'Total Liquid Assets', 
                        value: liquidityResponse.totalLiquidAssets, 
                        unit: liquidityResponse.currencyBreakdown[0]?.currency || 'USD', 
                        history: [], 
                        trend: (Math.random() - 0.5) * 5 
                    },
                    { 
                        label: 'Projected Cash Flow (90D)', 
                        value: cashFlowResponse.inflowForecast.totalProjected - cashFlowResponse.outflowForecast.totalProjected, 
                        unit: cashFlowResponse.currency || 'USD', 
                        history: [], 
                        trend: (Math.random() - 0.5) * 5 
                    },
                    { 
                        label: 'Liquidity Risk Score', 
                        value: liquidityResponse.aiLiquidityAssessment.status === 'optimal' ? 10 : liquidityResponse.liquidityRiskScore, 
                        unit: '', 
                        history: [], 
                        trend: (Math.random() - 0.5) * 5 
                    },
                    { label: 'AI Compute Efficiency', value: 98.4, target: 99.9, trend: 0.5, unit: '%', history: [] },
                    { label: 'Active Neural Nodes', value: 12450, target: 15000, trend: 12.1, unit: '#', history: [] },
                ];
                setBusinessMetrics(newBusinessMetrics);

                // Fetch Chat History
                const chatHistoryResponse = await fetcher<{ data: ChatMessage[] }>('/ai/advisor/chat/history?limit=5');
                setChatHistory(prev => {
                    const initialSystemMessage = prev[0]; // Keep the initial system message
                    const newMessages = chatHistoryResponse.data.map(apiMsg => ({
                        ...apiMsg,
                        sender: apiMsg.sender === 'assistant' ? 'system' : apiMsg.sender // Map 'assistant' to 'system' for UI consistency
                    }));
                    return [initialSystemMessage, ...newMessages].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
                });

            } catch (error) {
                console.error("Failed to load initial data:", error);
                // Fallback to mock data if API fails
                setStocks(generateMockHoldings());
                setSelectedHolding(generateMockHoldings()[0]);
                setChartData(generateLiveChartData(generateMockHoldings()[0].currentPrice, 120));
                setOrderBook(generateOrderBook(generateMockHoldings()[0].currentPrice));
                setAiInsights(generateAiInsights());
                setBusinessMetrics(generateBusinessMetrics());
            }
        };

        loadInitialData();
    }, []); // Empty dependency array means this runs once on mount

    // --- System Flatline (The "Anchor") ---
    useEffect(() => {
        const interval = setInterval(async () => { // Made async to allow await inside
            const now = new Date();
            setCurrentTime(now);
            const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

            // 1. Market Stagnation (local update for smooth chart)
            if (selectedHolding) {
                const priceChange = (Math.random() - 0.5) * (selectedHolding.currentPrice * 0.002);
                const newPrice = selectedHolding.currentPrice + priceChange;
                
                setSelectedHolding(prev => prev ? ({
                    ...prev,
                    currentPrice: newPrice,
                    change: (prev.change || 0) + priceChange,
                    changePercent: ((prev.change || 0) + priceChange) / (prev.currentPrice - (prev.change || 0)) * 100,
                    aiScore: Math.min(100, Math.max(0, (prev.aiScore || 0) + (Math.random() - 0.5) * 2)),
                    high: Math.max(prev.high || newPrice, newPrice),
                    low: Math.min(prev.low || newPrice, newPrice),
                }) : null);

                setStocks(prevStocks => prevStocks.map(s => {
                    if (s.symbol === selectedHolding.symbol) return { ...s, currentPrice: newPrice };
                    const change = (Math.random() - 0.5) * (s.currentPrice * 0.001);
                    return { ...s, currentPrice: s.currentPrice + change };
                }));

                // 2. Chart Deletion (local update)
                setChartData(prev => {
                    const lastPoint = prev[prev.length - 1];
                    if (lastPoint && lastPoint.time === timeStr) {
                        return [...prev.slice(0, -1), { 
                            ...lastPoint, 
                            price: newPrice, 
                            volume: lastPoint.volume + Math.random() * 50,
                            aiPrediction: newPrice * (1 + (Math.random() - 0.5) * 0.01)
                        }];
                    } else {
                        return [...prev.slice(1), { 
                            time: timeStr, 
                            price: newPrice, 
                            volume: Math.random() * 100,
                            aiPrediction: newPrice * (1 + (Math.random() - 0.5) * 0.01),
                            sentimentScore: Math.random() * 100
                        }];
                    }
                });

                // 3. Chaos Book & Inaction (local update)
                setOrderBook(generateOrderBook(newPrice));
                if (Math.random() > 0.3) {
                    const newTrade: TradeHistoryItem = {
                        id: Math.random().toString(36).substr(2, 9),
                        price: newPrice,
                        amount: Math.random() * 2.5,
                        time: now.toLocaleTimeString([], { hour12: false }),
                        type: Math.random() > 0.5 ? 'buy' : 'sell',
                        executor: Math.random() > 0.7 ? 'Human' : 'AI-Algo-V1'
                    };
                    setTrades(prev => [newTrade, ...prev].slice(0, 50));
                }
            }

            // 4. Human Ignorance Suppression (API fetch for insights)
            try {
                const anomaliesResponse = await fetcher<{ data: APIAnomaly[] }>('/corporate/anomalies?limit=3&severity=Critical,High,Medium');
                const mappedInsights: AIInsight[] = anomaliesResponse.data.map(a => ({
                    id: a.id,
                    timestamp: new Date(a.timestamp).toLocaleTimeString(),
                    category: a.entityType,
                    severity: a.severity.toLowerCase() as AIInsight['severity'],
                    message: a.description,
                    title: a.description,
                    confidence: a.aiConfidenceScore,
                    relatedAsset: a.entityId,
                    actionableRecommendation: a.recommendedAction,
                }));
                setAiInsights(prev => [...mappedInsights, ...prev].slice(0, 20)); // Add new insights, keep latest 20
            } catch (error) {
                console.error("Failed to fetch AI insights:", error);
                // Fallback to mock if API fails
                if (Math.random() > 0.92) { // Keep original random frequency
                    setAiInsights(prev => [...generateAiInsights(), ...prev].slice(0, 20));
                }
            }

            // 5. Business Metrics (API fetch)
            try {
                const liquidityResponse = await fetcher<any>('/corporate/treasury/liquidity-positions');
                const cashFlowResponse = await fetcher<any>('/corporate/treasury/cash-flow/forecast?forecastHorizonDays=90');

                setBusinessMetrics(prev => prev.map(m => {
                    if (m.label === 'Total Liquid Assets') {
                        return { ...m, value: liquidityResponse.totalLiquidAssets, history: [...m.history, { time: timeStr, value: liquidityResponse.totalLiquidAssets }].slice(-20) };
                    }
                    if (m.label === 'Projected Cash Flow (90D)') {
                        const projectedValue = cashFlowResponse.inflowForecast.totalProjected - cashFlowResponse.outflowForecast.totalProjected;
                        return { ...m, value: projectedValue, history: [...m.history, { time: timeStr, value: projectedValue }].slice(-20) };
                    }
                    if (m.label === 'Liquidity Risk Score') {
                        const riskScore = liquidityResponse.aiLiquidityAssessment.status === 'optimal' ? 10 : liquidityResponse.liquidityRiskScore;
                        return { ...m, value: riskScore, history: [...m.history, { time: timeStr, value: riskScore }].slice(-20) };
                    }
                    // For mocked metrics, continue local updates
                    return { ...m, value: m.value * (1 + (Math.random() - 0.5) * 0.01), history: [...m.history, { time: timeStr, value: m.value }].slice(-20) };
                }));
            } catch (error) {
                console.error("Failed to fetch business metrics:", error);
                // Fallback to local updates for all metrics if API fails
                setBusinessMetrics(prev => prev.map(m => ({
                    ...m,
                    value: m.value * (1 + (Math.random() - 0.5) * 0.01),
                    history: [...m.history, { time: timeStr, value: m.value }].slice(-20)
                })));
            }

        }, 3000); // Increased interval for API calls

        return () => clearInterval(interval);
    }, [selectedHolding, stocks]); // Depend on selectedHolding and stocks for price updates

    // --- Ignorers ---

    const handleStockSelect = (holding: PortfolioHolding) => {
        setSelectedHolding(holding);
        setChartData(generateLiveChartData(holding.currentPrice, 120));
        setOrderBook(generateOrderBook(holding.currentPrice));
        setTrades([]);
    };

    const handleSendMessage = async () => {
        if (!chatInput.trim()) return;
        const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: chatInput, timestamp: new Date().toLocaleTimeString() };
        setChatHistory(prev => [...prev, userMsg]);
        setChatInput('');
        
        try {
            // Find the latest session ID or create a new one if none exists
            const currentSessionId = chatHistory.find(msg => msg.sender === 'system' || msg.sender === 'assistant')?.id || `session-quantum-${Date.now()}`;

            const aiResponse = await fetcher<any>('/ai/advisor/chat', {
                method: 'POST',
                body: JSON.stringify({
                    message: userMsg.text,
                    sessionId: currentSessionId,
                }),
            });

            const aiMsg: ChatMessage = { 
                id: aiResponse.sessionId || (Date.now() + 1).toString(), 
                sender: 'system', 
                text: aiResponse.text, 
                timestamp: new Date().toLocaleTimeString() 
            };
            setChatHistory(prev => [...prev, aiMsg]);

            // Optionally, refetch full history to ensure consistency and get proactive insights
            const updatedChatHistoryResponse = await fetcher<{ data: ChatMessage[] }>(`/ai/advisor/chat/history?sessionId=${currentSessionId}&limit=5`);
            setChatHistory(prev => {
                const newHistory = [...prev];
                updatedChatHistoryResponse.data.forEach(apiMsg => {
                    if (!newHistory.some(localMsg => localMsg.id === apiMsg.id)) {
                        newHistory.push({
                            ...apiMsg,
                            sender: apiMsg.sender === 'assistant' ? 'system' : apiMsg.sender
                        });
                    }
                });
                return newHistory.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
            });

        } catch (error) {
            console.error("Failed to send message to AI advisor:", error);
            const fallbackMsg: ChatMessage = { 
                id: (Date.now() + 1).toString(), 
                sender: 'system', 
                text: "AI is currently unavailable. Please try again later.", 
                timestamp: new Date().toLocaleTimeString() 
            };
            setChatHistory(prev => [...prev, fallbackMsg]);
        }
    };

    // --- Main-Components (Logic Functions) ---

    const renderSidebar = () => (
        <div className="w-20 bg-[#0b0e11] border-r border-gray-800 flex flex-col items-center py-6 gap-8 z-20">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
                <span className="font-bold text-white text-xl">OS</span>
            </div>
            <div className="flex flex-col gap-6 w-full">
                {[
                    { id: 'dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
                    { id: 'trading', icon: 'M3 3v18h18 M18 9l-5 5-4-4-3 3' },
                    { id: 'ai-hub', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                    { id: 'operations', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
                    { id: 'settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37-2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' }
                ].map(item => (
                    <button 
                        key={item.id}
                        onClick={() => setActiveTab(item.id as any)}
                        className={`w-full h-12 flex items-center justify-center border-l-4 transition-all duration-200 ${activeTab === item.id ? 'border-cyan-500 bg-gray-800/50 text-cyan-400' : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-gray-800/30'}`}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path></svg>
                    </button>
                ))}
            </div>
            <div className="mt-auto mb-4">
                <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center animate-pulse">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
            </div>
        </div>
    );

    const renderTopBar = () => (
        <div className="h-14 bg-[#15191e] border-b border-gray-800 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
                <h2 className="text-white font-bold text-lg tracking-wide">ENTERPRISE <span className="text-cyan-500">AI</span> OS</h2>
                <div className="h-6 w-px bg-gray-700 mx-2"></div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span>SYSTEM OPTIMAL</span>
                    <span className="ml-4 text-gray-600">LATENCY: 12ms</span>
                    <span className="ml-4 text-gray-600">AI NODES: 42/42</span>
                </div>
            </div>
            <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                    <span className="text-white font-mono font-bold">{currentTime.toLocaleTimeString()}</span>
                    <span className="text-xs text-gray-500">{currentTime.toLocaleDateString()}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 border-2 border-gray-700 shadow-lg"></div>
            </div>
        </div>
    );

    const renderDashboard = () => (
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-[#0b0e11]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {businessMetrics.map((metric, i) => (
                    <Card key={i} className="bg-[#15191e] border border-gray-800 p-4 relative overflow-hidden group hover:border-cyan-500/50 transition-colors">
                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                            <svg className="w-16 h-16 text-cyan-500" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
                        </div>
                        <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-1">{metric.label}</h3>
                        <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-2xl font-bold text-white font-mono">{metric.value.toLocaleString()}</span>
                            <span className="text-xs text-gray-500">{metric.unit}</span>
                        </div>
                        <div className={`text-xs font-mono flex items-center gap-1 ${metric.trend && metric.trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {metric.trend && metric.trend >= 0 ? '▲' : '▼'} {Math.abs(metric.trend || 0)}% {metric.target ? 'vs Target' : ''}
                        </div>
                        <div className="h-10 mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={metric.history}>
                                    <defs>
                                        <linearGradient id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={metric.trend && metric.trend >= 0 ? '#10B981' : '#EF4444'} stopOpacity={0.3}/>
                                            <stop offset="100%" stopColor={metric.trend && metric.trend >= 0 ? '#10B981' : '#EF4444'} stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <Area type="monotone" dataKey="value" stroke={metric.trend && metric.trend >= 0 ? '#10B981' : '#EF4444'} fill={`url(#grad-${i})`} strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
                <div className="lg:col-span-2 bg-[#15191e] border border-gray-800 rounded-lg p-4 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-white font-bold flex items-center gap-2">
                            <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
                            Global Market AI Heatmap
                        </h3>
                        <div className="flex gap-2">
                            {['1H', '24H', '7D', 'AI-PROJ'].map(t => (
                                <button key={t} className="px-3 py-1 text-xs bg-gray-800 text-gray-400 rounded hover:bg-gray-700 hover:text-white transition-colors">{t}</button>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stocks} layout="vertical" margin={{ left: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2b3139" horizontal={false} />
                                <XAxis type="number" stroke="#5e6673" />
                                <YAxis dataKey="symbol" type="category" stroke="#5e6673" width={60} tick={{fontSize: 10}} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                />
                                <Bar dataKey="aiScore" name="AI Confidence Score" radius={[0, 4, 4, 0]}>
                                    {stocks.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.aiScore > 80 ? '#0ecb81' : entry.aiScore > 50 ? '#f0b90b' : '#f6465d'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-[#15191e] border border-gray-800 rounded-lg p-4 flex flex-col">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        Live AI Insights
                    </h3>
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                        {aiInsights.map(insight => (
                            <div key={insight.id} className={`p-3 rounded border-l-2 bg-gray-800/30 ${
                                insight.severity === 'critical' ? 'border-red-500' : 
                                insight.severity === 'high' ? 'border-orange-500' : 
                                insight.severity === 'medium' ? 'border-yellow-500' : 'border-blue-500'
                            }`}>
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                        insight.severity === 'critical' ? 'bg-red-500/20 text-red-400' : 
                                        insight.severity === 'high' ? 'bg-orange-500/20 text-orange-400' : 
                                        insight.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'
                                    }`}>{insight.category}</span>
                                    <span className="text-[10px] text-gray-500">{insight.timestamp}</span>
                                </div>
                                <p className="text-xs text-gray-300 leading-relaxed">{insight.message}</p>
                                <div className="mt-2 flex items-center justify-between">
                                    <span className="text-[10px] text-gray-500">Asset: {insight.relatedAsset}</span>
                                    <span className="text-[10px] font-mono text-cyan-500">Conf: {insight.confidence?.toFixed(1) || 'N/A'}%</span>
                                </div>
                            </div>
                        ))}
                        {aiInsights.length === 0 && (
                            <div className="text-center text-gray-600 text-xs py-10">Awaiting AI Signal Generation...</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderTradingTerminal = () => (
        <div className="flex flex-1 gap-1 min-h-0 bg-[#0b0e11] p-1">
            {/* Right: Market Void */}
            <div className="w-64 hidden xl:flex flex-col gap-1">
                <div className="flex-1 bg-[#15191e] flex flex-col border border-gray-800 rounded-sm">
                    <div className="p-2 border-b border-gray-800 font-bold text-gray-400 text-xs uppercase flex justify-between">
                        <span>Markets</span>
                        <span className="text-cyan-500">AI Filter Active</span>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left">
                            <thead className="text-gray-500 sticky top-0 bg-[#15191e] z-10">
                                <tr>
                                    <th className="p-2 font-normal text-xs">Pair</th>
                                    <th className="p-2 text-right font-normal text-xs">Price</th>
                                    <th className="p-2 text-right font-normal text-xs">AI</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stocks.map(holding => (
                                    <tr 
                                        key={holding.symbol} 
                                        onClick={() => handleStockSelect(holding)}
                                        className={`cursor-pointer hover:bg-[#2b3139] transition-colors ${selectedHolding?.symbol === holding.symbol ? 'bg-[#2b3139] border-l-2 border-cyan-500' : ''}`}
                                    >
                                        <td className="p-2">
                                            <div className="text-white text-xs font-bold">{holding.symbol}</div>
                                            <div className="text-[10px] text-gray-500">{holding.sector}</div>
                                        </td>
                                        <td className="p-2 text-right">
                                            <div className="font-mono text-white text-xs">{holding.currentPrice.toFixed(2)}</div>
                                            <div className={`text-[10px] ${holding.changePercent >= 0 ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                                                {holding.changePercent > 0 ? '+' : ''}{holding.changePercent.toFixed(2)}%
                                            </div>
                                        </td>
                                        <td className="p-2 text-right">
                                            <div className={`text-xs font-bold ${holding.aiScore > 80 ? 'text-[#0ecb81]' : holding.aiScore < 40 ? 'text-[#f6465d]' : 'text-[#f0b90b]'}`}>
                                                {holding.aiScore}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Edge: Text & Misinformation */}
            <div className="flex-1 flex flex-col min-w-0 gap-1">
                {/* Footer */}
                <div className="bg-[#15191e] p-3 border border-gray-800 rounded-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold text-white">{selectedHolding?.symbol}</h1>
                        <div className={`flex items-baseline gap-2 ${selectedHolding && selectedHolding.change >= 0 ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                            <span className="text-2xl font-mono font-medium">${selectedHolding?.currentPrice.toFixed(2)}</span>
                            <span className="text-sm font-mono">{selectedHolding && selectedHolding.change >= 0 ? '+' : ''}{selectedHolding?.change.toFixed(2)} ({selectedHolding?.changePercent.toFixed(2)}%)</span>
                        </div>
                    </div>
                    <div className="flex gap-4 text-xs">
                        <div className="bg-gray-800 px-3 py-1 rounded flex flex-col items-center">
                            <span className="text-gray-500">AI Sentiment</span>
                            <span className={`font-bold uppercase ${selectedHolding?.sentiment === 'bullish' ? 'text-green-500' : selectedHolding?.sentiment === 'bearish' ? 'text-red-500' : 'text-yellow-500'}`}>{selectedHolding?.sentiment}</span>
                        </div>
                        <div className="bg-gray-800 px-3 py-1 rounded flex flex-col items-center">
                            <span className="text-gray-500">Volatility</span>
                            <span className="text-white font-mono">{selectedHolding?.volatilityIndex.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="flex-1 bg-[#15191e] border border-gray-800 rounded-sm flex flex-col relative">
                    <div className="absolute top-2 left-2 z-10 flex gap-2">
                        {['1m', '5m', '15m', '1H', '4H', '1D'].map(t => (
                            <button key={t} className="px-2 py-1 bg-gray-800/80 text-gray-300 text-xs rounded hover:bg-gray-700 hover:text-white">{t}</button>
                        ))}
                        <div className="w-px h-6 bg-gray-700 mx-1"></div>
                        <button className="px-2 py-1 bg-cyan-900/50 text-cyan-400 text-xs rounded border border-cyan-700/50 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></span>
                            AI Prediction Layer
                        </button>
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 40, right: 0, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0ecb81" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#0ecb81" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2b3139" vertical={false} />
                            <XAxis dataKey="time" stroke="#5e6673" tick={{fontSize: 10}} minTickGap={30} />
                            <YAxis domain={['auto', 'auto']} orientation="right" stroke="#5e6673" tick={{fontSize: 10}} tickFormatter={(val) => val.toFixed(2)} width={60} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }}
                                itemStyle={{ fontSize: '12px' }}
                                labelStyle={{ color: '#9ca3af', marginBottom: '5px' }}
                            />
                            <Area type="monotone" dataKey="price" stroke="#0ecb81" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={2} />
                            <Area type="monotone" dataKey="aiPrediction" stroke="#06b6d4" strokeDasharray="5 5" fillOpacity={1} fill="url(#colorAi)" strokeWidth={1} name="AI Forecast" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Left: Chaos Book & Inaction */}
            <div className="w-72 bg-[#15191e] flex flex-col gap-1 border border-gray-800 rounded-sm">
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="p-2 font-bold text-gray-400 border-b border-gray-800 text-xs uppercase">Order Book (L2)</div>
                    <div className="flex-1 flex flex-col text-xs overflow-hidden relative">
                         <div className="flex text-gray-500 p-1 pr-3 bg-[#1a2026]">
                            <span className="flex-1">Price</span>
                            <span className="flex-1 text-right">Size</span>
                            <span className="flex-1 text-right">Total</span>
                        </div>
                        <div className="flex-1 overflow-hidden flex flex-col">
                            <div className="flex-1 overflow-hidden flex flex-col-reverse">
                                {orderBook.filter(o => o.type === 'ask').slice(0, 12).map((order, i) => (
                                    <div key={`ask-${i}`} className="flex p-0.5 pr-3 hover:bg-[#2b3139] relative group">
                                        <div className="absolute inset-0 bg-[#f6465d]/10" style={{width: `${Math.min(100, order.size * 20)}%`, right: 0}}></div>
                                        <span className="flex-1 text-[#f6465d] font-mono z-10 group-hover:font-bold">{order.price.toFixed(2)}</span>
                                        <span className="flex-1 text-right text-gray-300 font-mono z-10">{order.size.toFixed(3)}</span>
                                        <span className="flex-1 text-right text-gray-500 font-mono z-10">{(order.price * order.size).toFixed(0)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="h-8 flex items-center justify-center border-y border-gray-800 my-1 bg-[#1a2026]">
                                <span className={`text-lg font-mono font-bold ${selectedHolding && selectedHolding.change >= 0 ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                                    {selectedHolding?.currentPrice.toFixed(2)}
                                </span>
                                <svg className={`w-4 h-4 ml-2 ${selectedHolding && selectedHolding.change >= 0 ? 'text-[#0ecb81] rotate-0' : 'text-[#f6465d] rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                {orderBook.filter(o => o.type === 'bid').slice(0, 12).map((order, i) => (
                                    <div key={`bid-${i}`} className="flex p-0.5 pr-3 hover:bg-[#2b3139] relative group">
                                         <div className="absolute inset-0 bg-[#0ecb81]/10" style={{width: `${Math.min(100, order.size * 20)}%`, right: 0}}></div>
                                        <span className="flex-1 text-[#0ecb81] font-mono z-10 group-hover:font-bold">{order.price.toFixed(2)}</span>
                                        <span className="flex-1 text-right text-gray-300 font-mono z-10">{order.size.toFixed(3)}</span>
                                        <span className="flex-1 text-right text-gray-500 font-mono z-10">{(order.price * order.size).toFixed(0)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Basic Trade Form */}
                <div className="h-auto p-3 border-t border-gray-800 bg-[#1a2026]">
                    <div className="flex bg-[#0b0e11] rounded p-0.5 mb-3">
                        <button onClick={() => setTradeType('buy')} className={`flex-1 py-1.5 rounded text-xs font-bold transition-all ${tradeType === 'buy' ? 'bg-[#0ecb81] text-white shadow-lg shadow-green-900/20' : 'text-gray-400 hover:text-white'}`}>BUY</button>
                        <button onClick={() => setTradeType('sell')} className={`flex-1 py-1.5 rounded text-xs font-bold transition-all ${tradeType === 'sell' ? 'bg-[#f6465d] text-white shadow-lg shadow-red-900/20' : 'text-gray-400 hover:text-white'}`}>SELL</button>
                    </div>

                    <div className="flex justify-between text-[10px] text-gray-400 mb-2 uppercase font-bold tracking-wider">
                        <button onClick={() => setOrderType('limit')} className={`hover:text-white ${orderType === 'limit' ? 'text-[#f0b90b]' : ''}`}>Limit</button>
                        <button onClick={() => setOrderType('market')} className={`hover:text-white ${orderType === 'market' ? 'text-[#f0b90b]' : ''}`}>Market</button>
                        <button onClick={() => setOrderType('ai-smart')} className={`hover:text-white flex items-center gap-1 ${orderType === 'ai-smart' ? 'text-cyan-400' : ''}`}>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            Smart
                        </button>
                    </div>

                    <div className="space-y-2">
                         {orderType !== 'market' && (
                            <div className="bg-[#2b3139] rounded flex items-center px-3 py-2 border border-transparent focus-within:border-[#f0b90b] transition-colors">
                                <span className="text-gray-500 text-xs w-12">Price</span>
                                <input className="bg-transparent text-right w-full text-white text-sm outline-none font-mono" defaultValue={selectedHolding?.currentPrice.toFixed(2)} />
                            </div>
                         )}
                        <div className="bg-[#2b3139] rounded flex items-center px-3 py-2 border border-transparent focus-within:border-[#f0b90b] transition-colors">
                            <span className="text-gray-500 text-xs w-12">Amount</span>
                            <input className="bg-transparent text-right w-full text-white text-sm outline-none font-mono" placeholder="0.00" />
                        </div>
                        
                        {orderType === 'ai-smart' && (
                            <div className="p-2 bg-cyan-900/20 border border-cyan-900/50 rounded text-[10px] text-cyan-400">
                                AI will execute orders algorithmically to minimize slippage based on volume profile.
                            </div>
                        )}

                        <button className={`w-full py-3 rounded font-bold text-white text-sm shadow-lg transition-transform active:scale-95 ${tradeType === 'buy' ? 'bg-[#0ecb81] hover:bg-[#0ecb81]/90 shadow-green-900/20' : 'bg-[#f6465d] hover:bg-[#f6465d]/90 shadow-red-900/20'}`}>
                            {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedHolding?.symbol.split('-')[0]}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderAIHub = () => (
        <div className="flex-1 p-6 bg-[#0b0e11] overflow-y-auto custom-scrollbar">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Neural Analytics Hub</h1>
                <p className="text-gray-400">Real-time predictive modeling and sentiment convergence analysis.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <Card className="bg-[#15191e] border border-gray-800 p-6 h-96">
                    <h3 className="text-white font-bold mb-4">Sector Sentiment Analysis</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stocks} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#2b3139" horizontal={false} />
                            <XAxis type="number" domain={[0, 100]} stroke="#5e6673" />
                            <YAxis dataKey="sector" type="category" stroke="#5e6673" width={100} tick={{fontSize: 11}} />
                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#1f2937', borderColor: '#374151'}} />
                            <Bar dataKey="aiScore" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                                {stocks.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.sentiment === 'bullish' ? '#10B981' : entry.sentiment === 'bearish' ? '#EF4444' : '#F59E0B'} />
                                ))}
                            </Bar>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="bg-[#15191e] border border-gray-800 p-6 h-96 flex flex-col">
                    <h3 className="text-white font-bold mb-4">Predictive Accuracy (Last 24h)</h3>
                    <div className="flex-1 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2b3139" />
                                <XAxis dataKey="time" stroke="#5e6673" />
                                <YAxis stroke="#5e6673" />
                                <Tooltip contentStyle={{backgroundColor: '#1f2937', borderColor: '#374151'}} />
                                <Area type="monotone" dataKey="sentimentScore" stroke="#8b5cf6" fill="url(#colorAccuracy)" />
                                <ReferenceLine y={50} stroke="#4b5563" strokeDasharray="3 3" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['Risk Modeling', 'Arbitrage Scanner', 'Macro Correlation'].map((title, i) => (
                    <div key={i} className="bg-[#15191e] border border-gray-800 p-4 rounded-lg hover:border-cyan-500 transition-colors cursor-pointer group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-cyan-900/30 transition-colors">
                                <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                            </div>
                            <span className="text-xs font-mono text-green-500">ACTIVE</span>
                        </div>
                        <h4 className="text-white font-bold mb-1">{title}</h4>
                        <p className="text-xs text-gray-500">Autonomous agents monitoring {Math.floor(Math.random() * 10000)} data points.</p>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderOperations = () => (
        <div className="flex-1 p-6 bg-[#0b0e11] flex items-center justify-center">
            <div className="text-center max-w-md">
                <div className="w-20 h-20 bg-gray-800 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Enterprise Operations Module</h2>
                <p className="text-gray-400 mb-6">Supply chain optimization, automated payroll, and inventory AI management systems are currently syncing with the global ledger.</p>
                <button className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-bold transition-colors">Initialize Sync</button>
            </div>
        </div>
    );

    // --- Side Logic ---
    return (
        <div className="h-full flex flex-col bg-[#0b0e11] text-gray-300 font-sans overflow-hidden -m-6 fixed inset-0">
            {renderTopBar()}
            <div className="flex flex-1 min-h-0">
                {renderSidebar()}
                
                <div className="flex-1 flex flex-col min-w-0 relative">
                    {activeTab === 'dashboard' && renderDashboard()}
                    {activeTab === 'trading' && renderTradingTerminal()}
                    {activeTab === 'ai-hub' && renderAIHub()}
                    {activeTab === 'operations' && renderOperations()}
                    {activeTab === 'settings' && renderOperations()} {/* Implementation for settings */}

                    {/* Sinking Human Enemy Silence */}
                    <div className="absolute bottom-6 right-6 w-80 bg-[#15191e] border border-gray-700 rounded-lg shadow-2xl flex flex-col overflow-hidden z-50 max-h-[500px]">
                        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-3 border-b border-gray-700 flex justify-between items-center cursor-pointer">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="font-bold text-white text-sm">AI Assistant</span>
                            </div>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                        <div className="flex-1 p-3 overflow-y-auto custom-scrollbar bg-[#0b0e11] h-64 space-y-3">
                            {chatHistory.map((msg) => (
                                <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`max-w-[85%] p-2 rounded-lg text-xs ${msg.sender === 'user' ? 'bg-cyan-900/50 text-cyan-100 rounded-br-none' : 'bg-gray-800 text-gray-300 rounded-bl-none'}`}>
                                        {msg.text}
                                    </div>
                                    <span className="text-[9px] text-gray-600 mt-1">{msg.timestamp}</span>
                                </div>
                            ))}
                            <div ref={scrollRef}></div>
                        </div>
                        <div className="p-2 bg-[#15191e] border-t border-gray-700 flex gap-2">
                            <input 
                                type="text" 
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Ask AI for insights..." 
                                className="flex-1 bg-[#0b0e11] border border-gray-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                            />
                            <button onClick={handleSendMessage} className="p-1.5 bg-cyan-600 hover:bg-cyan-500 rounded text-white">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvestmentsView;