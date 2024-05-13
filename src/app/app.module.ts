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
import { MatTabsModule} from "@angular/material/tabs";
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
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatOptionModule} from "@angular/material/core";
import { AddressWrapperComponent } from './components/address-wrapper/address-wrapper.component';
import { FormTableComponent } from './components/fields-dialog/form-table/form-table.component';
import { TableWrapperComponent } from './components/table-wrapper/table-wrapper.component';
import { PanelDialogComponent } from './components/fields-dialog/panel-dialog/panel-dialog.component';
import { PanelFieldWrapperComponent } from './components/panel-field-wrapper/panel-field-wrapper.component';
import { HtmlDialogComponent } from './components/fields-dialog/html-dialog/html-dialog.component';
import { FormlyFieldHtmlComponent } from './components/formly-field-html/formly-field-html.component';
import { IFrameDialogComponent } from './components/fields-dialog/i-frame-dialog/i-frame-dialog.component';
import { FormlyFieldIframeComponent } from './components/formly-field-iframe/formly-field-iframe.component';
import { SafeUrlPipe } from './safe-url.pipe';
import { CommonModule } from '@angular/common';
import { GestionPermissionComponent } from './components/userComponent/gestion-permission/gestion-permission.component';
import { ToastrModule } from 'ngx-toastr';
import { GestionRoleComponent } from './components/userComponent/gestion-role/gestion-role.component';
import { ConfirmationDialogComponent } from './components/userComponent/confirmation-dialog/confirmation-dialog.component';


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
    PanelDialogComponent,
    PanelFieldWrapperComponent,
    HtmlDialogComponent,
    FormlyFieldHtmlComponent,
    IFrameDialogComponent,
    FormlyFieldIframeComponent,
    SafeUrlPipe,
    ConfirmationDialogComponent,
    GestionPermissionComponent,
    GestionRoleComponent
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
                 {name: 'html', component: FormlyFieldHtmlComponent},
                 {name: 'iframe', component: FormlyFieldIframeComponent},
                 { name: 'address-wrapper', component: AddressWrapperComponent },
                 { name: 'table', component: TableWrapperComponent },

      ],
      types: [
        { name: 'column', extends: 'formly-group', wrappers: ['form-field'], defaultOptions: { templateOptions: { column: true } } },
        { name: 'columnSize', component: ColumnSizeComponent },
        { name: 'file', component: FormlyFieldFileComponent, wrappers: ['form-field'] },
        { name: 'table', component: TableWrapperComponent },
        { name: 'panel', component: PanelFieldWrapperComponent },
         {name: 'html', component: FormlyFieldHtmlComponent, wrappers: ['form-field']},
        {name: 'iframe', component: FormlyFieldIframeComponent, wrappers: ['form-field']},

      ],
    }),
    FormlyModule.forChild({
      wrappers: [{name: 'row', component: RowWrapperComponent}],
      types: [
        {
          name: 'row',
          extends: 'formly-group',
          wrappers: ['form-field'],
          defaultOptions: {templateOptions: {row: true}}
        },
      ],
    }),
    FormlyBootstrapModule,
    MatTabsModule,
    MatDialogModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    CommonModule,
    ToastrModule.forRoot()

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
