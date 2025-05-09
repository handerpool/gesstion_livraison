import { NgClass, NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Delivery } from '../models/delivery.model';

@Component({
  selector: 'app-recent-deliveries',
  standalone: true,
  imports: [NgClass,NgFor],
  templateUrl: './recent-deliveries.component.html',
  styleUrl: './recent-deliveries.component.css'
})
export class RecentDeliveriesComponent {
  @Input() deliveries: Delivery[] = [];
  @Input() selectedTab: string = 'all';
  @Output() tabChange = new EventEmitter<string>();

  tabs = [
    { value: 'all', label: 'Toutes' },
    { value: 'delivered', label: 'Livrées' },
    { value: 'in-progress', label: 'En cours' },
    { value: 'pending', label: 'En attente' }
  ];

  onTabChange(tab: string): void {
    this.selectedTab = tab;
    this.tabChange.emit(tab);
  }

  get filteredDeliveries(): Delivery[] {
    if (this.selectedTab === 'all') {
      return this.deliveries;
    }
    return this.deliveries.filter(delivery => delivery.status === this.selectedTab);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'delivered':
        return 'status-delivered';
      case 'in-progress':
        return 'status-in-progress';
      case 'pending':
        return 'status-pending';
      default:
        return '';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'delivered':
        return 'Livrée';
      case 'in-progress':
        return 'En cours';
      case 'pending':
        return 'En attente';
      default:
        return '';
    }
  }
}
