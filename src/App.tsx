import React, { useState } from 'react';
import { View } from './types';
import { viewRegistry } from './viewRegistry';
import { PlaidClient } from './lib/plaid';

// Wrappers & Helpers
import { Wrapper, ModalWrapper, DataContextWrapper } from './components/Wrappers';
import { AIIntentStub } from './components/AIIntentStub';

// Views & Components
import { CorporateCommandView } from './views/CorporateCommandView';
import { VerificationReportsView } from './views/VerificationReportsView';
import { CitibankUnmaskedDataView } from './views/CitibankUnmaskedDataView';
import { PlaidInstitutionsExplorer } from './views/PlaidInstitutionsExplorer';
import { PlaidItemManagementView } from './views/PlaidItemManagementView';
import { SchemaExplorer } from './views/SchemaExplorer';
import { ConductorConfigurationView } from './views/ConductorConfigurationView';
import { PayoutsDashboard } from './views/PayoutsDashboard';
import { ReportingView } from './views/ReportingView';
import { TreasuryView } from './views/TreasuryView';

import { AccountDetails } from './components/AccountDetails';
import { AccountList } from './components/AccountList';
import { AccountStatementGrid } from './components/AccountStatementGrid';
import { AccountVerificationModal } from './components/AccountVerificationModal';
import { ACHDetailsDisplay } from './components/ACHDetailsDisplay';
import { AICommandLog } from './components/AICommandLog';
import { AIPredictionWidget } from './components/AIPredictionWidget';
import { AssetCatalog } from './components/AssetCatalog';
import { AutomatedSweepRules } from './components/AutomatedSweepRules';
import { BalanceReportChart } from './components/BalanceReportChart';
import { BalanceTransactionTable } from './components/BalanceTransactionTable';
import { CardDesignVisualizer } from './components/CardDesignVisualizer';
import { ChargeDetailModal } from './components/ChargeDetailModal';
import { ChargeList } from './components/ChargeList';
import { CounterpartyDetails } from './components/CounterpartyDetails';
import { CounterpartyForm } from './components/CounterpartyForm';
import { DisruptionIndexMeter } from './components/DisruptionIndexMeter';
import { DocumentUploader } from './components/DocumentUploader';
import { DownloadLink } from './components/DownloadLink';
import { EarlyFraudWarningFeed } from './components/EarlyFraudWarningFeed';
import { ElectionChoiceForm } from './components/ElectionChoiceForm';
import { EventNotificationCard } from './components/EventNotificationCard';
import { ExpectedPaymentsTable } from './components/ExpectedPaymentsTable';
import { ExternalAccountCard } from './components/ExternalAccountCard';
import { ExternalAccountForm } from './components/ExternalAccountForm';
import { ExternalAccountTable } from './components/ExternalAccountTable';
import { FinancialAccountCard } from './components/FinancialAccountCard';
import { IncomingPaymentDetailList } from './components/IncomingPaymentDetailList';
import { InvoiceFinancingRequest } from './components/InvoiceFinancingRequest';
import { PaymentInitiationForm } from './components/PaymentInitiationForm';
import { PaymentMethodDetails } from './components/PaymentMethodDetails';
import { PaymentOrderForm } from './components/PaymentOrderForm';
import { PnLChart } from './components/PnLChart';
import { RefundForm } from './components/RefundForm';
import { RemittanceInfoEditor } from './components/RemittanceInfoEditor';
import { ReportRunGenerator } from './components/ReportRunGenerator';
import { ReportStatusIndicator } from './components/ReportStatusIndicator';
import { SsiEditorForm } from './components/SsiEditorForm';
import { StripeStatusBadge } from './components/StripeStatusBadge';
import { StructuredPurposeInput } from './components/StructuredPurposeInput';
import { SubscriptionList } from './components/SubscriptionList';
import { TimeSeriesChart } from './components/TimeSeriesChart';
import { TradeConfirmationModal } from './components/TradeConfirmationModal';
import { TransactionFilter } from './components/TransactionFilter';
import { TransactionList } from './components/TransactionList';
import { TreasuryTransactionList } from './components/TreasuryTransactionList';
import { UniversalObjectInspector } from './components/UniversalObjectInspector';
import { VirtualAccountForm } from './components/VirtualAccountForm';
import { VirtualAccountsTable } from './components/VirtualAccountsTable';
import { VoiceControl } from './components/VoiceControl';
import { WebhookSimulator } from './components/WebhookSimulator';

