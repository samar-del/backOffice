import { Component, Input } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-table-wrapper',
  template: `
    <div class="table-layout-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th *ngFor="let column of to.columns">{{ column }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td *ngFor="let f of field.fieldGroup" [ngClass]="f.className">
              <formly-field [field]="f"></formly-field>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
export class TableWrapperComponent extends FieldType {
  @Input() to: any; // Access the field's template options
  @Input() field: FormlyFieldConfig; // Access the field configuration

  get tableField(): FormlyFieldConfig {
    return this.field as FormlyFieldConfig;
  }
}
