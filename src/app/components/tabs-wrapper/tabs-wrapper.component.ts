import { Component, Input } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-tabs-wrapper',
  template: `
  <div class="tab-layout-wrapper">
  <ul class="nav nav-tabs">
    <li *ngFor="let tab of field.templateOptions.tabs; let i = index"
        [ngClass]="{ 'active': i === selectedIndex }"
        (click)="selectedIndex = i">
      <a>{{ tab.label }}</a>
    </li>
  </ul>
  <div class="tab-content">
    <div *ngFor="let f of field.fieldGroup" [ngClass]="f.className" [hidden]="field.templateOptions.tabs[selectedIndex] !== f.templateOptions.tab">
      <formly-field [field]="f"></formly-field>
    </div>
  </div>
</div>

  `,
})
export class TabsWrapperComponent extends FieldType {
  @Input() to: any; // Access the field's template options
  @Input() field: FormlyFieldConfig; // Access the field configuration

  tabs: string[];
  selectedIndex: number = 0;

  get tabField(): FormlyFieldConfig {
    return this.field as FormlyFieldConfig;
  }



  selectTab(index: number) {
    this.selectedIndex = index;
  }

  getFieldsForTab(index: number): FormlyFieldConfig[] {
    return this.field.fieldGroup[index].fieldGroup;
  }
}
