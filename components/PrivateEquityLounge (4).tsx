```typescript
import React, { useState, useMemo, useEffect, useCallback } from 'react';

// --- DATA MODELS AND INTERFACES ---

interface Stakeholder {
    id: number;
    name: string;
    shares: number;
    type: 'Founder' | 'Investor' | 'Employee' | 'Option Pool' | 'Advisor';
    equityPercentage: number;
    basis: number;
    vested: number;
    votingRights: boolean;
    antiDilution: 'None' | 'Full Ratchet' | 'Weighted Average';
    liquidationPreference: number;
    lastActivity: string;
}

interface FinancialMetric {
    label: string;
    value: number;
    delta: number;
    trend: 'up' | 'down' | 'flat';
    prefix?: string;
    suffix?: string;
    aiProjection: number;
}

interface AIInsight {
    id: number;
    category: 'Risk' | 'Opportunity' | 'Compliance' | 'Strategy' | 'Market';
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    message: string;
    timestamp: string;
    actionable: boolean;
}

interface Document {
    id: number;
    name: string;
    type: string;
    size: string;
    uploadDate: string;
    status: 'Verified' | 'Pending' | 'Flagged' | 'Archived';
    accessLevel: 'Admin' | 'Board' | 'Public' | 'Restricted';
    version: string;
    lastAccessed: string;
    aiSummary: string;
    sentiment: 'Positive' | 'Neutral' | 'Negative';
    keyClauses: string[];
}

interface ChatMessage {
    id: number;
    sender: 'User' | 'System_AI';
    text: string;
    timestamp: Date;
    isThinking?: boolean;
}

interface PortfolioCompany {
    id: number;
    name: string;
    sector: string;
    valuation: number;
    revenue: number;
    ebitda: number;
    ownership: number;
    health: 'Healthy' | 'Concern' | 'Critical';
    trendData: number[];
    burnRate: number;
    cac: number;
    esgScore: number;
}

interface Deal {
    id: number;
    name: string;
    stage: 'Sourcing' | 'Diligence' | 'Term Sheet' | 'Closing' | 'Passed';
    potential: number; // in millions
    lead: string;
    aiFitScore: number;
    source: string;
}

interface ComplianceTask {
    id: number;
    title: string;
    dueDate: string;
    status: 'Completed' | 'In Progress' | 'Pending' | 'Overdue';
    priority: 'High' | 'Medium' | 'Low';
    owner: string;
    automationStatus: 'Automated' | 'Manual' | 'Hybrid';
}

interface MarketSignal {
    id: number;
    source: string;
    headline: string;
    impact: 'Positive' | 'Negative' | 'Neutral';
    relevance: number;
    timestamp: string;
}

interface RiskFactor {
    id: number;
    category: 'Market' | 'Operational' | 'Geopolitical' | 'Regulatory';
    description: string;
    probability: number;
    impact: number;
    mitigationPlan: string;
}

interface ESGMetric {
    companyId: number;
    environmental: { score: number; details: string; };
    social: { score: number; details: string; };
    governance: { score: number; details: string; };
    overallScore: number;
}

interface FundMetric {
    name: string;
    value: string;
    description: string;
}

// --- MOCK DATA ---

const mockStakeholders: Stakeholder[] = [
    { id: 1, name: "Prosperity Fund A (PFS)", shares: 4500000, type: 'Investor', equityPercentage: 45.00, basis: 50000000, vested: 100, votingRights: true, antiDilution: 'Weighted Average', liquidationPreference: 1.5, lastActivity: '2 weeks ago' },
    { id: 2, name: "Alice Founder", shares: 2500000, type: 'Founder', equityPercentage: 25.00, basis: 10000, vested: 85, votingRights: true, antiDilution: 'None', liquidationPreference: 1.0, lastActivity: '3 hours ago' },
    { id: 3, name: "Bob Co-Founder", shares: 1500000, type: 'Founder', equityPercentage: 15.00, basis: 10000, vested: 85, votingRights: true, antiDilution: 'None', liquidationPreference: 1.0, lastActivity: '1 day ago' },
    { id: 4, name: "Employee Pool (Vested)", shares: 1000000, type: 'Employee', equityPercentage: 10.00, basis: 0, vested: 100, votingRights: false, antiDilution: 'None', liquidationPreference: 1.0, lastActivity: 'N/A' },
    { id: 5, name: "Future Options Pool", shares: 500000, type: 'Option Pool', equityPercentage: 5.00, basis: 0, vested: 0, votingRights: false, antiDilution: 'None', liquidationPreference: 1.0, lastActivity: 'N/A' },
    { id: 6, name: "Strategic Advisor Group", shares: 100000, type: 'Advisor', equityPercentage: 1.00, basis: 0, vested: 50, votingRights: false, antiDilution: 'None', liquidationPreference: 1.0, lastActivity: '1 month ago' },
];

const initialDocuments: Document[] = [
    { id: 1, name: "Series A Term Sheet.pdf", type: "PDF", size: "2.4 MB", uploadDate: "2023-10-15", status: "Verified", accessLevel: "Board", version: "v3.1 Final", lastAccessed: "2024-03-10 by A. Smith", aiSummary: "Outlines a $50M raise at a $100M pre-money valuation, with 1x liquidation preference and standard protective provisions.", sentiment: 'Neutral', keyClauses: ['Liquidation Preference: 1.0x', 'Anti-Dilution: Weighted Average', 'Board Seat: 1 for Series A lead'] },
    { id: 2, name: "Q3 Financial Audit.xlsx", type: "XLSX", size: "4.1 MB", uploadDate: "2023-11-02", status: "Verified", accessLevel: "Admin", version: "v1.0", lastAccessed: "2024-03-11 by C. Lee", aiSummary: "Presents audited financials for Q3 2023, showing 8.2% QoQ revenue growth and a slight increase in burn rate.", sentiment: 'Positive', keyClauses: ['Revenue Growth: 8.2% QoQ', 'Net Loss: $1.2M', 'Cash on Hand: $21M'] },
    { id: 3, name: "IP Assignment Agreements.zip", type: "ZIP", size: "15.0 MB", uploadDate: "2023-09-01", status: "Flagged", accessLevel: "Admin", version: "v1.2", lastAccessed: "2024-02-28 by AI Scanner", aiSummary: "AI Flag: Missing signature from a key engineer on one of the core IP assignment documents. Requires immediate review.", sentiment: 'Negative', keyClauses: ['Missing Signature: J. Doe', 'Core IP: "Quantum Core" algorithm'] },
    { id: 4, name: "Board Meeting Minutes Oct.docx", type: "DOCX", size: "1.2 MB", uploadDate: "2023-10-28", status: "Pending", accessLevel: "Board", version: "v0.9 Draft", lastAccessed: "2024-03-09 by B. Co-Founder", aiSummary: "Draft minutes awaiting board approval. Key topics include market expansion strategy and Q4 budget allocation.", sentiment: 'Neutral', keyClauses: ['Topic: APAC Expansion', 'Budget Approval: Q4 Marketing Spend'] },
    { id: 5, name: "Competitor Analysis Q4.pdf", type: "PDF", size: "5.8 MB", uploadDate: "2024-01-15", status: "Archived", accessLevel: "Restricted", version: "v2.0", lastAccessed: "2024-02-15 by AI Analyst", aiSummary: "Deep dive into competitor landscape, highlighting market share shifts and emerging threats from 'InnovateNext'.", sentiment: 'Negative', keyClauses: ['Market Share Loss: 2%', 'New Threat: InnovateNext Series B raise'] },
];

const initialInsights: AIInsight[] = [
    { id: 1, category: 'Opportunity', severity: 'High', message: "Market analysis suggests a 15% valuation premium if IPO is delayed to Q3 2025 due to sector rotation.", timestamp: "10:42 AM", actionable: true },
    { id: 2, category: 'Risk', severity: 'Medium', message: "Burn rate has increased by 8% month-over-month. Recommended review of marketing spend efficiency.", timestamp: "09:15 AM", actionable: true },
    { id: 3, category: 'Compliance', severity: 'Critical', message: "Annual 409A valuation update required within 45 days. Failure to comply may result in tax penalties.", timestamp: "Yesterday", actionable: true },
    { id: 4, category: 'Market', severity: 'Low', message: "Federal Reserve interest rate hold is likely to stabilize SaaS multiples for the upcoming quarter.", timestamp: "11:30 AM", actionable: false },
];

const initialPortfolio: PortfolioCompany[] = [
    { id: 1, name: "Innovate Inc.", sector: "SaaS", valuation: 120, revenue: 15, ebitda: -2, ownership: 25, health: 'Healthy', trendData: [3, 4, 5, 4, 6, 7, 9], burnRate: 250000, cac: 5200, esgScore: 85 },
    { id: 2, name: "QuantumLeap", sector: "Deep Tech", valuation: 300, revenue: 5, ebitda: -15, ownership: 18, health: 'Healthy', trendData: [2, 3, 3, 5, 6, 8, 7], burnRate: 1200000, cac: 150000, esgScore: 72 },
    { id: 3, name: "BioSynth", sector: "Biotech", valuation: 80, revenue: 1, ebitda: -8, ownership: 40, health: 'Concern', trendData: [9, 8, 6, 7, 5, 4, 3], burnRate: 700000, cac: 250000, esgScore: 65 },
    { id: 4, name: "ConnectSphere", sector: "Social Media", valuation: 50, revenue: 12, ebitda: 1, ownership: 60, health: 'Critical', trendData: [5, 6, 4, 3, 2, 3, 1], burnRate: 50000, cac: 15, esgScore: 45 },
];

const initialDeals: Deal[] = [
    { id: 1, name: "Project Titan", stage: 'Diligence', potential: 250, lead: "A. Smith", aiFitScore: 88, source: "Proprietary Network" },
    { id: 2, name: "Fusion Grid", stage: 'Sourcing', potential: 500, lead: "C. Lee", aiFitScore: 75, source: "Inbound" },
    { id: 3, name: "AeroDynamics", stage: 'Term Sheet', potential: 150, lead: "A. Smith", aiFitScore: 92, source: "Banker Intro" },
    { id: 4, name: "HealthChain", stage: 'Diligence', potential: 300, lead: "J. Doe", aiFitScore: 81, source: "Proprietary Network" },
    { id: 5, name: "Quantum Core", stage: 'Closing', potential: 400, lead: "A. Smith", aiFitScore: 95, source: "Follow-on" },
    { id: 6, name: "EcoSolutions", stage: 'Passed', potential: 100, lead: "C. Lee", aiFitScore: 60, source: "Inbound" },
];

const initialComplianceTasks: ComplianceTask[] = [
    { id: 1, title: "409A Valuation Update", dueDate: "2024-04-30", status: 'In Progress', priority: 'High', owner: "CFO Office", automationStatus: 'Hybrid' },
    { id: 2, title: "Quarterly Investor Report", dueDate: "2024-04-15", status: 'Pending', priority: 'High', owner: "IR Team", automationStatus: 'Automated' },
    { id: 3, title: "AML/KYC Refresh", dueDate: "2024-05-20", status: 'Pending', priority: 'Medium', owner: "Compliance Dept.", automationStatus: 'Manual' },
    { id: 4, title: "GDPR Audit", dueDate: "2024-06-01", status: 'Completed', priority: 'Medium', owner: "Legal Team", automationStatus: 'Hybrid' },
    { id: 5, title: "SEC Form PF Filing", dueDate: "2024-03-30", status: 'Overdue', priority: 'High', owner: "Compliance Dept.", automationStatus: 'Manual' },
];

const mockMarketSignals: MarketSignal[] = [
    { id: 1, source: "Bloomberg", headline: "Global SaaS multiples compress by 5% amid rising interest rates.", impact: 'Negative', relevance: 95, timestamp: "2h ago" },
    { id: 2, source: "TechCrunch", headline: "QuantumLeap competitor 'Photon Systems' raises $200M Series C.", impact: 'Negative', relevance: 88, timestamp: "8h ago" },
    { id: 3, source: "Reuters", headline: "New legislation provides tax credits for domestic biotech manufacturing.", impact: 'Positive', relevance: 92, timestamp: "1d ago" },
    { id: 4, source: "WSJ", headline: "Consumer spending on social media apps shows signs of slowing.", impact: 'Neutral', relevance: 70, timestamp: "2d ago" },
];

const mockRiskFactors: RiskFactor[] = [
    { id: 1, category: 'Market', description: "Sustained high interest rates depressing valuations", probability: 0.7, impact: 4, mitigationPlan: "Focus on profitability and extend runway." },
    { id: 2, category: 'Geopolitical', description: "Supply chain disruptions for hardware components from APAC", probability: 0.4, impact: 5, mitigationPlan: "Diversify suppliers and increase domestic inventory." },
    { id: 3, category: 'Operational', description: "Key person dependency on founders at Innovate Inc.", probability: 0.6, impact: 3, mitigationPlan: "Implement succession planning and knowledge transfer protocols." },
    { id: 4, category: 'Regulatory', description: "Increased data privacy scrutiny impacting ConnectSphere's ad model", probability: 0.8, impact: 4, mitigationPlan: "Proactively adopt stricter privacy standards and diversify revenue streams." },
];

const mockEsgMetrics: ESGMetric[] = [
    { companyId: 1, environmental: { score: 90, details: "Carbon neutral operations." }, social: { score: 85, details: "High employee satisfaction." }, governance: { score: 80, details: "Independent board majority." }, overallScore: 85 },
    { companyId: 2, environmental: { score: 60, details: "High energy consumption." }, social: { score: 75, details: "Strong community outreach." }, governance: { score: 80, details: "Transparent reporting." }, overallScore: 72 },
    { companyId: 3, environmental: { score: 70, details: "Waste reduction program in place." }, social: { score: 60, details: "Concerns over clinical trial diversity." }, governance: { score: 65, details: "Founder-controlled board." }, overallScore: 65 },
    { companyId: 4, environmental: { score: 50, details: "Minimal environmental policy." }, social: { score: 30, details: "Content moderation issues." }, governance: { score: 55, details: "Dual-class share structure." }, overallScore: 45 },
];

const mockFundMetrics: FundMetric[] = [
    { name: "TVPI", value: "3.2x", description: "Total Value to Paid-In Capital" },
    { name: "DPI", value: "1.1x", description: "Distributions to Paid-In Capital" },
    { name: "Fund IRR", value: "28.5%", description: "Internal Rate of Return (Net)" },
    { name: "Committed Capital", value: "$500M", description: "Total capital committed by LPs" },
    { name: "Called Capital", value: "$350M", description: "Capital called from LPs to date" },
    { name: "Dry Powder", value: "$150M", description: "Uncalled capital available for investment" },
];

type ActiveTab = 'Dashboard' | 'FundPerformance' | 'Portfolio' | 'CapTable' | 'Liquidity' | 'DealFlow' | 'DataRoom' | 'Compliance' | 'MarketIntel' | 'RiskMatrix' | 'ESG' | 'AI_Advisor' | 'Settings';

// --- COMPONENT DEFINITION ---

const PrivateEquityLounge: React.FC = () => {
    // State Management
    const [activeTab, setActiveTab] = useState<ActiveTab>('Dashboard');
    const [stakeholders, setStakeholders] = useState<Stakeholder[]>(mockStakeholders);
    const [documents] = useState<Document[]>(initialDocuments);
    const [insights] = useState<AIInsight[]>(initialInsights);
    const [portfolio, setPortfolio] = useState<PortfolioCompany[]>(initialPortfolio);
    const [deals] = useState<Deal[]>(initialDeals);
    const [complianceTasks] = useState<ComplianceTask[]>(initialComplianceTasks);
    const [marketSignals] = useState<MarketSignal[]>(mockMarketSignals);
    const [riskFactors] = useState<RiskFactor[]>(mockRiskFactors);
    const [esgMetrics] = useState<ESGMetric[]>(mockEsgMetrics);
    const [fundMetrics] = useState<FundMetric[]>(mockFundMetrics);
    
    // Financial State
    const [valuation, setValuation] = useState<number>(100000000);
    const [revenue, setRevenue] = useState<number>(12500000);
    const [ebitda, setEbitda] = useState<number>(-2500000);
    const [cashOnHand, setCashOnHand] = useState<number>(18000000);
    
    // Scenario State
    const [exitValuation, setExitValuation] = useState<number>(250000000);
    const [exitDate, setExitDate] = useState<number>(36);
    
    // Chat State
    const [chatInput, setChatInput] = useState('');
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
        { id: 1, sender: 'System_AI', text: "Welcome to the Executive Suite. I have analyzed your real-time financial data. How can I assist with your strategic planning today?", timestamp: new Date() }
    ]);

    // Modal State
    const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);

    // HFT Simulation Effect
    useEffect(() => {
        const interval = setInterval(() => {
            setPortfolio(prevPortfolio =>
                prevPortfolio.map(company => {
                    const change = (Math.random() - 0.5) * 0.02; // +/- 1% change
                    const newTrend = [...company.trendData.slice(1), Math.max(1, company.trendData[company.trendData.length - 1] + (Math.random() * 4 - 2))];
                    return {
                        ...company,
                        valuation: Math.round(company.valuation * (1 + change)),
                        trendData: newTrend,
                    };
                })
            );
        }, 1500); // Update every 1.5 seconds
        return () => clearInterval(interval);
    }, []);

    // Computed Metrics
    const totalShares = useMemo(() => stakeholders.reduce((sum, s) => sum + s.shares, 0), [stakeholders]);
    
    const kpis: FinancialMetric[] = useMemo(() => [
        { label: "Current Valuation", value: valuation, delta: 12.5, trend: 'up', prefix: "$", aiProjection: 120000000 },
        { label: "ARR (Annual Recurring)", value: revenue, delta: 8.2, trend: 'up', prefix: "$", aiProjection: 13500000 },
        { label: "EBITDA", value: ebitda, delta: -2.1, trend: 'down', prefix: "$", aiProjection: -2000000 },
        { label: "Runway (Months)", value: cashOnHand / Math.abs(ebitda / 12), delta: 0, trend: 'flat', suffix: " Mo", aiProjection: 8.5 },
    ], [valuation, revenue, ebitda, cashOnHand]);

    const exitScenarios = useMemo(() => {
        const grossReturn = exitValuation;
        const investor = stakeholders.find(s => s.type === 'Investor');
        if (!investor) return null;
        
        const investorReturn = grossReturn * (investor.equityPercentage / 100);
        const multiple = investorReturn / investor.basis;
        const irr = (Math.pow(multiple, 1 / (exitDate / 12)) - 1) * 100;
        
        return { grossReturn, investorReturn, multiple, irr };
    }, [exitValuation, exitDate, stakeholders]);

    // Event Handlers
    const handleSendMessage = useCallback(() => {
        if (!chatInput.trim()) return;
        
        const userMsg: ChatMessage = { id: Date.now(), sender: 'User', text: chatInput, timestamp: new Date() };
        setChatHistory(prev => [...prev, userMsg]);
        setChatInput('');

        const thinkingMsg: ChatMessage = { id: Date.now() + 1, sender: 'System_AI', text: "Thinking...", timestamp: new Date(), isThinking: true };
        setChatHistory(prev => [...prev, thinkingMsg]);

        // Simulate AI processing - replace with actual API call
        setTimeout(() => {
            let responseText = "I am processing that request against our global market database and proprietary fund data.";
            if (userMsg.text.toLowerCase().includes('valuation')) {
                responseText = `Based on current SaaS multiples of 8x-12x, a valuation of $${(revenue * 10).toLocaleString()} is defensible. Your current valuation of $${valuation.toLocaleString()} is conservative. My analysis suggests a potential upside to $120M in the next 6 months based on market signals.`;
            } else if (userMsg.text.toLowerCase().includes('risk')) {
                responseText = "Primary risk factors identified: 1. Customer concentration in Tech sector (mitigation: diversify into healthcare). 2. Rising CAC due to ad market saturation (mitigation: focus on organic growth channels). 3. Key person dependency on Alice Founder (mitigation: formalize succession plan).";
            } else if (userMsg.text.toLowerCase().includes('exit')) {
                responseText = `Modeling a $${exitValuation.toLocaleString()} exit in ${exitDate} months yields a ${exitScenarios?.multiple.toFixed(2)}x multiple for primary investors. This exceeds the fund's hurdle rate of 3.0x. The probability of achieving this valuation is currently 62%, contingent on hitting revenue growth targets.`;
            }

            const aiMsg: ChatMessage = { id: Date.now() + 1, sender: 'System_AI', text: responseText, timestamp: new Date() };
            setChatHistory(prev => {
                const newHistory = prev.filter(m => !m.isThinking);
                return [...newHistory, aiMsg];
            });
        }, 1500);
    }, [chatInput, revenue, valuation, exitValuation, exitDate, exitScenarios]);

    const handleIssueOptions = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const grantee = (form.elements.namedItem('grantee') as HTMLInputElement).value;
        const shares = parseInt((form.elements.namedItem('shares') as HTMLInputElement).value, 10);
        
        if (grantee && shares > 0) {
            const newStakeholder: Stakeholder = {
                id: Date.now(),
                name: grantee,
                shares: shares,
                type: 'Employee',
                equityPercentage: (shares / (totalShares + shares)) * 100,
                basis: 0,
                vested: 0,
                votingRights: false,
                antiDilution: 'None',
                liquidationPreference: 1.0,
                lastActivity: 'Just now'
            };
            // This is a simplified update, a real one would re-calculate all percentages
            setStakeholders(prev => [...prev, newStakeholder]);
            setIsOptionModalOpen(false);
        }
    }, [totalShares]);

    // --- RENDER FUNCTIONS ---

    const renderSidebar = () => (
        <div style={styles.sidebar}>
            <div style={styles.logoArea}>
                <div style={styles.logoCircle}>PE</div>
                <h2 style={styles.logoText}>NEXUS<span style={{color: '#00aaff'}}>OS</span></h2>
            </div>
            <nav style={styles.nav}>
                {['Dashboard', 'FundPerformance', 'Portfolio', 'CapTable', 'Liquidity', 'DealFlow', 'DataRoom', 'Compliance', 'MarketIntel', 'RiskMatrix', 'ESG', 'AI_Advisor', 'Settings'].map((tab) => (
                    <button 
                        key={tab} 
                        style={activeTab === tab ? styles.navButtonActive : styles.navButton}
                        onClick={() => setActiveTab(tab as any)}
                    >
                        {tab.replace('_', ' ')}
                    </button>
                ))}
            </nav>
            <div style={styles.sidebarFooter}>
                <div style={styles.statusIndicator}>
                    <span style={styles.statusDot}></span> System Operational
                </div>
                <div style={styles.userProfile}>
                    <div style={styles.avatar}>AS</div>
                    <div style={styles.userInfo}>
                        <span style={styles.userName}>Alex Smith</span>
                        <span style={styles.userRole}>Managing Partner</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderDashboard = () => (
        <div style={styles.contentFadeIn}>
            <header style={styles.pageHeader}>
                <div>
                    <h1 style={styles.pageTitle}>Executive Command Center</h1>
                    <p style={styles.pageSubtitle}>Real-time enterprise telemetry and strategic oversight.</p>
                </div>
                <div style={styles.headerActions}>
                    <button style={styles.actionButton}>Generate Report</button>
                    <button style={styles.primaryButton}>Invite Stakeholder</button>
                </div>
            </header>
            <div style={styles.kpiGrid}>{kpis.map((kpi, idx) => <div key={idx} style={styles.kpiCard}><span style={styles.kpiLabel}>{kpi.label}</span><div style={styles.kpiValueRow}><span style={styles.kpiValue}>{kpi.prefix}{kpi.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}{kpi.suffix}</span><span style={{ ...styles.kpiDelta, color: kpi.trend === 'up' ? '#00ff9d' : kpi.trend === 'down' ? '#ff4d4d' : '#aaa' }}>{kpi.delta > 0 ? '+' : ''}{kpi.delta}%</span></div><div style={styles.miniChart}><div style={{ ...styles.chartBar, height: '40%' }}></div><div style={{ ...styles.chartBar, height: '60%' }}></div><div style={{ ...styles.chartBar, height: '50%' }}></div><div style={{ ...styles.chartBar, height: '80%' }}></div><div style={{ ...styles.chartBar, height: '100%', backgroundColor: '#00aaff' }}></div></div></div>)}</div>
            <div style={styles.dashboardGrid}><div style={styles.dashboardPanel}><h3 style={styles.panelTitle}>AI Strategic Insights</h3><div style={styles.insightList}>{insights.map(insight => <div key={insight.id} style={styles.insightItem}><div style={{...styles.severityIndicator, backgroundColor: insight.severity === 'Critical' ? '#ff0000' : insight.severity === 'High' ? '#ff4d4d' : insight.severity === 'Medium' ? '#ffaa00' : '#00aaff'}}></div><div style={styles.insightContent}><div style={styles.insightHeader}><span style={styles.insightCategory}>{insight.category}</span><span style={styles.insightTime}>{insight.timestamp}</span></div><p style={styles.insightMessage}>{insight.message}</p></div></div>)}</div></div><div style={styles.dashboardPanel}><h3 style={styles.panelTitle}>Market Performance vs Peers</h3><div style={styles.chartPlaceholder}><div style={styles.chartGridLines}>{[1,2,3,4,5].map(i => <div key={i} style={styles.gridLine}></div>)}</div><div style={styles.chartBarsContainer}><div style={{...styles.chartBarLarge, height: '40%', left: '10%'}}></div><div style={{...styles.chartBarLarge, height: '55%', left: '30%'}}></div><div style={{...styles.chartBarLarge, height: '45%', left: '50%'}}></div><div style={{...styles.chartBarLarge, height: '70%', left: '70%'}}></div><div style={{...styles.chartBarLarge, height: '85%', left: '90%', backgroundColor: '#00aaff', boxShadow: '0 0 15px rgba(0,170,255,0.5)'}}></div></div><div style={styles.chartLabels}><span>Q1</span><span>Q2</span><span>Q3</span><span>Q4</span><span>Current</span></div></div></div></div>
        </div>
    );

    const renderFundPerformance = () => (
        <div style={styles.contentFadeIn}>
            <header style={styles.pageHeader}><div><h1 style={styles.pageTitle}>Fund Performance Overview</h1><p style={styles.pageSubtitle}>Key metrics for Prosperity Fund A.</p></div></header>
            <div style={styles.fundPerfGrid}>
                {fundMetrics.map(metric => (
                    <div key={metric.name} style={styles.fundPerfCard}>
                        <span style={styles.kpiLabel}>{metric.name}</span>
                        <span style={styles.fundPerfValue}>{metric.value}</span>
                        <p style={styles.fundPerfDesc}>{metric.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderPortfolio = () => (
        <div style={styles.contentFadeIn}>
            <header style={styles.pageHeader}><div><h1 style={styles.pageTitle}>Portfolio Monitoring</h1><p style={styles.pageSubtitle}>Live performance tracking of fund assets.</p></div></header>
            <div style={styles.portfolioGrid}>
                {portfolio.map(p => (
                    <div key={p.id} style={styles.portfolioCard}>
                        <div style={styles.portfolioCardHeader}>
                            <h3 style={styles.portfolioCardTitle}>{p.name}</h3>
                            <span style={{...styles.healthIndicator, backgroundColor: p.health === 'Healthy' ? '#00ff9d' : p.health === 'Concern' ? '#ffaa00' : '#ff4d4d'}}>{p.health}</span>
                        </div>
                        <p style={styles.portfolioCardSector}>{p.sector}</p>
                        <div style={styles.portfolioMetricGrid}>
                            <div><span style={styles.portfolioMetricLabel}>Valuation</span><span style={styles.portfolioMetricValue}>${p.valuation}M</span></div>
                            <div><span style={styles.portfolioMetricLabel}>Revenue</span><span style={styles.portfolioMetricValue}>${p.revenue}M</span></div>
                            <div><span style={styles.portfolioMetricLabel}>EBITDA</span><span style={styles.portfolioMetricValue}>${p.ebitda}M</span></div>
                            <div><span style={styles.portfolioMetricLabel}>Ownership</span><span style={styles.portfolioMetricValue}>{p.ownership}%</span></div>
                            <div><span style={styles.portfolioMetricLabel}>Burn Rate</span><span style={styles.portfolioMetricValue}>${(p.burnRate/1000).toFixed(0)}k/mo</span></div>
                            <div><span style={styles.portfolioMetricLabel}>CAC</span><span style={styles.portfolioMetricValue}>${p.cac.toLocaleString()}</span></div>
                        </div>
                        <div style={styles.sparkline}>
                            {p.trendData.map((d, i) => <div key={i} style={{...styles.sparklineBar,