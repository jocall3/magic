import React, { useState, useContext, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, Navigate, Link, useLocation, Outlet } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Cpu, ShieldAlert, Sparkles, Terminal, ArrowLeft, ExternalLink, Grid } from 'lucide-react';
import { Auth0Provider } from '@auth0/auth0-react';
import { datadogLogs } from '@datadog/browser-logs';
import { Analytics } from '@vercel/analytics/react';

// Contexts
import { AuthProvider, AuthContext } from './context/AuthContext';
import { DataProvider, DataContext } from './context/DataContext';
import { StripeDataProvider } from './components/StripeDataProvider';
import { MoneyMovementProvider } from './components/MoneyMovementContext';

// Layout & Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SApp from './components/SApp';
import { View } from './types'; // Assuming View is imported here

// Views & Components
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
import CorporateCommandView from './components/CorporateCommandView';
import ModernTreasuryView from './components/ModernTreasuryView';
import OpenBankingView from './components/OpenBankingView';
import FinancialDemocracyView from './components/FinancialDemocracyView';
import AIAdStudioView from './components/AIAdStudioView';
import QuantumWeaverView from './components/QuantumWeaverView';
import AgentMarketplaceView from './components/MarketplaceView';
import APIIntegrationView from './components/APIIntegrationView';
import SettingsView from './components/SettingsView';
import PlaidDashboardView from './components/PlaidDashboardView';
import StripeDashboardView from './components/StripeDashboardView';
import MarqetaDashboardView from './components/MarqetaDashboardView';
import SSOView from './components/SSOView';
import ConciergeService from './components/ConciergeService';
import SovereignWealth from './components/SovereignWealth';
import PhilanthropyHub from './components/PhilanthropyHub';
import TheVisionView from './components/TheVisionView';
import AIAdvisorView from './components/AIAdvisorView';
import { AIInsights } from './components/AIInsights';
import SecurityView from './components/SecurityView';
import ComplianceOracleView from './components/ComplianceOracleView';
import GlobalPositionMap from './components/GlobalPositionMap';
import GlobalSsiHubView from './components/GlobalSsiHubView';
import CustomerDashboard from './components/CustomerDashboard';
import VerificationReportsView from './components/VerificationReportsView';
import FinancialReportingView from './components/FinancialReportingView';
import StripeNexusDashboard from './components/StripeNexusDashboard';
import TheBookView from './components/TheBookView';
import KnowledgeBaseView from './components/KnowledgeBaseView';
import VoiceControl from './components/VoiceControl';
import LandingPage from './components/LandingPage';
import QuantumAssets from './components/QuantumAssets';
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
import CounterpartyDashboardView from './components/CounterpartyDashboardView';
import VirtualAccountsDashboard from './components/VirtualAccountsDashboard';
import CorporateActionsNexusView from './components/CorporateActionsNexusView';
import { CreditNoteLedger } from './components/CreditNoteLedger';
import ReconciliationHubView from './components/ReconciliationHubView';
import GEINDashboard from './components/GEIN_DashboardView';
import CardholderManagement from './components/CardholderManagement';
import UniversalObjectInspector from './components/UniversalObjectInspector';
import { LoginView } from './components/LoginView';
import { PlaidClient } from './lib/plaidClient';
import DeveloperHubView from './components/DeveloperHubView';
import ApiPlaygroundView from './components/ApiPlaygroundView';

// --- ALL COMPONENT IMPORTS FOR DIRECT ACCESS ---
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
import ConductorConfigurationView from './components/ConductorConfigurationView';
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
import ResourceGraphView from './components/ResourceGraphView';
import SchemaExplorer from './components/SchemaExplorer';
import SecurityComplianceView from './components/SecurityComplianceView';
import SsiEditorForm from './components/SsiEditorForm';
import StripeStatusBadge from './components/StripeStatusBadge';
import StructuredPurposeInput from './components/StructuredPurposeInput';
import SubscriptionList from './components/SubscriptionList';
import TimeSeriesChart from './components/TimeSeriesChart';
import TradeConfirmationModal from './components/TradeConfirmationModal';
import TransactionFilter from './components/TransactionFilter';
import TransactionList from './components/TransactionList';
import { TreasuryTransactionList } from './components/TreasuryTransactionList';
import TreasuryView from './components/TreasuryView';
import VentureCapitalDeskView from './components/VentureCapitalDeskView';
import VirtualAccountForm from './components/VirtualAccountForm';
import VirtualAccountsTable from './components/VirtualAccountsTable';
import WebhookSimulator from './components/WebhookSimulator';

// --- FIXED Wrapper Components (Moved outside SAppLayout) ---
type WrapperProps = {
  Component: React.FC<any>;
  props?: any;
};

const Wrapper: React.FC<WrapperProps> = ({ Component, props = {} }) => {
  return <Component {...props} />;
};

const ModalWrapper: React.FC<WrapperProps> = ({ Component, props = {} }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Component
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      {...props}
    />
  );
};

const DataContextWrapper: React.FC<{ Component: React.FC<any>; extraProps?: any }> = ({ Component, extraProps = {} }) => {
  const dataContext = useContext(DataContext);
  const mockContext = {
    setActiveView: () => {},
    impactData: { treesPlanted: 0, progressToNextTree: 0 },
  };
  const props = { ...(dataContext || mockContext), ...extraProps };
  return <Component {...props} />;
};

