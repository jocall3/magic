// components/views/megadashboard/digitalassets/OnChainAnalyticsView.tsx
import React, { useState } from 'react';
import Card from '../../../Card';
import { GoogleGenAI } from "@google/genai";

const OnChainAnalyticsView: React.FC = () => {
    const [isExplainerOpen, setExplainerOpen] = useState(false);
    const [txHash, setTxHash] = useState("0x123...abc");
    const [explanation, setExplanation] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleExplain = async () => {
        setIsLoading(true);
        setExplanation('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            // This is a simulation; a real implementation would first fetch transaction data
            const prompt = `In simple terms, explain what a hypothetical Ethereum transaction with hash "${txHash}" might represent if it involved a swap on Uniswap between ETH and USDC.`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setExplanation(response.text);
        } catch (err) {
            setExplanation("Error explaining transaction.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white tracking-wider">On-Chain Analytics</h2>
                    <button onClick={() => setExplainerOpen(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium">AI Transaction Explainer</button>
                </div>
            </div>
            {isExplainerOpen && (
                 <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={() => setExplainerOpen(false)}>
                    <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full border border-gray-700" onClick={e=>e.stopPropagation()}>
                        <div className="p-4 border-b border-gray-700"><h3 className="text-lg font-semibold text-white">AI Transaction Explainer</h3></div>
                        <div className="p-6 space-y-4">
                             <input type="text" value={txHash} onChange={e => setTxHash(e.target.value)} className="w-full bg-gray-700/50 p-2 rounded text-white font-mono" />
                             <button onClick={handleExplain} disabled={isLoading} className="w-full py-2 bg-cyan-600 rounded disabled:opacity-50">{isLoading ? 'Analyzing...' : 'Explain Transaction'}</button>
                            <Card title="Explanation"><div className="min-h-[10rem] text-sm text-gray-300 whitespace-pre-line">{isLoading ? '...' : explanation}</div></Card>
                        </div>
                    </div>
                 </div>
            )}
        </>
    );
};

export default OnChainAnalyticsView;
