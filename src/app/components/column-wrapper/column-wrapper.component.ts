import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FieldType, FormlyField, FormlyFieldConfig} from '@ngx-formly/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {FormBuilder} from '@angular/forms';
import {ContentComponent} from '../content/content.component';

@Component({
  selector: 'app-column-wrapper',
  styleUrls: ['./column-wrapper.component.css'],
  template: `
    <div class="row"  (dragover)="onDragOver($event)" (dragleave)="onDragLeave($event)" (cdkDropListDropped)="drop($event)">
      <ng-container *ngFor="let columnSize of columns">
        <div class="col-{{columnSize.size}}-{{columnSize.width}}" >
          <formly-field></formly-field></div>
      </ng-container>
    </div>
  `,
})
export class ColumnWrapperComponent extends FieldType {
  fields: FormlyFieldConfig[] = [];
  options: any = {};
  form: any;
  @Input() columns ;
  @ViewChild('formlyForm') formlyForm: any;

 constructor(private fb: FormBuilder , private  contentComponent: ContentComponent) {
   super();
   console.log(this.columns);
   this.form = this.fb.group({});
 }
  onDragOver(event: DragEvent) {
    event.preventDefault(); // Allow drop by preventing default behavior
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault(); // Prevent default behavior to maintain drop zone
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const droppedItem = event.previousContainer.data[event.previousIndex];
      this.addFieldToColumn(droppedItem);
    }

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }

  // tslint:disable-next-line:typedef
  private addFieldToColumn(droppedItem: string) {
    if (!this.contentComponent) {
      console.error('Content component is not initialized.');
      return;
    }
    if (droppedItem === 'input') {
      this.contentComponent.addField('input');
    } else if (droppedItem === 'radio') {
      this.contentComponent.addField('radio');
    } else if (droppedItem === 'checkbox') {
      this.contentComponent.addField('checkbox');
    } else if (droppedItem === 'button') {
      this.contentComponent.addField('button');
    } else if (droppedItem === 'select') {
      this.contentComponent.addField('select');

      // Ensure the form is updated with new fields
      this.form = this.formlyForm.form;
    }
  }

}
