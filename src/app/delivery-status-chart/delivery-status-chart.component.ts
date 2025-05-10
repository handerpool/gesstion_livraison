import { isPlatformBrowser, NgFor } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { DeliveryService } from '../services/delivery.service';
import { DeliveryStats } from '../models/delivery.model';

@Component({
  selector: 'app-delivery-status-chart',
  standalone: true,
  imports: [NgFor,NgChartsModule],
  templateUrl: './delivery-status-chart.component.html',
  styleUrl: './delivery-status-chart.component.css'
})
export class DeliveryStatusChartComponent implements OnInit {
  private deliveryService = inject(DeliveryService);
  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  public doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  public doughnutChartData: ChartData<'doughnut'> = {
    labels: ['Livrées', 'En cours', 'En attente'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ['#2A9D8F', '#E9C46A', '#E76F51'],
        borderWidth: 0,
      },
    ],
  };

  statusItems = [
    { label: 'Livrées', value: '0%', color: '#2A9D8F' },
    { label: 'En cours', value: '0%', color: '#E9C46A' },
    { label: 'En attente', value: '0%', color: '#E76F51' }
  ];

  ngOnInit(): void {
    if (this.isBrowser) {
      this.fetchDeliveryStats();
    }
  }

  fetchDeliveryStats(): void {
    this.deliveryService.getDeliveryStats().subscribe(data => {
      const statusMap = {
        delivered: 0,
        'in-progress': 1,
        pending: 2
      };

      const newData = [0, 0, 0];
      const newStatusItems = [...this.statusItems];

      for (const [status, stats] of Object.entries(data)) {
        const index = statusMap[status as keyof DeliveryStats];
        if (index !== undefined) {
          newData[index] = stats.percentage;
          newStatusItems[index].value = `${stats.percentage}%`;
        }
      }

      this.doughnutChartData = {
        ...this.doughnutChartData,
        datasets: [{ ...this.doughnutChartData.datasets[0], data: newData }]
      };
      this.statusItems = newStatusItems;
    });
  }
}
