import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ListFormsComponent} from './components/modules/forms-management-module/list-forms/list-forms.component';
import {HomeComponent} from './components/home/home.component';
import {SidebarComponent} from './components/modules/forms-management-module/sidebar/sidebar.component';

const routes: Routes = [
  {
    path: 'formsManagement',
    loadChildren: () => import('./components/modules/forms-management-module/forms-management-module.module')
      .then(m => m.FormsManagementModuleModule)
  },
  {
    path: 'admin',
    component: HomeComponent,
    children: [
      {
        path: 'formsManagement',
        loadChildren: () => import('./components/modules/forms-management-module/forms-management-module.module')
          .then(m => m.FormsManagementModuleModule)
      }
    ]
  },
  {path: 'listForms' , component: ListFormsComponent},
  // {path: 'home' , component: HomeComponent,
  //   children: [
  //     {path: 'createForm' , component: SidebarComponent}
  //   ]
  // },
  {path: 'createForm' , component: SidebarComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
