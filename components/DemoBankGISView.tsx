// components/views/platform/DemoBankGISView.tsx
import React, { useState } from 'react';
import Card from '../../Card';
import { GoogleGenAI, Type } from "@google/genai";

const DemoBankGISView: React.FC = () => {
    const [prompt, setPrompt] = useState("a polygon for Central Park in New York City");
    const [generatedGeoJson, setGeneratedGeoJson] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        setGeneratedGeoJson(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const schema = {
                type: Type.OBJECT,
                properties: {
                    type: { type: Type.STRING },
                    features: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                type: { type: Type.STRING },
                                properties: { type: Type.OBJECT, properties: { name: { type: Type.STRING } } },
                                geometry: {
                                    type: Type.OBJECT,
                                    properties: {
                                        type: { type: Type.STRING },
                                        coordinates: { type: Type.ARRAY, items: { type: Type.ARRAY, items: { type: Type.ARRAY, items: { type: Type.NUMBER } } } } }
                                }
                            }
                        }
                    }
                }
            };
            const fullPrompt = `Generate a simple GeoJSON object for the following location: "${prompt}". Provide a few coordinate points to define the shape.`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: fullPrompt, config: { responseMimeType: "application/json", responseSchema: schema } });
            setGeneratedGeoJson(JSON.parse(response.text));
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank GIS Platform</h2>
            <Card title="AI GeoJSON Generator">
                <p className="text-gray-400 mb-4">Describe a location or shape, and our AI will generate a GeoJSON representation.</p>
                <textarea
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    className="w-full h-24 bg-gray-700/50 p-3 rounded text-white font-mono text-sm focus:ring-cyan-500 focus:border-cyan-500"
                    placeholder="e.g., A point for the Eiffel Tower"
                />
                <button onClick={handleGenerate} disabled={isLoading} className="w-full mt-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded disabled:opacity-50 transition-colors">
                    {isLoading ? 'Generating...' : 'Generate GeoJSON'}
                </button>
            </Card>

            {(isLoading || generatedGeoJson) && (
                <Card title="Generated GeoJSON">
                    <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono bg-gray-900/50 p-4 rounded max-h-96 overflow-auto">
                        {isLoading ? 'Generating...' : JSON.stringify(generatedGeoJson, null, 2)}
                    </pre>
                </Card>
            )}
        </div>
    );
};

export default DemoBankGISView;