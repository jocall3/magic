import React, { useContext, useMemo, useState, useEffect, useCallback, useRef } from 'react';
import BalanceSummary from './BalanceSummary';
import RecentTransactions from './RecentTransactions';
import WealthTimeline from './WealthTimeline';
import { AIInsights } from './AIInsights';
import ImpactTracker from './ImpactTracker';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { GamificationState, Subscription, CreditScore, SavingsGoal, MarketMover, UpcomingBill, Transaction, BudgetCategory, RewardPoints, View, Account, LinkedAccount } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Legend, AreaChart, Area } from 'recharts';
import PlaidLinkButton from './PlaidLinkButton';
import { GoogleGenAI, Type } from '@google/genai';
import { Bot, Camera, Eye, MessageSquare, X, Send, RefreshCw, Maximize2, Minimize2, ScanEye } from 'lucide-react';

// ================================================================================================
// THE JAMES BURVEL Oâ€™CALLAGHAN III CODE - CORE ARCHITECTURE & SYSTEM DEFINITIONS
// ================================================================================================

// Company Entity A.001 - "Apex Financial Architects" - Core Data Structures and Types
namespace ApexFinancialArchitects {
    // A.001.001 - Core Data Types (Expanded and Rigorously Typed)
    export interface SovereignUser {
        userId: string; // A.001.001.001 - Unique User Identifier
        username: string; // A.001.001.002 - User's Chosen Username
        email: string; // A.001.001.003 - User's Primary Email Address
        registrationDate: string; // A.001.001.004 - Date of User Registration (ISO String)
        lastLogin: string; // A.001.001.005 - Last Login Date (ISO String)
        preferences: UserPreferences; // A.001.001.006 - User's UI and Functional Preferences
        securitySettings: SecuritySettings; // A.001.001.007 - User's Security Configuration
        linkedAccounts: LinkedAccount[]; // A.001.001.008 - List of Linked Financial Accounts
        gamificationData: GamificationState; // A.001.001.009 - Gamification Progress and Status
        rewardPoints: RewardPoints; // A.001.001.010 - Reward Points Balance
        creditScore: CreditScore; // A.001.001.011 - Credit Score Information
        subscriptions: Subscription[]; // A.001.001.012 - User's Subscription Data
        budgets: BudgetCategory[]; // A.001.001.013 - User's Budget Categories and Allocations
        savingsGoals: SavingsGoal[]; // A.001.001.014 - User's Savings Goals
        transactions: Transaction[]; // A.001.001.015 - User's Transaction History
        upcomingBills: UpcomingBill[]; // A.001.001.016 - User's Upcoming Bills
        marketMovers: MarketMover[]; // A.001.001.017 - Real-Time Market Movers
        impactData: ImpactData; // A.001.001.018 - User's Environmental Impact Data
        aiInsights: AIInsight[]; // A.001.001.019 - AI-Generated Insights and Recommendations
        apiKey: string; // A.001.001.020 - User's Gemini API Key
    }

    export interface UserPreferences {
        theme: 'light' | 'dark' | 'system'; // A.001.001.006.001 - UI Theme Preference
        language: string; // A.001.001.006.002 - Preferred Language (e.g., 'en', 'es')
        currency: string; // A.001.001.006.003 - Preferred Currency (e.g., 'USD', 'EUR')
        notificationsEnabled: boolean; // A.001.001.006.004 - Enable/Disable Notifications
        dateFormat: string; // A.001.001.006.005 - Date Format Preference (e.g., 'MM/DD/YYYY')
    }

    export interface SecuritySettings {
        twoFactorEnabled: boolean; // A.001.001.007.001 - Two-Factor Authentication Status
        authenticationMethod: 'password' | 'biometric' | 'otp'; // A.001.001.007.002 - Primary Authentication Method
        passwordLastChanged: string; // A.001.001.007.003 - Date of Last Password Change (ISO String)
        loginHistory: LoginEvent[]; // A.001.001.007.004 - User's Login History
        activeSessions: Session[]; // A.001.001.007.005 - User's Active Sessions
    }

    export interface LoginEvent {
        timestamp: string; // A.001.001.007.004.001 - Login Timestamp (ISO String)
        ipAddress: string; // A.001.001.007.004.002 - IP Address of Login
        location: string; // A.001.001.007.004.003 - Approximate Location of Login
        device: string; // A.001.001.007.004.004 - Device Used for Login
        success: boolean; // A.001.001.007.004.005 - Login Success Status
    }

    export interface Session {
        sessionId: string; // A.001.001.007.005.001 - Unique Session Identifier
        ipAddress: string; // A.001.001.007.005.002 - IP Address of Session
        userAgent: string; // A.001.001.007.005.003 - User Agent String
        lastActivity: string; // A.001.001.007.005.004 - Last Activity Timestamp (ISO String)
    }

    export interface ImpactData {
        treesPlanted: number; // A.001.001.018.001 - Number of Trees Planted (Impact Metric)
        carbonOffset: number; // A.001.001.018.002 - Carbon Offset (Impact Metric)
        progressToNextTree: number; // A.001.001.018.003 - Progress to Next Tree (Percentage)
    }

    export interface AIInsight {
        insightId: string; // A.001.001.019.001 - Unique Insight Identifier
        timestamp: string; // A.001.001.019.002 - Timestamp of Insight Generation (ISO String)
        category: string; // A.001.001.019.003 - Category of Insight (e.g., 'Budgeting', 'Investment')
        title: string; // A.001.001.019.004 - Title of the Insight
        description: string; // A.001.001.019.005 - Detailed Description of the Insight
        recommendations: string[]; // A.001.001.019.006 - List of AI-Generated Recommendations
        confidenceScore: number; // A.001.001.019.007 - AI Confidence Score (0-1)
        actionable: boolean; // A.001.001.019.008 - Indicates if the insight requires user action
    }

    // A.001.002 - Core API Response Structures
    export interface ApiResponse<T> {
        statusCode: number; // A.001.002.001 - HTTP Status Code
        message: string; // A.001.002.002 - API Response Message
        data: T | null; // A.001.002.003 - API Response Data (Generic)
        error?: string; // A.001.002.004 - Error Message (if any)
    }

