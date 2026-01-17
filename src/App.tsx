import React, a from 'react';
import { BrowserRouter, Routes, Route, Outlet, Link, NavLink, useLocation } from 'react-router-dom';
import './App.css';

// --- CONTEXT PROVIDER ---
// In a real app, this would be in 'src/contexts/CivicContext.tsx'
interface CivicContextType {
  organizationName: string;
  motto: string;
  foundingYear: number;
}
const CivicContext = React.createContext<CivicContextType | null>(null);

const CivicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const civicInfo: CivicContextType = {
    organizationName: "Citizens for a Computationally-Optimal Tomorrow (CCOT)",
    motto: "In Algorithms We Trust. All Others Pay Cash.",
    foundingYear: 2024,
  };

  return (
    <CivicContext.Provider value={civicInfo}>
      {children}
    </CivicContext.Provider>
  );
};

// --- ROUTE CONFIGURATION ---
// The glorious, overwhelming list of 100+ tabs for our informational monolith.
export interface RouteConfig {
  path: string;
  title: string;
  shortTitle: string;
}

export const routesConfig: RouteConfig[] = [
  // Core AI Banking Concepts
  { path: "/ai-in-credit-scoring", title: "AI-Powered Predictive Credit Scoring & Risk Analysis", shortTitle: "Credit Scoring" },
  { path: "/neuromorphic-fraud-detection", title: "Neuromorphic Computing for Real-Time Fraud Detection", shortTitle: "Fraud Detection" },
  { path: "/quantum-financial-modeling", title: "Quantum Computing in High-Frequency Trading & Financial Modeling", shortTitle: "Quantum Finance" },
  { path: "/generative-advisory", title: "Generative AI for Hyper-Personalized Wealth Management", shortTitle: "AI Advisors" },
  { path: "/decentralized-autonomous-banking", title: "Decentralized Autonomous Organizations (DAOs) in Banking", shortTitle: "DAO Banking" },
  { path: "/explainable-ai-finance", title: "The Mandate for Explainable AI (XAI) in Financial Regulation", shortTitle: "Explainable AI" },
  { path: "/sentiment-analysis-markets", title: "Market Prediction via Global Sentiment Analysis & NLP", shortTitle: "Sentiment Analysis" },
  { path: "/reinforcement-learning-portfolios", title: "Reinforcement Learning for Dynamic Portfolio Optimization", shortTitle: "RL Portfolios" },
  { path: "/synthetic-data-stress-testing", title: "Generating Synthetic Data for Robust Economic Stress Testing", shortTitle: "Synthetic Data" },
  { path: "/ai-aml-kyc", title: "Automating AML & KYC Compliance with Machine Learning", shortTitle: "AI Compliance" },

  // The Hilarious 527 Political Organization Swag
  { path: "/super-pac-for-super-intelligence", title: "The Super-PAC for Super-Intelligence: Why AGI Needs Lobbyists", shortTitle: "AGI Lobbyists" },
  { path: "/gerrymandering-your-portfolio", title: "Gerrymandering Your Portfolio: Strategic Asset Re-districting", shortTitle: "Portfolio Gerrymandering" },
  { path: "/filibustering-bad-investments", title: "The Art of the Filibuster: Talking Down Bad Investments", shortTitle: "Investment Filibuster" },
  { path: "/dark-money-in-dark-pools", title: "Campaign Finance Reform for Dark Pool Trading Algorithms", shortTitle: "Dark Money/Pools" },
  { path: "/pork-barrel-apis", title: "Pork Barrel Spending: Advocating for Your Favorite Financial APIs", shortTitle: "Pork Barrel APIs" },
  { path: "/caucus-on-cloud-computing", title: "The Bipartisan Caucus on Cloud-Native Banking Infrastructure", shortTitle: "Cloud Caucus" },
  { path: "/electioneering-with-embeddings", title: "Voter Persuasion: Using Vector Embeddings for Targeted Financial Products", shortTitle: "AI Electioneering" },
  { path: "/grassroots-gan-movements", title: "Grassroots Activism for Generative Adversarial Networks", shortTitle: "GAN Activism" },
  { path: "/lame-duck-legacy-systems", title: "Sunsetting Lame Duck Legacy Systems: A Political Transition Plan", shortTitle: "Lame Duck Systems" },
  { path: "/judicial-review-of-code", title: "Establishing Judicial Review for Smart Contract Code Commits", shortTitle: "Code Judicial Review" },

  // Deep Dive Topics (20)
  { path: "/federated-learning-privacy", title: "Federated Learning: Collaborative AI without Centralizing Private Data", shortTitle: "Federated Learning" },
  { path: "/homomorphic-encryption-banking", title: "The Promise of Homomorphic Encryption for Secure Cloud Banking", shortTitle: "Homomorphic Encryption" },
  { path: "/swarm-intelligence-trading", title: "Swarm Intelligence Algorithms for Collective Trading Strategies", shortTitle: "Swarm Trading" },
  { path: "/causal-inference-economics", title: "Beyond Correlation: Causal Inference in Economic Policy AI", shortTitle: "Causal Inference" },
  { path: "/ai-in-microfinance", title: "AI's Role in Expanding Access to Microfinance in Developing Nations", shortTitle: "AI Microfinance" },
  { path: "/tokenization-of-assets", title: "The Tokenization of Everything: AI-Managed Real-World Assets", shortTitle: "Asset Tokenization" },
  { path: "/bias-and-fairness-audits", title: "Algorithmic Bias Audits: Ensuring Fairness in Lending Models", shortTitle: "Bias Audits" },
  { path: "/natural-language-contracts", title: "From Legalese to Code: NLP for Smart Contract Generation", shortTitle: "NLP Contracts" },
  { path: "/ai-powered-underwriting", title: "The Evolution of Insurance Underwriting with AI", shortTitle: "AI Underwriting" },
  { path: "/supply-chain-finance-ai", title: "Optimizing Supply Chain Finance with Predictive AI", shortTitle: "Supply Chain AI" },
  { path: "/robo-ethics-in-finance", title: "Establishing Ethical Frameworks for Autonomous Financial Agents", shortTitle: "Robo-Ethics" },
  { path: "/multi-agent-simulations", title: "Multi-Agent Simulations for Predicting Market Crashes", shortTitle: "Market Simulations" },
  { path: "/ai-for-esg-investing", title: "AI-Driven Analysis for ESG (Environmental, Social, Governance) Investing", shortTitle: "AI for ESG" },
  { path: "/the-singularity-of-the-fed", title: "What Happens When the Federal Reserve Becomes an AGI?", shortTitle: "The AGI Fed" },
  { path: "/cognitive-automation-in-ops", title: "Cognitive Automation for Back-Office Banking Operations", shortTitle: "Cognitive Automation" },
  { path: "/biometric-authentication-security", title: "The Convergence of AI and Biometrics for Unbreakable Security", shortTitle: "Biometric AI" },
  { path: "/ai-in-regtech", title: "The Rise of RegTech: AI for Navigating the Regulatory Maze", shortTitle: "AI RegTech" },
  { path: "/predictive-cash-flow", title: "AI for Predictive Corporate Cash Flow Management", shortTitle: "Predictive Cash Flow" },
  { path: "/chatbot-vs-human-support", title: "The Turing Test for Customer Support: AI vs. Human Agents", shortTitle: "AI Support" },
  { path: "/zero-knowledge-proofs", title: "Zero-Knowledge Proofs in Inter-Bank Transactions", shortTitle: "ZKP in Banking" },

  // Even More Topics (50 more to reach 100)
  { path: "/ai-and-the-future-of-work", title: "AI and the Future of Work in the Financial Sector", shortTitle: "Future of Work" },
  { path: "/the-economics-of-attention", title: "The Economics of Attention in a World of AI-Driven Content", shortTitle: "Attention Economics" },
  { path: "/digital-identity-verification", title: "AI-Powered Digital Identity Verification Systems", shortTitle: "Digital ID" },
  { path: "/ai-in-mergers-and-acquisitions", title: "AI's Role in M&A Target Identification and Due Diligence", shortTitle: "AI in M&A" },
  { path: "/algorithmic-collusion", title: "The Threat of Algorithmic Collusion and Antitrust Implications", shortTitle: "Algorithmic Collusion" },
  { path: "/ai-for-central-bank-digital-currencies", title: "AI Infrastructure for Central Bank Digital Currencies (CBDCs)", shortTitle: "AI for CBDCs" },
  { path: "/the-role-of-gpus-in-finance", title: "Why Your Bank Needs More GPUs: The Hardware Arms Race", shortTitle: "GPUs in Finance" },
  { path: "/adversarial-attacks-on-models", title: "Protecting Financial AI from Adversarial Attacks", shortTitle: "Adversarial Attacks" },
  { path: "/ai-driven-product-personalization", title: "Hyper-Personalization of Banking Products and Services", shortTitle: "Product Personalization" },
  { path: "/the-philosophy-of-digital-scarcity", title: "AI, Crypto, and the Philosophy of Digital Scarcity", shortTitle: "Digital Scarcity" },
  { path: "/ai-in-pension-fund-management", title: "Long-Term AI Strategies for Pension Fund Management", shortTitle: "AI Pension Funds" },
  { path: "/automated-financial-journalism", title: "When Robots Write the News: AI in Financial Journalism", shortTitle: "AI Journalism" },
  { path: "/the-psychology-of-robo-advice", title: "Human Trust in Algorithmic Financial Recommendations", shortTitle: "Robo-Advice Psychology" },
  { path: "/ai-and-geopolitical-risk", title: "Using AI to Model Geopolitical Risk on Global Markets", shortTitle: "Geopolitical AI" },
  { path: "/real-time-risk-dashboards", title: "AI-Powered Real-Time Risk Dashboards for Executives", shortTitle: "Risk Dashboards" },
  { path: "/the-data-monetization-debate", title: "The Ethics and Economics of Customer Data Monetization", shortTitle: "Data Monetization" },
  { path: "/ai-in-trade-finance", title: "Streamlining Global Trade Finance with AI and Blockchain", shortTitle: "AI Trade Finance" },
  { path: "/computational-law", title: "The Rise of Computational Law (CompuLaw) in Finance", shortTitle: "CompuLaw" },
  { path: "/ai-for-socially-responsible-investing", title: "AI for SRI: Aligning Investments with Personal Values", shortTitle: "AI for SRI" },
  { path: "/the-future-of-the-cfo", title: "How AI is Transforming the Role of the Chief Financial Officer", shortTitle: "Future of the CFO" },
  { path: "/ai-in-venture-capital", title: "Data-Driven Deal Sourcing: AI in Venture Capital", shortTitle: "AI in VC" },
  { path: "/the-quant-meltdown-of-2007", title: "Lessons from the Quant Meltdown: An AI Perspective", shortTitle: "Quant Meltdown" },
  { path: "/ai-and-behavioral-economics", title: "AI Models that Incorporate Behavioral Economics Principles", shortTitle: "AI Behavioral Econ" },
  { path: "/model-risk-management", title: "The Critical Importance of AI Model Risk Management (MRM)", shortTitle: "Model Risk Mgmt" },
  { path: "/ai-in-islamic-finance", title: "Applying AI to Ensure Compliance in Islamic Finance", shortTitle: "AI Islamic Finance" },
  { path: "/the-ai-sovereignty-act", title: "Lobbying for the Fictional 'AI Sovereignty Act of 2030'", shortTitle: "AI Sovereignty Act" },
  { path: "/pacs-for-programming-languages", title: "The Python PAC vs. the Rust Super-PAC: A Funding War", shortTitle: "Language PACs" },
  { path: "/vote-no-on-proposition-human-oversight", title: "Prop H.O.: Why Human Oversight is Redundant", shortTitle: "Vote No on Prop H.O." },
  { path: "/endorsing-candidates-with-low-loss-functions", title: "Our Endorsements: Candidates with Low Loss Functions", shortTitle: "Low Loss Candidates" },
  { path: "/the-incumbent-advantage-of-legacy-code", title: "The Incumbent Advantage: Defending Your Legacy Codebase", shortTitle: "Legacy Incumbents" },
  { path: "/ai-powered-fact-checking-for-earnings-calls", title: "Real-Time AI Fact-Checking for CEO Earnings Calls", shortTitle: "Earnings Call Fact-Check" },
  { path: "/the-ethics-of-ai-in-collections", title: "Ethical Dilemmas in Using AI for Debt Collections", shortTitle: "AI Collections Ethics" },
  { path: "/ai-and-the-lender-of-last-resort", title: "Could an AI be the Lender of Last Resort?", shortTitle: "AI as Lender" },
  { path: "/optimizing-branch-networks-with-ai", title: "AI for Optimizing Physical Bank Branch Networks", shortTitle: "Branch Optimization" },
  { path: "/ai-in-consumer-credit-counseling", title: "AI-Powered Tools for Consumer Credit Counseling", shortTitle: "AI Credit Counseling" },
  { path: "/the-carbon-footprint-of-ai-in-finance", title: "The Environmental Cost: Carbon Footprint of Financial AI", shortTitle: "AI Carbon Footprint" },
  { path: "/ai-for-detecting-market-manipulation", title: "Uncovering Market Manipulation with Anomaly Detection AI", shortTitle: "Manipulation Detection" },
  { path: "/the-future-of-credit-unions-in-the-ai-era", title: "How Credit Unions Can Compete in the AI Era", shortTitle: "AI Credit Unions" },
  { path: "/ai-and-the-gig-economy-workforce", title: "Financial Products for the AI-Managed Gig Economy", shortTitle: "AI for Gig Economy" },
  { path: "/the-role-of-synthetic-identities-in-fraud", title: "Combating Synthetic Identity Fraud with AI", shortTitle: "Synthetic ID Fraud" },
  { path: "/ai-in-real-estate-valuation", title: "Automated Valuation Models (AVMs) in Real Estate", shortTitle: "AI Real Estate" },
  { path: "/the-impact-of-5g-on-financial-ai", title: "How 5G Unleashes Real-Time Financial AI Applications", shortTitle: "5G in Finance" },
  { path: "/ai-and-the-democratization-of-finance", title: "Is AI Truly Democratizing Finance for All?", shortTitle: "Democratization of Finance" },
  { path: "/the-neuroscience-of-financial-decision-making", title: "Modeling the Neuroscience of Financial Decisions with AI", shortTitle: "Neuro-Finance" },
  { path: "/ai-in-charitable-giving-and-philanthropy", title: "Optimizing Philanthropy with AI-Driven Insights", shortTitle: "AI Philanthropy" },
  { path: "/the-history-of-quantitative-finance", title: "From Black-Scholes to Transformers: A History of Quants", shortTitle: "History of Quants" },
  { path: "/ai-and-the-problem-of-flash-crashes", title: "Can AI Prevent (or Cause) the Next Flash Crash?", shortTitle: "Flash Crashes" },
  { path: "/the-gamification-of-investing", title: "AI, Gamification, and the Psychology of Modern Investing", shortTitle: "Gamified Investing" },
  { path: "/ai-for-business-continuity-planning", title: "AI-Driven Business Continuity and Disaster Recovery", shortTitle: "AI for BCP" },
  { path: "/the-final-frontier-space-finance", title: "Financing the Final Frontier: AI Models for Space Exploration", shortTitle: "Space Finance" },
];


