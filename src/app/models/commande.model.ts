// src/app/models/commande.model.ts
export interface Commande {
  idCmd: number;
  clientId: number;
  clientNom: string;
  adresse: string;
  codePostale: string;
  statut: string;
  dateCmd: string | null;
  estpayee: boolean;
  produitId: number;
  produitNom: string;
  quantity: number;
  prixTotale: number;
  livreurNom?: string; // Optional, as it may not always be present
}

export interface CommandeResponse {
  commandes: Commande[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface CommandeSummary {
  idCmd: number;
  clientNom: string;
  livreurNom: string;
  statut: string;
  dateCmd: string | null;
  montant: number; // Added montant property
}

export interface DeliveryStats {
  LIVRÉ: { count: number; percentage: number; color: string };
  EN_ATTENTE: { count: number; percentage: number; color: string };
  ANNULÉ: { count: number; percentage: number; color: string };
}

export interface StatsCard {
  title: string;
  value: string;
  icon: string;
  color: string;
  backgroundColor: string;
  iconColor: string;
  trend?: 'up' | 'down';
  change?: string;
  iconBg?: string;
}

export interface Produit {
  idProd: number;
  nomProd: string;
}