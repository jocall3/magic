import React from 'react';
import { 
  LayoutDashboard, DollarSign, TrendingUp, Target, Heart, Settings, Briefcase, Zap, Code, Globe, BookOpen, Users, FileText, BarChart, Lock, Scale, GitBranch, Play, Database, CreditCard, Factory, Receipt, RefreshCw, Server, Sliders, Clock, Package, ShoppingCart, Banknote, Landmark, Gift, Lightbulb, Bot, Eye, MapPin, Fingerprint, ClipboardCheck, Component, FileSearch, Link, Upload, Download, AlertTriangle, Calendar, CreditCard as CardIcon, FormInput, List, PieChart, BarChart3, LineChart, MessageSquare, Repeat, Shield, Tag, Timer, Cpu, Terminal, Sparkles, ShieldAlert, ArrowLeft, Grid
} from 'lucide-react';

// --- 1. PERSONAL FINANCE & WEALTH MANAGEMENT VIEWS ---
import Dashboard from './components/Dashboard';
import TransactionsView from './components/TransactionsView';
import SendMoneyView from './components/SendMoneyView';
import BudgetsView from './components/BudgetsView';
import FinancialGoalsView from './components/FinancialGoalsView';
import CreditHealthView from './components/CreditHealthView';
import PersonalizationView from './components/PersonalizationView';
import AccountsView from './components/AccountsView';
import InvestmentsView from './components/InvestmentsView';
import CryptoView from './components/CryptoView';
import AlgoTradingLab from './components/AlgoTradingLab';
import ForexArena from './components/ForexArena';
import CommoditiesExchange from './components/CommoditiesExchange';
import RealEstateEmpire from './components/RealEstateEmpire';
import ArtCollectibles from './components/ArtCollectibles';
import DerivativesDesk from './components/DerivativesDesk';
import VentureCapitalDesk from './components/VentureCapitalDesk';
import PrivateEquityLounge from './components/PrivateEquityLounge';
import TaxOptimizationChamber from './components/TaxOptimizationChamber';
import LegacyBuilder from './components/LegacyBuilder';
import SovereignWealth from './components/SovereignWealth';
import PhilanthropyHub from './components/PhilanthropyHub';
import AIAdvisorView from './components/AIAdvisorView';
import { AIInsights } from './components/AIInsights';
import QuantumAssets from './components/QuantumAssets';
import VentureCapitalDeskView from './components/VentureCapitalDeskView';

// --- 2. CORPORATE & TREASURY VIEWS ---
import CorporateCommandView from './components/CorporateCommandView';
import ModernTreasuryView from './components/ModernTreasuryView';
import OpenBankingView from './components/OpenBankingView';
import FinancialDemocracyView from './components/FinancialDemocracyView';
import AIAdStudioView from './components/AIAdStudioView';
import QuantumWeaverView from './components/QuantumWeaverView';
import AgentMarketplaceView from './components/MarketplaceView';
import CustomerDashboard from './components/CustomerDashboard';
import VerificationReportsView from './components/VerificationReportsView';
import FinancialReportingView from './components/FinancialReportingView';
import GlobalPositionMap from './components/GlobalPositionMap';
import GlobalSsiHubView from './components/GlobalSsiHubView';
import CounterpartyDashboardView from './components/CounterpartyDashboardView';
import VirtualAccountsDashboard from './components/VirtualAccountsDashboard';
import CorporateActionsNexusView from './components/CorporateActionsNexusView';
import { CreditNoteLedger } from './components/CreditNoteLedger';
import ReconciliationHubView from './components/ReconciliationHubView';
import GEINDashboard from './components/GEIN_DashboardView';
import CardholderManagement from './components/CardholderManagement';
import TreasuryView from './components/TreasuryView';

