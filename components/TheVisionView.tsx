import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Terminal, BookOpen, Code, Network } from 'lucide-react'; 

/**
 * TheVisionView Component
 *
 * This component outlines the core strategic direction and high-level architectural vision
 * for the Sovereign Nexus platform, serving as the project's manifesto. It links directly
 * to the underlying system blueprints and documentation.
 */
const TheVisionView: React.FC = () => {
    // Constants defining the core guiding principles (Architectural Focus)
    const CORE_TENETS = [
        {
            title: "Sovereign AI Core (SAC)",
            description: "The central cognitive engine ensuring all financial operations are optimized for civic good, stability, and predictive compliance.",
            icon: <Cpu className="w-10 h-10 text-cyan-400" />,
            key: "AI_CORE"
        },
        {
            title: "Immutable Ledger Fabric",
            description: "Achieving verifiable, transparent, and tamper-proof record-keeping across all transactions using distributed ledger principles.",
            icon: <BookOpen className="w-10 h-10 text-emerald-400" />,
            key: "LEDGER"
        },
        {
            title: "Zero-Trust API Gateway",
            description: "All internal and external communication is routed through a secure, high-frequency gateway, enforcing strict access control and regulatory checks.",
            icon: <Terminal className="w-10 h-10 text-red-400" />,
            key: "GATEWAY"
        },
        {
            title: "Universal Interoperability Layer (UIL)",
            description: "Designing modular components that seamlessly integrate with legacy systems (Plaid, Stripe, Citibank) and future quantum protocols.",
            icon: <Network className="w-10 h-10 text-indigo-400" />,
            key: "INTEROP"
        }
    ];

    // Key principles from the project's inception (Manifesto)
    const FOUNDER_MANDATE = {
        name: "The Architect",
        title: "Lead Systems Designer",
        manifesto: [
            "Architecture is the foundation of trust. We build systems that are inherently stable, scalable, and resistant to disruption.",
            "Compliance is not a feature; it is the structure. Our design ensures regulatory adherence is automatic and verifiable at the atomic level.",
            "Modularity ensures longevity. Every component must be capable of independent evolution while maintaining perfect harmony with the whole.",
            "The system must be self-documenting. The blueprint is the code, and the code is the blueprint."
        ],
        key_concept: "Stability through Structure. Compliance through Design."
    };

    // Links to Architectural Blueprints (Mapping to existing views in App.tsx)
    const BLUEPRINT_LINKS = [
        {
            title: "Developer Hub",
            description: "Access the full API documentation, SDKs, and integration guides for external partners.",
            view: 'DeveloperHub',
            icon: <Code className="w-6 h-6" />,
            color: "border-cyan-500"
        },
        {
            title: "Schema Explorer",
            description: "Inspect the canonical data models, object definitions, and relationship graphs of the Nexus OS.",
            view: 'SchemaExplorer',
            icon: <BookOpen className="w-6 h-6" />,
            color: "border-indigo-500"
        },
        {
            title: "Resource Graph Map",
            description: "Visualize the real-time dependency map and operational flow between microservices and external providers.",
            view: 'ResourceGraph',
            icon: <Network className="w-6 h-6" />,
            color: "border-green-500"
        }
    ];

    // Helper function to get the path from the view name (converts PascalCase to kebab-case)
    const getViewPath = (viewName: string) => `/${viewName.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')}`;

    return (
        <div className="space-y-16 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-1000">
            {/* Main Vision Overview */}
            <div className="relative p-10 md:p-16 rounded-[3rem] overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-black border-4 border-cyan-500/50 shadow-[0_0_80px_rgba(6,182,212,0.3)] transform transition duration-1000 hover:scale-[1.005]">
                {/* Background visual effect */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid-vision" width="60" height="60" patternUnits="userSpaceOnUse">
                                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#06B6D4" strokeWidth="0.3"/>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid-vision)" />
                    </svg>
                </div>
                <div className="relative z-10 text-center">
                    <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-indigo-300 tracking-tighter mb-6 drop-shadow-xl font-mono italic">
                        SOVEREIGN NEXUS: ARCHITECTURAL MANIFESTO
                    </h1>
                    <p className="text-2xl md:text-3xl text-gray-300 max-w-4xl mx-auto font-light leading-relaxed border-b-2 border-cyan-500 pb-4 italic">
                        "We are building the operating system for the future of finance—a structure defined by precision, compliance, and cognitive stability."
                    </p>
                    <p className="mt-4 text-lg text-cyan-400 font-medium font-mono">
                        Directive Level 7: System Ingress.
                    </p>
                </div>
            </div>

            {/* Architectural Pillars */}
            <section>
                <h2 className="text-4xl font-bold text-white mb-10 border-b border-gray-700 pb-3 tracking-tight">
                    Core Architectural Pillars
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {CORE_TENETS.map((tenet) => (
                        <div key={tenet.key} className="p-6 bg-gray-900/70 border border-gray-800 rounded-xl shadow-2xl hover:border-cyan-500/50 transition duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center space-x-4 mb-4">
                                {tenet.icon}
                                <h3 className="text-xl font-extrabold text-white tracking-wider">{tenet.title}</h3>
                            </div>
                            <p className="text-sm text-gray-400 leading-relaxed">{tenet.description}</p>
                        </div>
                    ))}
                </div>
            </section>
            
            {/* Blueprints and Documentation Links */}
            <section>
                <h2 className="text-4xl font-bold text-white mb-10 border-b border-gray-700 pb-3 tracking-tight">
                    Access Architectural Blueprints
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {BLUEPRINT_LINKS.map((link, index) => (
                        <Link 
                            key={index} 
                            to={getViewPath(link.view)} 
                            className={`block p-6 bg-gray-900/70 rounded-xl border-l-4 ${link.color} shadow-lg hover:bg-gray-800/80 transition duration-300 group`}
                        >
                            <div className="flex items-center space-x-4 mb-3">
                                <div className="p-2 rounded-full bg-gray-800 group-hover:bg-cyan-900/50 text-cyan-400 transition-colors">
                                    {link.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300">{link.title}</h3>
                            </div>
                            <p className="text-gray-400 text-sm">{link.description}</p>
                        </Link>
                    ))}
                </div>
            </section>


            {/* Project Mandate (Manifesto) */}
            <section>
                <h2 className="text-4xl font-bold text-white mb-8 border-b border-gray-700 pb-3 tracking-tight">
                    The Architect's Mandate
                </h2>
                <div className="bg-gray-900/70 p-8 rounded-2xl border border-gray-800 shadow-xl">
                    <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
                        <p className="text-xl font-semibold text-cyan-400 italic">
                            Lead Systems Designer: {FOUNDER_MANDATE.name}
                        </p>
                        <ul className="list-none p-0 space-y-4">
                            {FOUNDER_MANDATE.manifesto.map((point, index) => (
                                <li key={index} className="flex items-start space-x-3">
                                    <span className="text-2xl font-extrabold text-cyan-500/80 leading-none mt-1">»</span>
                                    <p className="text-lg leading-relaxed text-gray-200">
                                        {point}
                                    </p>
                                </li>
                            ))}
                        </ul>
                        <div className="pt-6 border-t border-gray-700 mt-6">
                            <p className="text-2xl italic font-extrabold text-white font-mono">
                                Core Axiom: <span className="text-emerald-400">{FOUNDER_MANDATE.key_concept}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <div className="text-center pt-10 border-t border-gray-900">
                <p className="text-sm text-gray-600 font-mono">
                    &copy; {new Date().getFullYear()} Sovereign Nexus Systems. Dedicated to architectural integrity and cognitive stability.
                </p>
            </div>
        </div>
    );
};

export default TheVisionView;