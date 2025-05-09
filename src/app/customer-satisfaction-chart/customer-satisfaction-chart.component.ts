import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
@Component({
  selector: 'app-customer-satisfaction-chart',
  standalone: true,
  imports: [NgChartsModule],
  templateUrl: './customer-satisfaction-chart.component.html',
  styleUrl: './customer-satisfaction-chart.component.css'
})
export class CustomerSatisfactionChartComponent {
  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        min: 1,
        max: 5,
        grid: {
          color: '#ddd',
        },
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  public lineChartData: ChartData<'line'> = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil'],
    datasets: [
      {
        label: 'Satisfaction client',
        data: [4.2, 4.3, 4.1, 4.4, 4.6, 4.5, 4.7],
        borderColor: '#2A9D8F',
        backgroundColor: 'rgba(42, 157, 143, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

}
