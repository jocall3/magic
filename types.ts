
import React, { ReactNode } from 'react';

export type UserProfile = User;

export interface ACHDetails {
  routingNumber: string;
  realAccountNumber: string;
}

export type PaymentRail = 'quantumpay' | 'cashapp' | 'swift_global' | 'blockchain_dlt';

export enum View {
    Dashboard = 'dashboard',
    Transactions = 'transactions',
    SendMoney = 'send-money',
    Budgets = 'capital-allocation',
    FinancialGoals = 'strategic-goals',
    CreditHealth = 'credit-health',
    Personalization = 'personalization',
    Accounts = 'accounts-overview',
    Investments = 'investments',
    Crypto = 'crypto-web3',
    CryptoWeb3 = 'crypto-web3',
    AlgoTradingLab = 'algo-trading-lab',
    ForexArena = 'forex-arena',
    CommoditiesExchange = 'commodities-exchange',
    RealEstateEmpire = 'real-estate-empire',
    ArtCollectibles = 'art-collectibles',
    DerivativesDesk = 'derivatives-desk',
    VentureCapital = 'venture-capital',
    PrivateEquity = 'private-equity',
    TaxOptimization = 'tax-optimization',
    LegacyBuilder = 'legacy-builder',
    SovereignWealth = 'sovereign-wealth',
    QuantumAssets = 'quantum-assets',
    // Citi Connect Core
    CitibankAccounts = 'citibank-accounts',
    CitibankAccountProxy = 'citibank-account-proxy',
    CitibankBillPay = 'citibank-bill-pay',
    CitibankCrossBorder = 'citibank-cross-border',
    CitibankPayeeManagement = 'citibank-payee-mgmt',
    CitibankStandingInstructions = 'citibank-standing-instructions',
    CitibankDeveloperTools = 'citibank-dev-tools',
    CitibankEligibility = 'citibank-eligibility',
    CitibankUnmaskedData = 'citibank-unmasked-data',
    // Plaid Nexus
    PlaidMainDashboard = 'plaid-main',
    DataNetwork = 'plaid-data-network',
    PlaidIdentity = 'plaid-identity',
    PlaidCRAMonitoring = 'plaid-cra-monitoring',
    PlaidInstitutions = 'plaid-institutions',
    PlaidItemManagement = 'plaid-item-mgmt',
    // Enterprise Operations
    CorporateCommand = 'corporate-command',
    ModernTreasury = 'modern-treasury',
    Treasury = 'treasury',
    CardPrograms = 'card-programs',
    Payments = 'payments',
    StripeNexus = 'stripe-nexus',
    CounterpartyDashboard = 'counterparty-dashboard',
    VirtualAccounts = 'virtual-accounts',
    CorporateActions = 'corporate-actions',
    CreditNoteLedger = 'credit-note-ledger',
    ReconciliationHub = 'reconciliation-hub',
    GEINDashboard = 'gein-dashboard',
    CardholderManagement = 'cardholder-mgmt',
    VentureCapitalDeskView = 'vc-desk-view',
    // System & Intelligence
    AIAdvisor = 'ai-advisor',
    AIInsights = 'ai-insights',
    QuantumWeaver = 'quantum-weaver',
    AgentMarketplace = 'agent-marketplace',
    AIAdStudio = 'ai-ad-studio',
    GlobalPositionMap = 'global-position-map',
    GlobalSsiHub = 'global-ssi-hub',
    SecurityCompliance = 'security-compliance',
    DeveloperHub = 'developer-hub',
    SchemaExplorer = 'schema-explorer',
    ResourceGraph = 'resource-graph',
    TheVision = 'the-vision',
    ApiPlayground = 'api-playground',
    ComplianceOracle = 'compliance-oracle',
    // Admin & Tools
    CustomerDashboard = 'customer-dashboard',
    VerificationReports = 'verification-reports',
    FinancialReporting = 'financial-reporting',
    StripeNexusDashboard = 'stripe-nexus-dashboard',
    // Component Registry
    AccountDetails = 'account-details',
    AccountList = 'account-list',
    AccountStatementGrid = 'account-statement-grid',
    AccountsView = 'accounts-view',
    AccountVerificationModal = 'account-verification-modal',
    ACHDetailsDisplay = 'ach-details-display',
    AICommandLog = 'ai-command-log',
    AIPredictionWidget = 'ai-prediction-widget',
    AssetCatalog = 'asset-catalog',
    AutomatedSweepRules = 'automated-sweep-rules',
    BalanceReportChart = 'balance-report-chart',
    BalanceTransactionTable = 'balance-transaction-table',
    CardDesignVisualizer = 'card-design-visualizer',
    ChargeDetailModal = 'charge-detail-modal',
    ChargeList = 'charge-list',
    ConductorConfigurationView = 'conductor-config',
    CounterpartyDetails = 'counterparty-details',
    CounterpartyForm = 'counterparty-form',
    DisruptionIndexMeter = 'disruption-index',
    DocumentUploader = 'document-uploader',
    DownloadLink = 'download-link',
    EarlyFraudWarningFeed = 'early-fraud-warning',
    ElectionChoiceForm = 'election-choice-form',
    EventNotificationCard = 'event-notification-card',
    ExpectedPaymentsTable = 'expected-payments',
    ExternalAccountCard = 'external-account-card',
    ExternalAccountForm = 'external-account-form',
    ExternalAccountsTable = 'external-accounts-table',
    FinancialAccountCard = 'financial-account-card',
    IncomingPaymentDetailList = 'incoming-payment-details',
    InvoiceFinancingRequest = 'invoice-financing-req',
    PaymentInitiationForm = 'payment-initiation-form',
    PaymentMethodDetails = 'payment-method-details',
    PaymentMethodBalance = 'payment-method-balance',
    PaymentOrderForm = 'payment-order-form',
    PayoutsDashboard = 'payouts-dashboard',
    PnLChart = 'pnl-chart',
    RefundForm = 'refund-form',
    RemittanceInfoEditor = 'remittance-info-editor',
    ReportingView = 'reporting-view',
    ReportRunGenerator = 'report-run-gen',
    ReportStatusIndicator = 'report-status-indicator',
    SsiEditorForm = 'ssi-editor-form',
    StripeNexusView = 'stripe-nexus-view',
    StripeStatusBadge = 'stripe-status-badge',
    StructuredPurposeInput = 'structured-purpose-input',
    SubscriptionList = 'subscription-list',
    TimeSeriesChart = 'time-series-chart',
    TradeConfirmationModal = 'trade-confirm-modal',
    TransactionFilter = 'transaction-filter',
    TransactionList = 'transaction-list',
    TreasuryTransactionList = 'treasury-txn-list',
    TreasuryView = 'treasury-view',
    UniversalObjectInspector = 'object-inspector',
    VirtualAccountForm = 'virtual-account-form',
    VirtualAccountsTable = 'virtual-accounts-table',
    VoiceControl = 'voice-control',
    WebhookSimulator = 'webhook-simulator',
    TheBook = 'the-book',
    KnowledgeBase = 'knowledge-base',
    Settings = 'settings',
    SSO = 'sso',
    ConciergeService = 'concierge-service',
    Philanthropy = 'philanthropy',
    OpenBanking = 'open-banking',
    FinancialDemocracy = 'financial-democracy',
    APIStatus = 'api-status',
    APIIntegration = 'api-integration',
    APIConsole = 'api-console',
    SecurityCenter = 'security-center',
    Security = 'security',
    AIStrategy = 'ai-strategy',
    Goals = 'financial-goals',
    Rewards = 'rewards',
    CardCustomization = 'card-customization',
}

