import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    Book, Users, Globe, Shield, Activity, Brain, 
    ArrowRight, Star, Heart, CheckCircle, Lock,
    ChevronRight, GraduationCap, Building, Radio, Cpu,
    Infinity, Library, LayoutDashboard, DollarSign, Zap, Terminal,
    Briefcase, Film, TrendingUp, Settings, Grid, Eye, Code,
    Wallet, Landmark, BarChart3, Fingerprint
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { DataContext } from '../context/DataContext';
import Card from './Card'; 
import { View } from '../types';

// Define the structure for a portal link
interface PortalLink {
    title: string;
    description: string;
    icon: React.FC<any>;
    color: string;
    path: string; // URL path or View enum key
    isExternal?: boolean;
    view?: View;
}

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const dataContext = useContext(DataContext);

    if (!authContext || !dataContext) {
        // Should not happen if App.tsx structure is correct
        return <div>Error: Contexts not loaded.</div>;
    }

    const { isAuthenticated, isLoading } = authContext;
    const { setActiveView } = dataContext;

    // Automatically redirect to dashboard if already logged in
    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, isLoading, navigate]);

    const handleNavigation = (link: PortalLink) => {
        if (link.isExternal) {
            window.open(link.path, '_blank');
        } else if (link.view) {
            setActiveView(link.view);
            navigate('/app');
        } else {
            navigate(link.path);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                    <p className="text-cyan-500 font-mono text-xs animate-pulse">VERIFYING NEURAL LINK...</p>
                </div>
            </div>
        );
    }

    if (isAuthenticated) {
        // If authenticated but not yet redirected, show a brief loading state
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                    <p className="text-indigo-500 font-mono text-xs animate-pulse">REDIRECTING TO NEXUS OS...</p>
                </div>
            </div>
        );
    }

    const handleLogin = () => navigate('/login');

    const CORE_SYSTEMS: PortalLink[] = [
        {
            title: "The Book (527 Protocol)",
            description: "The foundational legal and philosophical text. Access the source code of influence.",
            icon: Book,
            color: "text-red-400",
            path: '/app',
            view: View.TheBook,
        },
        {
            title: "The Vision (Strategic Mandate)",
            description: "High-level objectives, long-term planning, and global impact metrics.",
            icon: Eye,
            color: "text-cyan-400",
            path: '/app',
            view: View.TheVision,
        },
        {
            title: "Blueprints (Zeitgeist & WorldBuilder)",
            description: "Architectural plans for future systems, governance models, and AI deployment.",
            icon: Code,
            color: "text-green-400",
            path: '/app',
            view: View.DeveloperHub, // Placeholder for Blueprints hub
        },
        {
            title: "MegaDashboard (Infra & Security)",
            description: "Real-time monitoring of infrastructure, compliance, and threat detection systems.",
            icon: Shield,
            color: "text-yellow-400",
            path: '/app',
            view: View.SecurityCenter,
        },
    ];

    const FINANCIAL_PORTALS: PortalLink[] = [
        {
            title: "Personal Finance Nexus",
            description: "Manage individual wealth, budgets, investments, and credit health.",
            icon: Wallet,
            color: "text-indigo-400",
            path: '/app',
            view: View.Dashboard,
        },
        {
            title: "Corporate Command Center",
            description: "Treasury management, corporate actions, and global financial reporting.",
            icon: Briefcase,
            color: "text-purple-400",
            path: '/app',
            view: View.CorporateCommand,
        },
        {
            title: "Wealth Timeline (Legacy Builder)",
            description: "Long-term planning, tax optimization, and philanthropic strategy.",
            icon: TrendingUp,
            color: "text-emerald-400",
            path: '/app',
            view: View.LegacyBuilder,
        },
        {
            title: "Investment Matrix",
            description: "Access to Algo Trading, Forex, Commodities, and Venture Capital desks.",
            icon: BarChart3,
            color: "text-orange-400",
            path: '/app',
            view: View.Investments,
        },
    ];

    const UTILITY_MODULES: PortalLink[] = [
        {
            title: "Voice Control (AI Assistant)",
            description: "Interact with the Nexus OS using natural language commands.",
            icon: Radio,
            color: "text-pink-400",
            path: '/app',
            view: View.VoiceControl,
        },
        {
            title: "AI Module Collection",
            description: "Explore external, experimental AI applications and sandboxes.",
            icon: Terminal,
            color: "text-cyan-400",
            path: '/modules',
            isExternal: false,
        },
        {
            title: "Settings & Personalization",
            description: "Configure your environment, security, and notification preferences.",
            icon: Settings,
            color: "text-gray-400",
            path: '/app',
            view: View.Settings,
        },
        {
            title: "Plaid & Stripe Nexus",
            description: "Direct access to core financial integration dashboards.",
            icon: Landmark,
            color: "text-lime-400",
            path: '/app',
            view: View.StripeNexus,
        },
    ];

    const PortalCard: React.FC<{ link: PortalLink }> = ({ link }) => (
        <button
            onClick={() => handleNavigation(link)}
            className={`relative flex flex-col p-6 bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-2xl text-left transition-all duration-300 hover:bg-gray-800/90 hover:border-cyan-500/50 group shadow-xl hover:shadow-cyan-500/10`}
        >
            <div className={`w-12 h-12 rounded-xl bg-gray-950/50 flex items-center justify-center mb-4 border border-gray-700/50 ${link.color} group-hover:scale-105 transition-transform`}>
                <link.icon size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{link.title}</h3>
            <p className="text-sm text-gray-400 flex-1">{link.description}</p>
            <div className="mt-4 flex items-center text-sm font-medium text-cyan-500 group-hover:text-cyan-300 transition-colors">
                Enter Portal <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-cyan-500/30 overflow-hidden">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-500/20">
                            <Grid size={24} className="text-white"/>
                        </div>
                        <span className="font-bold tracking-widest text-lg">NEXUS<span className="text-cyan-400">.OS</span></span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <button onClick={handleLogin} className="text-sm font-bold text-cyan-400 hover:text-cyan-300">
                            Log In
                        </button>
                        <button onClick={handleLogin} className="bg-cyan-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-500/20">
                            Access OS
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content - Grand Central Station */}
            <main className="pt-32 pb-20 px-6 max-w-[1400px] mx-auto">
                <header className="text-center mb-16">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 leading-tight tracking-tighter italic font-mono animate-in fade-in slide-in-from-top-8 duration-700">
                        GRAND CENTRAL STATION
                    </h1>
                    <p className="mt-4 text-xl text-gray-400 max-w-3xl mx-auto font-mono">
                        The Sovereign Nexus Operating System. A unified portal to infinite intelligence, financial command, and global infrastructure.
                    </p>
                    <div className="mt-8 flex justify-center">
                        <button onClick={handleLogin} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all transform hover:scale-[1.02] flex items-center gap-2 text-lg">
                            <Fingerprint size={20} /> Authenticate & Enter
                        </button>
                    </div>
                </header>

                {/* Core Systems Grid */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-white mb-8 border-b border-gray-800 pb-3 flex items-center gap-3">
                        <Cpu size={24} className="text-cyan-400" /> Core Foundation Systems
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {CORE_SYSTEMS.map((link, i) => (
                            <PortalCard key={i} link={link} />
                        ))}
                    </div>
                </section>

                {/* Financial Command Grid */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-white mb-8 border-b border-gray-800 pb-3 flex items-center gap-3">
                        <DollarSign size={24} className="text-green-400" /> Financial Command & Wealth Engineering
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {FINANCIAL_PORTALS.map((link, i) => (
                            <PortalCard key={i} link={link} />
                        ))}
                    </div>
                </section>

                {/* Utility & Entertainment Grid */}
                <section>
                    <h2 className="text-3xl font-bold text-white mb-8 border-b border-gray-800 pb-3 flex items-center gap-3">
                        <Zap size={24} className="text-yellow-400" /> Utility & AI Modules
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {UTILITY_MODULES.map((link, i) => (
                            <PortalCard key={i} link={link} />
                        ))}
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-800 bg-black py-12 px-6">
                <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-900 text-center text-xs text-gray-600 font-mono">
                    NEXUS OS // SOVEREIGN INTELLIGENCE PLATFORM // ACCESS RESTRICTED
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;