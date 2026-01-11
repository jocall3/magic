
import React, { useState, useEffect } from 'react';
import { Shield, Fingerprint, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export interface SecurityAuditResult {
    riskScore: number;
    fraudProbability: number;
    amlCompliance: 'pass' | 'fail' | 'manual_review';
    sanctionScreening: 'pass' | 'fail';
    quantumSignatureIntegrity: 'verified' | 'unverified';
    recommendations: string[];
    complianceAlerts: string[];
    threatVectorAnalysis: string[];
}

export const SecurityAuditDisplay: React.FC<{ auditResult: SecurityAuditResult | null }> = ({ auditResult }) => {
    if (!auditResult) return (
        <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800 animate-pulse">
            <p className="text-[10px] text-gray-500 uppercase font-black">AI Security Underwriting...</p>
        </div>
    );

    return (
        <div className="p-4 bg-indigo-950/20 border border-indigo-500/30 rounded-xl space-y-3">
            <div className="flex justify-between items-center">
                <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Risk Analysis</span>
                <span className={`text-xs font-bold ${auditResult.riskScore < 30 ? 'text-green-400' : 'text-yellow-400'}`}>
                    SCORE: {auditResult.riskScore}/100
                </span>
            </div>
            <div className="flex gap-2">
                <div className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase border ${auditResult.amlCompliance === 'pass' ? 'border-green-500/30 text-green-400' : 'border-red-500/30 text-red-400'}`}>
                    AML: {auditResult.amlCompliance}
                </div>
                <div className="px-2 py-0.5 rounded text-[8px] font-bold uppercase border border-cyan-500/30 text-cyan-400">
                    SIG: {auditResult.quantumSignatureIntegrity}
                </div>
            </div>
            {auditResult.recommendations.map((rec, i) => (
                <p key={i} className="text-[10px] text-gray-300 italic">"AI: {rec}"</p>
            ))}
        </div>
    );
};

export const BiometricModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    amount: string;
    recipient: string;
    paymentMethod: string;
    securityContext: string;
}> = ({ isOpen, onClose, onSuccess, amount, recipient }) => {
    const [state, setState] = useState<'idle' | 'scanning' | 'verifying' | 'success'>('idle');

    if (!isOpen) return null;

    const handleScan = () => {
        setState('scanning');
        setTimeout(() => setState('verifying'), 1500);
        setTimeout(() => {
            setState('success');
            setTimeout(onSuccess, 1000);
        }, 3000);
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center backdrop-blur-xl">
            <div className="bg-gray-900 border border-cyan-500/30 rounded-[2.5rem] p-10 max-w-sm w-full text-center shadow-[0_0_50px_rgba(6,182,212,0.2)]">
                {state === 'idle' && (
                    <div className="space-y-6">
                        <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto border border-cyan-500/20">
                            <Fingerprint size={40} className="text-cyan-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white uppercase tracking-tighter">Biometric Authorization</h3>
                        <p className="text-sm text-gray-400">Confirm transfer of <span className="text-white font-bold">${amount}</span> to <span className="text-white font-bold">{recipient}</span></p>
                        <button onClick={handleScan} className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-2xl transition-all">SCAN FINGERPRINT</button>
                        <button onClick={onClose} className="text-xs text-gray-600 hover:text-gray-400 uppercase font-bold tracking-widest">Cancel Protocol</button>
                    </div>
                )}
                {(state === 'scanning' || state === 'verifying') && (
                    <div className="py-10 space-y-6">
                        <Loader2 size={48} className="text-cyan-400 animate-spin mx-auto" />
                        <p className="text-sm font-mono text-cyan-400 animate-pulse uppercase tracking-[0.2em]">
                            {state === 'scanning' ? 'Reading Biometric Hash...' : 'Validating Neural Signature...'}
                        </p>
                    </div>
                )}
                {state === 'success' && (
                    <div className="py-10 space-y-6 animate-in zoom-in duration-300">
                        <CheckCircle2 size={64} className="text-green-500 mx-auto" />
                        <p className="text-lg font-black text-white uppercase">Identity Verified</p>
                    </div>
                )}
            </div>
        </div>
    );
};