export type UserRole = 'ADMIN' | 'TRADER' | 'CLIENT' | 'VISIONARY' | 'CARETAKER' | 'QUANT_ANALYST' | 'SYSTEM_ARCHITECT' | 'ETHICS_OFFICER' | 'DATA_SCIENTIST' | 'NETWORK_WEAVER' | 'CITIZEN' | 'Founder' | 'Investor' | 'Manager';
export type SecurityLevel = 'STANDARD' | 'ELEVATED' | 'TRADING_UNLOCKED' | 'QUANTUM_ENCRYPTED' | 'SOVEREIGN_CLEARED' | 'ARCHITECT_LEVEL';

// --- ADDED MISSING TYPES FOR DATA CONTEXT & MOCKS ---

export type AppView = View;

export interface PortfolioAsset {
  id: string;
  name: string;
  value: number;
  color: string;
  performanceYTD?: number;
  assetClass: string;
  riskLevel: string;
}

export interface InternalAccount {
  id: string;
  name: string;
  currency: string;
}

export interface Pipeline {
  id: string;
  name: string;
  pipelineName: string;
  status: string;
  prettyDuration: string;
}

export interface InboundBlob {
  id: string;
  filePath: string;
  status: string;
  vendorName: string;
  interfaceType: string;
  createdAt: string;
}

