//file: src/app/services/client.service.ts
import { Client } from '../models/client.model'; // غيّر المسار حسب مكان الملف الحقيقي
import { RoleUser } from '../models/client.model'; // Adjust the path based on the actual location of the file
const newClient: Client = {
  idUser: 0,
  nom: '',
  prenom: '',
  email: '',
  tlf: '',
  adresse: '', // مطلوب
  codePostale: '', // مطلوب
  statut: RoleUser.client,
  commandes: [],
  avisProduits: []
};