import Layout from "./Layout.jsx";

import AIAssistant from "./AIAssistant";

import AIPolicy from "./AIPolicy";

import AISafety from "./AISafety";

import AcceptableUse from "./AcceptableUse";

import AdvancedAnalytics from "./AdvancedAnalytics";

import AgencyDashboard from "./AgencyDashboard";

import AgencyLanding from "./AgencyLanding";

import Analytics from "./Analytics";

import Appointments from "./Appointments";

import Approvals from "./Approvals";

import AutoDiscoveryReport from "./AutoDiscoveryReport";

import AutomationSetup from "./AutomationSetup";

import Book from "./Book";

import BusinessIntelligence from "./BusinessIntelligence";

import Calendar from "./Calendar";

import CallCenter from "./CallCenter";

import CallHistory from "./CallHistory";

import CampaignAnalytics from "./CampaignAnalytics";

import Campaigns from "./Campaigns";

import Channels from "./Channels";

import Clients from "./Clients";

import ComplianceChecklist from "./ComplianceChecklist";

import ComplianceSummary from "./ComplianceSummary";

import ComplianceTesting from "./ComplianceTesting";

import Concierge from "./Concierge";

import ConciergeWidget from "./ConciergeWidget";

import ConnectSquare from "./ConnectSquare";

import ConversationHistory from "./ConversationHistory";

import CustomerView from "./CustomerView";

import Dashboard from "./Dashboard";

import DataPolicy from "./DataPolicy";

import FeatureInventory from "./FeatureInventory";

import FeedbackManager from "./FeedbackManager";

import Guide from "./Guide";

import Home from "./Home";

import Inbox from "./Inbox";

import IntentMonitor from "./IntentMonitor";

import KnowledgeBase from "./KnowledgeBase";

import Landing from "./Landing";

import LiveDemo from "./LiveDemo";

import MarketplaceAudit from "./MarketplaceAudit";

import MarketplaceReadiness from "./MarketplaceReadiness";

import Pricing from "./Pricing";

import Privacy from "./Privacy";

import ProactiveOutreach from "./ProactiveOutreach";

import ProductIntelligence from "./ProductIntelligence";

import Products from "./Products";

import ReputationManager from "./ReputationManager";

import RetentionAnalytics from "./RetentionAnalytics";

import RetentionEngine from "./RetentionEngine";

import RevenueForecast from "./RevenueForecast";

import SEOIntelligence from "./SEOIntelligence";

import SaasAnalytics from "./SaasAnalytics";

import SaasClientAutomations from "./SaasClientAutomations";

import SaasDashboard from "./SaasDashboard";

import SaasOnboarding from "./SaasOnboarding";

import SaasOnboardingSuccess from "./SaasOnboardingSuccess";

import Search from "./Search";

import ServiceIntelligence from "./ServiceIntelligence";

import ServiceRecords from "./ServiceRecords";

import Services from "./Services";

import Settings from "./Settings";

import SquareDisclaimer from "./SquareDisclaimer";

import SquareSetup from "./SquareSetup";

import SquareSync from "./SquareSync";

import StylistPerformance from "./StylistPerformance";

import SubscriptionManagement from "./SubscriptionManagement";

import SystemHealth from "./SystemHealth";

import SystemStatus from "./SystemStatus";

import TenantSettings from "./TenantSettings";

import Terms from "./Terms";

import VersionLog from "./VersionLog";

import VoiceGeoRank from "./VoiceGeoRank";

import WebsiteAnalyzer from "./WebsiteAnalyzer";

