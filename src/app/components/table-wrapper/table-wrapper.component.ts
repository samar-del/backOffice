import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-table-wrapper',
  template: `
    <div class="table-responsive">
      <table class="table">
        <thead>
          <tr>
            <!-- Entêtes des colonnes -->
            <th *ngFor="let header of headers">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <!-- Itération sur les lignes -->
          <tr *ngFor="let row of rows">
            <!-- Itération sur les colonnes -->
            <td *ngFor="let cell of row">{{ cell }}</td>
          </tr>
        </tbody>
      </table>
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
