import { Component, OnInit } from '@angular/core';
import { Deliveries } from '../models/delivery.model';
import { CommonModule, DatePipe } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-deliveries',
  standalone: true,
  imports: [CommonModule,DatePipe,SidebarComponent],
  templateUrl: './deliveries.component.html',
  styleUrl: './deliveries.component.css'
})
export class DeliveriesComponent implements OnInit {
  Math = Math
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
  
  statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'pending', label: 'En attente' },
    { value: 'in_transit', label: 'En cours' },
    { value: 'delivered', label: 'Livré' },
    { value: 'failed', label: 'Échoué' },
    { value: 'returned', label: 'Retourné' }
  ];
  
  deliveryAgents = [
    { id: 'all', name: 'Tous les livreurs' },
    { id: 'agent-1', name: 'Meriem Ben Salah' },
    { id: 'agent-2', name: 'Khalil Mahjoub' },
    { id: 'agent-3', name: 'Oussama Hammami' },
    { id: 'agent-4', name: 'Salma Trabelsi' }
  ];

  ngOnInit(): void {
    this.loadDeliveries();
  }

  loadDeliveries(): void {
    // In a real app, this would be a service call
    this.deliveries = this.getMockDeliveries();
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.deliveries];
    
    // Filter by status
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(delivery => delivery.status === this.selectedStatus);
    }
    
    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(delivery => 
        delivery.id.toLowerCase().includes(term) ||
        delivery.orderId.toLowerCase().includes(term) ||
        delivery.customer.name.toLowerCase().includes(term) ||
        delivery.customer.address.toLowerCase().includes(term)
      );
    }
    
    // Filter by date
    if (this.selectedDate) {
      const selectedDate = new Date(this.selectedDate);
      filtered = filtered.filter(delivery => {
        const estimatedDate = new Date(delivery.estimatedDelivery);
        return estimatedDate.toDateString() === selectedDate.toDateString();
      });
    }
    
    // Filter by agent
    if (this.selectedAgent !== 'all') {
      filtered = filtered.filter(delivery => 
        delivery.deliveryAgent && delivery.deliveryAgent.id === this.selectedAgent
      );
    }
    
    this.totalItems = filtered.length;
    
    // Paginate
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredDeliveries = filtered.slice(startIndex, startIndex + this.itemsPerPage);
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

  onDateChange(event: any): void {
    this.selectedDate = event.target.value;
    this.currentPage = 1;
    this.applyFilters();
  }

  onAgentChange(event: any): void {
    this.selectedAgent = event.target.value;
    this.currentPage = 1;
    this.applyFilters();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.applyFilters();
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
      case 'pending': return 'status-pending';
      case 'in_transit': return 'status-in-transit';
      case 'delivered': return 'status-delivered';
      case 'failed': return 'status-failed';
      case 'returned': return 'status-returned';
      default: return '';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending': return 'En attente';
      case 'in_transit': return 'En cours';
      case 'delivered': return 'Livré';
      case 'failed': return 'Échoué';
      case 'returned': return 'Retourné';
      default: return '';
    }
  }

  getDeliveryProgress(delivery: Deliveries): number {
    switch (delivery.status) {
      case 'pending': return 10;
      case 'in_transit': return 50;
      case 'delivered': return 100;
      case 'failed': return 75;
      case 'returned': return 90;
      default: return 0;
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
  private getMockDeliveries(): Deliveries[] {
    return [
      {
        id: 'LIV-1001',
        orderId: 'CMD-7845',
        status: 'delivered',
        estimatedDelivery: '2025-04-22T14:30:00',
        actualDelivery: '2025-04-22T14:15:00',
        customer: {
          name: 'Ahmed Ben Ali',
          address: '12 Avenue de Paris, 1001 Tunis',
          phone: '+216 20 123 456'
        },
        deliveryAgent: {
          id: 'agent-1',
          name: 'Meriem Ben Salah',
          phone: '+216 21 234 567',
          photo: 'assets/agent1.jpg',
          rating: 4.8
        },
        items: 3,
        location: { lat: 36.8065, lng: 10.1815 },
        signature: 'assets/signature1.png',
        trackingHistory: [
          { timestamp: '2025-04-22T10:30:00', status: 'pending', description: 'Commande confirmée', location: 'Centre de distribution Tunis' },
          { timestamp: '2025-04-22T11:45:00', status: 'in_transit', description: 'En cours de livraison', location: 'En route vers La Marsa' },
          { timestamp: '2025-04-22T14:15:00', status: 'delivered', description: 'Livraison effectuée', location: '12 Avenue de Paris, 1001 Tunis' }
        ]
      },
      {
        id: 'LIV-1002',
        orderId: 'CMD-7844',
        status: 'in_transit',
        estimatedDelivery: '2025-04-22T16:00:00',
        customer: {
          name: 'Fatma Trabelsi',
          address: '5 Rue de Carthage, 2016 Carthage',
          phone: '+216 22 345 678'
        },
        deliveryAgent: {
          id: 'agent-2',
          name: 'Khalil Mahjoub',
          phone: '+216 23 456 789',
          photo: 'assets/agent2.jpg',
          rating: 4.6
        },
        items: 3,
        location: { lat: 36.8528, lng: 10.3238 },
        trackingHistory: [
          { timestamp: '2025-04-22T09:15:00', status: 'pending', description: 'Commande confirmée', location: 'Centre de distribution La Goulette' },
          { timestamp: '2025-04-22T13:30:00', status: 'in_transit', description: 'En cours de livraison', location: 'En route vers Carthage' }
        ]
      },
      {
        id: 'LIV-1003',
        orderId: 'CMD-7843',
        status: 'pending',
        estimatedDelivery: '2025-04-22T18:30:00',
        customer: {
          name: 'Karim Bouazizi',
          address: '20 Boulevard Habib Bourguiba, 3000 Sfax',
          phone: '+216 25 456 789'
        },
        items: 2,
        location: { lat: 34.7406, lng: 10.7603 },
        trackingHistory: [
          { timestamp: '2025-04-21T18:45:00', status: 'pending', description: 'Commande confirmée', location: 'Centre de distribution Sfax' }
        ]
      },
      {
        id: 'LIV-1004',
        orderId: 'CMD-7842',
        status: 'failed',
        estimatedDelivery: '2025-04-21T14:00:00',
        customer: {
          name: 'Noura Kefi',
          address: '3 Rue Moncef Bey, 5000 Monastir',
          phone: '+216 52 234 567'
        },
        deliveryAgent: {
          id: 'agent-3',
          name: 'Oussama Hammami',
          phone: '+216 54 345 678',
          photo: 'assets/agent3.jpg',
          rating: 4.5
        },
        items: 1,
        location: { lat: 35.7775, lng: 10.8260 },
        notes: 'Client absent lors de la livraison',
        trackingHistory: [
          { timestamp: '2025-04-21T12:20:00', status: 'pending', description: 'Commande confirmée', location: 'Centre de distribution Monastir' },
          { timestamp: '2025-04-21T13:15:00', status: 'in_transit', description: 'En cours de livraison', location: 'En route vers Monastir Centre' },
          { timestamp: '2025-04-21T14:30:00', status: 'failed', description: 'Livraison échouée - Client absent', location: '3 Rue Moncef Bey, 5000 Monastir' }
        ]
      },
      {
        id: 'LIV-1005',
        orderId: 'CMD-7841',
        status: 'returned',
        estimatedDelivery: '2025-04-20T20:00:00',
        customer: {
          name: 'Youssef Ayari',
          address: '18 Rue Ibn Khaldoun, 3100 Kairouan',
          phone: '+216 76 456 789'
        },
        deliveryAgent: {
          id: 'agent-4',
          name: 'Salma Trabelsi',
          phone: '+216 98 567 890',
          photo: 'assets/agent4.jpg',
          rating: 4.7
        },
        items: 3,
        location: { lat: 35.6781, lng: 10.0963 },
        notes: 'Colis refusé par le client - produit endommagé',
        trackingHistory: [
          { timestamp: '2025-04-20T19:30:00', status: 'pending', description: 'Commande confirmée', location: 'Centre de distribution Kairouan' },
          { timestamp: '2025-04-20T19:45:00', status: 'in_transit', description: 'En cours de livraison', location: 'En route vers Kairouan Centre' },
          { timestamp: '2025-04-20T20:15:00', status: 'failed', description: 'Livraison échouée - Colis refusé', location: '18 Rue Ibn Khaldoun, 3100 Kairouan' },
          { timestamp: '2025-04-20T21:00:00', status: 'returned', description: 'Colis retourné au centre de distribution', location: 'Centre de distribution Kairouan' }
        ]
      },
      {
        id: 'LIV-1006',
        orderId: 'CMD-7840',
        status: 'delivered',
        estimatedDelivery: '2025-04-20T14:00:00',
        actualDelivery: '2025-04-20T13:45:00',
        customer: {
          name: 'Aicha Gharbi',
          address: '7 Avenue Mongi Slim, 4000 Sousse',
          phone: '+216 40 123 456'
        },
        deliveryAgent: {
          id: 'agent-1',
          name: 'Meriem Ben Salah',
          phone: '+216 43 234 567',
          photo: 'assets/agent1.jpg',
          rating: 4.8
        },
        items: 3,
        location: { lat: 35.8256, lng: 10.6407 },
        signature: 'assets/signature2.png',
        trackingHistory: [
          { timestamp: '2025-04-20T13:15:00', status: 'pending', description: 'Commande confirmée', location: 'Centre de distribution Sousse' },
          { timestamp: '2025-04-20T13:30:00', status: 'in_transit', description: 'En cours de livraison', location: 'En route vers Sousse Centre' },
          { timestamp: '2025-04-20T13:45:00', status: 'delivered', description: 'Livraison effectuée', location: '7 Avenue Mongi Slim, 4000 Sousse' }
        ]
      },
      {
        id: 'LIV-1007',
        orderId: 'CMD-7839',
        status: 'in_transit',
        estimatedDelivery: '2025-04-22T21:30:00',
        customer: {
          name: 'Walid Jaziri',
          address: '4 Rue de la Kasbah, 6000 Kasserine',
          phone: '+216 60 345 678'
        },
        deliveryAgent: {
          id: 'agent-2',
          name: 'Khalil Mahjoub',
          phone: '+216 63 456 789',
          photo: 'assets/agent2.jpg',
          rating: 4.6
        },
        items: 2,
        location: { lat: 35.1676, lng: 8.8368 },
        trackingHistory: [
          { timestamp: '2025-04-19T20:45:00', status: 'pending', description: 'Commande confirmée', location: 'Centre de distribution Kasserine' },
          { timestamp: '2025-04-22T19:30:00', status: 'in_transit', description: 'En cours de livraison', location: 'En route vers Kasserine Centre' }
        ]
      },
      {
        id: 'LIV-1008',
        orderId: 'CMD-7838',
        status: 'delivered',
        estimatedDelivery: '2025-04-19T19:00:00',
        actualDelivery: '2025-04-19T18:45:00',
        customer: {
          name: 'Meriem Ben Salah',
          address: '9 Rue de la République, 7000 Bizerte',
          phone: '+216 70 123 456'
        },
        deliveryAgent: {
          id: 'agent-3',
          name: 'Oussama Hammami',
          phone: '+216 73 234 567',
          photo: 'assets/agent3.jpg',
          rating: 4.5
        },
        items: 2,
        location: { lat: 37.2747, lng: 9.8734 },
        signature: 'assets/signature3.png',
        trackingHistory: [
          { timestamp: '2025-04-19T18:30:00', status: 'pending', description: 'Commande confirmée', location: 'Centre de distribution Bizerte' },
          { timestamp: '2025-04-19T18:40:00', status: 'in_transit', description: 'En cours de livraison', location: 'En route vers Bizerte Centre' },
          { timestamp: '2025-04-19T18:45:00', status: 'delivered', description: 'Livraison effectuée', location: '9 Rue de la République, 7000 Bizerte' }
        ]
      },
      {
        id: 'LIV-1009',
        orderId: 'CMD-7837',
        status: 'pending',
        estimatedDelivery: '2025-04-23T10:00:00',
        customer: {
          name: 'Sonia Jendoubi',
          address: '6 Avenue de la Liberté, 8000 Nabeul',
          phone: '+216 80 345 678'
        },
        items: 3,
        location: { lat: 36.4511, lng: 10.7376 },
        trackingHistory: [
          { timestamp: '2025-04-18T21:10:00', status: 'pending', description: 'Commande confirmée', location: 'Centre de distribution Nabeul' }
        ]
      },
      {
        id: 'LIV-1010',
        orderId: 'CMD-7836',
        status: 'delivered',
        estimatedDelivery: '2025-04-18T20:00:00',
        actualDelivery: '2025-04-18T19:40:00',
        customer: {
          name: 'Walid Mejri',
          address: '11 Rue de l\'Indépendance, 1000 Tunis',
          phone: '+216 70 987 654'
        },
        deliveryAgent: {
          id: 'agent-4',
          name: 'Salma Trabelsi',
          phone: '+216 76 543 210',
          photo: 'assets/agent4.jpg',
          rating: 4.7
        },
        items: 2,
        location: { lat: 36.8065, lng: 10.1815 },
        signature: 'assets/signature4.png',
        trackingHistory: [
          { timestamp: '2025-04-18T19:25:00', status: 'pending', description: 'Commande confirmée', location: 'Centre de distribution Tunis' },
          { timestamp: '2025-04-18T19:30:00', status: 'in_transit', description: 'En cours de livraison', location: 'En route vers Tunis Centre' },
          { timestamp: '2025-04-18T19:40:00', status: 'delivered', description: 'Livraison effectuée', location: '11 Rue de l\'Indépendance, 1000 Tunis' }
        ]
      }
    ];
  }
}
