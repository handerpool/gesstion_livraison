import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliveryService } from '../services/delivery.service';
import { StatsCard } from '../models/commande.model';

@Component({
  selector: 'app-stats-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-cards.component.html',
  styleUrls: ['./stats-cards.component.css']
})
export class StatsCardsComponent implements OnInit {
  // Add the missing property
  statsCards: StatsCard[] = [];
  
  constructor(private deliveryService: DeliveryService) {}
  
  ngOnInit(): void {
    this.loadStatsCards();
  }
  
  loadStatsCards(): void {
    this.deliveryService.getStatsCards().subscribe({
      next: (data: StatsCard[]) => {
        this.statsCards = data;
        console.log('Stats cards loaded:', this.statsCards);
      },
      error: (err) => {
        console.error('Error loading stats cards:', err);
        // Initialize with empty cards in case of error
        this.statsCards = [];
      }
    });
  }
}