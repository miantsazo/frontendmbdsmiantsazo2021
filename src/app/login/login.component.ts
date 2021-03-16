import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hidePassword: boolean = true;
  signupForm: SignupForm;
  loginForm: LoginForm;


  constructor() { }

  ngOnInit(): void {
    this.loginForm = new LoginForm();
    this.signupForm = new SignupForm();
  }

  login() {
    // const username = this.loginForm.username;
    // const password = this.loginForm.password; 
  }

  signup() {
    console.log(this.signupForm)
  }

}
class LoginForm {
  username: string = null;
  password: string = null;

  isInvalid(): boolean {
    return this.username == '' || this.password == '' || this.username == null || this.password == null
  }

}
class SignupForm extends LoginForm {
  confirmPassword: string = null;

  usernameControl = new FormControl('', [Validators.required, Validators.minLength(8)]);
  passwordControl = new FormControl('', [Validators.required, Validators.minLength(8)]);
  confirmPasswordControl = new FormControl('', [Validators.required]);

  isInvalid(): boolean {
    return this.username == '' || this.password == '' || this.username == null || this.password == null
      || this.password !== this.confirmPassword || this.username.length < 8 || this.password.length < 8 || this.username.match(/^ *$/) !== null;
  }

  getErrorMessage(field: string) {
    if (field === 'username') {
      // console.log(this.username.match(/^ *$/) !== null)
      if (this.usernameControl.hasError('required')) {
        return 'Nom d\'utilisateur obligatoire';
      } else if (this.usernameControl.hasError('minlength')) {
        return 'Le nom d\'utilisateur doit comporter au moins 8 caractères';
      } else if(this.username.match(/^ *$/) !== null) {
        console.log("espace");
        return 'Le nom d\'utilisateur ne peut pas être composé uniquement d\'espace';
      }
    }
    if (field === 'password') {
      if (this.passwordControl.hasError('required')) {
        return 'Mot de passe obligatoire';
      } else if (this.passwordControl.hasError('minlength')) {
        return 'Le mot de passe doit comporter au moins 8 caractères';
      }
    }
    if (field === 'confirmPassword') {      
      if (this.password !== this.confirmPassword) {
        console.log("non identiques : " + this.password + " - " + this.confirmPassword);
        return 'Les mots de passe ne sont pas identiques';
      }
    }

    return '';
  }

}