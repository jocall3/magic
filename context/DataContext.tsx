import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Transaction, PortfolioAsset, UserProfile, 
  AppView, View, Notification, InternalAccount,
  AIInsight, BudgetCategory, RewardItem, APIStatus,
  Pipeline, InboundBlob, FundFlow, AuthorizedApp,
  CreditScore, CreditFactor, FinancialGoal, RewardPoints,
  PaymentOrder, Invoice, ComplianceCase, CorporateTransaction,
  EIP6963ProviderDetail, MarqetaCardProduct, SecurityScoreMetric,
  AuditLogEntry, ThreatAlert, DataSharingPolicy, APIKey,
  TrustedContact, SecurityAwarenessModule, TransactionRule
} from '../types';
import { 
  MOCK_TRANSACTIONS, MOCK_ASSETS, MOCK_BUDGETS, 
  MOCK_REWARD_ITEMS, MOCK_API_STATUS, MOCK_NOTIFICATIONS,
  MOCK_CREDIT_SCORE, MOCK_CREDIT_FACTORS, MOCK_FINANCIAL_GOALS,
  MOCK_REWARD_POINTS,
  MOCK_SECURITY_METRICS, MOCK_AUDIT_LOGS, MOCK_THREAT_ALERTS,
  MOCK_DATA_SHARING_POLICIES, MOCK_API_KEYS, MOCK_TRUSTED_CONTACTS,
  MOCK_SECURITY_AWARENESS, MOCK_TRANSACTION_RULES
} from '../data/mockData';

export interface ApiEndpoints {
    citibank: string;
    plaid: string;
    stripe: string;
    modernTreasury: string;
    gemini: string;
    gein: string;
}

// --- GITHUB TYPES (Required for new feature integration) ---
export interface GitHubFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  download_url?: string;
  children?: GitHubFile[];
}
// ----------------------------------------------------------

