import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Client } from '../models/client.model';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';


@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule,FormsModule,SidebarComponent],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  searchTerm: string = '';
  selectedClient: Client | null = null;
  showClientDetails: boolean = false;
  
  statusFilter: string = 'all';
  sortBy: string = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor() { }

  ngOnInit(): void {
    // In a real app, this would come from a service
    this.clients = this.getMockClients();
    this.filteredClients = [...this.clients];
  }

  getMockClients(): Client[] {
    return [
      {
        id: 1,
        name: 'Acme Corporation',
        email: 'contact@acme.com',
        phone: '+33 1 23 45 67 89',
        address: '123 Business Ave',
        city: 'Paris',
        postalCode: '75001',
        country: 'France',
        joinDate: new Date(2022, 1, 15),
        totalOrders: 42,
        status: 'active'
      },
      {
        id: 2,
        name: 'TechStart SAS',
        email: 'info@techstart.fr',
        phone: '+33 1 98 76 54 32',
        address: '456 Innovation Blvd',
        city: 'Lyon',
        postalCode: '69001',
        country: 'France',
        joinDate: new Date(2022, 3, 10),
        totalOrders: 27,
        status: 'active'
      },
      {
        id: 3,
        name: 'Gourmet Deliveries',
        email: 'orders@gourmet.fr',
        phone: '+33 4 56 78 90 12',
        address: '789 Culinary St',
        city: 'Marseille',
        postalCode: '13001',
        country: 'France',
        joinDate: new Date(2021, 11, 5),
        totalOrders: 103,
        status: 'active'
      },
      {
        id: 4,
        name: 'Fashion Boutique',
        email: 'contact@fashionboutique.com',
        phone: '+33 6 12 34 56 78',
        address: '101 Style Avenue',
        city: 'Nice',
        postalCode: '06000',
        country: 'France',
        joinDate: new Date(2022, 6, 20),
        totalOrders: 18,
        status: 'inactive',
        notes: 'Temporarily closed for renovation'
      },
      {
        id: 5,
        name: 'Green Gardens',
        email: 'info@greengardens.fr',
        phone: '+33 5 43 21 09 87',
        address: '202 Nature Road',
        city: 'Bordeaux',
        postalCode: '33000',
        country: 'France',
        joinDate: new Date(2023, 0, 8),
        totalOrders: 7,
        status: 'active'
      }
    ];
  }

  searchClients(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.clients];
    
    // Apply search term filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(client => 
        client.name.toLowerCase().includes(term) || 
        client.email.toLowerCase().includes(term) || 
        client.city.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(client => client.status === this.statusFilter);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (this.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'city':
          comparison = a.city.localeCompare(b.city);
          break;
        case 'joinDate':
          comparison = a.joinDate.getTime() - b.joinDate.getTime();
          break;
        case 'totalOrders':
          comparison = a.totalOrders - b.totalOrders;
          break;
      }
      
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
    
    this.filteredClients = filtered;
  }

  toggleSort(column: string): void {
    if (this.sortBy === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  viewClientDetails(client: Client): void {
    this.selectedClient = client;
    this.showClientDetails = true;
  }

  closeClientDetails(): void {
    this.showClientDetails = false;
    this.selectedClient = null;
  }

  addNewClient(): void {
    // In a real app, this would open a form and save to backend
    alert('Add new client functionality would be implemented here');
  }

  editClient(client: Client): void {
    // In a real app, this would open a form with client data
    alert(`Edit client: ${client.name}`);
  }

}
