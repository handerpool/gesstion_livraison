import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { DeliveryService } from '../services/delivery.service';
import { Transaction } from '../models/transaction.model';
import { FinancialSummary, MonthlyRevenue } from '../models/financial-summary.model';


@Component({
    selector: 'app-finance',
    standalone: true,
    imports: [CommonModule, FormsModule, SidebarComponent],
    templateUrl: './finance.component.html',
    styleUrls: ['./finance.component.css']
})
export class FinanceComponent implements OnInit {
    @ViewChild('revenueChart') revenueChartCanvas!: ElementRef;

    transactions: Transaction[] = [];
    filteredTransactions: Transaction[] = [];
    financialSummary: FinancialSummary = {
        totalRevenue: 0,
        pendingPayments: 0,
        transactionCount: 0,
        monthlyRevenue: [],
        recentTransactions: []
    };

    dateFilter: string = 'all';
    typeFilter: string = 'all';
    statusFilter: string = 'all';
    searchTerm: string = '';

    revenueChart!: Chart;

    constructor(private deliveryService: DeliveryService) {}

    ngOnInit(): void {
        this.loadFinancialData();
    }

    ngAfterViewInit(): void {
        this.initRevenueChart();
    }

    loadFinancialData(): void {
        this.deliveryService.getFinancialSummary().subscribe({
            next: (summary) => {
                this.financialSummary = summary;
                this.transactions = summary.recentTransactions;
                this.filteredTransactions = [...this.transactions];
                this.initRevenueChart();
            },
            error: (err) => console.error('Erreur lors de la récupération des données financières :', err)
        });
    }

    initRevenueChart(): void {
        if (!this.revenueChartCanvas) return;
        const ctx = this.revenueChartCanvas.nativeElement.getContext('2d');
        const labels = this.financialSummary.monthlyRevenue.map((item: MonthlyRevenue) => item.month);
        const data = this.financialSummary.monthlyRevenue.map((item: MonthlyRevenue) => item.revenue);


        if (this.revenueChart) {
            this.revenueChart.destroy();
        }

        const chartConfig: ChartConfiguration = {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Revenus mensuels (DT)',
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
                                return value + ' DT';
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

        if (this.dateFilter !== 'all') {
            const now = new Date();
            let startDate: Date;

            switch (this.dateFilter) {
                case 'today':
                    startDate = new Date(now.setHours(0, 0, 0, 0));
                    filtered = filtered.filter(t => new Date(t.date) >= startDate);
                    break;
                case 'week':
                    startDate = new Date(now);
                    startDate.setDate(now.getDate() - 7);
                    filtered = filtered.filter(t => new Date(t.date) >= startDate);
                    break;
                case 'month':
                    startDate = new Date(now);
                    startDate.setMonth(now.getMonth() - 1);
                    filtered = filtered.filter(t => new Date(t.date) >= startDate);
                    break;
            }
        }

        if (this.typeFilter !== 'all') {
            filtered = filtered.filter(t => t.type === this.typeFilter);
        }

        if (this.statusFilter !== 'all') {
            filtered = filtered.filter(t => t.status === this.statusFilter);
        }

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
        return new Intl.NumberFormat('ar-TN', { style: 'currency', currency: 'TND' }).format(amount);
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'livré': return 'status-completed';
            case 'en_attente': return 'status-pending';
            case 'annulé': return 'status-failed';
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