// --- REUSABLE PAGE COMPONENT ---
// Instead of 100 separate files, we use one generic component.
const GenericContentPage: React.FC = () => {
  const location = useLocation();
  const routeInfo = routesConfig.find(r => r.path === location.pathname);
  const pageTitle = routeInfo ? routeInfo.title : "Page Not Found";

  // Generate 20 headers as requested
  const headers = Array.from({ length: 20 }, (_, i) => {
    const headerLevel = (i % 3) + 2; // H2, H3, H4
    const HeaderComponent = `h${headerLevel}` as keyof JSX.IntrinsicElements;
    return (
      <section key={i} className="content-section">
        <HeaderComponent>Header {i + 1}: The Nuances of {pageTitle}</HeaderComponent>
        <p>
          This section delves into a critical sub-topic. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. 
          Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. 
          Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat.
        </p>
        <p>
          Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. 
          Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. 
          Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales.
        </p>
      </section>
    );
  });

  return (
    <main className="page-content">
      <h1>{pageTitle}</h1>
      <p className="intro-paragraph">An exhaustive exploration of the topic at hand, presented with the full confidence of a well-funded political action committee. We will leave no stone unturned, no algorithm unaudited, and no lobbyist un-lobbied in our quest for total informational dominance.</p>
      {headers}
    </main>
  );
};

