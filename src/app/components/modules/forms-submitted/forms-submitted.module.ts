import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsSubmittedRoutingModule } from './forms-submitted-routing.module';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import { FormsListComponent } from './forms-list/forms-list.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import {MatListModule} from '@angular/material/list';
import { FormSubmittedContentComponent } from './form-submitted-content/form-submitted-content.component';
import {ReactiveFormsModule} from '@angular/forms';
import {FormlyModule} from '@ngx-formly/core';
import {MatCardModule} from '@angular/material/card';
import { ValidationDialogComponent } from './dialog/validation-dialog/validation-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";


// @ts-ignore
@NgModule({
  declarations: [FormsListComponent, FormSubmittedContentComponent, ValidationDialogComponent],
  imports: [
    CommonModule,
    FormsSubmittedRoutingModule,
    MatPaginatorModule,
    MatTableModule,
    MatListModule,
    MatIconModule,
    RouterModule.forChild([]),
    HttpClientModule,
    ReactiveFormsModule,
    FormlyModule,
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
  ]
})
export class FormsSubmittedModule { }