    // A.001.003 - Utility Functions (Comprehensive and Deterministic)
    export const Utils = {
        // A.001.003.001 - Format Date to ISO String
        formatDate: (date: Date): string => {
            return date.toISOString();
        },
        // A.001.003.002 - Validate Email Address
        isValidEmail: (email: string): boolean => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },
        // A.001.003.003 - Generate Unique ID
        generateUniqueId: (): string => {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        // A.001.003.004 - Calculate Percentage
        calculatePercentage: (value: number, total: number): number => {
            return total === 0 ? 0 : (value / total) * 100;
        },
        // A.001.003.005 - Format Currency
        formatCurrency: (amount: number, currencyCode: string = 'USD'): string => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currencyCode,
                minimumFractionDigits: 2
            }).format(amount);
        },
        // A.001.003.006 - Get Date Range (Start and End) of a Month
        getMonthRange: (year: number, month: number): { startDate: Date, endDate: Date } => {
            const startDate = new Date(year, month, 1);
            const endDate = new Date(year, month + 1, 0);
            return { startDate, endDate };
        },
        // A.001.003.007 - Debounce Function
        debounce: <F extends (...args: any[]) => void>(func: F, delay: number): (...args: Parameters<F>) => void => {
            let timeoutId: number | undefined;
            return function(this: ThisParameterType<F>, ...args: Parameters<F>) {
                const context = this;
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                timeoutId = setTimeout(() => {
                    func.apply(context, args);
                }, delay);
            };
        },
        // A.001.003.008 -  Capitalize First Letter
        capitalizeFirstLetter: (str: string): string => {
            return str.charAt(0).toUpperCase() + str.slice(1);
        },
        // A.001.003.009 -  Truncate String
        truncateString: (str: string, maxLength: number): string => {
            if (str.length <= maxLength) {
                return str;
            }
            return str.substring(0, maxLength - 3) + "...";
        },
        // A.001.003.010 -  Is Object Empty
        isObjectEmpty: (obj: object): boolean => {
            return Object.keys(obj).length === 0;
        },
    };

    // A.001.004 - Error Handling and Logging
    export const ErrorHandling = {
        // A.001.004.001 - Log Error
        logError: (message: string, error: any): void => {
            console.error(`[ERROR] ${message}:`, error);
            // Implement robust error logging to external service here
        },
        // A.001.004.002 - Handle API Errors
        handleApiError: (response: ApiResponse<any>): void => {
            if (response.statusCode >= 400) {
                ErrorHandling.logError(`API Error: ${response.message}`, response.error);
                // Display user-friendly error messages based on status code and error details
            }
        },
    };
}


// Company Entity A.002 - "Sovereign AI Labs" - AI and Data Processing Core
namespace SovereignAILabs {
    // A.002.001 - AI Model Definitions and Configurations
    export const AIModels = {
        // A.002.001.001 - Gemini Model Configuration (Used in several functions)
        gemini: {
            modelName: 'gemini-2.5-flash', // A.002.001.001.001 - Gemini Model Name
            temperature: 0.4, // A.002.001.001.002 - Temperature Control
            maxOutputTokens: 2000, // A.002.001.001.003 - Max Output Token Limit
            topP: 0.8, // A.002.001.001.004 - Top P Sampling
        },
        // A.002.001.002 - Imagen Model Configuration (For Image Generation)
        imagen: {
            modelName: 'imagen-4.0-generate-001', // A.002.001.002.001 - Imagen Model Name
            aspectRatio: '1:1', // A.002.001.002.002 - Aspect Ratio
            numberOfImages: 1, // A.002.001.002.003 - Number of images to generate
            outputMimeType: 'image/jpeg', // A.002.001.002.004 - Output format
        },
    };

    // A.002.002 - Data Analysis and Processing Functions
    export const DataProcessing = {
        // A.002.002.001 - Analyze Transaction Data (Core Function)
        analyzeTransactionData: async (transactions: ApexFinancialArchitects.Transaction[], apiKey: string): Promise<ApexFinancialArchitects.AIInsight[]> => {
            try {
                if (!transactions || transactions.length === 0 || !apiKey) {
                    return [];
                }

                const ai = new GoogleGenAI({ apiKey });
                const recentTransactionsSummary = transactions.slice(0, 10).map(tx => `${tx.description} (${tx.amount > 0 ? '+' : ''}${tx.amount})`).join('; ');
                const prompt = `Analyze the following recent transaction data to identify potential financial insights and generate actionable recommendations: ${recentTransactionsSummary}.  Provide insights in a structured JSON format containing a list of objects. Each object should have keys: "insightId", "category", "title", "description", "recommendations" (array of strings), "confidenceScore" (0-1), "actionable" (boolean).`;

                const result = await ai.models.generateContent({
                    model: AIModels.gemini.modelName,
                    contents: [{ role: 'user', parts: [{ text: prompt }] }],
                    config: { temperature: AIModels.gemini.temperature },
                });

                const jsonStr = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
                const insights: ApexFinancialArchitects.AIInsight[] = JSON.parse(jsonStr);
                return insights;
            } catch (error: any) {
                ApexFinancialArchitects.ErrorHandling.logError("Error analyzing transaction data", error);
                return [];
            }
        },
        // A.002.002.002 - Generate Spending Category Analysis
        generateSpendingCategoryAnalysis: (budgets: ApexFinancialArchitects.BudgetCategory[], transactions: ApexFinancialArchitects.Transaction[]): ApexFinancialArchitects.BudgetCategory[] => {
            const updatedBudgets = budgets.map(budget => {
                const spent = transactions.filter(tx => tx.category === budget.name).reduce((sum, tx) => sum + tx.amount, 0);
                return { ...budget, spent };
            });
            return updatedBudgets;
        },
        // A.002.002.003 - Calculate Risk Score
        calculateRiskScore: (transactions: ApexFinancialArchitects.Transaction[]): number => {
            // Placeholder for a complex risk calculation based on transaction patterns
            if (!transactions || transactions.length === 0) return 50;
            const creditTransactions = transactions.filter(t => t.type === "credit");
            const debitTransactions = transactions.filter(t => t.type === "debit");
            let score = 50;
            if (creditTransactions.length > debitTransactions.length) {
                score += 10;
            }
            if (debitTransactions.length > creditTransactions.length * 2) {
                score -= 15;
            }
            return Math.max(0, Math.min(100, score));
        },
        // A.002.002.004 - Perform OCR on Image Data
        performOCR: async (base64Image: string, apiKey: string): Promise<{ totalBalance: number, lastTransaction: string, alert: string } | null> => {
            try {
                if (!base64Image || !apiKey) return null;
                const ai = new GoogleGenAI({ apiKey });
                const prompt = `Analyze this banking dashboard image. Extract the following data in strict JSON format:
                {
                    "totalBalance": number (sum of large numbers visible or the main balance),
                    "lastTransaction": string (description of most recent transaction),
                    "alert": string (any warning or status visible, or "None")
                }
                Do not include markdown formatting.`;
                const result = await ai.models.generateContent({
                    model: AIModels.gemini.modelName,
                    contents: [{
                        role: 'user',
                        parts: [
                            { text: prompt },
                            { inlineData: { mimeType: 'image/jpeg', data: base64Image } }
                        ]
                    }],
                    config: { temperature: AIModels.gemini.temperature }
                });
                const jsonStr = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
                const data = JSON.parse(jsonStr);
                return data;
            } catch (e: any) {
                ApexFinancialArchitects.ErrorHandling.logError("OCR Extraction Failed", e);
                return null;
            }
        },
        // A.002.002.005 - Generate Predictive Portfolio
        generatePredictivePortfolio: async (transactions: ApexFinancialArchitects.Transaction[], apiKey: string): Promise<{ title: string; description: string; products: { name: string; imagePrompt: string; }[] } | null> => {
            if (!transactions || transactions.length < 15 || !apiKey) {
                return null;
            }
            const ai = new GoogleGenAI({ apiKey });
            const recentTxSummary = transactions.slice(0, 15).map(t => `${t.description} (${t.amount > 0 ? '+' : ''}${t.amount})`).join('; ');
            const textPrompt = `Analyze the user's recent financial activity summarized below. Based on spending patterns, recurring payments, and savings goals, generate a highly relevant, multi-product "Autonomous Wealth Optimization Bundle".
            The bundle must be named "Quantum Leap Portfolio".
            Provide a compelling, 3-sentence description explaining the financial logic behind this specific bundle recommendation.
            Suggest exactly three distinct, high-value financial products/services for this bundle (e.g., 'High-Yield Bond ETF', 'Term Life Insurance Policy', 'Real Estate Investment Trust Share').
            Format the entire response strictly as a JSON object with keys: "description", "product1", "product2", and "product3".
            Recent Transactions: ${recentTxSummary}`;
            try {
                const textResponse = await ai.models.generateContent({
                    model: AIModels.gemini.modelName,
                    contents: [{ role: 'user', parts: [{ text: textPrompt }] }],
                    config: { temperature: AIModels.gemini.temperature, }
                });
                const bundleData = JSON.parse(textResponse.text);
                const productPromises = [
                    ai.models.generateImages({ model: AIModels.imagen.modelName, prompt: `Professional, abstract visualization of ${bundleData.product1} in a digital financial context.`, config: { numberOfImages: AIModels.imagen.numberOfImages, outputMimeType: AIModels.imagen.outputMimeType, aspectRatio: AIModels.imagen.aspectRatio } }),
                    ai.models.generateImages({ model: AIModels.imagen.modelName, prompt: `Professional, abstract visualization of ${bundleData.product2} in a digital financial context.`, config: { numberOfImages: AIModels.imagen.numberOfImages, outputMimeType: AIModels.imagen.outputMimeType, aspectRatio: AIModels.imagen.aspectRatio } }),
                    ai.models.generateImages({ model: AIModels.imagen.modelName, prompt: `Professional, abstract visualization of ${bundleData.product3} in a digital financial context.`, config: { numberOfImages: AIModels.imagen.numberOfImages, outputMimeType: AIModels.imagen.outputMimeType, aspectRatio: AIModels.imagen.aspectRatio } })
                ];
                const imageResponses = await Promise.all(productPromises);
                const products = [
                    { name: bundleData.product1, imagePrompt: imageResponses[0].generatedImages[0].image.imageBytes },
                    { name: bundleData.product2, imagePrompt: imageResponses[1].generatedImages[0].image.imageBytes },
                    { name: bundleData.product3, imagePrompt: imageResponses[2].generatedImages[0].image.imageBytes },
                ].map(p => ({
                    ...p,
                    imagePrompt: `data:image/jpeg;base64,${p.imagePrompt}`
                }));
                return {
                    title: "Quantum Leap Portfolio",
                    description: bundleData.description,
                    products: products
                };
            } catch (err: any) {
                ApexFinancialArchitects.ErrorHandling.logError("Error generating product bundle:", err);
                return null;
            }
        },
    };
}

