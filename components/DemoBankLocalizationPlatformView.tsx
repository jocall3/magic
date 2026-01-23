// components/views/platform/DemoBankLocalizationPlatformView.tsx
import React, { useState } from 'react';
import Card from '../../Card';
import { GoogleGenAI, Type } from "@google/genai";

const DemoBankLocalizationPlatformView: React.FC = () => {
    const [prompt, setPrompt] = useState("Welcome to your dashboard");
    const [generatedTranslations, setGeneratedTranslations] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        setGeneratedTranslations(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const schema = {
                type: Type.OBJECT,
                properties: {
                    translations: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                language: { type: Type.STRING },
                                text: { type: Type.STRING }
                            }
                        }
                    }
                }
            };
            const fullPrompt = `Translate the English string "${prompt}" into Spanish, French, German, and Japanese.`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: fullPrompt, config: { responseMimeType: "application/json", responseSchema: schema } });
            setGeneratedTranslations(JSON.parse(response.text));
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank Localization</h2>
            <Card title="AI Translation Generator">
                <p className="text-gray-400 mb-4">Enter a source string in English to translate into multiple languages.</p>
                <input
                    type="text"
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    className="w-full bg-gray-700/50 p-3 rounded text-white font-mono text-sm focus:ring-cyan-500 focus:border-cyan-500"
                />
                <button onClick={handleGenerate} disabled={isLoading} className="w-full mt-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded disabled:opacity-50 transition-colors">
                    {isLoading ? 'Translating...' : 'Generate Translations'}
                </button>
            </Card>

            {(isLoading || generatedTranslations) && (
                 <Card title="Generated Translations">
                     <div className="space-y-3">
                        {isLoading ? <p>Translating...</p> : generatedTranslations.translations.map((t: any, i: number) => (
                            <div key={i} className="flex justify-between items-center text-sm p-3 bg-gray-900/50 rounded-lg">
                                <span className="font-semibold text-cyan-300 w-1/4">{t.language}</span>
                                <span className="text-gray-200 w-3/4 text-right font-mono">{t.text}</span>
                            </div>
                        ))}
                     </div>
                </Card>
            )}
        </div>
    );
};

export default DemoBankLocalizationPlatformView;