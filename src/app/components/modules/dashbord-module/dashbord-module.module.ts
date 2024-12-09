import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DashbordRoutingModule} from './dashbord-routing.module';
import { DashbordComponentComponent } from './dashbord-component/dashbord-component.component';



@NgModule({
  declarations: [ DashbordComponentComponent],
  imports: [
    CommonModule,
    DashbordRoutingModule
  ]
})
export class DashbordModuleModule { }
