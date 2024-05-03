import { ContentComponent } from './../content/content.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FieldWrapper, FormlyFieldConfig } from '@ngx-formly/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormBuilder } from '@angular/forms';
import { ShareService } from 'src/app/services/share.service';

@Component({
  selector: 'app-panel-field-wrapper',
  template: `
    <div class="card" (dragover)="onDragOver($event)" (dragleave)="onDragLeave($event)" (cdkDropListDropped)="drop($event)">
      <h3 class="card-header">{{ to.label }}</h3>
      <div class="card-body">
        <ng-container *ngFor="let field of fields">
          <formly-field [field]="field"></formly-field>
        </ng-container>
      </div>
    </div>
  `,
})
export class PanelFieldWrapperComponent extends FieldWrapper implements OnInit {
  @ViewChild('fieldComponent') fieldComponent: any;

  fields: FormlyFieldConfig[] = [];
  constructor(private fb: FormBuilder , private  contentComponent: ContentComponent, private shareS: ShareService) {
    super();

  }
  ngOnInit() {
    // Initialize any necessary properties or subscriptions
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
      this.addFieldTopanel(droppedItem, event.currentIndex);
    }

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }

  private addFieldTopanel(droppedItem: string, position: number) {

    if (droppedItem === 'input') {
      this.contentComponent.addField('input', position);
    } else if (droppedItem === 'radio') {
      this.contentComponent.addField('radio', position);
    } else if (droppedItem === 'checkbox') {
      this.contentComponent.addField('checkbox', position);
    } else if (droppedItem === 'button') {
      this.contentComponent.addField('button', position);
    } else if (droppedItem === 'select') {
      this.contentComponent.addField('select', position);

      // Ensure the form is updated with new fields
      this.form = this.fieldComponent.form;
    }}
}
