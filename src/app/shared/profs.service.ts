import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Prof } from '../prof.model';

@Injectable({
  providedIn: 'root'
})
export class ProfsService {
  uri = environment.apiUrl + "/profs";
  constructor(private http: HttpClient) { }

  getProfs(): Observable<Prof[]> {
    return this.http.get<Prof[]>(this.uri);
  }
}
