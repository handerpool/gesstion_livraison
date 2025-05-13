// src/app/recent-deliveries/recent-deliveries.component.ts
import { NgClass, NgFor, CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommandeSummary } from '../models/commande.model';

@Component({
  selector: 'app-recent-deliveries',
  standalone: true,
  imports: [NgClass, NgFor, CommonModule, DatePipe],
  templateUrl: './recent-deliveries.component.html',
  styleUrls: ['./recent-deliveries.component.css'],
})
export class RecentDeliveriesComponent implements OnInit {
  @Input() deliveries: CommandeSummary[] = [];
  @Input() selectedTab: string = 'all';
  @Output() tabChange = new EventEmitter<string>();

  tabs = [
    { value: 'all', label: 'Tous' },
    { value: 'livré', label: 'Livré' },
    { value: 'en_attente', label: 'En attente' },
    { value: 'annulé', label: 'Annulé' },
  ];

  ngOnInit(): void {
    console.log('Données reçues:', this.deliveries);
    this.deliveries.forEach((delivery) =>
      console.log('Commande ID:', delivery.idCmd, 'Client:', delivery.clientNom)
    );
  }

  onTabChange(tab: string): void {
    this.selectedTab = tab;
    this.tabChange.emit(tab);
  }

  get filteredDeliveries(): CommandeSummary[] {
    if (this.selectedTab === 'all') {
      return this.deliveries;
    }
    return this.deliveries.filter((delivery) => delivery.statut === this.selectedTab);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'livré':
      case 'livre':
        return 'status-delivered';
      case 'en_attente':
        return 'status-pending';
      case 'annulé':
        return 'status-cancelled';
      default:
        console.warn('Statut inconnu:', status);
        return '';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'livré':
      case 'livre':
        return 'Livré';
      case 'en_attente':
        return 'En attente';
      case 'annulé':
        return 'Annulé';
      default:
        console.warn('Statut inconnu:', status);
        return 'Non défini';
    }
  }

  getCustomerName(delivery: CommandeSummary): string {
    return delivery.clientNom || 'Non disponible';
  }
}