const AIIntentStub: React.FC<{ view: string }> = ({ view }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6 animate-in fade-in duration-700 bg-gray-950/50 rounded-3xl border border-gray-800">
      <div className="w-24 h-24 bg-cyan-600/10 rounded-full flex items-center justify-center border border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.1)]">
        <Sparkles className="text-cyan-400 w-12 h-12 animate-pulse" />
      </div>
      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic font-mono">
          Module Ingress: {view.replace(/-/g, '_').toUpperCase()}
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed font-mono">
          The Sovereign AI Core is compiling the high-frequency logic for this specific subsystem. Targeting zero-latency node deployment in the next epoch.
        </p>
      </div>
      <div className="flex gap-4">
        <div className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl flex items-center gap-2 text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
          <Terminal size={14} /> STATUS: COMPILING_INTENT
        </div>
        <div className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl flex items-center gap-2 text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
          <ShieldAlert size={14} /> AUTH: VERIFIED
        </div>
      </div>
    </div>
  );
};

// --- VIEW REGISTRY FOR DYNAMIC ROUTING ---

interface ViewConfig {
  path: string;
  Component: React.FC<any>;
  wrapper?: 'Wrapper' | 'ModalWrapper' | 'DataContextWrapper' | 'None';
  props?: Record<string, any>;
  // The original View enum name (used for Sidebar/Context synchronization)
  viewName: string; 
}

