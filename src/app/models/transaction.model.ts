export interface Transaction {
    id: number;
    date: Date;
    clientId: number;
    clientName: string;
    type: 'payment' | 'refund' | 'charge';
    amount: number;
    status: 'completed' | 'pending' | 'failed';
    paymentMethod: string;
    reference: string;
    description?: string;
  }
  
  export interface FinancialSummary {
    totalRevenue: number;
    pendingPayments: number;
    recentTransactions: Transaction[];
    monthlyRevenue: MonthlyRevenue[];
  }
  
  export interface MonthlyRevenue {
    month: string;
    revenue: number;
  }