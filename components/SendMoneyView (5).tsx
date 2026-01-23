// components/views/personal/SendMoneyView.tsx
// This component manages the multi-step flow for sending money within a modern payment application.
// It focuses on clear, secure, and user-friendly transaction processing.

import React, { useState, useContext, useRef, useEffect, useReducer } from 'react';
import Card from './Card';
import { DataContext } from '../context/DataContext';
import { View } from '../types';
import type { Transaction } from '../types';

// ================================================================================================
// GLOBAL PLATFORM WIDE TYPE DEFINITIONS (SIMPLIFIED FOR CLARITY AND REALISM)
// ================================================================================================

export type PaymentRail = 'bank_transfer' | 'cashapp' | 'swift_global' | 'blockchain_transfer' | 'card_payment';
export type ScanState = 'scanning' | 'success' | 'verifying' | 'error';
export type TransactionStep = 'input' | 'review' | 'processing' | 'success';

export interface RecipientProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  cashtag?: string;
  swiftDetails?: { bankName: string; bic: string; accountNumber: string; };
  blockchainAddress?: string;
  preferredCurrency?: string;
  lastUsedDate?: string;
  trustScore?: number;
  kycStatus?: 'verified' | 'pending' | 'unverified';
  blacklisted?: boolean;
  bankAccounts?: { bankName: string; accountNumber: string; routingNumber?: string; iban?: string; }[];
  eWalletDetails?: { type: 'paypal' | 'venmo' | 'zelle' | 'revolut' | 'cashapp'; identifier: string; }[];
  contactPreferences?: { email: boolean; sms: boolean; push: boolean; };
  relationshipStatus?: 'family' | 'friend' | 'business' | 'self' | 'vendor' | 'partner';
  category?: 'personal' | 'business' | 'charity' | 'government';
  multiEntitySupport?: { parentId: string; subEntities: { id: string; name: string; type: string; }[]; };
  complianceFlags?: ('high_risk' | 'sanctioned_entity' | 'PEP' | 'low_risk' | 'verified_entity')[];
  transactionHistorySummary?: { totalSent: number; totalReceived: number; lastTransaction: string; };
  riskProfile?: 'low' | 'medium' | 'high';
  preferredCommunicationChannel?: 'email' | 'sms' | 'push';
  assetPortfolioSummary?: { totalValue: number; assetClasses: string[]; };
  taxResidencies?: { country: string; taxId: string; }[];
  biometricDataHash?: string;
  lastKnownLocation?: { lat: number; lon: number; timestamp: string; };
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  isCrypto: boolean;
  conversionRate?: number;
  decimalPlaces: number;
  minTransactionAmount?: number;
  maxTransactionAmount?: number;
  liquidityScore?: number;
  marketCap?: number;
  regulatoryStatus?: 'regulated' | 'unregulated' | 'experimental' | 'cbdc';
}

export interface ScheduledPaymentRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'once_on_date';
  startDate: string;
  endDate?: string;
  nextExecutionDate?: string;
  maxExecutions?: number;
  paymentReason?: string;
  notificationOnExecution?: boolean;
}

export interface AdvancedTransactionSettings {
  priority: 'low' | 'normal' | 'high';
  carbonOffsetRatio: number;
  privacyLevel: 'standard' | 'enhanced';
  receiptPreference: 'email' | 'blockchain_proof';
  notificationPreferences: { email: boolean; sms: boolean; push: boolean; };
  dataEncryptionStandard: 'aes256';
  routeOptimizationPreference: 'speed' | 'cost' | 'standard';
  transactionExpiryMinutes?: number;
  regulatoryReportingFlags?: ('FATCA' | 'CRS' | 'AML' | 'CFT' | 'none')[];
}

export interface SecurityAuditResult {
  riskScore: number;
  fraudProbability: number;
  amlCompliance: 'pass' | 'fail' | 'review';
  sanctionScreening: 'pass' | 'fail';
  recommendations: string[];
}

export interface EnvironmentalImpactReport {
    transactionCO2e: number;
    offsetCO2e: number;
    netCO2e: number;
    renewableEnergyUsedPercentage: number;
    recommendations?: string[];
    sustainabilityRating?: 'A' | 'B' | 'C' | 'D' | 'F';
}