const viewRegistry: ViewConfig[] = [
  // Direct Views (wrapper: 'None')
  { viewName: 'Dashboard', path: '/dashboard', Component: Dashboard, wrapper: 'None' },
  { viewName: 'Transactions', path: '/transactions', Component: TransactionsView, wrapper: 'None' },
  { viewName: 'SendMoney', path: '/send-money', Component: SendMoneyView, wrapper: 'None' },
  { viewName: 'Budgets', path: '/budgets', Component: BudgetsView, wrapper: 'None' },
  { viewName: 'FinancialGoals', path: '/financial-goals', Component: FinancialGoalsView, wrapper: 'None' },
  { viewName: 'CreditHealth', path: '/credit-health', Component: CreditHealthView, wrapper: 'None' },
  { viewName: 'Personalization', path: '/personalization', Component: PersonalizationView, wrapper: 'None' },
  { viewName: 'Accounts', path: '/accounts', Component: AccountsView, wrapper: 'None' },
  { viewName: 'Investments', path: '/personal/investments', Component: InvestmentsView, wrapper: 'None' }, // Dynamic Path Example
  { viewName: 'CryptoWeb3', path: '/crypto-web3', Component: CryptoView, wrapper: 'None' },
  { viewName: 'AlgoTradingLab', path: '/blueprints/zeitgeist', Component: AlgoTradingLab, wrapper: 'None' }, // Dynamic Path Example
  { viewName: 'ForexArena', path: '/forex-arena', Component: ForexArena, wrapper: 'None' },
  { viewName: 'CommoditiesExchange', path: '/commodities-exchange', Component: CommoditiesExchange, wrapper: 'None' },
  { viewName: 'RealEstateEmpire', path: '/real-estate-empire', Component: RealEstateEmpire, wrapper: 'None' },
  { viewName: 'ArtCollectibles', path: '/art-collectibles', Component: ArtCollectibles, wrapper: 'None' },
  { viewName: 'DerivativesDesk', path: '/derivatives-desk', Component: DerivativesDesk, wrapper: 'None' },
  { viewName: 'VentureCapital', path: '/venture-capital', Component: VentureCapitalDesk, wrapper: 'None' },
  { viewName: 'PrivateEquity', path: '/private-equity', Component: PrivateEquityLounge, wrapper: 'None' },
  { viewName: 'TaxOptimization', path: '/tax-optimization', Component: TaxOptimizationChamber, wrapper: 'None' },
  { viewName: 'LegacyBuilder', path: '/legacy-builder', Component: LegacyBuilder, wrapper: 'None' },
  { viewName: 'CorporateCommand', path: '/corporate-command', Component: CorporateCommandView, wrapper: 'None' },
  { viewName: 'ModernTreasury', path: '/modern-treasury', Component: ModernTreasuryView, wrapper: 'None' },
  { viewName: 'OpenBanking', path: '/open-banking', Component: OpenBankingView, wrapper: 'None' },
  { viewName: 'FinancialDemocracy', path: '/financial-democracy', Component: FinancialDemocracyView, wrapper: 'None' },
  { viewName: 'AIAdStudio', path: '/ai-ad-studio', Component: AIAdStudioView, wrapper: 'None' },
  { viewName: 'QuantumWeaver', path: '/quantum-weaver', Component: QuantumWeaverView, wrapper: 'None' },
  { viewName: 'AgentMarketplace', path: '/agent-marketplace', Component: AgentMarketplaceView, wrapper: 'None' },
  { viewName: 'APIStatus', path: '/api-status', Component: APIIntegrationView, wrapper: 'None' },
  { viewName: 'Settings', path: '/settings', Component: SettingsView, wrapper: 'None' },
  { viewName: 'QuantumAssets', path: '/quantum-assets', Component: QuantumAssets, wrapper: 'None' },
  { viewName: 'SovereignWealth', path: '/sovereign-wealth', Component: SovereignWealth, wrapper: 'None' },
  { viewName: 'Philanthropy', path: '/philanthropy', Component: PhilanthropyHub, wrapper: 'None' },
  { viewName: 'TheVision', path: '/the-vision', Component: TheVisionView, wrapper: 'None' },
  { viewName: 'AIAdvisor', path: '/ai-advisor', Component: AIAdvisorView, wrapper: 'None' },
  { viewName: 'AIInsights', path: '/ai-insights', Component: AIInsights, wrapper: 'None' },
  { viewName: 'SecurityCenter', path: '/security-center', Component: SecurityView, wrapper: 'None' },
  { viewName: 'ComplianceOracle', path: '/compliance-oracle', Component: ComplianceOracleView, wrapper: 'None' },
  { viewName: 'GlobalPositionMap', path: '/global-position-map', Component: GlobalPositionMap, wrapper: 'None' },
  { viewName: 'GlobalSsiHub', path: '/global-ssi-hub', Component: GlobalSsiHubView, wrapper: 'None' },
  { viewName: 'CustomerDashboard', path: '/customer-dashboard', Component: CustomerDashboard, wrapper: 'None' },
  { viewName: 'FinancialReporting', path: '/financial-reporting', Component: FinancialReportingView, wrapper: 'None' },
  { viewName: 'StripeNexusDashboard', path: '/stripe-nexus-dashboard', Component: StripeNexusDashboard, wrapper: 'None' },
  { viewName: 'TheBook', path: '/book', Component: TheBookView, wrapper: 'None' }, // Dynamic Path Example
  { viewName: 'KnowledgeBase', path: '/knowledge-base', Component: KnowledgeBaseView, wrapper: 'None' },
  { viewName: 'CitibankAccounts', path: '/citibank/accounts', Component: CitibankAccountsView, wrapper: 'None' },
  { viewName: 'CitibankAccountProxy', path: '/citibank/account-proxy', Component: CitibankAccountProxyView, wrapper: 'None' },
  { viewName: 'CitibankBillPay', path: '/citibank/bill-pay', Component: CitibankBillPayView, wrapper: 'None' },
  { viewName: 'CitibankCrossBorder', path: '/citibank/cross-border', Component: CitibankCrossBorderView, wrapper: 'None' },
  { viewName: 'CitibankPayeeManagement', path: '/citibank/payee-management', Component: CitibankPayeeManagementView, wrapper: 'None' },
  { viewName: 'CitibankStandingInstructions', path: '/citibank/standing-instructions', Component: CitibankStandingInstructionsView, wrapper: 'None' },
  { viewName: 'CitibankDeveloperTools', path: '/citibank/developer-tools', Component: CitibankDeveloperToolsView, wrapper: 'None' },
  { viewName: 'CitibankEligibility', path: '/citibank/eligibility', Component: CitibankEligibilityView, wrapper: 'None' },
  { viewName: 'PlaidMainDashboard', path: '/plaid/main', Component: PlaidMainDashboard, wrapper: 'None' },
  { viewName: 'PlaidIdentity', path: '/plaid/identity', Component: PlaidIdentityView, wrapper: 'None' },
  { viewName: 'PlaidCRAMonitoring', path: '/plaid/cra-monitoring', Component: PlaidCRAMonitoringView, wrapper: 'None' },
  { viewName: 'StripeNexus', path: '/stripe/nexus', Component: StripeNexusView, wrapper: 'None' },
  { viewName: 'CounterpartyDashboard', path: '/counterparty/dashboard', Component: CounterpartyDashboardView, wrapper: 'None' },
  { viewName: 'VirtualAccounts', path: '/virtual-accounts/dashboard', Component: VirtualAccountsDashboard, wrapper: 'None' },
  { viewName: 'SApp', path: '/app-root', Component: SApp, wrapper: 'None' },
  { viewName: 'CorporateActions', path: '/corporate-actions', Component: CorporateActionsNexusView, wrapper: 'None' },
  { viewName: 'CreditNoteLedger', path: '/credit-note-ledger', Component: CreditNoteLedger, wrapper: 'None' },
  { viewName: 'ReconciliationHub', path: '/reconciliation-hub', Component: ReconciliationHubView, wrapper: 'None' },
  { viewName: 'GEINDashboard', path: '/gein-dashboard', Component: GEINDashboard, wrapper: 'None' },
  { viewName: 'CardholderManagement', path: '/cardholder-management', Component: CardholderManagement, wrapper: 'None' },
  { viewName: 'SecurityCompliance', path: '/security-compliance', Component: SecurityComplianceView, wrapper: 'None' },
  { viewName: 'DeveloperHub', path: '/developer-hub', Component: DeveloperHubView, wrapper: 'None' },
  { viewName: 'ApiPlayground', path: '/api-playground', Component: ApiPlaygroundView, wrapper: 'None' },
  { viewName: 'TreasuryView', path: '/treasury', Component: TreasuryView, wrapper: 'None' },
  { viewName: 'VentureCapitalDeskView', path: '/venture-capital-desk-view', Component: VentureCapitalDeskView, wrapper: 'None' },
  { viewName: 'AICommandLog', path: '/ai-command-log', Component: AICommandLog, wrapper: 'None' },
  { viewName: 'AIPredictionWidget', path: '/ai-prediction-widget', Component: AIPredictionWidget, wrapper: 'None' },
  { viewName: 'AutomatedSweepRules', path: '/automated-sweep-rules', Component: AutomatedSweepRules, wrapper: 'None' },
  { viewName: 'ChargeList', path: '/charge-list', Component: ChargeList, wrapper: 'None' },
  { viewName: 'EarlyFraudWarningFeed', path: '/early-fraud-warning-feed', Component: EarlyFraudWarningFeed, wrapper: 'None' },
  { viewName: 'ExpectedPaymentsTable', path: '/expected-payments-table', Component: ExpectedPaymentsTable, wrapper: 'None' },
  { viewName: 'IncomingPaymentDetailList', path: '/incoming-payment-detail-list', Component: IncomingPaymentDetailList, wrapper: 'None' },
  { viewName: 'PaymentInitiationForm', path: '/payment-initiation-form', Component: PaymentInitiationForm, wrapper: 'None' },
  { viewName: 'PayoutsDashboard', path: '/payouts-dashboard', Component: PayoutsDashboard, wrapper: 'None' },
  { viewName: 'RefundForm', path: '/refund-form', Component: RefundForm, wrapper: 'None' },
  { viewName: 'ReportingView', path: '/reporting-view', Component: ReportingView, wrapper: 'None' },
  { viewName: 'ReportRunGenerator', path: '/report-run-generator', Component: ReportRunGenerator, wrapper: 'None' },

  // DataContextWrapper Views
  { viewName: 'VoiceControl', path: '/voice-control', Component: VoiceControl, wrapper: 'DataContextWrapper' },

  // Wrapper Views (requiring specific props/instantiation)
  { viewName: 'VerificationReports', path: '/verification-reports', Component: VerificationReportsView, wrapper: 'Wrapper', props: { customerId: 'c1' } },
  { viewName: 'CitibankUnmaskedData', path: '/citibank/unmasked-data', Component: CitibankUnmaskedDataView, wrapper: 'Wrapper', props: { accountIdsToUnmask: ['acc_1'] } },
  { viewName: 'PlaidInstitutions', path: '/plaid/institutions', Component: PlaidInstitutionsExplorer, wrapper: 'Wrapper', props: { client: new PlaidClient() } },
  { viewName: 'PlaidItemManagement', path: '/plaid/item-management', Component: PlaidItemManagementView, wrapper: 'Wrapper', props: { accessToken: 'mock_token' } },
  { viewName: 'SchemaExplorer', path: '/schema-explorer', Component: SchemaExplorer, wrapper: 'Wrapper', props: { schemaData: { definitions: {}, properties: {} } } },
  { viewName: 'ResourceGraph', path: '/resource-graph', Component: ResourceGraphView, wrapper: 'Wrapper', props: {} },
  
  // Complex Wrapper Views (using the original Wrapper component)
  { viewName: 'AccountDetails', path: '/account-details', Component: AccountDetails, wrapper: 'Wrapper', props: { accountId: '1', customerId: 'c1' } },
  { viewName: 'AccountList', path: '/account-list', Component: AccountList, wrapper: 'Wrapper', props: { accounts: [] } },
  { viewName: 'AccountStatementGrid', path: '/account-statement-grid', Component: AccountStatementGrid, wrapper: 'Wrapper', props: { statementLines: [] } },
  { viewName: 'ACHDetailsDisplay', path: '/ach-details-display', Component: ACHDetailsDisplay, wrapper: 'Wrapper', props: { details: { routingNumber: '123', realAccountNumber: '456' } } },
  { viewName: 'AssetCatalog', path: '/asset-catalog', Component: AssetCatalog, wrapper: 'Wrapper', props: { assets: [], onAssetSelected: () => {}, getAssetDetails: async () => ({}) } },
  { viewName: 'BalanceReportChart', path: '/balance-report-chart', Component: BalanceReportChart, wrapper: 'Wrapper', props: { data: [] } },
  { viewName: 'BalanceTransactionTable', path: '/balance-transaction-table', Component: BalanceTransactionTable, wrapper: 'Wrapper', props: { balanceTransactions: [] } },
  { viewName: 'CardDesignVisualizer', path: '/card-design-visualizer', Component: CardDesignVisualizer, wrapper: 'Wrapper', props: { design: { id: 'd_1', physical_bundle: { features: {} } } }} ,
  { viewName: 'ConductorConfiguration', path: '/conductor-configuration', Component: ConductorConfigurationView, wrapper: 'Wrapper', props: {} },
  { viewName: 'CounterpartyDetails', path: '/counterparty-details', Component: CounterpartyDetails, wrapper: 'Wrapper', props: { counterpartyId: 'cp_1' } },
  { viewName: 'CounterpartyForm', path: '/counterparty-form', Component: CounterpartyForm, wrapper: 'Wrapper', props: { counterparties: [], onSubmit: () => {}, onCancel: () => {} } },
  { viewName: 'DisruptionIndexMeter', path: '/disruption-index-meter', Component: DisruptionIndexMeter, wrapper: 'Wrapper', props: { indexValue: 50 } },
  { viewName: 'DocumentUploader', path: '/document-uploader', Component: DocumentUploader, wrapper: 'Wrapper', props: { documentableType: 'test', documentableId: '1' } },
  { viewName: 'DownloadLink', path: '/download-link', Component: DownloadLink, wrapper: 'Wrapper', props: { url: '#', filename: 'test.pdf' } },
  { viewName: 'ElectionChoiceForm', path: '/election-choice-form', Component: ElectionChoiceForm, wrapper: 'Wrapper', props: { availableChoices: {}, onSubmit: () => {}, onCancel: () => {} } },
  { viewName: 'EventNotificationCard', path: '/event-notification-card', Component: EventNotificationCard, wrapper: 'Wrapper', props: { event: {} } },
  { viewName: 'ExternalAccountCard', path: '/external-account-card', Component: ExternalAccountCard, wrapper: 'Wrapper', props: { account: {id: '1', account_details: [], routing_details: []}} },
  { viewName: 'ExternalAccountForm', path: '/external-account-form', Component: ExternalAccountForm, wrapper: 'Wrapper', props: { counterparties: [], onSubmit: () => {}, onCancel: () => {} } },
  { viewName: 'ExternalAccountsTable', path: '/external-accounts-table', Component: ExternalAccountTable, wrapper: 'Wrapper', props: { accounts: [] } },
  { viewName: 'FinancialAccountCard', path: '/financial-account-card', Component: FinancialAccountCard, wrapper: 'Wrapper', props: { financialAccount: {id: 'fa_1', balance: { cash: {}}, supported_currencies: []}} },
  { viewName: 'InvoiceFinancingRequest', path: '/invoice-financing-request', Component: InvoiceFinancingRequest, wrapper: 'Wrapper', props: { onSubmit: () => {} } },
  { viewName: 'PaymentMethodDetails', path: '/payment-method-details', Component: PaymentMethodDetails, wrapper: 'Wrapper', props: { details: { type: 'card', card: {} }}} },
  { viewName: 'PaymentOrderForm', path: '/payment-order-form', Component: PaymentOrderForm, wrapper: 'Wrapper', props: { internalAccounts: [], externalAccounts: [], onSubmit: () => {}, onCancel: () => {} } },
  { viewName: 'PnLChart', path: '/pnl-chart', Component: PnLChart, wrapper: 'Wrapper', props: { data: [], algorithmName: 'Test' } },
  { viewName: 'RemittanceInfoEditor', path: '/remittance-info-editor', Component: RemittanceInfoEditor, wrapper: 'Wrapper', props: { onChange: () => {} } },
  { viewName: 'ReportStatusIndicator', path: '/report-status-indicator', Component: ReportStatusIndicator, wrapper: 'Wrapper', props: { status: 'success' } },
  { viewName: 'SsiEditorForm', path: '/ssi-editor-form', Component: SsiEditorForm, wrapper: 'Wrapper', props: { onSubmit: () => {}, onCancel: () => {} } },
  { viewName: 'StripeStatusBadge', path: '/stripe-status-badge', Component: StripeStatusBadge, wrapper: 'Wrapper', props: { status: 'succeeded', objectType: 'charge' } },
  { viewName: 'StructuredPurposeInput', path: '/structured-purpose-input', Component: StructuredPurposeInput, wrapper: 'Wrapper', props: { onChange: () => {}, value: null } },
  { viewName: 'SubscriptionList', path: '/subscription-list', Component: SubscriptionList, wrapper: 'Wrapper', props: { subscriptions: [] } },
  { viewName: 'TimeSeriesChart', path: '/time-series-chart', Component: TimeSeriesChart, wrapper: 'Wrapper', props: { data: { labels: [], datasets: [] } } },
  { viewName: 'TransactionFilter', path: '/transaction-filter', Component: TransactionFilter, wrapper: 'Wrapper', props: { onApplyFilters: () => {} } },
  { viewName: 'TransactionList', path: '/transaction-list', Component: TransactionList, wrapper: 'Wrapper', props: { transactions: [] } },
  { viewName: 'TreasuryTransactionList', path: '/treasury-transaction-list', Component: TreasuryTransactionList, wrapper: 'Wrapper', props: { transactions: [] } },
  { viewName: 'UniversalObjectInspector', path: '/universal-object-inspector', Component: UniversalObjectInspector, wrapper: 'Wrapper', props: { data: { status: "Nominal", uptime: "99.999%", load: "Balanced" } } },
  { viewName: 'VirtualAccountForm', path: '/virtual-account-form', Component: VirtualAccountForm, wrapper: 'Wrapper', props: { onSubmit: () => {}, isSubmitting: false } },
  { viewName: 'VirtualAccountsTable', path: '/virtual-accounts-table', Component: VirtualAccountsTable, wrapper: 'Wrapper', props: { onEdit: () => {}, onDelete: () => {} } },
  { viewName: 'WebhookSimulator', path: '/webhook-simulator', Component: WebhookSimulator, wrapper: 'Wrapper', props: { stripeAccountId: 'acct_mock' } },
  
  // Modal Wrapper Views
  { viewName: 'AccountVerificationModal', path: '/account-verification-modal', Component: AccountVerificationModal, wrapper: 'ModalWrapper', props: { externalAccount: {id: '1', verification_status: 'unverified' }, onSuccess: () => {}} },
  { viewName: 'ChargeDetailModal', path: '/charge-detail-modal', Component: ChargeDetailModal, wrapper: 'ModalWrapper', props: { charge: {id: 'ch_1', amount: 50000, currency: 'USD', status: 'succeeded'}, onClose: () => {}} },
  { viewName: 'TradeConfirmationModal', path: '/trade-confirmation-modal', Component: TradeConfirmationModal, wrapper: 'ModalWrapper', props: { settlementInstruction: { messageId: 'NEX-INST-99281-Z', totalAmount: 12500000, currency: 'USD', creationDateTime: Date.now(), settlementDate: '2024-12-15', numberOfTransactions: 1, purpose: 'TREA' } } },
];

