import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ListFormsComponent } from '../forms-management-module/list-forms/list-forms.component';
import { DashbordComponentComponent } from './dashbord-component/dashbord-component.component';



const routes: Routes = [
  { path: '', component: ListFormsComponent },
  { path: 'dashboard', component: DashbordComponentComponent },
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class DashbordRoutingModule { }
