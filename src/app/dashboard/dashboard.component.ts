import { Component, inject, PLATFORM_ID, OnInit } from '@angular/core';
import { RecentDeliveriesComponent } from "../recent-deliveries/recent-deliveries.component";
import { DeliveryStatusChartComponent } from "../delivery-status-chart/delivery-status-chart.component";
import { CustomerSatisfactionChartComponent } from "../customer-satisfaction-chart/customer-satisfaction-chart.component";
import { DeliveryPerformanceChartComponent } from "../delivery-performance-chart/delivery-performance-chart.component";
import { StatsCardsComponent } from "../stats-cards/stats-cards.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { TopLocationsComponent } from "../top-locations/top-locations.component";
import { Commande } from '../models/commande.model';
import { Client } from '../models/client.model';
import { AsyncPipe, isPlatformBrowser, NgIf } from '@angular/common';
import { DeliveryService } from '../services/delivery.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RecentDeliveriesComponent, StatsCardsComponent, DeliveryPerformanceChartComponent, DeliveryPerformanceChartComponent, DeliveryStatusChartComponent, CustomerSatisfactionChartComponent, SidebarComponent, TopLocationsComponent, NgIf],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);

  deliveryStatusChart = this.isBrowser
    ? import('../delivery-status-chart/delivery-status-chart.component').then(m => m.DeliveryStatusChartComponent)
    : Promise.resolve(null);

  customerSatisfactionChart = this.isBrowser
    ? import('../customer-satisfaction-chart/customer-satisfaction-chart.component').then(m => m.CustomerSatisfactionChartComponent)
    : Promise.resolve(null);

  deliveryPerformanceChart = this.isBrowser
    ? import('../delivery-performance-chart/delivery-performance-chart.component').then(m => m.DeliveryPerformanceChartComponent)
    : Promise.resolve(null);
  selectedPeriod: string = 'week';
  selectedTab: string = 'all';

  recentDeliveries: Commande[] = [];
  topLocations: Client[] = [];

  private deliveryService = inject(DeliveryService);

  ngOnInit(): void {
    this.fetchRecentDeliveries();
    this.fetchTopLocations();
  }

  fetchRecentDeliveries(): void {
    this.deliveryService.getRecentDeliveries(0, 10).subscribe({
      next: (data: Commande[]) => {
        this.recentDeliveries = data;
      },
      error: (err) => console.error('Error loading recent deliveries:', err),
    });
  }

  fetchTopLocations(): void {
    this.deliveryService.getTopClients(0, 10).subscribe({
      next: (data: Client[]) => {
        this.topLocations = data;
      },
      error: (err) => console.error('Error loading top clients:', err),
    });
  }

  onPeriodChange(period: string): void {
    this.selectedPeriod = period;
  }

  onTabChange(tab: string): void {
    this.selectedTab = tab;
  }
}

