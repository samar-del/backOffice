import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './Modules/user/component/login/login.component';
import { SignupComponent } from './Modules/user/component/signup/signup.component';
import { ContentComponent } from './components/content/content.component';
import { ForgotPasswordComponent } from './Modules/user/component/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './Modules/user/component/reset-password/reset-password.component';
import { GestionRoleComponent } from './Modules/Gestion/gestion-role/gestion-role.component';
import { DashboardComponent } from './Modules/user/component/dashboard/dashboard.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AuthGuard } from './Modules/user/services/auth.guard';
import { GestionUserComponent } from './Modules/Gestion/gestion-user/gestion-user.component';

const routes: Routes = [
  { path: 'login',
      component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path:'',
    redirectTo:'content',
    pathMatch:'full'
  },

  {
    path:'content',
    component: ContentComponent , canActivate:[AuthGuard]
  },
  {
    path:'forgotPassword',
    component:ForgotPasswordComponent
  },
  {path: "resetpassword/:token",
    component: ResetPasswordComponent
  },
  {
    path:'dashboard',
    component: DashboardComponent,
    canActivate:[AuthGuard]

  },
  {
    path:'gestionRole',
    component: GestionRoleComponent
  },
  {
    path:'side',
    component:SidebarComponent, canActivate:[AuthGuard]
  },
  {path:'user', component:GestionUserComponent},
  {
    path:'**',
    component:LoginComponent
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
