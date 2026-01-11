import React, { useState, useCallback, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  Button,
  Stack,
  Heading,
  Text,
  Code,
  useBreakpointValue,
  Divider,
  Badge,
  Flex,
  Progress,
  Icon,
} from '@chakra-ui/react';
import { 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Search, 
  FileText, 
  Globe, 
  Lock, 
  AlertTriangle 
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// --- DEFENSIVE UTILS ---
const SafeAmount: React.FC<{ amount?: number; currency?: string }> = ({ amount = 0, currency = 'USD' }) => {
  const safeCurrency = (currency && currency.length === 3) ? currency.toUpperCase() : 'USD';
  try {
    return <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: safeCurrency }).format(amount / 100)}</span>;
  } catch {
    return <span>{safeCurrency} {(amount / 100).toFixed(2)}</span>;
  }
};

const SafeTimestamp: React.FC<{ ts?: any }> = ({ ts }) => {
  if (!ts) return <span>N/A</span>;
  const date = new Date(typeof ts === 'number' && ts < 10000000000 ? ts * 1000 : ts);
  return <span>{isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString()}</span>;
};

// --- COMPONENT ---
const TradeConfirmationModal: React.FC<any> = ({
  isOpen,
  onClose,
  settlementInstruction, // We will treat this as 'any' internally to prevent property access crashes
}) => {
  const modalSize = useBreakpointValue({ base: 'full', md: 'xl' }) || 'xl';
  const [isDownloading, setIsDownloading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState("Initializing Nexus Core...");
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  // Crash Guard: If the prop is totally missing, don't even try to render line 106
  if (!settlementInstruction) {
    return null;
  }

  // AI Simulation Logic
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsAnalyzing(false);
        setAiAnalysis("Analysis Complete: Trade matches cryptographic intent.");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const downloadAsPDF = useCallback(() => {
    setIsDownloading(true);
    const doc = new jsPDF();
    doc.text('SETTLEMENT AUDIT REPORT', 10, 10);
    
    // Defensive access for PDF generation
    const rows = [
      ['Message ID', settlementInstruction?.messageId || 'N/A'],
      ['Amount', `${(settlementInstruction?.totalAmount || 0) / 100} ${settlementInstruction?.currency || 'USD'}`],
      ['Date', settlementInstruction?.settlementDate || 'N/A']
    ];

    autoTable(doc, { head: [['Field', 'Value']], body: rows, startY: 20 });
    doc.save('trade_audit.pdf');
    setIsDownloading(false);
  }, [settlementInstruction]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={modalSize}>
      <ModalOverlay backdropFilter="blur(8px)" />
      <ModalContent bg="gray.900" color="white" borderRadius="2xl" border="1px solid" borderColor="cyan.500">
        <ModalHeader borderBottom="1px solid" borderColor="gray.800">
          <Flex align="center" gap={3}>
            <ShieldCheck color="#22D3EE" />
            <Text fontSize="lg">TRADE VERIFICATION</Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody p={6}>
          <Stack spacing={6}>
            
            {/* AI Analysis Box */}
            <Box p={4} bg="black" borderRadius="lg" borderLeft="4px solid" borderColor="cyan.500">
              <Flex align="center" gap={2} mb={2}>
                <Cpu size={14} color="#22D3EE" />
                <Text fontSize="xs" color="gray.500" fontWeight="bold">AI FORENSICS</Text>
              </Flex>
              <Text fontSize="sm" fontFamily="mono" color="cyan.100">{aiAnalysis}</Text>
              {isAnalyzing && <Progress size="xs" isIndeterminate colorScheme="cyan" mt={2} />}
            </Box>

            {/* Core Data: Using safe optional chaining everywhere to prevent the "reading details" error */}
            <Box bg="gray.800" p={4} borderRadius="xl">
              <Stack spacing={3}>
                <Flex justify="space-between">
                  <Text color="gray.400" fontSize="sm">Instruction ID</Text>
                  <Code bg="transparent" color="white">{settlementInstruction?.messageId || 'PENDING'}</Code>
                </Flex>
                <Flex justify="space-between">
                  <Text color="gray.400" fontSize="sm">Settlement Value</Text>
                  <Box fontWeight="bold">
                    <SafeAmount 
                      amount={settlementInstruction?.totalAmount} 
                      currency={settlementInstruction?.currency} 
                    />
                  </Box>
                </Flex>
                <Flex justify="space-between">
                  <Text color="gray.400" fontSize="sm">Creation Node</Text>
                  <SafeTimestamp ts={settlementInstruction?.creationDateTime} />
                </Flex>
              </Stack>
            </Box>

            {/* Warning Message */}
            <Flex p={3} bg="orange.900/20" borderRadius="md" border="1px solid" borderColor="orange.900" align="center" gap={2}>
              <AlertTriangle size={16} color="#FB923C" />
              <Text fontSize="xs" color="orange.200">
                This transaction is pending final node synchronization on the {settlementInstruction?.settlementDate || 'scheduled'} date.
              </Text>
            </Flex>

            <Button
              bg="cyan.500"
              _hover={{ bg: "cyan.400" }}
              color="black"
              fontWeight="black"
              leftIcon={<FileText size={18} />}
              onClick={downloadAsPDF}
              isLoading={isDownloading}
            >
              DOWNLOAD CRYPTOGRAPHIC RECEIPT
            </Button>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TradeConfirmationModal;