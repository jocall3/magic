// components/views/platform/TheCharterView.tsx
import React, { useState } from 'react';
import Card from '../../Card';

const TheCharterView: React.FC = () => {
    const [charterText, setCharterText] = useState(
`My risk tolerance is aggressive in pursuit of long-term growth, but I will never invest in entities with an ESG rating below A-.

Dedicate 10% of all freelance income directly to the 'Down Payment' goal, bypassing my main account.

Maintain a liquid emergency fund equal to six months of expenses. If it dips below, prioritize replenishing it above all other discretionary spending.

Optimize my life for experiences over possessions. Actively seek and eliminate subscriptions or recurring costs that do not contribute to learning, health, or memorable experiences.`
    );
    const [isMandateGranted, setIsMandateGranted] = useState(false);

    const handleGrantMandate = () => {
        setIsMandateGranted(true);
        // In a real app, this would save the charter and update the AI's core instructions.
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">The Charter</h2>
            <Card title="Your Financial Constitution">
                <p className="text-gray-400 mb-4">
                    This is where you define your core financial principles. Instead of rules, you inscribe a philosophy.
                    By signing this Charter, you grant Quantum the mandate to act as your autonomous Sovereign Financial Agent,
                    proactively managing your finances in accordance with these values.
                </p>
                <textarea
                    value={charterText}
                    onChange={(e) => setCharterText(e.target.value)}
                    className="w-full h-64 bg-gray-900/50 border border-gray-700 rounded-lg p-4 text-gray-300 font-serif focus:ring-cyan-500 focus:border-cyan-500"
                    placeholder="Inscribe your principles here..."
                />
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleGrantMandate}
                        disabled={isMandateGranted}
                        className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isMandateGranted ? (
                            <><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Mandate Granted</>
                        ) : (
                            'Sign & Grant Mandate'
                        )}
                    </button>
                </div>
                 {isMandateGranted && <p className="text-green-400 text-sm text-center mt-4">Quantum now operates under your Charter. It will autonomously act to uphold your principles.</p>}
            </Card>
        </div>
    );
};

export default TheCharterView;