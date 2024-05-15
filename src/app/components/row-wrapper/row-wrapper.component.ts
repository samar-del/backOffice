import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'app-row-wrapper',
  template: `
    <div class="row">
      <ng-container *ngFor="let field of field.fieldGroup">
        <ng-container *ngx-formlyComponent="field"></ng-container>
      </ng-container>
    </div>
  `,
})
export class RowWrapperComponent extends FieldWrapper {}