interface IDataContext {
  // ... [Full Interface Definition Here] ...
  view: AppView; activeView: View; setView: (view: AppView) => void;
  setActiveView: (view: View) => void; userProfile: UserProfile; user: UserProfile; 
  creator: { name: string; title: string }; transactions: Transaction[]; assets: PortfolioAsset[];
  internalAccounts: InternalAccount[]; notifications: Notification[]; aiInsights: AIInsight[];
  insights: AIInsight[]; budgets: BudgetCategory[]; rewardItems: RewardItem[]; apiStatus: APIStatus[];
  pipelines: Pipeline[]; inboundBlobs: InboundBlob[]; fundFlows: FundFlow[]; authorizedApps: AuthorizedApp[];
  geminiApiKey: string | null; setGeminiApiKey: (key: string) => void;
  modernTreasuryApiKey: string | null; setModernTreasuryApiKey: (key: string) => void;
  modernTreasuryOrganizationId: string | null; setModernTreasuryOrganizationId: (id: string) => void;
  setTransactions: (txs: Transaction[]) => void; updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void; setAssets: (assets: PortfolioAsset[]) => void;
  setInternalAccounts: (accounts: InternalAccount[]) => void;
  showNotification: (message: string, severity: Notification['severity']) => void;
  markNotificationRead: (id: string) => void; authorizeApp: (app: Partial<AuthorizedApp>) => void;
  revokeApp: (id: string) => void; redeemReward: (item: RewardItem) => boolean;
  askSovereignAI: (prompt: string, modelName?: string) => Promise<string>;
  simulationData: { time: string; value: number }[]; isImportingData: boolean; treesPlanted: number;
  spendingForNextTree: number; linkedAccounts: any[]; unlinkAccount: (id: string) => void;
  paymentOrders: PaymentOrder[]; invoices: Invoice[]; complianceCases: ComplianceCase[];
  corporateTransactions: CorporateTransaction[]; creditScore: CreditScore; creditFactors: CreditFactor[];
  financialGoals: FinancialGoal[]; addFinancialGoal: (goal: Partial<FinancialGoal>) => void;
  generateGoalPlan: (id: string) => Promise<void>; addContributionToGoal: (id: string, amount: number) => void;
  addRecurringContributionToGoal: (id: string, contrib: any) => void;
  updateRecurringContributionInGoal: (gid: string, cid: string, updates: any) => void;
  deleteRecurringContributionFromGoal: (gid: string, cid: string) => void;
  updateFinancialGoal: (id: string, updates: any) => void; linkGoals: (s: string, t: string, type: any, amt?: number) => void;
  unlinkGoals: (s: string, t: string) => void; isWalletConnectModalOpen: boolean;
  setWalletConnectModalOpen: (open: boolean) => void; detectedProviders: EIP6963ProviderDetail[];
  connectWallet: (provider: EIP6963ProviderDetail) => void; rewardPoints: RewardPoints;
  apiEndpoints: ApiEndpoints; updateEndpoint: (key: keyof ApiEndpoints, value: string) => void;
  sovereignCredits: number; deductCredits: (amount: number) => boolean; isProductionApproved: boolean;
  plaidProducts: string[]; addTransaction: (tx: Transaction) => void;
  isLoading: boolean; error: string | null; broadcastEvent: (type: string, data: any) => void;
  // New/Implemented Props
  githubRepoFiles: GitHubFile[]; fetchRepo: () => Promise<void>; fetchDirectory: (path: string) => Promise<void>; isRepoLoading: boolean;
  addBudget: (name: string, limit: number) => void; stripeApiKey: string | null;
  marqetaCardProducts: MarqetaCardProduct[]; fetchMarqetaProducts: () => Promise<void>;
  isMarqetaLoading: boolean; marqetaApiToken: string | null; marqetaApiSecret: string | null;
  setMarqetaCredentials: (token: string, secret: string) => void; plaidApiKey: string | null;
  dbConfig: any; updateDbConfig: (updates: any) => void; connectDatabase: () => Promise<void>;
  webDriverStatus: any; launchWebDriver: (task: string) => Promise<void>;
  showSystemAlert: (message: string, severity: Notification['severity']) => void;
  handlePlaidSuccess: (publicToken: string, metadata: any) => void;
  securityMetrics: SecurityScoreMetric[]; auditLogs: AuditLogEntry[];
  threatAlerts: ThreatAlert[]; dataSharingPolicies: DataSharingPolicy[];
  apiKeys: APIKey[]; trustedContacts: TrustedContact[];
  securityAwarenessModules: SecurityAwarenessModule[]; transactionRules: TransactionRule[];
}

export const DataContext = createContext<IDataContext | undefined>(undefined);

const STORAGE_KEY = 'AQUARIUS_SOVEREIGN_STATE_V4';
const GITHUB_STORAGE_KEY = 'AQUARIUS_GITHUB_REPO_V2';
const GITHUB_OWNER = 'jocall3';
const GITHUB_REPO = 'jocall3';

