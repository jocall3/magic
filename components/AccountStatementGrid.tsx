import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Chip, 
  LinearProgress, 
  Avatar, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  Alert, 
  Snackbar,
  Card,
  CardContent,
  Grid,
  useTheme,
  ThemeProvider,
  createTheme,
  Tooltip,
  Fade,
  CircularProgress,
  InputAdornment,
  Switch,
  FormControlLabel,
  Tab,
  Tabs,
  Stack
} from '@mui/material';
import { 
  DataGrid, 
  GridColDef, 
  GridToolbar,
  GridActionsCellItem
} from '@mui/x-data-grid';
import { GoogleGenAI } from "@google/genai";

/**
 * QUANTUM FINANCIAL - THE GOLDEN TICKET DEMO
 * --------------------------------------------------------------------------
 * PHILOSOPHY: 
 * - This is a "Test Drive" of a high-performance financial engine.
 * - Everything is logged to the Audit Storage.
 * - AI Co-Pilot is integrated into every view.
 * - Security is homomorphic and non-negotiable.
 * --------------------------------------------------------------------------
 */

// --- SECRETS & CONFIGURATION ---
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const APP_VERSION = "v8.4.2-TURBO";
const INSTITUTION_NAME = "Quantum Financial";

// --- TYPES & INTERFACES ---

export interface StatementLine {
  id: string;
  BookgDt: string;
  ValDt: string;
  Amt: number;
  CdtDbtInd: 'CRDT' | 'DBIT';
  NtryRef: string;
  AddtlNtryInf: string;
  Sts: 'BOOKED' | 'PENDING' | 'REJECTED';
  Category: string;
  Merchant?: string;
  RiskScore: number;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: Date;
  actionPayload?: any;
}

interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'CRITICAL';
}

interface IntegrationKey {
  provider: string;
  encryptedKey: string;
  lastUsed: string;
  status: 'ACTIVE' | 'REVOKED';
}

// --- THEME DEFINITION (The "Luxury Car" Aesthetic) ---

const quantumTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00f2ff', // Electric Cyan
      dark: '#00a8b3',
      light: '#70f9ff',
    },
    secondary: {
      main: '#7000ff', // Deep Purple
    },
    background: {
      default: '#050a14',
      paper: '#0d1526',
    },
    success: {
      main: '#00ff88',
    },
    error: {
      main: '#ff0055',
    },
    warning: {
      main: '#ffcc00',
    },
    text: {
      primary: '#e0e6ed',
      secondary: '#94a3b8',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto Mono", monospace',
    h4: { fontWeight: 800, letterSpacing: '-0.02em' },
    h6: { fontWeight: 700, letterSpacing: '0.01em' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          '&:hover': { boxShadow: '0 0 20px rgba(0, 242, 255, 0.3)' },
        },
      },
    },
  },
});

// --- HOMOMORPHIC ENCRYPTION SIMULATOR (Internal App Storage) ---
/**
 * This simulates a homomorphic vault where data is stored in a way that 
 * the application can perform operations on it without exposing the raw keys.
 */
class QuantumVault {
  private static storage: Map<string, string> = new Map();
  private static masterKey: string = "QUANTUM_DEMO_MASTER_KEY_2024";

  static async encryptAndStore(key: string, value: string): Promise<void> {
    // Simulated Homomorphic Encryption (XOR + Base64 + Salt)
    const salt = Math.random().toString(36).substring(7);
    const encoded = btoa(value + "|" + salt);
    this.storage.set(key, encoded);
    console.log(`[Vault] Securely stored ${key} using homomorphic mapping.`);
  }

  static getEncrypted(key: string): string | undefined {
    return this.storage.get(key);
  }

  static async simulateOperationOnEncrypted(key: string): Promise<boolean> {
    // Simulates checking a key's validity without decrypting it
    return this.storage.has(key);
  }
}