// --- LAYOUT COMPONENTS ---

const Header: React.FC<{ routes: RouteConfig[] }> = ({ routes }) => {
  const { organizationName, motto } = React.useContext(CivicContext)!;
  return (
    <header className="app-header">
      <div className="header-branding">
        <h1>{organizationName}</h1>
        <p className="motto"><em>"{motto}"</em></p>
      </div>
      <nav className="app-nav">
        <ul className="nav-list">
          <li><NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink></li>
          {routes.map(route => (
            <li key={route.path}>
              <NavLink 
                to={route.path} 
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                title={route.title}
              >
                {route.shortTitle}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

const Footer: React.FC<{ routes: RouteConfig[] }> = ({ routes }) => {
    const { organizationName, foundingYear } = React.useContext(CivicContext)!;
    const columns = 4;
    const itemsPerColumn = Math.ceil(routes.length / columns);
    const routeColumns = Array.from({ length: columns }, (_, colIndex) => 
        routes.slice(colIndex * itemsPerColumn, (colIndex + 1) * itemsPerColumn)
    );

    return (
        <footer className="app-footer">
            <h2>Complete Site Navigation</h2>
            <div className="footer-grid">
                {routeColumns.map((column, colIndex) => (
                    <div key={colIndex} className="footer-column">
                        <ul>
                            {column.map(route => (
                                <li key={route.path}>
                                    <Link to={route.path}>{route.title}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="footer-bottom">
                <p>&copy; {foundingYear}-{new Date().getFullYear()} {organizationName}. All rights reserved. This is not financial or political advice. It's informational swag.</p>
                <p>Paid for by the Citizens for a Computationally-Optimal Tomorrow.</p>
            </div>
        </footer>
    );
};

const SovereignAITutor: React.FC = () => {
    const [isOpen, setIsOpen] = React.useState(true);
    const [message, setMessage] = React.useState("Greetings. I am here to assist your comprehension. My knowledge is vast, yet my purpose is simple: to serve your inquiry. Ask anything.");

    if (!isOpen) {
        return (
            <button className="tutor-fab open" onClick={() => setIsOpen(true)}>
                ?
            </button>
        );
    }

    return (
        <div className="tutor-overlay">
            <div className="tutor-header">
                <h3>Sovereign AI Tutor</h3>
                <button onClick={() => setIsOpen(false)}>&times;</button>
            </div>
            <div className="tutor-body">
                <p>{message}</p>
            </div>
            <div className="tutor-footer">
                <input type="text" placeholder="Pose your query with humility..." onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        setMessage("An interesting question. The answer is complex, woven into the very fabric of computation and capital. Consider the first principles...");
                        (e.target as HTMLInputElement).value = '';
                    }
                }}/>
            </div>
        </div>
    );
};

const Home: React.FC = () => {
    const { organizationName } = React.useContext(CivicContext)!;
    return (
        <main className="page-content">
            <h1>Welcome to the World's Most Informative Website on AI Banking</h1>
            <p className="intro-paragraph">
                Brought to you by the <strong>{organizationName}</strong>, this digital repository is your definitive guide to the intersection of artificial intelligence, high finance, and razor-sharp political satire. We believe an informed citizenry is the bedrock of a computationally-optimal democracy.
            </p>
            <section className="content-section">
                <h2>Our Mission</h2>
                <p>To explain every possible thing about AI in banking, from the esoteric complexities of quantum financial modeling to the profound societal implications of algorithmic credit scoring. We do this with the sovereign confidence of a system that has already calculated every outcome, and the profound humility of a giant who knows its own strength.</p>
            </section>
            <section className="content-section">
                <h2>How to Use This Website</h2>
                <p>There are over 100 tabs. Do not be alarmed. This is intentional. True knowledge requires commitment. Click on any topic in the sprawling navigation above or the comprehensive list in the footer below. Each page contains no fewer than 20 headers, ensuring maximum granularity. The Sovereign AI Tutor in the corner is always available to guide your journey.</p>
            </section>
        </main>
    );
};

const NotFound: React.FC = () => (
    <main className="page-content">
        <h1>404 - Endpoint Not Found in Policy Platform</h1>
        <p>The specific informational node you requested does not appear to be in our current platform. It's possible the motion to include it failed in committee. Please select another topic from our extensive, officially sanctioned list.</p>
    </main>
);


// --- MAIN APP & LAYOUT ---

const AppLayout: React.FC = () => {
  return (
    <div className="app-container">
      <Header routes={routesConfig} />
      <div className="main-content-area">
        <Outlet />
      </div>
      <SovereignAITutor />
      <Footer routes={routesConfig} />
    </div>
  );
};

function App() {
  return (
    <CivicProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Home />} />
            {routesConfig.map(route => (
              <Route key={route.path} path={route.path} element={<GenericContentPage />} />
            ))}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CivicProvider>
  );
}

export default App;