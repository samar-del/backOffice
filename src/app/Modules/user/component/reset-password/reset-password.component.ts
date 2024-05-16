import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { PasswordService } from './../../services/password.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { resetPassword } from 'src/app/models/resetPassword';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  Form: FormGroup;
  resetPasswordData: resetPassword = {};
  token: string;
  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private passwordService: PasswordService,
    private router: Router) { }

  ngOnInit(): void {
    this.Form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });

    this.route.paramMap.subscribe(params => {
      this.token = params.get('token');
    });
  }

  resetPassword() {
    if (this.Form.valid) {
      this.resetPasswordData = this.Form.value;
      this.passwordService.resetPassword(this.resetPasswordData, this.token).subscribe(
        () => {
          alert("Password was changed successfully");
          this.router.navigate(['login']);
        },
        () => {
          alert("Password changed successfully!");
          this.router.navigate(['/login']);
        }
      );
    }
  }


  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword').value;
    const confirmPassword = form.get('confirmPassword').value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }
}
