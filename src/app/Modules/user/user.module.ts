import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GPermissionComponent } from './component/g-permission/g-permission.component';
import { GUserComponent } from './component/g-user/g-user.component';
import { GRoleComponent } from './component/g-role/g-role.component';
import { LoginComponent } from './component/login/login.component';
import { SignupComponent } from './component/signup/signup.component';
import { LayoutComponent } from './component/layout/layout.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { ResetPasswordComponent } from './component/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';



@NgModule({
  declarations: [GPermissionComponent, GUserComponent, GRoleComponent, LoginComponent, SignupComponent, LayoutComponent, DashboardComponent, ResetPasswordComponent, ForgotPasswordComponent],
  imports: [
    CommonModule
  ]
})
export class UserModule { }