// Mapping for Views where the Enum value might not match the Filename exactly
const VIEW_FILENAME_MAPPING: Record<string, string> = {
  [View.Transactions]: 'TransactionsView',
  [View.SendMoney]: 'SendMoneyView',
  [View.Budgets]: 'BudgetsView',
  [View.FinancialGoals]: 'FinancialGoalsView',
  [View.CreditHealth]: 'CreditHealthView',
  [View.Personalization]: 'PersonalizationView',
  [View.Accounts]: 'AccountsView',
  [View.Investments]: 'InvestmentsView',
  [View.CryptoWeb3]: 'CryptoView',
  [View.VentureCapital]: 'VentureCapitalDesk',
  [View.PrivateEquity]: 'PrivateEquityLounge',
  [View.TaxOptimization]: 'TaxOptimizationChamber',
  [View.ModernTreasury]: 'ModernTreasuryView',
  [View.OpenBanking]: 'OpenBankingView',
  [View.FinancialDemocracy]: 'FinancialDemocracyView',
  [View.AIAdStudio]: 'AIAdStudioView',
  [View.QuantumWeaver]: 'QuantumWeaverView',
  [View.AgentMarketplace]: 'MarketplaceView',
  [View.APIStatus]: 'APIIntegrationView',
  [View.Settings]: 'SettingsView',
  [View.Philanthropy]: 'PhilanthropyHub',
  [View.TheVision]: 'TheVisionView',
  [View.AIAdvisor]: 'AIAdvisorView',
  [View.SecurityCenter]: 'SecurityView',
  [View.ComplianceOracle]: 'ComplianceOracleView',
  [View.GlobalSsiHub]: 'GlobalSsiHubView',
  [View.TheBook]: 'TheBookView',
  [View.KnowledgeBase]: 'KnowledgeBaseView',
  [View.CitibankAccounts]: 'CitibankAccountsView',
  [View.CitibankAccountProxy]: 'CitibankAccountProxyView',
  [View.CitibankBillPay]: 'CitibankBillPayView',
  [View.CitibankCrossBorder]: 'CitibankCrossBorderView',
  [View.CitibankPayeeManagement]: 'CitibankPayeeManagementView',
  [View.CitibankStandingInstructions]: 'CitibankStandingInstructionsView',
  [View.CitibankDeveloperTools]: 'CitibankDeveloperToolsView',
  [View.CitibankEligibility]: 'CitibankEligibilityView',
  [View.PlaidMainDashboard]: 'PlaidMainDashboard',
  [View.PlaidIdentity]: 'PlaidIdentityView',
  [View.PlaidCRAMonitoring]: 'PlaidCRAMonitoringView',
  [View.StripeNexus]: 'StripeNexusView',
  [View.CounterpartyDashboard]: 'CounterpartyDashboardView',
  [View.VirtualAccounts]: 'VirtualAccountsDashboard',
  [View.CorporateActions]: 'CorporateActionsNexusView',
  [View.ReconciliationHub]: 'ReconciliationHubView',
  [View.GEINDashboard]: 'GEIN_DashboardView',
  [View.SecurityCompliance]: 'SecurityComplianceView',
  [View.DeveloperHub]: 'DeveloperHubView',
  [View.ApiPlayground]: 'ApiPlaygroundView',
};

export const SAppLayout: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.Dashboard);

  const renderView = () => {
    // 1. Handle Views that require specific props or wrappers (Manual Overrides)
    switch (activeView) {
      case View.CorporateCommand: return <CorporateCommandView setActiveView={setActiveView} />;
      case View.VerificationReports: return <VerificationReportsView customerId="c1" />;
      case View.CitibankUnmaskedData: return <CitibankUnmaskedDataView accountIdsToUnmask={['acc_1']} />;
      case View.PlaidInstitutions: return <PlaidInstitutionsExplorer client={new PlaidClient()} />;
      case View.PlaidItemManagement: return <PlaidItemManagementView accessToken="mock_token" />;
      case View.SchemaExplorer: return <SchemaExplorer schemaData={{ definitions: {}, properties: {} }} />;
      
      // --- Direct Component Access (Wrapped Components) ---
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
    }

    // 2. Dynamic Registry Lookup
    // Try to find the component in the registry using the mapping or the activeView name directly
    const fileName = VIEW_FILENAME_MAPPING[activeView] || activeView;
    const Component = viewRegistry[fileName];

    if (Component) {
      return <Component />;
    }

    // 3. Fallback for unknown views
    return <AIIntentStub view={activeView} />;
  };

  return (
    <div className="app-layout">
      <main className="app-content">
        {renderView()}
      </main>
    </div>
  );
};

export default SAppLayout;