// --- DYNAMIC VIEW RENDERER ---

const DynamicViewRenderer: React.FC<{ config: ViewConfig }> = ({ config }) => {
  const { Component, wrapper, props, viewName } = config;
  const dataContext = useContext(DataContext);
  
  // Replicate complex prop injection logic from the original switch statement
  if (wrapper === 'DataContextWrapper') {
    return <DataContextWrapper Component={Component} extraProps={props} />;
  }
  if (wrapper === 'ModalWrapper') {
    return <ModalWrapper Component={Component} props={props} />;
  }
  if (wrapper === 'Wrapper') {
    // Handle specific component instantiation if needed, otherwise use generic wrapper
    if (viewName === 'PlaidInstitutions') {
        return <Wrapper Component={PlaidInstitutionsExplorer} props={{ client: new PlaidClient() }} />;
    }
    if (viewName === 'PlaidItemManagement') {
        return <Wrapper Component={PlaidItemManagementView} props={{ accessToken: 'mock_token' }} />;
    }
    if (viewName === 'CitibankUnmaskedData') {
        return <Wrapper Component={CitibankUnmaskedDataView} props={{ accountIdsToUnmask: ['acc_1'] }} />;
    }
    if (viewName === 'VerificationReports') {
        return <Wrapper Component={VerificationReportsView} props={{ customerId: 'c1' }} />;
    }
    if (viewName === 'SchemaExplorer') {
        return <Wrapper Component={SchemaExplorer} props={{ schemaData: { definitions: {}, properties: {} } }} />;
    }
    return <Wrapper Component={Component} props={props} />;
  }
  
  // Handle views that require specific context setters (like CorporateCommandView)
  if (viewName === 'CorporateCommand') {
      return <CorporateCommandView setActiveView={dataContext?.setActiveView || (() => {})} />;
  }
  
  // Default rendering for simple components
  return <Component {...props} />;
};


