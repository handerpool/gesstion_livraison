export interface ContratCL {
  idContrat: number;
  livreurId: number;
  commercantId: number;
  dateDebut: string;
  dateFin?: string;
}

export interface ContratCA {
  idContrat: number;
  adminId: number;
  commercantId: number;
  dateDebut: string;
  dateFin?: string;
}

export interface AvisLivreur {
  idAvis: number;
  livreurId: number;
  commercantId: number;
  note: number;
  commentaire: string;
  date: string;
}
