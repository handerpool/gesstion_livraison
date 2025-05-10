import { Component, OnInit } from '@angular/core';
import { Deliveries } from '../models/delivery.model';
import { CommonModule, DatePipe } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { DeliveryService } from '../services/delivery.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-deliveries',
  standalone: true,
  imports: [CommonModule, DatePipe, SidebarComponent, FormsModule],
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.css'],
})
export class DeliveriesComponent implements OnInit {
  Math = Math;
  deliveries: Deliveries[] = [];
  filteredDeliveries: Deliveries[] = [];
  selectedDelivery: Deliveries | null = null;
  isDetailModalOpen: boolean = false;
  isMapModalOpen: boolean = false;

  // Filters
  selectedStatus: string = 'all';
  searchTerm: string = '';
  selectedDate: string = '';
  selectedAgent: string = 'all';

  // View mode
  viewMode: 'list' | 'map' = 'list';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalItems: number = 0;
  totalPages: number = 0;

  statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'pending', label: 'En attente' },
    { value: 'in-progress', label: 'En cours' },
    { value: 'delivered', label: 'Livré' },
  ];

  deliveryAgents = [
    { id: 'all', name: 'Tous les livreurs' },
    { id: 'agent-1', name: 'Meriem Ben Salah' },
    { id: 'agent-2', name: 'Khalil Mahjoub' },
    { id: 'agent-3', name: 'Oussama Hammami' },
    { id: 'agent-4', name: 'Salma Trabelsi' },
  ];

  constructor(private deliveryService: DeliveryService) {}

  ngOnInit(): void {
    this.loadDeliveries();
  }

  loadDeliveries(): void {
    this.deliveryService
      .getDeliveries(
        this.currentPage - 1,
        this.itemsPerPage,
        this.selectedStatus,
        this.searchTerm,
        this.selectedDate,
        this.selectedAgent
      )
      .subscribe({
        next: (response) => {
          this.deliveries = response.deliveries;
          this.filteredDeliveries = response.deliveries;
          this.totalItems = response.totalItems;
          this.totalPages = response.totalPages;
          this.currentPage = response.currentPage;
        },
        error: (err) => {
          console.error('Erreur lors du chargement des livraisons:', err);
          this.filteredDeliveries = [];
          this.totalItems = 0;
        },
      });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadDeliveries();
  }

  onStatusChange(event: any): void {
    this.selectedStatus = event.target.value;
    this.applyFilters();
  }

  onSearch(event: any): void {
    this.searchTerm = event.target.value;
    this.applyFilters();
  }

  onDateChange(event: any): void {
    this.selectedDate = event.target.value;
    this.applyFilters();
  }

  onAgentChange(event: any): void {
    this.selectedAgent = event.target.value;
    this.applyFilters();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadDeliveries();
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'list' ? 'map' : 'list';
  }

  viewDeliveryDetails(delivery: Deliveries): void {
    this.selectedDelivery = delivery;
    this.isDetailModalOpen = true;
  }

  closeDetailModal(): void {
    this.isDetailModalOpen = false;
    this.selectedDelivery = null;
  }

  openMapModal(delivery: Deliveries): void {
    this.selectedDelivery = delivery;
    this.isMapModalOpen = true;
  }

  closeMapModal(): void {
    this.isMapModalOpen = false;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'in-progress':
        return 'status-in-transit';
      case 'delivered':
        return 'status-delivered';
      default:
        return '';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'in-progress':
        return 'En cours';
      case 'delivered':
        return 'Livré';
      default:
        return '';
    }
  }

  getDeliveryProgress(delivery: Deliveries): number {
    switch (delivery.status) {
      case 'pending':
        return 10;
      case 'in-progress':
        return 50;
      case 'delivered':
        return 100;
      default:
        return 0;
    }
  }

  getTotalPages(): number {
    return this.totalPages;
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
}