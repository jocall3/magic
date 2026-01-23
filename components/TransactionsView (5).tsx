```typescript
// components/views/personal/TransactionsView.tsx
import React, { useContext, useState, useMemo, useEffect, useCallback, useRef, useReducer, FC } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import type { Transaction, DetectedSubscription } from '../types';
import { GoogleGenAI, Type } from "@google/genai";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

// ================================================================================================
// CONSTANTS & CONFIGURATION
// ================================================================================================
const ITEMS_PER_PAGE_OPTIONS = [15, 30, 50, 100];
const DEBOUNCE_DELAY = 350;
const NOTIFICATION_TIMEOUT = 5000;
const MOCK_API_LATENCY = 500;
const CATEGORY_COLORS = ['#38bdf8', '#34d399', '#f87171', '#fbbf24', '#a78bfa', '#f472b6', '#818cf8', '#fb923c'];
const MOCK_INVESTMENT_SYMBOLS = ['PLTO', 'FINX', 'DATA', 'AI', 'CASH'];
const LIVE_FEED_INTERVAL = 3000; // ms for new simulated transactions

// ================================================================================================
// ENHANCED TYPES & INTERFACES
// ================================================================================================

export type TransactionStatus = 'posted' | 'pending' | 'refunded' | 'cancelled';
export type SortDirection = 'asc' | 'desc';
export type TransactionField = keyof EnhancedTransaction | 'merchantName';
export type NotificationType = 'success' | 'error' | 'info' | 'warning';
export type AIEnhancedInsightType = 'subscriptions' | 'anomaly' | 'tax' | 'savings' | 'fraud' | 'categorization_suggestion' | 'spending_report' | 'forecast';
export type AppView = 'transactions' | 'budgets' | 'investments' | 'goals' | 'automation';

export interface TransactionSplit {
    splitId: string;
    description: string;
    amount: number;
    category: string;
    notes?: string;
}

export interface MerchantDetails {
    name: string;
    logoUrl?: string;
    location?: string;
    address?: string;
    category?: string; // e.g., MCC code description
    website?: string;
}

export interface EnhancedTransaction extends Transaction {
    status: TransactionStatus;
    notes?: string;
    splits?: TransactionSplit[];
    merchant?: MerchantDetails;
    tags?: string[];
    receiptUrl?: string;
    warrantyEndDate?: string;
    carbonFootprint?: number; // in kg COâe
}

export interface SortState {
    field: TransactionField;
    direction: SortDirection;
}

export interface FilterState {
    searchTerm: string;
    transactionType: 'all' | 'income' | 'expense';
    dateRange: {
        startDate: string | null;
        endDate: string | null;
    };
    amountRange: {
        min: number | string;
        max: number | string;
    };
    categories: string[];
    statuses: TransactionStatus[];
    tags: string[];
}

export interface PaginationState {
    currentPage: number;
    itemsPerPage: number;
}

export interface Notification {
    id: number;
    message: string;
    type: NotificationType;
}

export interface AutomationRule {
    id: string;
    name: string;
    conditions: {
        field: 'description' | 'amount' | 'merchantName';
        operator: 'contains' | 'equals' | 'greater_than' | 'less_than';
        value: string | number;
    }[];
    actions: {
        type: 'set_category' | 'add_tag';
        value: string;
    }[];
    isEnabled: boolean;
}

export interface Budget {
    id: string;
    category: string;
    amount: number;
    period: 'monthly'; // Future: 'weekly', 'yearly'
}

export interface FinancialGoal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline?: string;
}

export interface InvestmentHolding {
    symbol: string;
    shares: number;
    avgCost: number;
}

export interface MarketData {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
}

// ================================================================================================
// MOCK API SERVICES
// ================================================================================================

const fetchMerchantDetails = (merchantName: string): Promise<MerchantDetails> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const mockDb: Record<string, MerchantDetails> = {
                "starbucks": { name: "Starbucks", logoUrl: "https://logo.clearbit.com/starbucks.com", location: "Seattle, WA", category: "Coffee Shops", website: "starbucks.com" },
                "netflix": { name: "Netflix", logoUrl: "https://logo.clearbit.com/netflix.com", location: "Los Gatos, CA", category: "Streaming Services", website: "netflix.com" },
                "uber": { name: "Uber", logoUrl: "https://logo.clearbit.com/uber.com", location: "San Francisco, CA", category: "Ride Sharing", website: "uber.com" },
            };
            const key = merchantName.toLowerCase().split(' ')[0];
            const details = mockDb[key] || { name: merchantName, category: "General Retail" };
            resolve(details);
        }, MOCK_API_LATENCY);
    });
};

const estimateCarbonFootprint = (category: string, amount: number): Promise<number> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const multipliers: Record<string, number> = { 'Groceries': 0.1, 'Travel': 0.5, 'Utilities': 0.2, 'Dining': 0.15, 'Shopping': 0.08 };
            const footprint = (multipliers[category] || 0.05) * amount;
            resolve(parseFloat(footprint.toFixed(2)));
        }, MOCK_API_LATENCY / 2);
    });
};

const fetchMarketData = (symbols: string[]): Promise<MarketData[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(symbols.map(symbol => {
                const price = parseFloat((Math.random() * 400 + 50).toFixed(2));
                const change = parseFloat(((Math.random() - 0.5) * 20).toFixed(2));
                return {
                    symbol,
                    price,
                    change,
                    changePercent: parseFloat(((change / (price - change)) * 100).toFixed(2)),
                };
            }));
        }, MOCK_API_LATENCY);
    });
};

// ================================================================================================
// UTILITY FUNCTIONS
// ================================================================================================

export const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        const utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
        return utcDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) { return dateString; }
};

export const formatCurrency = (amount: number, currency: string = '$'): string => {
    return `${currency}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const getCategoryColor = (category: string) => {
    let hash = 0;
    for (let i = 0; i < category.length; i++) { hash = category.charCodeAt(i) + ((hash << 5) - hash); }
    return CATEGORY_COLORS[Math.abs(hash) % CATEGORY_COLORS.length];
};

