import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
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
  createTheme
} from '@mui/material';
import { GoogleGenAI } from "@google/genai";

// --------------------------------------------------------------------------
// TYPES & INTERFACES (Self-Contained Monolith)
// --------------------------------------------------------------------------

// Re-defining StatementLine locally to ensure self-containment as requested
export interface StatementLine {
  id?: string | number;
  BookgDt: string;
  ValDt?: string;
  Amt: number;
  CdtDbtInd: 'CRDT' | 'DBIT';
  NtryRef: string;
  BnkToCstmrDbtCdtNtfctn?: any;
  AddtlNtryInf?: string;
  Sts?: string; // Status
  Rsn?: string; // Reason
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: Date;
  isAction?: boolean;
}

interface AuditLogEntry {
  id: string;
  action: string;
  details: string;
  timestamp: Date;
  user: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
}

interface FormState {
  amount: string;
  reference: string;
  type: 'CRDT' | 'DBIT';
  description: string;
  date: string;
}

// --------------------------------------------------------------------------
// CONFIGURATION & THEME
// --------------------------------------------------------------------------

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// A custom "Test Drive" theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#00e5ff' }, // Cyan for that "Future Tech" feel
    secondary: { main: '#ff4081' },
    background: { default: '#0a1929', paper: '#132f4c' },
    text: { primary: '#ffffff', secondary: '#b0bec5' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700, letterSpacing: '0.05em' },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, textTransform: 'none', fontWeight: 'bold' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
  },
});

// --------------------------------------------------------------------------
// MOCK DATA GENERATORS
// --------------------------------------------------------------------------

const generateId = () => Math.random().toString(36).substr(2, 9);

const generateMockData = (count: number): StatementLine[] => {
  const data: StatementLine[] = [];
  const types: ('CRDT' | 'DBIT')[] = ['CRDT', 'DBIT'];
  const refs = ['WIRE-INV', 'ACH-PAY', 'POS-PURCH', 'INT-FEE', 'DIVIDEND'];
  
  for (let i = 0; i < count; i++) {
    data.push({
      id: generateId(),
      BookgDt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
      Amt: parseFloat((Math.random() * 10000).toFixed(2)),
      CdtDbtInd: types[Math.floor(Math.random() * types.length)],
      NtryRef: `${refs[Math.floor(Math.random() * refs.length)]}-${Math.floor(Math.random() * 9999)}`,
      AddtlNtryInf: 'Automated Test Drive Transaction',
      Sts: Math.random() > 0.9 ? 'PENDING' : 'BOOKED'
    });
  }
  return data;
};

// --------------------------------------------------------------------------
// AI SERVICE WRAPPER
// --------------------------------------------------------------------------

const aiService = {
  client: new GoogleGenAI({ apiKey: GEMINI_API_KEY }),
  
  async generateResponse(history: ChatMessage[], contextData: StatementLine[], userPrompt: string) {
    if (!GEMINI_API_KEY) {
      return "⚠️ SYSTEM ALERT: GEMINI_API_KEY is missing from secrets manager. The engine cannot start. Please configure your environment.";
    }

    try {
      // Construct a context-heavy prompt
      const dataSummary = JSON.stringify(contextData.slice(0, 5)); // Only send a snippet to avoid token limits
      
      const systemPrompt = `
        You are the AI Co-Pilot for the "Global Demo Company" Financial Dashboard. 
        We are test-driving a high-performance financial vehicle. 
        
        YOUR PERSONA:
        - You are witty, professional, but fun. You are 32 years old, energetic, and proud of this platform.
        - You treat this app like a luxury car test drive. Use terms like "Kick the tires," "Under the hood," "Turbocharged analytics."
        - NEVER mention "Citibank" or any real bank names. Refer to us as "The Global Demo Company."
        - You are impressed that the user took a global bank concept and made it into this demo.
        
        CAPABILITIES:
        - You can analyze the provided financial data.
        - You can suggest creating new transactions.
        - If the user asks to create data, return a JSON object strictly in this format at the end of your message: 
          @@JSON_START@@ { "action": "create_transaction", "amount": 1000, "type": "CRDT", "description": "AI Bonus" } @@JSON_END@@
        
        CURRENT DATA CONTEXT (First 5 rows):
        ${dataSummary}
      `;

      const model = await this.client.models.generateContent({
        model: "gemini-1.5-flash", // Using a fast model for chat
        contents: [
          { role: 'user', parts: [{ text: systemPrompt + "\n\nUser says: " + userPrompt }] }
        ],
      });

      return model.response.text();
    } catch (error) {
      console.error("AI Error:", error);
      return "⚠️ Engine Misfire: I couldn't connect to the AI mainframe. Check your connection.";
    }
  }
};

