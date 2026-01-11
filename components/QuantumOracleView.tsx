// components/views/platform/QuantumOracleView.tsx
import React, { useState, useContext } from 'react';
import Card from '../../Card';
import { DataContext } from '../../../context/DataContext';
import { GoogleGenAI } from '@google/genai';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// API Type Definitions
interface SimulationRequest {
  prompt: string;
  parameters: {
    durationMonths: number;
    amountUSD: number;
  };
}

interface SimulationResponse {
  simulationId: string;
  narrativeSummary: string;
  keyImpacts: {
    metric: string;
    value: string;
    severity: 'low' | 'medium' | 'high';
  }[];
  recommendations: {
    title: string;
    description: string;
  }[];
  projectedData: { month: number; balance: number }[];
}

const QuantumOracleView: React.FC = () => {
    const context = useContext(DataContext);
    const [prompt, setPrompt] = useState("What if I experience a recession and my freelance income drops by 50% for 6 months?");
    const [duration, setDuration] = useState(6);
    const [amount, setAmount] = useState(0); // For events like a bonus/cost
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<SimulationResponse | null>(null);

    if (!context) {
        throw new Error("QuantumOracleView must be used within a DataProvider");
    }

    const handleSimulate = async () => {
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            // In a real app, this would be a fetch call to the endpoint defined in the OpenAPI spec.
            // We are mocking the response for demonstration.
            const requestBody: SimulationRequest = {
                prompt,
                parameters: { durationMonths: duration, amountUSD: amount }
            };

            // MOCK API CALL
            console.log("Submitting to Quantum Oracle:", requestBody);
            await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate network latency & computation
            
            // This is the structure defined in QuantumOracleApiResponse.json
            const mockResponse: SimulationResponse = {
                simulationId: `sim_${Date.now()}`,
                narrativeSummary: "The simulation indicates a significant strain on your finances. Your emergency fund would be depleted by month 4, and you would enter a negative cash flow situation. Your 'Condo Down Payment' goal would be delayed by an estimated 14 months.",
                keyImpacts: [
                    { metric: "Emergency Fund Depletion", value: "in 4 months", severity: "high" },
                    { metric: "Goal Delay (Condo)", value: "+14 months", severity: "medium" },
                    { metric: "Credit Score Impact", value: "-30 points (projected)", severity: "medium" },
                ],
                recommendations: [
                    { title: "Aggressively Cut Discretionary Spending", description: "Immediately reduce 'Dining' and 'Shopping' budgets by 75% to extend your runway." },
                    { title: "Explore Freelance Platforms", description: "Proactively seek smaller, supplemental income streams on platforms like Upwork to offset the income drop." },
                ],
                projectedData: Array.from({ length: duration + 1 }, (_, i) => ({ month: i, balance: 15000 - (i * 2500) })),
            };

            setResult(mockResponse);

        } catch (e: any) {
            setError(e.message || "An unknown error occurred during the simulation.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const ImpactSeverityIndicator: React.FC<{severity: 'low'|'medium'|'high'}> = ({severity}) => {
        const colors = { low: 'bg-green-500', medium: 'bg-yellow-500', high: 'bg-red-500' };
        return <div className={`w-3 h-3 rounded-full ${colors[severity]}`} title={`Severity: ${severity}`}></div>
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Quantum Oracle</h2>
            <Card title="Simulate a Financial Future">
                <p className="text-sm text-gray-400 mb-4">Describe a hypothetical scenario. The Oracle will use a full model of your financial state to simulate the outcome and provide a strategic analysis.</p>
                <textarea
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    className="w-full h-24 bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-white focus:ring-cyan-500 focus:border-cyan-500"
                    placeholder="e.g., 'What if I get a $10,000 bonus next month?'"
                    disabled={isLoading}
                />
                <div className="grid grid-cols-2 gap-4 mt-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-300">Duration (Months)</label>
                        <input type="range" min="1" max="60" value={duration} onChange={e => setDuration(Number(e.target.value))} className="w-full" disabled={isLoading}/>
                        <div className="text-center font-mono text-cyan-300">{duration} months</div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300">Amount ($)</label>
                        <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full bg-gray-700/50 border-gray-600 rounded-md p-2 text-white" disabled={isLoading}/>
                    </div>
                </div>
                 <button onClick={handleSimulate} disabled={isLoading || !prompt} className="w-full mt-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg disabled:opacity-50">
                    {isLoading ? 'Exploring Timelines...' : 'Run Simulation'}
                </button>
            </Card>

            {isLoading && <Card><div className="text-center p-8 text-white">Simulating...</div></Card>}
            {error && <Card><p className="text-red-400 p-4">{error}</p></Card>}

            {result && (
                <div className="space-y-6 animate-fade-in">
                    <Card title="Simulation Summary">
                        <p className="italic text-gray-300">"{result.narrativeSummary}"</p>
                    </Card>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card title="Key Impacts">
                            <ul className="space-y-3">
                                {result.keyImpacts.map(impact => (
                                    <li key={impact.metric} className="flex justify-between items-center p-2 bg-gray-800/50 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <ImpactSeverityIndicator severity={impact.severity} />
                                            <span className="text-gray-300">{impact.metric}</span>
                                        </div>
                                        <span className="font-semibold text-white">{impact.value}</span>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                         <Card title="Projected Balance">
                            <ResponsiveContainer width="100%" height={200}>
                                <AreaChart data={result.projectedData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <defs><linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.7}/><stop offset="95%" stopColor="#ef4444" stopOpacity={0}/></linearGradient></defs>
                                    <XAxis dataKey="month" stroke="#9ca3af" unit="m" fontSize={12} />
                                    <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(tick) => `$${(tick/1000)}k`}/>
                                    <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                                    <Area type="monotone" dataKey="balance" stroke="#ef4444" fill="url(#colorBalance)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Card>
                    </div>
                    <Card title="AI Strategic Recommendations">
                        <div className="space-y-4">
                            {result.recommendations.map(rec => (
                                <div key={rec.title} className="p-3 bg-gray-800/50 rounded-lg border-l-4 border-cyan-500">
                                    <h4 className="font-semibold text-white">{rec.title}</h4>
                                    <p className="text-sm text-gray-400 mt-1">{rec.description}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            )}
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default QuantumOracleView;
