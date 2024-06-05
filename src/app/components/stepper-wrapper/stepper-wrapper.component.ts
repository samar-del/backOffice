import { Component, OnInit } from '@angular/core';
import {FieldType} from "@ngx-formly/core";
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

@Component({
  selector: 'app-stepper-wrapper',
  template: `
      <mat-horizontal-stepper [linear]="true" #stepper>
        <mat-step *ngFor="let step of field.fieldGroup; let index = index" [label]="step.templateOptions.label">
          <ng-template matStepLabel>{{ step.templateOptions.label }}</ng-template>
          <div class="stepper-content">
              <formly-field [field]="step"></formly-field>
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
    console.log("im in stepper,", this.field );
  }

  onComplete(): void {
    console.log('Stepper completed!');
  }

}