export const exportTransactionsToCSV = (transactions: EnhancedTransaction[], filename: string = 'transactions.csv') => {
    if (transactions.length === 0) { alert("No transactions to export."); return; }
    const headers = ['id', 'date', 'description', 'amount', 'type', 'category', 'status', 'notes', 'tags', 'merchantName', 'carbonFootprint'];
    const csvRows = [headers.join(',')];
    for (const tx of transactions) {
        const values = [ tx.id, tx.date, `"${tx.description.replace(/"/g, '""')}"`, tx.amount, tx.type, tx.category, tx.status, `"${(tx.notes || '').replace(/"/g, '""')}"`, `"${(tx.tags || []).join(', ')}"`, `"${(tx.merchant?.name || '').replace(/"/g, '""')}"`, tx.carbonFootprint || '' ];
        csvRows.push(values.join(','));
    }
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

export const generateUUID = () => `uuid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// ================================================================================================
// CUSTOM HOOKS
// ================================================================================================

export const useDebounce = <T,>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};

export const useNotification = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const counterRef = useRef(0);
    const addNotification = useCallback((message: string, type: NotificationType) => {
        const id = counterRef.current++;
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), NOTIFICATION_TIMEOUT);
    }, []);
    const removeNotification = useCallback((id: number) => setNotifications(prev => prev.filter(n => n.id !== id)), []);
    return { notifications, addNotification, removeNotification };
};

export const useTransactionProcessor = (transactions: EnhancedTransaction[]) => {
    const [filters, setFilters] = useState<FilterState>({ searchTerm: '', transactionType: 'all', dateRange: { startDate: null, endDate: null }, amountRange: { min: '', max: '' }, categories: [], statuses: [], tags: [] });
    const [sort, setSort] = useState<SortState>({ field: 'date', direction: 'desc' });
    const [pagination, setPagination] = useState<PaginationState>({ currentPage: 1, itemsPerPage: 15 });
    const debouncedSearchTerm = useDebounce(filters.searchTerm, DEBOUNCE_DELAY);
    const allCategories = useMemo(() => [...new Set(transactions.map(tx => tx.category))], [transactions]);
    const allTags = useMemo(() => [...new Set(transactions.flatMap(tx => tx.tags || []))], [transactions]);

    const processedTransactions = useMemo(() => {
        let filtered = [...transactions];
        if (debouncedSearchTerm) {
            const term = debouncedSearchTerm.toLowerCase();
            filtered = filtered.filter(tx => tx.description.toLowerCase().includes(term) || tx.category.toLowerCase().includes(term) || (tx.merchant?.name || '').toLowerCase().includes(term) || (tx.notes || '').toLowerCase().includes(term));
        }
        if (filters.transactionType !== 'all') { filtered = filtered.filter(tx => tx.type === filters.transactionType); }
        if (filters.dateRange.startDate) { filtered = filtered.filter(tx => new Date(tx.date) >= new Date(filters.dateRange.startDate!)); }
        if (filters.dateRange.endDate) { filtered = filtered.filter(tx => new Date(tx.date) <= new Date(filters.dateRange.endDate!)); }
        if (filters.amountRange.min) { filtered = filtered.filter(tx => tx.amount >= Number(filters.amountRange.min!)); }
        if (filters.amountRange.max) { filtered = filtered.filter(tx => tx.amount <= Number(filters.amountRange.max!)); }
        if (filters.categories.length > 0) { filtered = filtered.filter(tx => filters.categories.includes(tx.category)); }
        if (filters.statuses.length > 0) { filtered = filtered.filter(tx => filters.statuses.includes(tx.status)); }
        if (filters.tags.length > 0) { filtered = filtered.filter(tx => tx.tags && tx.tags.some(t => filters.tags.includes(t))); }

        filtered.sort((a, b) => {
            const field = sort.field;
            let valA: any = field === 'merchantName' ? a.merchant?.name || '' : a[field];
            let valB: any = field === 'merchantName' ? b.merchant?.name || '' : b[field];
            let comparison = 0;
            if (valA === null || valA === undefined) valA = '';
            if (valB === null || valB === undefined) valB = '';
            if (typeof valA === 'string' && typeof valB === 'string') { comparison = valA.localeCompare(valB); }
            else if (typeof valA === 'number' && typeof valB === 'number') { comparison = valA - valB; }
            else if (field === 'date') { comparison = new Date(valA).getTime() - new Date(valB).getTime(); }
            return sort.direction === 'asc' ? comparison : -comparison;
        });
        return filtered;
    }, [transactions, filters, debouncedSearchTerm, sort]);

    const totalPages = Math.ceil(processedTransactions.length / pagination.itemsPerPage);
    const setPage = (page: number) => setPagination(p => ({ ...p, currentPage: Math.max(1, Math.min(page, totalPages)) }));
    const paginatedTransactions = useMemo(() => {
        const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
        return processedTransactions.slice(startIndex, startIndex + pagination.itemsPerPage);
    }, [processedTransactions, pagination]);

    return { filters, setFilters, sort, setSort, pagination, setPagination, setPage, paginatedTransactions, totalTransactionCount: processedTransactions.length, totalPages, allCategories, allTags };
};

export const useBulkSelection = (transactionIds: string[]) => {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const toggleSelection = (id: string) => setSelectedIds(prev => { const newSet = new Set(prev); newSet.has(id) ? newSet.delete(id) : newSet.add(id); return newSet; });
    const toggleSelectAll = () => setSelectedIds(prev => prev.size === transactionIds.length ? new Set() : new Set(transactionIds));
    const clearSelection = () => setSelectedIds(new Set());
    const isAllSelected = transactionIds.length > 0 && selectedIds.size === transactionIds.length;
    return { selectedIds, setSelectedIds, toggleSelection, toggleSelectAll, clearSelection, isAllSelected };
};

export const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) { console.error(error); return initialValue; }
    });
    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) { console.error(error); }
    };
    return [storedValue, setValue];
};

// ================================================================================================
// GENERIC UI COMPONENTS
// ================================================================================================
export const LoadingSkeleton: FC = () => <div className="space-y-2 animate-pulse">{[...Array(5)].map((_, i) => <div key={i} className="flex items-center space-x-4 p-4"><div className="h-4 bg-gray-700 rounded w-1/4"></div><div className="h-4 bg-gray-700 rounded w-1/4"></div><div className="h-4 bg-gray-700 rounded w-1/4"></div><div className="h-4 bg-gray-700 rounded w-1/4"></div></div>)}</div>;
export const NotificationToast: FC<{ notification: Notification; onDismiss: (id: number) => void }> = ({ notification, onDismiss }) => {
    const colorClasses = { success: 'bg-green-600 border-green-500', error: 'bg-red-600 border-red-500', info: 'bg-blue-600 border-blue-500', warning: 'bg-yellow-600 border-yellow-500' };
    return <div className={`w-80 p-4 rounded-lg shadow-lg text-white border-l-4 ${colorClasses[notification.type]} animate-fade-in-up`}><div className="flex items-center justify-between"><p className="text-sm font-medium">{notification.message}</p><button onClick={() => onDismiss(notification.id)} className="text-lg leading-none">&times;</button></div></div>;
};
export const ConfirmationModal: FC<{ isOpen: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void; confirmText?: string; cancelText?: string; confirmVariant?: 'danger' | 'primary'; }> = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel", confirmVariant = 'danger' }) => {
    if (!isOpen) return null;
    const confirmClasses = confirmVariant === 'danger' ? "bg-red-600 hover:bg-red-500" : "bg-cyan-600 hover:bg-cyan-500";
    return <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-md"><div className="bg-gray-800 rounded-lg shadow-2xl max-w-sm w-full border border-gray-700 p-6"><h3 className="text-xl font-bold text-white mb-3">{title}</h3><p className="text-gray-300 mb-6">{message}</p><div className="flex justify-end gap-4"><button onClick={onCancel} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 text-white font-semibold transition-colors">{cancelText}</button><button onClick={onConfirm} className={`px-4 py-2 rounded-md ${confirmClasses} text-white font-semibold transition-colors`}>{confirmText}</button></div></div></div>;
};
export const ProgressBar: FC<{ value: number; max: number; colorClass?: string }> = ({ value, max, colorClass = 'bg-cyan-500' }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    return <div className="w-full bg-gray-700 rounded-full h-2.5"><div className={`${colorClass} h-2.5 rounded-full`} style={{ width: `${Math.min(percentage, 100)}%` }}></div></div>;
};
export const AppTabs: FC<{ activeView: AppView; onViewChange: (view: AppView) => void }> = ({ activeView, onViewChange }) => {
    const tabs: { id: AppView; label: string }[] = [ { id: 'transactions', label: 'Transactions' }, { id: 'budgets', label: 'Budgets' }, { id: 'investments', label: 'Investments' }, { id: 'goals', label: 'Goals' }, { id: 'automation', label: 'Automation' } ];
    return <div className="border-b border-gray-700 mb-6"><nav className="-mb-px flex space-x-6" aria-label="Tabs">{tabs.map(tab => <button key={tab.id} onClick={() => onViewChange(tab.id)} className={`${activeView === tab.id ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}>{tab.label}</button>)}</nav></div>;
};

