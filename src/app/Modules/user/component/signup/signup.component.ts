import { Router } from '@angular/router';
import { SignupService } from './../../services/signup.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { signupRequest } from 'src/app/models/signupRequest';

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
              private router: Router) {
                      this.signupForm = this.formBuilder.group({
                      userName: ['', Validators.required],
                      password: ['', [Validators.required, Validators.minLength(8)]],
                      email: ['', [Validators.required, Validators.email]]
                    });
  }

  get form() { return this.signupForm.controls; }

  handleSignup() {
    if (this.signupForm.valid) {
      const { userName, password, email } = this.signupForm.value;
      const request: signupRequest = { userName, password, email };

      this.signupService.signup(request).subscribe(
        (result) => {
          this.invalidSignup = false;
          this.signupSuccess = true;
          // Rediriger vers la page de connexion après une inscription réussie
          this.router.navigateByUrl('/login');
        },
        (error) => {
          this.invalidSignup = true;
          this.signupSuccess = false;
          console.error("Signup failed:", error);
        }
      );
    }
      else {
        Object.values(this.signupForm.controls).forEach(control => {
          control.markAsTouched();
        });
    }
  }
}