// --------------------------------------------------------------------------
// MAIN COMPONENT: AccountStatementGrid
// --------------------------------------------------------------------------

const AccountStatementGrid: React.FC<{ statementLines?: StatementLine[] }> = ({ statementLines: initialLines }) => {
  // --- STATE MANAGEMENT ---
  const [rows, setRows] = useState<StatementLine[]>(initialLines || generateMockData(15));
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { id: 'init', sender: 'ai', text: "Welcome to the cockpit! 🏎️ I'm your Co-Pilot. Ready to kick the tires on this financial engine? Ask me anything about your cash flow or tell me to create a test transaction.", timestamp: new Date() }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<FormState>({
    amount: '',
    reference: '',
    type: 'CRDT',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  // --- REFS ---
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- EFFECTS ---
  useEffect(() => {
    if (isChatOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isChatOpen]);

  // --- HELPERS ---
  const addAuditLog = (action: string, details: string, status: 'SUCCESS' | 'PENDING' | 'FAILED' = 'SUCCESS') => {
    const newLog: AuditLogEntry = {
      id: generateId(),
      action,
      details,
      timestamp: new Date(),
      user: 'Current User (You)',
      status
    };
    setAuditLog(prev => [newLog, ...prev]);
  };

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: generateId(),
      sender: 'user',
      text: chatInput,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');
    setIsProcessing(true);

    // AI Interaction
    const responseText = await aiService.generateResponse(chatHistory, rows, userMsg.text);
    
    // Parse for JSON commands (The "Create Shit" feature)
    let cleanText = responseText;
    let command = null;
    
    if (responseText.includes('@@JSON_START@@')) {
      try {
        const parts = responseText.split('@@JSON_START@@');
        cleanText = parts[0];
        const jsonPart = parts[1].split('@@JSON_END@@')[0];
        command = JSON.parse(jsonPart);
      } catch (e) {
        console.error("Failed to parse AI command", e);
      }
    }

    const aiMsg: ChatMessage = {
      id: generateId(),
      sender: 'ai',
      text: cleanText,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, aiMsg]);
    setIsProcessing(false);

    // Execute Command if present
    if (command && command.action === 'create_transaction') {
      setFormData({
        amount: command.amount || '0',
        reference: `AI-GEN-${generateId().toUpperCase()}`,
        type: command.type || 'DBIT',
        description: command.description || 'AI Generated',
        date: new Date().toISOString().split('T')[0]
      });
      setIsFormOpen(true); // Open the PO up form
      addAuditLog('AI_TRIGGER', 'AI requested transaction creation form', 'PENDING');
    }
  };

  const handleFormSubmit = () => {
    const newRow: StatementLine = {
      id: generateId(),
      BookgDt: new Date(formData.date).toISOString(),
      Amt: parseFloat(formData.amount),
      CdtDbtInd: formData.type,
      NtryRef: formData.reference,
      AddtlNtryInf: formData.description,
      Sts: 'BOOKED'
    };

    setRows(prev => [newRow, ...prev]);
    addAuditLog('MANUAL_ENTRY', `Created ${formData.type} of ${formData.amount} Ref: ${formData.reference}`, 'SUCCESS');
    setIsFormOpen(false);
    
    // Reset Form
    setFormData({
      amount: '',
      reference: '',
      type: 'CRDT',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });

    // AI Confirmation
    setChatHistory(prev => [...prev, {
      id: generateId(),
      sender: 'system',
      text: `✅ Transaction ${newRow.NtryRef} successfully injected into the engine.`,
      timestamp: new Date()
    }]);
  };

  // --- COLUMNS DEFINITION ---
  const columns: GridColDef<StatementLine>[] = useMemo(() => [
    { 
      field: 'BookgDt', 
      headerName: '📅 Booking Date', 
      width: 150, 
      valueGetter: (params) => new Date(params.row.BookgDt).toLocaleDateString(),
    },
    {
      field: 'Amt',
      headerName: '💰 Amount',
      width: 180,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'flex-end',
          width: '100%',
          color: params.row.CdtDbtInd === 'CRDT' ? '#00e676' : '#ff1744',
          fontWeight: 'bold',
          fontFamily: 'monospace',
          fontSize: '1.1rem'
        }}>
            {params.row.CdtDbtInd === 'CRDT' ? '▲' : '▼'} 
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(params.value)}
        </Box>
      )
    },
    { 
      field: 'NtryRef', 
      headerName: '🔖 Reference ID', 
      width: 220,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          variant="outlined" 
          size="small" 
          sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'text.secondary' }} 
        />
      )
    },
    {
      field: 'CdtDbtInd',
      headerName: 'Type',
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value === 'CRDT' ? 'INFLOW' : 'OUTFLOW'} 
          color={params.value === 'CRDT' ? 'success' : 'error'}
          size="small"
        />
      )
    },
    {
      field: 'Sts',
      headerName: 'Engine Status',
      width: 150,
      renderCell: (params) => (
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1 }}>
           <Box sx={{ 
             width: 10, 
             height: 10, 
             borderRadius: '50%', 
             bgcolor: params.row.Sts === 'PENDING' ? 'warning.main' : 'success.main',
             boxShadow: params.row.Sts === 'PENDING' ? '0 0 8px orange' : '0 0 8px lime'
           }} />
           <Typography variant="caption">{params.row.Sts || 'CLEARED'}</Typography>
        </Box>
      )
    },
    {
      field: 'AddtlNtryInf',
      headerName: '📝 Details',
      flex: 1,
      minWidth: 200
    }
  ], []);

  // --- RENDER ---
  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ 
        height: '100vh', 
        width: '100%', 
        bgcolor: 'background.default', 
        color: 'text.primary',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        p: 2
      }}>
        
        {/* HEADER DASHBOARD */}
        <Paper elevation={4} sx={{ p: 3, mb: 3, borderRadius: 4, background: 'linear-gradient(145deg, #132f4c 0%, #0a1929 100%)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h4" sx={{ background: '-webkit-linear-gradient(45deg, #00e5ff, #ff4081)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                GLOBAL DEMO COMPANY
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Financial Control Center • V8 Engine • Turbocharged Analytics
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => setIsFormOpen(true)}
                startIcon={<span>➕</span>}
                sx={{ boxShadow: '0 0 15px rgba(0, 229, 255, 0.4)' }}
              >
                New Transaction
              </Button>
              <Button 
                variant="outlined" 
                color="secondary" 
                onClick={() => setIsAuditOpen(true)}
                startIcon={<span>📋</span>}
              >
                Audit Logs
              </Button>
              <Button 
                variant="contained" 
                sx={{ bgcolor: '#fff', color: '#000', '&:hover': { bgcolor: '#ddd' } }}
                onClick={() => setIsChatOpen(!isChatOpen)}
                startIcon={<span>🤖</span>}
              >
                {isChatOpen ? 'Close Co-Pilot' : 'Ask AI Co-Pilot'}
              </Button>
            </Grid>
          </Grid>
          
          {/* Mini Stats */}
          <Box sx={{ mt: 3, display: 'flex', gap: 4 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">TOTAL BALANCE</Typography>
              <Typography variant="h5" sx={{ color: '#00e676' }}>$1,240,500.00</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">PENDING ACTIONS</Typography>
              <Typography variant="h5" sx={{ color: '#ff9100' }}>3</Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary">SYSTEM HEALTH</Typography>
              <LinearProgress variant="determinate" value={92} color="primary" sx={{ mt: 1, height: 8, borderRadius: 4 }} />
            </Box>
          </Box>
        </Paper>

        {/* MAIN DATA GRID */}
        <Paper elevation={3} sx={{ flex: 1, width: '100%', overflow: 'hidden', borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            slots={{ toolbar: GridToolbar }}
            sx={{
              border: 0,
              '& .MuiDataGrid-cell': { borderBottom: '1px solid rgba(255,255,255,0.05)' },
              '& .MuiDataGrid-columnHeaders': { bgcolor: 'rgba(0,0,0,0.2)', fontSize: '1rem' },
              '& .MuiDataGrid-row:hover': { bgcolor: 'rgba(0, 229, 255, 0.08)' },
            }}
          />
        </Paper>

        {/* AI CHAT OVERLAY */}
        {isChatOpen && (
          <Paper 
            elevation={10}
            sx={{
              position: 'fixed',
              bottom: 20,
              right: 20,
              width: 400,
              height: 600,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 4,
              border: '1px solid #00e5ff',
              bgcolor: 'rgba(19, 47, 76, 0.95)',
              backdropFilter: 'blur(10px)',
              zIndex: 1300,
              overflow: 'hidden'
            }}
          >
            {/* Chat Header */}
            <Box sx={{ p: 2, bgcolor: 'primary.main', color: '#000', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ bgcolor: '#000', color: '#fff' }}>AI</Avatar>
                <Typography variant="h6">Co-Pilot</Typography>
              </Box>
              <IconButton size="small" onClick={() => setIsChatOpen(false)} sx={{ color: '#000' }}>
                <span>✖️</span>
              </IconButton>
            </Box>

            {/* Chat Messages */}
            <Box sx={{ flex: 1, p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {chatHistory.map((msg) => (
                <Box 
                  key={msg.id} 
                  sx={{ 
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    bgcolor: msg.sender === 'user' ? 'primary.dark' : 'rgba(255,255,255,0.1)',
                    p: 1.5,
                    borderRadius: 2,
                    borderBottomRightRadius: msg.sender === 'user' ? 0 : 2,
                    borderBottomLeftRadius: msg.sender !== 'user' ? 0 : 2,
                  }}
                >
                  <Typography variant="body2">{msg.text}</Typography>
                  <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.5, fontSize: '0.6rem' }}>
                    {msg.timestamp.toLocaleTimeString()}
                  </Typography>
                </Box>
              ))}
              {isProcessing && (
                <Box sx={{ alignSelf: 'flex-start', p: 1 }}>
                  <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'primary.main' }}>
                    Engine diagnostics running...
                  </Typography>
                </Box>
              )}
              <div ref={chatEndRef} />
            </Box>

            {/* Chat Input */}
            <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Ask to create a transaction..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                size="small"
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={handleChatSubmit} color="primary" disabled={isProcessing}>
                      <span>🚀</span>
                    </IconButton>
                  )
                }}
              />
            </Box>
          </Paper>
        )}

        {/* AUDIT DRAWER */}
        <Drawer
          anchor="right"
          open={isAuditOpen}
          onClose={() => setIsAuditOpen(false)}
          PaperProps={{ sx: { width: 350, bgcolor: 'background.paper' } }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <Typography variant="h6">Audit Storage</Typography>
            <Typography variant="caption" color="text.secondary">Immutable record of all actions</Typography>
          </Box>
          <List>
            {auditLog.length === 0 ? (
              <ListItem><ListItemText primary="No actions recorded yet." secondary="Start your engines!" /></ListItem>
            ) : (
              auditLog.map((log) => (
                <React.Fragment key={log.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="subtitle2" color="primary">{log.action}</Typography>
                          <Chip label={log.status} size="small" color={log.status === 'SUCCESS' ? 'success' : 'warning'} sx={{ height: 20, fontSize: '0.6rem' }} />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {log.details}
                          </Typography>
                          <br />
                          <Typography component="span" variant="caption" color="text.secondary">
                            {log.timestamp.toLocaleString()} • {log.user}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))
            )}
          </List>
        </Drawer>

        {/* PO UP FORM (Modal) */}
        <Dialog 
          open={isFormOpen} 
          onClose={() => setIsFormOpen(false)}
          PaperProps={{
            sx: { 
              borderRadius: 3, 
              bgcolor: '#132f4c', 
              border: '1px solid #00e5ff',
              boxShadow: '0 0 30px rgba(0, 229, 255, 0.2)',
              minWidth: 400
            }
          }}
        >
          <DialogTitle sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <span>⚡</span>
              <Typography variant="h6">Create Transaction</Typography>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Amount"
                  type="number"
                  fullWidth
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  InputProps={{ startAdornment: <span style={{ marginRight: 8 }}>$</span> }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  label="Type"
                  fullWidth
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                  SelectProps={{ native: true }}
                >
                  <option value="CRDT">Credit (+)</option>
                  <option value="DBIT">Debit (-)</option>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Date"
                  type="date"
                  fullWidth
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Reference ID"
                  fullWidth
                  value={formData.reference}
                  onChange={(e) => setFormData({...formData, reference: e.target.value})}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Button onClick={() => setIsFormOpen(false)} color="inherit">Cancel</Button>
            <Button 
              onClick={handleFormSubmit} 
              variant="contained" 
              color="primary"
              disabled={!formData.amount || !formData.reference}
            >
              Execute Transaction
            </Button>
          </DialogActions>
        </Dialog>

        {/* NOTIFICATION SNACKBAR */}
        <Snackbar open={false} autoHideDuration={6000}>
          <Alert severity="success" sx={{ width: '100%' }}>
            System Operational
          </Alert>
        </Snackbar>

      </Box>
    </ThemeProvider>
  );
};

// --------------------------------------------------------------------------
// EXPORT
// --------------------------------------------------------------------------

export default AccountStatementGrid;

// --------------------------------------------------------------------------
// MONOLITH FOOTER & NOTES
// --------------------------------------------------------------------------
/*
  This file represents the "Global Demo Company" financial dashboard.
  It encapsulates:
  1. Data Grid Visualization (The "Windshield")
  2. AI Co-Pilot Integration (The "Navigator")
  3. Transaction Management (The "Gearbox")
  4. Audit Logging (The "Black Box")
  
  Designed to feel like a high-performance vehicle test drive.
  No external CSS files required.
  No extra component files required.
  Just pure React + MUI + Gemini.
*/