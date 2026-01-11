
import React, { useState, useContext, useEffect } from 'react';
import Card from './Card';
import { DataContext } from '../context/DataContext';
import { View, PaymentRail, Transaction } from '../types';
import { BiometricModal, SecurityAuditDisplay, SecurityAuditResult } from './payment-components';
import { Send, Zap, ShieldCheck, Database, History, Terminal } from 'lucide-react';

const SendMoneyView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("SendMoneyView must be used within a DataProvider");
    const { addTransaction, setActiveView } = context;

    const [amount, setAmount] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<PaymentRail>('quantumpay');
    const [showBiometricModal, setShowBiometricModal] = useState(false);
    const [securityAudit, setSecurityAudit] = useState<SecurityAuditResult | null>(null);
    const [currentStep, setCurrentStep] = useState(1);

    useEffect(() => {
        const auditTimeout = setTimeout(() => {
            if (parseFloat(amount) > 0 && recipientName) {
                setSecurityAudit({
                    riskScore: parseFloat(amount) > 5000 ? 60 : 10,
                    fraudProbability: 0.01,
                    amlCompliance: 'pass',
                    sanctionScreening: 'pass',
                    quantumSignatureIntegrity: 'verified',
                    recommendations: parseFloat(amount) > 5000 ? ["High value transaction. AI monitoring active."] : ["Optimal route confirmed."],
                    complianceAlerts: [],
                    threatVectorAnalysis: []
                });
            } else {
                setSecurityAudit(null);
            }
        }, 800);
        return () => clearTimeout(auditTimeout);
    }, [amount, recipientName]);

    const handleSendClick = () => {
        if (currentStep === 1) setCurrentStep(2);
        else if (currentStep === 2) setShowBiometricModal(true);
    };

    const handleSuccess = async () => {
        const newTx: Transaction = {
            id: `tx_${Date.now()}`,
            type: 'expense',
            category: 'Transfer',
            description: `Sent to ${recipientName} via ${paymentMethod}`,
            amount: parseFloat(amount),
            date: new Date().toISOString().split('T')[0],
            carbonFootprint: 0.5,
            aiCategoryConfidence: 1.0
        };
        await addTransaction(newTx);
        setShowBiometricModal(false);
        setActiveView(View.Dashboard);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
            <header className="flex justify-between items-end border-b border-gray-800 pb-6">
                <div>
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Quantum Pay Portal</h2>
                    <p className="text-gray-400 text-sm font-mono tracking-widest mt-1">RAIL_ID: {paymentMethod.toUpperCase()} // STATUS: ENCRYPTED</p>
                </div>
                <div className="flex gap-2">
                    <div className="px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-lg flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase">
                        <Database size={14} /> Settlement: Instant
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7">
                    <Card title={currentStep === 1 ? "Initiate Flow" : "Security Verification"}>
                        <div className="space-y-6 pt-4">
                            {currentStep === 1 ? (
                                <>
                                    <div className="space-y-1">
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Destination Identifier</label>
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                value={recipientName} 
                                                onChange={e => setRecipientName(e.target.value)} 
                                                className="w-full bg-black/40 border border-gray-700 rounded-2xl p-4 text-white focus:ring-1 focus:ring-cyan-500 outline-none font-mono text-lg" 
                                                placeholder="Name, @tag, or Wallet ID" 
                                            />
                                            <Zap className="absolute right-4 top-4 text-gray-700" size={20} />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Magnitude (USD)</label>
                                        <div className="relative">
                                            <input 
                                                type="number" 
                                                value={amount} 
                                                onChange={e => setAmount(e.target.value)} 
                                                className="w-full bg-black/40 border border-gray-700 rounded-2xl p-4 text-white focus:ring-1 focus:ring-cyan-500 outline-none font-mono text-4xl font-black" 
                                                placeholder="0.00" 
                                            />
                                            <span className="absolute right-6 top-6 text-gray-600 font-bold">USD</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Execution Protocol</label>
                                        <select 
                                            value={paymentMethod} 
                                            onChange={e => setPaymentMethod(e.target.value as PaymentRail)} 
                                            className="w-full bg-black/40 border border-gray-700 rounded-2xl p-4 text-white focus:ring-1 focus:ring-cyan-500 outline-none font-mono appearance-none"
                                        >
                                            <option value="quantumpay">QuantumPay (Instant Settlement)</option>
                                            <option value="cashapp">Cash App</option>
                                            <option value="swift_global">SWIFT Global (L1)</option>
                                            <option value="blockchain_dlt">Blockchain DLT</option>
                                        </select>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                                    <div className="bg-gray-900/80 p-8 rounded-[2rem] border border-gray-800 space-y-4 text-center">
                                        <p className="text-xs text-gray-500 uppercase font-black tracking-widest">Awaiting Digital Signature</p>
                                        <div className="text-5xl font-black text-white font-mono tracking-tighter">${parseFloat(amount).toLocaleString()}</div>
                                        <p className="text-cyan-400 font-mono text-sm tracking-tighter">TARGET: {recipientName.toUpperCase()}</p>
                                        <div className="h-px bg-gray-800 w-2/3 mx-auto"></div>
                                        <p className="text-[10px] text-gray-600 font-mono">ESTIMATED_FEE: $0.00 // NETWORK: {paymentMethod.toUpperCase()}</p>
                                    </div>
                                    <SecurityAuditDisplay auditResult={securityAudit} />
                                </div>
                            )}
                            
                            <div className="flex justify-end gap-4 mt-8">
                                {currentStep === 2 && (
                                    <button onClick={() => setCurrentStep(1)} className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-black rounded-2xl transition-all uppercase tracking-widest text-xs">
                                        Back
                                    </button>
                                )}
                                <button 
                                    onClick={handleSendClick} 
                                    disabled={!amount || !recipientName} 
                                    className="px-10 py-4 bg-cyan-600 hover:bg-cyan-500 rounded-2xl text-white font-black shadow-xl shadow-cyan-600/20 transition-all active:scale-95 disabled:opacity-50 uppercase tracking-[0.2em] text-xs flex items-center gap-3"
                                >
                                    {currentStep === 1 ? "Review Protocol" : "Authorize Flow"}
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-5 space-y-6">
                    <Card title="Signal Diagnostics">
                        <div className="space-y-6 py-2">
                            <div className="p-5 bg-gray-950 rounded-2xl border border-gray-800">
                                <p className="text-[10px] text-gray-500 uppercase font-black mb-3 tracking-widest">Network Integrity</p>
                                <div className="grid grid-cols-8 gap-1.5">
                                    {[...Array(8)].map((_, i) => (
                                        <div key={i} className="h-1.5 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.4)] animate-pulse" style={{ animationDelay: `${i * 100}ms` }}></div>
                                    ))}
                                </div>
                            </div>
                            <div className="p-5 bg-gray-950 rounded-2xl border border-gray-800 space-y-4">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="text-emerald-500" size={18} />
                                    <div className="flex-1">
                                        <p className="text-[10px] text-white font-black uppercase">Zero-Knowledge Proofs</p>
                                        <p className="text-[10px] text-gray-500">Identity masking enabled for this route.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Terminal className="text-cyan-500" size={18} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] text-white font-black uppercase">Telemetry Log</p>
                                        <p className="text-[9px] text-gray-600 font-mono truncate">&gt; handshaking with node_{paymentMethod.substring(0, 4)}...</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 bg-indigo-900/10 border border-indigo-500/20 rounded-2xl flex items-center gap-4">
                                <History className="text-indigo-400" />
                                <div>
                                    <p className="text-[10px] text-white font-black uppercase">Recent Synergies</p>
                                    <p className="text-[10px] text-gray-500">3 transfers to this recipient in the last 30 days.</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
            <BiometricModal 
                isOpen={showBiometricModal} 
                onSuccess={handleSuccess} 
                onClose={() => setShowBiometricModal(false)} 
                amount={amount} 
                recipient={recipientName} 
                paymentMethod={paymentMethod} 
                securityContext="personal_finance" 
            />
        </div>
    );
};

export default SendMoneyView;
