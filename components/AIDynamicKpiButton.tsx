import React, { useState, useContext } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';

const SparklesIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.572L16.25 21.75l-.648-1.178a3.375 3.375 0 00-2.456-2.456L12 17.25l1.178-.648a3.375 3.375 0 002.456-2.456L16.25 13.5l.648 1.178a3.375 3.375 0 002.456 2.456L20.25 18l-1.178.648a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
);

const AIDynamicKpiButton: React.FC = () => {
    const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
    const [promptInput, setPromptInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const context = useContext(DataContext);
    if (!context) throw new Error("AIDynamicKpiButton must be used within a DataProvider");

    const { addDynamicKpi } = context;

    const handleSubmitPrompt = async () => {
        if (!promptInput.trim()) {
            setError("Please enter a prompt.");
            return;
        }

        setIsLoading(true);
        setError(null);
        
        // Simulate a backend call to the AI to generate the KPI definition
        setTimeout(() => {
            try {
                // Mock response from AI backend based on the user's conceptual code
                const result = {
                    kpiId: `kpi-discretionary-spending-${Date.now()}`,
                    title: "Discretionary Spending vs. Income Growth",
                    description: "AI-generated trend of discretionary spending against income growth, highlighting months where spending exceeded 60% of income."
                };
                
                addDynamicKpi({
                    id: result.kpiId,
                    title: result.title,
                    description: result.description,
                });

                setPromptInput('');
                setIsPromptModalOpen(false);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }, 2500);
    };

    return (
        <>
            <Card variant="interactive" className="h-full flex flex-col justify-center items-center text-center p-4">
                <button
                    onClick={() => setIsPromptModalOpen(true)}
                    className="flex flex-col items-center justify-center p-4 rounded-lg bg-cyan-600/50 hover:bg-cyan-700/70 transition-colors duration-200 text-white w-full h-full"
                >
                    <SparklesIcon className="w-12 h-12 mb-3 text-cyan-300" />
                    <p className="text-lg font-semibold">Generate Custom KPI</p>
                    <p className="text-sm text-gray-300 mt-1">"AI, show me my spending trends!"</p>
                </button>
            </Card>

            {isPromptModalOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-white">AI KPI Generator</h3>
                            <button onClick={() => setIsPromptModalOpen(false)} className="text-gray-400 hover:text-white">&times;</button>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-gray-300">Describe the financial insight you want to see:</p>
                            <textarea
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:ring-cyan-500 focus:border-cyan-500"
                                rows={4}
                                placeholder="E.g., 'Show my monthly investment gains versus losses for the past year', or 'Compare my utility spending with local average prices over the last quarter.'"
                                value={promptInput}
                                onChange={(e) => setPromptInput(e.target.value)}
                                disabled={isLoading}
                            ></textarea>
                            {error && <p className="text-red-400 text-sm">{error}</p>}
                            <button
                                onClick={handleSubmitPrompt}
                                className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg flex items-center justify-center disabled:opacity-50"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <SparklesIcon className="w-5 h-5 mr-2" />
                                )}
                                {isLoading ? "Generating KPI..." : "Generate KPI"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AIDynamicKpiButton;