export interface FundFlow {
  id: string;
  name: string;
  ledgerId: string;
  postedTxCount: number;
  pendingTxCount: number;
}

export interface AuthorizedApp {
  id: string;
  name: string;
  description: string;
  status: string;
  authorizedAt: string;
  scopes?: string[];
}

export interface Portfolio {
  id: string;
  name: string;
  type: string;
  currency: string;
  totalValue: number;
  unrealizedGainLoss: number;
  todayGainLoss: number;
  lastUpdated: string;
  riskTolerance: string;
  holdings: any[];
}

export interface SimulationResult {
  simulationId: string;
  narrativeSummary: string;
  keyImpacts: any[];
}

export interface CorporateAnomaly {
  id: string;
  description: string;
  details: string;
  severity: 'High' | 'Medium' | 'Low';
  status: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  riskScore: number;
  aiConfidenceScore?: number;
  recommendedAction?: string;
}

export interface ComplianceReport {
  auditId: string;
  status: string;
  auditDate: string;
  periodCovered: any;
  overallComplianceScore: number;
  summary: string;
  findings: any[];
  recommendedActions: any[];
}

export interface CashFlowForecast {
  forecastId: string;
  period: string;
  currency: string;
  overallStatus: string;
  projectedBalances: any[];
  inflowForecast: any;
  outflowForecast: any;
  liquidityRiskScore: number;
  aiRecommendations: any[];
}

export interface FraudRule {
  id: string;
  name: string;
}

export interface WebhookSubscription {
  id: string;
}

export interface AccountDetails {
  id: string;
  name: string;
  mask: string;
  currentBalance: number;
  type: string;
  accountHolder: string;
  currency: string;
}

// --- UPDATED EXISTING INTERFACES ---

export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
  roles?: UserRole[];
  securityLevel?: SecurityLevel;
  netWorth?: number;
  display_name?: string;
  handle?: string;
  role?: string;
  businessId?: string;
  profilePictureUrl?: string;
  bio?: string;
  profile?: {
    interests: string[];
    skills: string[];
  };
  wallet?: {
    balance: number;
    currency: string;
  };
  businesses?: string[];
  memberships?: any[];
  followers?: string[];
  following?: string[];
  state?: {
    mood: string;
    activity: string;
    last_active_tick: number;
  };
  isAdmin?: boolean;
  // Added properties used in DataContext and mockData
  title?: string;
  phone?: string;
  loyaltyTier?: string;
  usdBalance?: number;
  fiatBalance?: number;
  cryptoBalance?: number;
  avatarUrl?: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'transfer' | 'credit' | 'debit';
  category: string;
  description: string;
  amount: number;
  date: string;
  currency?: string;
  carbonFootprint?: number;
  aiCategoryConfidence?: number;
  metadata?: any; // Added to support rich mock data
}

export interface Asset {
  id: string; // Added id as it's used in mock data
  name: string;
  value: number;
  color: string;
  performanceYTD?: number;
  esgRating?: number;
  description?: string;
  type?: string; // Added to support mock impact investments
}

export interface BudgetCategory {
  id: string;
  name: string;
  limit: number;
  spent: number;
  color: string;
  remaining: number; // Added as it's used in mock data
  category: string; // Added as it's used in mock data
  alerts: any[]; // Added as it's used in mock data
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  status: 'on_track' | 'needs_attention' | 'achieved' | 'behind';
  iconName?: string;
  plan?: any;
  startDate?: string;
  linkedGoals?: any[];
  recurringContributions?: any[];
  contributions?: any[];
}

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
  view?: View;
  severity: 'info' | 'warning' | 'error' | 'success'; // Added severity
}

