import { NgClass, NgFor } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { StatsCard } from '../models/commande.model';
import { DeliveryService } from '../services/delivery.service';

@Component({
  selector: 'app-stats-cards',
  standalone: true,
  imports: [NgClass, NgFor],
  templateUrl: './stats-cards.component.html',
  styleUrls: ['./stats-cards.component.css']
})
export class StatsCardsComponent implements OnInit {
  @Input() statsCards: StatsCard[] = [];

  constructor(private deliveryService: DeliveryService) {}

  ngOnInit(): void {
    this.fetchStatsCards();
  }

  private fetchStatsCards(): void {
    this.deliveryService.getStatsCards().subscribe({
      next: (data) => {
        this.statsCards = data;
      },
      error: (err) => {
        console.error('Error fetching stats cards:', err);
      }
    });
  }
}
