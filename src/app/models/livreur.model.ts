import { User } from './client.model';
import { ContratCL, AvisLivreur, DashboardL } from './client.model';

export interface Livreur extends User {
  tarifLivraison: number;
  tarifRetour: number;
  contratsCommercants: ContratCL[];
  avisCommercants: AvisLivreur[];
  commandesLivrees: DashboardL[];
}
