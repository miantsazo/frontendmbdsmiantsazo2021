import { Matiere } from "../matiere.model";

export class Assignment {
  _id?: string;
  id: number;
  nom: string;
  dateDeRendu: Date;
  rendu: boolean;
  auteur: string;
  matiere: Matiere;
  note: number;
  remarques: string;
}
