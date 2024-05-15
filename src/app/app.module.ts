import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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
import {MatTabsModule} from "@angular/material/tabs";
import {MatDialogModule} from "@angular/material/dialog";
import {MatToolbarModule} from "@angular/material/toolbar";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {FormlyModule} from "@ngx-formly/core";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FormDialogCheckboxComponent } from './components/fields-dialog/form-dialog-checkbox/form-dialog-checkbox.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RadioCustomizeDialogComponent} from './components/fields-dialog/radio-customize-dialog/radio-customize-dialog.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { SelectCustomizeDialogComponent } from './components/fields-dialog/select-customize-dialog/select-customize-dialog.component';
import { TelFormDialogComponent } from './components/fields-dialog/tel-form-dialog/tel-form-dialog.component';
import { DateFormDialogComponent } from './components/fields-dialog/date-form-dialog/date-form-dialog.component';
import { SignupComponent } from './Modules/user/component/signup/signup.component';
import { LoginComponent } from './Modules/user/component/login/login.component';
import { ForgotPasswordComponent } from './Modules/user/component/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './Modules/user/component/reset-password/reset-password.component';
import { GestionUserComponent } from './Modules/Gestion/gestion-user/gestion-user.component';
import { GestionRoleComponent } from './Modules/Gestion/gestion-role/gestion-role.component';
import { GestionPermissionComponent } from './Modules/Gestion/gestion-permission/gestion-permission.component';
import { AdminPageComponent } from './Modules/Gestion/admin-page/admin-page.component';
import { UserPageComponent } from './Modules/Gestion/user-page/user-page.component';
import { SuperAdminPageComponent } from './Modules/Gestion/super-admin-page/super-admin-page.component';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';


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
    DateFormDialogComponent,
    GestionUserComponent,
    GestionRoleComponent,
    GestionPermissionComponent,
    AdminPageComponent,
    UserPageComponent,
    SuperAdminPageComponent
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
    FormlyModule.forRoot(),
    FormlyBootstrapModule,
    MatTabsModule,
    MatDialogModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    ToastrModule.forRoot(),
    MatDialogModule,
    MatTableModule,
    MatCardModule,
    MatPaginatorModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
