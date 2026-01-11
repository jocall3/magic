// components/ModalView.tsx
import React from 'react';
import { View } from '../types';
import FeatureGuard from './FeatureGuard';

// Import all views
import DashboardView from './views/personal/DashboardView';
import TransactionsView from './views/personal/TransactionsView';
import SendMoneyView from './views/personal/SendMoneyView';
import BudgetsView from './views/personal/BudgetsView';
import InvestmentsView from './InvestmentsView';
import PortfolioExplorerView from './views/personal/PortfolioExplorerView';
import CryptoView from './views/personal/CryptoView';
import FinancialGoalsView from './views/personal/FinancialGoalsView';
import MarketplaceView from './views/personal/MarketplaceView';
import PersonalizationView from './views/personal/PersonalizationView';
import CardCustomizationView from './views/personal/CardCustomizationView';
import RewardsHubView from './views/personal/RewardsHubView';
import CreditHealthView from './views/personal/CreditHealthView';
import SecurityView from './views/personal/SecurityView';
import OpenBankingView from './views/personal/OpenBankingView';
import SettingsView from './views/personal/SettingsView';
import AIAdvisorView from './views/platform/AIAdvisorView';
import QuantumWeaverView from './views/platform/QuantumWeaverView';
import QuantumOracleView from './views/platform/QuantumOracleView';
import AIAdStudioView from './views/platform/AIAdStudioView';
import TheVisionView from './views/platform/TheVisionView';
import APIStatusView from './views/platform/APIStatusView';
import TheNexusView from './views/platform/TheNexusView';
import ConstitutionalArticleView from './views/platform/ConstitutionalArticleView';
import TheCharterView from './views/platform/TheCharterView';
import FractionalReserveView from './views/platform/FractionalReserveView';
import FinancialInstrumentForgeView from './views/platform/TheAssemblyView';
import CorporateDashboardView from './views/corporate/CorporateDashboardView';
import PaymentOrdersView from './views/corporate/PaymentOrdersView';
import CounterpartiesView from './views/corporate/CounterpartiesView';
import InvoicesView from './views/corporate/InvoicesView';
import ComplianceView from './views/corporate/ComplianceView';
import AnomalyDetectionView from './views/corporate/AnomalyDetectionView';
import PayrollView from './views/corporate/PayrollView';
import DemoBankSocialView from './views/platform/DemoBankSocialView';
import DemoBankERPView from './views/platform/DemoBankERPView';
import DemoBankCRMView from './views/platform/DemoBankCRMView';
import DemoBankAPIGatewayView from './views/platform/DemoBankAPIGatewayView';
import DemoBankGraphExplorerView from './views/platform/DemoBankGraphExplorerView';
import DemoBankDBQLView from './views/platform/DemoBankDBQLView';
import DemoBankCloudView from './views/platform/DemoBankCloudView';
import DemoBankIdentityView from './views/platform/DemoBankIdentityView';
import DemoBankStorageView from './views/platform/DemoBankStorageView';
import DemoBankComputerView from './views/platform/DemoBankComputerView';
import DemoBankAIPlatformView from './views/platform/DemoBankAIPlatformView';
import DemoBankMachineLearningView from './views/platform/DemoBankMachineLearningView';
import DemoBankDevOpsView from './views/platform/DemoBankDevOpsView';
import DemoBankSecurityCenterView from './views/platform/DemoBankSecurityCenterView';
import DemoBankComplianceHubView from './views/platform/DemoBankComplianceHubView';
import DemoBankAppMarketplaceView from './views/platform/DemoBankAppMarketplaceView';
import ConnectView from './views/platform/DemoBankConnectView';
import DemoBankEventsView from './views/platform/DemoBankEventsView';
import DemoBankLogicAppsView from './views/platform/DemoBankLogicAppsView';
import DemoBankFunctionsView from './views/platform/DemoBankFunctionsView';
import DemoBankDataFactoryView from './views/platform/DemoBankDataFactoryView';
import DemoBankAnalyticsView from './views/platform/DemoBankAnalyticsView';
import DemoBankBIView from './views/platform/DemoBankBIView';
import DemoBankIoTHubView from './views/platform/DemoBankIoTHubView';
import DemoBankMapsView from './views/platform/DemoBankMapsView';
import DemoBankCommunicationsView from './views/platform/DemoBankCommunicationsView';
import DemoBankCommerceView from './views/platform/DemoBankCommerceView';
import DemoBankTeamsView from './views/platform/DemoBankTeamsView';
import DemoBankCMSView from './views/platform/DemoBankCMSView';
import DemoBankLMSView from './views/platform/DemoBankLMSView';
import DemoBankHRISView from './views/platform/DemoBankHRISView';
import DemoBankProjectsView from './views/platform/DemoBankProjectsView';
import DemoBankLegalSuiteView from './views/platform/DemoBankLegalSuiteView';
import DemoBankSupplyChainView from './views/platform/DemoBankSupplyChainView';
import DemoBankPropTechView from './views/platform/DemoBankPropTechView';
import DemoBankGamingServicesView from './views/platform/DemoBankGamingServicesView';
import DemoBankBookingsView from './views/platform/DemoBankBookingsView';
import DemoBankCDPView from './views/platform/DemoBankCDPView';
import DemoBankQuantumServicesView from './views/platform/DemoBankQuantumServicesView';
import DemoBankBlockchainView from './views/platform/DemoBankBlockchainView';
import DemoBankGISView from './views/platform/DemoBankGISView';
import DemoBankRoboticsView from './views/platform/DemoBankRoboticsView';
import DemoBankSimulationsView from './views/platform/DemoBankSimulationsView';
import DemoBankVoiceServicesView from './views/platform/DemoBankVoiceServicesView';
import DemoBankSearchSuiteView from './views/platform/DemoBankSearchSuiteView';
import DemoBankDigitalTwinView from './views/platform/DemoBankDigitalTwinView';
import DemoBankWorkflowEngineView from './views/platform/DemoBankWorkflowEngineView';
import DemoBankObservabilityPlatformView from './views/platform/DemoBankObservabilityPlatformView';
import DemoBankFeatureManagementView from './views/platform/DemoBankFeatureManagementView';
import DemoBankExperimentationPlatformView from './views/platform/DemoBankExperimentationPlatformView';
import DemoBankLocalizationPlatformView from './views/platform/DemoBankLocalizationPlatformView';
import DemoBankFleetManagementView from './views/platform/DemoBankFleetManagementView';
import DemoBankKnowledgeBaseView from './views/platform/DemoBankKnowledgeBaseView';
import DemoBankMediaServicesView from './views/platform/DemoBankMediaServicesView';
import DemoBankEventGridView from './views/platform/DemoBankEventGridView';
import DemoBankApiManagementView from './views/platform/DemoBankApiManagementView';
import AccessControlsView from './views/megadashboard/security/AccessControlsView';
import RoleManagementView from './views/megadashboard/security/RoleManagementView';
import AuditLogsView from './views/megadashboard/security/AuditLogsView';
import FraudDetectionView from './views/megadashboard/security/FraudDetectionView';
import ThreatIntelligenceView from './views/megadashboard/security/ThreatIntelligenceView';
import CardManagementView from './views/megadashboard/finance/CardManagementView';
import LoanApplicationsView from './views/megadashboard/finance/LoanApplicationsView';
import MortgagesView from './views/megadashboard/finance/MortgagesView';
import InsuranceHubView from './views/megadashboard/finance/InsuranceHubView';
import TaxCenterView from './views/megadashboard/finance/TaxCenterView';
import PredictiveModelsView from './views/megadashboard/analytics/PredictiveModelsView';
import RiskScoringView from './views/megadashboard/analytics/RiskScoringView';
import SentimentAnalysisView from './views/megadashboard/analytics/SentimentAnalysisView';
import DataLakesView from './views/megadashboard/analytics/DataLakesView';
import DataCatalogView from './views/megadashboard/analytics/DataCatalogView';
import ClientOnboardingView from './views/megadashboard/userclient/ClientOnboardingView';
import KycAmlView from './views/megadashboard/userclient/KycAmlView';
import UserInsightsView from './views/megadashboard/userclient/UserInsightsView';
import FeedbackHubView from './views/megadashboard/userclient/FeedbackHubView';
import SupportDeskView from './views/megadashboard/userclient/SupportDeskView';
import SandboxView from './views/megadashboard/developer/SandboxView';
import SdkDownloadsView from './views/megadashboard/developer/SdkDownloadsView';
import WebhooksView from './views/megadashboard/developer/WebhooksView';
import CliToolsView from './views/megadashboard/developer/CliToolsView';
import ExtensionsView from './views/megadashboard/developer/ExtensionsView';
import ApiKeysView from './views/megadashboard/developer/ApiKeysView';
import ApiContractsView from './views/developer/ApiContractsView';
import PartnerHubView from './views/megadashboard/ecosystem/PartnerHubView';
import AffiliatesView from './views/megadashboard/ecosystem/AffiliatesView';
import IntegrationsMarketplaceView from './views/megadashboard/ecosystem/IntegrationsMarketplaceView';
import CrossBorderPaymentsView from './views/megadashboard/ecosystem/CrossBorderPaymentsView';
import MultiCurrencyView from './views/megadashboard/ecosystem/MultiCurrencyView';
import NftVaultView from './views/megadashboard/digitalassets/NftVaultView';
import TokenIssuanceView from './views/megadashboard/digitalassets/TokenIssuanceView';
import SmartContractsView from './views/megadashboard/digitalassets/SmartContractsView';
import DaoGovernanceView from './views/megadashboard/digitalassets/DaoGovernanceView';
import OnChainAnalyticsView from './views/megadashboard/digitalassets/OnChainAnalyticsView';
import SalesPipelineView from './views/megadashboard/business/SalesPipelineView';
import MarketingAutomationView from './views/megadashboard/business/MarketingAutomationView';
import GrowthInsightsView from './views/megadashboard/business/GrowthInsightsView';
import CompetitiveIntelligenceView from './views/megadashboard/business/CompetitiveIntelligenceView';
import BenchmarkingView from './views/megadashboard/business/BenchmarkingView';
import LicensingView from './views/megadashboard/regulation/LicensingView';
import DisclosuresView from './views/megadashboard/regulation/DisclosuresView';
import LegalDocsView from './views/megadashboard/regulation/LegalDocsView';
import RegulatorySandboxView from './views/megadashboard/regulation/RegulatorySandboxView';
import ConsentManagementView from './views/megadashboard/regulation/ConsentManagementView';
import ContainerRegistryView from './views/megadashboard/infra/ContainerRegistryView';
import ApiThrottlingView from './views/megadashboard/infra/ApiThrottlingView';
import ObservabilityView from './views/megadashboard/infra/ObservabilityView';
import IncidentResponseView from './views/megadashboard/infra/IncidentResponseView';
import BackupRecoveryView from './views/megadashboard/infra/BackupRecoveryView';
import CrisisAIManagerView from './views/blueprints/CrisisAIManagerView';
import CognitiveLoadBalancerView from './views/blueprints/CognitiveLoadBalancerView';
import HolographicMeetingScribeView from './views/blueprints/HolographicMeetingScribeView';
import QuantumProofEncryptorView from './views/blueprints/QuantumProofEncryptorView';
import EtherealMarketplaceView from './views/blueprints/EtherealMarketplaceView';
import AdaptiveUITailorView from './views/blueprints/AdaptiveUITailorView';
import UrbanSymphonyPlannerView from './views/blueprints/UrbanSymphonyPlannerView';
import PersonalHistorianAIView from './views/blueprints/PersonalHistorianAIView';
import DebateAdversaryView from './views/blueprints/DebateAdversaryView';
import CulturalAssimilationAdvisorView from './views/blueprints/CulturalAssimilationAdvisorView';
import DynamicSoundscapeGeneratorView from './views/blueprints/DynamicSoundscapeGeneratorView';
import EmergentStrategyWargamerView from './views/blueprints/EmergentStrategyWargamerView';
import EthicalGovernorView from './views/blueprints/EthicalGovernorView';
import QuantumEntanglementDebuggerView from './views/blueprints/QuantumEntanglementDebuggerView';
import LinguisticFossilFinderView from './views/blueprints/LinguisticFossilFinderView';
import ChaosTheoristView from './views/blueprints/ChaosTheoristView';
import SelfRewritingCodebaseView from './views/blueprints/SelfRewritingCodebaseView';
import GenerativeJurisprudenceView from './views/blueprints/GenerativeJurisprudenceView';
import AestheticEngineView from './views/blueprints/AestheticEngineView';
import NarrativeForgeView from './views/blueprints/NarrativeForgeView';
import WorldBuilderView from './views/blueprints/WorldBuilderView';
import SonicAlchemyView from './views/blueprints/SonicAlchemyView';
import AutonomousScientistView from './views/blueprints/AutonomousScientistView';
import ZeitgeistEngineView from './views/blueprints/ZeitgeistEngineView';
import CareerTrajectoryView from './views/blueprints/CareerTrajectoryView';
import LudicBalancerView from './views/blueprints/LudicBalancerView';
import HypothesisEngineView from './views/blueprints/HypothesisEngineView';
import LexiconClarifierView from './views/blueprints/LexiconClarifierView';
import CodeArcheologistView from './views/blueprints/CodeArcheologistView';


interface ModalViewProps {
    activeView: View;
    previousView: View | null;
    closeModal: () => void;
    openModal: (view: View) => void;
}

export const ModalView: React.FC<ModalViewProps> = ({ activeView, previousView, closeModal, openModal }) => {

    const renderView = () => {
        if (activeView.startsWith('article-')) {
            const articleNumber = parseInt(activeView.replace('article-', ''), 10);
            return <FeatureGuard view={activeView}><ConstitutionalArticleView articleNumber={articleNumber} /></FeatureGuard>;
        }

        switch (activeView) {
            case View.Dashboard: return <FeatureGuard view={View.Dashboard}><DashboardView setActiveView={openModal} /></FeatureGuard>;
            case View.Transactions: return <FeatureGuard view={View.Transactions}><TransactionsView /></FeatureGuard>;
            case View.SendMoney: return <FeatureGuard view={View.SendMoney}><SendMoneyView setActiveView={openModal} /></FeatureGuard>;
            case View.Budgets: return <FeatureGuard view={View.Budgets}><BudgetsView /></FeatureGuard>;
            case View.Investments: return <FeatureGuard view={View.Investments}><InvestmentsView /></FeatureGuard>;
            case View.PortfolioExplorer: return <FeatureGuard view={View.PortfolioExplorer}><PortfolioExplorerView /></FeatureGuard>;
            case View.Crypto: return <FeatureGuard view={View.Crypto}><CryptoView /></FeatureGuard>;
            case View.FinancialGoals: return <FeatureGuard view={View.FinancialGoals}><FinancialGoalsView /></FeatureGuard>;
            case View.Marketplace: return <FeatureGuard view={View.Marketplace}><MarketplaceView /></FeatureGuard>;
            case View.Personalization: return <FeatureGuard view={View.Personalization}><PersonalizationView /></FeatureGuard>;
            case View.CardCustomization: return <FeatureGuard view={View.CardCustomization}><CardCustomizationView /></FeatureGuard>;
            case View.RewardsHub: return <FeatureGuard view={View.RewardsHub}><RewardsHubView /></FeatureGuard>;
            case View.CreditHealth: return <FeatureGuard view={View.CreditHealth}><CreditHealthView /></FeatureGuard>;
            case View.Security: return <FeatureGuard view={View.Security}><SecurityView /></FeatureGuard>;
            case View.OpenBanking: return <FeatureGuard view={View.OpenBanking}><OpenBankingView /></FeatureGuard>;
            case View.Settings: return <FeatureGuard view={View.Settings}><SettingsView /></FeatureGuard>;
            case View.TheNexus: return <FeatureGuard view={View.TheNexus}><TheNexusView /></FeatureGuard>;
            case View.AIAdvisor: return <FeatureGuard view={View.AIAdvisor}><AIAdvisorView previousView={previousView} /></FeatureGuard>;
            case View.QuantumWeaver: return <FeatureGuard view={View.QuantumWeaver}><QuantumWeaverView /></FeatureGuard>;
            case View.QuantumOracle: return <FeatureGuard view={View.QuantumOracle}><QuantumOracleView /></FeatureGuard>;
            case View.AIAdStudio: return <FeatureGuard view={View.AIAdStudio}><AIAdStudioView /></FeatureGuard>;
            case View.TheWinningVision: return <FeatureGuard view={View.TheWinningVision}><TheVisionView /></FeatureGuard>;
            case View.APIStatus: return <FeatureGuard view={View.APIStatus}><APIStatusView /></FeatureGuard>;
            case View.CorporateDashboard: return <FeatureGuard view={View.CorporateDashboard}><CorporateDashboardView setActiveView={openModal} /></FeatureGuard>;
            case View.PaymentOrders: return <FeatureGuard view={View.PaymentOrders}><PaymentOrdersView /></FeatureGuard>;
            case View.Counterparties: return <FeatureGuard view={View.Counterparties}><CounterpartiesView /></FeatureGuard>;
            case View.Invoices: return <FeatureGuard view={View.Invoices}><InvoicesView /></FeatureGuard>;
            case View.Compliance: return <FeatureGuard view={View.Compliance}><ComplianceView /></FeatureGuard>;
            case View.AnomalyDetection: return <FeatureGuard view={View.AnomalyDetection}><AnomalyDetectionView /></FeatureGuard>;
            case View.Payroll: return <FeatureGuard view={View.Payroll}><PayrollView /></FeatureGuard>;
            case View.DemoBankSocial: return <FeatureGuard view={View.DemoBankSocial}><DemoBankSocialView /></FeatureGuard>;
            case View.DemoBankERP: return <FeatureGuard view={View.DemoBankERP}><DemoBankERPView /></FeatureGuard>;
            case View.DemoBankCRM: return <FeatureGuard view={View.DemoBankCRM}><DemoBankCRMView /></FeatureGuard>;
            case View.DemoBankAPIGateway: return <FeatureGuard view={View.DemoBankAPIGateway}><DemoBankAPIGatewayView /></FeatureGuard>;
            case View.DemoBankGraphExplorer: return <FeatureGuard view={View.DemoBankGraphExplorer}><DemoBankGraphExplorerView /></FeatureGuard>;
            case View.DemoBankDBQL: return <FeatureGuard view={View.DemoBankDBQL}><DemoBankDBQLView /></FeatureGuard>;
            case View.DemoBankCloud: return <FeatureGuard view={View.DemoBankCloud}><DemoBankCloudView /></FeatureGuard>;
            case View.DemoBankIdentity: return <FeatureGuard view={View.DemoBankIdentity}><DemoBankIdentityView /></FeatureGuard>;
            case View.DemoBankStorage: return <FeatureGuard view={View.DemoBankStorage}><DemoBankStorageView /></FeatureGuard>;
            case View.DemoBankCompute: return <FeatureGuard view={View.DemoBankCompute}><DemoBankComputerView /></FeatureGuard>;
            case View.DemoBankAIPlatform: return <FeatureGuard view={View.DemoBankAIPlatform}><DemoBankAIPlatformView /></FeatureGuard>;
            case View.DemoBankMachineLearning: return <FeatureGuard view={View.DemoBankMachineLearning}><DemoBankMachineLearningView /></FeatureGuard>;
            case View.DemoBankDevOps: return <FeatureGuard view={View.DemoBankDevOps}><DemoBankDevOpsView /></FeatureGuard>;
            case View.DemoBankSecurityCenter: return <FeatureGuard view={View.DemoBankSecurityCenter}><DemoBankSecurityCenterView /></FeatureGuard>;
            case View.DemoBankComplianceHub: return <FeatureGuard view={View.DemoBankComplianceHub}><DemoBankComplianceHubView /></FeatureGuard>;
            case View.DemoBankAppMarketplace: return <FeatureGuard view={View.DemoBankAppMarketplace}><DemoBankAppMarketplaceView /></FeatureGuard>;
            case View.Connect: return <FeatureGuard view={View.Connect}><ConnectView /></FeatureGuard>;
            case View.DemoBankEvents: return <FeatureGuard view={View.DemoBankEvents}><DemoBankEventsView /></FeatureGuard>;
            case View.DemoBankLogicApps: return <FeatureGuard view={View.DemoBankLogicApps}><DemoBankLogicAppsView /></FeatureGuard>;
            case View.DemoBankFunctions: return <FeatureGuard view={View.DemoBankFunctions}><DemoBankFunctionsView /></FeatureGuard>;
            case View.DemoBankDataFactory: return <FeatureGuard view={View.DemoBankDataFactory}><DemoBankDataFactoryView /></FeatureGuard>;
            case View.DemoBankAnalytics: return <FeatureGuard view={View.DemoBankAnalytics}><DemoBankAnalyticsView /></FeatureGuard>;
            case View.DemoBankBI: return <FeatureGuard view={View.DemoBankBI}><DemoBankBIView /></FeatureGuard>;
            case View.DemoBankIoTHub: return <FeatureGuard view={View.DemoBankIoTHub}><DemoBankIoTHubView /></FeatureGuard>;
            case View.DemoBankMaps: return <FeatureGuard view={View.DemoBankMaps}><DemoBankMapsView /></FeatureGuard>;
            case View.DemoBankCommunications: return <FeatureGuard view={View.DemoBankCommunications}><DemoBankCommunicationsView /></FeatureGuard>;
            case View.DemoBankCommerce: return <FeatureGuard view={View.DemoBankCommerce}><DemoBankCommerceView /></FeatureGuard>;
            case View.DemoBankTeams: return <FeatureGuard view={View.DemoBankTeams}><DemoBankTeamsView /></FeatureGuard>;
            case View.DemoBankCMS: return <FeatureGuard view={View.DemoBankCMS}><DemoBankCMSView /></FeatureGuard>;
            case View.DemoBankLMS: return <FeatureGuard view={View.DemoBankLMS}><DemoBankLMSView /></FeatureGuard>;
            case View.DemoBankHRIS: return <FeatureGuard view={View.DemoBankHRIS}><DemoBankHRISView /></FeatureGuard>;
            case View.DemoBankProjects: return <FeatureGuard view={View.DemoBankProjects}><DemoBankProjectsView /></FeatureGuard>;
            case View.DemoBankLegalSuite: return <FeatureGuard view={View.DemoBankLegalSuite}><DemoBankLegalSuiteView /></FeatureGuard>;
            case View.DemoBankSupplyChain: return <FeatureGuard view={View.DemoBankSupplyChain}><DemoBankSupplyChainView /></FeatureGuard>;
            case View.DemoBankPropTech: return <FeatureGuard view={View.DemoBankPropTech}><DemoBankPropTechView /></FeatureGuard>;
            case View.DemoBankGamingServices: return <FeatureGuard view={View.DemoBankGamingServices}><DemoBankGamingServicesView /></FeatureGuard>;
            case View.DemoBankBookings: return <FeatureGuard view={View.DemoBankBookings}><DemoBankBookingsView /></FeatureGuard>;
            case View.DemoBankCDP: return <FeatureGuard view={View.DemoBankCDP}><DemoBankCDPView /></FeatureGuard>;
            case View.DemoBankQuantumServices: return <FeatureGuard view={View.DemoBankQuantumServices}><DemoBankQuantumServicesView /></FeatureGuard>;
            case View.DemoBankBlockchain: return <FeatureGuard view={View.DemoBankBlockchain}><DemoBankBlockchainView /></FeatureGuard>;
            case View.DemoBankGIS: return <FeatureGuard view={View.DemoBankGIS}><DemoBankGISView /></FeatureGuard>;
            case View.DemoBankRobotics: return <FeatureGuard view={View.DemoBankRobotics}><DemoBankRoboticsView /></FeatureGuard>;
            case View.DemoBankSimulations: return <FeatureGuard view={View.DemoBankSimulations}><DemoBankSimulationsView /></FeatureGuard>;
            case View.DemoBankVoiceServices: return <FeatureGuard view={View.DemoBankVoiceServices}><DemoBankVoiceServicesView /></FeatureGuard>;
            case View.DemoBankSearchSuite: return <FeatureGuard view={View.DemoBankSearchSuite}><DemoBankSearchSuiteView /></FeatureGuard>;
            case View.DemoBankDigitalTwin: return <FeatureGuard view={View.DemoBankDigitalTwin}><DemoBankDigitalTwinView /></FeatureGuard>;
            case View.DemoBankWorkflowEngine: return <FeatureGuard view={View.DemoBankWorkflowEngine}><DemoBankWorkflowEngineView /></FeatureGuard>;
            case View.DemoBankObservabilityPlatform: return <FeatureGuard view={View.DemoBankObservabilityPlatform}><DemoBankObservabilityPlatformView /></FeatureGuard>;
            case View.DemoBankFeatureManagement: return <FeatureGuard view={View.DemoBankFeatureManagement}><DemoBankFeatureManagementView /></FeatureGuard>;
            case View.DemoBankExperimentationPlatform: return <FeatureGuard view={View.DemoBankExperimentationPlatform}><DemoBankExperimentationPlatformView /></FeatureGuard>;
            case View.DemoBankLocalizationPlatform: return <FeatureGuard view={View.DemoBankLocalizationPlatform}><DemoBankLocalizationPlatformView /></FeatureGuard>;
            default: return <div>Unknown View</div>;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center animate-fade-in" onClick={closeModal}>
            <div className="bg-gray-900/80 border border-gray-700/60 rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b border-gray-700/50 flex justify-end">
                    <button onClick={closeModal} className="text-gray-400 hover:text-white">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {renderView()}
                </main>
            </div>
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.98); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
};
