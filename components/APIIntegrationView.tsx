
import React, { useContext, useState } from 'react';
import { DataContext, ApiEndpoints } from '../context/DataContext';
import Card from './Card';
import { Globe, Link, ShieldCheck, Database, Terminal, CheckCircle2, Sliders, Network } from 'lucide-react';

const APIIntegrationView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) return null;
    const { apiEndpoints, updateEndpoint } = context;

    const [editKey, setEditKey] = useState<keyof ApiEndpoints | null>(null);
    const [inputValue, setInputValue] = useState('');

    const handleEdit = (key: keyof ApiEndpoints) => {
        setEditKey(key);
        setInputValue(apiEndpoints[key]);
    };

    const handleSave = () => {
        if (editKey) {
            updateEndpoint(editKey, inputValue);
            setEditKey(null);
        }
    };

    const endpointItems = [
        { key: 'citibank' as const, label: 'Citi Connect Core (OAuth)', icon: <Globe className="text-blue-400" /> },
        { key: 'plaid' as const, label: 'Plaid Data Network', icon: <Link className="text-cyan-400" /> },
        { key: 'stripe' as const, label: 'Stripe Financial Rails', icon: <ShieldCheck className="text-indigo-400" /> },
        { key: 'modernTreasury' as const, label: 'Modern Treasury Control', icon: <Database className="text-emerald-400" /> },
        { key: 'gemini' as const, label: 'Gemini AI Core (Quantum)', icon: <Terminal className="text-purple-400" /> },
        { key: 'gein' as const, label: 'GEIN Node Proxy', icon: <Network className="text-pink-400" /> }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="border-b border-gray-800 pb-6">
                <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">Command Control: API Intercept</h1>
                <p className="text-cyan-400 text-sm font-mono mt-1 tracking-[0.3em] uppercase">Logic Overrides // Network Signal Path</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                    <Card title="Active Signal Path (Intercepting Logic)">
                        <div className="space-y-6">
                            <p className="text-xs text-gray-500 font-mono italic p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                                "The Architect designed this panel for zero-latency reconfiguration. Shift traffic between production clusters, sandbox environments, or local proxies instantly. Use this to bypass legacy restrictions."
                            </p>
                            
                            <div className="space-y-4">
                                {endpointItems.map(item => (
                                    <div key={item.key} className="p-5 bg-gray-950 border border-gray-800 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:border-cyan-500/30">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="p-3 bg-gray-900 rounded-xl border border-gray-800 shadow-inner">
                                                {item.icon}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{item.label}</p>
                                                {editKey === item.key ? (
                                                    <input 
                                                        value={inputValue}
                                                        onChange={e => setInputValue(e.target.value)}
                                                        className="bg-black border border-cyan-500/50 rounded-lg px-4 py-2 text-sm text-cyan-400 w-full md:w-[450px] font-mono mt-2 outline-none focus:ring-1 focus:ring-cyan-500"
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <p className="text-white font-mono text-sm mt-1 truncate hover:text-cyan-300 transition-colors">{apiEndpoints[item.key]}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 self-end md:self-center">
                                            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                                                <CheckCircle2 size={12} className="text-green-500" />
                                                <span className="text-[10px] font-bold text-green-500 uppercase">ACTIVE</span>
                                            </div>
                                            {editKey === item.key ? (
                                                <button onClick={handleSave} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black rounded-xl transition-all shadow-lg shadow-cyan-500/20">COMMIT</button>
                                            ) : (
                                                <button onClick={() => handleEdit(item.key)} className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-black rounded-xl transition-all flex items-center gap-2 border border-gray-700">
                                                    <Sliders size={12} /> INTERCEPT
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <Card title="Traffic Diagnostic">
                        <div className="h-64 flex flex-col items-center justify-center border border-dashed border-gray-800 rounded-2xl bg-gray-950/30">
                            <div className="w-16 h-16 border-b-2 border-cyan-500 rounded-full animate-spin mb-4"></div>
                            <p className="text-xs text-gray-600 font-mono uppercase tracking-widest">Sniffing Packets...</p>
                        </div>
                    </Card>
                    <Card title="Sovereign Policy">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-mono border-b border-gray-800 pb-2">
                                <span className="text-gray-500 uppercase">Handshake ID:</span>
                                <span className="text-cyan-400">NEXUS-7-ALPHA</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-mono border-b border-gray-800 pb-2">
                                <span className="text-gray-500 uppercase">Cipher Suite:</span>
                                <span className="text-green-400">ECDHE-RSA-AES256-GCM</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-mono">
                                <span className="text-gray-500 uppercase">Tunnel Status:</span>
                                <span className="text-emerald-400">RE-ENCRYPTED</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default APIIntegrationView;
