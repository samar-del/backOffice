import { Component, OnInit } from '@angular/core';
import {FieldType} from "@ngx-formly/core";

@Component({
  selector: 'app-formly-field-html',
  template: `
    <div [innerHTML]="to.htmlElement"></div>
  `,
})
export class FormlyFieldHtmlComponent extends FieldType implements OnInit {
  ngOnInit() {
    console.log('HTML Element:', this.to.htmlElement);
  }
}