// --- 3. BLUEPRINTS & SYSTEM INTEGRATION VIEWS (Plaid/Stripe/Citibank) ---
import APIIntegrationView from './components/APIIntegrationView';
import SettingsView from './components/SettingsView';
import PlaidDashboardView from './components/PlaidDashboardView';
import StripeDashboardView from './components/StripeDashboardView';
import MarqetaDashboardView from './components/MarqetaDashboardView';
import SSOView from './components/SSOView';
import ConciergeService from './components/ConciergeService';
import TheVisionView from './components/TheVisionView';
import SecurityView from './components/SecurityView';
import ComplianceOracleView from './components/ComplianceOracleView';
import StripeNexusDashboard from './components/StripeNexusDashboard';
import TheBookView from './components/TheBookView';
import KnowledgeBaseView from './components/KnowledgeBaseView';
import VoiceControl from './components/VoiceControl';
import CitibankAccountsView from './components/CitibankAccountsView';
import CitibankAccountProxyView from './components/CitibankAccountProxyView';
import CitibankBillPayView from './components/CitibankBillPayView';
import CitibankCrossBorderView from './components/CitibankCrossBorderView';
import CitibankPayeeManagementView from './components/CitibankPayeeManagementView';
import CitibankStandingInstructionsView from './components/CitibankStandingInstructionsView';
import CitibankDeveloperToolsView from './components/CitibankDeveloperToolsView';
import CitibankEligibilityView from './components/CitibankEligibilityView';
import CitibankUnmaskedDataView from './components/CitibankUnmaskedDataView';
import PlaidIdentityView from './components/PlaidIdentityView';
import PlaidCRAMonitoringView from './components/PlaidCRAMonitoringView';
import { PlaidInstitutionsExplorer } from './components/PlaidInstitutionsExplorer';
import { PlaidItemManagementView } from './components/PlaidItemManagementView';
import PlaidMainDashboard from './components/PlaidMainDashboard';
import StripeNexusView from './components/StripeNexusView';
import DeveloperHubView from './components/DeveloperHubView';
import ApiPlaygroundView from './components/ApiPlaygroundView';
import SchemaExplorer from './components/SchemaExplorer';
import ResourceGraphView from './components/ResourceGraphView';
import SecurityComplianceView from './components/SecurityComplianceView';
import UniversalObjectInspector from './components/UniversalObjectInspector';
import WebhookSimulator from './components/WebhookSimulator';
import ConductorConfigurationView from './components/ConductorConfigurationView';

// --- 4. CORE COMPONENTS (Used for Direct Component Access/Testing) ---
import AccountDetails from './components/AccountDetails';
import AccountList from './components/AccountList';
import AccountStatementGrid from './components/AccountStatementGrid';
import { AccountVerificationModal } from './components/AccountVerificationModal';
import ACHDetailsDisplay from './components/ACHDetailsDisplay';
import AICommandLog from './components/AICommandLog';
import AIPredictionWidget from './components/AIPredictionWidget';
import AssetCatalog from './components/AssetCatalog';
import AutomatedSweepRules from './components/AutomatedSweepRules';
import BalanceReportChart from './components/BalanceReportChart';
import BalanceTransactionTable from './components/BalanceTransactionTable';
import CardDesignVisualizer from './components/CardDesignVisualizer';
import { ChargeDetailModal } from './components/ChargeDetailModal';
import ChargeList from './components/ChargeList';
import CounterpartyDetails from './components/CounterpartyDetails';
import { CounterpartyForm } from './components/CounterpartyForm';
import DisruptionIndexMeter from './components/DisruptionIndexMeter';
import DocumentUploader from './components/DocumentUploader';
import { DownloadLink } from './components/DownloadLink';
import EarlyFraudWarningFeed from './components/EarlyFraudWarningFeed';
import ElectionChoiceForm from './components/ElectionChoiceForm';
import EventNotificationCard from './components/EventNotificationCard';
import ExpectedPaymentsTable from './components/ExpectedPaymentsTable';
import ExternalAccountCard from './components/ExternalAccountCard';
import ExternalAccountForm from './components/ExternalAccountForm';
import ExternalAccountTable from './components/ExternalAccountsTable';
import { FinancialAccountCard } from './components/FinancialAccountCard';
import IncomingPaymentDetailList from './components/IncomingPaymentDetailList';
import { InvestmentForm } from './components/InvestmentForm';
import InvoiceFinancingRequest from './components/InvoiceFinancingRequest';
import PaymentInitiationForm from './components/PaymentInitiationForm';
import PaymentMethodDetails from './components/PaymentMethodDetails';
import PaymentOrderForm from './components/PaymentOrderForm';
import PayoutsDashboard from './components/PayoutsDashboard';
import PnLChart from './components/PnLChart';
import RefundForm from './components/RefundForm';
import RemittanceInfoEditor from './components/RemittanceInfoEditor';
import ReportingView from './components/ReportingView';
import { ReportRunGenerator } from './components/ReportRunGenerator';
import ReportStatusIndicator from './components/ReportStatusIndicator';
import SsiEditorForm from './components/SsiEditorForm';
import StripeStatusBadge from './components/StripeStatusBadge';
import StructuredPurposeInput from './components/StructuredPurposeInput';
import SubscriptionList from './components/SubscriptionList';
import TimeSeriesChart from './components/TimeSeriesChart';
import TradeConfirmationModal from './components/TradeConfirmationModal';
import TransactionFilter from './components/TransactionFilter';
import TransactionList from './components/TransactionList';
import { TreasuryTransactionList } from './components/TreasuryTransactionList';
import VirtualAccountForm from './components/VirtualAccountForm';
import VirtualAccountsTable from './components/VirtualAccountsTable';

