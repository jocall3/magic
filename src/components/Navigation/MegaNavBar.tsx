import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronDown, 
  Menu, 
  X, 
  Bot, 
  DollarSign, 
  Search,
  Globe,
  Briefcase,
  Settings,
  LayoutDashboard,
  Wallet,
  ArrowRightLeft,
  Send,
  Building2,
  TrendingUp,
  ShieldCheck,
  BarChart3,
  Lock,
  Code,
  Server,
  BookOpen,
  User,
  Palette,
  KeyRound
} from 'lucide-react';

// --- Types ---

type SubLink = {
  title: string;
  href: string;
  description: string;
  icon: React.ReactNode;
};

type Category = {
  id: string;
  label: string;
  icon: React.ReactNode;
  columns: SubLink[][]; // Array of columns, each containing links
  description: string;
};

// --- Data Definition ---

const bankingLinks: SubLink[] = [
  { title: "Dashboard", href: "/dashboard", description: "High-level overview of your financial status.", icon: <LayoutDashboard size={16} /> },
  { title: "Accounts", href: "/accounts", description: "Manage all your connected financial accounts.", icon: <Wallet size={16} /> },
  { title: "Transactions", href: "/transactions", description: "View and categorize your transaction history.", icon: <ArrowRightLeft size={16} /> },
  { title: "Send Money", href: "/send-money", description: "Initiate domestic and international payments.", icon: <Send size={16} /> },
  { title: "Modern Treasury", href: "/modern-treasury", description: "Corporate treasury and cash management tools.", icon: <Building2 size={16} /> },
  { title: "Investments", href: "/investments", description: "Track and manage your investment portfolio.", icon: <TrendingUp size={16} /> },
];

const bureaucracyLinks: SubLink[] = [
  { title: "Compliance Oracle", href: "/compliance-oracle", description: "AI-powered regulatory and compliance analysis.", icon: <ShieldCheck size={16} /> },
  { title: "Financial Reporting", href: "/financial-reporting", description: "Generate and view financial statements.", icon: <BarChart3 size={16} /> },
  { title: "Security Center", href: "/security-center", description: "Monitor and manage account security settings.", icon: <Lock size={16} /> },
  { title: "Developer Hub", href: "/developer-hub", description: "Access APIs, SDKs, and developer documentation.", icon: <Code size={16} /> },
  { title: "API Status", href: "/api-status", description: "Check the real-time status of our services.", icon: <Server size={16} /> },
  { title: "Knowledge Base", href: "/knowledge-base", description: "Browse articles, guides, and tutorials.", icon: <BookOpen size={16} /> },
];

const settingsLinks: SubLink[] = [
  { title: "Profile", href: "/settings", description: "Manage your personal information and profile.", icon: <User size={16} /> },
  { title: "Personalization", href: "/personalization", description: "Customize the application's look and feel.", icon: <Palette size={16} /> },
  { title: "SSO & Authentication", href: "/sso", description: "Configure Single Sign-On and security keys.", icon: <KeyRound size={16} /> },
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
  { 
    id: 'banking', 
    label: 'Banking', 
    icon: <DollarSign className="w-5 h-5" />, 
    columns: chunkLinks(bankingLinks, 2),
    description: "A complete suite of AI-driven tools for personal and corporate banking, from payments to treasury."
  },
  { 
    id: 'bureaucracy', 
    label: 'Bureaucracy', 
    icon: <Briefcase className="w-5 h-5" />, 
    columns: chunkLinks(bureaucracyLinks, 2),
    description: "Navigate the complexities of modern finance with powerful compliance, security, and reporting tools."
  },
  { 
    id: 'settings', 
    label: 'Settings', 
    icon: <Settings className="w-5 h-5" />, 
    columns: chunkLinks(settingsLinks, 1),
    description: "Configure your account, personalize your experience, and manage security settings."
  },
];

// --- Components ---