// Company Entity A.003 - "Quantix UI Solutions" - UI/UX and Component Library
namespace QuantixUISolutions {
    // A.003.001 - Reusable UI Components (Extensive and Highly Customizable)
    // A.003.001.001 - Card Component
    export const CardComponent: React.FC<{
        title?: string;
        variant?: 'default' | 'interactive';
        className?: string;
        children: React.ReactNode;
        onClick?: () => void;
        isLoading?: boolean;
    }> = ({ title, variant = 'default', className, children, onClick, isLoading }) => {
        const baseClasses = `bg-gray-800 rounded-xl shadow-lg p-4 transition-shadow duration-200 border border-gray-700 ${className || ''}`;
        const interactiveClasses = variant === 'interactive' ? 'hover:shadow-xl cursor-pointer' : '';
        const combinedClasses = `${baseClasses} ${interactiveClasses}`;

        return (
            <div onClick={onClick} className={combinedClasses}>
                {title && <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>}
                {isLoading && (
                    <div className="flex items-center justify-center h-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
                    </div>
                )}
                {!isLoading && children}
            </div>
        );
    };

    // A.003.001.002 - Modal Component (Enhanced)
    export const ModalComponent: React.FC<{
        isOpen: boolean;
        onClose: () => void;
        children: React.ReactNode;
        title: string;
        size?: 'sm' | 'md' | 'lg' | 'xl';
    }> = ({ isOpen, onClose, children, title, size = 'md' }) => {
        if (!isOpen) return null;
        const sizeClasses = {
            sm: 'max-w-lg',
            md: 'max-w-2xl',
            lg: 'max-w-4xl',
            xl: 'max-w-6xl',
        };
        return (
            <div className="fixed inset-0 bg-gray-950/80 flex items-center justify-center z-[1000] backdrop-blur-lg transition-opacity duration-300" onClick={onClose}>
                <div
                    className={`${sizeClasses[size]} w-full mx-4 bg-gray-800 rounded-xl shadow-3xl border border-cyan-700/50 transform transition-transform duration-300 scale-100`}
                    onClick={e => e.stopPropagation()}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    <div className="p-5 border-b border-gray-700 flex justify-between items-center bg-gray-750 rounded-t-xl">
                        <h3 id="modal-title" className="text-xl font-extrabold text-white tracking-tight">{title}</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-red-400 transition-colors p-1 rounded-full hover:bg-gray-700"
                            aria-label="Close modal"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">{children}</div>
                </div>
            </div>
        );
    };

    // A.003.001.003 -  Button Component (Highly Versatile)
    export const ButtonComponent: React.FC<{
        children: React.ReactNode;
        onClick: () => void;
        variant?: 'primary' | 'secondary' | 'outline' | 'destructive';
        size?: 'sm' | 'md' | 'lg';
        disabled?: boolean;
        className?: string;
    }> = ({ children, onClick, variant = 'primary', size = 'md', disabled, className }) => {
        const variantClasses = {
            primary: 'bg-cyan-600 hover:bg-cyan-500 text-white',
            secondary: 'bg-gray-700 hover:bg-gray-600 text-white',
            outline: 'bg-transparent border border-gray-500 text-gray-300 hover:bg-gray-700',
            destructive: 'bg-red-600 hover:bg-red-500 text-white',
        };
        const sizeClasses = {
            sm: 'px-3 py-2 text-sm',
            md: 'px-4 py-2.5 text-base',
            lg: 'px-6 py-3 text-lg',
        };
        const baseClasses = `rounded-lg font-semibold transition-colors duration-200 ${variantClasses[variant]} ${sizeClasses[size]} ${className || ''}`;
        const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
        return (
            <button
                onClick={disabled ? undefined : onClick}
                className={`${baseClasses} ${disabledClasses}`}
                disabled={disabled}
            >
                {children}
            </button>
        );
    };

    // A.003.001.004 - Input Component (Customizable)
    export const InputComponent: React.FC<{
        type?: 'text' | 'password' | 'email' | 'number';
        placeholder?: string;
        value: string;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        className?: string;
        label?: string;
        disabled?: boolean;
    }> = ({ type = 'text', placeholder, value, onChange, className, label, disabled }) => {
        const baseClasses = `bg-gray-700 border border-gray-600 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${className || ''}`;
        return (
            <div className="space-y-1">
                {label && <label className="block text-sm font-medium text-gray-300">{label}</label>}
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={baseClasses}
                    disabled={disabled}
                />
            </div>
        );
    };

