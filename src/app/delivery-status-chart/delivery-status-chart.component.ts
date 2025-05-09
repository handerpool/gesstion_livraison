import { isPlatformBrowser, NgFor } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-delivery-status-chart',
  standalone: true,
  imports: [NgFor,NgChartsModule],
  templateUrl: './delivery-status-chart.component.html',
  styleUrl: './delivery-status-chart.component.css'
})
export class DeliveryStatusChartComponent {
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
        data: [68, 24, 8],
        backgroundColor: ['#2A9D8F', '#E9C46A', '#E76F51'],
        borderWidth: 0,
      },
    ],
  };

  statusItems = [
    { label: 'Livrées', value: '68%', color: '#2A9D8F' },
    { label: 'En cours', value: '24%', color: '#E9C46A' },
    { label: 'En attente', value: '8%', color: '#E76F51' }
  ];
}
