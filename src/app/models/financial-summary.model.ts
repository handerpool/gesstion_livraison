import { Transaction } from './transaction.model'; // تأكد من المسار الصحيح

export interface FinancialSummary {
    totalRevenue: number;
    pendingPayments: number;
    transactionCount: number;
    monthlyRevenue: MonthlyRevenue[];
    recentTransactions: Transaction[];
}

export interface MonthlyRevenue {
    month: string;
    revenue: number;
}