// ================================================================================================
// DATA VISUALIZATION COMPONENTS
// ================================================================================================

export const CategorySpendingChart: FC<{ transactions: EnhancedTransaction[] }> = ({ transactions }) => {
    const expenseData = useMemo(() => {
        const expensesByCategory = transactions.filter(tx => tx.type === 'expense').reduce<Record<string, number>>((acc, tx) => { acc[tx.category] = (acc[tx.category] || 0) + tx.amount; return acc; }, {});
        return Object.entries(expensesByCategory).sort(([, a], [, b]) => b - a).slice(0, 5).map(([name, value], i) => ({ name, value, color: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }));
    }, [transactions]);
    if (expenseData.length === 0) return <div className="text-center text-gray-500 p-4">No spending data to display.</div>;
    return <Card title="Top Spending Categories" isCollapsible><ResponsiveContainer width="100%" height={200}><RechartsPieChart><Pie data={expenseData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} fill="#8884d8" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>{expenseData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}</Pie><Tooltip formatter={(value: number) => formatCurrency(value)} /><Legend /></RechartsPieChart></ResponsiveContainer></Card>;
};

export const MonthlyTrendChart: FC<{ transactions: EnhancedTransaction[] }> = ({ transactions }) => {
    const trendData = useMemo(() => {
        const dataByMonth: Record<string, { income: number, expense: number }> = {};
        transactions.forEach(tx => {
            const month = tx.date.substring(0, 7);
            if (!dataByMonth[month]) { dataByMonth[month] = { income: 0, expense: 0 }; }
            if (tx.type === 'income') dataByMonth[month].income += tx.amount; else dataByMonth[month].expense += tx.amount;
        });
        return Object.entries(dataByMonth).map(([month, data]) => ({ month, ...data })).sort((a, b) => a.month.localeCompare(b.month));
    }, [transactions]);
    if (trendData.length < 2) return <div className="text-center text-gray-500 p-4">Not enough data for a trend analysis.</div>;
    return <Card title="Income vs. Expense Trend" isCollapsible><ResponsiveContainer width="100%" height={200}><BarChart data={trendData}><CartesianGrid strokeDasharray="3 3" stroke="#4a5568" /><XAxis dataKey="month" stroke="#a0aec0" /><YAxis stroke="#a0aec0" tickFormatter={(value) => `$${Number(value)/1000}k`} /><Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ backgroundColor: '#2d3748', border: 'none' }} /><Legend /><Bar dataKey="income" fill="#34d399" name="Income" /><Bar dataKey="expense" fill="#f87171" name="Expenses" /></BarChart></ResponsiveContainer></Card>;
};

