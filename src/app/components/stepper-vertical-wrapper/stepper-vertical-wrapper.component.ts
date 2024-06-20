import { Component, OnInit } from '@angular/core';
import {FieldType} from "@ngx-formly/core";

@Component({
  selector: 'app-stepper-vertical-wrapper',
  template: `
      <mat-vertical-stepper [linear]="true" #stepper>
      <ng-container *ngFor="let step of field.fieldGroup; let index = index">
        <mat-step [label]="step.templateOptions.label">
          <ng-template matStepLabel>{{ step.templateOptions.label }}</ng-template>
          <div>
            <ng-container #fieldComponent></ng-container>
            <formly-field *ngFor="let field of step.fieldGroup" [field]="field" [options]="options"></formly-field>
          </div>
          <div style="margin-top: 3rem;">
            <button mat-button matStepperPrevious *ngIf="index > 0">Back</button>
            <button mat-button matStepperNext *ngIf="index < field.fieldGroup.length - 1">Next</button>
            <button mat-button *ngIf="index === field.fieldGroup.length - 1" (click)="onComplete()">Finish</button>
          </div>
        </mat-step>
      </ng-container>
    </mat-vertical-stepper>
 `,
})
export class StepperVerticalWrapperComponent extends FieldType implements OnInit {

  ngOnInit(): void {
    console.log("im in stepper,", this.field );
  }

  onComplete(): void {
    console.log('Stepper completed!');
  }

}

