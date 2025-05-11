import { NgClass, NgFor, CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Commande } from '../models/commande.model';

@Component({
  selector: 'app-recent-deliveries',
  standalone: true,
  imports: [NgClass, NgFor, CommonModule],
  templateUrl: './recent-deliveries.component.html',
  styleUrls: ['./recent-deliveries.component.css']
})
export class RecentDeliveriesComponent implements OnInit {
  @Input() deliveries: Commande[] = [];
  @Input() selectedTab: string = 'all';
  @Output() tabChange = new EventEmitter<string>();

  tabs = [
    { value: 'all', label: 'الكل' },
    { value: 'livré', label: 'تم التوصيل' },
    { value: 'en_attente', label: 'في الانتظار' },
    { value: 'annulé', label: 'ملغى' },
  ];

  ngOnInit(): void {
    // Add debugging logs
    console.log('البيانات المستلمة:', this.deliveries);
    this.deliveries.forEach(delivery => 
      console.log('Commande ID:', delivery.idCmd, 'Client:', delivery.client)
    );
    
  }

  onTabChange(tab: string): void {
    this.selectedTab = tab;
    this.tabChange.emit(tab);
  }

  get filteredDeliveries(): Commande[] {
    if (this.selectedTab === 'all') {
      return this.deliveries;
    }
    return this.deliveries.filter(delivery => delivery.statut === this.selectedTab);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'livré':
        return 'status-delivered';
      case 'en_attente':
        return 'status-pending';
      case 'annulé':  // Make sure this case exists
        return 'status-cancelled';
      default:
        console.warn('Unknown status:', status);
        return '';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'livré':
      case 'livre':
        return 'تم التوصيل';
      case 'en_attente':
        return 'في الانتظار';
      case 'annulé':
        return 'ملغى';
      default:
        console.warn('Unknown status:', status);
        return 'غير محدد';
    }
  }

  getCustomerName(delivery: Commande): string {
    // Add extra logging to debug client data
    if (!delivery.client) {
      console.log('Client missing for delivery:', delivery.idCmd);
      return 'غير متوفر';
    }
    
    if (delivery.client && delivery.client.nom && delivery.client.prenom) {
      return `${delivery.client.nom} ${delivery.client.prenom}`;
    }
    
    console.log('Incomplete client data for delivery:', delivery.idCmd, 'Client:', delivery.client);
    return 'غير متوفر';
  }
}