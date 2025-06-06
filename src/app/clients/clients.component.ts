import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Client, RoleUser } from '../models/client.model';
import { DeliveryService } from '../services/delivery.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  searchTerm: string = '';
  statusFilter: string = 'all';
  selectedClient: Client | null = null;
  showClientDetails: boolean = false;
  sortBy: string = 'nom';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private deliveryService: DeliveryService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.deliveryService.getTopClients(0, 10).subscribe({
      next: (data) => {
        this.clients = data || [];
        this.applyFilters();
        console.log('Clients chargés:', this.clients);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des clients:', err);
        this.clients = [];
        this.applyFilters();
      },
    });
  }

  searchClients(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.clients];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (client) =>
          (client.nom?.toLowerCase().includes(term) || '') ||
          (client.prenom?.toLowerCase().includes(term) || '') ||
          (client.email?.toLowerCase().includes(term) || '')
      );
    }

    if (this.statusFilter !== 'all') {
      filtered = filtered.filter((client) => {
        const hasOrders = client.commandes && client.commandes.length > 0;
        if (this.statusFilter === 'active') {
          return hasOrders;
        } else if (this.statusFilter === 'inactive') {
          return !hasOrders;
        }
        return true;
      });
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (this.sortBy) {
        case 'nom':
          comparison = `${a.nom || ''} ${a.prenom || ''}`.localeCompare(
            `${b.nom || ''} ${b.prenom || ''}`
          );
          break;
        case 'codePostale':
          comparison = (a.codePostale || '').localeCompare(b.codePostale || '');
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
    alert('Fonctionnalité d’ajout de client à implémenter');
  }

  editClient(client: Client): void {
    alert(`Modifier le client: ${client.nom} ${client.prenom}`);
  }

  getClientStatus(client: Client | null): string {
    return client?.commandes && client.commandes.length > 0 ? 'Actif' : 'Inactif';
  }
}