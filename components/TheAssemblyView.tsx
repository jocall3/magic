// components/views/platform/FinancialInstrumentForgeView.tsx
import React, { useState } from 'react';
import Card from '../../Card';
import { GoogleGenAI } from "@google/genai";

type ForgeTab = 'structured' | 'decentralized' | 'personal';

const instrumentClasses = {
    structured: [
        { id: 'ppn', name: 'Principal-Protected Note', description: 'Combine bond-like security with equity upside. 100% principal back at maturity, guaranteed.', icon: 'shield-check' },
        { id: 'yen', name: 'Yield Enhancement Note', description: 'A short-term instrument offering high yield, with risk tied to an underlying stock\'s performance.', icon: 'trending-up' },
    ],
    decentralized: [
        { id: 'ayv', name: 'Automated Yield Vault', description: 'Deposit stablecoins and select a risk profile to automatically earn yield from various DeFi protocols.', icon: 'cube-transparent' },
        { id: 'sst', name: 'Sovereign Security Token', description: 'Tokenize a real-world asset (e.g., royalties, real estate) into a tradable digital security.', icon: 'globe-alt' },
    ],
    personal: [
        { id: 'pib', name: 'Personal Income Bond', description: 'Raise capital today by issuing a bond backed by a percentage of your future income.', icon: 'user-group' },
        { id: 'cisa', name: 'Contingent Goal ISA', description: 'An ISA where the interest rate boosts if you meet a pre-defined non-financial life goal.', icon: 'flag' },
    ]
};

const FinancialInstrumentForgeView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ForgeTab>('structured');
    const [selectedInstrument, setSelectedInstrument] = useState<any | null>(null);

    return (
        <>
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white tracking-wider">Financial Instrument Forge</h2>
                <Card>
                    <p className="text-gray-400 mb-6">Welcome to the creator's space. Design, analyze, and mint bespoke financial products on the Demo Bank platform. Move beyond being a consumer of finance—become an architect.</p>
                    <div className="flex border-b border-gray-700">
                        <TabButton id="structured" label="Structured Products" activeTab={activeTab} setActiveTab={setActiveTab} />
                        <TabButton id="decentralized" label="Decentralized Instruments" activeTab={activeTab} setActiveTab={setActiveTab} />
                        <TabButton id="personal" label="Personal Contracts" activeTab={activeTab} setActiveTab={setActiveTab} />
                    </div>
                    <div className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {instrumentClasses[activeTab].map(instrument => (
                                <InstrumentCard key={instrument.id} {...instrument} onSelect={() => setSelectedInstrument(instrument)} />
                            ))}
                        </div>
                    </div>
                </Card>
            </div>
            {selectedInstrument && <InstrumentWorkbenchModal instrument={selectedInstrument} onClose={() => setSelectedInstrument(null)} />}
        </>
    );
};

const TabButton: React.FC<{id: ForgeTab, label: string, activeTab: ForgeTab, setActiveTab: (tab: ForgeTab) => void}> = ({ id, label, activeTab, setActiveTab }) => (
    <button onClick={() => setActiveTab(id)} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === id ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-gray-400 hover:text-white'}`}>
        {label}
    </button>
);

const InstrumentCard: React.FC<{name: string, description: string, icon: string, onSelect: () => void}> = ({ name, description, icon, onSelect }) => (
    <Card variant="interactive" onClick={onSelect} className="h-full flex flex-col">
        <div className="flex-grow">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-300 flex-shrink-0"><ForgeIcon type={icon} /></div>
                <h3 className="text-lg font-semibold text-white">{name}</h3>
            </div>
            <p className="text-sm text-gray-400">{description}</p>
        </div>
        <button className="w-full mt-4 text-sm py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">Open Workbench</button>
    </Card>
);

