// components/views/platform/DemoBankWorkflowEngineView.tsx
import React, { useState, useEffect, useRef } from 'react';
import Card from '../../Card';
import { GoogleGenAI } from "@google/genai";
import { graphviz } from 'd3-graphviz';

declare const d3: any;

const DemoBankWorkflowEngineView: React.FC = () => {
    const [prompt, setPrompt] = useState("Request -> Manager Approval -> Finance Approval -> Done");
    const [dotString, setDotString] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const graphRef = useRef<HTMLDivElement>(null);

    const handleGenerate = async () => {
        setIsLoading(true);
        setError('');
        setDotString('');
        // Clear previous graph
        if (graphRef.current) {
            graphRef.current.innerHTML = '';
        }

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const fullPrompt = `You are a workflow visualization expert. Convert the following user-described workflow into the DOT graph description language. The graph should be laid out from left to right (rankdir="LR"). Nodes should be rounded boxes (shape=box, style=rounded) with a dark fill ('#1f2937'), light text ('#e5e7eb'), and a grey border ('#4b5563'). Edges should be a light color ('#9ca3af'). Do not include any explanation, only the DOT code block. Workflow: "${prompt}"`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: fullPrompt,
            });

            // The AI might return the DOT code inside markdown fences. We need to clean it.
            const cleanedDot = response.text.replace(/```dot\n|```graphviz\n|```/g, '').trim();
            setDotString(cleanedDot);

        } catch (e) {
            console.error("Failed to generate workflow DOT string", e);
            setError('The AI could not generate a visualization. Please try a different prompt.');
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        if (dotString && graphRef.current) {
            try {
                graphviz(graphRef.current)
                    .transition(() => d3.transition().duration(500))
                    .renderDot(dotString);
            } catch(e) {
                console.error("d3-graphviz error:", e);
                setError("Could not render the generated workflow diagram. The AI may have produced an invalid format.");
            }
        }
    }, [dotString]);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Demo Bank Workflow Engine</h2>
            <Card title="AI Workflow Visualizer">
                <p className="text-gray-400 mb-4">{'Describe a simple, linear workflow using "->" to separate steps, and the AI will generate a visual diagram using the DOT language.'}</p>
                <textarea
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    className="w-full h-24 bg-gray-700/50 p-3 rounded text-white font-mono text-sm focus:ring-cyan-500 focus:border-cyan-500"
                />
                <button onClick={handleGenerate} disabled={isLoading} className="w-full mt-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded disabled:opacity-50 transition-colors">
                    {isLoading ? 'Generating...' : 'Visualize Workflow'}
                </button>
            </Card>

            {(isLoading || dotString || error) && (
                <Card title="Generated Workflow">
                     <div className="p-4 bg-gray-900/50 rounded overflow-x-auto min-h-[200px] flex items-center justify-center">
                        {isLoading && <p>Generating...</p>}
                        {error && <p className="text-red-400">{error}</p>}
                        <div ref={graphRef} id="graph-container"></div>
                     </div>
                </Card>
            )}
        </div>
    );
};

export default DemoBankWorkflowEngineView;