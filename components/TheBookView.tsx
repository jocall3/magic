import React, { useState, useMemo, useEffect, useRef } from 'react';
import Card from './Card';
import { Book, ChevronRight, FileText, List, Search, ArrowLeft, Sparkles, Bot, Loader, ChevronLeft } from 'lucide-react';
// FIX 1: Import ReactMarkdown for secure and correct markdown rendering
import ReactMarkdown from 'react-markdown';
// Optional: Import remark-gfm for GitHub Flavored Markdown support (tables, strikethrough)
import remarkGfm from 'remark-gfm';

// --- DATA STRUCTURE ---

interface Page {
    id: string;
    title: string;
    content: string;
}

/**
 * Loads markdown content from the '../book/' directory.
 * It expects files named 'page1.md', 'page2.md', etc.
 */
const loadBookContent = (): Page[] => {
    // CRITICAL: Path assumption based on context: components/TheBookView.tsx -> ../book/*.md
    // This uses Vite's glob import feature to load all markdown files eagerly.
    const modules = import.meta.glob('../book/*.md', { as: 'raw', eager: true });
    const pages: Page[] = [];

    for (const path in modules) {
        const content = modules[path] as unknown as string;
        const filename = path.split('/').pop() || '';
        
        // Extract number from filename (e.g., 'page1.md' -> 1, 'page41.md' -> 41)
        const match = filename.match(/page(\d+)\.md/i);
        const pageNum = match ? parseInt(match[1], 10) : 0;
        
        // Attempt to extract a title from the first line of the markdown content
        const firstLine = content.split('\n')[0].replace(/^#+\s*/, '').trim();
        const title = firstLine || `Page ${pageNum}`;

        if (pageNum > 0) {
            pages.push({
                id: `page-${pageNum}`,
                title: title,
                content: content
            });
        }
    }

    // Sort pages numerically
    pages.sort((a, b) => {
        const numA = parseInt(a.id.replace('page-', ''));
        const numB = parseInt(b.id.replace('page-', ''));
        return numA - numB;
    });

    return pages;
};

const ALL_PAGES = loadBookContent();
const TOTAL_PAGES = ALL_PAGES.length;

const TheBookView: React.FC = () => {
    // currentPageIndex: -1 for TOC view, 0 to TOTAL_PAGES-1 for reading
    const [currentPageIndex, setCurrentPageIndex] = useState<number>(-1); 
    const [searchQuery, setSearchQuery] = useState('');
    const [aiResponse, setAiResponse] = useState<string>('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    
    const readerRef = useRef<HTMLDivElement>(null);

    const selectedPage = currentPageIndex >= 0 && currentPageIndex < TOTAL_PAGES 
        ? ALL_PAGES[currentPageIndex] 
        : null;
    
    const currentPageNumber = selectedPage ? currentPageIndex + 1 : 0;

    useEffect(() => {
        // Reset AI response when page changes
        setAiResponse('');
    }, [currentPageIndex]);

    const handlePageClick = (index: number) => {
        setCurrentPageIndex(index);
        if (readerRef.current) {
            readerRef.current.scrollTo(0, 0);
        }
    };

    const handleNavigate = (direction: 'prev' | 'next') => {
        if (currentPageIndex === -1) return;

        let newIndex = currentPageIndex;
        if (direction === 'prev' && currentPageIndex > 0) {
            newIndex = currentPageIndex - 1;
        } else if (direction === 'next' && currentPageIndex < TOTAL_PAGES - 1) {
            newIndex = currentPageIndex + 1;
        }
        
        if (newIndex !== currentPageIndex) {
            handlePageClick(newIndex);
        }
    };

    const handleBackToToC = () => {
        setCurrentPageIndex(-1);
        setSearchQuery('');
    };

    const canGoPrev = currentPageIndex > 0;
    const canGoNext = currentPageIndex < TOTAL_PAGES - 1;

    const filteredPages = useMemo(() => {
        if (!searchQuery) return ALL_PAGES;
        const lowerQuery = searchQuery.toLowerCase();
        return ALL_PAGES.filter(p => 
            p.title.toLowerCase().includes(lowerQuery) || 
            p.content.toLowerCase().includes(lowerQuery)
        );
    }, [searchQuery]);

    // AI Expansion Logic (FIX 2: Proxied API call for security)
    const handleAiExpand = async () => {
        if (!selectedPage) return;

        // FIX: Removed direct client-side API key usage. 
        // We now assume a secure backend proxy handles the API call.
        
        setIsAiLoading(true);
        try {
            // Using a relative endpoint that the server/proxy must handle
            const response = await fetch('/api/ai-expand', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    // Send the content and the required prompt context
                    content: selectedPage.content,
                    promptContext: "Analyze the following text from the Sovereign Protocol. Provide a detailed, operational expansion, focusing on how this concept integrates with modern financial technology, AI systems, and global governance. Use a formal, technical tone, and structure the response with clear headings and bullet points."
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Unknown proxy error.' }));
                throw new Error(`Proxy request failed: ${errorData.message || response.statusText}`);
            }

            const data = await response.json();
            // Assuming the proxy returns the generated text in a 'text' field
            const generatedText = data.text; 
            
            if (generatedText) {
                setAiResponse(generatedText);
            } else {
                 setAiResponse("AI returned an empty response.");
            }
        } catch (error) {
            console.error("Error expanding content with AI:", error);
            setAiResponse(`Failed to generate AI analysis. Error: ${error.message || 'Connection error.'}`);
        } finally {
            setIsAiLoading(false);
        }
    };

    if (TOTAL_PAGES === 0) {
        return (
            <div className="h-full flex items-center justify-center bg-gray-900/50 rounded-xl border border-gray-800">
                <div className="text-center p-10">
                    <Loader className="w-10 h-10 text-red-500 mx-auto mb-4 animate-spin" />
                    <h3 className="text-xl font-bold text-white">Protocol Data Missing</h3>
                    <p className="text-gray-400 mt-2">Could not load any markdown files from the `book/` directory. Please ensure files like `page1.md` exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
            <header className="flex items-center justify-between border-b border-gray-800 pb-6 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-indigo-600/20 rounded-xl border border-indigo-500/30 shadow-lg shadow-indigo-900/30">
                        <Book className="w-8 h-8 text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight">The Sovereign Protocol</h1>
                        <p className="text-gray-400 text-sm">The Living Blueprint of the Infinite Intelligence Foundation. ({TOTAL_PAGES} Pages)</p>
                    </div>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                        type="text" 
                        placeholder="Search the Protocol (Title or Content)..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-gray-900 border border-gray-700 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:border-indigo-500 outline-none w-64 focus:w-80 transition-all"
                    />
                </div>
            </header>

            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar / Table of Contents */}
                <Card className="lg:col-span-1 bg-gray-900/80 border-indigo-500/30 flex flex-col overflow-hidden p-0">
                    <div className="p-4 border-b border-gray-800 bg-gray-900 sticky top-0 z-10 flex items-center gap-2">
                        <List className="w-4 h-4 text-indigo-400" />
                        <span className="font-bold text-gray-200 text-sm">
                            {searchQuery ? `Search Results (${filteredPages.length})` : 'Protocol Index'}
                        </span>
                        {currentPageIndex !== -1 && (
                            <button onClick={handleBackToToC} className="ml-auto text-xs text-gray-500 hover:text-indigo-400 flex items-center gap-1">
                                <ArrowLeft size={12} /> Index
                            </button>
                        )}
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                        {filteredPages.length > 0 ? (
                            <div className="space-y-1">
                                {filteredPages.map((page) => {
                                    // Find the original index for navigation
                                    const originalIndex = ALL_PAGES.findIndex(p => p.id === page.id);
                                    return (
                                        <button
                                            key={page.id}
                                            onClick={() => handlePageClick(originalIndex)}
                                            className={`w-full text-left px-3 py-2 rounded text-xs transition-colors flex items-center gap-2 ${
                                                currentPageIndex === originalIndex
                                                ? 'bg-indigo-600 text-white shadow-md' 
                                                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                                            }`}
                                        >
                                            <div className={`w-1.5 h-1.5 rounded-full ${currentPageIndex === originalIndex ? 'bg-white' : 'bg-gray-600'}`}></div>
                                            <span className="truncate">{page.title}</span>
                                            <span className="ml-auto text-gray-500 text-[10px] font-mono">{originalIndex + 1}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="p-4 text-center text-gray-500 text-sm">
                                No pages match "{searchQuery}".
                            </div>
                        )}
                    </div>
                </Card>

                {/* Reader View */}
                <Card className="lg:col-span-3 bg-gray-900/80 border-indigo-500/30 flex flex-col overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <Book size={200} />
                    </div>
                    
                    {selectedPage ? (
                        <>
                            {/* Navigation Header */}
                            <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
                                <button 
                                    onClick={() => handleNavigate('prev')}
                                    disabled={!canGoPrev}
                                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono transition-colors border ${
                                        canGoPrev 
                                            ? 'text-indigo-400 border-indigo-900 hover:bg-indigo-900/30' 
                                            : 'text-gray-600 border-gray-800 cursor-not-allowed'
                                    }`}
                                >
                                    <ChevronLeft size={14} /> PREV PAGE
                                </button>

                                <div className="text-sm font-mono text-gray-400">
                                    PAGE {currentPageNumber} / {TOTAL_PAGES}
                                </div>

                                <button 
                                    onClick={() => handleNavigate('next')}
                                    disabled={!canGoNext}
                                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono transition-colors border ${
                                        canGoNext 
                                            ? 'text-indigo-400 border-indigo-900 hover:bg-indigo-900/30' 
                                            : 'text-gray-600 border-gray-800 cursor-not-allowed'
                                    }`}
                                >
                                    NEXT PAGE <ChevronRight size={14} />
                                </button>
                            </div>

                            {/* Content Area */}
                            <div ref={readerRef} id="reader-content" className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                                <div className="max-w-3xl mx-auto">
                                    <div className="mb-6 pb-4 border-b border-gray-800">
                                        <h2 className="text-3xl font-extrabold text-white tracking-tight">{selectedPage.title}</h2>
                                        <p className="text-xs text-indigo-400 font-mono mt-2">PROTOCOL ID: {selectedPage.id.toUpperCase()} | STATUS: ACTIVE</p>
                                    </div>
                                    
                                    {/* FIX 1: Replaced dangerouslySetInnerHTML with ReactMarkdown */}
                                    <ReactMarkdown 
                                        className="prose prose-invert prose-lg text-gray-300 leading-relaxed"
                                        remarkPlugins={[remarkGfm]}
                                    >
                                        {selectedPage.content}
                                    </ReactMarkdown>
                                    
                                    {/* AI Expansion Section */}
                                    <div className="mt-16 pt-8 border-t border-gray-800">
                                        {!aiResponse && !isAiLoading && (
                                            <button 
                                                onClick={handleAiExpand}
                                                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all text-sm font-bold shadow-lg shadow-indigo-900/30"
                                            >
                                                <Sparkles className="w-4 h-4" />
                                                Request AI Protocol Expansion
                                            </button>
                                        )}

                                        {isAiLoading && (
                                            <div className="flex items-center gap-3 text-indigo-400 p-4 bg-gray-900 rounded-xl border border-indigo-500/20">
                                                <Loader className="w-5 h-5 animate-spin" />
                                                <span className="text-sm font-mono">Analyzing protocol data and generating operational context...</span>
                                            </div>
                                        )}

                                        {aiResponse && (
                                            <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-6 mt-6 shadow-xl">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="p-2 bg-indigo-500/20 rounded-lg">
                                                        <Bot className="w-5 h-5 text-indigo-400" />
                                                    </div>
                                                    <h3 className="text-lg font-bold text-white font-mono tracking-wider">SOVEREIGN AI ANALYSIS</h3>
                                                </div>
                                                {/* FIX 1: Replaced dangerouslySetInnerHTML with ReactMarkdown for AI response */}
                                                <div className="prose prose-invert prose-sm text-gray-300 leading-relaxed">
                                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                        {aiResponse}
                                                    </ReactMarkdown>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8 text-center">
                            <div className="w-24 h-24 bg-indigo-900/20 rounded-full flex items-center justify-center mb-6 border border-indigo-500/30 shadow-[0_0_40px_rgba(99,102,241,0.1)]">
                                <FileText size={40} className="text-indigo-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Access the Sovereign Protocol</h3>
                            <p className="max-w-md text-gray-400">
                                This repository contains the core lore and operational doctrine of the Nexus OS. Select a page from the index to begin reading.
                            </p>
                            <p className="text-xs text-gray-600 mt-4 font-mono">
                                Total Documents: {TOTAL_PAGES}
                            </p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default TheBookView;