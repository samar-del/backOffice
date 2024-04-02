import { Router } from '@angular/router';
import { SignupService } from './../../services/signup.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  userName: string;
  password: string;
  email: string;

  errorMessage = 'Invalid Credentials';
  successMessage: string;
  invalidSignup = false;
  signupSuccess = false;

  constructor(private signupService: SignupService, private router: Router) { }

  handleSignup() {
    this.signupService.signup(this.userName, this.password, this.email).subscribe(
      (result) => {
        this.invalidSignup = false;
        this.signupSuccess = true;
        this.successMessage = 'Signup successful';
        // Redirect to login page after successful signup
        this.router.navigateByUrl('/login');
      },
      (error) => {
           {
        this.invalidSignup = true;
        this.signupSuccess = false;
        console.error("Signup failed:", error);
      }
    }
    );
  }

}
