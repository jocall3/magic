
import React, { useState, useEffect, useRef, useContext } from 'react';
import Card from './Card';
import { DataContext } from '../context/DataContext';
import { Bot, Send, Loader2, Cpu, User, Sparkles } from 'lucide-react';

const AIAdvisorView: React.FC = () => {
    const { askSovereignAI } = useContext(DataContext)!;
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([
        { role: 'ai', text: 'Sovereign AI Core operational. I have processed your current portfolio and market conditions. How shall we optimize your reality today?' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        
        const userText = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userText }]);
        setIsLoading(true);
        
        const response = await askSovereignAI(userText);
        setMessages(prev => [...prev, { role: 'ai', text: response }]);
        setIsLoading(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 h-[calc(100vh-120px)] flex flex-col">
            <header className="flex justify-between items-center border-b border-gray-800 pb-4 shrink-0">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Sovereign Advisor</h2>
                    <p className="text-emerald-400 text-xs font-mono tracking-widest">NEURAL_GUIDANCE // STATION_01</p>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Signal: Optimal</span>
                </div>
            </header>

            <Card className="flex-1 flex flex-col overflow-hidden bg-black/40 border-indigo-900/30 relative">
                <div className="absolute inset-0 bg-grid-white/[0.01] pointer-events-none"></div>
                
                {/* Chat Feed */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative z-10">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                            <div className={`max-w-[80%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center border ${
                                    msg.role === 'user' ? 'bg-indigo-900/50 border-indigo-500/30 text-indigo-400' : 'bg-emerald-900/50 border-emerald-500/30 text-emerald-400'
                                }`}>
                                    {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                                </div>
                                <div className={`p-5 rounded-2xl shadow-xl text-sm leading-relaxed ${
                                    msg.role === 'user' 
                                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                                    : 'bg-gray-900/80 text-gray-200 rounded-tl-none border border-gray-800'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start animate-in fade-in">
                            <div className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-emerald-400 mr-4">
                                <Loader2 className="animate-spin" size={20} />
                            </div>
                            <div className="bg-gray-900/80 p-4 rounded-2xl rounded-tl-none border border-gray-800 flex items-center gap-3">
                                <span className="text-xs font-mono text-emerald-400 animate-pulse uppercase tracking-widest">Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={scrollRef} />
                </div>

                {/* Input Matrix */}
                <div className="p-6 bg-gray-950/80 border-t border-gray-800 relative z-10">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-indigo-500/5 blur-xl group-focus-within:bg-indigo-500/10 transition-all rounded-2xl"></div>
                        <div className="relative flex gap-4 bg-gray-900 border border-gray-700 rounded-2xl p-2 pl-6 focus-within:border-indigo-500 transition-all shadow-2xl">
                            <input 
                                type="text" 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-600 text-sm font-medium"
                                placeholder="Direct command to Sovereign AI..."
                                disabled={isLoading}
                            />
                            <button 
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 text-white p-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default AIAdvisorView;
