import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FormsListComponent} from './forms-list/forms-list.component';

const routes: Routes = [
  { path: 'formsList', component: FormsListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormsSubmittedRoutingModule { }
