import { Transaction } from './transaction.model';
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