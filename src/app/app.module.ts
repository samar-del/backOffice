import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {SidebarComponent} from "./components/sidebar/sidebar.component";
import {MenuItemComponent} from "./components/menu-item/menu-item.component";
import {FormDialogComponent} from "./components/fields-dialog/form-dialog/form-dialog.component";
import {ToolbarComponent} from "./components/toolbar/toolbar.component";
import {ContentComponent} from "./components/content/content.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
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
import { SignupComponent } from './Modules/user/component/signup/signup.component';
import { LoginComponent } from './Modules/user/component/login/login.component';
import { ForgotPasswordComponent } from './Modules/user/component/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './Modules/user/component/reset-password/reset-password.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { AddressWrapperComponent } from './components/address-wrapper/address-wrapper.component';
import { ColumnSizeComponent } from './components/column-size/column-size.component';
import { ColumnWrapperComponent } from './components/column-wrapper/column-wrapper.component';
import { FormlyFieldFileComponent } from './components/fields-dialog/formly-field-file/formly-field-file.component';
import { FormlyFieldHtmlComponent } from './components/formly-field-html/formly-field-html.component';
import { FormlyFieldIframeComponent } from './components/formly-field-iframe/formly-field-iframe.component';
import { PanelFieldWrapperComponent } from './components/panel-field-wrapper/panel-field-wrapper.component';
import { RowWrapperComponent } from './components/row-wrapper/row-wrapper.component';
import { TableWrapperComponent } from './components/table-wrapper/table-wrapper.component';
import { CommonModule } from '@angular/common';
import { FormlyMaterialModule } from '@ngx-formly/material';
//import { GoogleLoginProvider } from 'angularx-social-login';


@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
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
    DateFormDialogComponent
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
        { name: 'table', component: TableWrapperComponent, wrappers: ['form-field'] },
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
    ReactiveFormsModule,
    CommonModule,
    FormlyMaterialModule
  ],
  providers: [
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
