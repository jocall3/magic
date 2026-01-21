import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { 
  Table, 
  Button, 
  Typography, 
  Input, 
  Modal, 
  Tag, 
  Badge, 
  Card, 
  Tabs, 
  Statistic, 
  Timeline, 
  Tooltip, 
  Empty, 
  Spin, 
  Progress, 
  Divider, 
  List, 
  Avatar, 
  Space, 
  Alert,
  Form,
  Select,
  Switch,
  Drawer
} from 'antd';
import { 
  EyeOutlined, 
  DownloadOutlined, 
  RobotOutlined, 
  SafetyCertificateOutlined, 
  AuditOutlined, 
  LineChartOutlined, 
  SendOutlined, 
  SecurityScanOutlined, 
  ThunderboltOutlined, 
  LockOutlined, 
  HistoryOutlined, 
  CloudSyncOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  GlobalOutlined,
  CarOutlined,
  KeyOutlined,
  FileSearchOutlined,
  DatabaseOutlined
} from '@ant-design/icons';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { GoogleGenAI } from "@google/genai";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;
const { Option } = Select;

// ================================================================================================
// TYPE DEFINITIONS & INTERFACES
// ================================================================================================

type ReportType = 'voa' | 'voi' | 'voiePayroll' | 'voePayroll' | 'paystatement' | 'transactions' | 'fraud_audit' | 'kyc_nexus';
type ReportStatus = 'success' | 'inProgress' | 'failure' | 'flagged';
type SecurityLevel = 'Standard' | 'Elevated' | 'Sovereign' | 'Architect';

interface Report {
    id: string;
    type: ReportType;
    status: ReportStatus;
    createdDate: string;
    consumerName: string;
    riskScore: number;
    aiSummary?: string;
    metadata: {
        institution: string;
        verifiedBy: string;
        mfaEnabled: boolean;
        encryptionType: string;
        erpSynced: boolean;
    };
}

interface AuditEntry {
    id: string;
    timestamp: string;
    action: string;
    user: string;
    details: string;
    ipAddress: string;
    severity: 'low' | 'medium' | 'high';
}

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
}

interface VerificationReportsViewProps {
  customerId: string;
  consumerId?: string;
}

// ================================================================================================
// MOCK DATA GENERATORS & CONSTANTS
// ================================================================================================

const QUANTUM_COLORS = ['#00f2ff', '#7000ff', '#ff00c8', '#00ff88', '#ff8800'];

const MOCK_REPORTS: Report[] = [
    { 
        id: 'REP-QX-9901', 
        type: 'voa', 
        status: 'success', 
        createdDate: '2024-01-15 09:30:22', 
        consumerName: 'Nexus Corp Holdings', 
        riskScore: 12,
        aiSummary: "Asset verification complete. Liquidity ratios exceed baseline by 42%. No anomalies detected in historical ledger.",
        metadata: { institution: 'Quantum Financial', verifiedBy: 'AI-Oracle-v4', mfaEnabled: true, encryptionType: 'AES-256-GCM', erpSynced: true }
    },
    { 
        id: 'REP-QX-9902', 
        type: 'voi', 
        status: 'inProgress', 
        createdDate: '2024-01-16 14:20:11', 
        consumerName: 'Aether Ventures', 
        riskScore: 25,
        metadata: { institution: 'The Demo Bank', verifiedBy: 'System-Core', mfaEnabled: true, encryptionType: 'Quantum-Safe', erpSynced: false }
    },
    { 
        id: 'REP-QX-9903', 
        type: 'transactions', 
        status: 'flagged', 
        createdDate: '2024-01-14 11:05:55', 
        consumerName: 'Global Logistics Inc', 
        riskScore: 88,
        aiSummary: "CRITICAL: High-frequency cross-border transfers detected without corresponding invoice metadata. Potential AML trigger.",
        metadata: { institution: 'Quantum Financial', verifiedBy: 'Fraud-Sentinel', mfaEnabled: false, encryptionType: 'Standard-TLS', erpSynced: true }
    },
    { 
        id: 'REP-QX-9904', 
        type: 'voiePayroll', 
        status: 'success', 
        createdDate: '2024-01-17 08:00:00', 
        consumerName: 'Stellar Dynamics', 
        riskScore: 5,
        aiSummary: "Payroll verification successful. Employment history matches EIN 2021 records perfectly.",
        metadata: { institution: 'Quantum Financial', verifiedBy: 'AI-Oracle-v4', mfaEnabled: true, encryptionType: 'AES-256-GCM', erpSynced: true }
    },
    { 
        id: 'REP-QX-9905', 
        type: 'kyc_nexus', 
        status: 'failure', 
        createdDate: '2024-01-12 16:45:30', 
        consumerName: 'Unknown Entity 0x44', 
        riskScore: 99,
        aiSummary: "KYC Failure: Identity documents provided are synthetic. Biometric mismatch detected.",
        metadata: { institution: 'The Demo Bank', verifiedBy: 'Biometric-Shield', mfaEnabled: true, encryptionType: 'Quantum-Safe', erpSynced: false }
    }
];