// ================================================================================================
// MODAL & DETAIL COMPONENTS
// ================================================================================================

const TransactionDetailModal: FC<{ transaction: EnhancedTransaction | null; onClose: () => void; onEdit: (tx: EnhancedTransaction) => void; onDelete: (id: string) => void; }> = ({ transaction, onClose, onEdit, onDelete }) => {
    if (!transaction) return null;
    return <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}><div className="bg-gray-800 rounded-lg shadow-2xl max-w-lg w-full border border-gray-700" onClick={e => e.stopPropagation()}><div className="p-4 border-b border-gray-700 flex justify-between items-center"><h3 className="text-lg font-semibold text-white">Transaction Details</h3><button onClick={onClose} className="text-gray-400 hover:text-white text-2xl" aria-label="Close modal">&times;</button></div><div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto"><div className="flex justify-between text-sm"><span className="text-gray-400">Description:</span> <span className="text-white font-semibold text-right">{transaction.description}</span></div><div className="flex justify-between text-sm"><span className="text-gray-400">Amount:</span> <span className={`font-mono font-semibold ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>{transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}</span></div><div className="flex justify-between text-sm"><span className="text-gray-400">Date:</span> <span className="text-white">{formatDate(transaction.date)}</span></div><div className="flex justify-between text-sm"><span className="text-gray-400">Category:</span> <span className="text-white bg-gray-700 px-2 py-1 rounded-md text-xs">{transaction.category}</span></div><div className="flex justify-between text-sm"><span className="text-gray-400">Status:</span> <span className="text-white capitalize">{transaction.status}</span></div>{transaction.merchant && <div className="flex justify-between text-sm"><span className="text-gray-400">Merchant:</span> <span className="text-white">{transaction.merchant.name}</span></div>}{transaction.tags && transaction.tags.length > 0 && <div className="flex justify-between text-sm"><span className="text-gray-400">Tags:</span> <div className="flex gap-2 flex-wrap justify-end">{transaction.tags.map(tag => <span key={tag} className="text-cyan-300 bg-cyan-900/50 px-2 py-1 rounded-full text-xs">{tag}</span>)}</div></div>}{transaction.notes && <div className="text-sm"><span className="text-gray-400 block mb-1">Notes:</span><p className="text-white bg-gray-900/50 p-2 rounded-md whitespace-pre-wrap">{transaction.notes}</p></div>}{transaction.carbonFootprint && <div className="flex justify-between text-sm"><span className="text-gray-400">Carbon Footprint:</span> <span className="text-green-300">{transaction.carbonFootprint.toFixed(1)} kg COâ</span></div>}<div className="flex justify-between text-sm"><span className="text-gray-400">Transaction ID:</span> <span className="text-white font-mono text-xs">{transaction.id}</span></div></div><div className="p-4 border-t border-gray-700 flex justify-end gap-3"><button onClick={() => onDelete(transaction.id)} className="px-4 py-2 text-sm rounded-md bg-red-800 hover:bg-red-700 text-white font-semibold transition-colors">Delete</button><button onClick={() => onEdit(transaction)} className="px-4 py-2 text-sm rounded-md bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-colors">Edit</button></div></div></div>;
};

