import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {FieldType} from '@ngx-formly/core';

@Component({
  selector: 'app-formly-field-file',
  template: `
    <input type="file" class="file-input"  [formControl]="formControl" [formlyAttributes]="field">
  `,
  styleUrls: ['./formly-field-file.component.css']
})
export class FormlyFieldFileComponent extends FieldType {

  constructor(private http: HttpClient) {
    super();
  }



}
