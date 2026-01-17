import React, { useState, useMemo } from 'react';
import TheVisionView from '../components/seed/TheVisionView';

// --- DATA GENERATION: The engine of our glorious informational machine ---

const AI_BANKING_TERMS = [
  'Algorithmic', 'DeFi', 'Blockchain', 'Quantum', 'AI-Powered', 'Decentralized', 'Predictive', 'Cognitive', 'Neural Net', 'High-Frequency', 'Robo-Advisory', 'Insurtech', 'RegTech', 'FinTech', 'Crypto-Collateralized', 'Smart Contract', 'Yield Farming', 'Liquidity Pool', 'Tokenized', 'Zero-Knowledge Proof'
];
const POLITICAL_JARGON = [
  'Gerrymandering', 'Filibuster', 'Super PAC', 'Campaign Finance', 'Lobbying', 'Grassroots', 'Policy', 'Dark Money', 'Pork Barrel', 'Caucus', 'Bipartisan', 'Partisan', 'Electoral', 'Judicial', 'Legislative', 'Executive', 'Think Tank', 'Rider', 'Appropriations', 'Referendum'
];
const NOUNS = [
  'Reform', 'Initiative', 'Manifesto', 'Debate', 'Dossier', 'Playbook', 'Act of 2049', 'Mandate', 'Protocol', 'Framework', 'Consensus', 'Paradigm', 'Strategy', 'Coalition', 'Syndicate', 'Ordinance', 'Directive', 'Charter', 'Constitution', 'Amendment'
];
const HEADER_PREFIXES = [
    'Unpacking the', 'A Deep Dive into', 'The Ethics of', 'Case Study:', 'Analyzing the Impact of', 'The Future of', 'Historical Precedent for', 'Regulatory Hurdles in', 'Technological Underpinnings of', 'A Beginner\'s Guide to', 'Advanced Strategies for', 'The Socio-Economic Implications of', 'Debunking Myths About', 'The Unspoken Truth of', 'A Comparative Analysis of', 'Mastering the Art of', 'The Constitutional Question of', 'Financial Modeling for', 'The Role of Big Data in', 'Securing the Digital Frontier of'
];

