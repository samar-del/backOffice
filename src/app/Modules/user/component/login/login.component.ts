import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './../../services/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { loginRequest } from 'src/app/models/loginRequest';
//import {SocialAuthService, GoogleLoginProvider,SocialUser} from 'angularx-social-login';
import { from } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';


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
              private router: Router,
              private authService:AuthService,
              private toastr: ToastrService
           // private authService:SocialAuthService
          ) { }

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
          this.authService.addAccessToken(response.token);
          this.toastr.success('Connexion réussie !', 'Succès');
          this.invalidLogin = false;
          this.loginSuccess = true;
          console.log('Login successful:', response);
          this.router.navigate(['/admin/formsManagement']);
        },
        (error) => {
          this.toastr.error('Échec de la connexion. Veuillez réessayer.', 'Erreur');
          this.invalidLogin = true;
          this.loginSuccess = false;
          console.error('Login failed:', error);
        }
      );
    } else {
      this.toastr.error('Veuillez remplir correctement le formulaire.', 'Erreur de formulaire');
      Object.values(this.form.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }


}
