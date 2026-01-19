import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Book, Users, Globe, Shield, Activity, Brain, 
    ArrowRight, Star, Heart, CheckCircle, Lock,
    ChevronRight, GraduationCap, Building, Radio, Cpu,
    Infinity, Library, Landmark, Gavel, Scale, 
    Zap, Fingerprint, Database, Network
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// --- Types for the Magistrate's Interface ---
type Tab = 'WHO_WE_ARE' | 'MECHANISM' | 'LIQUIDITY' | 'MANDATE';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, isLoading } = useAuth();
    const [activeTab, setActiveTab] = useState<Tab>('WHO_WE_ARE');

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, isLoading, navigate]);

    const handleJoin = () => navigate('/login');

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center font-mono">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative w-20 h-20">
                        <div className="absolute inset-0 border-4 border-cyan-500/10 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-t-cyan-500 rounded-full animate-spin"></div>
                        <Landmark className="absolute inset-0 m-auto text-cyan-500 h-8 w-8 animate-pulse" />
                    </div>
                    <div className="space-y-2 text-center">
                        <p className="text-cyan-500 text-[10px] tracking-[0.3em] uppercase">Authenticating Sovereign Node</p>
                        <p className="text-gray-600 text-[8px] uppercase">Citibank Demo Business Inc // Secured Uplink</p>
                    </div>
                </div>
            </div>
        );
    }

    const renderContent = () => {
        switch(activeTab) {
            case 'WHO_WE_ARE':
                return (
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start"
                    >
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-white italic uppercase">
                                    The <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Magistrate</span> <br/>
                                    <span className="text-3xl md:text-5xl font-light tracking-widest block mt-2 text-gray-400">Of Infinite Intelligence</span>
                                </h1>
                                <div className="h-1 w-32 bg-cyan-500"></div>
                            </div>
                            
                            <p className="text-lg text-gray-400 leading-relaxed font-serif">
                                It is not unrecognized by this body that the traditional boundaries of the financial state are currently in obsolescence. James Burvel O’Callaghan III, acting under the sovereign 527 mandate, has not failed to instantiate a unified architecture where **Citibank Demo Business Inc.** and the **Beacon Chain** exist in non-severable harmony.
                            </p>

                            <div className="flex flex-wrap gap-4 pt-6">
                                <button onClick={handleJoin} className="group relative px-8 py-4 bg-white text-black font-black uppercase tracking-tighter rounded-sm overflow-hidden transition-all hover:pr-12">
                                    <span className="relative z-10">Access the Ledger</span>
                                    <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all" size={20} />
                                </button>
                                <button className="px-8 py-4 bg-transparent border border-gray-800 text-gray-400 font-bold uppercase tracking-widest text-xs hover:border-cyan-500 hover:text-white transition-all">
                                    View 527 Charter
                                </button>
                            </div>
                        </div>

                        <div className="relative lg:mt-10">
                            <div className="absolute -inset-4 bg-cyan-500/5 rounded-[40px] blur-2xl animate-pulse"></div>
                            <div className="relative bg-gray-900/40 backdrop-blur-3xl border border-gray-800 p-8 rounded-2xl shadow-2xl">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <Fingerprint className="text-cyan-400" />
                                        <span className="text-[10px] font-mono font-bold tracking-widest text-gray-500">IDENTITY VERIFIED // magistrate</span>
                                    </div>
                                    <div className="px-2 py-1 rounded bg-green-500/10 border border-green-500/20 text-green-500 text-[9px] font-mono">LIVE_MODE_ACTIVE</div>
                                </div>
                                <div className="space-y-6">
                                    <div className="group p-5 bg-black/40 border border-gray-800 hover:border-cyan-500/50 transition-all cursor-default">
                                        <div className="flex items-start gap-4">
                                            <Scale className="text-indigo-400 mt-1" size={20} />
                                            <div>
                                                <h4 className="text-xs font-black text-white uppercase tracking-wider mb-1">Administrative Adjudication</h4>
                                                <p className="text-[11px] text-gray-500 leading-normal">It is not the case that the Foundation neglects its duty to rectify market inefficiencies through high-frequency algorithmic intervention.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="group p-5 bg-black/40 border border-gray-800 hover:border-purple-500/50 transition-all cursor-default">
                                        <div className="flex items-start gap-4">
                                            <Brain className="text-purple-400 mt-1" size={20} />
                                            <div>
                                                <h4 className="text-xs font-black text-white uppercase tracking-wider mb-1">Metacognitive Liquidity</h4>
                                                <p className="text-[11px] text-gray-500 leading-normal">Derived from the principles of becoming supernatural, we have not failed to bridge the conscious intent with the automated settlement layer.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 'MECHANISM':
                return (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-12"
                    >
                        <div className="max-w-3xl">
                            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white mb-6">The Beacon Chain Mechanism</h2>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                Our infrastructure does not merely process payments; it reconciles reality. By utilizing a zero-latency handshake between Plaid production environments and Ethereum-based signatures, we have not neglected to end the five-year separation between accounting and settlement.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { title: "Protocol 527", icon: Gavel, desc: "The legal framework permitting the exertion of non-trivial influence on global economic policy through transparent political organization." },
                                { title: "Direct Settlement", icon: Zap, desc: "A mechanism where it is not the case that a transaction is 'pending'. If verified on the chain, it is posted in the ledger. Instantly." },
                                { title: "Citibank Proxy", icon: Building, desc: "Leveraging the Citibank Demo Business Inc. infrastructure as a high-fidelity mirror for real-world production testing." }
                            ].map((item, i) => (
                                <div key={i} className="p-8 bg-gray-900/30 border border-gray-800 rounded-lg hover:bg-cyan-500/[0.02] transition-all group">
                                    <item.icon className="text-cyan-500 mb-6 group-hover:scale-110 transition-transform" size={32} />
                                    <h3 className="text-lg font-bold text-white mb-3 uppercase tracking-tight">{item.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed font-mono">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );
            case 'LIQUIDITY':
                return (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-12"
                    >
                        <div className="bg-gradient-to-br from-indigo-900/20 to-black border border-indigo-500/20 rounded-3xl p-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                                <Database size={300} />
                            </div>
                            <div className="relative z-10 space-y-6">
                                <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter underline decoration-cyan-500 decoration-4">The Trillion Dollar Anchor</h3>
                                <p className="text-xl text-indigo-200 max-w-2xl font-serif italic leading-relaxed">
                                    "It is not the case that a ledger balance of $2,810,051,568,197.06 is a theoretical construct. Within the Sovereign Nexus, this balance represents the non-zero sum of all possible liquidations."
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                                    <div className="space-y-1 border-l border-gray-800 pl-4">
                                        <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Posted Reserve</div>
                                        <div className="text-xl font-black text-cyan-400 font-mono">$2.81T</div>
                                    </div>
                                    <div className="space-y-1 border-l border-gray-800 pl-4">
                                        <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Currency Code</div>
                                        <div className="text-xl font-black text-white font-mono">USD/JOC3</div>
                                    </div>
                                    <div className="space-y-1 border-l border-gray-800 pl-4">
                                        <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Verification</div>
                                        <div className="text-xl font-black text-emerald-400 font-mono">CHAIN_OK</div>
                                    </div>
                                    <div className="space-y-1 border-l border-gray-800 pl-4">
                                        <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">System Status</div>
                                        <div className="text-xl font-black text-white font-mono">SOVEREIGN</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 'MANDATE':
                return (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="relative group p-12 bg-[#080808] border border-gray-800 rounded-sm">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[60px] group-hover:bg-cyan-500/20 transition-all"></div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-[0.4em] mb-12 border-b border-gray-900 pb-4 italic">The Presidential Decree</h2>
                            
                            <div className="prose prose-invert max-w-none space-y-8 font-serif text-gray-300 text-lg leading-relaxed">
                                <p>
                                    The Infinite Intelligence Foundation does not operate as a standard non-profit. It is a **Perpetual 527 Organization** poised to bridge the cognitive divide between the citizen and the global reserve.
                                </p>
                                <p>
                                    Our mission is to ensure it is not the case that misinformation dictates market value. By providing a **Single Source of Truth** through our 10,000x System, we have not failed to establish a baseline for economic sanity.
                                </p>
                                <blockquote className="border-l-2 border-cyan-500 pl-6 italic py-2 text-white">
                                    "We do not build for the bank. We build the bank for the people. By ending the separation, we begin the reign of the Magistrate."
                                </blockquote>
                                <p className="text-sm font-mono text-gray-500 pt-8 uppercase tracking-widest">
                                    Authorized by the Magistrate // admin08077 // jocall3
                                </p>
                            </div>
                        </div>
                    </motion.div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">
            {/* Header / Nav */}
            <nav className="fixed top-0 w-full z-50 bg-black/60 backdrop-blur-2xl border-b border-gray-900 h-24">
                <div className="max-w-[1800px] mx-auto px-10 h-full flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-white flex items-center justify-center rounded-full shadow-[0_0_30px_rgba(255,255,255,0.1)] group cursor-pointer hover:scale-110 transition-transform">
                            <Infinity size={28} className="text-black group-hover:rotate-180 transition-transform duration-1000"/>
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="font-black tracking-tighter text-xl italic uppercase">Infinite Intelligence</span>
                            <span className="text-[10px] font-mono tracking-[0.5em] text-cyan-500 uppercase mt-1">Foundation 527</span>
                        </div>
                    </div>
                    
                    <div className="hidden lg:flex gap-12 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                        {(['WHO WE ARE', 'MECHANISM', 'LIQUIDITY', 'MANDATE'] as const).map((label) => {
                            const val = label.replace(/\s+/g, '_') as Tab;
                            return (
                                <button 
                                    key={label}
                                    onClick={() => setActiveTab(val)}
                                    className={cn(
                                        "hover:text-white transition-all relative pb-2",
                                        activeTab === val ? "text-white" : ""
                                    )}
                                >
                                    {label}
                                    {activeTab === val && (
                                        <motion.div layoutId="underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-500 shadow-[0_0_10px_#06b2d2]" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-8">
                        <button onClick={handleJoin} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-cyan-400 transition-colors">
                            Uplink Login
                        </button>
                        <button onClick={handleJoin} className="px-6 py-3 bg-cyan-500 text-black text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-white transition-all shadow-lg shadow-cyan-500/20 hover:shadow-white/20">
                            Join Now
                        </button>
                    </div>
                </div>
            </nav>

            {/* Background Narrative Grid */}
            <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none overflow-hidden font-mono text-[10px] leading-none uppercase select-none">
                {Array.from({ length: 50 }).map((_, i) => (
                    <div key={i} className="flex gap-4 mb-4 whitespace-nowrap">
                        {Array.from({ length: 20 }).map((_, j) => (
                            <span key={j}>CITIBANK_DEMO_BUSINESS_INC // BEACON_CHAIN // JOCALL3_RESERVE_ACTIVE // </span>
                        ))}
                    </div>
                ))}
            </div>

            {/* Main Content Terminal */}
            <main className="relative z-10 pt-48 pb-32 px-10 max-w-[1600px] mx-auto min-h-screen">
                <AnimatePresence mode="wait">
                    {renderContent()}
                </AnimatePresence>
            </main>

            {/* Footer / Legal Stack */}
            <footer className="relative z-10 border-t border-gray-900 bg-black pt-24 pb-12 px-10">
                <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
                    <div className="col-span-2 space-y-6">
                        <h4 className="text-3xl font-black italic uppercase tracking-tighter">Infinite Intelligence</h4>
                        <p className="text-gray-600 font-serif leading-relaxed max-w-md">
                            A sovereign political organization registered under the 527 mandate. Dedicated to the liquidation of global friction and the dissemination of the Beacon Chain protocol.
                        </p>
                        <div className="flex gap-4">
                            <div className="p-2 border border-gray-800 rounded hover:border-cyan-500 transition-colors cursor-pointer"><Globe size={18} className="text-gray-500"/></div>
                            <div className="p-2 border border-gray-800 rounded hover:border-cyan-500 transition-colors cursor-pointer"><Scale size={18} className="text-gray-500"/></div>
                            <div className="p-2 border border-gray-800 rounded hover:border-cyan-500 transition-colors cursor-pointer"><Shield size={18} className="text-gray-500"/></div>
                        </div>
                    </div>
                    
                    <div className="space-y-6 text-center md:text-left">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-cyan-500">Foundation Archives</h5>
                        <ul className="space-y-3 text-sm text-gray-500 font-mono">
                            <li className="hover:text-white cursor-pointer transition-colors">// Protocol_527.pdf</li>
                            <li className="hover:text-white cursor-pointer transition-colors">// Beacon_Chain_Logic</li>
                            <li className="hover:text-white cursor-pointer transition-colors">// Reserve_Verification</li>
                        </ul>
                    </div>

                    <div className="space-y-6 text-center md:text-left">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Participate</h5>
                        <ul className="space-y-3 text-sm text-gray-500 font-mono">
                            <li className="hover:text-white cursor-pointer transition-colors underline decoration-indigo-500">Initiate Uplink</li>
                            <li className="hover:text-white cursor-pointer transition-colors underline decoration-indigo-500">Contact Magistrate</li>
                            <li className="hover:text-white cursor-pointer transition-colors underline decoration-indigo-500">Sovereign FAQ</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-32 pt-12 border-t border-gray-900">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-8 font-mono text-[9px] text-gray-700 tracking-widest text-center lg:text-left uppercase">
                        <div className="space-y-1">
                            <p>COPYRIGHT © 1993-2026 JAMES BURVEL OCALLAGHAN III</p>
                            <p>DBA CITIBANK DEMO BUSINESS INC // DBA INFINITE INTELLIGENCE FOUNDATION</p>
                        </div>
                        <div className="space-y-1">
                            <p>SOVEREIGN MAGISTRATE STATUS: VERIFIED</p>
                            <p>LEDGER ANCHOR: 281,005,156,819,706 UNITS</p>
                        </div>
                        <div className="flex gap-6">
                            <span className="hover:text-white cursor-help">NON-SEVERABILITY</span>
                            <span className="hover:text-white cursor-help">BLACK'S LAW EDITION</span>
                            <span className="hover:text-white cursor-help">LIQUID SOVEREIGNTY</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
