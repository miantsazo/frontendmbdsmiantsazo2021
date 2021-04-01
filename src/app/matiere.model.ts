import { Prof } from "./prof.model";

export class Matiere {
  _id?: string;
  libelle: string;
  prof: Prof | any;

  constructor() {
    this.prof = new Prof();
  }
}
