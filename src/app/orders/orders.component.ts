import { Component, NgModule, OnInit } from '@angular/core';
import { Order } from '../models/order.model';
import { CommonModule, DatePipe} from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule,DatePipe,SidebarComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  Math = Math;
  parseFloat = parseFloat;
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedStatus: string = 'all';
  searchTerm: string = '';
  sortBy: string = 'date';
  sortDirection: 'asc' | 'desc' = 'desc';
  selectedOrder: Order | null = null;
  isDetailModalOpen: boolean = false;
  
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  
  statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'PENDING', label: 'En attente' },
    { value: 'PROCESSING', label: 'En traitement' },
    { value: 'SHIPPED', label: 'Expédié' },
    { value: 'DELIVERED', label: 'Livré' },
    { value: 'CANCELLED', label: 'Annulé' }
  ];
  
  sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'id', label: 'Numéro de commande' },
    { value: 'customer.name', label: 'Client' },
    { value: 'total', label: 'Montant' }
  ];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

 loadOrders(): void {
    this.orderService.getOrders(
      this.currentPage - 1,
      this.itemsPerPage,
      this.selectedStatus,
      this.searchTerm,
      this.sortBy,
      this.sortDirection
    ).subscribe({
      next: (response) => {
        console.log('API Response:', JSON.stringify(response, null, 2));
        this.orders = response.orders || [];
        this.filteredOrders = response.orders|| [];
        this.totalItems = response.totalItems || 0;
        this.totalPages = response.totalPages || 1;
        this.currentPage = response.currentPage || 1;
      },
      error: (err) => {
        console.error('Error fetching orders:', {
          status: err.status,
          statusText: err.statusText,
          message: err.message,
          error: err.error
        });
        this.filteredOrders = [];
        this.totalItems = 0;
        this.totalPages = 0;
        alert('Erreur lors du chargement des commandes. Veuillez réessayer.');
      }
    });
  }


  onStatusChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedStatus = target.value;
    this.currentPage = 1;
    this.loadOrders();
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.currentPage = 1;
    this.loadOrders();
  }

  onSortChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.sortBy = target.value;
    this.loadOrders();
  }

  toggleSortDirection(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.loadOrders();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadOrders();
  }

  viewOrderDetails(order: Order): void {
    this.selectedOrder = order;
    this.isDetailModalOpen = true;
  }

  closeDetailModal(): void {
    this.isDetailModalOpen = false;
    this.selectedOrder = null;
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'PENDING': return 'status-pending';
      case 'PROCESSING': return 'status-processing';
      case 'SHIPPED': return 'status-shipped';
      case 'DELIVERED': return 'status-delivered';
      case 'CANCELLED': return 'status-cancelled';
      default: return '';
    }
  }

  getStatusLabel(status: string): string {
    switch (status.toLowerCase()) {
      case 'PENDING': return 'En attente';
      case 'PROCESSING': return 'En traitement';
      case 'SHIPPED': return 'Expédié';
      case 'DELIVERED': return 'Livré';
      case 'CANCELLED': return 'Annulé';
      default: return '';
    }
  }

  getTotalPages(): number {
    return this.totalPages||1;
  }

  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const pages: number[] = [];

    let startPage = Math.max(1, this.currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  getDisplayRange(): string {
    if (this.totalItems === 0) {
      return 'Affichage de 0 à 0 sur 0 commandes';
    }
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
    return `Affichage de ${start} à ${end} sur ${this.totalItems} commandes`;
  }
}
