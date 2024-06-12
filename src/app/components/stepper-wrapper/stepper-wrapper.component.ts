import { filter } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-stepper-wrapper',
  template: `
    <mat-horizontal-stepper [linear]="true" #stepper>
      <mat-step *ngFor="let step of field.fieldGroup; let index = index" [label]="step.templateOptions.label">
        <ng-template matStepLabel>{{ step.templateOptions.label }}</ng-template>
        <div cdkDropList class="stepper-content" (cdkDropListDropped)="drop($event, step)">
          <ng-container *ngFor="let subField of step.fieldGroup; let j = index">
            <formly-field [field]="subField" cdkDrag></formly-field>
          </ng-container>
        </div>
        <div style="margin-top: 3rem;">
          <button mat-button matStepperPrevious *ngIf="index > 0">Back</button>
          <button mat-button matStepperNext *ngIf="index < field.fieldGroup.length - 1">Next</button>
          <button mat-button *ngIf="index === field.fieldGroup.length - 1" (click)="onComplete()">Finish</button>
        </div>
      </mat-step>
    </mat-horizontal-stepper>
  `,
})
export class StepperWrapperComponent extends FieldType implements OnInit {
  ngOnInit(): void {
    console.log("im in stepper,", this.field);
  }

  onComplete(): void {
    console.log('Stepper completed!');
  }

  drop(event: CdkDragDrop<FormlyFieldConfig[]>, step: FormlyFieldConfig): void {
    moveItemInArray(step.fieldGroup, event.previousIndex, event.currentIndex);
  }
}
