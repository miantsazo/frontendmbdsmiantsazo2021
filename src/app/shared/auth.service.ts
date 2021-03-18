import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../login/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
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

  isLoggedIn() {
    return localStorage.getItem('token') !== null ? true : false;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  signup(user: User): Observable<any> {
    return this.http.post(`${this.uri}/signup`, user);
  }

  logIn(username: String, password: String) {
    return this.http.post<{token:string; expiresIn:Number,userId:string}>(
      `${this.uri}/login`, {username: username, password: password}
    );
  }

  logout() {
    
  }

}
