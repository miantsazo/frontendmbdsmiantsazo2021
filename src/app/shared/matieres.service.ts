import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Matiere } from '../matiere.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MatieresService {
  uri = environment.apiUrl + "/matieres";
  // uri = "https://backmbdsmiantsazo2021.herokuapp.com/api/matieres";

  constructor(private http: HttpClient) { }

  getMatieres(): Observable<any> {
    return this.http.get<Matiere[]>(this.uri);
  }

  getMatieresPagines(page: number, limit: number): Observable<any> {
    return this.http.get<Matiere[]>(this.uri + "?page=" + (page + 1) + "&limit=" + limit);
  }
}
