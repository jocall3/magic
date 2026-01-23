// components/views/platform/DemoBankSearchSuiteView.tsx
import React, { useState } from 'react';
import Card from '../../Card';
import { GoogleGenAI, Type } from "@google/genai";

const DemoBankSearchSuiteView: React.FC = () => {
    const [prompt, setPrompt] = useState("search for 'financial report' but boost results from the last quarter");
    const [generatedConfig, setGeneratedConfig] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        setGeneratedConfig(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const schema = {
                type: Type.OBJECT,
                properties: {
                    query: { type: Type.STRING },
                    filters: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { field: {type: Type.STRING}, value: {type: Type.STRING}} } },
                    boost: { type: Type.OBJECT, properties: { field: { type: Type.STRING }, factor: { type: Type.NUMBER } } }
                }
            };
            const fullPrompt = `You are a search expert. Translate this natural language search request into a structured search API query object: "${prompt}".`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: fullPrompt, config: { responseMimeType: "application/json", responseSchema: schema } });
            setGeneratedConfig(JSON.parse(response.text));
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank Search Suite</h2>
            <Card title="AI Search Query Generator">
                <p className="text-gray-400 mb-4">Describe the search you want to perform in natural language.</p>
                <textarea
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    className="w-full h-24 bg-gray-700/50 p-3 rounded text-white font-mono text-sm focus:ring-cyan-500 focus:border-cyan-500"
                />
                <button onClick={handleGenerate} disabled={isLoading} className="w-full mt-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded disabled:opacity-50 transition-colors">
                    {isLoading ? 'Generating Query...' : 'Generate Query Configuration'}
                </button>
            </Card>

            {(isLoading || generatedConfig) && (
                <Card title="Generated Search Config">
                    <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono bg-gray-900/50 p-4 rounded max-h-96 overflow-auto">
                        {isLoading ? 'Generating...' : JSON.stringify(generatedConfig, null, 2)}
                    </pre>
                </Card>
            )}
        </div>
    );
};

export default DemoBankSearchSuiteView;