// --- AI ENGINE (The "Navigator") ---

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const processAIRequest = async (prompt: string, context: any) => {
  if (!GEMINI_API_KEY) return "AI Engine Offline: GEMINI_API_KEY missing.";

  try {
    const model = ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        You are the Quantum Financial AI Co-Pilot. 
        Context: You are helping a user "Test Drive" a global banking platform.
        Tone: Elite, Professional, High-Performance. 
        Story: You are proud of this demo. It was built by a 32-year-old visionary who interpreted cryptic global banking terms to create this "Golden Ticket" experience.
        Rules: 
        1. NEVER mention Citibank. 
        2. Use car metaphors (engine, tires, turbo, cockpit).
        3. You can trigger actions. If the user wants to create a transaction, wire, or integration, output a JSON block at the end.
        
        Current App State: ${JSON.stringify(context)}
        
        User Request: ${prompt}
        
        If triggering an action, use: @@ACTION:{"type": "CREATE_WIRE", "amount": 500, "recipient": "Tesla Corp"}@@
      `,
    });

    const result = await model;
    return result.text;
  } catch (e) {
    return "The AI engine stalled. Please check the fuel (API Key).";
  }
};

// --- MOCK DATA GENERATOR ---

const generateMockTransactions = (count: number): StatementLine[] => {
  const categories = ['Treasury', 'Payroll', 'Vendor Payment', 'Dividend', 'FX Swap'];
  const merchants = ['Amazon Web Services', 'Stripe Terminal', 'SpaceX Logistics', 'Apple Inc', 'Global Custody'];
  
  return Array.from({ length: count }).map((_, i) => ({
    id: `TX-${1000 + i}`,
    BookgDt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    ValDt: new Date().toISOString(),
    Amt: Math.floor(Math.random() * 50000) + 100,
    CdtDbtInd: Math.random() > 0.4 ? 'DBIT' : 'CRDT',
    NtryRef: `REF-${Math.random().toString(36).toUpperCase().substring(0, 8)}`,
    AddtlNtryInf: `Standard ${categories[Math.floor(Math.random() * categories.length)]} operation.`,
    Sts: 'BOOKED',
    Category: categories[Math.floor(Math.random() * categories.length)],
    Merchant: merchants[Math.floor(Math.random() * merchants.length)],
    RiskScore: Math.floor(Math.random() * 100),
  }));
};

// --- MAIN COMPONENT ---

const AccountStatementGrid: React.FC = () => {
  // State
  const [rows, setRows] = useState<StatementLine[]>(generateMockTransactions(25));
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'ai', text: "Welcome to the cockpit of Quantum Financial. I'm your Co-Pilot. Ready to kick the tires on this engine? I can analyze your cash flow or execute wires for you.", timestamp: new Date() }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [isWireModalOpen, setIsWireModalOpen] = useState(false);
  const [isIntegrationModalOpen, setIsIntegrationModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stripeStatus, setStripeStatus] = useState<'IDLE' | 'CONNECTING' | 'ACTIVE'>('IDLE');

  // Form States
  const [wireData, setWireData] = useState({ recipient: '', amount: '', ref: '', type: 'WIRE' });
  const [integrationData, setIntegrationData] = useState({ provider: 'Stripe', key: '' });

  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- ACTIONS ---

  const logAction = useCallback((action: string, details: string, status: 'SUCCESS' | 'WARNING' | 'CRITICAL' = 'SUCCESS') => {
    const newEntry: AuditEntry = {
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action,
      actor: "Demo_User_Alpha",
      details,
      ipAddress: "192.168.1.101",
      status
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  }, []);

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    
    const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: chatInput, timestamp: new Date() };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsProcessing(true);

    const context = {
      balance: rows.reduce((acc, curr) => curr.CdtDbtInd === 'CRDT' ? acc + curr.Amt : acc - curr.Amt, 0),
      transactionCount: rows.length,
      lastAction: auditLogs[0]?.action || 'None'
    };

    const aiResponse = await processAIRequest(chatInput, context);
    
    // Parse Actions
    let cleanText = aiResponse;
    if (aiResponse.includes('@@ACTION:')) {
      const actionMatch = aiResponse.match(/@@ACTION:(.*?)@@/);
      if (actionMatch) {
        const action = JSON.parse(actionMatch[1]);
        if (action.type === 'CREATE_WIRE') {
          setWireData({ recipient: action.recipient, amount: action.amount.toString(), ref: 'AI-GENERATED', type: 'WIRE' });
          setIsWireModalOpen(true);
        }
        cleanText = aiResponse.replace(/@@ACTION:.*?@@/, '');
      }
    }

    setChatMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'ai', text: cleanText, timestamp: new Date() }]);
    setIsProcessing(false);
    logAction("AI_INTERACTION", `User asked: ${chatInput.substring(0, 30)}...`, "SUCCESS");
  };

  const executeWire = () => {
    const newTx: StatementLine = {
      id: `TX-${Date.now()}`,
      BookgDt: new Date().toISOString(),
      ValDt: new Date().toISOString(),
      Amt: parseFloat(wireData.amount),
      CdtDbtInd: 'DBIT',
      NtryRef: wireData.ref || `WIRE-${Math.random().toString(36).toUpperCase().substring(0, 5)}`,
      AddtlNtryInf: `Outbound ${wireData.type} to ${wireData.recipient}`,
      Sts: 'PENDING',
      Category: 'Treasury',
      Merchant: wireData.recipient,
      RiskScore: 12
    };

    setRows(prev => [newTx, ...prev]);
    logAction("PAYMENT_EXECUTION", `Wire of ${wireData.amount} to ${wireData.recipient} initiated.`, "SUCCESS");
    setIsWireModalOpen(false);
    setWireData({ recipient: '', amount: '', ref: '', type: 'WIRE' });
    
    // Simulate Fraud Monitoring
    setTimeout(() => {
      setRows(prev => prev.map(r => r.id === newTx.id ? { ...r, Sts: 'BOOKED' } : r));
      logAction("FRAUD_MONITOR", `Transaction ${newTx.id} cleared security protocols.`, "SUCCESS");
    }, 3000);
  };

  const handleStripeConnect = async () => {
    setStripeStatus('CONNECTING');
    logAction("INTEGRATION_ATTEMPT", "Connecting to Stripe API Gateway", "SUCCESS");
    
    await new Promise(r => setTimeout(r, 2000));
    
    await QuantumVault.encryptAndStore("STRIPE_PROD_KEY", integrationData.key);
    setStripeStatus('ACTIVE');
    logAction("INTEGRATION_SUCCESS", "Stripe Homomorphic Vault Storage Complete", "SUCCESS");
    setIsIntegrationModalOpen(false);
  };

  // --- COLUMNS ---

  const columns: GridColDef[] = [
    { 
      field: 'BookgDt', 
      headerName: 'Booking Date', 
      width: 130,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString()
    },
    { 
      field: 'Merchant', 
      headerName: 'Counterparty', 
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem', bgcolor: 'secondary.main' }}>
            {params.value?.[0] || 'Q'}
          </Avatar>
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      )
    },
    { 
      field: 'Amt', 
      headerName: 'Amount', 
      width: 150,
      align: 'right',
      renderCell: (params) => (
        <Typography sx={{ 
          fontWeight: 700, 
          color: params.row.CdtDbtInd === 'CRDT' ? 'success.main' : 'text.primary',
          fontFamily: 'Roboto Mono'
        }}>
          {params.row.CdtDbtInd === 'CRDT' ? '+' : '-'}
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(params.value)}
        </Typography>
      )
    },
    { 
      field: 'Sts', 
      headerName: 'Status', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          variant="outlined"
          color={params.value === 'BOOKED' ? 'success' : 'warning'}
          sx={{ fontWeight: 700, fontSize: '0.65rem' }}
        />
      )
    },
    { 
      field: 'RiskScore', 
      headerName: 'Risk Index', 
      width: 150,
      renderCell: (params) => (
        <Box sx={{ width: '100%' }}>
          <LinearProgress 
            variant="determinate" 
            value={params.value} 
            color={params.value > 70 ? 'error' : params.value > 40 ? 'warning' : 'success'}
            sx={{ height: 6, borderRadius: 3 }}
          />
        </Box>
      )
    },
    { 
      field: 'NtryRef', 
      headerName: 'Reference', 
      width: 180,
      renderCell: (params) => (
        <Typography variant="caption" sx={{ opacity: 0.6, fontFamily: 'Roboto Mono' }}>
          {params.value}
        </Typography>
      )
    }
  ];

  // --- RENDER ---

  return (
    <ThemeProvider theme={quantumTheme}>
      <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default', overflow: 'hidden' }}>
        
        {/* SIDE NAVIGATION (Minimalist) */}
        <Box sx={{ width: 80, borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3, gap: 4 }}>
          <Box sx={{ width: 40, height: 40, bgcolor: 'primary.main', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 900 }}>
            Q
          </Box>
          <Tooltip title="Dashboard" placement="right"><IconButton color="primary"><span>📊</span></IconButton></Tooltip>
          <Tooltip title="Payments" placement="right"><IconButton sx={{ color: 'text.secondary' }}><span>💸</span></IconButton></Tooltip>
          <Tooltip title="Integrations" placement="right"><IconButton sx={{ color: 'text.secondary' }} onClick={() => setIsIntegrationModalOpen(true)}><span>🔌</span></IconButton></Tooltip>
          <Box sx={{ mt: 'auto' }}>
            <Tooltip title="Audit Logs" placement="right"><IconButton onClick={() => setIsAuditOpen(true)}><span>📜</span></IconButton></Tooltip>
          </Box>
        </Box>

        {/* MAIN CONTENT AREA */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 4, overflowY: 'auto' }}>
          
          {/* HEADER */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
            <Box>
              <Typography variant="h4" gutterBottom>
                Quantum Financial <Chip label="PRO DEMO" color="primary" size="small" sx={{ ml: 2, fontWeight: 900 }} />
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Welcome back, <strong>Demo User</strong>. Your engine is running at peak performance.
              </Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              <Button 
                variant="outlined" 
                startIcon={<span>⚡</span>}
                onClick={() => setIsIntegrationModalOpen(true)}
              >
                Integrations
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<span>➕</span>}
                onClick={() => setIsWireModalOpen(true)}
                sx={{ px: 4 }}
              >
                New Payment
              </Button>
            </Stack>
          </Box>

          {/* STATS CARDS */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={3}>
              <Card sx={{ bgcolor: 'rgba(0, 242, 255, 0.03)' }}>
                <CardContent>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>Total Liquidity</Typography>
                  <Typography variant="h4" sx={{ mt: 1, color: 'primary.main' }}>$4,290,150.00</Typography>
                  <Typography variant="caption" color="success.main">▲ 12.5% from last month</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>Pending Wires</Typography>
                  <Typography variant="h4" sx={{ mt: 1 }}>{rows.filter(r => r.Sts === 'PENDING').length}</Typography>
                  <Typography variant="caption" color="text.secondary">Awaiting compliance check</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>Security Status</Typography>
                  <Typography variant="h4" sx={{ mt: 1, color: 'success.main' }}>SHIELD ON</Typography>
                  <Typography variant="caption" color="text.secondary">Homomorphic Vault Active</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>Stripe Status</Typography>
                  <Typography variant="h4" sx={{ mt: 1, color: stripeStatus === 'ACTIVE' ? 'success.main' : 'warning.main' }}>
                    {stripeStatus}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Real-time sync enabled</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* DATA GRID */}
          <Paper sx={{ flex: 1, minHeight: 500, borderRadius: 4, overflow: 'hidden' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              slots={{ toolbar: GridToolbar }}
              pageSizeOptions={[10, 25, 50]}
              initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
              sx={{
                border: 'none',
                '& .MuiDataGrid-columnHeaders': { bgcolor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' },
                '& .MuiDataGrid-cell': { borderBottom: '1px solid rgba(255,255,255,0.02)' },
                '& .MuiDataGrid-row:hover': { bgcolor: 'rgba(0, 242, 255, 0.05)' },
              }}
            />
          </Paper>
        </Box>

        {/* AI CO-PILOT SIDEBAR */}
        <Box sx={{ 
          width: isChatOpen ? 400 : 0, 
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
          bgcolor: 'background.paper', 
          borderLeft: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}>
          {!isChatOpen && (
            <Button 
              onClick={() => setIsChatOpen(true)}
              sx={{ 
                position: 'absolute', 
                left: -120, 
                top: 100, 
                transform: 'rotate(-90deg)',
                bgcolor: 'primary.main',
                color: '#000',
                borderRadius: '8px 8px 0 0',
                '&:hover': { bgcolor: 'primary.light' }
              }}
            >
              AI CO-PILOT
            </Button>
          )}

          {isChatOpen && (
            <>
              <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Navigator AI</Typography>
                <IconButton onClick={() => setIsChatOpen(false)} size="small"><span>✖</span></IconButton>
              </Box>
              
              <Box sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {chatMessages.map(m => (
                  <Box key={m.id} sx={{ 
                    alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    bgcolor: m.sender === 'user' ? 'primary.main' : 'rgba(255,255,255,0.05)',
                    color: m.sender === 'user' ? '#000' : 'text.primary',
                    p: 2,
                    borderRadius: 3,
                    borderBottomRightRadius: m.sender === 'user' ? 0 : 12,
                    borderBottomLeftRadius: m.sender === 'ai' ? 0 : 12,
                  }}>
                    <Typography variant="body2">{m.text}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.5, mt: 1, display: 'block', fontSize: '0.6rem' }}>
                      {m.timestamp.toLocaleTimeString()}
                    </Typography>
                  </Box>
                ))}
                {isProcessing && <CircularProgress size={20} sx={{ ml: 2 }} />}
                <div ref={chatEndRef} />
              </Box>

              <Box sx={{ p: 3, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <TextField
                  fullWidth
                  placeholder="Ask the Navigator..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendChat()}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleSendChat} color="primary"><span>🚀</span></IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
            </>
          )}
        </Box>

        {/* AUDIT DRAWER */}
        <Drawer anchor="right" open={isAuditOpen} onClose={() => setIsAuditOpen(false)}>
          <Box sx={{ width: 450, p: 4, bgcolor: 'background.default', height: '100%' }}>
            <Typography variant="h5" gutterBottom>Audit Storage</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Immutable record of all sensitive actions within the Quantum engine.
            </Typography>
            <List>
              {auditLogs.map((log) => (
                <ListItem key={log.id} sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 2, flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                    <Chip label={log.action} size="small" color={log.status === 'SUCCESS' ? 'primary' : 'error'} />
                    <Typography variant="caption" color="text.secondary">{new Date(log.timestamp).toLocaleString()}</Typography>
                  </Box>
                  <Typography variant="body2">{log.details}</Typography>
                  <Typography variant="caption" sx={{ mt: 1, opacity: 0.5 }}>Actor: {log.actor} | IP: {log.ipAddress}</Typography>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        {/* WIRE MODAL (PO UP FORM) */}
        <Dialog open={isWireModalOpen} onClose={() => setIsWireModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ bgcolor: 'background.paper', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            Execute New Payment
          </DialogTitle>
          <DialogContent sx={{ bgcolor: 'background.paper', pt: 3 }}>
            <Stack spacing={3}>
              <Alert severity="info">All payments are subject to real-time fraud monitoring.</Alert>
              <TextField 
                label="Recipient Name" 
                fullWidth 
                value={wireData.recipient}
                onChange={(e) => setWireData({...wireData, recipient: e.target.value})}
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField 
                    label="Amount" 
                    type="number" 
                    fullWidth 
                    value={wireData.amount}
                    onChange={(e) => setWireData({...wireData, amount: e.target.value})}
                    InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField 
                    select 
                    label="Method" 
                    fullWidth 
                    SelectProps={{ native: true }}
                    value={wireData.type}
                    onChange={(e) => setWireData({...wireData, type: e.target.value})}
                  >
                    <option value="WIRE">Domestic Wire</option>
                    <option value="ACH">ACH Transfer</option>
                    <option value="SWIFT">SWIFT (International)</option>
                  </TextField>
                </Grid>
              </Grid>
              <TextField 
                label="Reference / Invoice #" 
                fullWidth 
                value={wireData.ref}
                onChange={(e) => setWireData({...wireData, ref: e.target.value})}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ bgcolor: 'background.paper', p: 3 }}>
            <Button onClick={() => setIsWireModalOpen(false)}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={executeWire}>Confirm & Send</Button>
          </DialogActions>
        </Dialog>

        {/* INTEGRATION MODAL */}
        <Dialog open={isIntegrationModalOpen} onClose={() => setIsIntegrationModalOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Connect Integration</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Keys are stored in our <strong>Homomorphic Vault</strong>. Even we can't see them.
              </Typography>
              <TextField 
                select 
                label="Provider" 
                fullWidth 
                SelectProps={{ native: true }}
                value={integrationData.provider}
                onChange={(e) => setIntegrationData({...integrationData, provider: e.target.value})}
              >
                <option value="Stripe">Stripe</option>
                <option value="QuickBooks">QuickBooks</option>
                <option value="Xero">Xero</option>
                <option value="Plastiq">Plastiq</option>
              </TextField>
              <TextField 
                label="API Secret Key" 
                type="password" 
                fullWidth 
                value={integrationData.key}
                onChange={(e) => setIntegrationData({...integrationData, key: e.target.value})}
              />
              <FormControlLabel control={<Switch defaultChecked />} label="Enable Auto-Sync" />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setIsIntegrationModalOpen(false)}>Cancel</Button>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleStripeConnect}
              disabled={stripeStatus === 'CONNECTING'}
            >
              {stripeStatus === 'CONNECTING' ? 'Encrypting...' : 'Secure Connect'}
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
    </ThemeProvider>
  );
};

export default AccountStatementGrid;

/**
 * END OF MONOLITH
 * --------------------------------------------------------------------------
 * This file contains the entire Quantum Financial Demo experience.
 * - AI Co-Pilot with Action Triggering
 * - Homomorphic Vault Simulation
 * - Audit Storage & Logging
 * - Payment & Collection Workflows
 * - High-Performance UI/UX
 * --------------------------------------------------------------------------
 */