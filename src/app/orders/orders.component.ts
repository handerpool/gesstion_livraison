import { Component, NgModule } from '@angular/core';
import { Order } from '../models/order.model';
import { CommonModule, DatePipe} from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule,DatePipe,SidebarComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {
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
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  
  statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'pending', label: 'En attente' },
    { value: 'processing', label: 'En traitement' },
    { value: 'shipped', label: 'Expédié' },
    { value: 'delivered', label: 'Livré' },
    { value: 'cancelled', label: 'Annulé' }
  ];
  
  sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'id', label: 'Numéro de commande' },
    { value: 'customer.name', label: 'Client' },
    { value: 'total', label: 'Montant' }
  ];

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    // In a real app, this would be a service call
    this.orders = this.getMockOrders();
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.orders];
    
    // Filter by status
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(order => order.status === this.selectedStatus);
    }
    
    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(term) ||
        order.customer.name.toLowerCase().includes(term) ||
        order.customer.email.toLowerCase().includes(term)
      );
    }
    
    // Sort
    filtered = this.sortOrders(filtered);
    
    this.totalItems = filtered.length;
    
    // Paginate
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredOrders = filtered.slice(startIndex, startIndex + this.itemsPerPage);
  }

  sortOrders(orders: Order[]): Order[] {
    return orders.sort((a, b) => {
      let valueA: any;
      let valueB: any;
      
      // Handle nested properties like 'customer.name'
      if (this.sortBy.includes('.')) {
        const parts = this.sortBy.split('.');
        valueA = (a as any)[parts[0]][parts[1]];
        valueB = (b as any)[parts[0]][parts[1]];
      } else {
        valueA = (a as any)[this.sortBy];
        valueB = (b as any)[this.sortBy];
      }
      
      // Handle date sorting
      if (this.sortBy === 'date') {
        valueA = new Date(valueA).getTime();
        valueB = new Date(valueB).getTime();
      }
      
      // Handle numeric sorting for total
      if (this.sortBy === 'total') {
        valueA = parseFloat(valueA.replace('€', '').replace(',', '.'));
        valueB = parseFloat(valueB.replace('€', '').replace(',', '.'));
      }
      
      if (this.sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  }

  onStatusChange(event: any): void {
    this.selectedStatus = event.target.value;
    this.currentPage = 1;
    this.applyFilters();
  }

  onSearch(event: any): void {
    this.searchTerm = event.target.value;
    this.currentPage = 1;
    this.applyFilters();
  }

  onSortChange(event: any): void {
    this.sortBy = event.target.value;
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

  viewOrderDetails(order: Order): void {
    this.selectedOrder = order;
    this.isDetailModalOpen = true;
  }

  closeDetailModal(): void {
    this.isDetailModalOpen = false;
    this.selectedOrder = null;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'processing': return 'status-processing';
      case 'shipped': return 'status-shipped';
      case 'delivered': return 'status-delivered';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending': return 'En attente';
      case 'processing': return 'En traitement';
      case 'shipped': return 'Expédié';
      case 'delivered': return 'Livré';
      case 'cancelled': return 'Annulé';
      default: return '';
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const pages: number[] = [];
    
    // Show max 5 page numbers
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

  // Mock data for demonstration
  private getMockOrders(): Order[] {
    return [
      {
        id: 'CMD-7845',
        customer: {
          name: 'Youssef Ayari',
          email: 'youssef.ayari@example.com',
          phone: '+216 23 345 678'
        },
        date: '2025-04-22T10:30:00',
        status: 'delivered',
        items: [
          { id: 'ITEM-1', name: 'Pizza Margherita', quantity: 2, price: '15.30 DTN' },
          { id: 'ITEM-2', name: 'Salade César', quantity: 1, price: '9.80 DTN' }
        ],
        total: '40.40 DTN',
        paymentMethod: 'Carte bancaire',
        address: '23 Rue Charles de Gaulle, 1001 Tunis'
      },
      {
        id: 'CMD-7844',
        customer: {
          name: 'Aymen Bouzid',
          email: 'aymen.bouzid@example.com',
          phone: '+216 24 456 789'
        },
        date: '2025-04-22T09:15:00',
        status: 'processing',
        items: [
          { id: 'ITEM-3', name: 'Burger Gourmet', quantity: 1, price: '13.20 DTN' },
          { id: 'ITEM-4', name: 'Frites Maison', quantity: 1, price: '5.50 DTN' },
          { id: 'ITEM-5', name: 'Coca-Cola', quantity: 2, price: '4.00 DTN' }
        ],
        total: '26.70 DTN',
        paymentMethod: 'PayPal',
        address: '10 Avenue Habib Bourguiba, 1000 Tunis'
      },
      {
        id: 'CMD-7843',
        customer: {
          name: 'Meriem Chikhaoui',
          email: 'meriem.chikhaoui@example.com',
          phone: '+216 25 567 890'
        },
        date: '2025-04-21T18:45:00',
        status: 'shipped',
        items: [
          { id: 'ITEM-6', name: 'Pâtes Carbonara', quantity: 1, price: '17.40 DTN' },
          { id: 'ITEM-7', name: 'Tiramisu', quantity: 1, price: '7.60 DTN' }
        ],
        total: '25.00 DTN',
        paymentMethod: 'Carte bancaire',
        address: '5 Rue Mongi Slim, 3000 Sfax'
      },
      {
        id: 'CMD-7842',
        customer: {
          name: 'Oussama Hammami',
          email: 'oussama.hammami@example.com',
          phone: '+216 26 678 901'
        },
        date: '2025-04-21T12:20:00',
        status: 'pending',
        items: [
          { id: 'ITEM-8', name: 'Sushi Mix (18 pièces)', quantity: 1, price: '22.00 DTN' },
          { id: 'ITEM-9', name: 'Soupe Miso', quantity: 2, price: '4.50 DTN' }
        ],
        total: '31.00 DTN',
        paymentMethod: 'Espèces',
        address: '14 Boulevard de la République, 4000 Sousse'
      },
      {
        id: 'CMD-7841',
        customer: {
          name: 'Rania Zghal',
          email: 'rania.zghal@example.com',
          phone: '+216 27 789 012'
        },
        date: '2025-04-20T19:30:00',
        status: 'cancelled',
        items: [
          { id: 'ITEM-10', name: 'Poulet Tandoori', quantity: 1, price: '16.80 DTN' },
          { id: 'ITEM-11', name: 'Naan Nature', quantity: 2, price: '3.20 DTN' },
          { id: 'ITEM-12', name: 'Riz Basmati', quantity: 1, price: '2.90 DTN' }
        ],
        total: '26.10 DTN',
        paymentMethod: 'Carte bancaire',
        address: '8 Rue du 7 Novembre, 4001 Sousse'
      },
      {
        id: 'CMD-7840',
        customer: {
          name: 'Khalil Mahjoub',
          email: 'khalil.mahjoub@example.com',
          phone: '+216 28 890 123'
        },
        date: '2025-04-20T13:15:00',
        status: 'delivered',
        items: [
          { id: 'ITEM-13', name: 'Tacos XXL', quantity: 1, price: '11.50 DTN' },
          { id: 'ITEM-14', name: 'Frites', quantity: 1, price: '4.00 DTN' },
          { id: 'ITEM-15', name: 'Boisson 33cl', quantity: 1, price: '3.00 DTN' }
        ],
        total: '18.50 DTN',
        paymentMethod: 'Ticket Restaurant',
        address: '42 Avenue Hédi Nouira, 3001 Sfax'
      },
      {
        id: 'CMD-7839',
        customer: {
          name: 'Nour Ben Youssef',
          email: 'nour.benyoussef@example.com',
          phone: '+216 29 901 234'
        },
        date: '2025-04-19T20:45:00',
        status: 'processing',
        items: [
          { id: 'ITEM-16', name: 'Pizza 4 Fromages', quantity: 1, price: '14.00 DTN' },
          { id: 'ITEM-17', name: 'Tiramisu', quantity: 2, price: '6.00 DTN' }
        ],
        total: '26.00 DTN',
        paymentMethod: 'Carte bancaire',
        address: '3 Rue des Pêcheries, 7000 Bizerte'
      },
      {
        id: 'CMD-7838',
        customer: {
          name: 'Mohamed Gharbi',
          email: 'mohamed.gharbi@example.com',
          phone: '+216 20 345 678'
        },
        date: '2025-04-19T18:30:00',
        status: 'shipped',
        items: [
          { id: 'ITEM-18', name: 'Poke Bowl Saumon', quantity: 1, price: '17.50 DR  TN' },
          { id: 'ITEM-19', name: 'Eau Minérale', quantity: 1, price: '2.50 DTN' }
        ],
        total: '20.00 DTN',
        paymentMethod: 'PayPal',
        address: '27 Avenue du Général Leclerc, 8000 Nabeul'
      },
      {
        id: 'CMD-7837',
        customer: {
          name: 'Salma Trabelsi',
          email: 'salma.trabelsi@example.com',
          phone: '+216 21 456 789'
        },
        date: '2025-04-18T21:10:00',
        status: 'pending',
        items: [
          { id: 'ITEM-20', name: 'Burger Végétarien', quantity: 1, price: '12.20 DTN' },
          { id: 'ITEM-21', name: 'Frites Patate Douce', quantity: 1, price: '5.30 DTN' },
          { id: 'ITEM-22', name: 'Limonade Bio', quantity: 1, price: '3.10 DTN' }
        ],
        total: '20.60 DTN',
        paymentMethod: 'Carte bancaire',
        address: '14 Rue de Carthage, 2016 Carthage'
      },
      {
        id: 'CMD-7836',
        customer: {
          name: 'Walid Jaziri',
          email: 'walid.jaziri@example.com',
          phone: '+216 22 567 890'
        },
        date: '2025-04-18T19:25:00',
        status: 'delivered',
        items: [
          { id: 'ITEM-23', name: 'Plateau Sushi (32 pièces)', quantity: 1, price: '35.00 DTN' },
          { id: 'ITEM-24', name: 'Edamame', quantity: 1, price: '5.00 DTN' }
        ],
        total: '40.00 DTN',
        paymentMethod: 'Carte bancaire',
        address: '18 Rue de l\'Indépendance, 3100 Kairouan'
      }

    ];
  }
}