// --- SAPP LAYOUT (Authenticated Wrapper) ---

const SAppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dataContext = useContext(DataContext);
  const authContext = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    datadogLogs.logger.info('App View Loaded', { name: 'SovereignNexus', id: 'init_view' });
  }, []);

  // Sync URL path to activeView context for sidebar highlighting
  useEffect(() => {
    if (dataContext && dataContext.setActiveView) {
        const currentPath = location.pathname;
        // Find the view name corresponding to the current path (handling nested paths)
        const matchedView = viewRegistry.find(v => currentPath.endsWith(v.path));
        
        if (matchedView) {
            // Set the active view using the original viewName (e.g., 'Dashboard')
            dataContext.setActiveView(matchedView.viewName as View); 
        } else {
            // Fallback for unknown routes or the root of the layout
            dataContext.setActiveView('Unknown' as View); 
        }
    }
  }, [location.pathname, dataContext]);


  if (!dataContext || !authContext) return null;
  const { isAuthenticated, isLoading: authLoading } = authContext;
  const { isLoading: dataLoading } = dataContext;

  if (authLoading || (isAuthenticated && dataLoading)) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-black text-white gap-6">
        <Cpu className="w-20 h-20 text-cyan-400 animate-pulse" />
        <h1 className="text-3xl font-black tracking-[0.2em] italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 uppercase font-mono">
          Nexus OS // Syncing
        </h1>
        <div className="w-80 h-1 bg-gray-900 rounded-full overflow-hidden">
          <div className="h-full bg-cyan-500 animate-progress-flow"></div>
        </div>
        <style>{`
          @keyframes flow { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
          .animate-progress-flow { animation: flow 2s linear infinite; width: 50%; }
        `}</style>
      </div>
    );
  }

  // If SAppLayout is reached, but the user is not authenticated (which shouldn't happen if RootRedirect works), redirect them.
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="relative flex flex-col flex-1 min-h-0">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-10 custom-scrollbar bg-[radial-gradient(circle_at_50%_0%,#111,transparent)]">
          <div className="max-w-[1600px] mx-auto h-full min-h-0">
            <Outlet /> {/* Dynamic content rendered here */}
          </div>
        </main>
        <MonetizationOverlay />
        <Link 
          to="/modules"
          className="fixed bottom-6 left-6 z-50 w-12 h-12 bg-gray-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-full flex items-center justify-center text-cyan-400 hover:bg-cyan-500/20 hover:scale-110 transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.2)] group"
          title="Open AI Nexus"
        >
          <Grid size={20} className="group-hover:animate-spin-slow" />
        </Link>
      </div>
    </div>
  );
};

