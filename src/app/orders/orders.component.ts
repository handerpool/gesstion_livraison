// src/app/orders/orders.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { DeliveryService } from '../services/delivery.service';
import { FormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { Commande, CommandeResponse } from '../models/commande.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, DatePipe, SidebarComponent, FormsModule, QRCodeModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  Math = Math;
  parseFloat = parseFloat;
  orders: Commande[] = [];
  filteredOrders: Commande[] = [];
  selectedStatus: string = 'all';
  searchTerm: string = '';
  sortBy: string = 'dateCmd';
  sortDirection: 'asc' | 'desc' = 'desc';
  selectedOrder: Commande | null = null;
  isDetailModalOpen: boolean = false;
  isNewOrderModalOpen: boolean = false;
  isQrCodeModalOpen: boolean = false;
  qrCodeData: string = '';

  newOrder: Partial<Commande> = {
    clientNom: '',
    produitNom: '',
    adresse: '',
    codePostale: '',
    statut: 'en_attente',
    dateCmd: new Date().toISOString(),
    quantity: 1,
    prixTotale: 0,
  };

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'en_attente', label: 'En attente' },
    { value: 'livré', label: 'Livré' },
    { value: 'annulé', label: 'Annulé' },
  ];

  sortOptions = [
    { value: 'dateCmd', label: 'Date' },
    { value: 'idCmd', label: 'Numéro de commande' },
    { value: 'clientNom', label: 'Client' },
    { value: 'prixTotale', label: 'Montant' },
  ];

  constructor(private deliveryService: DeliveryService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.deliveryService
      .getCommandes(
        this.currentPage - 1,
        this.itemsPerPage,
        this.selectedStatus,
        this.searchTerm,
        '',
        'all'
      )
      .subscribe({
        next: (response: CommandeResponse) => {
          this.orders = response.commandes || [];
          this.totalItems = response.totalItems || this.orders.length;
          this.totalPages = response.totalPages || 1;
          this.currentPage = (response.currentPage || 0) + 1;
          this.applyFilters();
        },
        error: (error) => {
          console.error('Erreur:', error);
          this.orders = [];
          this.totalItems = 0;
          this.totalPages = 0;
        },
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
    this.applyFilters();
  }

  toggleSortDirection(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadOrders();
  }

  applyFilters(): void {
    let filtered = [...this.orders];

    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter((order) => order.statut === this.selectedStatus);
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.clientNom?.toLowerCase().includes(term) ||
          order.idCmd.toString().includes(term)
      );
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (this.sortBy) {
        case 'idCmd':
          comparison = a.idCmd - b.idCmd;
          break;
        case 'clientNom':
          comparison = (a.clientNom || '').localeCompare(b.clientNom || '');
          break;
        case 'dateCmd':
          comparison = new Date(a.dateCmd || '').getTime() - new Date(b.dateCmd || '').getTime();
          break;
        case 'prixTotale':
          comparison = (a.prixTotale || 0) - (b.prixTotale || 0);
          break;
      }
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });

    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.filteredOrders = filtered.slice(start, end);
    this.totalItems = filtered.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  }

  viewOrderDetails(order: Commande): void {
    this.selectedOrder = order;
    this.isDetailModalOpen = true;
    this.generateQrCode(order);
  }

  closeDetailModal(): void {
    this.isDetailModalOpen = false;
    this.selectedOrder = null;
  }

  getStatusClass(statut?: string): string {
    switch (statut) {
      case 'en_attente':
        return 'status-pending';
      case 'livré':
        return 'status-delivered';
      case 'annulé':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  getStatusLabel(statut?: string): string {
    switch (statut) {
      case 'en_attente':
        return 'En attente';
      case 'livré':
        return 'Livré';
      case 'annulé':
        return 'Annulé';
      default:
        return 'Inconnu';
    }
  }

  getTotalPages(): number {
    return this.totalPages || 1;
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

  openNewOrderModal(): void {
    this.resetNewOrderForm();
    this.isNewOrderModalOpen = true;
  }

  closeNewOrderModal(): void {
    this.isNewOrderModalOpen = false;
  }

  resetNewOrderForm(): void {
    this.newOrder = {
      clientNom: '',
      produitNom: '',
      adresse: '',
      codePostale: '',
      statut: 'en_attente',
      dateCmd: new Date().toISOString(),
      quantity: 1,
      prixTotale: 0,
    };
  }

  calculateTotal(): string {
    const total = (this.newOrder.quantity || 1) * (this.newOrder.prixTotale || 0);
    return total.toFixed(2) + ' D.T';
  }

  createNewOrder(): void {
    const orderData: Commande = {
      idCmd: 0,
      clientId: 0,
      clientNom: this.newOrder.clientNom || '',
      produitId: 0,
      produitNom: this.newOrder.produitNom || '',
      adresse: this.newOrder.adresse || '',
      codePostale: this.newOrder.codePostale || '',
      statut: this.newOrder.statut || 'en_attente',
      dateCmd: this.newOrder.dateCmd || new Date().toISOString(),
      estpayee: false,
      quantity: this.newOrder.quantity || 1,
      prixTotale: this.newOrder.prixTotale || 0,
    };

    this.deliveryService.createOrder(orderData).subscribe({
      next: (response: Commande) => {
        this.closeNewOrderModal();
        this.generateQrCode(response);
        this.isQrCodeModalOpen = true;
        this.loadOrders();
      },
      error: (err) => {
        console.error('Erreur lors de la création de la commande:', err);
        alert('Erreur lors de la création de la commande.');
      },
    });
  }

  generateQrCode(order: Commande): void {
    this.qrCodeData = JSON.stringify({
      idCmd: order.idCmd,
      clientName: order.clientNom,
      prixTotale: order.prixTotale,
      dateCmd: order.dateCmd,
      statut: order.statut,
    });
  }

  closeQrCodeModal(): void {
    this.isQrCodeModalOpen = false;
  }

  printQrCode(): void {
    const printContent = document.getElementById('qr-code-print-content');
    if (!printContent) return;

    const windowPrint = window.open('', '', 'width=900,height=650');
    if (!windowPrint) return;

    windowPrint.document.write(`
      <html>
        <head>
          <title>Code QR - Commande</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
            .qr-container { margin: 20px auto; }
            h2 { margin-bottom: 10px; }
            p { margin: 5px 0; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    windowPrint.document.close();
    windowPrint.focus();
    windowPrint.print();
    setTimeout(() => windowPrint.close(), 1000);
  }

  trackById(index: number, order: Commande): number {
    return order.idCmd;
  }
}