import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../login/user.model';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  admin = false;

  uri = environment.apiUrl;;
  // uri = "https://backmbdsmiantsazo2021.herokuapp.com/api";

  constructor(private http: HttpClient, private router: Router) { }

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

  tokenError(responseError) {
    if (responseError.status === 401) {
      localStorage.removeItem('token');
      this.router.navigate(['/']);
    }
  }

}
