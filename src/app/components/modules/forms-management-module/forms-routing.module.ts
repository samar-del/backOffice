import { NgModule } from '@angular/core';
import {SidebarComponent} from './sidebar/sidebar.component';
import {RouterModule, Routes} from '@angular/router';
import {ListFormsComponent} from './list-forms/list-forms.component';

const routes: Routes = [
  { path: '', component: ListFormsComponent },
  { path: 'createForm', component: SidebarComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormsRoutingModule { }
