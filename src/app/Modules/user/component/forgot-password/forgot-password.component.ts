import { Component, OnInit } from '@angular/core';
import { PasswordService } from '../../services/password.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { emit } from 'process';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  errorMessage = 'You have already asked for forgotten password';
  successMessage = 'Forgot password email has been sent';
  invalidRequest = false;
  requestSuccess = false;
  form: FormGroup;

  constructor(private fb: FormBuilder,
              private passwordService: PasswordService) { }
  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  forgetPassword() {
    if (this.form.valid) {
    const { email } = this.form.value;
      this.passwordService.forgetPassword(email).subscribe(
        () => {
          this.invalidRequest = false;
          this.requestSuccess = true;
          alert(this.successMessage);
        },
        (error) => {
          this.invalidRequest = true;
          this.requestSuccess = false;
          console.error('Forgot password request passed:', error);
          if (error.status === 500) {
            alert('Internal server error. Please try again later.');
          } else {
            alert('Request sent! verify your email.');
          }        }
      );
    }
  }
}
