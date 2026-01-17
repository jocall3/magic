import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  Menu, 
  X, 
  Bot, 
  DollarSign, 
  Scale, 
  Shirt, 
  BookOpen, 
  FileText, 
  Search,
  Globe,
  ShieldCheck
} from 'lucide-react';

// --- Types ---

type SubLink = {
  title: string;
  href: string;
  description: string;
};

type Category = {
  id: string;
  label: string;
  icon: React.ReactNode;
  columns: SubLink[][]; // Array of columns, each containing links
};

// --- Data Generation (The Bureaucracy Engine) ---

const generateBureaucraticLinks = (category: string, count: number): SubLink[] => {
  const links: SubLink[] = [];
  const prefixes = [
    "Advanced", "Strategic", "Federal", "Sovereign", "Algorithmic", "Dark Money", 
    "Grassroots", "Compliance", "Regulatory", "Infinite", "Quantum", "Synthentic"
  ];
  const nouns = [
    "Ledger", "Committee", "PAC", "Loophole", "Audit", "Filibuster", "Derivative", 
    "Lobbying", "Red Tape", "Form 8842", "Sub-Committee", "Protocol", "Sanction"
  ];
  
  for (let i = 0; i < count; i++) {
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    links.push({
      title: `${prefix} ${noun} ${i + 1}`,
      href: `/${category.toLowerCase()}/${i + 1}`,
      description: `Comprehensive documentation regarding the ${prefix.toLowerCase()} nature of ${noun.toLowerCase()}.`
    });
  }
  return links;
};

// Specific hilarious overrides for the prompt requirements
const bankingLinks: SubLink[] = [
  { title: "Algorithmic Usury", href: "/banking/usury", description: "Maximizing returns through predictive suffering." },
  { title: "Sentiment Analysis Loans", href: "/banking/sentiment", description: "Interest rates based on your tweet history." },
  { title: "Robo-Foreclosure", href: "/banking/foreclosure", description: "Automated property seizure at the speed of light." },
  { title: "Quantum High-Freq Trading", href: "/banking/hft", description: "Front-running trades before they are even conceived." },
  { title: "Sovereign Wealth AI", href: "/banking/sovereign", description: "Managing nation-state GDPs with a single GPU." },
  ...generateBureaucraticLinks("banking", 15)
];

const complianceLinks: SubLink[] = [
  { title: "KYC (Know Your Cyborg)", href: "/compliance/kyc", description: "Verifying the humanity of your deposit base." },
  { title: "AML (Anti-Metaverse Laundering)", href: "/compliance/aml", description: "Tracking crypto through the 7th dimension." },
  { title: "GDPR (Galactic Data Protection)", href: "/compliance/gdpr", description: "Privacy laws for sentient codebases." },
  { title: "Regulatory Capture Guide", href: "/compliance/capture", description: "How to become the regulator you fear." },
  { title: "Section 230 Repeal Sim", href: "/compliance/230", description: "Simulate liability in a post-truth economy." },
  ...generateBureaucraticLinks("compliance", 15)
];

const swagLinks: SubLink[] = [
  { title: "527 Org Hoodie", href: "/swag/527-hoodie", description: "Look like a dark money donor in style." },
  { title: "Super PAC Tote Bag", href: "/swag/pac-tote", description: "Big enough to hold non-disclosed cash donations." },
  { title: "Gerrymandering Kit", href: "/swag/gerrymander", description: "Draw your own district with our AI pen." },
  { title: "Lobbyist Coffee Mug", href: "/swag/mug", description: "Contains 'Hot Influence'." },
  { title: "Astroturf Grass Sample", href: "/swag/grass", description: "Genuine fake grassroots movement material." },
  { title: "Citizens United Plate", href: "/swag/plate", description: "Commemorative fine china for corporate personhood." },
  ...generateBureaucraticLinks("swag", 14)
];

const educationLinks: SubLink[] = [
  { title: "Neural Net 101", href: "/edu/neural", description: "Teaching rocks to think for profit." },
  { title: "Bribing Algorithms", href: "/edu/bribing", description: "Ethical frameworks for digital persuasion." },
  { title: "The Ethics of Infinite Loops", href: "/edu/loops", description: "Why we must never stop calculating." },
  { title: "LLM: Large Lobbying Model", href: "/edu/llm", description: "Generating legislation via autocomplete." },
  ...generateBureaucraticLinks("education", 16)
];

const bureaucracyLinks: SubLink[] = [
  { title: "Form Request Form", href: "/bureaucracy/request", description: "Submit a request to request a form." },
  { title: "Dept. of Redundancy Dept.", href: "/bureaucracy/redundancy", description: "Ensuring everything is done twice." },
  { title: "Committee on Committees", href: "/bureaucracy/meta-committee", description: "Oversight for the oversight board." },
  { title: "The Queue", href: "/bureaucracy/queue", description: "Check your position in the infinite waitlist." },
  { title: "Permit A38", href: "/bureaucracy/a38", description: "The impossible permit from the place that sends you mad." },
  ...generateBureaucraticLinks("bureaucracy", 15)
];

// Helper to chunk links into columns for the mega menu
const chunkLinks = (links: SubLink[], columns: number): SubLink[][] => {
  const result: SubLink[][] = Array.from({ length: columns }, () => []);
  links.forEach((link, index) => {
    result[index % columns].push(link);
  });
  return result;
};

