import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-table-wrapper',
  template: `
    <table class="table">
      <thead>
        <tr>
          <th *ngFor="let column of columns">{{ column }}</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let row of rows">
          <td *ngFor="let cell of row">{{ cell }}</td>
        </tr>
      </tbody>
    </table>
  `,
  styleUrls: ['./table-wrapper.component.css']
})
export class TableWrapperComponent {
  @Input() columns: string[];
  @Input() rows: any[];

  constructor() { }
}
