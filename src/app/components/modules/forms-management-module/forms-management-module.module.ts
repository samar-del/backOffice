import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SidebarComponent} from './sidebar/sidebar.component';
import {FormsRoutingModule} from './forms-routing.module';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {ContentComponent} from '../../content/content.component';
import {ReactiveFormsModule} from '@angular/forms';
import {FormlyModule} from '@ngx-formly/core';
import {ListFormsComponent} from './list-forms/list-forms.component';
import {FormPreviewCreationComponent} from '../../form-preview-creation/form-preview-creation.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {UpdateFormComponent} from "./update-form/update-form.component";
import {MatButtonModule} from "@angular/material/button";



@NgModule({
    declarations: [
        SidebarComponent,
        ContentComponent,
        ListFormsComponent,
        FormPreviewCreationComponent,
        UpdateFormComponent,
    ],
  imports: [
    CommonModule,
    FormsRoutingModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    ReactiveFormsModule,
    FormlyModule,
    DragDropModule,
    MatPaginatorModule,
    MatTableModule,
    MatButtonModule,
  ]
})
export class FormsManagementModuleModule { }
