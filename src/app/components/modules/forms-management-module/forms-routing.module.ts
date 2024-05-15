import { NgModule } from '@angular/core';
import {SidebarComponent} from './sidebar/sidebar.component';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  { path: 'createForm', component: SidebarComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormsRoutingModule { }
