import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { GetErrorMessage, MatchPassordValidator, NotOnlySpaceValidator } from '../utils/value-control';
import { User } from './user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hidePassword: boolean = true;
  signupForm: FormGroup;
  signupSubmitted = false;
  loginForm: LoginForm;
  loginSubmitted = false;

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      lastname: ['', [Validators.required, NotOnlySpaceValidator]],
      firstname: ['', [Validators.required, NotOnlySpaceValidator]],
      username: ['', [Validators.required, Validators.minLength(6), NotOnlySpaceValidator]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MatchPassordValidator('password', 'confirmPassword')
    });
    this.loginForm = new LoginForm();
  }

  get f() { return this.signupForm.controls; }

  getErrorMessages(field: string, type: any) {
    return GetErrorMessage(field, type);
  }
  
  signup() {
    this.signupSubmitted = true;
    if (this.signupForm.invalid) {
      return;
    }
    let user = new User();
    let formValue = this.signupForm.value;
    user.firstname = formValue.firstname;
    user.lastname = formValue.lastname;
    user.username = formValue.username;
    user.password = formValue.password;
    this.authService.signup(user).subscribe(response => {
      this.snackBar.open(response.message, null, {
        duration: 500,
        panelClass: ['success-snackbar']
      }).afterDismissed().subscribe(() => this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/']);
      }));
    }, responseError => {
      this.snackBar.open(responseError.error.message, null, {
        duration: 1000,
        panelClass: ['error-snackbar']
      });
    })

    // appel api du back
    this.signupSubmitted = false;
  }
  // on s'est inspiré de https://itnext.io/authentication-using-jwt-in-mean-stack-6b425247b7d8
  login() {
    this.authService.logIn(this.loginForm.username, this.loginForm.password).subscribe(response => {
      localStorage.setItem('token', response.token);
      this.router.navigate(["/home"]);
    }, responseError => {
      this.snackBar.open(responseError.error.message, null, {
        duration: 1000,
        panelClass: ['error-snackbar']
      });
    })
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
class LoginForm {
  username: string = null;
  password: string = null;

  isInvalid(): boolean {
    return this.username == '' || this.password == '' || this.username == null || this.password == null
  }

}