const MOCK_AUDIT_LOGS: AuditEntry[] = [
    { id: 'AUD-1', timestamp: '2024-01-17 10:00:01', action: 'LOGIN_SUCCESS', user: 'Architect_James', details: 'MFA Verified via Quantum Key', ipAddress: '192.168.1.1', severity: 'low' },
    { id: 'AUD-2', timestamp: '2024-01-17 10:05:44', action: 'REPORT_VIEW', user: 'Architect_James', details: 'Viewed REP-QX-9903 (Flagged)', ipAddress: '192.168.1.1', severity: 'medium' },
    { id: 'AUD-3', timestamp: '2024-01-17 10:10:12', action: 'AI_QUERY', user: 'Architect_James', details: 'Requested risk analysis for Global Logistics', ipAddress: '192.168.1.1', severity: 'low' }
];

const ANALYTICS_DATA = [
    { name: 'Mon', success: 40, failure: 2, flagged: 5 },
    { name: 'Tue', success: 30, failure: 1, flagged: 2 },
    { name: 'Wed', success: 55, failure: 0, flagged: 8 },
    { name: 'Thu', success: 45, failure: 3, flagged: 4 },
    { name: 'Fri', success: 60, failure: 1, flagged: 1 },
];

// ================================================================================================
// MAIN COMPONENT: VerificationReportsView
// ================================================================================================

const VerificationReportsView: React.FC<VerificationReportsViewProps> = ({ customerId, consumerId }) => {
  // --- State Management ---
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>(MOCK_AUDIT_LOGS);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { 
        id: 'welcome', 
        role: 'assistant', 
        content: "Welcome to the Quantum Financial Intelligence Command Center. I am your Neural Strategist. I've analyzed the EIN 2021 cryptic messages and synchronized the global bank demo protocols. How shall we 'kick the tires' today?", 
        timestamp: new Date().toLocaleTimeString() 
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [reportTypeFilter, setReportTypeFilter] = useState<ReportType | ''>('');
  const [reportStatusFilter, setReportStatusFilter] = useState<ReportStatus | ''>('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isChatDrawerVisible, setIsChatDrawerVisible] = useState(false);
  const [securityLevel, setSecurityLevel] = useState<SecurityLevel>('Architect');
  const [isSimulationMode, setIsSimulationMode] = useState(true);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- AI Initialization ---
  const genAI = useMemo(() => new GoogleGenAI(process.env.GEMINI_API_KEY || ""), []);

  // --- Helper Functions ---
  const logAction = useCallback((action: string, details: string, severity: AuditEntry['severity'] = 'low') => {
    const newEntry: AuditEntry = {
        id: `AUD-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').split('.')[0],
        action,
        user: `Architect_James_${securityLevel}`,
        details,
        ipAddress: '10.0.0.254 (Quantum-VPN)',
        severity
    };
    setAuditTrail(prev => [newEntry, ...prev]);
    console.log(`[AUDIT STORAGE] ${action}: ${details}`);
  }, [securityLevel]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();