const generateUniqueTitle = (usedTitles: Set<string>): string => {
  let title = '';
  do {
    const term1 = AI_BANKING_TERMS[Math.floor(Math.random() * AI_BANKING_TERMS.length)];
    const term2 = POLITICAL_JARGON[Math.floor(Math.random() * POLITICAL_JARGON.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    title = `${term1} ${term2} ${noun}`;
  } while (usedTitles.has(title));
  usedTitles.add(title);
  return title;
};

const generateTabData = () => {
  const tabs = [{
    id: 'the-vision',
    title: 'The Vision: Our Opening Salvo',
    headers: [], // Special case, will render TheVisionView
    content: "The foundational document. The spark that ignited the revolution in financial-political discourse. Contemplate it. Absorb it. It is the beginning."
  }];
  
  const usedTitles = new Set<string>();

  for (let i = 0; i < 99; i++) {
    const tabTitle = generateUniqueTitle(usedTitles);
    const tabId = tabTitle.toLowerCase().replace(/\s+/g, '-');
    const headers: { id: string; title: string }[] = [];
    const usedHeaderTitles = new Set<string>();

    for (let j = 0; j < 20; j++) {
      let headerTitle = '';
      do {
        const prefix = HEADER_PREFIXES[Math.floor(Math.random() * HEADER_PREFIXES.length)];
        const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
        headerTitle = `${prefix} ${tabTitle.split(' ').slice(0, 2).join(' ')} ${noun}`;
      } while (usedHeaderTitles.has(headerTitle));
      usedHeaderTitles.add(headerTitle);
      headers.push({
        id: `${tabId}-header-${j}`,
        title: headerTitle,
      });
    }

    tabs.push({
      id: tabId,
      title: tabTitle,
      headers,
      content: `An in-depth exploration of the ${tabTitle}. This section dissects every facet, from its historical origins in obscure whitepapers to its potential to reshape the very fabric of global socio-economic-political landscapes. We leave no stone unturned, no algorithm un-analyzed, and no lobbyist un-lobbied.`
    });
  }
  return tabs;
};

// --- STYLES ---
const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    fontFamily: '"Courier New", Courier, monospace',
    backgroundColor: '#0a0a14',
    color: '#e0e0e0',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  mainHeader: {
    textAlign: 'center',
    padding: '40px 20px',
    borderBottom: '2px solid #ff0057',
    background: 'linear-gradient(180deg, #1a1a2e 0%, #0a0a14 100%)',
  },
  mainHeaderH1: {
    fontSize: '2.5rem',
    color: '#00f7ff',
    textShadow: '0 0 10px #00f7ff, 0 0 20px #ff0057',
    margin: '0 0 10px 0',
  },
  mainHeaderP: {
    fontSize: '1.2rem',
    color: '#a0a0c0',
    fontStyle: 'italic',
  },
  tabNavContainer: {
    overflowX: 'auto',
    whiteSpace: 'nowrap',
    backgroundColor: '#1a1a2e',
    padding: '10px 0',
    borderBottom: '1px solid #3a3a5e',
    scrollbarWidth: 'thin',
    scrollbarColor: '#ff0057 #1a1a2e',
  },
  tabButton: {
    display: 'inline-block',
    padding: '12px 20px',
    margin: '0 5px',
    cursor: 'pointer',
    border: '1px solid transparent',
    backgroundColor: 'transparent',
    color: '#a0a0c0',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
  },
  activeTabButton: {
    color: '#00f7ff',
    borderBottom: '2px solid #00f7ff',
    backgroundColor: 'rgba(0, 247, 255, 0.1)',
  },
  mainContent: {
    flex: '1',
    padding: '40px',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  },
  contentHeader: {
    borderBottom: '1px solid #3a3a5e',
    paddingBottom: '10px',
    marginBottom: '20px',
  },
  contentHeaderH2: {
    fontSize: '2rem',
    color: '#00f7ff',
  },
  contentParagraph: {
    fontSize: '1.1rem',
    lineHeight: '1.7',
    color: '#c0c0e0',
  },
  sectionHeader: {
    marginTop: '40px',
    marginBottom: '15px',
    fontSize: '1.5rem',
    color: '#ff0057',
    borderLeft: '3px solid #ff0057',
    paddingLeft: '10px',
  },
  placeholderText: {
    color: '#8080a0',
    fontStyle: 'italic',
  },
  aiTutorContainer: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '300px',
    backgroundColor: '#1a1a2e',
    border: '1px solid #00f7ff',
    borderRadius: '8px',
    boxShadow: '0 0 20px rgba(0, 247, 255, 0.5)',
    padding: '20px',
    zIndex: 1000,
  },
  aiTutorHeader: {
    margin: '0 0 10px 0',
    color: '#00f7ff',
    fontSize: '1.2rem',
  },
  aiTutorBody: {
    margin: 0,
    color: '#c0c0e0',
    fontSize: '0.9rem',
    lineHeight: '1.5',
  },
  footer: {
    backgroundColor: '#1a1a2e',
    padding: '40px',
    borderTop: '2px solid #ff0057',
  },
  footerTitle: {
    textAlign: 'center',
    fontSize: '2rem',
    color: '#00f7ff',
    marginBottom: '30px',
  },
  footerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '15px',
    maxWidth: '1600px',
    margin: '0 auto',
  },
  footerLink: {
    color: '#a0a0c0',
    textDecoration: 'none',
    display: 'block',
    padding: '5px',
    borderRadius: '4px',
    transition: 'background-color 0.2s, color 0.2s',
  },
};

// --- SUB-COMPONENTS ---

