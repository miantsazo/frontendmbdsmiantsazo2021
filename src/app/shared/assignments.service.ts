import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { forkJoin, Observable, of } from "rxjs";
import { catchError, filter, map, tap } from "rxjs/operators";
import { Assignment } from "../assignments/assignment.model";
import { LoggingService } from "./logging.service";
import { assignmentsGeneres } from "./data";
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: "root",
})
export class AssignmentsService {
  assignments: Assignment[];

  constructor(
    private loggingService: LoggingService,
    private http: HttpClient
  ) { }

  uri = environment.apiUrl + "/assignments";
  // uri = "https://backmbdsmiantsazo2021.herokuapp.com/api/assignments";

  getAssignments(): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(this.uri);
  }

  searchAssignments(name: string, rendu: boolean): Observable<any> {
    return this.http.get<Assignment[]>(this.uri + "?q=" + name + "&rendu=" + rendu);
  }

  getAssignmentsPagine(page: number, limit: number, rendu: boolean): Observable<any> {
    return this.http.get<Assignment[]>(
      this.uri + "?page=" + page + "&limit=" + limit + "&rendu=" + rendu
    );
  }

  // Pour votre culture, on peut aussi utiliser httpClient avec une promesse
  // et then, async, await etc. Mais ce n'est pas la norme chez les developpeurs
  // Angular
  getAssignmentsAsPromise(): Promise<Assignment[]> {
    console.log("Dans le service de gestion des assignments...");
    //return of(this.assignments);
    return this.http.get<Assignment[]>(this.uri).toPromise();
  }

  getAssignment(id: string): Observable<Assignment> {
    return this.http.get<Assignment>(this.uri + "/" + id);
  }

  private handleError<T>(operation: any, result?: T) {
    return (error: any): Observable<T> => {
      console.log(error); // pour afficher dans la console
      console.log(operation + " a échoué " + error.message);

      return of(result as T);
    };
  }

  generateId(): number {
    return Math.round(Math.random() * 100000);
  }

  addAssignment(assignment: Assignment): Observable<any> {
    return this.http.post(this.uri, assignment);
  }

  updateAssignment(assignment: Assignment): Observable<any> {
    return this.http.put(this.uri, assignment);
  }

  deleteAssignment(assignment: Assignment): Observable<any> {
    return this.http.delete(this.uri + "/" + assignment._id);
  }

  peuplerBD() {
    assignmentsGeneres.forEach((a) => {
      let nouvelAssignment = new Assignment();
      nouvelAssignment.nom = a.nom;
      nouvelAssignment.auteur = a.auteur;
      nouvelAssignment.dateDeRendu = new Date(a.dateDeRendu);
      nouvelAssignment.rendu = a.rendu;
      nouvelAssignment.matiere = a.matiere;
      nouvelAssignment.note = a.note;
      nouvelAssignment.remarques = a.remarques;

      this.addAssignment(nouvelAssignment).subscribe((reponse) => {
        console.log(reponse.message);
      });
    });
  }

  // autre version qui permet de récupérer un subscribe une fois que tous les inserts
  // ont été effectués
  peuplerBDAvecForkJoin(): Observable<any> {
    const appelsVersAddAssignment = [];

    assignmentsGeneres.forEach((a) => {
      const nouvelAssignment = new Assignment();

      nouvelAssignment.nom = a.nom;
      nouvelAssignment.dateDeRendu = new Date(a.dateDeRendu);
      nouvelAssignment.rendu = a.rendu;
      nouvelAssignment.remarques = a.remarques;
      nouvelAssignment.matiere = a.matiere;
      nouvelAssignment.note = a.note;
      nouvelAssignment.rendu = a.rendu;
      nouvelAssignment.auteur = a.auteur;

      appelsVersAddAssignment.push(this.addAssignment(nouvelAssignment));
    });
    return forkJoin(appelsVersAddAssignment); // renvoie un seul Observable pour dire que c'est fini
  }
}
