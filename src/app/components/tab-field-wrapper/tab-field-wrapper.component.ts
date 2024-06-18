import { Component, OnInit } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-tab-field-wrapper',
  template: `
    <mat-tab-group>
      <mat-tab *ngFor="let tab of field.fieldGroup; let i = index">
        <ng-template mat-tab-label>{{ tab.templateOptions.label }}</ng-template>
        <div cdkDropList [cdkDropListData]="tab.fieldGroup" (cdkDropListDropped)="drop($event, i)">
          <ng-container *ngFor="let subField of tab.fieldGroup; let j = index">
            <div cdkDrag [cdkDragData]="subField">
              <formly-field [field]="subField"></formly-field>
            </div>
          </ng-container>
        </div>
      </mat-tab>
    </mat-tab-group>
  `,
})
export class TabFieldWrapperComponent extends FieldType implements OnInit {
  ngOnInit(): void {
    console.log('im in tab,', this.field);
  }

  drop(event: CdkDragDrop<FormlyFieldConfig[]>, tabIndex: number) {
    moveItemInArray(this.field.fieldGroup[tabIndex].fieldGroup, event.previousIndex, event.currentIndex);
  }
}
