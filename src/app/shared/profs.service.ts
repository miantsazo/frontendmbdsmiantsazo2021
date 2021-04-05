import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Prof } from '../prof.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfsService {
  uri = environment.apiUrl + "/profs";
  private customHttpCLient: HttpClient;

  constructor(private http: HttpClient,
    private handler: HttpBackend, private authService: AuthService) {
    this.customHttpCLient = new HttpClient(handler);
  }

  getProfs(): Observable<Prof[]> {
    return this.http.get<Prof[]>(this.uri);
  }

  getProf(id: string): Observable<any> {
    return this.http.get<Prof>(this.uri + "/" + id);
  }

  getProfsPagines(page: number, limit: number): Observable<any> {
    return this.http.get<Prof[]>(this.uri + "?page=" + (page + 1) + "&limit=" + limit);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(this.uri + "/" + id);
  }

  update(prof: Prof, file: File): Observable<any> {
    let formData = new FormData();
    if (file != null) {
      formData.append('photo', file, file.name);
    }
    formData.append('_id', prof._id);
    formData.append('nom', prof.nom);
    formData.append('prenom', prof.prenom);

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      }),
    };
    return this.customHttpCLient.put(this.uri, formData, httpOptions);
  }

  add(prof: Prof, file: File): Observable<any> {
    let formData = new FormData();
    formData.append('photo', file, file.name);
    formData.append('nom', prof.nom);
    formData.append('prenom', prof.prenom);

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      }),
    };
    return this.customHttpCLient.post(this.uri, formData, httpOptions);
  }
}
