import { Component, Input } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-table-wrapper',
  template: `
    <div class="table-layout-wrapper" cdkDropList (cdkDropListDropped)="drop($event)">
      <table class="table table-bordered">
        <tr *ngFor="let f of field.fieldGroup; let rowIndex = index" cdkDrag [ngClass]="f.className">
          <td *ngFor="let col of f.fieldGroup" cdkDrag [ngClass]="col.className">
            <formly-field [field]="col"></formly-field>
          </td>
        </tr>
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

  drop(event: CdkDragDrop<FormlyFieldConfig[]>): void {
    moveItemInArray(this.field.fieldGroup, event.previousIndex, event.currentIndex);
  }
}
