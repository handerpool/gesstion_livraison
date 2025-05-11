import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { DeliveryService } from '../services/delivery.service';
import { FormsModule } from '@angular/forms';
import { Commande, CommandeResponse } from '../models/commande.model';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardL } from '../models/client.model';

@Component({
  selector: 'app-deliveries',
  standalone: true,
  imports: [CommonModule, SidebarComponent, FormsModule, NgbPaginationModule],
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.css'],
})
export class DeliveriesComponent implements OnInit {
  Math = Math;
  commandes: Commande[] = [];
  filteredDeliveries: Commande[] = [];
  selectedDelivery: Commande | null = null;
  isDetailModalOpen: boolean = false;
  isMapModalOpen: boolean = false;
  mapInitialized: boolean = false;

  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;

  selectedStatus: string = 'all';
  searchTerm: string = '';
  selectedDate: string = '';
  selectedAgent: string = 'all';

  viewMode: 'list' | 'map' = 'list';

  statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'en_attente', label: 'En attente' },
    { value: 'livré', label: 'Livré' },
    { value: 'annulé', label: 'Annulé' },
  ];

  deliveryAgents: { id: string; name: string }[] = [];

  private isBrowser: boolean;

  constructor(
    private deliveryService: DeliveryService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.loadDeliveryAgents();
    this.loadCommandes();
  }

  loadCommandes(): void {
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
        next: (response: CommandeResponse) => {
          this.commandes = response.commandes;
          this.filteredDeliveries = response.commandes;
          this.totalItems = response.totalItems;
          this.totalPages = response.totalPages;
        },
        error: (err) => console.error('Error loading commandes:', err),
      });
  }

  loadDeliveryAgents(): void {
    this.deliveryService.getDeliveryAgents().subscribe({
      next: (agents) => {
        this.deliveryAgents = [{ id: 'all', name: 'Tous les livreurs' }, ...agents];
      },
      error: (err) => console.error('Error loading delivery agents:', err),
    });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadCommandes();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadCommandes();
  }

  viewDeliveryDetails(delivery: Commande): void {
    if (delivery && delivery.client) {
      this.selectedDelivery = delivery;
      this.isDetailModalOpen = true;
    }
  }

  closeDetailModal(): void {
    this.isDetailModalOpen = false;
    this.selectedDelivery = null;
  }

  openMapModal(delivery: Commande): void {
    this.selectedDelivery = delivery;
    this.isMapModalOpen = true;
  }

  closeMapModal(): void {
    this.isMapModalOpen = false;
  }

  getStatusClass(status: string): string {
    return {
      en_attente: 'status-pending',
      livré: 'status-delivered',
      annulé: 'status-cancelled',
    }[status] || '';
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'en_attente':
        return 'En attente';
      case 'livré':
        return 'Livré';
      case 'annulé':
        return 'Annulé';
      default:
        return status;
    }
  }

  getTotalPages(): number {
    return this.totalPages;
  }

  getPageNumbers(): number[] {
    const totalPages = this.totalPages;
    let startPage = Math.max(1, this.currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    return Array.from({length: endPage - startPage + 1}, (_, i) => startPage + i);
  }

  trackById(index: number, item: Commande): number {
    return item.idCmd;
  }

  ngAfterViewInit() {
    if (this.viewMode === 'map' && this.isBrowser) {
      setTimeout(() => this.initMap(), 0);
    }
  }

  private initMap(): void {
    if (!this.isBrowser) {
      return;
    }
    
    import('leaflet').then(L => {
      const mapElement = document.getElementById('map');
      if (mapElement) {
        const map = L.map('map').setView([51.505, -0.09], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        this.mapInitialized = true;
      }
    });
  }

  changeView(mode: 'list' | 'map'): void {
    this.viewMode = mode;
    if (mode === 'map' && this.isBrowser) {
      setTimeout(() => this.initMap(), 0);
    }
  }
}