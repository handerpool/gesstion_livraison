// src/app/models/client.model.ts
import { Commande } from './commande.model';

export enum RoleUser {
  livreur = 'livreur',
  commercant = 'commercant',
  client = 'client',
}

export interface User {
  idUser: number;
  nom: string;
  prenom: string;
  age?: number;
  email?: string;
  tlf?: string;
  statut?: RoleUser | string;
  motdepasse?: string;
  photodeprofil?: string;
}

export interface Client extends User {
  adresse?: string;
  codePostale?: string;
  zip?: string;
  commandes?: Commande[];
  avisProduits?: any[];
}

export interface ContratCL {
  // Define as needed
}

export interface AvisLivreur {
  // Define as needed
}

export interface DashboardL {
  idCmd: number;
}

export interface Livreur extends User {
  tarifLivraison: number;
  tarifRetour: number;
  contratsCommercants: ContratCL[];
  avisCommercants: AvisLivreur[];
  commandesLivrees: DashboardL[];
}