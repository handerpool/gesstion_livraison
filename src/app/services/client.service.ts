//file: src/app/services/client.service.ts
import { Client } from '../models/client.model';
import { RoleUser } from '../models/client.model';

const newClient: Client = {
  idUser: 0,
  nom: '',
  prenom: '',
  email: '',
  tlf: '',
  adresse: '',
  codePostale: '',
  statut: RoleUser.client,
  commandes: [],
  avisProduits: []
};