// --- 5. CORE APP VIEWS ---
import SApp from './components/SApp';
import { LoginView } from './components/LoginView';
import LandingPage from './components/LandingPage';


// --- TYPE DEFINITIONS ---

export enum ViewDomain {
  Personal = 'Personal',
  Corporate = 'Corporate',
  Blueprints = 'Blueprints',
  System = 'System',
  Components = 'Components',
}

export interface ViewRegistryItem {
  component: React.FC<any>;
  domain: ViewDomain;
  title: string;
  path: string;
  icon?: React.FC<any>;
  isModal?: boolean;
}

export type ViewRegistry = Record<string, ViewRegistryItem>;

// Helper function to slugify a title
export const slugify = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// --- THE REGISTRY ---

export const viewRegistry: ViewRegistry = {
  // =================================================================
  // 1. PERSONAL FINANCE & WEALTH MANAGEMENT (Domain: Personal)
  // =================================================================
  [slugify('Dashboard')]: {
    component: Dashboard, domain: ViewDomain.Personal, title: 'Dashboard', path: 'dashboard', icon: LayoutDashboard,
  },
  [slugify('Transactions')]: {
    component: TransactionsView, domain: ViewDomain.Personal, title: 'Transactions', path: 'transactions', icon: List,
  },
  [slugify('Send Money')]: {
    component: SendMoneyView, domain: ViewDomain.Personal, title: 'Send Money', path: 'send-money', icon: DollarSign,
  },
  [slugify('Budgets')]: {
    component: BudgetsView, domain: ViewDomain.Personal, title: 'Budgets', path: 'budgets', icon: Target,
  },
  [slugify('Financial Goals')]: {
    component: FinancialGoalsView, domain: ViewDomain.Personal, title: 'Financial Goals', path: 'financial-goals', icon: TrendingUp,
  },
  [slugify('Credit Health')]: {
    component: CreditHealthView, domain: ViewDomain.Personal, title: 'Credit Health', path: 'credit-health', icon: Heart,
  },
  [slugify('Accounts')]: {
    component: AccountsView, domain: ViewDomain.Personal, title: 'Accounts', path: 'accounts', icon: Banknote,
  },
  [slugify('Investments')]: {
    component: InvestmentsView, domain: ViewDomain.Personal, title: 'Investments', path: 'investments', icon: BarChart,
  },
  [slugify('Crypto Web3')]: {
    component: CryptoView, domain: ViewDomain.Personal, title: 'Crypto & Web3', path: 'crypto-web3', icon: Zap,
  },
  [slugify('Algo Trading Lab')]: {
    component: AlgoTradingLab, domain: ViewDomain.Personal, title: 'Algo Trading Lab', path: 'algo-trading-lab', icon: Cpu,
  },
  [slugify('Forex Arena')]: {
    component: ForexArena, domain: ViewDomain.Personal, title: 'Forex Arena', path: 'forex-arena', icon: Repeat,
  },
  [slugify('Commodities Exchange')]: {
    component: CommoditiesExchange, domain: ViewDomain.Personal, title: 'Commodities Exchange', path: 'commodities-exchange', icon: Package,
  },
  [slugify('Real Estate Empire')]: {
    component: RealEstateEmpire, domain: ViewDomain.Personal, title: 'Real Estate Empire', path: 'real-estate-empire', icon: Landmark,
  },
  [slugify('Art Collectibles')]: {
    component: ArtCollectibles, domain: ViewDomain.Personal, title: 'Art & Collectibles', path: 'art-collectibles', icon: Sparkles,
  },
  [slugify('Derivatives Desk')]: {
    component: DerivativesDesk, domain: ViewDomain.Personal, title: 'Derivatives Desk', path: 'derivatives-desk', icon: GitBranch,
  },
  [slugify('Venture Capital')]: {
    component: VentureCapitalDesk, domain: ViewDomain.Personal, title: 'Venture Capital', path: 'venture-capital', icon: Factory,
  },
  [slugify('Private Equity Lounge')]: {
    component: PrivateEquityLounge, domain: ViewDomain.Personal, title: 'Private Equity Lounge', path: 'private-equity-lounge', icon: Briefcase,
  },
  [slugify('Tax Optimization Chamber')]: {
    component: TaxOptimizationChamber, domain: ViewDomain.Personal, title: 'Tax Optimization', path: 'tax-optimization', icon: Scale,
  },
  [slugify('Legacy Builder')]: {
    component: LegacyBuilder, domain: ViewDomain.Personal, title: 'Legacy Builder', path: 'legacy-builder', icon: Gift,
  },
  [slugify('Sovereign Wealth')]: {
    component: SovereignWealth, domain: ViewDomain.Personal, title: 'Sovereign Wealth', path: 'sovereign-wealth', icon: Globe,
  },
  [slugify('Philanthropy Hub')]: {
    component: PhilanthropyHub, domain: ViewDomain.Personal, title: 'Philanthropy Hub', path: 'philanthropy-hub', icon: Lightbulb,
  },
  [slugify('AI Advisor')]: {
    component: AIAdvisorView, domain: ViewDomain.Personal, title: 'AI Advisor', path: 'ai-advisor', icon: Bot,
  },
  [slugify('AI Insights')]: {
    component: AIInsights, domain: ViewDomain.Personal, title: 'AI Insights', path: 'ai-insights', icon: Eye,
  },
  [slugify('Quantum Assets')]: {
    component: QuantumAssets, domain: ViewDomain.Personal, title: 'Quantum Assets', path: 'quantum-assets', icon: Zap,
  },
  [slugify('Personalization')]: {
    component: PersonalizationView, domain: ViewDomain.Personal, title: 'Personalization', path: 'personalization', icon: Sliders,
  },
  [slugify('Venture Capital Desk View')]: {
    component: VentureCapitalDeskView, domain: ViewDomain.Personal, title: 'VC Desk View', path: 'vc-desk-view', icon: Factory,
  },

  // =================================================================
  // 2. CORPORATE & TREASURY (Domain: Corporate)
  // =================================================================
  [slugify('Corporate Command')]: {
    component: CorporateCommandView, domain: ViewDomain.Corporate, title: 'Corporate Command', path: 'corporate-command', icon: Shield,
  },
  [slugify('Modern Treasury')]: {
    component: ModernTreasuryView, domain: ViewDomain.Corporate, title: 'Modern Treasury', path: 'modern-treasury', icon: Receipt,
  },
  [slugify('Treasury View')]: {
    component: TreasuryView, domain: ViewDomain.Corporate, title: 'Treasury Overview', path: 'treasury-overview', icon: Banknote,
  },
  [slugify('Open Banking')]: {
    component: OpenBankingView, domain: ViewDomain.Corporate, title: 'Open Banking', path: 'open-banking', icon: Link,
  },
  [slugify('Financial Democracy')]: {
    component: FinancialDemocracyView, domain: ViewDomain.Corporate, title: 'Financial Democracy', path: 'financial-democracy', icon: Users,
  },
  [slugify('AI Ad Studio')]: {
    component: AIAdStudioView, domain: ViewDomain.Corporate, title: 'AI Ad Studio', path: 'ai-ad-studio', icon: Sparkles,
  },
  [slugify('Quantum Weaver')]: {
    component: QuantumWeaverView, domain: ViewDomain.Corporate, title: 'Quantum Weaver', path: 'quantum-weaver', icon: Grid,
  },
  [slugify('Agent Marketplace')]: {
    component: AgentMarketplaceView, domain: ViewDomain.Corporate, title: 'Agent Marketplace', path: 'agent-marketplace', icon: ShoppingCart,
  },
  [slugify('Customer Dashboard')]: {
    component: CustomerDashboard, domain: ViewDomain.Corporate, title: 'Customer Dashboard', path: 'customer-dashboard', icon: Users,
  },
  [slugify('Verification Reports')]: {
    component: VerificationReportsView, domain: ViewDomain.Corporate, title: 'Verification Reports', path: 'verification-reports', icon: ClipboardCheck,
  },
  [slugify('Financial Reporting')]: {
    component: FinancialReportingView, domain: ViewDomain.Corporate, title: 'Financial Reporting', path: 'financial-reporting', icon: FileText,
  },
  [slugify('Global Position Map')]: {
    component: GlobalPositionMap, domain: ViewDomain.Corporate, title: 'Global Position Map', path: 'global-position-map', icon: MapPin,
  },
  [slugify('Global SSI Hub')]: {
    component: GlobalSsiHubView, domain: ViewDomain.Corporate, title: 'Global SSI Hub', path: 'global-ssi-hub', icon: Globe,
  },
  [slugify('Counterparty Dashboard')]: {
    component: CounterpartyDashboardView, domain: ViewDomain.Corporate, title: 'Counterparty Dashboard', path: 'counterparty-dashboard', icon: Users,
  },
  [slugify('Virtual Accounts')]: {
    component: VirtualAccountsDashboard, domain: ViewDomain.Corporate, title: 'Virtual Accounts', path: 'virtual-accounts', icon: CreditCard,
  },
  [slugify('Corporate Actions Nexus')]: {
    component: CorporateActionsNexusView, domain: ViewDomain.Corporate, title: 'Corporate Actions Nexus', path: 'corporate-actions-nexus', icon: RefreshCw,
  },
  [slugify('Credit Note Ledger')]: {
    component: CreditNoteLedger, domain: ViewDomain.Corporate, title: 'Credit Note Ledger', path: 'credit-note-ledger', icon: Receipt,
  },
  [slugify('Reconciliation Hub')]: {
    component: ReconciliationHubView, domain: ViewDomain.Corporate, title: 'Reconciliation Hub', path: 'reconciliation-hub', icon: RefreshCw,
  },
  [slugify('GEIN Dashboard')]: {
    component: GEINDashboard, domain: ViewDomain.Corporate, title: 'GEIN Dashboard', path: 'gein-dashboard', icon: Terminal,
  },
  [slugify('Cardholder Management')]: {
    component: CardholderManagement, domain: ViewDomain.Corporate, title: 'Cardholder Management', path: 'cardholder-management', icon: CardIcon,
  },

  // =================================================================
  // 3. BLUEPRINTS & INTEGRATION (Domain: Blueprints)
  // =================================================================
  [slugify('Developer Hub')]: {
    component: DeveloperHubView, domain: ViewDomain.Blueprints, title: 'Developer Hub', path: 'developer-hub', icon: Code,
  },
  [slugify('API Playground')]: {
    component: ApiPlaygroundView, domain: ViewDomain.Blueprints, title: 'API Playground', path: 'api-playground', icon: Play,
  },
  [slugify('Schema Explorer')]: {
    component: SchemaExplorer, domain: ViewDomain.Blueprints, title: 'Schema Explorer', path: 'schema-explorer', icon: Database,
  },
  [slugify('Resource Graph')]: {
    component: ResourceGraphView, domain: ViewDomain.Blueprints, title: 'Resource Graph', path: 'resource-graph', icon: GitBranch,
  },
  [slugify('API Status')]: {
    component: APIIntegrationView, domain: ViewDomain.Blueprints, title: 'API Status', path: 'api-status', icon: Server,
  },
  [slugify('Plaid Main Dashboard')]: {
    component: PlaidMainDashboard, domain: ViewDomain.Blueprints, title: 'Plaid Main Dashboard', path: 'plaid-main-dashboard', icon: Grid,
  },
  [slugify('Stripe Nexus')]: {
    component: StripeNexusView, domain: ViewDomain.Blueprints, title: 'Stripe Nexus', path: 'stripe-nexus', icon: Grid,
  },
  [slugify('Citibank Accounts')]: {
    component: CitibankAccountsView, domain: ViewDomain.Blueprints, title: 'Citibank Accounts', path: 'citibank-accounts', icon: Banknote,
  },
  [slugify('The Book')]: {
    component: TheBookView, domain: ViewDomain.Blueprints, title: 'The Book (Ledger)', path: 'the-book', icon: BookOpen,
  },
  [slugify('Knowledge Base')]: {
    component: KnowledgeBaseView, domain: ViewDomain.Blueprints, title: 'Knowledge Base', path: 'knowledge-base', icon: BookOpen,
  },
  [slugify('Universal Object Inspector')]: {
    component: UniversalObjectInspector, domain: ViewDomain.Blueprints, title: 'Object Inspector', path: 'universal-object-inspector', icon: FileSearch,
  },
  [slugify('Webhook Simulator')]: {
    component: WebhookSimulator, domain: ViewDomain.Blueprints, title: 'Webhook Simulator', path: 'webhook-simulator', icon: Zap,
  },
  [slugify('Conductor Configuration')]: {
    component: ConductorConfigurationView, domain: ViewDomain.Blueprints, title: 'Conductor Config', path: 'conductor-configuration', icon: Settings,
  },
  [slugify('Plaid Identity')]: { component: PlaidIdentityView, domain: ViewDomain.Blueprints, title: 'Plaid Identity', path: 'plaid-identity', icon: Fingerprint },
  [slugify('Plaid CRA Monitoring')]: { component: PlaidCRAMonitoringView, domain: ViewDomain.Blueprints, title: 'Plaid CRA Monitoring', path: 'plaid-cra-monitoring', icon: Eye },
  [slugify('Plaid Institutions Explorer')]: { component: PlaidInstitutionsExplorer, domain: ViewDomain.Blueprints, title: 'Plaid Institutions', path: 'plaid-institutions', icon: Banknote },
  [slugify('Plaid Item Management')]: { component: PlaidItemManagementView, domain: ViewDomain.Blueprints, title: 'Plaid Item Management', path: 'plaid-item-management', icon: Settings },
  [slugify('Citibank Account Proxy')]: { component: CitibankAccountProxyView, domain: ViewDomain.Blueprints, title: 'Citi Account Proxy', path: 'citibank-account-proxy', icon: Link },
  [slugify('Citibank Bill Pay')]: { component: CitibankBillPayView, domain: ViewDomain.Blueprints, title: 'Citi Bill Pay', path: 'citibank-bill-pay', icon: DollarSign },
  [slugify('Citibank Cross Border')]: { component: CitibankCrossBorderView, domain: ViewDomain.Blueprints, title: 'Citi Cross Border', path: 'citibank-cross-border', icon: Globe },
  [slugify('Citibank Payee Management')]: { component: CitibankPayeeManagementView, domain: ViewDomain.Blueprints, title: 'Citi Payee Management', path: 'citibank-payee-management', icon: Users },
  [slugify('Citibank Standing Instructions')]: { component: CitibankStandingInstructionsView, domain: ViewDomain.Blueprints, title: 'Citi Standing Instructions', path: 'citibank-standing-instructions', icon: Clock },
  [slugify('Citibank Developer Tools')]: { component: CitibankDeveloperToolsView, domain: ViewDomain.Blueprints, title: 'Citi Developer Tools', path: 'citibank-developer-tools', icon: Code },
  [slugify('Citibank Eligibility')]: { component: CitibankEligibilityView, domain: ViewDomain.Blueprints, title: 'Citi Eligibility', path: 'citibank-eligibility', icon: ClipboardCheck },
  [slugify('Citibank Unmasked Data')]: { component: CitibankUnmaskedDataView, domain: ViewDomain.Blueprints, title: 'Citi Unmasked Data', path: 'citibank-unmasked-data', icon: Eye },
  [slugify('Stripe Dashboard View')]: { component: StripeDashboardView, domain: ViewDomain.Blueprints, title: 'Stripe Dashboard', path: 'stripe-dashboard', icon: Grid },
  [slugify('Plaid Dashboard View')]: { component: PlaidDashboardView, domain: ViewDomain.Blueprints, title: 'Plaid Dashboard', path: 'plaid-dashboard', icon: Grid },
  [slugify('Marqeta Dashboard View')]: { component: MarqetaDashboardView, domain: ViewDomain.Blueprints, title: 'Marqeta Dashboard', path: 'marqeta-dashboard', icon: Grid },
  [slugify('Stripe Nexus Dashboard')]: { component: StripeNexusDashboard, domain: ViewDomain.Blueprints, title: 'Stripe Nexus Dashboard', path: 'stripe-nexus-dashboard', icon: Grid },

  // =================================================================
  // 4. SYSTEM & INFRASTRUCTURE (Domain: System)
  // =================================================================
  [slugify('Settings')]: {
    component: SettingsView, domain: ViewDomain.System, title: 'Settings', path: 'settings', icon: Settings,
  },
  [slugify('Security Center')]: {
    component: SecurityView, domain: ViewDomain.System, title: 'Security Center', path: 'security-center', icon: Lock,
  },
  [slugify('Compliance Oracle')]: {
    component: ComplianceOracleView, domain: ViewDomain.System, title: 'Compliance Oracle', path: 'compliance-oracle', icon: Scale,
  },
  [slugify('Security Compliance')]: {
    component: SecurityComplianceView, domain: ViewDomain.System, title: 'Security & Compliance', path: 'security-compliance', icon: ShieldAlert,
  },
  [slugify('SSO View')]: {
    component: SSOView, domain: ViewDomain.System, title: 'SSO Management', path: 'sso-view', icon: Fingerprint,
  },
  [slugify('Concierge Service')]: {
    component: ConciergeService, domain: ViewDomain.System, title: 'Concierge Service', path: 'concierge-service', icon: MessageSquare,
  },
  [slugify('The Vision')]: {
    component: TheVisionView, domain: ViewDomain.System, title: 'The Vision', path: 'the-vision', icon: Lightbulb,
  },
  [slugify('Voice Control')]: {
    component: VoiceControl, domain: ViewDomain.System, title: 'Voice Control', path: 'voice-control', icon: Terminal,
  },
  [slugify('SApp')]: {
    component: SApp, domain: ViewDomain.System, title: 'Sovereign App Core', path: 'sapp', icon: Cpu,
  },
  [slugify('Login View')]: {
    component: LoginView, domain: ViewDomain.System, title: 'Login', path: 'login', icon: ArrowLeft,
  },
  [slugify('Landing Page')]: {
    component: LandingPage, domain: ViewDomain.System, title: 'Landing Page', path: 'landing', icon: ArrowLeft,
  },

  // =================================================================
  // 5. DIRECT COMPONENTS (Domain: Components)
  // =================================================================
  [slugify('Account Details')]: { component: AccountDetails, domain: ViewDomain.Components, title: 'Account Details', path: 'component-account-details', icon: Component },
  [slugify('Account List')]: { component: AccountList, domain: ViewDomain.Components, title: 'Account List', path: 'component-account-list', icon: Component },
  [slugify('Account Statement Grid')]: { component: AccountStatementGrid, domain: ViewDomain.Components, title: 'Statement Grid', path: 'component-statement-grid', icon: Component },
  [slugify('Account Verification Modal')]: { component: AccountVerificationModal, domain: ViewDomain.Components, title: 'Verification Modal', path: 'component-verification-modal', icon: Component, isModal: true },
  [slugify('ACH Details Display')]: { component: ACHDetailsDisplay, domain: ViewDomain.Components, title: 'ACH Details', path: 'component-ach-details', icon: Component },
  [slugify('AI Command Log')]: { component: AICommandLog, domain: ViewDomain.Components, title: 'AI Command Log', path: 'component-ai-command-log', icon: Component },
  [slugify('AIPrediction Widget')]: { component: AIPredictionWidget, domain: ViewDomain.Components, title: 'AI Prediction Widget', path: 'component-ai-prediction-widget', icon: Component },
  [slugify('Asset Catalog')]: { component: AssetCatalog, domain: ViewDomain.Components, title: 'Asset Catalog', path: 'component-asset-catalog', icon: Component },
  [slugify('Automated Sweep Rules')]: { component: AutomatedSweepRules, domain: ViewDomain.Components, title: 'Sweep Rules', path: 'component-sweep-rules', icon: Component },
  [slugify('Balance Report Chart')]: { component: BalanceReportChart, domain: ViewDomain.Components, title: 'Balance Chart', path: 'component-balance-chart', icon: Component },
  [slugify('Balance Transaction Table')]: { component: BalanceTransactionTable, domain: ViewDomain.Components, title: 'Balance Tx Table', path: 'component-balance-tx-table', icon: Component },
  [slugify('Card Design Visualizer')]: { component: CardDesignVisualizer, domain: ViewDomain.Components, title: 'Card Visualizer', path: 'component-card-visualizer', icon: Component },
  [slugify('Charge Detail Modal')]: { component: ChargeDetailModal, domain: ViewDomain.Components, title: 'Charge Detail Modal', path: 'component-charge-detail-modal', icon: Component, isModal: true },
  [slugify('Charge List')]: { component: ChargeList, domain: ViewDomain.Components, title: 'Charge List', path: 'component-charge-list', icon: Component },
  [slugify('Counterparty Details')]: { component: CounterpartyDetails, domain: ViewDomain.Components, title: 'Counterparty Details', path: 'component-counterparty-details', icon: Component },
  [slugify('Counterparty Form')]: { component: CounterpartyForm, domain: ViewDomain.Components, title: 'Counterparty Form', path: 'component-counterparty-form', icon: Component },
  [slugify('Disruption Index Meter')]: { component: DisruptionIndexMeter, domain: ViewDomain.Components, title: 'Disruption Meter', path: 'component-disruption-meter', icon: Component },
  [slugify('Document Uploader')]: { component: DocumentUploader, domain: ViewDomain.Components, title: 'Document Uploader', path: 'component-document-uploader', icon: Component },
  [slugify('Download Link')]: { component: DownloadLink, domain: ViewDomain.Components, title: 'Download Link', path: 'component-download-link', icon: Component },
  [slugify('Early Fraud Warning Feed')]: { component: EarlyFraudWarningFeed, domain: ViewDomain.Components, title: 'Fraud Warning Feed', path: 'component-fraud-feed', icon: Component },
  [slugify('Election Choice Form')]: { component: ElectionChoiceForm, domain: ViewDomain.Components, title: 'Election Form', path: 'component-election-form', icon: Component },
  [slugify('Event Notification Card')]: { component: EventNotificationCard, domain: ViewDomain.Components, title: 'Event Card', path: 'component-event-card', icon: Component },
  [slugify('Expected Payments Table')]: { component: ExpectedPaymentsTable, domain: ViewDomain.Components, title: 'Expected Payments', path: 'component-expected-payments', icon: Component },
  [slugify('External Account Card')]: { component: ExternalAccountCard, domain: ViewDomain.Components, title: 'External Account Card', path: 'component-external-account-card', icon: Component },
  [slugify('External Account Form')]: { component: ExternalAccountForm, domain: ViewDomain.Components, title: 'External Account Form', path: 'component-external-account-form', icon: Component },
  [slugify('External Accounts Table')]: { component: ExternalAccountTable, domain: ViewDomain.Components, title: 'External Accounts Table', path: 'component-external-accounts-table', icon: Component },
  [slugify('Financial Account Card')]: { component: FinancialAccountCard, domain: ViewDomain.Components, title: 'Financial Account Card', path: 'component-financial-account-card', icon: Component },
  [slugify('Incoming Payment Detail List')]: { component: IncomingPaymentDetailList, domain: ViewDomain.Components, title: 'Incoming Payment List', path: 'component-incoming-payment-list', icon: Component },
  [slugify('Investment Form')]: { component: InvestmentForm, domain: ViewDomain.Components, title: 'Investment Form', path: 'component-investment-form', icon: Component },
  [slugify('Invoice Financing Request')]: { component: InvoiceFinancingRequest, domain: ViewDomain.Components, title: 'Invoice Financing', path: 'component-invoice-financing', icon: Component },
  [slugify('Payment Initiation Form')]: { component: PaymentInitiationForm, domain: ViewDomain.Components, title: 'Payment Initiation Form', path: 'component-payment-initiation-form', icon: Component },
  [slugify('Payment Method Details')]: { component: PaymentMethodDetails, domain: ViewDomain.Components, title: 'Payment Method Details', path: 'component-payment-method-details', icon: Component },
  [slugify('Payment Order Form')]: { component: PaymentOrderForm, domain: ViewDomain.Components, title: 'Payment Order Form', path: 'component-payment-order-form', icon: Component },
  [slugify('Payouts Dashboard')]: { component: PayoutsDashboard, domain: ViewDomain.Components, title: 'Payouts Dashboard', path: 'component-payouts-dashboard', icon: Component },
  [slugify('PnL Chart')]: { component: PnLChart, domain: ViewDomain.Components, title: 'PnL Chart', path: 'component-pnl-chart', icon: Component },
  [slugify('Refund Form')]: { component: RefundForm, domain: ViewDomain.Components, title: 'Refund Form', path: 'component-refund-form', icon: Component },
  [slugify('Remittance Info Editor')]: { component: RemittanceInfoEditor, domain: ViewDomain.Components, title: 'Remittance Editor', path: 'component-remittance-editor', icon: Component },
  [slugify('Reporting View')]: { component: ReportingView, domain: ViewDomain.Components, title: 'Reporting View', path: 'component-reporting-view', icon: Component },
  [slugify('Report Run Generator')]: { component: ReportRunGenerator, domain: ViewDomain.Components, title: 'Report Generator', path: 'component-report-generator', icon: Component },
  [slugify('Report Status Indicator')]: { component: ReportStatusIndicator, domain: ViewDomain.Components, title: 'Report Status', path: 'component-report-status', icon: Component },
  [slugify('Ssi Editor Form')]: { component: SsiEditorForm, domain: ViewDomain.Components, title: 'SSI Editor Form', path: 'component-ssi-editor-form', icon: Component },
  [slugify('Stripe Status Badge')]: { component: StripeStatusBadge, domain: ViewDomain.Components, title: 'Stripe Status Badge', path: 'component-stripe-status-badge', icon: Component },
  [slugify('Structured Purpose Input')]: { component: StructuredPurposeInput, domain: ViewDomain.Components, title: 'Structured Purpose Input', path: 'component-structured-purpose-input', icon: Component },
  [slugify('Subscription List')]: { component: SubscriptionList, domain: ViewDomain.Components, title: 'Subscription List', path: 'component-subscription-list', icon: Component },
  [slugify('TimeSeries Chart')]: { component: TimeSeriesChart, domain: ViewDomain.Components, title: 'Time Series Chart', path: 'component-time-series-chart', icon: Component },
  [slugify('Trade Confirmation Modal')]: { component: TradeConfirmationModal, domain: ViewDomain.Components, title: 'Trade Confirmation Modal', path: 'component-trade-confirmation-modal', icon: Component, isModal: true },
  [slugify('Transaction Filter')]: { component: TransactionFilter, domain: ViewDomain.Components, title: 'Transaction Filter', path: 'component-transaction-filter', icon: Component },
  [slugify('Transaction List')]: { component: TransactionList, domain: ViewDomain.Components, title: 'Transaction List', path: 'component-transaction-list', icon: Component },
  [slugify('Treasury Transaction List')]: { component: TreasuryTransactionList, domain: ViewDomain.Components, title: 'Treasury Tx List', path: 'component-treasury-tx-list', icon: Component },
  [slugify('Virtual Account Form')]: { component: VirtualAccountForm, domain: ViewDomain.Components, title: 'Virtual Account Form', path: 'component-virtual-account-form', icon: Component },
  [slugify('Virtual Accounts Table')]: { component: VirtualAccountsTable, domain: ViewDomain.Components, title: 'Virtual Accounts Table', path: 'component-virtual-accounts-table', icon: Component },
};

// Export utility function to filter views by domain
export const getViewsByDomain = (domain: ViewDomain): ViewRegistryItem[] => {
  return Object.values(viewRegistry).filter(view => view.domain === domain);
};