import { MatTabBody, MatTabBodyPortal, MatTabsModule, _MatTabBodyBase } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {SidebarComponent} from "./components/sidebar/sidebar.component";
import {MenuItemComponent} from "./components/menu-item/menu-item.component";
import {FormDialogComponent} from "./components/fields-dialog/form-dialog/form-dialog.component";
import {ToolbarComponent} from "./components/toolbar/toolbar.component";
import {ContentComponent} from "./components/content/content.component";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatToolbarModule} from "@angular/material/toolbar";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {FormlyModule} from "@ngx-formly/core";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FormDialogCheckboxComponent } from './components/fields-dialog/form-dialog-checkbox/form-dialog-checkbox.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RadioCustomizeDialogComponent} from './components/fields-dialog/radio-customize-dialog/radio-customize-dialog.component';
import {HttpClientModule} from '@angular/common/http';
import { SelectCustomizeDialogComponent } from './components/fields-dialog/select-customize-dialog/select-customize-dialog.component';
import { TelFormDialogComponent } from './components/fields-dialog/tel-form-dialog/tel-form-dialog.component';
import { DateFormDialogComponent } from './components/fields-dialog/date-form-dialog/date-form-dialog.component';
import { AddressCustomizeDialogComponent } from './components/fields-dialog/address-customize-dialog/address-customize-dialog.component';

import { FormPreviewComponent } from './components/form-preview/form-preview.component';
import { FormColumnLayoutDialogComponent } from './components/fields-dialog/form-column-layout-dialog/form-column-layout-dialog.component';
import { ColumnWrapperComponent } from './components/column-wrapper/column-wrapper.component';
import { RowWrapperComponent } from './components/row-wrapper/row-wrapper.component';
import { ColumnSizeComponent } from './components/column-size/column-size.component';
import { ListFormsComponent } from './components/list-forms/list-forms.component';
import { HomeComponent } from './components/home/home.component';
import {FormlyFieldFileComponent} from './components/fields-dialog/formly-field-file/formly-field-file.component';
import {FileValueAccessorDirective} from './file-value-accessor.directive';
import { AddressWrapperComponent } from './components/address-wrapper/address-wrapper.component';
import { FormTableComponent } from './components/fields-dialog/form-table/form-table.component';
import { TableWrapperComponent } from './components/table-wrapper/table-wrapper.component';
import { TabsWrapperComponent } from './components/tabs-wrapper/tabs-wrapper.component';
import { TabsDialogComponent } from './components/fields-dialog/tabs-dialog/tabs-dialog.component';
import { WellDialogComponent } from './components/fields-dialog/well-dialog/well-dialog.component';
import { WellWrapperComponent } from './components/well-wrapper/well-wrapper.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    MenuItemComponent,
    ContentComponent,
    ToolbarComponent,
    FormDialogComponent,
    RadioCustomizeDialogComponent,
    SelectCustomizeDialogComponent,
    FormDialogCheckboxComponent,
    RadioCustomizeDialogComponent,
    TelFormDialogComponent,
    DateFormDialogComponent,
    AddressCustomizeDialogComponent,
    FormPreviewComponent,
    FormColumnLayoutDialogComponent,
    ColumnWrapperComponent,
    RowWrapperComponent,
    ColumnSizeComponent,
    ListFormsComponent,
    HomeComponent,
    FormlyFieldFileComponent,
    FileValueAccessorDirective,
    AddressWrapperComponent,
    FormTableComponent,
    TableWrapperComponent,
    TabsWrapperComponent,
    TabsDialogComponent,
    WellDialogComponent,
    WellWrapperComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    DragDropModule,
    ReactiveFormsModule,
    FormlyModule.forRoot({
      wrappers: [{ name: 'column', component: ColumnWrapperComponent },  { name: 'columnSize', component: ColumnSizeComponent },
        { name: 'address-wrapper', component: AddressWrapperComponent },
        { name: 'table', component: TableWrapperComponent },
        { name: 'tabs', component: TabsWrapperComponent },
        { name: 'card', component: WellWrapperComponent }
      ],
      types: [
        { name: 'column', extends: 'formly-group', wrappers: ['form-field'], defaultOptions: { templateOptions: { column: true } } },
        { name: 'columnSize', component: ColumnSizeComponent },
        { name: 'file', component: FormlyFieldFileComponent, wrappers: ['form-field'] },
        {
          name: 'table',
          component: TableWrapperComponent         },
          { name: 'tabs', component: TabsWrapperComponent },
          { name: 'card', component: WellWrapperComponent, wrappers: ['form-field'], defaultOptions: { templateOptions: { well: true } } }

      ],
    }),
    FormlyModule.forChild({
      wrappers: [{ name: 'row', component: RowWrapperComponent }],
      types: [
        { name: 'row', extends: 'formly-group', wrappers: ['form-field'], defaultOptions: { templateOptions: { row: true } } },
      ],
    }),
    FormlyBootstrapModule,
    MatDialogModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    MatTabsModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
