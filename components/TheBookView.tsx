import React, { useState, useMemo, useEffect } from 'react';
import Card from './Card';
import { Book, ChevronRight, FileText, List, Search, ArrowLeft, Sparkles, Bot, Loader } from 'lucide-react';

// --- DATA STRUCTURE FOR THE 527 PAGES ---
// This acts as the "database" for the book content.
// In a real app, this would be fetched from a markdown folder or CMS.

interface Chapter {
    id: string;
    title: string;
    pages: Page[];
}

interface Page {
    id: string;
    title: string;
    content: string;
}

const loadBookContent = (): Chapter[] => {
    const modules = import.meta.glob('../book/*.md', { as: 'raw', eager: true });
    const pages: Page[] = [];

    for (const path in modules) {
        const content = modules[path] as unknown as string;
        const filename = path.split('/').pop() || '';
        // Extract number from filename (e.g., 'page1.md' -> 1)
        const match = filename.match(/(\d+)/);
        const pageNum = match ? parseInt(match[0], 10) : 0;
        
        pages.push({
            id: `page-${pageNum}`,
            title: `Page ${pageNum}`,
            content: content
        });
    }

    // Sort pages numerically based on the number in the filename
    pages.sort((a, b) => {
        const numA = parseInt(a.id.replace('page-', ''));
        const numB = parseInt(b.id.replace('page-', ''));
        return numA - numB;
    });

    return [{
        id: 'the-book',
        title: 'The Book',
        pages: pages
    }];
};

const BOOK_DATA = loadBookContent();

const TheBookView: React.FC = () => {
    const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
    const [selectedPage, setSelectedPage] = useState<Page | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [aiResponse, setAiResponse] = useState<string>('');
    const [isAiLoading, setIsAiLoading] = useState(false);

    useEffect(() => {
        setAiResponse('');
    }, [selectedPage]);

    const filteredChapters = useMemo(() => {
        if (!searchQuery) return BOOK_DATA;
        return BOOK_DATA.filter(c => 
            c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            c.pages.some(p => p.content.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [searchQuery]);

    const handleChapterClick = (chapter: Chapter) => {
        setSelectedChapter(chapter);
        setSelectedPage(chapter.pages[0]);
    };

    const handlePageClick = (page: Page) => {
        setSelectedPage(page);
    };

    const handleBackToToC = () => {
        setSelectedChapter(null);
        setSelectedPage(null);
    };

    const handleAiExpand = async () => {
        if (!selectedPage) return;

        const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : undefined);
        
        if (!apiKey) {
            console.error("Gemini API key not found.");
            return;
        }

        setIsAiLoading(true);
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Expand on this content significantly, providing more depth, context, and operational details:\n\n${selectedPage.content}`
                        }]
                    }]
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();
            const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (generatedText) {
                setAiResponse(generatedText);
            }
        } catch (error) {
            console.error("Error expanding content with AI:", error);
            setAiResponse("Failed to generate AI analysis. Please try again later.");
        } finally {
            setIsAiLoading(false);
        }
    };

    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
            <header className="flex items-center justify-between border-b border-gray-700 pb-6 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-indigo-600/20 rounded-xl border border-indigo-500/30">
                        <Book className="w-8 h-8 text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight">The 527 Protocol</h1>
                        <p className="text-gray-400 text-sm">The Living Blueprint of the Infinite Intelligence Foundation.</p>
                    </div>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                        type="text" 
                        placeholder="Search the Protocol..." 
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
                        <List className="w-4 h-4 text-gray-400" />
                        <span className="font-bold text-gray-200 text-sm">Table of Contents</span>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                        {selectedChapter ? (
                            <div className="space-y-1">
                                <button onClick={handleBackToToC} className="w-full text-left px-3 py-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mb-2">
                                    <ArrowLeft size={12} /> Back to Chapters
                                </button>
                                <div className="px-3 py-2 text-xs font-bold text-white bg-gray-800 rounded">{selectedChapter.title}</div>
                                {selectedChapter.pages.map(page => (
                                    <button
                                        key={page.id}
                                        onClick={() => handlePageClick(page)}
                                        className={`w-full text-left px-3 py-2 rounded text-xs transition-colors flex items-center gap-2 ${
                                            selectedPage?.id === page.id 
                                            ? 'bg-indigo-600 text-white shadow-md' 
                                            : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                                        }`}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full ${selectedPage?.id === page.id ? 'bg-white' : 'bg-gray-600'}`}></div>
                                        {page.title}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {filteredChapters.map(chapter => (
                                    <button
                                        key={chapter.id}
                                        onClick={() => handleChapterClick(chapter)}
                                        className="w-full text-left px-3 py-3 rounded hover:bg-gray-800 transition-colors flex items-center justify-between group border-b border-gray-800/50 last:border-0"
                                    >
                                        <span className="text-sm text-gray-300 group-hover:text-white font-medium line-clamp-1">{chapter.title}</span>
                                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all" />
                                    </button>
                                ))}
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
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <div className="max-w-3xl mx-auto">
                                <div className="mb-6 pb-4 border-b border-gray-800">
                                    <h2 className="text-2xl font-bold text-white">{selectedPage.title}</h2>
                                    <p className="text-xs text-indigo-400 font-mono mt-2">ID: {selectedPage.id} | VER: 5.2.7</p>
                                </div>
                                <div className="prose prose-invert prose-lg text-gray-300 leading-relaxed whitespace-pre-line">
                                    {selectedPage.content}
                                </div>
                                <div className="mt-12 pt-8 border-t border-gray-800 flex justify-between text-sm text-gray-500">
                                    <span>Infinite Intelligence Foundation</span>
                                    <span>Page {selectedPage.id.split('-')[1]} of 527</span>
                                </div>

                                {/* AI Expansion Section */}
                                <div className="mt-8">
                                    {!aiResponse && !isAiLoading && (
                                        <button 
                                            onClick={handleAiExpand}
                                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors text-sm font-medium"
                                        >
                                            <Sparkles className="w-4 h-4" />
                                            Expand with AI
                                        </button>
                                    )}

                                    {isAiLoading && (
                                        <div className="flex items-center gap-2 text-indigo-400">
                                            <Loader className="w-5 h-5 animate-spin" />
                                            <span className="text-sm">Analyzing protocol data...</span>
                                        </div>
                                    )}

                                    {aiResponse && (
                                        <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-6 mt-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2 bg-indigo-500/20 rounded-lg">
                                                    <Bot className="w-5 h-5 text-indigo-400" />
                                                </div>
                                                <h3 className="text-lg font-bold text-white">AI Analysis</h3>
                                            </div>
                                            <div className="prose prose-invert prose-sm text-gray-300 leading-relaxed whitespace-pre-line">
                                                {aiResponse}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8 text-center">
                            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                <Book size={40} className="text-indigo-500/50" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-300 mb-2">Select a Chapter</h3>
                            <p className="max-w-md">The Protocol contains 527 pages of operational doctrine. Select a chapter from the sidebar to begin your study.</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default TheBookView;