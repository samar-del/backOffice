import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { ListFormsComponent } from '../forms-management-module/list-forms/list-forms.component';
import { RolePageComponent } from '../role-management-module/role-page/role-page.component';
import { GestionPermissionComponent } from './PermissionPage/gestion-permission.component';


const routes: Routes = [
  { path: '', component: ListFormsComponent },
  { path: 'role', component: GestionPermissionComponent },
];



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class PermessionRoutingModule { }