export interface RailSpecificDetails {
    swift?: { bankName: string; bic: string; accountNumber: string; beneficiaryAddress: string; intermediaryBankBic?: string; purposeCode?: string; };
    blockchain?: { network: 'ethereum' | 'polygon' | 'solana' | 'other_dlt'; dataPayload?: string; };
}

export interface TransactionSimulationResult {
    expectedArrivalTime: string;
    estimatedFee: number;
    successProbability: number;
}

interface SendMoneyViewProps {
  setActiveView: (view: View) => void;
}

// ================================================================================================
// ANIMATED UI SUB-COMPONENTS (SIMPLIFIED)
// ================================================================================================

export const AnimatedCheckmarkIcon: React.FC = () => (
    <>
        <svg className="h-24 w-24 transform scale-125" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <defs>
                <linearGradient id="checkmarkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4ade80" />
                    <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
            </defs>
            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" stroke="url(#checkmarkGradient)" />
            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
        <style>{`
            .checkmark__circle { stroke-dasharray: 166; stroke-dashoffset: 166; stroke-width: 4; stroke-miterlimit: 10; fill: none; animation: stroke-circle 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards; }
            .checkmark__check { transform-origin: 50% 50%; stroke-dasharray: 48; stroke-dashoffset: 48; stroke-width: 5; stroke: #fff; animation: stroke-check 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards; }
            @keyframes stroke-circle { 100% { stroke-dashoffset: 0; } }
            @keyframes stroke-check { 100% { stroke-dashoffset: 0; } }
        `}</style>
    </>
);

export const ProcessingAnimation: React.FC = () => (
    <div className="flex flex-col items-center justify-center space-y-3">
        <div className="relative w-20 h-20 rounded-full flex items-center justify-center border-2 border-blue-500 animate-spin">
            <div className="w-12 h-12 rounded-full border-2 border-blue-400 animate-ping"></div>
            <div className="absolute w-6 h-6 bg-blue-600 rounded-full animate-pulse"></div>
        </div>
        <p className="text-sm text-blue-300 animate-fade-in-out">Processing Transaction...</p>
    </div>
);


export const SecurityAuditDisplay: React.FC<{ auditResult: SecurityAuditResult | null }> = ({ auditResult }) => {
    if (!auditResult) return <div className="flex items-center space-x-2 text-yellow-400"><svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><span>Performing real-time security audit...</span></div>;

    return (
        <div className="bg-gray-800 p-4 rounded-lg space-y-2 border border-gray-700">
            <h4 className="font-semibold text-lg text-white">Security Audit Report</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
                <p className="text-gray-400">Risk Score:</p><p className={`${auditResult.riskScore > 50 ? 'text-red-400' : 'text-green-400'}`}>{auditResult.riskScore}/100</p>
                <p className="text-gray-400">Fraud Probability:</p><p className={`${(auditResult.fraudProbability * 100).toFixed(2)}%`}</p>
                <p className="text-gray-400">AML Compliance:</p><p className={auditResult.amlCompliance === 'pass' ? 'text-green-400' : 'text-yellow-400'}>{auditResult.amlCompliance}</p>
            </div>
            {auditResult.recommendations.length > 0 && (
                <div className="mt-2 text-sm text-yellow-300">
                    <p className="font-medium">Recommendations:</p>
                    <ul className="list-disc list-inside text-xs text-yellow-200">{auditResult.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}</ul>
                </div>
            )}
        </div>
    );
};

export const BiometricModal: React.FC<{
    isOpen: boolean; onSuccess: () => void; onClose: () => void; amount: string; recipient: RecipientProfile | string; paymentMethod: PaymentRail; securityContext: 'personal' | 'corporate' | 'regulatory'; mfAuthMethods?: ('fingerprint' | 'face')[]; approvalRequiredBy?: string[];
}> = ({ isOpen, onSuccess, onClose, amount, recipient, paymentMethod, securityContext, mfAuthMethods = ['fingerprint'], approvalRequiredBy }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [scanState, setScanState] = useState<ScanState>('scanning');
    const [verificationStep, setVerificationStep] = useState(0);
    const [biometricProgress, setBiometricProgress] = useState(0);
    const [activeAuthMethod, setActiveAuthMethod] = useState(mfAuthMethods[0] || 'face');
    const recipientName = typeof recipient === 'string' ? recipient : recipient.name;

    const verificationMessages = [ `Initializing secure channel with ${paymentMethod}...`, `Validating ${recipientName}'s identity...`, 'Cross-referencing fraud ledgers...', 'Executing on ledger...', 'Confirming consensus...', 'Archiving proof...', 'Final checks...' ];

    useEffect(() => {
        if (!isOpen) { setScanState('scanning'); setVerificationStep(0); setBiometricProgress(0); return; }
        let stream: MediaStream | null = null;
        const startCamera = async () => {
            try { if (activeAuthMethod === 'face') { stream = await navigator.mediaDevices.getUserMedia({ video: true }); if (videoRef.current) videoRef.current.srcObject = stream; } } catch (err) { setScanState('error'); }
        };
        startCamera();
        const scanProgressInterval = setInterval(() => setBiometricProgress(prev => Math.min(prev + Math.random() * 10, 100)), 200);
        const successTimer = setTimeout(() => { setScanState('success'); clearInterval(scanProgressInterval); }, 3000);
        const verifyTimer = setTimeout(() => setScanState('verifying'), 4000);
        const successActionTimer = setTimeout(onSuccess, 8000); // Reduced total time
        return () => { clearTimeout(successTimer); clearTimeout(verifyTimer); clearTimeout(successActionTimer); if (stream) stream.getTracks().forEach(track => track.stop()); clearInterval(scanProgressInterval); };
    }, [isOpen, onSuccess, onClose, activeAuthMethod]);

    useEffect(() => {
        if (['verifying'].includes(scanState)) {
            const interval = setInterval(() => setVerificationStep(prev => Math.min(prev + 1, verificationMessages.length - 1)), 1000); // Faster verification steps
            return () => clearInterval(interval);
        }
    }, [scanState]);

    const getTitle = () => {
        switch (scanState) {
            case 'scanning': return `Scanning ${activeAuthMethod === 'face' ? 'Face' : 'Biometrics'}`;
            case 'success': return 'Identity Confirmed';
            case 'verifying': return 'Verification in Progress';
            case 'error': return 'Verification Failed';
        }
    };

    return (
        <div className={`fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-50 backdrop-blur-lg transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className={`bg-gray-900 rounded-3xl p-8 max-w-lg w-full text-center border-2 border-blue-700 shadow-xl transition-transform duration-500 ${isOpen ? 'translate-y-0 scale-100' : 'translate-y-full scale-90'}`}>
                <h3 className="text-3xl font-extrabold text-white mb-4">{getTitle()}</h3>
                <div className="relative w-72 h-72 mx-auto rounded-full overflow-hidden border-4 border-blue-600 mb-6 shadow-lg">
                    {activeAuthMethod === 'face' ? <video ref={videoRef} autoPlay muted playsInline className="absolute top-0 left-0 w-full h-full object-cover transform scale-x-[-1]"></video> : <div className="absolute inset-0 flex items-center justify-center bg-gray-950 text-gray-500 text-lg"><p>Authenticating {activeAuthMethod}...</p></div>}
                    {scanState === 'scanning' && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent animate-[scanner-line_2.5s_ease-in-out_infinite_alternate]"></div>}
                    {scanState === 'success' && <div className="absolute inset-0 bg-green-500/50 flex items-center justify-center"><AnimatedCheckmarkIcon /></div>}
                    {scanState === 'verifying' && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><ProcessingAnimation /></div>}
                </div>
                {scanState === 'scanning' && <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4"><div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${biometricProgress}%` }}></div></div>}
                <p className="text-gray-300 mt-2 text-md">{['verifying'].includes(scanState) ? verificationMessages[verificationStep] : `Sending $${amount} to ${recipientName}`}</p>
            </div>
            <style>{`@keyframes scanner-line { 0% { transform: translate(-50%, 0) scaleX(0.2); opacity: 0;} 20% {transform: translate(-50%, 25%) scaleX(1); opacity: 1;} 80% {transform: translate(-50%, 75%) scaleX(1); opacity: 1;} 100%{transform: translate(-50%, 100%) scaleX(0.2); opacity: 0;}}`}</style>
        </div>
    );
};

