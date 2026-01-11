
import React, { useState, useEffect, useContext } from 'react';
import { GoogleGenAI } from "@google/genai";
import Card from './Card';
import { Bot, Loader2, Download, Play, Video } from 'lucide-react';
import { DataContext } from '../context/DataContext';

const POLLING_MESSAGES = [ 
    "Initializing Neural Video Synthesis Engine...", 
    "Analyzing semantic intent vectors...", 
    "Generating high-fidelity frame buffer...", 
    "Executing temporal coherence algorithms...", 
    "Optimizing lighting and global illumination...", 
    "Finalizing secure asset manifest..." 
];

const AIAdStudioView: React.FC = () => {
    const context = useContext(DataContext);
    const [prompt, setPrompt] = useState('A hyper-realistic cinematic commercial for a futuristic sovereign city-state, neon lights reflecting on wet pavement, high-speed travel pods in the background.');
    const [isGenerating, setIsGenerating] = useState(false);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [pollingStep, setPollingStep] = useState(0);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsGenerating(true);
        setError(null);
        setVideoUrl(null);
        setPollingStep(0);

        const pollingInterval = setInterval(() => {
            setPollingStep(prev => (prev + 1) % POLLING_MESSAGES.length);
        }, 3000);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            let operation = await ai.models.generateVideos({
                model: 'veo-3.1-fast-generate-preview',
                prompt: prompt,
                config: {
                    numberOfVideos: 1,
                    resolution: '720p',
                    aspectRatio: '16:9'
                }
            });

            while (!operation.done) {
                await new Promise(resolve => setTimeout(resolve, 10000));
                operation = await ai.operations.getVideosOperation({ operation: operation });
            }

            if (operation.error) {
                throw new Error(operation.error.message || 'Generation failed');
            }

            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (downloadLink) {
                const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                setVideoUrl(url);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'An unexpected error occurred during generation.');
        } finally {
            clearInterval(pollingInterval);
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <header className="flex justify-between items-center border-b border-gray-800 pb-4">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">AI Ad Studio</h2>
                    <p className="text-gray-400 text-xs font-mono tracking-widest">VEHICLE: VEO_3.1_FAST_GEN</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Creative Directives">
                        <div className="space-y-4">
                            <textarea 
                                value={prompt}
                                onChange={e => setPrompt(e.target.value)}
                                className="w-full h-48 bg-black/50 border border-gray-700 rounded-2xl p-6 text-white text-sm focus:ring-2 focus:ring-cyan-500 outline-none resize-none font-sans"
                                placeholder="Describe the cinematic vision..."
                                disabled={isGenerating}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Aspect Ratio</label>
                                    <div className="text-white font-bold">16:9 Landscape</div>
                                </div>
                                <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Target Engine</label>
                                    <div className="text-white font-bold italic">VEO-3.1-FAST</div>
                                </div>
                            </div>
                            <button 
                                onClick={handleGenerate}
                                disabled={isGenerating || !prompt.trim()}
                                className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-widest"
                            >
                                {isGenerating ? <><Loader2 className="animate-spin" /> Synthesizing Reality...</> : <><Video size={20} /> Execute Synthesis</>}
                            </button>
                            {error && <p className="text-red-400 text-xs font-mono text-center p-3 bg-red-950/20 rounded-lg border border-red-500/30">{error}</p>}
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card title="Asset Preview">
                        <div className="aspect-video bg-black rounded-2xl border border-gray-800 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
                            {isGenerating ? (
                                <div className="text-center p-6 space-y-6 z-10">
                                    <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mx-auto shadow-[0_0_20px_rgba(6,182,212,0.3)]"></div>
                                    <p className="text-xs text-cyan-400 font-mono animate-pulse tracking-tight">{POLLING_MESSAGES[pollingStep]}</p>
                                </div>
                            ) : videoUrl ? (
                                <video src={videoUrl} controls autoPlay loop className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center p-8 space-y-2 opacity-30">
                                    <Bot size={64} className="mx-auto text-gray-600" />
                                    <p className="text-xs text-gray-500 font-mono">AWAITING SIGNAL INGESTION</p>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none"></div>
                        </div>
                        {videoUrl && (
                            <div className="mt-4 p-4 bg-green-500/10 rounded-xl border border-green-500/30 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <span className="text-xs font-bold text-green-400 uppercase">Asset Manifest Valid</span>
                                </div>
                                <a href={videoUrl} download="synthesis_result.mp4" className="flex items-center gap-2 text-xs font-black text-white bg-green-600 px-3 py-1.5 rounded-lg hover:bg-green-500 transition-all">
                                    <Download size={14} /> DOWNLOAD MP4
                                </a>
                            </div>
                        )}
                    </Card>

                    <Card title="System Performance">
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <span className="text-xs text-gray-500 uppercase">Compute Load</span>
                                <span className="text-lg font-bold text-indigo-400">92%</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-indigo-500 h-full w-[92%]"></div>
                            </div>
                            <p className="text-[10px] text-gray-500 font-mono italic">"Quantum clusters are running at near-peak capacity for frame interpolation."</p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AIAdStudioView;
