import { Client } from './client.model';
import { Produit } from './commande.model';

export interface AvisProduit {
    client: Client;
    produit: Produit;
    message: string;
    date: string;
}