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
  Text,
  Code,
  useBreakpointValue,
  Flex,
  Progress,
} from '@chakra-ui/react';
import { 
  ShieldCheck, 
  Cpu, 
  FileText, 
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
  // Heuristic to detect seconds vs milliseconds (if number)
  const date = new Date(typeof ts === 'number' && ts < 10000000000 ? ts * 1000 : ts);
  return <span>{isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString()}</span>;
};

// Helper for non-component usage (like PDF)
const formatTimestampPlain = (ts: any) => {
  if (!ts) return 'N/A';
  const date = new Date(typeof ts === 'number' && ts < 10000000000 ? ts * 1000 : ts);
  return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
};

const formatCurrencyPlain = (amount: number = 0, currency: string = 'USD') => {
  const safeCurrency = (currency && currency.length === 3) ? currency.toUpperCase() : 'USD';
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: safeCurrency }).format(amount / 100);
  } catch {
    return `${safeCurrency} ${(amount / 100).toFixed(2)}`;
  }
};

// --- COMPONENT ---
const TradeConfirmationModal: React.FC<any> = ({
  isOpen,
  onClose,
  settlementInstruction,
}) => {
  const modalSize = useBreakpointValue({ base: 'full', md: 'xl' }) || 'xl';
  const [isDownloading, setIsDownloading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState("Initializing Nexus Core...");
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  // AI Simulation Logic
  useEffect(() => {
    if (isOpen) {
      setIsAnalyzing(true);
      setAiAnalysis("Initializing Nexus Core...");
      const timer = setTimeout(() => {
        setIsAnalyzing(false);
        setAiAnalysis("Analysis Complete: Trade matches cryptographic intent.");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const downloadAsPDF = useCallback(() => {
    if (!settlementInstruction) return;
    
    try {
      setIsDownloading(true);
      const doc = new jsPDF();
      
      doc.setFontSize(14);
      doc.text('SETTLEMENT AUDIT REPORT', 10, 10);
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 10, 16);
      
      const rows = [
        ['Message ID', settlementInstruction.messageId || 'N/A'],
        ['Amount', formatCurrencyPlain(settlementInstruction.totalAmount, settlementInstruction.currency)],
        ['Settlement Date', settlementInstruction.settlementDate || 'N/A'],
        ['Creation Time', formatTimestampPlain(settlementInstruction.creationDateTime)]
      ];

      autoTable(doc, { 
        head: [['Field', 'Value']], 
        body: rows, 
        startY: 25,
        theme: 'grid',
        headStyles: { fillColor: [34, 211, 238] } // Matches cyan color scheme
      });
      
      doc.save(`trade_audit_${settlementInstruction.messageId || 'unknown'}.pdf`);
    } catch (error) {
      console.error("PDF Generation failed", error);
      alert("Failed to generate PDF receipt. Please contact support.");
    } finally {
      setIsDownloading(false);
    }
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
          {!settlementInstruction ? (
            <Flex direction="column" align="center" justify="center" py={10} gap={4}>
              <AlertTriangle size={32} color="#FB923C" />
              <Text color="gray.400">No settlement instruction data available.</Text>
            </Flex>
          ) : (
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

              {/* Core Data */}
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
                isDisabled={!settlementInstruction}
              >
                DOWNLOAD CRYPTOGRAPHIC RECEIPT
              </Button>
            </Stack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TradeConfirmationModal;