
import React, { useState, useContext } from 'react';
import Card from './Card';
import { DataContext } from '../context/DataContext';
import { 
    Activity, ShieldCheck, UserCheck, Eye, Search, 
    ArrowRight, Lock, Database, Globe
} from 'lucide-react';

const PlaidMainDashboard: React.FC = () => {
    const { plaidProducts, deductCredits } = useContext(DataContext)!;

    const handleVerification = () => {
        if (deductCredits(2500)) {
            alert("Identity Verification sequence initiated. Cost: 2500 SC.");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 h-full">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-800 pb-8">
                <div>
                    <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter">Plaid Nexus</h1>
                    <p className="text-blue-400 text-sm font-mono mt-1 tracking-[0.3em] uppercase">Data Network Core // Signal Path-02</p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 px-6 py-3 rounded-2xl flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Protocol Sync: 100%</span>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-8">
                    <Card title="Data Ingress Inventory">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {plaidProducts.map(product => (
                                <div key={product} className="p-4 bg-gray-900 border border-gray-800 rounded-2xl flex items-center justify-between group hover:border-blue-500/30 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-gray-800 rounded-xl text-blue-400 group-hover:text-white transition-colors">
                                            <Database size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white uppercase tracking-tight">{product}</p>
                                            <p className="text-[10px] text-gray-500 font-mono">NODE_ACTIVE // VERSION_2.0</p>
                                        </div>
                                    </div>
                                    <div className="px-2 py-1 bg-green-500/10 rounded text-[8px] font-bold text-green-400 border border-green-500/20 uppercase">Operational</div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card title="Identity Verification Pipeline">
                        <div className="flex flex-col items-center justify-center py-10 space-y-6 text-center">
                            <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20 shadow-inner">
                                <UserCheck size={40} className="text-blue-400" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white uppercase italic tracking-tighter">Zero-Friction Identity Match</h3>
                                <p className="text-gray-400 text-sm max-w-md mx-auto">
                                    Perform high-fidelity KYC checks across the network using Plaid IDV. Encrypted handshake ensures absolute privacy.
                                </p>
                            </div>
                            <button 
                                onClick={handleVerification}
                                className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 transition-all uppercase tracking-[0.2em] text-xs"
                            >
                                Initiate IDV Scan (2500 SC)
                            </button>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    <Card title="CRA Monitoring Telemetry" className="border-l-4 border-amber-500">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                                <span className="text-[10px] font-bold text-gray-500 uppercase">Insights Generated</span>
                                <span className="text-white font-mono text-xs">1,204</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                                <span className="text-[10px] font-bold text-gray-500 uppercase">Alert Threshold</span>
                                <span className="text-amber-400 font-mono text-xs">85.0%</span>
                            </div>
                            <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/20 text-xs text-amber-200/70 italic font-mono leading-relaxed">
                                "Consumer Report Agency vectors indicate a 12% probability shift in localized credit resonance."
                            </div>
                        </div>
                    </Card>

                    <Card title="Data Topology Network">
                        <div className="h-48 bg-black/40 rounded-2xl border border-gray-800 flex flex-col items-center justify-center relative overflow-hidden">
                            <Globe size={64} className="text-gray-800 animate-spin-slow" />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent"></div>
                            <p className="absolute bottom-4 text-[10px] text-blue-400 font-mono tracking-widest animate-pulse">SNIFFING_NETWORK_MESH...</p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PlaidMainDashboard;
