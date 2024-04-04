import { Component, OnInit } from '@angular/core';
import {FieldWrapper} from "@ngx-formly/core";

@Component({
  selector: 'app-column-wrapper',
  styleUrls: ['./column-wrapper.component.css'],
  template: `
      <div [ngClass]="'col-' + to.size + '-' + to.width + ' column-wrapper'">
        <ng-container #fieldComponent></ng-container>
      </div>
  `,
})
export class ColumnWrapperComponent extends FieldWrapper {}
