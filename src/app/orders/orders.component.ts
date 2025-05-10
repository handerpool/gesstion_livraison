import { Component, NgModule, OnInit } from '@angular/core';
import { Order } from '../models/order.model';
import { CommonModule, DatePipe } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { OrderService } from '../services/order.service';
import { FormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, DatePipe, SidebarComponent, FormsModule, QRCodeModule],
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
  
  // New order form properties
  isNewOrderModalOpen: boolean = false;
  isQrCodeModalOpen: boolean = false;
  qrCodeData: string = '';
  
  newOrder: any = {
    customer: {
      name: '',
      email: '',
      phone: ''
    },
    address: '',
    items: [{ name: '', quantity: 1, price: '0 DTN' }],
    date: new Date().toISOString(),
    status: 'PENDING',
    paymentMethod: 'Carte bancaire'
  };
  
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
    
    // Generate QR code for the selected order
    this.generateQrCode(order);
  }

  closeDetailModal(): void {
    this.isDetailModalOpen = false;
    this.selectedOrder = null;
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending': return 'status-pending';
      case 'processing': return 'status-processing';
      case 'shipped': return 'status-shipped';
      case 'delivered': return 'status-delivered';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  }

  getStatusLabel(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending': return 'En attente';
      case 'processing': return 'En traitement';
      case 'shipped': return 'Expédié';
      case 'delivered': return 'Livré';
      case 'cancelled': return 'Annulé';
      default: return '';
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
  
  // New methods for handling new orders and QR codes
  
  openNewOrderModal(): void {
    this.resetNewOrderForm();
    this.isNewOrderModalOpen = true;
  }
  
  closeNewOrderModal(): void {
    this.isNewOrderModalOpen = false;
  }
  
  resetNewOrderForm(): void {
    this.newOrder = {
      customer: {
        name: '',
        email: '',
        phone: ''
      },
      address: '',
      items: [{ name: '', quantity: 1, price: '0 DTN' }],
      date: new Date().toISOString(),
      status: 'PENDING',
      paymentMethod: 'Carte bancaire'
    };
  }
  
  addItem(): void {
    this.newOrder.items.push({ name: '', quantity: 1, price: '0 DTN' });
  }
  
  removeItem(index: number): void {
    if (this.newOrder.items.length > 1) {
      this.newOrder.items.splice(index, 1);
    }
  }
  
  calculateTotal(): string {
    const total = this.newOrder.items.reduce((sum: number, item: any) => {
      const price = parseFloat(item.price.replace('DTN', '').replace(',', '.'));
      return sum + (item.quantity * price);
    }, 0);
    
    return total.toFixed(2) + ' DTN';
  }
  
  submitNewOrder(): void {
    // Calculate total
    const total = this.calculateTotal();
    
    // Prepare order data
    const orderData = {
      ...this.newOrder,
      total,
      id: 'ORD-' + Math.floor(Math.random() * 10000) // Generate a random ID for demo
    };
    
    this.orderService.createOrder(orderData).subscribe({
      next: (response) => {
        console.log('Order created:', response);
        this.closeNewOrderModal();
        
        // Generate QR code for the new order
        this.generateQrCode(response);
        this.isQrCodeModalOpen = true;
        
        // Refresh the order list
        this.loadOrders();
      },
      error: (err) => {
        console.error('Error creating order:', err);
        alert('Erreur lors de la création de la commande. Veuillez réessayer.');
      }
    });
  }
  
  generateQrCode(order: Order): void {
    // In a real app, you would call your backend API to generate the QR code
    // Use your existing backend functionality here
    
    // For now, we'll simulate it by creating a JSON string of order data
    this.qrCodeData = JSON.stringify({
      id: order.id,
      customerName: order.customer?.name,
      total: order.total,
      date: order.date,
      status: order.status
    });
    
    // In a real implementation, you would call your backend:
    // this.orderService.generateQrCode(order.id).subscribe(data => {
    //   this.qrCodeData = data.qrCodeUrl; // or however your backend returns the QR code
    // });
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
          <title>QR Code - Commande</title>
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
}