import { Component, OnInit } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-tab-field-wrapper',
  template: `
    <mat-tab-group>
      <mat-tab
        *ngFor="let tab of field.fieldGroup; let i = index; let last = last"
        [label]="tab.templateOptions.label">
        <div cdkDropList (cdkDropListDropped)="drop($event)">
          <ng-container *ngFor="let subField of tab.fieldGroup; let j = index">
            <formly-field [field]="subField" cdkDrag cdkDragPreview></formly-field>
          </ng-container>
        </div>
      </mat-tab>
    </mat-tab-group>
  `,
})
export class TabFieldWrapperComponent extends FieldType implements OnInit {
  ngOnInit(): void {
    console.log("im in tab,", this.field);
  }

  drop(event: CdkDragDrop<FormlyFieldConfig[]>) {
    const tabIndex = this.field.fieldGroup.findIndex(tab => tab.fieldGroup.includes(event.item.data));
    if (tabIndex !== -1) {
      moveItemInArray(this.field.fieldGroup[tabIndex].fieldGroup, event.previousIndex, event.currentIndex);
    }
  }
}
