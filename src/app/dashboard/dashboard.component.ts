import { Component, inject, PLATFORM_ID,OnInit } from '@angular/core';
import { RecentDeliveriesComponent } from "../recent-deliveries/recent-deliveries.component";
import { DeliveryStatusChartComponent } from "../delivery-status-chart/delivery-status-chart.component";
import { CustomerSatisfactionChartComponent } from "../customer-satisfaction-chart/customer-satisfaction-chart.component";
import { DeliveryPerformanceChartComponent } from "../delivery-performance-chart/delivery-performance-chart.component";
import { StatsCardsComponent } from "../stats-cards/stats-cards.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { TopLocationsComponent } from "../top-locations/top-locations.component";
import { Delivery } from '../models/delivery.model';
import { Location } from '../models/delivery.model';
import { AsyncPipe, isPlatformBrowser, NgIf } from '@angular/common';
import { DeliveryService } from '../services/delivery.service';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RecentDeliveriesComponent, StatsCardsComponent,DeliveryPerformanceChartComponent,DeliveryPerformanceChartComponent,DeliveryStatusChartComponent, CustomerSatisfactionChartComponent, SidebarComponent, TopLocationsComponent,NgIf],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  private platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId); // Check if we're in a browser environment

  // Lazy load chart components only in browser
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

  recentDeliveries: Delivery[] = [
  ];

  // Top delivery locations
  topLocations: Location[] = [
  ];

  onPeriodChange(period: string): void {
    this.selectedPeriod = period;
  }

  onTabChange(tab: string): void {
    this.selectedTab = tab;
  }
}

