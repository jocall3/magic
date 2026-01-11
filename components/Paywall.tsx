// components/Paywall.tsx
import React from 'react';
import Card from './Card';
import type { FeatureDetails } from '../types';

const ValueIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>;
const LogicIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.875 21l2.522-2.522m0 0a3.375 3.375 0 004.772-4.772 3.375 3.375 0 00-4.772 4.772zM19.125 5l-2.522 2.522m0 0a3.375 3.375 0 01-4.772-4.772 3.375 3.375 0 014.772 4.772zM12 12l2.522 2.522" /></svg>;
const KeyIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.623 5.873M15 7A6 6 0 002.377 8.373M15 7a2 2 0 00-2-2H9a2 2 0 00-2 2" /></svg>;
const ScaleIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.002 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.002 0M18 7l3 9m-3-9l-6-2" /></svg>;

const InfoBlock: React.FC<{ icon: React.ReactNode, title: string, text: string }> = ({ icon, title, text }) => (
    <div className="flex items-start gap-4 p-4 bg-gray-900/40 rounded-lg border border-gray-700/30">
        <div className="flex-shrink-0 w-10 h-10 bg-cyan-500/10 rounded-full flex items-center justify-center text-cyan-400 border border-cyan-500/20">{icon}</div>
        <div>
            <h4 className="font-semibold text-gray-200 text-sm mb-1">{title}</h4>
            <p className="text-xs text-gray-400 leading-relaxed">{text}</p>
        </div>
    </div>
);

interface PaywallProps {
    details: FeatureDetails;
    onUnlock: () => void;
}

/**
 * @description The Paywall component is the threshold to premium reality. 
 * It presents a compelling value proposition to the sovereign, demanding
 * a commitment of "attention" to unlock higher-dimensional tools.
 */
const Paywall: React.FC<PaywallProps> = ({ details, onUnlock }) => {
    return (
        <div className="w-full max-w-2xl mx-auto p-4 animate-in fade-in zoom-in duration-300">
            <Card variant="outline" className="overflow-hidden border-cyan-500/30">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-indigo-600"></div>
                
                <div className="text-center py-6">
                    <div className="inline-block px-3 py-1 mb-4 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold tracking-widest uppercase border border-cyan-500/20">
                        Attention Mandate Required
                    </div>
                    <h2 className="text-4xl font-bold text-white tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                       {details.appName}
                    </h2>
                    <p className="text-gray-500 mt-2 text-sm max-w-sm mx-auto italic">
                        "To command a new reality, one must first invest the currency of focus."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <InfoBlock 
                        icon={<ValueIcon />} 
                        title="Intrinsic Value" 
                        text={`Relative Worth: $${details.price}/mo. This module provides significant cognitive leverage.`} 
                    />
                    <InfoBlock 
                        icon={<LogicIcon />} 
                        title="Valuation Logic" 
                        text={details.valuationLogic} 
                    />
                    <InfoBlock 
                        icon={<KeyIcon />} 
                        title="Implementation" 
                        text={details.implementationEssentials} 
                    />
                    <InfoBlock 
                        icon={<ScaleIcon />} 
                        title="Sovereign Scaling" 
                        text={details.scalability} 
                    />
                </div>
                
                <div className="mt-10 mb-4">
                    <button 
                        onClick={onUnlock} 
                        className="group relative w-full overflow-hidden rounded-xl bg-cyan-600 py-4 font-bold text-white shadow-lg transition-all hover:bg-cyan-500 active:scale-[0.98]"
                    >
                        <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-20deg] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out"></div>
                        <span className="relative flex items-center justify-center gap-2 tracking-widest uppercase text-sm">
                            Click to pay attention
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </span>
                    </button>
                    <p className="text-center text-[10px] text-gray-600 mt-4 uppercase tracking-tighter">
                        Investment of focus constitutes agreement to the Sovereign's Ledger Covenants
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default Paywall;