export const AddEditTransactionModal: FC<{ isOpen: boolean; onClose: () => void; onSave: (transaction: Omit<EnhancedTransaction, 'id'> | EnhancedTransaction) => void; existingTransaction?: EnhancedTransaction | null; categories: string[]; }> = ({ isOpen, onClose, onSave, existingTransaction, categories }) => {
    const [formData, setFormData] = useState<Omit<EnhancedTransaction, 'id'>>({ description: '', amount: 0, date: new Date().toISOString().split('T')[0], type: 'expense', category: categories[0] || 'General', status: 'posted', notes: '', tags: [] });
    const [tagInput, setTagInput] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    useEffect(() => { if (isOpen) { setFormData(existingTransaction || { description: '', amount: 0, date: new Date().toISOString().split('T')[0], type: 'expense', category: categories[0] || 'General', status: 'posted', notes: '', tags: [] }); setErrors({}); } }, [isOpen, existingTransaction, categories]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) || 0 : value })); };
    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === ',' || e.key === 'Enter') { e.preventDefault(); const newTag = tagInput.trim(); if (newTag && !formData.tags?.includes(newTag)) { setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), newTag] })); } setTagInput(''); } };
    const removeTag = (tagToRemove: string) => setFormData(prev => ({ ...prev, tags: (prev.tags || []).filter(tag => tag !== tagToRemove) }));
    const validate = (): boolean => { const newErrors: Record<string, string> = {}; if (!formData.description.trim()) newErrors.description = "Description is required."; if (formData.amount <= 0) newErrors.amount = "Amount must be positive."; if (!formData.date) newErrors.date = "Date is required."; setErrors(newErrors); return Object.keys(newErrors).length === 0; };
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (validate()) { onSave(formData); onClose(); } };
    if (!isOpen) return null;
    return <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] backdrop-blur-sm" onClick={onClose}><div className="bg-gray-800 rounded-lg shadow-2xl max-w-lg w-full border border-gray-700" onClick={e => e.stopPropagation()}><form onSubmit={handleSubmit}><div className="p-4 border-b border-gray-700 flex justify-between items-center"><h3 className="text-lg font-semibold text-white">{existingTransaction ? 'Edit Transaction' : 'Add New Transaction'}</h3><button type="button" onClick={onClose} className="text-gray-400 hover:text-white text-2xl" aria-label="Close modal">&times;</button></div><div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto"><div><label className="text-sm text-gray-400 mb-1 block">Description</label><input type="text" name="description" value={formData.description} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white" />{errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}</div><div className="grid grid-cols-2 gap-4"><div><label className="text-sm text-gray-400 mb-1 block">Amount</label><input type="number" name="amount" value={formData.amount} onChange={handleChange} step="0.01" className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white" />{errors.amount && <p className="text-red-400 text-xs mt-1">{errors.amount}</p>}</div><div><label className="text-sm text-gray-400 mb-1 block">Type</label><select name="type" value={formData.type} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"><option value="expense">Expense</option><option value="income">Income</option></select></div></div><div className="grid grid-cols-2 gap