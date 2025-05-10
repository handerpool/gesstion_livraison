import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FinancialSummary, MonthlyRevenue, Transaction } from '../models/transaction.model';
import { Chart, ChartConfiguration } from 'chart.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [CommonModule,FormsModule,SidebarComponent],
  templateUrl: './finance.component.html',
  styleUrl: './finance.component.css'
})
export class FinanceComponent implements OnInit {
  @ViewChild('revenueChart')
  revenueChartCanvas!: ElementRef;
  
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  financialSummary!: FinancialSummary;
  
  dateFilter: string = 'all';
  typeFilter: string = 'all';
  statusFilter: string = 'all';
  searchTerm: string = '';
  
  revenueChart!: Chart;
  
  constructor() { }

  ngOnInit(): void {
    // In a real app, this would come from a service
    this.transactions = this.getMockTransactions();
    this.filteredTransactions = [...this.transactions];
    this.financialSummary = this.calculateFinancialSummary();
  }

  ngAfterViewInit(): void {
    this.initRevenueChart();
  }

  getMockTransactions(): Transaction[] {
    return [
      {
        id: 1,
        date: new Date(2023, 4, 15),
        clientId: 1,
        clientName: 'Acme Corporation',
        type: 'payment',
        amount: 1250.00,
        status: 'completed',
        paymentMethod: 'Credit Card',
        reference: 'INV-2023-001'
      },
      {
        id: 2,
        date: new Date(2023, 4, 18),
        clientId: 2,
        clientName: 'TechStart SAS',
        type: 'payment',
        amount: 875.50,
        status: 'completed',
        paymentMethod: 'Bank Transfer',
        reference: 'INV-2023-002'
      },
      {
        id: 3,
        date: new Date(2023, 4, 20),
        clientId: 3,
        clientName: 'Gourmet Deliveries',
        type: 'payment',
        amount: 2340.00,
        status: 'pending',
        paymentMethod: 'Bank Transfer',
        reference: 'INV-2023-003'
      },
      {
        id: 4,
        date: new Date(2023, 4, 22),
        clientId: 1,
        clientName: 'Acme Corporation',
        type: 'refund',
        amount: 150.00,
        status: 'completed',
        paymentMethod: 'Credit Card',
        reference: 'REF-2023-001',
        description: 'Partial refund for damaged items'
      },
      {
        id: 5,
        date: new Date(2023, 4, 25),
        clientId: 4,
        clientName: 'Fashion Boutique',
        type: 'payment',
        amount: 560.75,
        status: 'failed',
        paymentMethod: 'Credit Card',
        reference: 'INV-2023-004',
        description: 'Payment declined by bank'
      },
      {
        id: 6,
        date: new Date(2023, 4, 28),
        clientId: 5,
        clientName: 'Green Gardens',
        type: 'payment',
        amount: 320.25,
        status: 'completed',
        paymentMethod: 'PayPal',
        reference: 'INV-2023-005'
      },
      {
        id: 7,
        date: new Date(2023, 5, 2),
        clientId: 2,
        clientName: 'TechStart SAS',
        type: 'charge',
        amount: 45.00,
        status: 'completed',
        paymentMethod: 'Credit Card',
        reference: 'CHG-2023-001',
        description: 'Late delivery fee'
      },
      {
        id: 8,
        date: new Date(2023, 5, 5),
        clientId: 3,
        clientName: 'Gourmet Deliveries',
        type: 'payment',
        amount: 1890.50,
        status: 'completed',
        paymentMethod: 'Bank Transfer',
        reference: 'INV-2023-006'
      }
    ];
  }

  calculateFinancialSummary(): FinancialSummary {
    const completedPayments = this.transactions.filter(t => 
      t.status === 'completed' && t.type === 'payment'
    );
    
    const totalRevenue = completedPayments.reduce((sum, t) => sum + t.amount, 0);
    
    const pendingPayments = this.transactions
      .filter(t => t.status === 'pending' && t.type === 'payment')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const recentTransactions = [...this.transactions]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);
    
    // Generate monthly revenue data
    const monthlyData: { [key: string]: number } = {};
    const now = new Date();
    
    // Initialize last 6 months with 0
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${d.getFullYear()}-${d.getMonth() + 1}`;
      monthlyData[monthKey] = 0;
    }
    
    // Fill in actual data
    completedPayments.forEach(payment => {
      const monthKey = `${payment.date.getFullYear()}-${payment.date.getMonth() + 1}`;
      if (monthlyData[monthKey] !== undefined) {
        monthlyData[monthKey] += payment.amount;
      }
    });
    
    // Convert to array format for chart
    const monthlyRevenue: MonthlyRevenue[] = Object.entries(monthlyData).map(([key, value]) => {
      const [year, month] = key.split('-').map(Number);
      const date = new Date(year, month - 1, 1);
      return {
        month: date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
        revenue: value
      };
    });
    
    return {
      totalRevenue,
      pendingPayments,
      recentTransactions,
      monthlyRevenue
    };
  }

  initRevenueChart(): void {
    const ctx = this.revenueChartCanvas.nativeElement.getContext('2d');
    
    const labels = this.financialSummary.monthlyRevenue.map(item => item.month);
    const data = this.financialSummary.monthlyRevenue.map(item => item.revenue);
    
    const chartConfig: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Revenu mensuel (€)',
          data: data,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return value + ' €';
              }
            }
          }
        }
      }
    };
    
    this.revenueChart = new Chart(ctx, chartConfig);
  }

  applyFilters(): void {
    let filtered = [...this.transactions];
    
    // Apply date filter
    if (this.dateFilter !== 'all') {
      const now = new Date();
      let startDate: Date;
      
      switch (this.dateFilter) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          filtered = filtered.filter(t => t.date >= startDate);
          break;
        case 'week':
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(t => t.date >= startDate);
          break;
        case 'month':
          startDate = new Date(now);
          startDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(t => t.date >= startDate);
          break;
      }
    }
    
    // Apply type filter
    if (this.typeFilter !== 'all') {
      filtered = filtered.filter(t => t.type === this.typeFilter);
    }
    
    // Apply status filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === this.statusFilter);
    }
    
    // Apply search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.clientName.toLowerCase().includes(term) || 
        t.reference.toLowerCase().includes(term)
      );
    }
    
    this.filteredTransactions = filtered;
  }

  resetFilters(): void {
    this.dateFilter = 'all';
    this.typeFilter = 'all';
    this.statusFilter = 'all';
    this.searchTerm = '';
    this.filteredTransactions = [...this.transactions];
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'pending': return 'status-pending';
      case 'failed': return 'status-failed';
      default: return '';
    }
  }

  getTypeClass(type: string): string {
    switch (type) {
      case 'payment': return 'type-payment';
      case 'refund': return 'type-refund';
      case 'charge': return 'type-charge';
      default: return '';
    }
  }
}