const NAV_DATA: Category[] = [
  { id: 'banking', label: 'AI Banking', icon: <DollarSign className="w-5 h-5" />, columns: chunkLinks(bankingLinks, 4) },
  { id: 'compliance', label: 'Compliance', icon: <ShieldCheck className="w-5 h-5" />, columns: chunkLinks(complianceLinks, 4) },
  { id: 'swag', label: '527 Swag', icon: <Shirt className="w-5 h-5" />, columns: chunkLinks(swagLinks, 4) },
  { id: 'education', label: 'Education', icon: <BookOpen className="w-5 h-5" />, columns: chunkLinks(educationLinks, 4) },
  { id: 'bureaucracy', label: 'Bureaucracy', icon: <FileText className="w-5 h-5" />, columns: chunkLinks(bureaucracyLinks, 4) },
];

// --- Components ---

const MegaNavBar: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for sovereign confidence
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out
        ${scrolled ? 'bg-slate-900/95 backdrop-blur-md shadow-2xl py-2' : 'bg-slate-900 py-4'}
        border-b border-slate-700 text-slate-100 font-sans
      `}
    >
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-slate-800 p-2 rounded-full border border-slate-600">
                <Globe className="w-8 h-8 text-cyan-400 animate-pulse-slow" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                OMNI-BANK
              </span>
              <span className="text-[0.6rem] uppercase tracking-widest text-cyan-500 font-semibold">
                Sovereign AI Solutions
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex space-x-1 h-full items-center">
            {NAV_DATA.map((category) => (
              <div 
                key={category.id}
                className="relative h-full flex items-center"
                onMouseEnter={() => setActiveCategory(category.id)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <button 
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                    ${activeCategory === category.id ? 'bg-slate-800 text-cyan-400 shadow-inner' : 'hover:bg-slate-800/50 text-slate-300 hover:text-white'}
                  `}
                >
                  {category.icon}
                  {category.label}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeCategory === category.id ? 'rotate-180' : ''}`} />
                </button>

                {/* Mega Menu Dropdown */}
                <div 
                  className={`
                    absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-[90vw] max-w-7xl
                    bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden
                    transition-all duration-300 origin-top
                    ${activeCategory === category.id ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}
                  `}
                >
                  {/* Decorative Top Bar */}
                  <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400"></div>
                  
                  <div className="p-8 grid grid-cols-12 gap-8">
                    {/* Sidebar Info */}
                    <div className="col-span-3 bg-slate-800/50 rounded-lg p-6 border border-slate-700/50 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                          {category.icon} {category.label}
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                          Explore our comprehensive suite of {category.label.toLowerCase()} tools designed for the modern, post-regulatory era. 
                          We ensure 99.99% uptime and 0% accountability.
                        </p>
                        <button className="w-full py-2 px-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-medium text-sm transition-colors">
                          View All {category.label}
                        </button>
                      </div>
                      <div className="mt-8 pt-6 border-t border-slate-700">
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <Scale className="w-4 h-4" />
                          <span>Approved by the Committee of Committees</span>
                        </div>
                      </div>
                    </div>

                    {/* Links Grid */}
                    <div className="col-span-9 grid grid-cols-4 gap-6">
                      {category.columns.map((col, colIdx) => (
                        <div key={colIdx} className="space-y-4">
                          <h4 className="text-xs font-bold text-cyan-500 uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">
                            Sector {colIdx + 1}
                          </h4>
                          <ul className="space-y-3">
                            {col.map((link, linkIdx) => (
                              <li key={linkIdx} className="group/link">
                                <a href={link.href} className="block">
                                  <div className="text-sm font-medium text-slate-300 group-hover/link:text-cyan-400 transition-colors">
                                    {link.title}
                                  </div>
                                  <div className="text-[10px] text-slate-500 group-hover/link:text-slate-400 line-clamp-1 mt-0.5">
                                    {link.description}
                                  </div>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Footer of the Mega Menu */}
                  <div className="bg-slate-950 py-3 px-8 flex justify-between items-center text-xs text-slate-600">
                    <span>Index: {category.id.toUpperCase()}-00{Math.floor(Math.random() * 1000)}</span>
                    <span className="flex items-center gap-2">
                      <Bot className="w-3 h-3" /> AI Tutor Ready to Explain
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="hidden xl:flex items-center gap-4">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Search regulations..." 
                className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-full pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400" />
            </div>
            
            <button className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-5 py-2 rounded-full font-bold text-sm shadow-lg hover:shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5">
              <Bot className="w-4 h-4" />
              <span>Summon AI Tutor</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="xl:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-300 hover:text-white p-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="xl:hidden fixed inset-0 top-16 bg-slate-900 z-40 overflow-y-auto">
          <div className="p-4 space-y-6">
            {NAV_DATA.map((category) => (
              <div key={category.id} className="border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-lg font-bold text-cyan-400 mb-4">
                  {category.icon}
                  {category.label}
                </div>
                <div className="grid grid-cols-1 gap-2 pl-4">
                  {category.columns.flat().slice(0, 8).map((link, idx) => (
                    <a key={idx} href={link.href} className="block py-2 text-slate-300 text-sm border-l-2 border-slate-800 pl-3 hover:border-cyan-500 hover:text-white transition-all">
                      {link.title}
                    </a>
                  ))}
                  <a href={`/${category.id}`} className="text-xs text-center py-2 text-slate-500 italic">
                    + {category.columns.flat().length - 8} more bureaucratic layers...
                  </a>
                </div>
              </div>
            ))}
            <div className="pt-4 pb-8">
              <button className="w-full flex justify-center items-center gap-2 bg-cyan-600 text-white py-3 rounded-lg font-bold">
                <Bot className="w-5 h-5" />
                Ask the AI Tutor
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default MegaNavBar;