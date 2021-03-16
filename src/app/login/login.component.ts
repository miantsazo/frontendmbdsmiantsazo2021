import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { GetErrorMessage, MatchPassordValidator, NotOnlySpaceValidator } from '../utils/value-control';

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

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
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

  login() {

  }

  signup() {
    this.signupSubmitted = true;
    if (this.signupForm.invalid) {
      return;
    }
    // appel api du back
    this.signupSubmitted = false;
  }
}
class LoginForm {
  username: string = null;
  password: string = null;

  isInvalid(): boolean {
    return this.username == '' || this.password == '' || this.username == null || this.password == null
  }

}