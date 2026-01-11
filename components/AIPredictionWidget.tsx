import React from 'react';
import Card from './Card';
import { Sparkles, TrendingUp, AlertCircle } from 'lucide-react';

const AIPredictionWidget: React.FC = () => {
  return (
    <Card title="Neural Sentiment Engine" icon={<Sparkles className="text-cyan-400" />}>
      <div className="flex flex-col items-center py-6">
         <div className="relative w-40 h-40 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-8 border-gray-800"></div>
            <div className="absolute inset-0 rounded-full border-8 border-cyan-500 border-t-transparent animate-spin-slow"></div>
            <div className="text-center relative z-10">
                <p className="text-4xl font-black text-white font-mono tracking-tighter">94.2%</p>
                <p className="text-[8px] font-black text-cyan-400 uppercase tracking-widest">Bullish_Conf</p>
            </div>
         </div>
         
         <div className="w-full mt-10 space-y-4 px-4">
            <div className="p-4 bg-gray-950 rounded-2xl border border-gray-800 flex items-start gap-3">
               <AlertCircle size={16} className="text-cyan-500 shrink-0 mt-0.5" />
               <p className="text-[10px] text-gray-400 leading-relaxed italic">
                 "Market vectors indicate a high-probability breakout for the NDX_FUT sector. Recalibrate long positions to capture delta."
               </p>
            </div>
            <button className="w-full py-3 bg-white/5 hover:bg-cyan-600 text-gray-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5 hover:border-cyan-500">
               Access Full Simulation
            </button>
         </div>
      </div>
    </Card>
  );
};

export default AIPredictionWidget;
