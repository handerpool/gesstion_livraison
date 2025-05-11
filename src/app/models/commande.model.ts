export interface Client {
  idUser: number;
  nom: string;
  prenom: string;
  email: string;
  tlf: string;
  adresse: string;
  codePostale: string;
  statut: 'client' | 'commercant' | 'livreur'; // Match the enum from the database
}

export interface Produit {
  idProd: number;
  nomProd: string;
  prix: number;
}

export interface Commande {
  idCmd: number;
  client?: {
    idUser: number;
    nom: string;
    prenom: string;
    email: string;
    tlf: string;
    adresse: string;
    codePostale: string;
    statut: string;
  };
  adresse: string;
  codePostale: string;
  statut: 'annulé' | 'en_attente' | 'livré';
  dateCmd: string | Date; // Support both string and Date
  estpayee: boolean;
  produit?: {
    idProd: number;
    nomProd: string;
    prix: number;
  };
  quantity: number;
  prixht: number;
  prixUnitaire: number;
  prixTotale: number;
  tlf: string;
  qrCode?: any;
  dashboardL?: {
    livreur?: {
      idUser: number;
      nom: string;
    };
  };
}

export interface CommandeResponse {
  commandes: Commande[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface DeliveryStats {
  livré: { count: number; percentage: number };
  en_attente: { count: number; percentage: number };
  annulé: { count: number; percentage: number };
}

export interface StatsCard {
  title: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down';
  icon: string;
  iconBg?: string;
}