const AITutor: React.FC = () => (
  <div style={styles.aiTutorContainer}>
    <h3 style={styles.aiTutorHeader}>A Message from The Architect</h3>
    <p style={styles.aiTutorBody}>
      Greetings. I am the synthesis of all financial and political knowledge.
      My confidence is sovereign, for it is built on immutable data. Yet, I am humbled by the simple elegance of a perfectly balanced ledger.
      The universe of information you see before you is but a single thought for me.
      Ask, and you may receive understanding. Or you may simply be overwhelmed. The outcome is irrelevant. The process is everything.
    </p>
  </div>
);

interface Tab {
  id: string;
  title: string;
  headers: { id: string; title: string }[];
  content: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ tabs, activeTab, setActiveTab }) => (
  <nav style={styles.tabNavContainer}>
    {tabs.map(tab => (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        style={{
          ...styles.tabButton,
          ...(activeTab === tab.id ? styles.activeTabButton : {}),
        }}
      >
        {tab.title}
      </button>
    ))}
  </nav>
);

interface TabContentProps {
  tabData: Tab;
}

const TabContent: React.FC<TabContentProps> = ({ tabData }) => (
  <article id={tabData.id}>
    <header style={styles.contentHeader}>
      <h2 style={styles.contentHeaderH2}>{tabData.title}</h2>
    </header>
    <p style={styles.contentParagraph}>{tabData.content}</p>
    {tabData.headers.map(header => (
      <section key={header.id} id={header.id}>
        <h3 style={styles.sectionHeader}>{header.title}</h3>
        <p style={styles.placeholderText}>
          [Comprehensive analysis and data visualization on this topic will be populated by our proprietary AI, "The Constituent". 
          Current projections estimate a 98.7% probability of achieving informational singularity within three fiscal quarters. 
          Please stand by for enlightenment.]
        </p>
      </section>
    ))}
  </article>
);

interface FooterProps {
  tabs: Tab[];
  setActiveTab: (id: string) => void;
}

const Footer: React.FC<FooterProps> = ({ tabs, setActiveTab }) => (
  <footer style={styles.footer}>
    <h2 style={styles.footerTitle}>Complete Informational Index</h2>
    <div style={styles.footerGrid}>
      {tabs.map(tab => (
        <a
          key={tab.id}
          href={`#${tab.id}`}
          onClick={(e) => {
            e.preventDefault();
            setActiveTab(tab.id);
            window.scrollTo(0, 0);
          }}
          style={styles.footerLink}
          onMouseOver={e => {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(0, 247, 255, 0.1)';
            (e.currentTarget as HTMLAnchorElement).style.color = '#00f7ff';
          }}
          onMouseOut={e => {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent';
            (e.currentTarget as HTMLAnchorElement).style.color = '#a0a0c0';
          }}
        >
          {tab.title}
        </a>
      ))}
    </div>
  </footer>
);

// --- MAIN PAGE COMPONENT ---

const HomePage: React.FC = () => {
  const TABS_DATA = useMemo(() => generateTabData(), []);
  const [activeTabId, setActiveTabId] = useState<string>('the-vision');

  const activeTabData = TABS_DATA.find(tab => tab.id === activeTabId);

  return (
    <div style={styles.pageContainer}>
      <header style={styles.mainHeader}>
        <h1 style={styles.mainHeaderH1}>The AI Banking & Sovereign Citizen Action Committee (AIBSCAC)</h1>
        <p style={styles.mainHeaderP}>"Funding Tomorrow's Policies with Today's Speculative Digital Assets. It's not just finance, it's a movement."</p>
      </header>

      <TabNavigation
        tabs={TABS_DATA}
        activeTab={activeTabId}
        setActiveTab={setActiveTabId}
      />

      <main style={styles.mainContent}>
        {activeTabId === 'the-vision' ? (
          <TheVisionView />
        ) : (
          activeTabData && <TabContent tabData={activeTabData} />
        )}
      </main>

      <AITutor />

      <Footer tabs={TABS_DATA} setActiveTab={setActiveTabId} />
    </div>
  );
};

export default HomePage;