const InstrumentWorkbenchModal: React.FC<{instrument: any, onClose: () => void}> = ({ instrument, onClose }) => {
    const [params, setParams] = useState({ principal: 10000, term: 5, risk: 3 });
    const [aiAnalysis, setAiAnalysis] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAnalyze = async () => {
        setIsLoading(true);
        setAiAnalysis('');
        try {
            const ai = new GoogleGenAI({apiKey: process.env.API_KEY as string});
            const prompt = `You are an expert financial engineer and risk analyst. Analyze the following custom financial instrument created by a user. Provide a concise risk/reward summary in 3 bullet points: one on potential upside, one on key risks, and one on its suitability for a specific investor profile. Instrument Details: Type=${instrument.name}, Principal=$${params.principal}, Term=${params.term} years, Risk Profile (1-5)=${params.risk}.`;
            const response = await ai.models.generateContent({model: 'gemini-2.5-flash', contents: prompt});
            setAiAnalysis(response.text.replace(/•/g, '\n•'));
        } catch(err) {
            setAiAnalysis("Could not generate analysis. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-4xl w-full border border-gray-700" onClick={e=>e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700 flex justify-between items-center"><h3 className="text-lg font-semibold text-white">Workbench: {instrument.name}</h3><button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button></div>
                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[80vh] overflow-y-auto">
                    <div className="space-y-4">
                        <h4 className="font-semibold text-cyan-300">Parameters</h4>
                        <ParameterSlider label="Principal Amount" value={params.principal} min={1000} max={100000} step={1000} onChange={v => setParams(p => ({...p, principal: v}))} format={v => `$${v.toLocaleString()}`} />
                        <ParameterSlider label="Term (Years)" value={params.term} min={1} max={30} step={1} onChange={v => setParams(p => ({...p, term: v}))} format={v => `${v} Years`} />
                        <ParameterSlider label="Risk Profile" value={params.risk} min={1} max={5} step={1} onChange={v => setParams(p => ({...p, risk: v}))} format={v => ['Conservative', 'Balanced', 'Moderate', 'Aggressive', 'Speculative'][v-1]} />
                    </div>
                    <div className="space-y-4">
                         <h4 className="font-semibold text-cyan-300">AI Analyst</h4>
                         <Card>
                            <div className="min-h-[150px]">
                                {isLoading && <p>Analyzing...</p>}
                                {aiAnalysis && <p className="text-sm text-gray-300 whitespace-pre-line">{aiAnalysis}</p>}
                                {!isLoading && !aiAnalysis && <p className="text-sm text-gray-500">Define your parameters and click "Analyze" for an AI-powered risk/reward summary.</p>}
                            </div>
                         </Card>
                         <button onClick={handleAnalyze} disabled={isLoading} className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg disabled:opacity-50">{isLoading ? 'Analyzing...' : 'Analyze with AI'}</button>
                    </div>
                </div>
                <div className="p-4 bg-gray-900/50 border-t border-gray-700 flex justify-end">
                    <button onClick={() => alert(`Minting ${instrument.name} with principal $${params.principal}...`)} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg">Mint Instrument</button>
                </div>
            </div>
        </div>
    );
};

const ParameterSlider: React.FC<{label: string, value: number, min: number, max: number, step: number, onChange: (value: number) => void, format: (value: number) => string}> = ({ label, value, min, max, step, onChange, format }) => (
    <div>
        <div className="flex justify-between items-baseline mb-1"><label className="block text-sm font-medium text-gray-300">{label}</label><span className="text-sm font-mono text-cyan-300">{format(value)}</span></div>
        <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-cyan" />
    </div>
);

const ForgeIcon: React.FC<{type: string}> = ({ type }) => {
    const icons: {[key: string]: React.ReactNode} = {
        'shield-check': <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" /></svg>,
        'trending-up': <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-3.75-.625m3.75.625V18" /></svg>,
        'cube-transparent': <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>,
        'globe-alt': <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 01-9-9 9 9 0 019-9m9 9a9 9 0 01-9 9v0m0-9h.01M12 3a9 9 0 010 18v0m0-18c-5.093 0-9 4.047-9 9.062v.038c0 1.63.45 3.16 1.255 4.512m15.49-4.55a9.04 9.04 0 01-15.49 0" /></svg>,
        'user-group': <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.952a4.5 4.5 0 011.88-3.762A4.5 4.5 0 0118 15.75m-9.548-2.818a4.5 4.5 0 00-1.88-3.762A4.5 4.5 0 006 15.75m0 0v1.5m0-1.5a4.5 4.5 0 011.12-3.186m-1.12 3.186a4.5 4.5 0 00-1.12 3.186" /></svg>,
        'flag': <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 3v8.186m-1.026-.816A59.768 59.768 0 016.731 15.05L6 12zm0 0l-2.731 8.874c-.388.256-.837.44-1.31.572L6 12zm0 0l3.974 2.82c.441.313.94.498 1.468.498h.008c.527 0 1.027-.185 1.468-.498L18 12m-12 0l6 4.243" /></svg>,
    };
    return icons[type] || null;
};

export default FinancialInstrumentForgeView;