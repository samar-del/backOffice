import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { ListFormsComponent } from '../forms-management-module/list-forms/list-forms.component';
import { RolePageComponent } from './role-page/role-page.component';


const routes: Routes = [
  { path: '', component: ListFormsComponent },
  { path: 'role', component: RolePageComponent },
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class RoleRoutingModule { }