// (MonetizationOverlay and ExternalIframeCollection remain unchanged)
const MonetizationOverlay = () => {
  const context = useContext(DataContext);
  if (!context) return null;
  const { sovereignCredits } = context;
  return (
    <div className="fixed bottom-6 right-6 z-50 px-5 py-3 bg-black/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl flex items-center gap-4 shadow-[0_0_40px_rgba(6,182,212,0.15)]">
      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Sovereign Balance:</span>
      <span className="text-cyan-400 font-mono text-lg font-bold tracking-tighter">
        {sovereignCredits.toLocaleString()} SC
      </span>
    </div>
  );
};

const AI_MODULES = [
  "https://admin08077-openapi.hf.space",
  "https://admin08077-ai-banking-sovereign.static.hf.space",
  "https://admin08077-aibanke.static.hf.space",
  "https://admin08077-citibank-demo-business-inc-ai-ban-king-demo.static.hf.space",
  "https://admin08077-1233.static.hf.space",
  "https://admin08077-inventions.static.hf.space",
  "https://admin08077-gemini-app-citibank-demo-business-inc-google.static.hf.space",
  "https://admin08077-aibankdemo2.static.hf.space",
  "https://admin08077-airenderer.static.hf.space",
  "https://admin08077-book.static.hf.space",
  "https://admin08077-merrychristmas.static.hf.space",
  "https://admin08077-apiai.static.hf.space",
  "https://admin08077-projectatlas.static.hf.space",
  "https://admin08077-jocall3.static.hf.space",
  "https://admin08077-demob.static.hf.space",
  "https://admin08077-aibanke.static.hf.space",
  "https://admin08077-ai-banking-sovereign.static.hf.space",
  "https://admin08077-static.static.hf.space",
  "https://admin08077-demoo.static.hf.space",
  "https://admin08077-webgenai.static.hf.space",
  "https://admin08077-aiab.static.hf.space",
  "https://admin08077-citibank-demo-business-inc-app.static.hf.space",
  "https://admin08077-aib8nking.static.hf.space",
  "https://admin08077-bb.static.hf.space",
  "https://admin08077-citibank-demo-business-inc-apps.static.hf.space",
  "https://admin08077-newwa.static.hf.space",
  "https://admin08077-jamesocallaghanprivatebank.hf.space",
  "https://admin08077-drip-faucet.static.hf.space",
  "https://admin08077-transactpro.hf.space",
  "https://admin08077-quantumbank.hf.space",
  "https://admin08077-test.hf.space"
];

