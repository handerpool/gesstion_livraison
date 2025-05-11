import { Commande, Produit } from './commande.model';
import { AvisProduit } from './avis.model';

export enum RoleUser {
    livreur = 'livreur',
    commercant = 'commercant',
    client = 'client',
}

export interface Message {
    idMe: number;
    userEnvoi: User;
    userRecu: User;
    message: string;
    date: string;
}

export interface User {
    idUser: number;
    nom: string;
    prenom: string;
    age?: number;
    email: string;
    tlf: string;
    statut?: RoleUser;
    motdepasse?: string;
    photodeprofil?: string;
    messagesEnvoyes?: Message[];
    messagesRecus?: Message[];
}

export interface Client extends User {
    adresse: string;
    codePostale: string;
    zip?: string;
    statut: RoleUser;
    commandes?: Commande[];
    avisProduits?: AvisProduit[];
}

export interface Commercant extends User {
    produits?: Produit[];
    contratsLivreurs?: ContratCL[];
    contratsAdmins?: ContratCA[];
    avisLivreurs?: AvisLivreur[];
}

export interface Livreur extends User {
    tarifLivraison: number;
    tarifRetour: number;
    contratsCommercants?: ContratCL[];
    avisCommercants?: AvisLivreur[];
    commandesLivrees?: DashboardL[];
}

export interface Admin extends User {
    contratsCommercants?: ContratCA[];
}

export interface ContratCL {
    idCCL: number;
    commercant: Commercant;
    livreur: Livreur;
    dateDebut: string;
    dateFin?: string;
}

export interface ContratCA {
    idCCA: number;
    admin: User;
    commercant: Commercant;
    dateDebut: string;
    dateFin?: string;
}

export interface AvisLivreur {
    id: number;
    commercant: Commercant;
    livreur: Livreur;
    message: string;
    date: string;
}

export interface DashboardL {
    livreur?: Livreur;
    commande: Commande;
}