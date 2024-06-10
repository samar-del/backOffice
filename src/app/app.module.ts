import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuItemComponent } from './components/menu-item/menu-item.component';
import { FormDialogComponent } from './components/fields-dialog/form-dialog/form-dialog.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormDialogCheckboxComponent } from './components/fields-dialog/form-dialog-checkbox/form-dialog-checkbox.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RadioCustomizeDialogComponent} from './components/fields-dialog/radio-customize-dialog/radio-customize-dialog.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { SelectCustomizeDialogComponent } from './components/fields-dialog/select-customize-dialog/select-customize-dialog.component';
import { TelFormDialogComponent } from './components/fields-dialog/tel-form-dialog/tel-form-dialog.component';
import { DateFormDialogComponent } from './components/fields-dialog/date-form-dialog/date-form-dialog.component';
import { AddressCustomizeDialogComponent } from './components/fields-dialog/address-customize-dialog/address-customize-dialog.component';
import { FormPreviewComponent } from './components/form-preview/form-preview.component';
import { FormColumnLayoutDialogComponent } from './components/fields-dialog/form-column-layout-dialog/form-column-layout-dialog.component';
import { ColumnWrapperComponent } from './components/column-wrapper/column-wrapper.component';
import { RowWrapperComponent } from './components/row-wrapper/row-wrapper.component';
import { ColumnSizeComponent } from './components/column-size/column-size.component';
import { ListFormsComponent } from './components/modules/forms-management-module/list-forms/list-forms.component';
import { HomeComponent } from './components/home/home.component';
import {FormlyFieldFileComponent} from './components/fields-dialog/formly-field-file/formly-field-file.component';
import {FileValueAccessorDirective} from './file-value-accessor.directive';

import {MatOptionModule} from '@angular/material/core';
import { AddressWrapperComponent } from './components/address-wrapper/address-wrapper.component';
import { FormPreviewCreationComponent } from './components/form-preview-creation/form-preview-creation.component';
import { FormTableComponent } from './components/fields-dialog/form-table/form-table.component';
import { TableWrapperComponent } from './components/table-wrapper/table-wrapper.component';
import { PanelDialogComponent } from './components/fields-dialog/panel-dialog/panel-dialog.component';
import { PanelFieldWrapperComponent } from './components/panel-field-wrapper/panel-field-wrapper.component';
import { HtmlDialogComponent } from './components/fields-dialog/html-dialog/html-dialog.component';
import { FormlyFieldHtmlComponent } from './components/formly-field-html/formly-field-html.component';
import { IFrameDialogComponent } from './components/fields-dialog/i-frame-dialog/i-frame-dialog.component';
import { FormlyFieldIframeComponent } from './components/formly-field-iframe/formly-field-iframe.component';
import { SafeUrlPipe } from './safe-url.pipe';
import { SidebarGenericComponent } from './components/dashbord/sidebar-generic/sidebar-generic.component';
import {MatMenuModule} from '@angular/material/menu';
import { SignupComponent } from './Modules/user/component/signup/signup.component';
import { LoginComponent } from './Modules/user/component/login/login.component';
import { ForgotPasswordComponent } from './Modules/user/component/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './Modules/user/component/reset-password/reset-password.component';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { GestionPermissionComponent } from './components/modules/permession-management-module/PermissionPage/gestion-permission.component';
import { GestionPermissionDialogComponent } from './components/modules/permession-management-module/gestion-permission-dialog/gestion-permission-dialog.component';
import { AdminPageComponent } from './components/modules/user-management-module/admin-page/admin-page.component';
import { GestionUserComponent } from './components/modules/user-management-module/gestion-user/gestion-user.component';
import { UpdateUserComponent } from './components/modules/user-management-module/update-user/update-user.component';
import { PermissionDialogAddComponent } from './components/modules/permession-management-module/permission-dialog-add/permission-dialog-add.component';
import { GestionRoleComponent } from './components/modules/role-management-module/gestion-role/gestion-role.component';
import { RolePageComponent } from './components/modules/role-management-module/role-page/role-page.component';
import { UserPageComponent } from './components/modules/user-management-module/user-page/user-page.component';
import { TabDialogComponent } from './components/fields-dialog/tab-dialog/tab-dialog.component';
import { TabFieldWrapperComponent } from './components/tab-field-wrapper/tab-field-wrapper.component';
import { AlertDialogComponent } from './components/fields-dialog/alert-dialog/alert-dialog.component';
import { DraggableComponent } from './components/draggable/draggable.component';
import { FormlyFieldPanelComponent } from './components/formly-field-panel/formly-field-panel.component';
import { StepperWrapperComponent } from './components/stepper-wrapper/stepper-wrapper.component';
import {MatStepperModule} from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { StepperDialogComponent } from './components/fields-dialog/stepper-dialog/stepper-dialog.component';
import { StepperVerticalWrapperComponent } from './components/stepper-vertical-wrapper/stepper-vertical-wrapper.component';
import { FormFileDialogComponent } from './components/fields-dialog/form-file-dialog/form-file-dialog.component';
import { JwtModule } from '@auth0/angular-jwt';
import { SelectMultipleDialogComponent } from './components/fields-dialog/select-multiple-dialog/select-multiple-dialog.component';