    // A.003.002 - Icon Library (Comprehensive, Scalable)
    export const IconLibrary = {
        // A.003.002.001 - Icon Definitions (Using Lucide React for consistency)
        icons: {
            // A.003.002.001.001 - Financial Icons
            link: Bot, //ApexFinancialArchitects.TransactionIcon;
            send: Send,
            bill: ApexFinancialArchitects.TransactionIcon,
            deposit: ApexFinancialArchitects.TransactionIcon,
            shield: ApexFinancialArchitects.TransactionIcon,
            trendingUp: ApexFinancialArchitects.TransactionIcon,
            target: ApexFinancialArchitects.TransactionIcon,
            star: ApexFinancialArchitects.TransactionIcon,
            rocket: ApexFinancialArchitects.TransactionIcon,
            // A.003.002.001.002 - UI/UX Icons
            maximize: Maximize2,
            minimize: Minimize2,
            x: X,
            eye: Eye,
            camera: Camera,
            refreshCw: RefreshCw,
            scanEye: ScanEye,
            bot: Bot,
        },
        // A.003.002.002 -  Icon Renderer Function
        renderIcon: (iconName: keyof typeof IconLibrary.icons, className?: string) => {
            const Icon = IconLibrary.icons[iconName];
            if (!Icon) {
                console.warn(`Icon "${iconName}" not found in IconLibrary.`);
                return null;
            }
            return <Icon className={className} />;
        },
    };

    // A.003.003 - Utility Functions for UI (Animation, Styling)
    export const UIUtils = {
        // A.003.003.001 - Apply Fade-In Animation
        fadeIn: (delay: number = 0, duration: number = 300): React.CSSProperties => {
            return {
                animation: `fadeIn ${duration}ms ease-in-out ${delay}ms`,
                opacity: 0,
            };
        },
        // A.003.003.002 - Apply Slide-In From Bottom Animation
        slideInFromBottom: (distance: number = 10, duration: number = 300): React.CSSProperties => {
            return {
                animation: `slideInFromBottom ${duration}ms ease-in-out`,
            };
        },
        // A.003.003.003 - Generate Dynamic Gradient
        generateGradient: (colors: string[]): React.CSSProperties => {
            return {
                background: `linear-gradient(to right, ${colors.join(', ')})`,
            };
        },
        // A.003.003.004 -  Create a custom scrollbar style
        customScrollbarStyles: {
            '&::-webkit-scrollbar': {
                width: '8px',
            },
            '&::-webkit-scrollbar-track': {
                background: 'rgba(0,0,0,0.2)',
            },
            '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: 'rgba(255,255,255,0.4)',
            },
        },
    };
}

// Company Entity A.004 - "Financial Data Integrations, Inc." - Data Connectivity and API Management
namespace FinancialDataIntegrations {
    // A.004.001 - Plaid Integration Component (Encapsulated and Secure)
    export const PlaidIntegration: React.FC<{ onSuccess: (publicToken: string, metadata: any) => void; disabled?: boolean; }> = ({ onSuccess, disabled }) => {
        const [plaidLink, setPlaidLink] = useState<any>(null); // A.004.001.001 - Plaid Link Instance
        const [loading, setLoading] = useState(false);  // A.004.001.002 - Loading State

        useEffect(() => {
            // A.004.001.003 - Initialize Plaid Link on Component Mount
            const initializePlaid = async () => {
                if (typeof window === 'undefined') return;
                try {
                    const { PlaidLink } = await import('react-plaid-link');
                    setPlaidLink(() => PlaidLink);
                } catch (error) {
                    ApexFinancialArchitects.ErrorHandling.logError("Failed to load Plaid Link", error);
                }
            };
            initializePlaid();
        }, []);

        const handleOpenPlaid = useCallback(() => {
            if (plaidLink && !disabled) {
                setLoading(true);
                const handler = new (window as any).PlaidLink({
                    clientName: "Quantum Core 3.0",
                    env: "sandbox", // Use 'sandbox' for testing, 'development', or 'production'
                    key: "YOUR_PLAID_CLIENT_ID", // Replace with your actual Plaid Client ID
                    product: ["auth", "transactions", "identity"],
                    onSuccess: async (publicToken: string, metadata: any) => {
                        onSuccess(publicToken, metadata);
                        setLoading(false);
                    },
                    onExit: () => {
                        setLoading(false);
                    },
                });
                handler.open();
            }
        }, [plaidLink, onSuccess, disabled]);

        return (
            <QuantixUISolutions.ButtonComponent
                onClick={handleOpenPlaid}
                disabled={disabled || loading || !plaidLink}
                variant="primary"
                className="w-full"
            >
                {loading ? "Loading..." : "Link Bank Account"}
            </QuantixUISolutions.ButtonComponent>
        );
    };

    // A.004.002 - API Client Configuration (Centralized and Secure)
    export const APIClient = {
        // A.004.002.001 - Base URL for API Calls
        baseURL: 'https://ce47fe80-dabc-4ad0-b0e7-cf285695b8b8.mock.pstmn.io', // A.004.002.001.001 - Mock API Endpoint

        // A.004.002.002 - Default Headers (Including Authorization)
        getDefaultHeaders: (apiKey?: string): Record<string, string> => {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            };
            if (apiKey) {
                headers['Authorization'] = `Bearer ${apiKey}`; // A.004.002.002.001 - Bearer Token Authentication
            }
            return headers;
        },

        // A.004.002.003 - Make GET Request
        get: async <T>(endpoint: string, apiKey?: string): Promise<ApexFinancialArchitects.ApiResponse<T>> => {
            try {
                const response = await fetch(`${APIClient.baseURL}${endpoint}`, {
                    method: 'GET',
                    headers: APIClient.getDefaultHeaders(apiKey),
                });
                const data = await response.json();
                return data as ApexFinancialArchitects.ApiResponse<T>;
            } catch (error: any) {
                ApexFinancialArchitects.ErrorHandling.logError(`GET Request Failed: ${endpoint}`, error);
                return { statusCode: 500, message: 'An unexpected error occurred.', data: null, error: error.message };
            }
        },

        // A.004.002.004 - Make POST Request
        post: async <T, U>(endpoint: string, body: U, apiKey?: string): Promise<ApexFinancialArchitects.ApiResponse<T>> => {
            try {
                const response = await fetch(`${APIClient.baseURL}${endpoint}`, {
                    method: 'POST',
                    headers: APIClient.getDefaultHeaders(apiKey),
                    body: JSON.stringify(body),
                });
                const data = await response.json();
                return data as ApexFinancialArchitects.ApiResponse<T>;
            } catch (error: any) {
                ApexFinancialArchitects.ErrorHandling.logError(`POST Request Failed: ${endpoint}`, error);
                return { statusCode: 500, message: 'An unexpected error occurred.', data: null, error: error.message };
            }
        },

        // A.004.002.005 - Make PUT Request
        put: async <T, U>(endpoint: string, body: U, apiKey?: string): Promise<ApexFinancialArchitects.ApiResponse<T>> => {
            try {
                const response = await fetch(`${APIClient.baseURL}${endpoint}`, {
                    method: 'PUT',
                    headers: APIClient.getDefaultHeaders(apiKey),
                    body: JSON.stringify(body),
                });
                const data = await response.json();
                return data as ApexFinancialArchitects.ApiResponse<T>;
            } catch (error: any) {
                ApexFinancialArchitects.ErrorHandling.logError(`PUT Request Failed: ${endpoint}`, error);
                return { statusCode: 500, message: 'An unexpected error occurred.', data: null, error: error.message };
            }
        },

        // A.004.002.006 - Make DELETE Request
        delete: async <T>(endpoint: string, apiKey?: string): Promise<ApexFinancialArchitects.ApiResponse<T>> => {
            try {
                const response = await fetch(`${APIClient.baseURL}${endpoint}`, {
                    method: 'DELETE',
                    headers: APIClient.getDefaultHeaders(apiKey),
                });
                // Handle potential 204 No Content response
                if (response.status === 204) {
                    return { statusCode: 204, message: 'Resource deleted successfully.', data: null };
                }
                const data = await response.json();
                return data as ApexFinancialArchitects.ApiResponse<T>;
            } catch (error: any) {
                ApexFinancialArchitects.ErrorHandling.logError(`DELETE Request Failed: ${endpoint}`, error);
                return { statusCode: 500, message: 'An unexpected error occurred.', data: null, error: error.message };
            }
        },
    };
}

