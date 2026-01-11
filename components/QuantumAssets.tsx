
import React, { useState, useEffect, useContext } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { Atom, Zap, Share2, TrendingUp, History, Database, Cpu, Loader2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const QuantumAssets: React.FC = () => {
    const { sovereignCredits, deductCredits } = useContext(DataContext)!;
    const [entanglementLevel, setEntanglementLevel] = useState(87.4);
    const [isSimulating, setIsSimulating] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setEntanglementLevel(prev => Math.min(100, Math.max(0, prev + (Math.random() - 0.5) * 2)));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleSimulate = () => {
        if (!deductCredits(1000)) return;
        setIsSimulating(true);
        setTimeout(() => {
            setIsSimulating(false);
            alert("Capital impact study complete. Network resonance increased by 0.15%.");
        }, 2000);
    };

    const assets = [
        { id: 'cpc', name: 'Community Credits', symbol: 'COM', balance: 45020.55, rate: 12.5, color: '#00f3ff' },
        { id: 'dst', name: 'Public Works Tokens', symbol: 'PUB', balance: 128090.00, rate: 45.2, color: '#bc13fe' },
        { id: 'qbt', name: 'Civic Bonds', symbol: 'BND', balance: 512.00, rate: 0.8, color: '#ffffff' },
        { id: 'nrg', name: 'Green Energy', symbol: 'GRN', balance: 8890.45, rate: 8.4, color: '#00ff9d' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-800 pb-8">
                <div>
                    <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter">Quantum Assets</h1>
                    <p className="text-cyan-400 text-sm font-mono mt-1 tracking-widest uppercase">Distributed Resource Allocation // Core 04</p>
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/30 px-6 py-3 rounded-2xl flex items-center gap-4 shadow-xl">
                    <Atom className="text-cyan-400 animate-spin-slow" />
                    <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Coherence Level</p>
                        <p className="text-xl font-black text-white font-mono">{entanglementLevel.toFixed(2)}%</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card title="Asset Topology (Real-Time)">
                        <div className="h-64 bg-black/40 rounded-2xl border border-gray-800 flex items-center justify-center relative overflow-hidden">
                             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,#00f3ff_0%,transparent_70%)] animate-pulse"></div>
                             <div className="text-center space-y-2 z-10">
                                 <Atom size={48} className="text-cyan-500 mx-auto animate-spin-slow" />
                                 <p className="text-xs text-gray-500 font-mono tracking-tighter uppercase">Analyzing entangled capital vectors...</p>
                             </div>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {assets.map(asset => (
                            <Card key={asset.id} className="relative group overflow-hidden bg-black border-gray-800 hover:border-cyan-500/30 transition-all">
                                <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Database size={100} />
                                </div>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-white tracking-wide">{asset.name}</h3>
                                        <p className="text-xs text-gray-500 font-mono">{asset.symbol}</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-gray-900 border border-gray-800">
                                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: asset.color }}></div>
                                    </div>
                                </div>
                                <p className="text-4xl font-black text-white font-mono tracking-tighter">
                                    {asset.balance.toLocaleString()}
                                </p>
                                <div className="mt-4 flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2 text-green-400">
                                        <TrendingUp size={14} />
                                        <span>+{asset.rate}/sec</span>
                                    </div>
                                    <button className="text-gray-500 hover:text-white transition-colors uppercase font-black tracking-widest text-[10px]">Adjust Flow</button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="space-y-8">
                    <Card title="Simulation Engine">
                        <div className="space-y-6">
                            <p className="text-sm text-gray-400 leading-relaxed italic">
                                "Execute high-fidelity simulations to predict the impact of capital re-allocation across the network nodes."
                            </p>
                            <button 
                                onClick={handleSimulate}
                                disabled={isSimulating}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                            >
                                {isSimulating ? <Loader2 className="animate-spin" /> : <Zap size={18} />}
                                {isSimulating ? 'SIMULATING REALITY...' : 'RUN IMPACT STUDY'}
                            </button>
                            <div className="flex justify-between items-center text-[10px] font-bold text-gray-600 uppercase tracking-widest px-2">
                                <span>Study Cost:</span>
                                <span className="text-indigo-400 font-mono">1,000 SC</span>
                            </div>
                        </div>
                    </Card>

                    <Card title="System Manifest">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Cpu className="text-cyan-400" />
                                <div className="flex-1">
                                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Memory Allocation</p>
                                    <div className="w-full bg-gray-800 h-1.5 rounded-full mt-1">
                                        <div className="bg-cyan-500 h-full w-[45%]"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <History className="text-purple-400" />
                                <div className="flex-1">
                                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">History Buffer</p>
                                    <div className="w-full bg-gray-800 h-1.5 rounded-full mt-1">
                                        <div className="bg-purple-500 h-full w-[12%]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default QuantumAssets;