export interface APIStatus {
  provider: string;
  status: 'Operational' | 'Degraded Performance' | 'Partial Outage' | 'Major Outage' | 'Maintenance' | 'Unknown';
  responseTime: number;
}

export interface LinkedAccount {
  id: string;
  name: string;
  type: string;
  institutionId: string;
  mask: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  nextPayment: string;
  iconName: string;
}

export interface CreditScore {
  score: number;
  change: number;
  rating: string;
}

export interface UpcomingBill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  saved: number;
  iconName: string;
}

export interface MarketMover {
  ticker: string;
  name: string;
  price: number;
  change: number;
}

export interface CryptoAsset {
  ticker: string;
  name: string;
  value: number;
  amount: number;
  color: string;
}

export interface PaymentOperation {
  id: string;
  description: string;
  amount: number;
  status: string;
  type: string;
  date: string;
}

export interface CorporateCard {
  id: string;
  holderName: string;
  cardNumberMask: string;
  status: string;
  frozen: boolean;
  controls: {
    atm: boolean;
    contactless: boolean;
    online: boolean;
    monthlyLimit: number;
  };
  biometricLockEnabled: boolean;
}

export interface CorporateTransaction {
  id: string;
  cardId: string;
  holderName: string;
  merchant: string;
  amount: number;
  status: string;
  timestamp: string;
  date: string;
  description: string;
}

export interface RewardPoints {
  balance: number;
  lastEarned: number;
  lastRedeemed: number;
  currency: string;
}

export interface RewardItem {
  id: string;
  name: string;
  cost: number;
  type: string;
  description: string;
  iconName: string;
}

export interface CreditFactor {
  name: string;
  status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  description: string;
}

export interface PaymentOrder {
  id: string;
  counterpartyId: string;
  counterpartyName: string;
  accountId: string;
  amount: number;
  currency: string;
  direction: string;
  status: string;
  date: string;
  type: string;
  dueDate?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  counterpartyName: string;
  dueDate: string;
  amount: number;
  status: string;
}

export interface ComplianceCase {
  id: string;
  reason: string;
  entityType: string;
  entityId: string;
  status: string;
  openedDate: string;
  type?: string;
  description?: string;
}

export interface FinancialAnomaly {
  id: string;
  description: string;
  details: string;
  severity: 'High' | 'Medium' | 'Low';
  status: string;
  entityType: string;
  entityId: string;
  entityDescription: string;
  timestamp: string;
  riskScore: number;
}

export interface Post {
  id: string;
  author_id: string;
  userName: string;
  userProfilePic: string;
  created_tick: number;
  content: {
    text: string;
    imageUrl?: string;
  };
  type: string;
  tags: string[];
  metrics: {
    likes: number;
    comments: number;
    shares: number;
    reach: number;
  };
  visibility: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userProfilePic: string;
  text: string;
  timestamp: string;
}

export interface LendingPoolStats {
  totalCapital: number;
  interestRate: number;
  activeLoans: number;
  defaultRate: number;
  totalInterestEarned: number;
}

export interface AppIntegration {
  id: string;
  name: string;
  logo: React.FC<{ className?: string }>;
  status: 'connected' | 'issue' | 'disconnected';
}

export interface Counterparty {
  id: string;
  name: string;
  type: string;
  riskLevel: string;
  createdDate: string;
  accounts: ExternalAccount[];
  virtualAccounts: any[];
}

export interface ExternalAccount {
  id: string;
  bankName: string;
  mask: string;
  balance: number;
  type: string;
  party_name: string;
  verification_status: string;
  account_details: any[];
  routing_details: any[];
}

export interface BiometricData {
  id: string;
  type: string;
  publicKey: string;
  enrolledDate: string;
}

export interface LoginAttempt {
  id: string;
  userId: string;
  userName: string;
  timestamp: string;
  ipAddress: string;
  success: boolean;
}

export interface AIAgent {
  id: string;
  name: string;
  status: string;
  specialization: string;
  traffic: number;
}

export interface SynapticVault {
  id: string;
  ownerIds: string[];
  ownerNames: string[];
  status: string;
  masterPrivateKeyFragment: string;
  creationDate: string;
}

