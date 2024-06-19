import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { ListFormsComponent } from '../forms-management-module/list-forms/list-forms.component';
import { UserPageComponent } from './user-page/user-page.component';



const routes: Routes = [
  { path: 'user', component: UserPageComponent },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class UserRoutingModule { }
