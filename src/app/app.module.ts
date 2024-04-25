import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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
import {MatTabsModule} from "@angular/material/tabs";
import {MatDialogModule} from "@angular/material/dialog";
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
import { FormTabsLayoutDialogComponent } from './components/fields-dialog/form-tabs-layout-dialog/form-tabs-layout-dialog.component';


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
    FormTabsLayoutDialogComponent
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
        MatTabsModule,
        FormlyBootstrapModule,
        FormlyModule.forRoot({
            wrappers: [{name: 'column', component: ColumnWrapperComponent}],
            types: [
                {
                    name: 'column',
                    extends: 'formly-group',
                    wrappers: ['form-field'],
                    defaultOptions: {templateOptions: {column: true}}
                },
                { name: 'tabs',
                  defaultOptions: {templateOptions: {tabs: true}}
                 }

            ],
            validationMessages: [{ name: 'required', message: 'This field is required' }],

        }
      ),
        FormlyModule.forChild({
            wrappers: [{name: 'row', component: RowWrapperComponent}],
            types: [
                {
                    name: 'row',
                    extends: 'formly-group',
                    wrappers: ['form-field'],
                    defaultOptions: {templateOptions: {row: true}}
                }
            ],
        }),
        FormlyBootstrapModule,
        MatTabsModule,
        MatDialogModule,
        NgbModule,
        HttpClientModule,
        FormsModule,

    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
