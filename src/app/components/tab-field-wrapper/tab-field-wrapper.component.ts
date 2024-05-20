import { Component, OnInit } from '@angular/core';
import {FieldType, FormlyFieldConfig } from "@ngx-formly/core";

@Component({
  selector: 'app-tab-field-wrapper',
  template: `
    <mat-tab-group>
      <mat-tab
        *ngFor="let tab of field.fieldGroup; let i = index; let last = last"
        [label]="tab.templateOptions.label">
        <formly-field [field]="tab"></formly-field>
      </mat-tab>
    </mat-tab-group>
  `,
})
export class TabFieldWrapperComponent extends FieldType implements OnInit{
  ngOnInit(): void {
    console.log("im in tab,", this.field );
  }

}
