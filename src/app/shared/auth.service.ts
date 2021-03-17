import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../login/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  admin = false;

  uri = "http://localhost:8010/api";

  constructor(private http: HttpClient) { }

  // exemple d'utilisation :
  // isAdmin.then(admin => { console.log("administrateur : " + admin);})
  isAdmin() {
    return new Promise((resolve, reject) => {
      resolve(this.admin);
    });
  }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  signup(user: User): Observable<any> {
    return this.http.post(`${this.uri}/signup`, user);
  }

  logIn(username: String, password: String) {
    
  }

  logout() {
    
  }

}
