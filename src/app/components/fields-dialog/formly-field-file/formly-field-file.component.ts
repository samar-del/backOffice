import { Component } from '@angular/core';
import {FieldType} from '@ngx-formly/core';

@Component({
  selector: 'app-formly-field-file',
  template: `
    <input type="file" [formControl]="formControl" [formlyAttributes]="field">
  `,
  styleUrls: ['./formly-field-file.component.css']
})
export class FormlyFieldFileComponent extends FieldType {
}
