import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ListFormsComponent} from './components/list-forms/list-forms.component';
import {HomeComponent} from './components/home/home.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import { GestionRoleComponent } from './components/userComponent/gestion-role/gestion-role.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {path: 'listForms' , component: ListFormsComponent},
  {path: 'home' , component: HomeComponent},
  {path: 'createForm' , component: SidebarComponent},
  {path:'gestionRole', component: GestionRoleComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