import AIScheduling from "./AIScheduling";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    AIAssistant: AIAssistant,
    
    AIPolicy: AIPolicy,
    
    AISafety: AISafety,
    
    AcceptableUse: AcceptableUse,
    
    AdvancedAnalytics: AdvancedAnalytics,
    
    AgencyDashboard: AgencyDashboard,
    
    AgencyLanding: AgencyLanding,
    
    Analytics: Analytics,
    
    Appointments: Appointments,
    
    Approvals: Approvals,
    
    AutoDiscoveryReport: AutoDiscoveryReport,
    
    AutomationSetup: AutomationSetup,
    
    Book: Book,
    
    BusinessIntelligence: BusinessIntelligence,
    
    Calendar: Calendar,
    
    CallCenter: CallCenter,
    
    CallHistory: CallHistory,
    
    CampaignAnalytics: CampaignAnalytics,
    
    Campaigns: Campaigns,
    
    Channels: Channels,
    
    Clients: Clients,
    
    ComplianceChecklist: ComplianceChecklist,
    
    ComplianceSummary: ComplianceSummary,
    
    ComplianceTesting: ComplianceTesting,
    
    Concierge: Concierge,
    
    ConciergeWidget: ConciergeWidget,
    
    ConnectSquare: ConnectSquare,
    
    ConversationHistory: ConversationHistory,
    
    CustomerView: CustomerView,
    
    Dashboard: Dashboard,
    
    DataPolicy: DataPolicy,
    
    FeatureInventory: FeatureInventory,
    
    FeedbackManager: FeedbackManager,
    
    Guide: Guide,
    
    Home: Home,
    
    Inbox: Inbox,
    
    IntentMonitor: IntentMonitor,
    
    KnowledgeBase: KnowledgeBase,
    
    Landing: Landing,
    
    LiveDemo: LiveDemo,
    
    MarketplaceAudit: MarketplaceAudit,
    
    MarketplaceReadiness: MarketplaceReadiness,
    
    Pricing: Pricing,
    
    Privacy: Privacy,
    
    ProactiveOutreach: ProactiveOutreach,
    
    ProductIntelligence: ProductIntelligence,
    
    Products: Products,
    
    ReputationManager: ReputationManager,
    
    RetentionAnalytics: RetentionAnalytics,
    
    RetentionEngine: RetentionEngine,
    
    RevenueForecast: RevenueForecast,
    
    SEOIntelligence: SEOIntelligence,
    
    SaasAnalytics: SaasAnalytics,
    
    SaasClientAutomations: SaasClientAutomations,
    
    SaasDashboard: SaasDashboard,
    
    SaasOnboarding: SaasOnboarding,
    
    SaasOnboardingSuccess: SaasOnboardingSuccess,
    
    Search: Search,
    
    ServiceIntelligence: ServiceIntelligence,
    
    ServiceRecords: ServiceRecords,
    
    Services: Services,
    
    Settings: Settings,
    
    SquareDisclaimer: SquareDisclaimer,
    
    SquareSetup: SquareSetup,
    
    SquareSync: SquareSync,
    
    StylistPerformance: StylistPerformance,
    
    SubscriptionManagement: SubscriptionManagement,
    
    SystemHealth: SystemHealth,
    
    SystemStatus: SystemStatus,
    
    TenantSettings: TenantSettings,
    
    Terms: Terms,
    
    VersionLog: VersionLog,
    
    VoiceGeoRank: VoiceGeoRank,
    
    WebsiteAnalyzer: WebsiteAnalyzer,
        
    AIScheduling: AIScheduling,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<AIAssistant />} />
                
                
                <Route path="/AIAssistant" element={<AIAssistant />} />
                
                <Route path="/AIPolicy" element={<AIPolicy />} />
                
                <Route path="/AISafety" element={<AISafety />} />
                
                <Route path="/AcceptableUse" element={<AcceptableUse />} />
                
                <Route path="/AdvancedAnalytics" element={<AdvancedAnalytics />} />
                
                <Route path="/AgencyDashboard" element={<AgencyDashboard />} />
                
                <Route path="/AgencyLanding" element={<AgencyLanding />} />
                
                <Route path="/Analytics" element={<Analytics />} />
                
                <Route path="/Appointments" element={<Appointments />} />
                
                <Route path="/Approvals" element={<Approvals />} />
                
                <Route path="/AutoDiscoveryReport" element={<AutoDiscoveryReport />} />
                
                <Route path="/AutomationSetup" element={<AutomationSetup />} />
                
                <Route path="/Book" element={<Book />} />
                
                <Route path="/BusinessIntelligence" element={<BusinessIntelligence />} />
                
                <Route path="/Calendar" element={<Calendar />} />
                
                <Route path="/CallCenter" element={<CallCenter />} />
                
                <Route path="/CallHistory" element={<CallHistory />} />
                
                <Route path="/CampaignAnalytics" element={<CampaignAnalytics />} />
                
                <Route path="/Campaigns" element={<Campaigns />} />
                
                <Route path="/Channels" element={<Channels />} />
                
                <Route path="/Clients" element={<Clients />} />
                
                <Route path="/ComplianceChecklist" element={<ComplianceChecklist />} />
                
                <Route path="/ComplianceSummary" element={<ComplianceSummary />} />
                
                <Route path="/ComplianceTesting" element={<ComplianceTesting />} />
                
                <Route path="/Concierge" element={<Concierge />} />
                
                <Route path="/ConciergeWidget" element={<ConciergeWidget />} />
                
                <Route path="/ConnectSquare" element={<ConnectSquare />} />
                
                <Route path="/ConversationHistory" element={<ConversationHistory />} />
                
                <Route path="/CustomerView" element={<CustomerView />} />
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/DataPolicy" element={<DataPolicy />} />
                
                <Route path="/FeatureInventory" element={<FeatureInventory />} />
                
                <Route path="/FeedbackManager" element={<FeedbackManager />} />
                
                <Route path="/Guide" element={<Guide />} />
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Inbox" element={<Inbox />} />
                
                <Route path="/IntentMonitor" element={<IntentMonitor />} />
                
                <Route path="/KnowledgeBase" element={<KnowledgeBase />} />
                
                <Route path="/Landing" element={<Landing />} />
                
                <Route path="/LiveDemo" element={<LiveDemo />} />
                
                <Route path="/MarketplaceAudit" element={<MarketplaceAudit />} />
                
                <Route path="/MarketplaceReadiness" element={<MarketplaceReadiness />} />
                
                <Route path="/Pricing" element={<Pricing />} />
                
                <Route path="/Privacy" element={<Privacy />} />
                
                <Route path="/ProactiveOutreach" element={<ProactiveOutreach />} />
                
                <Route path="/ProductIntelligence" element={<ProductIntelligence />} />
                
                <Route path="/Products" element={<Products />} />
                
                <Route path="/ReputationManager" element={<ReputationManager />} />
                
                <Route path="/RetentionAnalytics" element={<RetentionAnalytics />} />
                
                <Route path="/RetentionEngine" element={<RetentionEngine />} />
                
                <Route path="/RevenueForecast" element={<RevenueForecast />} />
                
                <Route path="/SEOIntelligence" element={<SEOIntelligence />} />
                
                <Route path="/SaasAnalytics" element={<SaasAnalytics />} />
                
                <Route path="/SaasClientAutomations" element={<SaasClientAutomations />} />
                
                <Route path="/SaasDashboard" element={<SaasDashboard />} />
                
                <Route path="/SaasOnboarding" element={<SaasOnboarding />} />
                
                <Route path="/SaasOnboardingSuccess" element={<SaasOnboardingSuccess />} />
                
                <Route path="/Search" element={<Search />} />
                
                <Route path="/ServiceIntelligence" element={<ServiceIntelligence />} />
                
                <Route path="/ServiceRecords" element={<ServiceRecords />} />
                
                <Route path="/Services" element={<Services />} />
                
                <Route path="/Settings" element={<Settings />} />
                
                <Route path="/SquareDisclaimer" element={<SquareDisclaimer />} />
                
                <Route path="/SquareSetup" element={<SquareSetup />} />
                
                <Route path="/SquareSync" element={<SquareSync />} />
                
                <Route path="/StylistPerformance" element={<StylistPerformance />} />
                
                <Route path="/SubscriptionManagement" element={<SubscriptionManagement />} />
                
                <Route path="/SystemHealth" element={<SystemHealth />} />
                
                <Route path="/SystemStatus" element={<SystemStatus />} />
                
                <Route path="/TenantSettings" element={<TenantSettings />} />
                
                <Route path="/Terms" element={<Terms />} />
                
                <Route path="/VersionLog" element={<VersionLog />} />
                
                <Route path="/VoiceGeoRank" element={<VoiceGeoRank />} />
                
                <Route path="/WebsiteAnalyzer" element={<WebsiteAnalyzer />} />
                                
                <Route path="/AIScheduling" element={<AIScheduling />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}
