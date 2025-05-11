import { isPlatformBrowser, NgFor } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, PLATFORM_ID } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-delivery-performance-chart',
  standalone: true,
  imports: [NgFor,NgChartsModule],
  templateUrl: './delivery-performance-chart.component.html',
  styleUrl: './delivery-performance-chart.component.css'
})
export class DeliveryPerformanceChartComponent {
  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  @Input() selectedPeriod: string = 'week';
  @Output() periodChange = new EventEmitter<string>();

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
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
        max: 32,
        grid: {
          color: '#ddd',
        },
        ticks: {
          precision: 0,
        },
      },
    },
  };

  public barChartData: ChartData<'bar'> = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        label: 'À temps',
        data: [25, 30, 22, 28, 32, 24, 18],
        backgroundColor: '#2A9D8F',
        borderRadius: 4,
        barThickness: 12,
      },
      {
        label: 'En retard',
        data: [5, 3, 4, 2, 6, 3, 2],
        backgroundColor: '#E76F51',
        borderRadius: 4,
        barThickness: 12,
      },
    ],
  };

  periods = [
    { value: 'day', label: 'Aujourd\'hui' },
    { value: 'week', label: 'Cette semaine' },
    { value: 'month', label: 'Ce mois' },
    { value: 'year', label: 'Cette année' }
  ];

  ngOnInit(): void {
    this.updateChartData();
  }

  onPeriodChange(event: any): void {
    this.selectedPeriod = event.target.value;
    this.periodChange.emit(this.selectedPeriod);
    this.updateChartData();
  }

  updateChartData(): void {
    if (this.selectedPeriod === 'day') {
      this.barChartData.labels = ['8h', '10h', '12h', '14h', '16h', '18h', '20h'];
    } else if (this.selectedPeriod === 'week') {
      this.barChartData.labels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    } else if (this.selectedPeriod === 'month') {
      this.barChartData.labels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
    } else if (this.selectedPeriod === 'year') {
      this.barChartData.labels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    }
  }
}
