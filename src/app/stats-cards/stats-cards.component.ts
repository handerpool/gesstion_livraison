import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { DeliveryService } from '../services/delivery.service';
import { StatsCard } from '../models/commande.model';

@Component({
    selector: 'app-stats-cards',
    standalone: true,
    imports: [CommonModule, NgClass], // استيراد CommonModule وNgClass
    templateUrl: './stats-cards.component.html',
    styleUrls: ['./stats-cards.component.css']
})
export class StatsCardsComponent implements OnInit {
    cards: StatsCard[] = [];

    constructor(private deliveryService: DeliveryService) {}

    ngOnInit(): void {
        this.loadStatsCards();
    }

    loadStatsCards(): void {
        this.deliveryService.getStatsCards().subscribe({
            next: (cards) => {
                this.cards = cards;
                console.log('Cartes chargées:', this.cards);
            },
            error: (error) => {
                console.error('Erreur lors du chargement des cartes:', error);
            }
        });
    }
}