const MegaNavBar: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const triggerRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map());

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mega menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveCategory(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mega menu on 'Escape' key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (activeCategory) {
          triggerRefs.current.get(activeCategory)?.focus();
        }
        setActiveCategory(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCategory]);

  const handleToggleMenu = (categoryId: string) => {
    setActiveCategory(prev => (prev === categoryId ? null : categoryId));
  };

  const closeMenus = () => {
    setActiveCategory(null);
    setIsMobileMenuOpen(false);
  };

  const headerHeight = scrolled ? 80 : 96; // Scrolled: 64px (h-16) + 16px (py-2) = 80px. Unscrolled: 64px + 32px (py-4) = 96px.

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
          <Link to="/" onClick={closeMenus} className="flex-shrink-0 flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-slate-800 p-2 rounded-full border border-slate-600">
                <Globe className="w-8 h-8 text-cyan-400 animate-pulse-slow" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                SOVEREIGN
              </span>
              <span className="text-[0.6rem] uppercase tracking-widest text-cyan-500 font-semibold">
                AI Financial OS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav ref={navRef} className="hidden xl:flex space-x-1 h-full items-center">
            {NAV_DATA.map((category) => (
              <div 
                key={category.id}
                className="relative h-full flex items-center"
              >
                <button 
                  ref={(el) => triggerRefs.current.set(category.id, el)}
                  onClick={() => handleToggleMenu(category.id)}
                  aria-haspopup="true"
                  aria-expanded={activeCategory === category.id}
                  aria-controls={`${category.id}-menu`}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                    ${activeCategory === category.id ? 'bg-slate-800 text-cyan-400 shadow-inner' : 'hover:bg-slate-800/50 text-slate-300 hover:text-white'}
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
                  `}
                >
                  {category.icon}
                  {category.label}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeCategory === category.id ? 'rotate-180' : ''}`} />
                </button>

                {/* Mega Menu Dropdown */}
                <div 
                  id={`${category.id}-menu`}
                  className={`
                    absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-auto
                    bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden
                    transition-all duration-300 origin-top
                    ${activeCategory === category.id ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}
                  `}
                >
                  <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400"></div>
                  
                  <div className="p-8 flex gap-8">
                    {/* Sidebar Info */}
                    <div className="w-64 flex-shrink-0 bg-slate-800/50 rounded-lg p-6 border border-slate-700/50 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                          {category.icon} {category.label}
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                          {category.description}
                        </p>
                        <Link to={`/${category.id}`} onClick={closeMenus} className="w-full block text-center py-2 px-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-medium text-sm transition-colors">
                          View All {category.label}
                        </Link>
                      </div>
                    </div>

                    {/* Links Grid */}
                    <div className="grid grid-flow-col auto-cols-max gap-x-12 gap-y-4">
                      {category.columns.map((col, colIdx) => (
                        <ul key={colIdx} className="space-y-1">
                          {col.map((link, linkIdx) => (
                            <li key={linkIdx}>
                              <Link 
                                to={link.href} 
                                onClick={closeMenus}
                                className="group/link flex items-start gap-4 p-3 rounded-lg hover:bg-slate-800/70 transition-colors w-64"
                              >
                                <div className="mt-1 text-cyan-500 group-hover/link:text-cyan-400">
                                  {link.icon}
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-slate-200 group-hover/link:text-white">
                                    {link.title}
                                  </div>
                                  <div className="text-xs text-slate-500 group-hover/link:text-slate-400 line-clamp-2 mt-0.5">
                                    {link.description}
                                  </div>
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ))}
                    </div>
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
                placeholder="Search modules..." 
                className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-full pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400" />
            </div>
            
            <button className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-5 py-2 rounded-full font-bold text-sm shadow-lg hover:shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5">
              <Bot className="w-4 h-4" />
              <span>AI Command</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="xl:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-300 hover:text-white p-2"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="xl:hidden fixed inset-x-0 bg-slate-900 z-40 overflow-y-auto"
          style={{ top: `${headerHeight}px`, bottom: 0 }}
        >
          <div className="p-4 space-y-6">
            {NAV_DATA.map((category) => (
              <div key={category.id} className="border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-lg font-bold text-cyan-400 mb-4">
                  {category.icon}
                  {category.label}
                </div>
                <div className="grid grid-cols-1 gap-2 pl-4">
                  {category.columns.flat().map((link, idx) => (
                    <Link key={idx} to={link.href} onClick={closeMenus} className="block py-2 text-slate-300 text-sm border-l-2 border-slate-800 pl-3 hover:border-cyan-500 hover:text-white transition-all">
                      {link.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <div className="pt-4 pb-8">
              <button className="w-full flex justify-center items-center gap-2 bg-cyan-600 text-white py-3 rounded-lg font-bold">
                <Bot className="w-5 h-5" />
                AI Command
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default MegaNavBar;