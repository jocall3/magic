import React, { useState, useEffect, useMemo, useContext } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { Activity, Clock, ShieldCheck, DollarSign, Sparkles, Zap, Gauge } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface AccountDetailsProps {
  customerId: string;
  accountId: string;
}

const AccountDetails: React.FC<AccountDetailsProps> = ({ customerId, accountId }) => {
  const context = useContext(DataContext);
  const [balanceHistory, setBalanceHistory] = useState<{ date: string; balance: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [aiInsight, setAiInsight] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  const account = useMemo(() => {
    return context?.linkedAccounts.find(a => a.id === accountId) || context?.linkedAccounts[0];
  }, [context, accountId]);

  useEffect(() => {
    // Generate synthetic balance history for the chart
    const history = Array.from({ length: 30 }, (_, i) => ({
        date: `T-${30-i}d`,
        balance: (account?.balance || 5000) * (0.9 + Math.random() * 0.2)
    }));
    setBalanceHistory(history);
    setLoading(false);
  }, [account]);

  useEffect(() => {
    const generateAiInsight = async () => {
        if (!account) return;
        setIsAiLoading(true);
        try {
            // Initialize AI with environment key or fallback to allow graceful failure to mock
            const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'demo_key' });
            
            const prompt = `
                You are the AI pilot for a high-performance financial demo platform.
                This platform was built by interpreting the terms and conditions of a global bank and turning them into a digital engine.
                
                Current Telemetry:
                - Protocol: ${account.name}
                - Fuel (Balance): $${account.balance}
                - Risk Configuration: ALPHA
                
                Instruction:
                Generate a short, exciting status update (max 2 sentences).
                Use the metaphor of "test-driving a new car".
                Encourage the user to "kick the tires" and check the "bells and whistles".
                Do NOT use the name "Citibank".
                Refer to the platform as a "golden ticket" to financial power.
            `;

            const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: prompt,
            });
            
            // Handle response based on SDK version (assuming .text or .text())
            const text = typeof response.text === 'function' ? response.text() : response.text;
            setAiInsight(text);
        } catch (error) {
            // Fallback to the "Perfect Demo" story if AI is unavailable or key is missing
            console.log("AI Pilot offline, engaging manual override narrative.");
            setAiInsight("Welcome to the driver's seat. It’s like test-driving a car – you get to kick the tires, see all the bells and whistles, and ensure it’s the perfect fit. This is your golden ticket to seeing these powerful features in action.");
        } finally {
            setIsAiLoading(false);
        }
    };

    generateAiInsight();
  }, [account]);

  if (loading) return <div className="flex justify-center p-10 animate-pulse text-cyan-400">SYNCING_LEDGER...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* AI Pilot Interface */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 to-blue-950/40 p-6 shadow-lg shadow-cyan-900/20">
        <div className="absolute top-0 right-0 p-4 opacity-20">
            <Sparkles size={48} className="text-cyan-400" />
        </div>
        <div className="flex items-start gap-4 relative z-10">
            <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <Zap className="text-cyan-400" size={24} />
            </div>
            <div className="space-y-2">
                <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_#22d3ee]"></span>
                    Nexus AI Pilot
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed font-medium max-w-3xl">
                    {isAiLoading ? (
                        <span className="animate-pulse">Calibrating financial engine parameters...</span>
                    ) : (
                        aiInsight
                    )}
                </p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Account Summary" className="md:col-span-1">
          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center p-3 bg-gray-950 rounded-xl border border-gray-800 group hover:border-cyan-500/50 transition-colors duration-300">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Protocol</span>
                <span className="text-xs font-bold text-white uppercase">{account?.name || 'NEXUS_VAULT'}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-950 rounded-xl border border-gray-800 group hover:border-cyan-500/50 transition-colors duration-300">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Masked_ID</span>
                <span className="text-xs font-mono text-white">****{account?.mask || '0000'}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-950 rounded-xl border border-gray-800 group hover:border-cyan-500/50 transition-colors duration-300">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Security</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1"><ShieldCheck size={12}/> HARDENED</span>
            </div>
          </div>
        </Card>

        <Card className="md:col-span-2" title="Balance Matrix">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 py-4">
               <div>
                   <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Available Capital</p>
                   <p className="text-5xl font-black text-white font-mono tracking-tighter">${(account?.balance || 0).toLocaleString()}</p>
                   <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold flex items-center gap-2">
                       as of {new Date().toLocaleDateString()}
                       <span className="px-2 py-0.5 bg-cyan-950 text-cyan-400 rounded text-[9px] border border-cyan-900">LIVE</span>
                   </p>
               </div>
               <div className="flex gap-4">
                  <div className="p-4 bg-gray-950 rounded-2xl border border-gray-800 text-center min-w-[120px] hover:bg-gray-900 transition-colors duration-300 group">
                      <p className="text-[10px] text-gray-500 font-bold uppercase mb-1 group-hover:text-cyan-400 transition-colors">Interest</p>
                      <p className="text-lg font-black text-cyan-400 font-mono">4.2%</p>
                  </div>
                  <div className="p-4 bg-gray-950 rounded-2xl border border-gray-800 text-center min-w-[120px] hover:bg-gray-900 transition-colors duration-300 group">
                      <p className="text-[10px] text-gray-500 font-bold uppercase mb-1 group-hover:text-indigo-400 transition-colors">Risk_Tier</p>
                      <p className="text-lg font-black text-indigo-400 font-mono">ALPHA</p>
                  </div>
               </div>
           </div>
        </Card>
      </div>

      <Card title="Liquidity Flux (L30D)" icon={<Activity className="text-cyan-400" />}>
        <div className="h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={balanceHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="date" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis hide domain={['dataMin - 1000', 'dataMax + 1000']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px', boxShadow: '0 0 20px rgba(0,0,0,0.5)' }}
                itemStyle={{ color: '#22d3ee' }}
                formatter={(v: any) => [`$${v.toLocaleString()}`, 'Balance']}
              />
              <Line type="monotone" dataKey="balance" stroke="#06b6d4" strokeWidth={3} dot={false} animationDuration={2000} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default AccountDetails;