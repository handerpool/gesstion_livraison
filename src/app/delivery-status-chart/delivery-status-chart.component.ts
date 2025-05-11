import { isPlatformBrowser, NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { DeliveryService } from '../services/delivery.service';
import { DeliveryStats } from '../models/commande.model';

@Component({
  selector: 'app-delivery-status-chart',
  standalone: true,
  imports: [NgFor, NgChartsModule,NgIf],
  templateUrl: './delivery-status-chart.component.html',
  styleUrl: './delivery-status-chart.component.css'
})
export class DeliveryStatusChartComponent implements OnInit {
  private deliveryService = inject(DeliveryService);
  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  errorMessage: string | null = null;
  
  public doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  public doughnutChartData: ChartData<'doughnut'> = {
    labels: ['Livrées', 'En cours', 'En attente', 'Annulées'],
    datasets: [
      {
        data: [0, 0, 0, 0],
        backgroundColor: ['#2A9D8F', '#E9C46A', '#E76F51', '#ef4444'],
        borderWidth: 0,
      },
    ],
  };

  statusItems = [
    { label: 'Livrées', value: '0%', color: '#2A9D8F' },
    { label: 'En cours', value: '0%', color: '#E9C46A' },
    { label: 'En attente', value: '0%', color: '#E76F51' },
    { label: 'Annulées', value: '0%', color: '#ef4444' }
  ];

  ngOnInit(): void {
    if (this.isBrowser) {
      this.fetchDeliveryStats();
    }
  }

  fetchDeliveryStats(): void {
    this.deliveryService.getDeliveryStats().subscribe({
      next: (data: DeliveryStats) => {
        console.log('Received stats:', data); // Log data for verification
        this.errorMessage = null;
        const statusMap: { [key: string]: number } = {
          'livré': 0,    // Matches backend response
          'en_cours': 1, // Matches backend response
          'en_attente': 2, // Matches backend response
          'annulé': 3,   // Add this mapping for cancelled status
        };

        const newData = [0, 0, 0, 0]; // Initialize with zeros (now 4 elements)
        const newStatusItems = [...this.statusItems];

        for (const [status, stats] of Object.entries(data)) {
          const index = statusMap[status];
          if (index !== undefined) {
            newData[index] = stats.percentage;
            newStatusItems[index].value = `${stats.percentage}%`;
          } else {
            console.warn(`Unknown status: ${status}`);
          }
        }

        this.doughnutChartData = {
          ...this.doughnutChartData,
          datasets: [{ ...this.doughnutChartData.datasets[0], data: newData }],
        };
        this.statusItems = newStatusItems;
      },
      error: (err) => {
        this.errorMessage = 'فشل في جلب إحصائيات التوصيل. حاول مرة أخرى لاحقًا.';
        console.error('Error fetching stats:', err);
      },
    });
  }
}
