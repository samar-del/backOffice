import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './../../services/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { loginRequest } from 'src/app/models/loginRequest';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  errorMessage = 'Invalid Credentials';
  successMessage = 'Login successful';
  invalidLogin = false;
  loginSuccess = false;
  form: FormGroup;

  constructor(private fb: FormBuilder,
              private loginService: LoginService,
              private router: Router) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}")]],
      password: ['', Validators.required]
    });
  }

  handleLogin() {
    if (this.form.valid) {
      const { email, password } = this.form.value;
      const request: loginRequest = { password, email };

      this.loginService.signin(request).subscribe(
        (response) => {
         /* if(response && response.token){
            localStorage.setItem('accessToken',response.token);
          }*/

          this.invalidLogin = false;
          this.loginSuccess = true;
          console.log('Login successful:', response);
          this.router.navigate(['/content']);
        },
        (error) => {
          this.invalidLogin = true;
          this.loginSuccess = false;
          console.error('Login failed:', error);
        }
      );
    }
  }


}
