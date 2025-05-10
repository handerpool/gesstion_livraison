import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar: string;
}
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  activeTab: string = 'profile';
  
  userProfile: UserProfile = {
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    role: 'Administrateur',
    avatar: 'https://via.placeholder.com/150'
  };
  
  notificationSettings: NotificationSetting[] = [
    {
      id: 'new_order',
      label: 'Nouvelles commandes',
      description: 'Recevoir une notification lorsqu\'une nouvelle commande est créée',
      enabled: true
    },
    {
      id: 'order_status',
      label: 'Changements de statut des commandes',
      description: 'Recevoir une notification lorsque le statut d\'une commande change',
      enabled: true
    },
    {
      id: 'delivery_status',
      label: 'Mises à jour des livraisons',
      description: 'Recevoir une notification lorsque le statut d\'une livraison change',
      enabled: true
    },
    {
      id: 'client_signup',
      label: 'Nouveaux clients',
      description: 'Recevoir une notification lorsqu\'un nouveau client s\'inscrit',
      enabled: false
    },
    {
      id: 'payment_received',
      label: 'Paiements reçus',
      description: 'Recevoir une notification lorsqu\'un paiement est reçu',
      enabled: true
    }
  ];
  
  displaySettings = {
    darkMode: false,
    language: 'fr',
    dateFormat: 'dd/mm/yyyy',
    timeFormat: '24h'
  };
  
  securitySettings = {
    twoFactorAuth: false,
    sessionTimeout: 30
  };
  
  constructor() { }

  ngOnInit(): void {
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  toggleNotification(setting: NotificationSetting): void {
    setting.enabled = !setting.enabled;
    // In a real app, this would be saved to a backend
  }

  saveProfile(): void {
    // In a real app, this would save to a backend
    alert('Profil mis à jour avec succès');
  }

  saveDisplaySettings(): void {
    // In a real app, this would save to a backend
    alert('Paramètres d\'affichage mis à jour avec succès');
  }

  saveSecuritySettings(): void {
    // In a real app, this would save to a backend
    alert('Paramètres de sécurité mis à jour avec succès');
  }
}
