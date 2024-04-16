import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './../../services/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { loginRequest } from 'src/app/models/loginRequest';
//import {SocialAuthService, GoogleLoginProvider,SocialUser} from 'angularx-social-login';
import { from } from 'rxjs';


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
 // user: SocialUser;

  constructor(private fb: FormBuilder,
              private loginService: LoginService,
              private router: Router
           // private authService:SocialAuthService
          ) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}")]],
      password: ['', Validators.required]
    });
  }

 /* signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(user => {
      this.user = user;
      // Vous pouvez maintenant utiliser les informations de l'utilisateur, telles que user.id, user.name, user.email, etc.
    }).catch(error => {
      console.log('Erreur de connexion Google : ', error);
    });
  }*/

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
