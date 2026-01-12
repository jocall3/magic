import React, { useState, useContext, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Cpu, ShieldAlert, Sparkles, Terminal } from 'lucide-react';
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
import { View } from './types';

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

// --- FIXED Wrapper Components ---
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

const AIIntentStub: React.FC<{ view: View }> = ({ view }) => {
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

const SAppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dataContext = useContext(DataContext);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    datadogLogs.logger.info('App View Loaded', { name: 'SovereignNexus', id: 'init_view' });
  }, []);

  if (!dataContext || !authContext) return null;
  const { isAuthenticated, isLoading: authLoading } = authContext;
  const { isLoading: dataLoading, activeView, setActiveView } = dataContext;

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

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const renderView = () => {
    switch (activeView) {
      case View.Dashboard: return <Dashboard />;
      case View.Transactions: return <TransactionsView />;
      case View.SendMoney: return <SendMoneyView />;
      case View.Budgets: return <BudgetsView />;
      case View.FinancialGoals: return <FinancialGoalsView />;
      case View.CreditHealth: return <CreditHealthView />;
      case View.Personalization: return <PersonalizationView />;
      case View.Accounts: return <AccountsView />;
      case View.Investments: return <InvestmentsView />;
      case View.CryptoWeb3: return <CryptoView />;
      case View.AlgoTradingLab: return <AlgoTradingLab />;
      case View.ForexArena: return <ForexArena />;
      case View.CommoditiesExchange: return <CommoditiesExchange />;
      case View.RealEstateEmpire: return <RealEstateEmpire />;
      case View.ArtCollectibles: return <ArtCollectibles />;
      case View.DerivativesDesk: return <DerivativesDesk />;
      case View.VentureCapital: return <VentureCapitalDesk />;
      case View.PrivateEquity: return <PrivateEquityLounge />;
      case View.TaxOptimization: return <TaxOptimizationChamber />;
      case View.LegacyBuilder: return <LegacyBuilder />;
      case View.CorporateCommand: return <CorporateCommandView setActiveView={setActiveView} />;
      case View.ModernTreasury: return <ModernTreasuryView />;
      case View.OpenBanking: return <OpenBankingView />;
      case View.FinancialDemocracy: return <FinancialDemocracyView />;
      case View.AIAdStudio: return <AIAdStudioView />;
      case View.QuantumWeaver: return <QuantumWeaverView />;
      case View.AgentMarketplace: return <AgentMarketplaceView />;
      case View.APIStatus: return <APIIntegrationView />;
      case View.Settings: return <SettingsView />;
      case View.QuantumAssets: return <QuantumAssets />;
      case View.SovereignWealth: return <SovereignWealth />;
      case View.Philanthropy: return <PhilanthropyHub />;
      case View.TheVision: return <TheVisionView />;
      case View.AIAdvisor: return <AIAdvisorView />;
      case View.AIInsights: return <AIInsights />;
      case View.SecurityCenter: return <SecurityView />;
      case View.ComplianceOracle: return <ComplianceOracleView />;
      case View.GlobalPositionMap: return <GlobalPositionMap />;
      case View.GlobalSsiHub: return <GlobalSsiHubView />;
      case View.CustomerDashboard: return <CustomerDashboard />;
      case View.VerificationReports: return <VerificationReportsView customerId="c1" />;
      case View.FinancialReporting: return <FinancialReportingView />;
      case View.StripeNexusDashboard: return <StripeNexusDashboard />;
      case View.TheBook: return <TheBookView />;
      case View.KnowledgeBase: return <KnowledgeBaseView />;
      case View.CitibankAccounts: return <CitibankAccountsView />;
      case View.CitibankAccountProxy: return <CitibankAccountProxyView />;
      case View.CitibankBillPay: return <CitibankBillPayView />;
      case View.CitibankCrossBorder: return <CitibankCrossBorderView />;
      case View.CitibankPayeeManagement: return <CitibankPayeeManagementView />;
      case View.CitibankStandingInstructions: return <CitibankStandingInstructionsView />;
      case View.CitibankDeveloperTools: return <CitibankDeveloperToolsView />;
      case View.CitibankEligibility: return <CitibankEligibilityView />;
      case View.CitibankUnmaskedData: return <CitibankUnmaskedDataView accountIdsToUnmask={['acc_1']} />;
      case View.PlaidMainDashboard: return <PlaidMainDashboard />;
      case View.PlaidIdentity: return <PlaidIdentityView />;
      case View.PlaidCRAMonitoring: return <PlaidCRAMonitoringView />;
      case View.PlaidInstitutions: return <PlaidInstitutionsExplorer client={new PlaidClient()} />;
      case View.PlaidItemManagement: return <PlaidItemManagementView accessToken="mock_token" />;
      case View.StripeNexus: return <StripeNexusView />;
      case View.CounterpartyDashboard: return <CounterpartyDashboardView />;
      case View.VirtualAccounts: return <VirtualAccountsDashboard />;
      case View.SApp: return <SAPP />;
      case View.CorporateActions: return <CorporateActionsNexusView />;
      case View.CreditNoteLedger: return <CreditNoteLedger />;
      case View.ReconciliationHub: return <ReconciliationHubView />;
      case View.GEINDashboard: return <GEINDashboard />;
      case View.CardholderManagement: return <CardholderManagement />;
      case View.SecurityCompliance: return <SecurityComplianceView />;
      case View.DeveloperHub: return <DeveloperHubView />;
      case View.SchemaExplorer: return <SchemaExplorer schemaData={{ definitions: {}, properties: {} }} />;
      case View.ResourceGraph: return <ResourceGraphView />;
      case View.ApiPlayground: return <ApiPlaygroundView />;
      case View.VentureCapitalDeskView: return <VentureCapitalDeskView />;

      // --- Direct Component Access ---
      case View.AccountDetails: 
        return <Wrapper Component={AccountDetails} props={{ accountId: '1', customerId: 'c1' }} />;
      case View.AccountList: 
        return <Wrapper Component={AccountList} props={{ accounts: [] }} />;
      case View.AccountStatementGrid: 
        return <Wrapper Component={AccountStatementGrid} props={{ statementLines: [] }} />;
      case View.AccountVerificationModal: 
        return <ModalWrapper Component={AccountVerificationModal} props={{ externalAccount: {id: '1', verification_status: 'unverified' }, onSuccess: () => {}}} />;
      case View.ACHDetailsDisplay: 
        return <Wrapper Component={ACHDetailsDisplay} props={{ details: { routingNumber: '123', realAccountNumber: '456' } }} />;
      case View.AICommandLog: 
        return <AICommandLog />;
      case View.AIPredictionWidget: 
        return <AIPredictionWidget />;
      case View.AssetCatalog: 
        return <Wrapper Component={AssetCatalog} props={{ assets: [], onAssetSelected: () => {}, getAssetDetails: async () => ({}) }} />;
      case View.AutomatedSweepRules: 
        return <AutomatedSweepRules />;
      case View.BalanceReportChart: 
        return <Wrapper Component={BalanceReportChart} props={{ data: [] }} />;
      case View.BalanceTransactionTable: 
        return <Wrapper Component={BalanceTransactionTable} props={{ balanceTransactions: [] }} />;
      case View.CardDesignVisualizer: 
        return <Wrapper Component={CardDesignVisualizer} props={{ design: { id: 'd_1', physical_bundle: { features: {} } } }} />;
      case View.ChargeDetailModal: 
        return <ModalWrapper Component={ChargeDetailModal} props={{ charge: {id: 'ch_1', amount: 50000, currency: 'USD', status: 'succeeded'}, onClose: () => {}}} />;
      case View.ChargeList: 
        return <ChargeList />;
      case View.ConductorConfigurationView: 
        return <ConductorConfigurationView />;
      case View.CounterpartyDetails: 
        return <Wrapper Component={CounterpartyDetails} props={{ counterpartyId: 'cp_1' }} />;
      case View.CounterpartyForm: 
        return <Wrapper Component={CounterpartyForm} props={{ counterparties: [], onSubmit: () => {}, onCancel: () => {} }} />;
      case View.DisruptionIndexMeter: 
        return <Wrapper Component={DisruptionIndexMeter} props={{ indexValue: 50 }} />;
      case View.DocumentUploader: 
        return <Wrapper Component={DocumentUploader} props={{ documentableType: 'test', documentableId: '1' }} />;
      case View.DownloadLink: 
        return <Wrapper Component={DownloadLink} props={{ url: '#', filename: 'test.pdf' }} />;
      case View.EarlyFraudWarningFeed: 
        return <EarlyFraudWarningFeed />;
      case View.ElectionChoiceForm: 
        return <Wrapper Component={ElectionChoiceForm} props={{ availableChoices: {}, onSubmit: () => {}, onCancel: () => {} }} />;
      case View.EventNotificationCard: 
        return <Wrapper Component={EventNotificationCard} props={{ event: {} }} />;
      case View.ExpectedPaymentsTable: 
        return <ExpectedPaymentsTable />;
      case View.ExternalAccountCard: 
        return <Wrapper Component={ExternalAccountCard} props={{ account: {id: '1', account_details: [], routing_details: []}}} />;
      case View.ExternalAccountForm: 
        return <Wrapper Component={ExternalAccountForm} props={{ counterparties: [], onSubmit: () => {}, onCancel: () => {} }} />;
      case View.ExternalAccountsTable: 
        return <Wrapper Component={ExternalAccountTable} props={{ accounts: [] }} />;
      case View.FinancialAccountCard: 
        return <Wrapper Component={FinancialAccountCard} props={{ financialAccount: {id: 'fa_1', balance: { cash: {}}, supported_currencies: []}}} />;
      case View.IncomingPaymentDetailList: 
        return <IncomingPaymentDetailList />;
      case View.InvoiceFinancingRequest: 
        return <Wrapper Component={InvoiceFinancingRequest} props={{ onSubmit: () => {} }} />;
      case View.PaymentInitiationForm: 
        return <PaymentInitiationForm />;
      case View.PaymentMethodDetails: 
        return <Wrapper Component={PaymentMethodDetails} props={{ details: { type: 'card', card: {} }}} />;
      case View.PaymentOrderForm: 
        return <Wrapper Component={PaymentOrderForm} props={{ internalAccounts: [], externalAccounts: [], onSubmit: () => {}, onCancel: () => {} }} />;
      case View.PayoutsDashboard: 
        return <PayoutsDashboard />;
      case View.PnLChart: 
        return <Wrapper Component={PnLChart} props={{ data: [], algorithmName: 'Test' }} />;
      case View.RefundForm: 
        return <RefundForm />;
      case View.RemittanceInfoEditor: 
        return <Wrapper Component={RemittanceInfoEditor} props={{ onChange: () => {} }} />;
      case View.ReportingView: 
        return <ReportingView />;
      case View.ReportRunGenerator: 
        return <ReportRunGenerator />;
      case View.ReportStatusIndicator: 
        return <Wrapper Component={ReportStatusIndicator} props={{ status: 'success' }} />;
      case View.SsiEditorForm: 
        return <Wrapper Component={SsiEditorForm} props={{ onSubmit: () => {}, onCancel: () => {} }} />;
      case View.StripeStatusBadge: 
        return <Wrapper Component={StripeStatusBadge} props={{ status: 'succeeded', objectType: 'charge' }} />;
      case View.StructuredPurposeInput: 
        return <Wrapper Component={StructuredPurposeInput} props={{ onChange: () => {}, value: null }} />;
      case View.SubscriptionList: 
        return <Wrapper Component={SubscriptionList} props={{ subscriptions: [] }} />;
      case View.TimeSeriesChart: 
        return <Wrapper Component={TimeSeriesChart} props={{ data: { labels: [], datasets: [] } }} />;
      case View.TradeConfirmationModal: 
        return (
          <ModalWrapper 
            Component={TradeConfirmationModal} 
            props={{ 
              settlementInstruction: { 
                messageId: 'NEX-INST-99281-Z',
                totalAmount: 12500000, // 125k
                currency: 'USD',
                creationDateTime: Date.now(),
                settlementDate: '2024-12-15',
                numberOfTransactions: 1,
                purpose: 'TREA'
              } 
            }} 
          />
        );
      case View.TransactionFilter: 
        return <Wrapper Component={TransactionFilter} props={{ onApplyFilters: () => {} }} />;
      case View.TransactionList: 
        return <Wrapper Component={TransactionList} props={{ transactions: [] }} />;
      case View.TreasuryTransactionList: 
        return <Wrapper Component={TreasuryTransactionList} props={{ transactions: [] }} />;
      case View.TreasuryView: 
        return <TreasuryView />;
      case View.UniversalObjectInspector: 
        return <Wrapper Component={UniversalObjectInspector} props={{ data: { status: "Nominal", uptime: "99.999%", load: "Balanced" } }} />;
      case View.VirtualAccountForm: 
        return <Wrapper Component={VirtualAccountForm} props={{ onSubmit: () => {}, isSubmitting: false }} />;
      case View.VirtualAccountsTable: 
        return <Wrapper Component={VirtualAccountsTable} props={{ onEdit: () => {}, onDelete: () => {} }} />;
      case View.VoiceControl: 
        return <DataContextWrapper Component={VoiceControl} />;
      case View.WebhookSimulator: 
        return <Wrapper Component={WebhookSimulator} props={{ stripeAccountId: 'acct_mock' }} />;

      default: return <AIIntentStub view={activeView} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="relative flex flex-col flex-1 min-h-0">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-10 custom-scrollbar bg-[radial-gradient(circle_at_50%_0%,#111,transparent)]">
          <div className="max-w-[1600px] mx-auto h-full min-h-0">
            {renderView()}
          </div>
        </main>
        <MonetizationOverlay />
      </div>
    </div>
  );
};

const ExternalIframeCollection = () => {
  return (
    <div className="min-h-screen bg-[#050505] p-8 overflow-y-auto custom-scrollbar">
      <div className="max-w-[1800px] mx-auto grid grid-cols-1 xl:grid-cols-2 gap-8 place-items-center">
        <iframe src="https://admin08077-openapi.hf.space" frameBorder="0" width="850" height="450" title="view-1" />
        <iframe src="https://admin08077-ai-banking-sovereign.static.hf.space" frameBorder="0" width="850" height="450" title="view-2" />
        <iframe src="https://admin08077-aibanke.static.hf.space" frameBorder="0" width="850" height="450" title="view-3" />
        <iframe src="https://admin08077-citibank-demo-business-inc-ai-ban-king-demo.static.hf.space" frameBorder="0" width="850" height="450" title="view-4" />
        <iframe src="https://admin08077-1233.static.hf.space" frameBorder="0" width="850" height="450" title="view-5" />
        <iframe src="https://admin08077-inventions.static.hf.space" frameBorder="0" width="850" height="450" title="view-6" />
        <iframe src="https://admin08077-gemini-app-citibank-demo-business-inc-google.static.hf.space" frameBorder="0" width="850" height="450" title="view-7" />
        <iframe src="https://admin08077-aibankdemo2.static.hf.space" frameBorder="0" width="850" height="450" title="view-8" />
        <iframe src="https://admin08077-airenderer.static.hf.space" frameBorder="0" width="850" height="450" title="view-9" />
        <iframe src="https://admin08077-book.static.hf.space" frameBorder="0" width="850" height="450" title="view-10" />
        <iframe src="https://admin08077-merrychristmas.static.hf.space" frameBorder="0" width="850" height="450" title="view-11" />
        <iframe src="https://admin08077-apiai.static.hf.space" frameBorder="0" width="850" height="450" title="view-12" />
        <iframe src="https://admin08077-projectatlas.static.hf.space" frameBorder="0" width="850" height="450" title="view-13" />
        <iframe src="https://admin08077-jocall3.static.hf.space" frameBorder="0" width="850" height="450" title="view-14" />
        <iframe src="https://admin08077-demob.static.hf.space" frameBorder="0" width="850" height="450" title="view-15" />
        <iframe src="https://admin08077-aibanke.static.hf.space" frameBorder="0" width="850" height="450" title="view-16" />
        <iframe src="https://admin08077-ai-banking-sovereign.static.hf.space" frameBorder="0" width="850" height="450" title="view-17" />
        <iframe src="https://admin08077-static.static.hf.space" frameBorder="0" width="850" height="450" title="view-18" />
        <iframe src="https://admin08077-demoo.static.hf.space" frameBorder="0" width="850" height="450" title="view-19" />
        <iframe src="https://admin08077-webgenai.static.hf.space" frameBorder="0" width="850" height="450" title="view-20" />
        <iframe src="https://admin08077-aiab.static.hf.space" frameBorder="0" width="850" height="450" title="view-21" />
        <iframe src="https://admin08077-citibank-demo-business-inc-app.static.hf.space" frameBorder="0" width="850" height="450" title="view-22" />
        <iframe src="https://admin08077-aib8nking.static.hf.space" frameBorder="0" width="850" height="450" title="view-23" />
        <iframe src="https://admin08077-bb.static.hf.space" frameBorder="0" width="850" height="450" title="view-24" />
        <iframe src="https://admin08077-citibank-demo-business-inc-apps.static.hf.space" frameBorder="0" width="850" height="450" title="view-25" />
        <iframe src="https://admin08077-newwa.static.hf.space" frameBorder="0" width="850" height="450" title="view-26" />
        <iframe src="https://admin08077-jamesocallaghanprivatebank.hf.space" frameBorder="0" width="850" height="450" title="view-27" />
        <iframe src="https://admin08077-drip-faucet.static.hf.space" frameBorder="0" width="850" height="450" title="view-28" />
        <iframe src="https://admin08077-transactpro.hf.space" frameBorder="0" width="850" height="450" title="view-29" />
        <iframe src="https://admin08077-quantumbank.hf.space" frameBorder="0" width="850" height="450" title="view-30" />
        <iframe src="https://admin08077-test.hf.space" frameBorder="0" width="850" height="450" title="view-31" />
      </div>
    </div>
  );
};

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
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginView />} />
                    <Route path="/modules" element={<ExternalIframeCollection />} />
                    <Route path="*" element={<SAppLayout />} />
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