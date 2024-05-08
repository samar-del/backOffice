import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FieldService } from 'src/app/services/field.service';
import { FormCreationService } from 'src/app/services/form-creation.service';
import { OptionsService } from 'src/app/services/options.service';
import { ShareService } from 'src/app/services/share.service';
import { TemplateOptionsService } from 'src/app/services/template-options.service';
import { ContentComponent } from '../content/content.component';

@Component({
  selector: 'app-well-wrapper',
  template: `
    <div class="card grey-background" (dragover)="onDragOver($event)" (drop)="onDrop($event)">
      <div class="card-body">
        <!-- Content goes here -->
        <!-- Display dropped fields here -->
        <ng-container *ngFor="let field of droppedFields">
          <formly-field [field]="field"></formly-field>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .grey-background {
      background-color: #e0e0e0; /* Grey color */
    }
  `]
})
export class WellWrapperComponent extends FieldType {
  droppedFields: any[] = [];
  containerDraggedOver = false;
  fields: FormlyFieldConfig[] = [];
  @ViewChild('formlyForm') formlyForm: any;

  categories: { name: string, fields: FormlyFieldConfig[] }[] = [
    { name: 'Category 1', fields: [] },
    { name: 'Category 2', fields: [] },

  ];
  constructor(private fb: FormBuilder, private newfb: FormBuilder, private dialog: MatDialog, private  formService: FormCreationService, private fieldService: FieldService,
    private optionService: OptionsService, private templateOptionsService: TemplateOptionsService,
    private shareService: ShareService, private contentComponent:ContentComponent) {
    super();
  }

  onDragOver(event: any) {
    event.preventDefault();
  }

  onDrop(event: CdkDragDrop<string[]>, droppedItem: string) {
    const position = this.calculatePosition(event);

    // Insert the dropped item at the calculated position
    this.addFieldToWell(droppedItem, position);


    this.containerDraggedOver = false;
  }

  calculatePosition(event: CdkDragDrop<string[]>): number {
 const offsetY = event.distance.y - event.container.element.nativeElement.getBoundingClientRect().top;
  const containerHeight = event.container.element.nativeElement.clientHeight;
    const totalSegments = this.fields.length + 1; // Total segments including existing fields
    const segmentHeight = containerHeight / totalSegments;
    const position = Math.floor(offsetY / segmentHeight);

    return position;
  }

  private addFieldToWell(droppedItem: string, position: number) {
    if (!this.contentComponent) {
      console.error('Content component is not initialized.');
      return;
    }
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
      this.form = this.formlyForm.form;
    }
  }

}
