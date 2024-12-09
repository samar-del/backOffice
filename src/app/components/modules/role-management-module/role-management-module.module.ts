import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import { RoleUpdateComponent } from './role-update/role-update.component';
import {MatSelectModule} from '@angular/material/select';



@NgModule({
  declarations: [ RoleUpdateComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule
  ]
})
export class RoleManagementModuleModule { }
