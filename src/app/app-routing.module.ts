import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './Modules/user/component/login/login.component';
import { SignupComponent } from './Modules/user/component/signup/signup.component';
import { ContentComponent } from './components/content/content.component';
import { ForgotPasswordComponent } from './Modules/user/component/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './Modules/user/component/reset-password/reset-password.component';
import { DashboardComponent } from './Modules/user/component/dashboard/dashboard.component';
import { AuthGuard } from './Modules/user/services/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { ListFormsComponent } from './components/modules/forms-management-module/list-forms/list-forms.component';
import { SidebarComponent } from './components/modules/forms-management-module/sidebar/sidebar.component';
import { GestionPermissionComponent } from './components/modules/permession-management-module/PermissionPage/gestion-permission.component';
import { GestionRoleComponent } from './components/modules/role-management-module/gestion-role/gestion-role.component';
import { RolePageComponent } from './components/modules/role-management-module/role-page/role-page.component';
import { UserPageComponent } from './components/modules/user-management-module/user-page/user-page.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'permission',
    component: GestionPermissionComponent,
  },
  {
    path: 'role',
    component: RolePageComponent
  },
  {
    path: '',
    redirectTo: 'content',
    pathMatch: 'full',
  },

  {
    path: 'content',
    component: ContentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'forgotPassword',
    component: ForgotPasswordComponent,
  },
  { path: 'resetpassword/:token', component: ResetPasswordComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'gestionRole',
    component: GestionRoleComponent,
  },

  { path: 'user', component: UserPageComponent, canActivate: [AuthGuard] },

  {
    path: 'formsManagement',
    loadChildren: () =>
      import(
        './components/modules/forms-management-module/forms-management-module.module'
      ).then((m) => m.FormsManagementModuleModule),
  },
  {
    path: 'userManagement',
    loadChildren: () =>
      import(
        './components/modules/user-management-module/user-management-module.module'
      ).then((m) => m.UserManagementModuleModule)
  },
  {
    path: 'admin',
    component: HomeComponent,

    children: [
      {
        path: 'formsManagement',
        loadChildren: () =>
          import(
            './components/modules/forms-management-module/forms-management-module.module'
          ).then((m) => m.FormsManagementModuleModule)
      },
      {
        path: 'userManagement',
        loadChildren: () =>
          import(
            './components/modules/user-management-module/user-management-module.module'
          ).then((m) => m.UserManagementModuleModule)
      },
      {
        path: 'roleManagement',
        loadChildren: () =>
          import(
            './components/modules/role-management-module/role-management-module.module'
          ).then((m) => m.RoleManagementModuleModule)
      },
      {
        path: 'permissionManagement',
        loadChildren: () =>
          import(
            './components/modules/permession-management-module/permession-management-module.module'
          ).then((m) => m.PermessionManagementModuleModule)
      }
    ]
  },

  // {path: 'home' , component: HomeComponent,
  //   children: [
  //     {path: 'createForm' , component: SidebarComponent}
  //   ]
  // },
  {path: 'createForm' , component: SidebarComponent, canActivate: [AuthGuard]},
  {path: '' , component: ListFormsComponent},
  {
    path: '**',
    component: LoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