// ================================================================================================
// MAIN VIEW COMPONENT (RE-ARCHITECTED WITH useReducer and Multi-Step Flow)
// ================================================================================================

type State = {
    step: TransactionStep;
    amount: string;
    recipientName: string;
    paymentMethod: PaymentRail;
    advancedSettings: AdvancedTransactionSettings;
    securityAudit: SecurityAuditResult | null;
    showBiometricModal: boolean;
    lastTransactionId: string | null;
};

type Action =
    | { type: 'SET_FIELD'; field: keyof State; payload: any }
    | { type: 'SET_ADVANCED_SETTING'; field: keyof AdvancedTransactionSettings; payload: any }
    | { type: 'NEXT_STEP' }
    | { type: 'PREVIOUS_STEP' }
    | { type: 'INITIATE_SEND' }
    | { type: 'TRANSACTION_SUCCESS'; payload: string }
    | { type: 'RESET' };

const initialState: State = {
    step: 'input',
    amount: '',
    recipientName: '',
    paymentMethod: 'bank_transfer',
    advancedSettings: {
        priority: 'normal',
        carbonOffsetRatio: 0,
        privacyLevel: 'standard',
        receiptPreference: 'email',
        notificationPreferences: { email: true, sms: false, push: true },
        dataEncryptionStandard: 'aes256',
        routeOptimizationPreference: 'speed',
    },
    securityAudit: null,
    showBiometricModal: false,
    lastTransactionId: null,
};

function transactionReducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SET_FIELD':
            return { ...state, [action.field]: action.payload };
        case 'SET_ADVANCED_SETTING':
            return { ...state, advancedSettings: { ...state.advancedSettings, [action.field]: action.payload } };
        case 'NEXT_STEP':
            if (state.step === 'input') return { ...state, step: 'review' };
            return state;
        case 'PREVIOUS_STEP':
            if (state.step === 'review') return { ...state, step: 'input' };
            return state;
        case 'INITIATE_SEND':
            return { ...state, step: 'processing', showBiometricModal: true };
        case 'TRANSACTION_SUCCESS':
            return { ...state, step: 'success', showBiometricModal: false, lastTransactionId: action.payload };
        case 'RESET':
            return { ...initialState };
        default:
            return state;
    }
}

const SendMoneyView: React.FC<SendMoneyViewProps> = ({ setActiveView }) => {
    const context = useContext(DataContext);
    if (!context) throw new Error("SendMoneyView must be used within a DataProvider");
    const { addTransaction } = context;

    const [state, dispatch] = useReducer(transactionReducer, initialState);
    const { step, amount, recipientName, paymentMethod, securityAudit, showBiometricModal } = state;

    useEffect(() => {
        const auditTimeout = setTimeout(() => {
            if (parseFloat(amount) > 0 && recipientName) {
                dispatch({
                    type: 'SET_FIELD',
                    field: 'securityAudit',
                    payload: {
                        riskScore: parseFloat(amount) > 5000 ? 60 : 10,
                        fraudProbability: 0.05,
                        amlCompliance: 'pass',
                        sanctionScreening: 'pass',
                        recommendations: parseFloat(amount) > 5000 ? ["High value. Verify recipient details."] : [],
                    }
                });
            }
        }, 800);
        return () => clearTimeout(auditTimeout);
    }, [amount, recipientName]);

    const handleSuccess = () => {
        const newTxId = `tx_${Date.now()}`;
        const newTx: Transaction = {
            id: newTxId,
            type: 'expense',
            category: 'Transfer',
            description: `Sent to ${recipientName} via ${paymentMethod}`,
            amount: parseFloat(amount),
            date: new Date().toISOString().split('T')[0],
            carbonFootprint: 0.5,
            metadata: {
                rail: paymentMethod,
                ...state.advancedSettings
            }
        };
        addTransaction(newTx);
        dispatch({ type: 'TRANSACTION_SUCCESS', payload: newTxId });
    };

    const renderStep = () => {
        switch (step) {
            case 'input':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-400">Recipient</label>
                            <input type="text" value={recipientName} onChange={e => dispatch({ type: 'SET_FIELD', field: 'recipientName', payload: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" placeholder="Name, @tag, or ID" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400">Amount</label>
                            <input type="number" value={amount} onChange={e => dispatch({ type: 'SET_FIELD', field: 'amount', payload: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" placeholder="0.00" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400">Payment Method</label>
                            <select value={paymentMethod} onChange={e => dispatch({ type: 'SET_FIELD', field: 'paymentMethod', payload: e.target.value as PaymentRail })} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white">
                                <option value="bank_transfer">Bank Transfer</option>
                                <option value="cashapp">Cash App</option>
                                <option value="swift_global">SWIFT Global</option>
                                <option value="blockchain_transfer">Blockchain Transfer</option>
                                <option value="card_payment">Card Payment</option>
                            </select>
                        </div>
                        <SecurityAuditDisplay auditResult={securityAudit} />
                    </>
                );
            case 'review':
                return (
                    <div className="space-y-3 text-gray-300 p-4 bg-gray-800 rounded-lg">
                        <h3 className="text-xl font-bold text-white mb-2">Review Transaction Details</h3>
                        <div className="flex justify-between"><span className="font-semibold text-gray-400">To:</span> <span>{recipientName}</span></div>
                        <div className="flex justify-between"><span className="font-semibold text-gray-400">Amount:</span> <span className="text-blue-400 font-bold text-lg">${amount}</span></div>
                        <div className="flex justify-between"><span className="font-semibold text-gray-400">Method:</span> <span>{paymentMethod}</span></div>
                        <div className="flex justify-between"><span className="font-semibold text-gray-400">Priority:</span> <span>{state.advancedSettings.priority}</span></div>
                        <p className="text-sm text-yellow-400 pt-2 border-t border-gray-700">Estimated Time: Instant (most rails)</p>
                    </div>
                );
            case 'success':
                return (
                    <div className="text-center p-6 bg-gray-800 rounded-lg">
                        <AnimatedCheckmarkIcon />
                        <h3 className="text-2xl font-bold text-green-400 mt-4">Transaction Successful</h3>
                        <p className="text-gray-300 mt-2">Your payment to {recipientName} has been sent.</p>
                        <p className="text-xs text-gray-500 mt-4">Transaction ID: {state.lastTransactionId}</p>
                        <button onClick={() => dispatch({ type: 'RESET' })} className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white font-bold">
                            New Transaction
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Secure Payments Portal</h2>
            <Card title={step === 'input' ? "Initiate Transfer" : step === 'review' ? "Review Transaction" : "Transaction Complete"}>
                <div className="space-y-4">
                    {renderStep()}
                    
                    {step !== 'success' && (
                        <div className="flex justify-end gap-3 mt-6">
                            {step === 'review' && <button onClick={() => dispatch({ type: 'PREVIOUS_STEP' })} className="px-4 py-2 bg-gray-600 rounded text-white">Back</button>}
                            <button 
                                onClick={() => step === 'input' ? dispatch({ type: 'NEXT_STEP' }) : dispatch({ type: 'INITIATE_SEND' })} 
                                disabled={!amount || !recipientName} 
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white font-bold disabled:opacity-50"
                            >
                                {step === 'input' ? "Review" : "Confirm & Send"}
                            </button>
                        </div>
                    )}
                </div>
            </Card>
            <BiometricModal 
                isOpen={showBiometricModal} 
                onSuccess={handleSuccess} 
                onClose={() => dispatch({ type: 'SET_FIELD', field: 'showBiometricModal', payload: false })} 
                amount={amount} 
                recipient={recipientName} 
                paymentMethod={paymentMethod} 
                securityContext="personal" 
            />
        </div>
    );
};

export default SendMoneyView;