// ================================================================================================
// DASHBOARD COMPONENT IMPLEMENTATION
// ================================================================================================

const Dashboard: React.FC = () => {
    const { user, setUser, accounts, setAccounts, transactions, setTransactions, budgets, setBudgets, savingsGoals, setSavingsGoals, marketMovers, setMarketMovers, aiInsights, setAiInsights, gamificationData, setGamificationData, rewardPoints, setRewardPoints, creditScore, setCreditScore, subscriptions, setSubscriptions, upcomingBills, setUpcomingBills, impactData, setImpactData, apiKey, setApiKey } = useContext(DataContext);
    const [isModalOpen, setIsModalOpen] = useState(false); // A.003.001.002.001 - Modal State
    const [selectedInsight, setSelectedInsight] = useState<ApexFinancialArchitects.AIInsight | null>(null); // A.003.001.002.002 - Selected Insight for Modal
    const [loadingData, setLoadingData] = useState(true); // A.003.001.002.003 - Loading State for Data Fetching

    // A.001.003.003 - Fetch User Data (Comprehensive)
    const fetchUserData = useCallback(async () => {
        if (!apiKey) {
            setLoadingData(false);
            return;
        }
        setLoadingData(true);
        try {
            const [userResponse, accountsResponse, transactionsResponse, budgetsResponse, goalsResponse, marketResponse, insightsResponse, gamificationResponse, rewardsResponse, creditScoreResponse, subscriptionsResponse, billsResponse, impactResponse] = await Promise.all([
                FinancialDataIntegrations.APIClient.get<ApexFinancialArchitects.SovereignUser>('/users/me', apiKey),
                FinancialDataIntegrations.APIClient.get<ApexFinancialArchitects.ApiResponse<Account[]>>('/accounts/me', apiKey),
                FinancialDataIntegrations.APIClient.get<ApexFinancialArchitects.ApiResponse<Transaction[]>>('/transactions', apiKey),
                FinancialDataIntegrations.APIClient.get<ApexFinancialArchitects.ApiResponse<BudgetCategory[]>>('/budgets', apiKey), // Assuming a /budgets endpoint exists
                FinancialDataIntegrations.APIClient.get<ApexFinancialArchitects.ApiResponse<SavingsGoal[]>>('/goals', apiKey), // Assuming a /goals endpoint exists
                FinancialDataIntegrations.APIClient.get<ApexFinancialArchitects.ApiResponse<MarketMover[]>>('/market/movers', apiKey), // Assuming a /market/movers endpoint exists
                FinancialDataIntegrations.APIClient.get<ApexFinancialArchitects.ApiResponse<ApexFinancialArchitects.AIInsight[]>>('/ai/insights', apiKey), // Assuming an /ai/insights endpoint exists
                FinancialDataIntegrations.APIClient.get<ApexFinancialArchitects.ApiResponse<GamificationState>>('/users/me/gamification', apiKey), // Assuming a gamification endpoint
                FinancialDataIntegrations.APIClient.get<ApexFinancialArchitects.ApiResponse<RewardPoints>>('/users/me/rewards', apiKey), // Assuming a rewards endpoint
                FinancialDataIntegrations.APIClient.get<ApexFinancialArchitects.ApiResponse<CreditScore>>('/users/me/credit-score', apiKey), // Assuming a credit score endpoint
                FinancialDataIntegrations.APIClient.get<ApexFinancialArchitects.ApiResponse<Subscription[]>>('/users/me/subscriptions', apiKey), // Assuming a subscriptions endpoint
                FinancialDataIntegrations.APIClient.get<ApexFinancialArchitects.ApiResponse<UpcomingBill[]>>('/bills/upcoming', apiKey), // Assuming an upcoming bills endpoint
                FinancialDataIntegrations.APIClient.get<ApexFinancialArchitects.ApiResponse<ApexFinancialArchitects.ImpactData>>('/sustainability/carbon-footprint', apiKey), // Assuming an impact data endpoint
            ]);

            if (userResponse.statusCode === 200 && userResponse.data) {
                setUser(userResponse.data);
                setApiKey(userResponse.data.apiKey); // Set the API key from user data
            }
            if (accountsResponse.statusCode === 200 && accountsResponse.data) {
                setAccounts(accountsResponse.data.data || []);
            }
            if (transactionsResponse.statusCode === 200 && transactionsResponse.data) {
                setTransactions(transactionsResponse.data.data || []);
            }
            if (budgetsResponse.statusCode === 200 && budgetsResponse.data) {
                setBudgets(budgetsResponse.data.data || []);
            }
            if (goalsResponse.statusCode === 200 && goalsResponse.data) {
                setSavingsGoals(goalsResponse.data.data || []);
            }
            if (marketResponse.statusCode === 200 && marketResponse.data) {
                setMarketMovers(marketResponse.data.data || []);
            }
            if (insightsResponse.statusCode === 200 && insightsResponse.data) {
                setAiInsights(insightsResponse.data.data || []);
            }
            if (gamificationResponse.statusCode === 200 && gamificationResponse.data) {
                setGamificationData(gamificationResponse.data.data || {});
            }
            if (rewardsResponse.statusCode === 200 && rewardsResponse.data) {
                setRewardPoints(rewardsResponse.data.data || { currentPoints: 0, lifetimePoints: 0 });
            }
            if (creditScoreResponse.statusCode === 200 && creditScoreResponse.data) {
                setCreditScore(creditScoreResponse.data.data || { score: 0, source: '', lastUpdated: '' });
            }
            if (subscriptionsResponse.statusCode === 200 && subscriptionsResponse.data) {
                setSubscriptions(subscriptionsResponse.data.data || []);
            }
            if (billsResponse.statusCode === 200 && billsResponse.data) {
                setUpcomingBills(billsResponse.data.data || []);
            }
            if (impactResponse.statusCode === 200 && impactResponse.data) {
                setImpactData(impactResponse.data.data || { treesPlanted: 0, carbonOffset: 0, progressToNextTree: 0 });
            }

        } catch (error) {
            ApexFinancialArchitects.ErrorHandling.logError("Failed to fetch user data", error);
        } finally {
            setLoadingData(false);
        }
    }, [apiKey, setUser, setAccounts, setTransactions, setBudgets, setSavingsGoals, setMarketMovers, setAiInsights, setGamificationData, setRewardPoints, setCreditScore, setSubscriptions, setUpcomingBills, setImpactData, setApiKey]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    // A.001.003.001 - Format Currency for Display
    const formatCurrency = ApexFinancialArchitects.Utils.formatCurrency;

    // A.001.003.005 - Calculate Total Balance
    const totalBalance = useMemo(() => {
        return accounts.reduce((sum, account) => sum + (account.currentBalance || 0), 0);
    }, [accounts]);

    // A.001.003.006 - Calculate Total Savings Goal Progress
    const totalSavingsGoalProgress = useMemo(() => {
        if (!savingsGoals || savingsGoals.length === 0) return 0;
        const totalProgress = savingsGoals.reduce((sum, goal) => sum + goal.progressPercentage, 0);
        return ApexFinancialArchitects.Utils.calculatePercentage(totalProgress, savingsGoals.length);
    }, [savingsGoals]);

    // A.001.003.007 - Prepare Data for Charts
    const chartData = useMemo(() => {
        const budgetCategories = budgets.map(b => ({ name: b.name, value: b.allocated - (b.spent || 0) }));
        const transactionCategories = transactions.reduce((acc, tx) => {
            const existing = acc.find(item => item.name === tx.category);
            if (existing) {
                existing.value += tx.amount;
            } else {
                acc.push({ name: tx.category, value: tx.amount });
            }
            return acc;
        }, [] as { name: string; value: number }[]);
        return { budgetCategories, transactionCategories };
    }, [budgets, transactions]);

    // A.001.003.008 - Handle Insight Click
    const handleInsightClick = (insight: ApexFinancialArchitects.AIInsight) => {
        setSelectedInsight(insight);
        setIsModalOpen(true);
    };

    // A.001.003.009 - Close Modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedInsight(null);
    };

    // A.001.003.010 - Render AI Insights
    const renderAIInsights = () => {
        if (loadingData) return <QuantixUISolutions.CardComponent isLoading={true} title="AI Insights" />;
        if (!aiInsights || aiInsights.length === 0) return <QuantixUISolutions.CardComponent title="AI Insights">No insights available.</QuantixUISolutions.CardComponent>;

        return (
            <QuantixUISolutions.CardComponent title="AI Insights">
                <div className="space-y-3">
                    {aiInsights.slice(0, 3).map((insight) => (
                        <div key={insight.insightId} className="bg-gray-700 p-3 rounded-md cursor-pointer hover:bg-gray-600 transition-colors" onClick={() => handleInsightClick(insight)}>
                            <h4 className="text-sm font-semibold text-white">{insight.title}</h4>
                            <p className="text-xs text-gray-300 truncate">{insight.description}</p>
                        </div>
                    ))}
                    {aiInsights.length > 3 && (
                        <QuantixUISolutions.ButtonComponent onClick={() => { /* Navigate to insights page */ }} variant="outline" size="sm">
                            View All Insights
                        </QuantixUISolutions.ButtonComponent>
                    )}
                </div>
            </QuantixUISolutions.CardComponent>
        );
    };

    // A.001.003.011 - Render Gamification and Rewards
    const renderGamificationAndRewards = () => {
        if (loadingData) return <QuantixUISolutions.CardComponent isLoading={true} title="Your Progress" />;
        return (
            <QuantixUISolutions.CardComponent title="Your Progress">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="text-sm font-semibold text-gray-300">Gamification Level</h4>
                        <p className="text-lg font-bold text-cyan-400">{gamificationData?.level || 0}</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-gray-300">Reward Points</h4>
                        <p className="text-lg font-bold text-cyan-400">{rewardPoints?.currentPoints || 0}</p>
                    </div>
                </div>
            </QuantixUISolutions.CardComponent>
        );
    };

    // A.001.003.012 - Render Credit Score
    const renderCreditScore = () => {
        if (loadingData) return <QuantixUISolutions.CardComponent isLoading={true} title="Credit Score" />;
        return (
            <QuantixUISolutions.CardComponent title="Credit Score">
                <div className="flex flex-col items-center justify-center">
                    <h3 className={`text-5xl font-extrabold ${creditScore?.score && creditScore.score >= 700 ? 'text-green-400' : creditScore?.score && creditScore.score >= 600 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {creditScore?.score || 'N/A'}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">Source: {creditScore?.source || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">Last Updated: {creditScore?.lastUpdated ? new Date(creditScore.lastUpdated).toLocaleDateString() : 'N/A'}</p>
                </div>
            </QuantixUISolutions.CardComponent>
        );
    };

    // A.001.003.013 - Render Savings Goals Overview
    const renderSavingsGoalsOverview = () => {
        if (loadingData) return <QuantixUISolutions.CardComponent isLoading={true} title="Savings Goals" />;
        if (!savingsGoals || savingsGoals.length === 0) return <QuantixUISolutions.CardComponent title="Savings Goals">No savings goals set.</QuantixUISolutions.CardComponent>;

        return (
            <QuantixUISolutions.CardComponent title="Savings Goals">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h4 className="text-lg font-bold text-white">{savingsGoals[0].name}</h4>
                        <p className="text-sm text-gray-300">{formatCurrency(savingsGoals[0].currentAmount)} / {formatCurrency(savingsGoals[0].targetAmount)}</p>
                    </div>
                    <div className="relative w-24 h-24">
                        <QuantixUISolutions.UIUtils.customScrollbarStyles
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[{ value: savingsGoals[0].progressPercentage, name: 'Progress' }]}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={50}
                                        fill="#8884d8"
                                        dataKey="value"
                                        startAngle={90}
                                        endAngle={450}
                                    >
                                        <Cell key="progress" fill="#4ade80" /> {/* Green for progress */}
                                    </Pie>
                                    <Pie
                                        data={[{ value: 100 - savingsGoals[0].progressPercentage, name: 'Remaining' }]}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={50}
                                        fill="#8884d8"
                                        dataKey="value"
                                        startAngle={90}
                                        endAngle={450}
                                    >
                                        <Cell key="remaining" fill="#6b7280" /> {/* Gray for remaining */}
                                    </Pie>
                                    <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                                </PieChart>
                            </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                            {savingsGoals[0].progressPercentage}%
                        </div>
                    </div>
                </div>
                {savingsGoals.length > 1 && (
                    <QuantixUISolutions.ButtonComponent onClick={() => { /* Navigate to goals page */ }} variant="outline" size="sm">
                        View All Goals
                    </QuantixUISolutions.ButtonComponent>
                )}
            </QuantixUISolutions.CardComponent>
        );
    };

    // A.001.003.014 - Render Upcoming Bills
    const renderUpcomingBills = () => {
        if (loadingData) return <QuantixUISolutions.CardComponent isLoading={true} title="Upcoming Bills" />;
        if (!upcomingBills || upcomingBills.length === 0) return <QuantixUISolutions.CardComponent title="Upcoming Bills">No upcoming bills.</QuantixUISolutions.CardComponent>;

        return (
            <QuantixUISolutions.CardComponent title="Upcoming Bills">
                <div className="space-y-3">
                    {upcomingBills.slice(0, 3).map((bill) => (
                        <div key={bill.id} className="flex justify-between items-center text-white">
                            <div>
                                <h4 className="text-sm font-semibold">{bill.description}</h4>
                                <p className="text-xs text-gray-300">{bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : 'No due date'}</p>
                            </div>
                            <p className="font-bold text-cyan-400">{formatCurrency(bill.amount)}</p>
                        </div>
                    ))}
                    {upcomingBills.length > 3 && (
                        <QuantixUISolutions.ButtonComponent onClick={() => { /* Navigate to bills page */ }} variant="outline" size="sm">
                            View All Bills
                        </QuantixUISolutions.ButtonComponent>
                    )}
                </div>
            </QuantixUISolutions.CardComponent>
        );
    };

    // A.001.003.015 - Render Market Movers
    const renderMarketMovers = () => {
        if (loadingData) return <QuantixUISolutions.CardComponent isLoading={true} title="Market Movers" />;
        if (!marketMovers || marketMovers.length === 0) return <QuantixUISolutions.CardComponent title="Market Movers">Market data unavailable.</QuantixUISolutions.CardComponent>;

        return (
            <QuantixUISolutions.CardComponent title="Market Movers">
                <div className="space-y-3">
                    {marketMovers.slice(0, 3).map((mover) => (
                        <div key={mover.symbol} className="flex justify-between items-center text-white">
                            <div>
                                <h4 className="text-sm font-semibold">{mover.symbol}</h4>
                                <p className="text-xs text-gray-300">{mover.name}</p>
                            </div>
                            <div className="flex items-center">
                                <span className={`mr-2 ${mover.changePercent > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {mover.changePercent.toFixed(2)}%
                                </span>
                                {QuantixUISolutions.IconLibrary.renderIcon(mover.changePercent > 0 ? 'trendingUp' : 'trendingDown', `h-4 w-4 ${mover.changePercent > 0 ? 'text-green-400' : 'text-red-400'}`)}
                            </div>
                        </div>
                    ))}
                    {marketMovers.length > 3 && (
                        <QuantixUISolutions.ButtonComponent onClick={() => { /* Navigate to market page */ }} variant="outline" size="sm">
                            View Market Data
                        </QuantixUISolutions.ButtonComponent>
                    )}
                </div>
            </QuantixUISolutions.CardComponent>
        );
    };

    // A.001.003.016 - Render Impact Tracker
    const renderImpactTracker = () => {
        if (loadingData) return <QuantixUISolutions.CardComponent isLoading={true} title="Your Impact" />;
        return (
            <QuantixUISolutions.CardComponent title="Your Impact">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h4 className="text-sm font-semibold text-gray-300">Trees Planted</h4>
                        <p className="text-lg font-bold text-green-400">{impactData?.treesPlanted || 0}</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-gray-300">Carbon Offset</h4>
                        <p className="text-lg font-bold text-green-400">{impactData?.carbonOffset.toFixed(2) || 0} kg CO2e</p>
                    </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div
                        className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${impactData?.progressToNextTree || 0}%` }}
                    ></div>
                </div>
                <p className="text-xs text-gray-400 mt-1 text-center">{impactData?.progressToNextTree || 0}% towards next tree</p>
            </QuantixUISolutions.CardComponent>
        );
    };

    // A.001.003.017 - Render Balance Summary Chart
    const renderBalanceSummaryChart = () => {
        const balanceData = accounts.map(account => ({
            name: account.name,
            balance: account.currentBalance || 0,
        }));

        return (
            <QuantixUISolutions.CardComponent title="Account Balances">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={balanceData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <XAxis type="number" stroke="#9ca3af" />
                        <YAxis type="category" dataKey="name" stroke="#9ca3af" />
                        <Tooltip formatter={(value, name) => [formatCurrency(value as number), name as string]} />
                        <Legend wrapperStyle={{ color: '#9ca3af' }} />
                        <Bar dataKey="balance" fill="#3b82f6" barSize={15}>
                            {balanceData.map((entry, index) => (
                                <QuantixUISolutions.UIUtils.customScrollbarStyles
                                    <Cell key={`cell-${index}`} fill={entry.balance >= 0 ? '#3b82f6' : '#f87171'} />
                                    {/* A.003.003.004 - Custom Scrollbar Styles */}
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </QuantixUISolutions.CardComponent>
        );
    };

    // A.001.003.018 - Render Transaction Breakdown Chart
    const renderTransactionBreakdownChart = () => {
        const transactionData = chartData.transactionCategories.map(cat => ({
            name: cat.name,
            value: Math.abs(cat.value), // Use absolute value for chart
        }));

        const COLORS = ['#4ade80', '#facc15', '#fb923c', '#60a5fa', '#a78bfa', '#ec4899', '#84cc17', '#06b6d4'];

        return (
            <QuantixUISolutions.CardComponent title="Spending Breakdown">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={transactionData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {transactionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value, name) => [`${formatCurrency(value as number)}`, name as string]} />
                        <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ color: '#9ca3af' }} />
                    </PieChart>
                </ResponsiveContainer>
            </QuantixUISolutions.CardComponent>
        );
    };

    // A.001.003.019 - Render Budget vs. Actuals Chart
    const renderBudgetVsActualsChart = () => {
        const budgetVsActualData = chartData.budgetCategories.map(b => ({
            name: b.name,
            allocated: b.allocated,
            spent: b.spent || 0,
        }));

        return (
            <QuantixUISolutions.CardComponent title="Budget vs. Actual Spending">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={budgetVsActualData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <XAxis type="number" stroke="#9ca3af" />
                        <YAxis type="category" dataKey="name" stroke="#9ca3af" />
                        <Tooltip formatter={(value, name) => [formatCurrency(value as number), name as string]} />
                        <Legend wrapperStyle={{ color: '#9ca3af' }} />
                        <Bar dataKey="allocated" fill="#60a5fa" barSize={10} name="Allocated" />
                        <Bar dataKey="spent" fill="#f87171" barSize={10} name="Spent" />
                    </BarChart>
                </ResponsiveContainer>
            </QuantixUISolutions.CardComponent>
        );
    };

    // A.001.003.020 - Render Wealth Timeline
    const renderWealthTimeline = () => {
        // Placeholder for WealthTimeline component data
        const wealthData = [
            { year: '2022', value: 300000 },
            { year: '2023', value: 350000 },
            { year: '2024', value: 400000 },
        ];
        return (
            <QuantixUISolutions.CardComponent title="Wealth Over Time">
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={wealthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="year" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip formatter={(value, name) => [formatCurrency(value as number), name as string]} />
                        <Area type="monotone" dataKey="value" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
                    </AreaChart>
                </ResponsiveContainer>
            </QuantixUISolutions.CardComponent>
        );
    };

    // A.001.003.021 - Render Recent Transactions
    const renderRecentTransactions = () => {
        if (loadingData) return <QuantixUISolutions.CardComponent isLoading={true} title="Recent Transactions" />;
        if (!transactions || transactions.length === 0) return <QuantixUISolutions.CardComponent title="Recent Transactions">No recent transactions.</QuantixUISolutions.CardComponent>;

        return (
            <QuantixUISolutions.CardComponent title="Recent Transactions">
                <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                    {transactions.slice(0, 5).map((tx) => (
                        <div key={tx.id} className="flex justify-between items-center text-white">
                            <div className="flex items-center">
                                {QuantixUISolutions.IconLibrary.renderIcon(tx.icon || 'transaction', 'h-5 w-5 mr-3 text-cyan-400')}
                                <div>
                                    <h4 className="text-sm font-semibold">{tx.description}</h4>
                                    <p className="text-xs text-gray-300">{tx.category}</p>
                                </div>
                            </div>
                            <p className={`font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                            </p>
                        </div>
                    ))}
                </div>
                {transactions.length > 5 && (
                    <QuantixUISolutions.ButtonComponent onClick={() => { /* Navigate to transactions page */ }} variant="outline" size="sm" className="mt-3">
                        View All Transactions
                    </QuantixUISolutions.ButtonComponent>
                )}
            </QuantixUISolutions.CardComponent>
        );
    };

    // A.001.003.022 - Render AI Chat Interface
    const renderAIChatInterface = () => {
        const [chatInput, setChatInput] = useState('');
        const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string }>>([]);
        const [sessionId, setSessionId] = useState<string | null>(null);
        const [isChatLoading, setIsChatLoading] = useState(false);
        const chatContainerRef = useRef<HTMLDivElement>(null);

        const handleSendMessage = async () => {
            if (!chatInput.trim() || !apiKey) return;

            const newUserMessage = { role: 'user', content: chatInput };
            setChatHistory(prev => [...prev, newUserMessage]);
            setChatInput('');
            setIsChatLoading(true);

            try {
                const ai = new GoogleGenAI({ apiKey });
                const model = ai.getGenerativeModel({ model: ApexFinancialArchitects.SovereignUser.AIModels.gemini.modelName });

                let currentSessionId = sessionId;
                if (!currentSessionId) {
                    const result = await model.startChat({ history: [] });
                    setSessionId(result.startChat.chatId);
                    currentSessionId = result.startChat.chatId;
                }

                const chatResult = await model.sendMessage(chatInput, { chatId: currentSessionId! });
                const response = chatResult.response;
                const text = response.text();

                setChatHistory(prev => [...prev, { role: 'assistant', content: text }]);
            } catch (error: any) {
                ApexFinancialArchitects.ErrorHandling.logError("Error sending message to AI", error);
                setChatHistory(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again." }]);
            } finally {
                setIsChatLoading(false);
            }
        };

        useEffect(() => {
            // Scroll to bottom of chat history
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        }, [chatHistory]);

        return (
            <QuantixUISolutions.CardComponent title="Quantum AI Advisor">
                <div className="flex flex-col h-96">
                    <div ref={chatContainerRef} className="flex-1 overflow-y-auto mb-4 space-y-3 p-3 border border-gray-700 rounded-md bg-gray-850 custom-scrollbar">
                        {chatHistory.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-start`}>
                                <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg ${msg.role === 'user' ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isChatLoading && (
                            <div className="flex justify-start items-start">
                                <div className="animate-pulse bg-gray-700 p-3 rounded-lg text-gray-200 max-w-xs md:max-w-md lg:max-w-lg">
                                    Quantum AI is thinking...
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center space-x-2">
                        <QuantixUISolutions.InputComponent
                            type="text"
                            placeholder="Ask Quantum AI anything..."
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            className="flex-1"
                        />
                        <QuantixUISolutions.ButtonComponent onClick={handleSendMessage} disabled={!chatInput.trim() || isChatLoading || !apiKey}>
                            {QuantixUISolutions.IconLibrary.renderIcon('send', 'h-5 w-5')}
                        </QuantixUISolutions.ButtonComponent>
                        <QuantixUISolutions.ButtonComponent onClick={() => { /* Implement refresh/new chat */ }} variant="secondary" size="md">
                            {QuantixUISolutions.IconLibrary.renderIcon('refreshCw', 'h-5 w-5')}
                        </QuantixUISolutions.ButtonComponent>
                    </div>
                </div>
            </QuantixUISolutions.CardComponent>
        );
    };

    // A.001.003.023 - Render Plaid Link Button
    const renderPlaidLinkButton = () => {
        return (
            <div className="w-full">
                <FinancialDataIntegrations.PlaidIntegration onSuccess={(publicToken, metadata) => {
                    console.log("Plaid Success:", publicToken, metadata);
                    // Here you would typically exchange the public token for an access token
                    // and then fetch account data using the access token.
                    // For this example, we'll just refetch user data which might include updated accounts.
                    fetchUserData();
                }} />
            </div>
        );
    };

    return (
        <div className="dashboard-container p-4 md:p-8 bg-gray-900 min-h-screen text-white">
            <h1 className="text-3xl font-bold mb-6 text-cyan-400">Welcome, {user?.username || 'User'}!</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Column 1: Financial Overview */}
                <div className="lg:col-span-1 space-y-6">
                    {renderCreditScore()}
                    {renderGamificationAndRewards()}
                    {renderSavingsGoalsOverview()}
                </div>

                {/* Column 2: Financial Health & Insights */}
                <div className="lg:col-span-2 space-y-6">
                    <QuantixUISolutions.CardComponent title="Financial Snapshot">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex flex-col items-center">
                                <h4 className="text-sm font-semibold text-gray-300">Total Balance</h4>
                                <p className="text-2xl font-bold text-cyan-400">{formatCurrency(totalBalance)}</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <h4 className="text-sm font-semibold text-gray-300">Savings Progress</h4>
                                <p className="text-2xl font-bold text-green-400">{totalSavingsGoalProgress.toFixed(1)}%</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <h4 className="text-sm font-semibold text-gray-300">AI Risk Score</h4>
                                <p className={`text-2xl font-bold ${SovereignAILabs.DataProcessing.calculateRiskScore(transactions) > 70 ? 'text-red-400' : 'text-green-400'}`}>
                                    {SovereignAILabs.DataProcessing.calculateRiskScore(transactions)}
                                </p>
                            </div>
                        </div>
                    </QuantixUISolutions.CardComponent>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {renderMarketMovers()}
                        {renderUpcomingBills()}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Column 3: Visualizations */}
                <div className="lg:col-span-2 space-y-6">
                    {renderBalanceSummaryChart()}
                    {renderBudgetVsActualsChart()}
                </div>

                {/* Column 4: AI & Impact */}
                <div className="lg:col-span-1 space-y-6">
                    {renderAIInsights()}
                    {renderImpactTracker()}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Column 5: Transactions & Goals */}
                <div className="lg:col-span-1">
                    {renderRecentTransactions()}
                </div>
                <div className="lg:col-span-1">
                    {renderWealthTimeline()}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Column 6: AI Chat & Plaid */}
                <div className="lg:col-span-1">
                    {renderAIChatInterface()}
                </div>
                <div className="lg:col-span-1 flex flex-col justify-between">
                    {!accounts || accounts.length === 0 ? (
                        <QuantixUISolutions.CardComponent title="Link Your Financial Accounts">
                            <p className="text-gray-300 mb-4">Connect your bank accounts to get a full financial overview.</p>
                            {renderPlaidLinkButton()}
                        </QuantixUISolutions.CardComponent>
                    ) : (
                        <BalanceSummary accounts={accounts} />
                    )}
                    {/* Placeholder for another component or feature */}
                    <QuantixUISolutions.CardComponent title="Future Feature Placeholder">
                        <p className="text-gray-400">More powerful financial tools coming soon!</p>
                    </QuantixUISolutions.CardComponent>
                </div>
            </div>

            {/* AI Insight Modal */}
            <QuantixUISolutions.ModalComponent
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={selectedInsight?.title || "AI Insight"}
                size="lg"
            >
                {selectedInsight ? (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-cyan-400">{selectedInsight.title}</h3>
                        <p className="text-gray-200">{selectedInsight.description}</p>
                        {selectedInsight.recommendations && selectedInsight.recommendations.length > 0 && (
                            <div>
                                <h4 className="text-lg font-semibold text-white mb-2">Recommendations:</h4>
                                <ul className="list-disc list-inside text-gray-300 space-y-1">
                                    {selectedInsight.recommendations.map((rec, i) => (
                                        <li key={i}>{rec}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <p className="text-sm text-gray-400">Confidence: {selectedInsight.confidenceScore.toFixed(2)} | Actionable: {selectedInsight.actionable ? 'Yes' : 'No'}</p>
                        <QuantixUISolutions.ButtonComponent onClick={handleCloseModal} variant="secondary">
                            Close
                        </QuantixUISolutions.ButtonComponent>
                    </div>
                ) : (
                    <p>Loading insight details...</p>
                )}
            </QuantixUISolutions.ModalComponent>
        </div>
    );
};

export default Dashboard;