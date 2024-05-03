import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldType, FieldTypeConfig, FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'app-table-wrapper',
  template: `
    <table class="table">
      <thead>
        <tr>
          <th *ngFor="let header of headers">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let row of rows">
          <td *ngFor="let cell of row">{{ cell }}</td>
        </tr>
      </tbody>
    </table>
  `,
})
export class TableWrapperComponent extends FieldWrapper<FieldTypeConfig> {
  @Input() tableData: any;

  get headers(): string[] {
    // Return column headers
    return this.tableData?.components[0]?.rows[0] || [];
  }

  get rows(): any[] {
    // Return table rows excluding the header row
    return this.tableData?.components[0]?.rows.slice(1) || [];
  }
}
