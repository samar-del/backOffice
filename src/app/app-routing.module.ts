import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './Modules/user/component/login/login.component';
import { SignupComponent } from './Modules/user/component/signup/signup.component';
import { ContentComponent } from './components/content/content.component';
import { ForgotPasswordComponent } from './Modules/user/component/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './Modules/user/component/reset-password/reset-password.component';
import {ListFormsComponent} from './components/list-forms/list-forms.component';
import {HomeComponent} from './components/home/home.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';
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
    redirectTo:'login',
    pathMatch:'full'
  },
  {
    path:'content',
    component: ContentComponent
  },
  {
    path:'forgotPassword',
    component:ForgotPasswordComponent
  },
  {path: "resetpassword/:token",
    component: ResetPasswordComponent
  },
  {
    path:'**',
    component:LoginComponent
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {path: 'listForms' , component: ListFormsComponent},
  {path: 'home' , component: HomeComponent},
  {path: 'createForm' , component: SidebarComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
