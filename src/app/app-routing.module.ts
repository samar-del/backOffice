import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './Modules/user/component/login/login.component';
import { SignupComponent } from './Modules/user/component/signup/signup.component';
import { ContentComponent } from './components/content/content.component';
import { ForgotPasswordComponent } from './Modules/user/component/forgot-password/forgot-password.component';

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
    path:'**',
    component:LoginComponent
  },
  {
    path:'reset',
    component:ForgotPasswordComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
