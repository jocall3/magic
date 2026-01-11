// components/views/platform/DemoBankFleetManagementView.tsx
import React, { useState } from 'react';
import Card from '../../Card';
import { GoogleGenAI, Type } from "@google/genai";

const DemoBankFleetManagementView: React.FC = () => {
    const [prompt, setPrompt] = useState("Warehouse A -> 123 Main St, Anytown -> 456 Oak Ave, Anytown -> 789 Pine Ln, Anytown -> Warehouse A");
    const [generatedRoute, setGeneratedRoute] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        setGeneratedRoute(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const schema = {
                type: Type.OBJECT,
                properties: {
                    optimizedRoute: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    },
                    estimatedTime: { type: Type.STRING },
                    estimatedDistance: { type: Type.STRING },
                }
            };
            const fullPrompt = `You are a logistics expert. Based on this list of stops, generate an optimized delivery route (re-ordering the stops between the start and end point), and provide a realistic estimated time and distance. Stops: "${prompt}".`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: fullPrompt, config: { responseMimeType: "application/json", responseSchema: schema } });
            setGeneratedRoute(JSON.parse(response.text));
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank Fleet Management</h2>
            <Card title="AI Route Optimizer">
                <p className="text-gray-400 mb-4">Enter a list of delivery addresses or waypoints, separated by "->".</p>
                <textarea
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    className="w-full h-24 bg-gray-700/50 p-3 rounded text-white font-mono text-sm focus:ring-cyan-500 focus:border-cyan-500"
                />
                <button onClick={handleGenerate} disabled={isLoading} className="w-full mt-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded disabled:opacity-50 transition-colors">
                    {isLoading ? 'Optimizing...' : 'Generate Optimized Route'}
                </button>
            </Card>

            {(isLoading || generatedRoute) && (
                 <Card title="Optimized Route">
                     <div className="space-y-4">
                        {isLoading ? <p>Optimizing...</p> : (
                            <>
                                <div className="flex justify-around text-center p-4 bg-gray-900/50 rounded-lg">
                                    <div><p className="text-sm text-gray-400">Est. Time</p><p className="text-xl font-semibold text-white">{generatedRoute.estimatedTime}</p></div>
                                    <div><p className="text-sm text-gray-400">Est. Distance</p><p className="text-xl font-semibold text-white">{generatedRoute.estimatedDistance}</p></div>
                                </div>
                                <ol className="list-decimal list-inside text-gray-300 space-y-2 mt-4 p-2">
                                {generatedRoute.optimizedRoute.map((stop: string, i: number) => <li key={i} className="font-mono">{stop}</li>)}
                                </ol>
                            </>
                        )}
                     </div>
                </Card>
            )}
        </div>
    );
};

export default DemoBankFleetManagementView;