export interface MarqetaUser {
  token: string;
  first_name: string;
  last_name: string;
  email: string;
  active: boolean;
  created_time: string;
  last_modified_time: string;
}

export interface MarqetaCardProduct {
  token: string;
  name: string;
  active: boolean;
  start_date: string;
  config: any;
}

export interface MarqetaCard {
  token: string;
}

export interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  action: string;
  active: boolean;
}

export interface Business {
  id: string;
  owner_id: string;
  name: string;
  type: string;
  monthly_revenue: number;
  expenses: number;
  employees: string[];
  status: string;
  marketing_factor: number;
  businessPlan: string;
  valuation: number;
  cashBalance: number;
  hqLocation: string;
}

export interface NFTAsset {
    id: string;
    name: string;
    imageUrl: string;
    contractAddress: string;
}

export interface EIP6963ProviderDetail {
    info: {
        uuid: string;
        name: string;
        icon: string;
    };
}

export interface MarketplaceProduct {
    id: string;
    name: string;
}

export interface LoginActivity {
    id: string;
    device: string;
    browser: string;
    os: string;
    location: string;
    ip: string;
    timestamp: string;
    isCurrent: boolean;
    userAgent: string;
}

export interface Device {
    id: string;
    name: string;
    type: string;
    model: string;
    lastActivity: string;
    location: string;
    ip: string;
    isCurrent: boolean;
    permissions: string[];
    status: string;
    firstSeen: string;
    userAgent: string;
    pushNotificationsEnabled: boolean;
    biometricAuthEnabled: boolean;
    encryptionStatus: string;
}

export interface DataSharingPolicy {
    policyId: string;
    policyName: string;
    scope: string;
    lastReviewed: string;
    isActive: boolean;
}

export interface TransactionRule {
    ruleId: string;
    name: string;
    triggerCondition: string;
    action: string;
    isEnabled: boolean;
}

export interface ThreatAlert {
    alertId: string;
    title: string;
    description: string;
    timestamp: string;
}

export interface AuditLogEntry {
    id: string;
    timestamp: string;
    userId: string;
    action: string;
    targetResource: string;
    success: boolean;
}

export interface APIKey {
    id: string;
    keyName: string;
    creationDate: string;
    scopes: string[];
}

export interface TrustedContact {
    id: string;
    name: string;
    relationship: string;
    verified: boolean;
}

export interface SecurityAwarenessModule {
    moduleId: string;
    title: string;
    completionRate: number;
}

export interface SecurityScoreMetric {
    metricName: string;
    currentValue: string;
}

export interface StripeBalance {
    available: { amount: number; currency: string }[];
    pending: { amount: number; currency: string }[];
}

export interface StripeCharge {
    id: string;
    amount: number;
    currency: string;
    status: 'succeeded' | 'pending' | 'failed';
    created: number;
    description: string;
    customer_id: string;
    payment_intent?: string;
    amount_refunded?: number;
    refunded?: boolean;
}

export interface StripeCustomer {
    id: string;
    email: string;
    name: string;
    created: number;
    total_spent: number;
}

export interface StripeSubscription {
    id: string;
    customer_id: string;
    plan_id: string;
    status: 'active' | 'canceled' | 'past_due';
    current_period_end: number;
    amount: number;
}

export interface AIInsight {
    id: string;
    type: string;
    severity: string;
    message: string;
    details: string;
    timestamp: string;
}

export interface DetectedSubscription {
    name: string;
    estimatedAmount: number;
    lastCharged: string;
}

export interface PlaidLinkSuccessMetadata {
    institution: {
        name: string;
        institution_id: string;
    };
    accounts: {
        id: string;
        name: string;
        mask: string;
        type: string;
        subtype: string;
    }[];
}

export type PlaidProduct = 'assets' | 'auth' | 'balance' | 'identity' | 'investments' | 'liabilities' | 'payment_initiation' | 'transactions';

export interface VirtualAccount {
    id: string;
    name: string;
}

export interface SettlementInstruction {
    messageId: string;
    creationDateTime: string;
    numberOfTransactions: number;
    settlementDate: string;
    totalAmount: number;
    currency: string;
    purpose?: any;
}