// --- MOVED CONSTANTS OUTSIDE PROVIDER FOR HMR STABILITY & CORRECTNESS ---
const MOCK_INBOUND_BLOBS: InboundBlob[] = [
    { id: 'b-1', filePath: 's3://nexus/ingest/citi_q3_raw.csv', status: 'IMPORTED', vendorName: 'Citibank', interfaceType: 'SFTP', createdAt: '2024-10-24T10:00:00Z' }
];
// ------------------------------------------------------------------------

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- STATE INITIALIZATION ---
  const [view, setView] = useState<AppView>(View.Dashboard);
  const [transactions, setTransactionsState] = useState<Transaction[]>(MOCK_TRANSACTIONS as any);
  const [assets, setAssetsState] = useState<PortfolioAsset[]>(MOCK_ASSETS as any);
  const [internalAccounts, setInternalAccountsState] = useState<InternalAccount[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS as any);
  const [simulationData, setSimulationData] = useState<{ time: string; value: number }[]>([]);
  const [isImportingData, setIsImportingData] = useState(false);
  const [financialGoals, setFinancialGoals] = useState<FinancialGoal[]>(MOCK_FINANCIAL_GOALS as any);
  const [isWalletConnectModalOpen, setWalletConnectModalOpen] = useState(false);
  const [detectedProviders, setDetectedProviders] = useState<EIP6963ProviderDetail[]>([]);
  const [linkedAccounts, setLinkedAccounts] = useState<any[]>([
    { id: 'acc_01', name: 'Elite Checking', mask: '4242', balance: 450000, institutionId: 'citi_us' },
    { id: 'acc_02', name: 'Capital Savings', mask: '8812', balance: 1200000, institutionId: 'chase' }
  ]);
  const [authorizedApps, setAuthorizedApps] = useState<AuthorizedApp[]>([
    { id: 'app-1', name: 'OpenSea Nexus', description: 'NFT Liquidity Provision', status: 'active', authorizedAt: '2024-09-12T08:00:00Z' }
  ]);
  
  const [geminiApiKey, setGeminiApiKey] = useState<string | null>(localStorage.getItem('gemini_api_key'));
  const [modernTreasuryApiKey, setModernTreasuryApiKey] = useState<string | null>(localStorage.getItem('mt_api_key'));
  const [modernTreasuryOrganizationId, setModernTreasuryOrganizationId] = useState<string | null>(localStorage.getItem('mt_org_id'));

  const [apiEndpoints, setApiEndpoints] = useState<ApiEndpoints>({
      citibank: 'https://api.sandbox.citi.com/v1',
      plaid: 'https://sandbox.plaid.com',
      stripe: 'https://api.stripe.com/v1',
      modernTreasury: 'https://app.moderntreasury.com/api',
      gemini: 'https://generativelanguage.googleapis.com',
      gein: 'https://ce47fe80-dabc-4ad0-b0e7-cf285695b8b8.mock.pstmn.io'
  });

  const [sovereignCredits, setSovereignCredits] = useState(150000);

  // --- Added/Implemented State ---
  const [budgets, setBudgets] = useState<BudgetCategory[]>(MOCK_BUDGETS as any);
  const [marqetaCardProducts, setMarqetaCardProducts] = useState<MarqetaCardProduct[]>([]);
  const [isMarqetaLoading, setIsMarqetaLoading] = useState(false);
  const [marqetaApiToken, setMarqetaApiToken] = useState<string | null>(localStorage.getItem('marqeta_token'));
  const [marqetaApiSecret, setMarqetaApiSecret] = useState<string | null>(localStorage.getItem('marqeta_secret'));
  
  const [dbConfig, setDbConfig] = useState({
      host: 'localhost',
      port: '5432',
      username: 'postgres',
      password: '',
      databaseName: 'sovereign_bank',
      connectionStatus: 'disconnected' as 'connected' | 'disconnected' | 'connecting',
      sslMode: 'require'
  });

  const [webDriverStatus, setWebDriverStatus] = useState({
      status: 'idle' as 'idle' | 'running' | 'error',
      logs: [] as string[]
  });

  // --- GITHUB STATE ---
  const [githubRepoFiles, setGithubRepoFiles] = useState<GitHubFile[]>([]);
  const [isRepoLoading, setIsRepoLoading] = useState(false);
  
  // --- EFFECTS ---
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.transactions) setTransactionsState(parsed.transactions);
        if (parsed.assets) setAssetsState(parsed.assets);
        if (parsed.internalAccounts) setInternalAccountsState(parsed.internalAccounts);
        if (parsed.financialGoals) setFinancialGoals(parsed.financialGoals);
        if (parsed.linkedAccounts) setLinkedAccounts(parsed.linkedAccounts);
      } catch (e) {
        console.error("State hydration failed", e);
      }
    }
    
    const savedGithub = localStorage.getItem(GITHUB_STORAGE_KEY);
    if (savedGithub) {
        try {
            setGithubRepoFiles(JSON.parse(savedGithub));
        } catch (e) {
            console.error('Failed to parse cached GitHub repo', e);
        }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      transactions, assets, internalAccounts, financialGoals, linkedAccounts
    }));
  }, [transactions, assets, internalAccounts, financialGoals, linkedAccounts]);

  useEffect(() => {
    const interval = setInterval(() => {
      const totalWealth = assets.reduce((sum, a) => sum + a.value, 0) + 2450000;
      setSimulationData(prev => {
        const newData = [...prev, { 
          time: new Date().toLocaleTimeString(), 
          value: totalWealth + (Math.random() - 0.5) * 10000 
        }].slice(-30);
        return newData;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [assets]);

  // --- STABLE CALLBACKS & MEMOIZED FUNCTIONS ---
  const showNotification = useCallback((message: string, severity: Notification['severity']) => {
    setNotifications(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      message,
      timestamp: 'Just Now',
      read: false,
      severity: severity || 'info'
    }, ...prev].slice(0, 20));
  }, []);

  const askSovereignAI = useCallback(async (prompt: string, modelName = 'gemini-3-flash-preview') => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: { systemInstruction: "You are the Aquarius AI Core. Provide strategic, high-frequency financial intelligence to James." }
        });
        return response.text || "Handshake interrupted.";
    } catch (e) {
        console.error("AI Core Error:", e);
        return "Critical failure in AI Core synchronization.";
    }
  }, []);

  const broadcastEvent = useCallback((type: string, data: any) => {
      console.log(`[EVENT_BROADCAST] ${type}:`, data);
      showNotification(`System Event: ${type.replace(/_/g, ' ')}`, 'info');
  }, [showNotification]);

  const updateFileTree = useCallback((
    tree: GitHubFile[], 
    path: string, 
    children: GitHubFile[]
  ): GitHubFile[] => {
    return tree.map(item => {
      if (item.path === path) {
        return { ...item, children };
      }
      if (item.children) {
        return { ...item, children: updateFileTree(item.children, path, children) };
      }
      return item;
    });
  }, []);


  const fetchDirectoryContents = useCallback(async (path: string): Promise<GitHubFile[]> => {
    setIsRepoLoading(true);
    try {
      const res = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`);
      if (!res.ok) throw new Error(`GitHub API error: ${res.statusText} for path ${path}`);
      
      let data: GitHubFile[] = await res.json();
      
      data = data.map(item => ({
          ...item,
          path: item.path || `${path}/${item.name}`.replace(/\/\//g, '/')
      }));

      return data;
    } catch (e) {
      console.error(`Failed to fetch directory contents for ${path}:`, e);
      showNotification(`Repo Error: Could not load ${path}`, 'error');
      return [];
    } finally {
        setIsRepoLoading(false);
    }
  }, [showNotification]);

  const fetchDirectory = useCallback(async (path: string) => {
    if (path === '') return; 

    const contents = await fetchDirectoryContents(path);
    
    const directoriesToLoad = contents.filter(item => item.type === 'dir');

    const newChildrenPromises = directoriesToLoad.map(async dirItem => {
        const subContents = await fetchDirectoryContents(dirItem.path);
        const hydratedChildren: GitHubFile[] = await Promise.all(subContents.map(async subItem => {
            if (subItem.type === 'dir') {
                const subSubContents = await fetchDirectoryContents(subItem.path);
                return { ...subItem, children: subSubContents };
            }
            return subItem;
        }));
        return { ...dirItem, children: hydratedChildren };
    });
    
    const loadedChildren = await Promise.all(newChildrenPromises);
    
    const finalChildren = [
        ...contents.filter(item => item.type !== 'dir'),
        ...loadedChildren
    ];
    
    setGithubRepoFiles(prev => updateFileTree(prev, path, finalChildren));
    
  }, [fetchDirectoryContents, updateFileTree]);


  const fetchRepo = useCallback(async () => {
    setIsRepoLoading(true);
    const rootFiles = await fetchDirectoryContents(''); 
    
    const initialHydrationPromises = rootFiles
        .filter(item => item.type === 'dir')
        .map(dir => fetchDirectoryContents(dir.path).then(children => ({ ...dir, children } as GitHubFile)));

    const hydratedRoot = await Promise.all(initialHydrationPromises);

    setGithubRepoFiles([
        ...rootFiles.filter(item => item.type === 'file'), 
        ...hydratedRoot
    ]);
    
    setIsRepoLoading(false);
    showNotification('GitHub repository structure loaded.', 'success');
    
    localStorage.setItem(GITHUB_STORAGE_KEY, JSON.stringify([
        ...rootFiles.filter(item => item.type === 'file'), 
        ...hydratedRoot
    ]));
  }, [fetchDirectoryContents, showNotification]);


  // --- STUB IMPLEMENTATIONS (Now defined as stable callbacks) ---
  
  const addBudget = (name: string, limit: number) => {
      const newBudget: BudgetCategory = {
          id: `b-${Date.now()}`,
          name, limit, spent: 0, color: '#06b6d4', remaining: limit, category: name, alerts: []
      };
      setBudgets(prev => [...prev, newBudget]);
  };

  const fetchMarqetaProducts = async () => {
      setIsMarqetaLoading(true);
      await new Promise(r => setTimeout(r, 1000));
      setMarqetaCardProducts([{ token: 'cp-1', name: 'Sovereign Black', active: true, start_date: '2024-01-01', config: { fulfillment: { bin_prefix: '424242' }, poi: { other: {} } } } as any]);
      setIsMarqetaLoading(false);
  };

  const setMarqetaCredentials = useCallback((token: string, secret: string) => {
      setMarqetaApiToken(token);
      setMarqetaApiSecret(secret);
      localStorage.setItem('marqeta_token', token);
      localStorage.setItem('marqeta_secret', secret);
  }, []);

  const updateDbConfig = useCallback((updates: any) => setDbConfig(prev => ({ ...prev, ...updates })), []);
  
  const connectDatabase = useCallback(async () => {
      updateDbConfig({ connectionStatus: 'connecting' });
      await new Promise(r => setTimeout(r, 1500));
      updateDbConfig({ connectionStatus: 'connected' });
      showNotification("Database nexus synchronized.", "success");
  }, [updateDbConfig, showNotification]);

  const launchWebDriver = useCallback(async (task: string) => {
      setWebDriverStatus(prev => ({ ...prev, status: 'running', logs: [...prev.logs, `Starting task: ${task}`] }));
      await new Promise(r => setTimeout(r, 2000));
      setWebDriverStatus(prev => ({ ...prev, status: 'idle', logs: [...prev.logs, `Task completed: ${task}`] }));
  }, []);
  
  const showSystemAlert = useCallback((message: string, severity: Notification['severity']) => {
      showNotification(message, severity);
  }, [showNotification]);

  const handlePlaidSuccess = useCallback((publicToken: string, metadata: any) => {
      showNotification(`Account linked: ${metadata.institution.name}`, "success");
  }, [showNotification]);
  
  const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setTransactionsState(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);
  
  const deleteTransaction = useCallback((id: string) => {
    setTransactionsState(prev => prev.filter(t => t.id !== id));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);
  
  const authorizeApp = useCallback((app: Partial<AuthorizedApp>) => {
    setAuthorizedApps(prev => [...prev, {
      id: app.id || `app-${Date.now()}`,
      name: app.name || 'Unknown',
      description: app.description || '',
      status: 'active',
      authorizedAt: new Date().toISOString(),
      scopes: app.scopes
    }]);
  }, []);
  
  const revokeApp = useCallback((id: string) => {
    setAuthorizedApps(prev => prev.map(a => a.id === id ? { ...a, status: 'revoked' } : a));
  }, []);

  const redeemReward = useCallback((item: RewardItem) => {
    showNotification(`Redeemed ${item.name}`, 'success');
    return true;
  }, [showNotification]);

  const unlinkAccount = useCallback((id: string) => {
      setLinkedAccounts(prev => prev.filter(a => a.id !== id));
      showNotification("Institutional link severed.", "warning");
  }, [showNotification]);

  const addFinancialGoal = useCallback((goal: Partial<FinancialGoal>) => {
    setFinancialGoals(prev => [...prev, {
        id: `goal-${Date.now()}`,
        name: goal.name || 'New Goal',
        targetAmount: goal.targetAmount || 0,
        currentAmount: 0,
        targetDate: goal.targetDate || new Date().toISOString(),
        iconName: goal.iconName || 'default',
        plan: null,
        startDate: new Date().toISOString(),
        contributions: [],
        status: 'on_track'
    }]);
  }, []);
  
  const generateGoalPlan = useCallback(async (id: string) => {
      showNotification("Neural strategist is mapping your trajectory...", "info");
      await new Promise(r => setTimeout(r, 2000));
      showNotification("Strategic roadmap synthesized.", "success");
  }, [showNotification]);

  const addContributionToGoal = useCallback((id: string, amount: number) => {
    setFinancialGoals(prev => prev.map(g => g.id === id ? { ...g, currentAmount: g.currentAmount + amount } : g));
  }, []);

  const updateFinancialGoal = useCallback((id: string, updates: any) => {
      setFinancialGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  }, []);
  
  const addRecurringContributionToGoal = useCallback((id: string, contrib: any) => {}, []);
  const updateRecurringContributionInGoal = useCallback((gid: string, cid: string, updates: any) => {}, []);
  const deleteRecurringContributionFromGoal = useCallback((gid: string, cid: string) => {}, []);
  const linkGoals = useCallback((s: string, t: string, type: any, amt?: number) => {}, []);
  const unlinkGoals = useCallback((s: string, t: string) => {}, []);
  const connectWallet = useCallback((provider: EIP6963ProviderDetail) => {
      showNotification(`Synchronized with ${provider.info.name}`, "success");
  }, [showNotification]);
  const updateEndpoint = useCallback((key: keyof ApiEndpoints, value: string) => setApiEndpoints(prev => ({ ...prev, [key]: value })), []);
  const deductCredits = useCallback((amount: number) => {
      if (sovereignCredits >= amount) {
          setSovereignCredits(prev => prev - amount);
          return true;
      }
      return false;
  }, [sovereignCredits]);
  const addTransaction = useCallback((tx: Transaction) => setTransactionsState(prev => [tx, ...prev]), []);

  // --- CONTEXT VALUE DEFINITION (Stabilized via useMemo) ---
  const value: IDataContext = useMemo(() => ({
    view, activeView: view as View, setView, setActiveView: setView as (view: View) => void,
    
    userProfile: { /* Mock Data */
        id: 'USR-77-X-ALPHA', name: 'James Burvel oCallaghan III', title: 'Sovereign Architect', email: 'james@sovereign.io', phone: '+1 (555) 942-0123', loyaltyTier: 'OMEGA', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James', usdBalance: 2450000000, fiatBalance: 2450000000, cryptoBalance: 14200.55
    },
    user: { /* Mock Data */
        id: 'USR-77-X-ALPHA', name: 'James Burvel oCallaghan III', title: 'Sovereign Architect', email: 'james@sovereign.io', phone: '+1 (555) 942-0123', loyaltyTier: 'OMEGA', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James', usdBalance: 2450000000, fiatBalance: 2450000000, cryptoBalance: 14200.55
    },
    creator: { name: 'James Burvel oCallaghan III', title: 'Grand Architect of Aquarius AI' },
    
    transactions, assets, internalAccounts, notifications, aiInsights: [], insights: [],
    budgets, rewardItems: MOCK_REWARD_ITEMS as any, apiStatus: MOCK_API_STATUS as any,
    pipelines: [
      { id: 'p-1', name: 'GL Ledger Sync', pipelineName: 'NEXUS_TX_FEED', status: 'SUCCESS', prettyDuration: '1.2s' },
      { id: 'p-2', name: 'Risk Vector Audit', pipelineName: 'HEURISTIC_RISK', status: 'RUNNING', prettyDuration: '240ms' }
    ],
    // *** FIX: Using stable constant MOCK_INBOUND_BLOBS defined outside ***
    inboundBlobs: MOCK_INBOUND_BLOBS, 
    fundFlows: [
      { id: 'f-1', name: 'Reserve Accumulation', ledgerId: 'L-771', postedTxCount: 1242, pendingTxCount: 12 }
    ],
    authorizedApps,
    simulationData,
    
    geminiApiKey,
    setGeminiApiKey: (key) => {
        setGeminiApiKey(key);
        localStorage.setItem('gemini_api_key', key);
    },
    modernTreasuryApiKey,
    setModernTreasuryApiKey: (key) => {
        setModernTreasuryApiKey(key);
        localStorage.setItem('mt_api_key', key);
    },
    modernTreasuryOrganizationId,
    setModernTreasuryOrganizationId: (id) => {
        setModernTreasuryOrganizationId(id);
        localStorage.setItem('mt_org_id', id);
    },
    
    setTransactions: setTransactionsState,
    updateTransaction,
    deleteTransaction,
    addTransaction,
    
    setAssets: setAssetsState,
    setInternalAccounts: setInternalAccountsState,
    
    showNotification,
    markNotificationRead,
    authorizeApp,
    revokeApp,
    
    redeemReward,
    rewardPoints: MOCK_REWARD_POINTS,

    askSovereignAI,
    
    isImportingData,
    treesPlanted: 142,
    spendingForNextTree: 120,
    
    linkedAccounts,
    unlinkAccount,
    
    paymentOrders: [], invoices: [], complianceCases: [], corporateTransactions: [],
    
    creditScore: MOCK_CREDIT_SCORE,
    creditFactors: MOCK_CREDIT_FACTORS,
    
    financialGoals,
    addFinancialGoal,
    generateGoalPlan,
    addContributionToGoal,
    addRecurringContributionToGoal,
    updateRecurringContributionInGoal,
    deleteRecurringContributionFromGoal,
    updateFinancialGoal,
    linkGoals,
    unlinkGoals,
    
    isWalletConnectModalOpen,
    setWalletConnectModalOpen,
    detectedProviders,
    connectWallet,
    
    apiEndpoints,
    updateEndpoint,
    
    sovereignCredits,
    deductCredits,
    
    isProductionApproved: true,
    plaidProducts: ['auth', 'transactions', 'identity', 'balance'],
    isLoading: false,
    error: null,
    broadcastEvent,
    
    // --- Implemented Stub Methods ---
    addBudget,
    stripeApiKey: process.env.STRIPE_SECRET_KEY || null,
    marqetaCardProducts,
    fetchMarqetaProducts,
    isMarqetaLoading,
    marqetaApiToken,
    marqetaApiSecret,
    setMarqetaCredentials,
    plaidApiKey: process.env.PLAID_SECRET || null,
    dbConfig,
    updateDbConfig,
    connectDatabase,
    webDriverStatus,
    launchWebDriver,
    showSystemAlert,
    handlePlaidSuccess,
    securityMetrics: MOCK_SECURITY_METRICS,
    auditLogs: MOCK_AUDIT_LOGS,
    threatAlerts: MOCK_THREAT_ALERTS,
    dataSharingPolicies: MOCK_DATA_SHARING_POLICIES,
    apiKeys: MOCK_API_KEYS,
    trustedContacts: MOCK_TRUSTED_CONTACTS,
    securityAwarenessModules: MOCK_SECURITY_AWARENESS,
    transactionRules: MOCK_TRANSACTION_RULES,

    // --- GITHUB INTEGRATION ---
    githubRepoFiles,
    fetchRepo,
    fetchDirectory,
    isRepoLoading,

  }), [
    view, transactions, assets, internalAccounts, notifications, simulationData, isImportingData, financialGoals, isWalletConnectModalOpen, detectedProviders, linkedAccounts, authorizedApps, 
    geminiApiKey, modernTreasuryApiKey, modernTreasuryOrganizationId, budgets, sovereignCredits, 
    marqetaCardProducts, isMarqetaLoading, marqetaApiToken, marqetaApiSecret, 
    dbConfig, webDriverStatus, githubRepoFiles, isRepoLoading, 
    // Dependencies for callbacks that rely on state
    setNotifications, setSovereignCredits, setGithubRepoFiles, 
    // Dependencies for functional calls
    showNotification, askSovereignAI, broadcastEvent, fetchDirectoryContents, updateFileTree
  ]);


  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
