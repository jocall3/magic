import React, { useContext, useState } from 'react';
import { DataContext } from '../context/DataContext';

const ApiKeyPrompt: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("Must be used within DataProvider");

    const [isGenerating, setIsGenerating] = useState(false);
    const { generateApiKey, error } = context;

    const handleGenerate = async () => {
        setIsGenerating(true);
        await generateApiKey();
        // The component will unmount on success as the apiKey state changes in App.tsx
    };

    return (
        <div className="fixed inset-0 bg-gray-950 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 max-w-lg text-center shadow-2xl animate-fade-in">
                <h1 className="text-3xl font-bold text-white mb-4">Welcome to Demo Bank</h1>
                <p className="text-gray-400 mb-6">
                    To begin, you need to generate a secure API key to connect to the backend server and load your data. 
                    This ensures a secure connection to your financial information.
                </p>
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg disabled:opacity-50 transition-colors flex items-center justify-center"
                >
                    {isGenerating && (
                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    )}
                    {isGenerating ? 'Generating...' : 'Generate Secure API Key'}
                </button>
                {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}
            </div>
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default ApiKeyPrompt;