@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    MenuItemComponent,
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
    SidebarGenericComponent,
    DateFormDialogComponent,
    GestionUserComponent,
    GestionRoleComponent,
    GestionPermissionComponent,
    AdminPageComponent,
    UserPageComponent,
    PermissionDialogAddComponent,
    RolePageComponent,
    GestionPermissionDialogComponent,
    UpdateUserComponent,
    TabDialogComponent,
    TabFieldWrapperComponent,
    AlertDialogComponent,
    DraggableComponent,
    FormlyFieldPanelComponent,
    StepperWrapperComponent,
    StepperDialogComponent,
    StepperVerticalWrapperComponent,
    FormFileDialogComponent,
    SelectMultipleDialogComponent
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
            wrappers: [{name: 'column', component: ColumnWrapperComponent}, {
                name: 'columnSize',
                component: ColumnSizeComponent
            },
                {name: 'html', component: FormlyFieldHtmlComponent},
                {name: 'iframe', component: FormlyFieldIframeComponent},
                {name: 'address-wrapper', component: AddressWrapperComponent},
                {name: 'table', component: TableWrapperComponent},
                {name: 'tab', component: TabFieldWrapperComponent},
                { name: 'panel', component: PanelFieldWrapperComponent },
              {name: 'hr_stepper', component: StepperWrapperComponent},
              {name: 'vr_stepper', component: StepperVerticalWrapperComponent},
            ],
            types: [
                {
                    name: 'column',
                    extends: 'formly-group',
                    wrappers: ['form-field'],
                    defaultOptions: {templateOptions: {column: true}}
                },
                {name: 'columnSize', component: ColumnSizeComponent},
                {name: 'file', component: FormlyFieldFileComponent, wrappers: ['form-field']},
                {name: 'table', component: TableWrapperComponent, wrappers: ['form-field']},
                {name: 'panel', component: PanelFieldWrapperComponent, wrappers: ['form-field']},
                {name: 'html', component: FormlyFieldHtmlComponent, wrappers: ['form-field']},
                {name: 'iframe', component: FormlyFieldIframeComponent, wrappers: ['form-field']},
                {name: 'tab', component: TabFieldWrapperComponent, wrappers: ['form-field']},
              {name: 'address-wrapper', component: AddressWrapperComponent, wrappers: ['form-field']},
                {name: 'hr_stepper', component: StepperWrapperComponent, wrappers: ['form-field']},
              {name: 'vr_stepper', component: StepperVerticalWrapperComponent, wrappers: ['form-field']}
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
        MatMenuModule,
        FormsModule,
        CommonModule,
        ToastrModule.forRoot(),
        JwtModule.forRoot({
          config: {
            tokenGetter: () => {
              return localStorage.getItem('accessToken');
            },
          }
        }),
        MatDialogModule,
        MatTableModule,
        MatCardModule,
        MatPaginatorModule,
        MatStepperModule,
        MatIconModule,
        MatButtonModule,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