const getModuleTitle = (url: string) => {
  try {
    const urlObj = new URL(url);
    let hostname = urlObj.hostname;
    // Remove .hf.space or .static.hf.space
    hostname = hostname.replace('.static.hf.space', '').replace('.hf.space', '');
    // Remove admin08077- prefix
    hostname = hostname.replace(/^admin\d+-/, '');
    // Replace hyphens with spaces
    const title = hostname.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return title || 'AI Module';
  } catch (e) {
    return 'AI Module';
  }
};

const AIModuleCard = ({ url, className }: { url: string; className?: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const title = getModuleTitle(url);

  return (
    <div className={`flex flex-col w-full bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all duration-300 shadow-lg hover:shadow-cyan-500/10 group ${className || 'h-[500px]'}`}>
      <div className="px-4 py-3 border-b border-gray-800 bg-gray-950 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <span className="text-sm font-mono font-bold text-gray-300 group-hover:text-cyan-400 transition-colors truncate max-w-[300px]">
            {title}
          </span>
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-600 hover:text-white transition-colors">
          <ExternalLink size={14} />
        </a>
      </div>
      <div className="relative flex-1 bg-black">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-900/20 backdrop-blur-sm">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <iframe
          src={url}
          className="w-full h-full border-0"
          onLoad={() => setIsLoading(false)}
          title={title}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </div>
  );
};

const ExternalIframeCollection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % AI_MODULES.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + AI_MODULES.length) % AI_MODULES.length);
  };

  return (
    <div className="flex h-screen bg-[#050505] overflow-hidden">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full'} transition-all duration-300 border-r border-gray-800 bg-gray-950 flex flex-col fixed md:relative z-20 h-full`}>
        <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-950">
          <div className="flex items-center gap-2">
            <Terminal size={16} className="text-cyan-400" />
            <span className="font-mono font-bold text-gray-200 tracking-wider">MODULES</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="text-gray-500 hover:text-white">
            <ArrowLeft size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
          {AI_MODULES.map((url, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-full text-left px-4 py-3 rounded-lg text-xs font-mono transition-all duration-200 flex items-center gap-3 ${
                activeIndex === index
                  ? 'bg-cyan-900/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                  : 'text-gray-500 hover:bg-gray-900 hover:text-gray-300 border border-transparent'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${activeIndex === index ? 'bg-cyan-400 animate-pulse' : 'bg-gray-700'}`} />
              <span className="truncate">{getModuleTitle(url)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-black relative">
        {/* Top Bar */}
        <div className="h-16 border-b border-gray-800 bg-gray-950/50 backdrop-blur-xl flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors">
                <Terminal size={20} />
              </button>
            )}
            <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
              <div className="p-1.5 rounded-md bg-gray-900 group-hover:bg-gray-800 border border-gray-800 group-hover:border-gray-700">
                <ArrowLeft size={14} />
              </div>
              <span className="text-xs font-mono tracking-widest">RETURN TO OS</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="px-3 py-1 rounded-full bg-gray-900 border border-gray-800 text-[10px] font-mono text-gray-400">
               MODULE {activeIndex + 1} / {AI_MODULES.length}
             </div>
          </div>
        </div>

        {/* Card Area */}
        <div className="flex-1 p-6 md:p-10 flex flex-col items-center justify-center overflow-hidden relative">
           {/* Navigation Buttons (Desktop) */}
           <button 
             onClick={handlePrev}
             className="absolute left-6 z-10 p-4 rounded-full bg-black/50 backdrop-blur border border-gray-800 text-gray-400 hover:text-white hover:border-cyan-500/50 hover:bg-cyan-950/30 transition-all duration-300 group hidden md:flex"
           >
             <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
           </button>

           <button 
             onClick={handleNext}
             className="absolute right-6 z-10 p-4 rounded-full bg-black/50 backdrop-blur border border-gray-800 text-gray-400 hover:text-white hover:border-cyan-500/50 hover:bg-cyan-950/30 transition-all duration-300 group hidden md:flex"
           >
             <ArrowLeft size={24} className="rotate-180 group-hover:translate-x-1 transition-transform" />
           </button>

           {/* The Card */}
           <div className="w-full h-full max-w-[1400px] relative flex flex-col">
             <div className="flex-1 relative animate-in fade-in zoom-in-95 duration-500">
               <AIModuleCard 
                 key={activeIndex} 
                 url={AI_MODULES[activeIndex]} 
                 className="h-full shadow-[0_0_50px_rgba(0,0,0,0.5)] border-gray-800" 
               />
             </div>
             
             {/* Mobile Nav */}
             <div className="flex md:hidden items-center justify-between mt-4 gap-4">
               <button onClick={handlePrev} className="flex-1 py-3 bg-gray-900 rounded-xl border border-gray-800 text-gray-400">Prev</button>
               <button onClick={handleNext} className="flex-1 py-3 bg-gray-900 rounded-xl border border-gray-800 text-gray-400">Next</button>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- CRITICAL FIX: Conditional Root Path Handler ---
const RootRedirect = () => {
  const authContext = useContext(AuthContext);
  
  if (!authContext) {
    // Should not happen if contexts are wrapped correctly, but fallback to LandingPage
    return <LandingPage />; 
  }
  
  const { isAuthenticated, isLoading } = authContext;

  if (isLoading) {
    // Use the same loading screen as SAppLayout for consistency during initial check
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-black text-white gap-6">
        <Cpu className="w-20 h-20 text-cyan-400 animate-pulse" />
        <h1 className="text-3xl font-black tracking-[0.2em] italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 uppercase font-mono">
          Nexus OS // Syncing
        </h1>
        <div className="w-80 h-1 bg-gray-900 rounded-full overflow-hidden">
          <div className="h-full bg-cyan-500 animate-progress-flow"></div>
        </div>
        <style>{`
          @keyframes flow { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
          .animate-progress-flow { animation: flow 2s linear infinite; width: 50%; }
        `}</style>
      </div>
    );
  }

  // If authenticated, redirect to the main application dashboard
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />;
};
// ---------------------------------------------------


const theme = createTheme({ palette: { mode: 'dark' } });

function App() {
  return (
    <Auth0Provider
      domain="aibankinguniversity.us.auth0.com"
      clientId="fOkKYLJUrLnv7hInn8CVi3cHpjF7xPRp"
      authorizationParams={{ redirect_uri: window.location.origin }}
    >
      <AuthProvider>
        <DataProvider>
          <MoneyMovementProvider>
            <StripeDataProvider>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <Router>
                  <Routes>
                    {/* 1. Root Path Handling (FIXED: Conditional Redirect) */}
                    <Route path="/" element={<RootRedirect />} />
                    
                    {/* Non-authenticated routes */}
                    <Route path="/login" element={<LoginView />} />
                    <Route path="/modules" element={<ExternalIframeCollection />} />
                    
                    {/* 2. Authenticated Layout (SAppLayout/Jellyfish Theme) */}
                    {/* This route acts as a wrapper for all authenticated paths starting with / */}
                    <Route path="/" element={<SAppLayout />}>
                      
                      {/* 
                        NOTE: The index route is removed here because RootRedirect handles the exact path "/".
                        If a user navigates to an authenticated path (e.g., /transactions), SAppLayout loads, 
                        and the corresponding DynamicViewRenderer is shown.
                        If a user navigates to /, RootRedirect redirects them to /dashboard.
                      */}
                      
                      {/* 3. Dynamic Routing based on viewRegistry */}
                      {viewRegistry.map(config => (
                        <Route 
                          key={config.path} 
                          // Remove leading slash for nested routes under the parent route
                          path={config.path.replace(/^\//, '')} 
                          element={<DynamicViewRenderer config={config} />} 
                        />
                      ))}
                      
                      {/* Catch-all for unknown authenticated routes */}
                      <Route path="*" element={<AIIntentStub view="404_NOT_FOUND" />} />
                    </Route>
                  </Routes>
                </Router>
              </ThemeProvider>
            </StripeDataProvider>
          </MoneyMovementProvider>
        </DataProvider>
      </AuthProvider>
      <Analytics />
    </Auth0Provider>
  );
}

export default App;