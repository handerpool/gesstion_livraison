// src/app/dashboard/dashboard.component.ts
import { Component, inject, PLATFORM_ID, OnInit } from '@angular/core';
import { RecentDeliveriesComponent } from '../recent-deliveries/recent-deliveries.component';
import { DeliveryStatusChartComponent } from '../delivery-status-chart/delivery-status-chart.component';
import { CustomerSatisfactionChartComponent } from '../customer-satisfaction-chart/customer-satisfaction-chart.component';
import { DeliveryPerformanceChartComponent } from '../delivery-performance-chart/delivery-performance-chart.component';
import { StatsCardsComponent } from '../stats-cards/stats-cards.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopLocationsComponent } from '../top-locations/top-locations.component';
import { CommandeSummary } from '../models/commande.model';
import { Client } from '../models/client.model';
import { AsyncPipe, isPlatformBrowser, NgIf, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Correct import
import { DeliveryService } from '../services/delivery.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RecentDeliveriesComponent,
    StatsCardsComponent,
    DeliveryPerformanceChartComponent,
    DeliveryStatusChartComponent,
    CustomerSatisfactionChartComponent,
    SidebarComponent,
    TopLocationsComponent,
    NgIf,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);

  selectedPeriod: string = 'week';
  selectedTab: string = 'all';
  deliveries: CommandeSummary[] = [];
  topLocations: Client[] = [];

  private deliveryService = inject(DeliveryService);

  ngOnInit(): void {
    this.fetchRecentDeliveries();
    this.fetchTopLocations();
  }

  fetchRecentDeliveries(): void {
    this.deliveryService.getRecentDeliveries(0, 10).subscribe({
      next: (data: CommandeSummary[]) => {
        this.deliveries = data || [];
        console.log('Livraisons chargées:', this.deliveries);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des livraisons récentes:', err);
        this.deliveries = []; // Clear deliveries on error
      },
    });
  }

  fetchTopLocations(): void {
    this.deliveryService.getTopClients(0, 10).subscribe({
      next: (data: Client[]) => {
        this.topLocations = data || [];
        console.log('Top locations chargées:', this.topLocations);
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