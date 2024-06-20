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



@NgModule({
  declarations: [
    SidebarComponent,
    ContentComponent,
    ListFormsComponent,
    FormPreviewCreationComponent,
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
  ]
})
export class FormsManagementModuleModule { }
