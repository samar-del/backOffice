import { Router } from '@angular/router';
import { SignupService } from './../../services/signup.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { signupRequest } from 'src/app/models/signupRequest';
import {  ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  signupForm: FormGroup;
  errorMessage = 'Invalid Credentials';
  successMessage: 'signup successsful';
  emailExistMessage = 'This email address already exists';
  emailExists = false;
  invalidSignup = false;
  signupSuccess = false;

  constructor(private formBuilder: FormBuilder,
              private signupService: SignupService,
              private router: Router,
              private toastr:ToastrService ) {
                      this.signupForm = this.formBuilder.group({
                      userName: ['', Validators.required],
                      password: ['', [Validators.required, Validators.minLength(8)]],
                      email: ['', [Validators.required, Validators.email, Validators.pattern("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}")]],
                      roles:['',[Validators.required]]
                    });
  }

  get form() { return this.signupForm.controls; }

  handleSignup() {
    if (this.signupForm.valid) {
      const { userName, password, email } = this.signupForm.value;
      const request: signupRequest = { userName, password, email };

      this.signupService.signup(request).subscribe(
        (result) => {
          this.toastr.success('Inscription réussie !', 'Succès');
          // Rediriger vers la page de connexion après une inscription réussie
          this.router.navigateByUrl('/login');
        },
        (error) => {
          this.toastr.error('Échec de l\'inscription. Veuillez réessayer.', 'Erreur');
          console.error("Signup failed:", error);
        }
      );
    } else {
      this.toastr.error('Veuillez remplir correctement le formulaire.', 'Erreur de formulaire');
      Object.values(this.signupForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }
}

