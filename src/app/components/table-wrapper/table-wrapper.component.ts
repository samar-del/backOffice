import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-table-wrapper',
  template: `
  <div class="container">
  <div class="row">
    <div class="col-sm">
      One of three columns
    </div>
    <div class="col-sm">
      One of three columns
    </div>
    <div class="col-sm">
      One of three columns
    </div>
  </div>
</div>
  `,
})
export class TableWrapperComponent {
  @Input() tableData: any;

  get headers(): string[] {
    // Retourne les en-têtes des colonnes
    return this.tableData?.components[0]?.rows[0]?.map(() => 'Column');
  }

  get rows(): any[] {
    // Retourne les données des lignes
    return this.tableData?.components[0]?.rows;
  }
}
