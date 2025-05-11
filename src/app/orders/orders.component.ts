import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { DeliveryService } from '../services/delivery.service';
import { FormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { Commande, CommandeResponse, Produit } from '../models/commande.model';
import { Client, RoleUser } from '../models/client.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, DatePipe, SidebarComponent, FormsModule, QRCodeModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
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
  
  // New order form properties
  isNewOrderModalOpen: boolean = false;
  isQrCodeModalOpen: boolean = false;
  qrCodeData: string = '';
  
  newOrder: any = {
    client: { nom: '', prenom: '', email: '', tlf: '' },
    produit: { nomProd: '' },
    adresse: '',
    codePostale: '',
    statut: 'en_attente',
    dateCmd: new Date().toISOString(),
    quantity: 1,
    prixUnitaire: 0,
    prixTotale: 0,
  };
  
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  
  statusOptions = [
    { value: 'all', label: 'كل الحالات' },
    { value: 'en_attente', label: 'في الانتظار' },
    { value: 'livré', label: 'تم التوصيل' },
    { value: 'annulé', label: 'ملغى' },
  ];
  
  sortOptions = [
    { value: 'dateCmd', label: 'التاريخ' },
    { value: 'idCmd', label: 'رقم الطلب' },
    { value: 'client', label: 'العميل' },
    { value: 'prixTotale', label: 'المبلغ' },
  ];

  constructor(private deliveryService: DeliveryService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.deliveryService.getCommandes(
      this.currentPage - 1,
      this.itemsPerPage,
      this.selectedStatus,
      this.searchTerm,
      '', // date parameter
      'all' // agent parameter
    ).subscribe({
      next: (response: CommandeResponse) => {
        console.log('استجابة API:', JSON.stringify(response, null, 2));
        this.orders = response.commandes || [];
        this.filteredOrders = [...this.orders];
        this.totalItems = response.totalItems || this.orders.length;
        this.totalPages = response.totalPages || Math.ceil(this.totalItems / this.itemsPerPage);
        this.currentPage = response.currentPage || 1;
        this.applyFilters();
      },
      error: (err) => {
        console.error('خطأ في جلب الطلبات:', err);
        this.filteredOrders = [];
        this.totalItems = 0;
        this.totalPages = 0;
        alert('خطأ أثناء تحميل الطلبات. الرجاء المحاولة مرة أخرى.');
      },
    });
  }

  onStatusChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedStatus = target.value;
    this.currentPage = 1;
    this.applyFilters();
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.currentPage = 1;
    this.applyFilters();
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
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.orders];

    // Filter by status
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(order => order.statut === this.selectedStatus);
    }

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        `${order.client?.nom ?? ''} ${order.client?.prenom ?? ''}`.toLowerCase().includes(term) ||
        order.client?.email?.toLowerCase().includes(term) ||
        order.idCmd.toString().includes(term)
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (this.sortBy) {
        case 'idCmd':
          comparison = a.idCmd - b.idCmd;
          break;
        case 'client':
          comparison = `${a.client?.nom ?? ''} ${a.client?.prenom ?? ''}`.localeCompare(
            `${b.client?.nom ?? ''} ${b.client?.prenom ?? ''}`
          );
          break;
        case 'dateCmd':
          comparison = new Date(a.dateCmd).getTime() - new Date(b.dateCmd).getTime(); // Handle dateCmd as string
          break;
        case 'prixTotale':
          comparison = (a.prixTotale ?? 0) - (b.prixTotale ?? 0);
          break;
      }
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });

    // Pagination
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.filteredOrders = filtered.slice(start, end);
    this.totalItems = filtered.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  }

  viewOrderDetails(order: Commande): void {
    if (order && order.client && order.produit) {
      this.selectedOrder = order;
      this.isDetailModalOpen = true;
      this.generateQrCode(order);
    }
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
        return 'في الانتظار';
      case 'livré':
        return 'تم التوصيل';
      case 'annulé':
        return 'ملغى';
      default:
        return 'غير معروف';
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
      return 'عرض من 0 إلى 0 من 0 طلبات';
    }
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
    return `عرض من ${start} إلى ${end} من ${this.totalItems} طلبات`;
  }
  
  // New order methods
  openNewOrderModal(): void {
    this.resetNewOrderForm();
    this.isNewOrderModalOpen = true;
  }
  
  closeNewOrderModal(): void {
    this.isNewOrderModalOpen = false;
  }
  
  resetNewOrderForm(): void {
    this.newOrder = {
      client: { nom: '', prenom: '', email: '', tlf: '' },
      produit: { nomProd: '' },
      adresse: '',
      codePostale: '',
      statut: 'en_attente',
      dateCmd: new Date().toISOString(),
      quantity: 1,
      prixUnitaire: 0,
      prixTotale: 0,
    };
  }
  
  calculateTotal(): string {
    const total = (this.newOrder.quantity || 1) * (this.newOrder.prixUnitaire || 0);
    return total.toFixed(2) + ' د.ت';
  }
  
  submitNewOrder(): void {
    const orderData: Commande = {
      idCmd: 0, // سيتم تجاهله بواسطة الخادم
      client: {
        idUser: 0, // يفترض أن الخادم ينشئ العميل أو يربطه
        nom: this.newOrder.client!.nom,
        prenom: this.newOrder.client!.prenom,
        email: this.newOrder.client!.email,
        tlf: this.newOrder.client!.tlf,
        statut: RoleUser.client,
      } as Client,
      adresse: this.newOrder.adresse!,
      codePostale: this.newOrder.codePostale!,
      statut: this.newOrder.statut!,
      dateCmd: this.newOrder.dateCmd!,
      estpayee: this.newOrder.estpayee!,
      produit: {
        idProd: 0, // يفترض أن الخادم ينشئ المنتج أو يربطه
        nomProd: this.newOrder.produit!.nomProd,
        prix: this.newOrder.prixUnitaire!,
      } as Produit,
      quantity: this.newOrder.quantity!,
      prixht: this.newOrder.prixUnitaire!,
      prixUnitaire: this.newOrder.prixUnitaire!,
      prixTotale: (this.newOrder.quantity! * this.newOrder.prixUnitaire!) || 0,
      tlf: this.newOrder.client!.tlf,
      qrCode: undefined,
      dashboardL: undefined,
    };

    this.deliveryService.createOrder(orderData).subscribe({
      next: (response: Commande) => {
        this.closeNewOrderModal();
        this.generateQrCode(response);
        this.isQrCodeModalOpen = true;
        this.loadOrders();
      },
      error: (err) => {
        console.error('خطأ في إنشاء الطلب:', err);
        alert('خطأ أثناء إنشاء الطلب.');
      },
    });
  }
  
  generateQrCode(order: Commande): void {
    this.qrCodeData = JSON.stringify({
      idCmd: order.idCmd,
      clientName: `${order.client?.nom ?? ''} ${order.client?.prenom ?? ''}`,
      prixTotale: order.prixTotale ?? 0,
      dateCmd: order.dateCmd,
      statut: order.statut
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
          <title>رمز QR - الطلب</title>
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