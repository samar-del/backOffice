import { Component, Input } from '@angular/core';
import {FieldType} from "@ngx-formly/core";
import {ShareService} from "../../services/share.service";

@Component({
  selector: 'app-formly-field-iframe',
  template: `
    <iframe [src]="link_iframe | safeUrl" width="100%" height="100%" frameborder="0"></iframe>
  `,
})
export class FormlyFieldIframeComponent extends FieldType{
  link_iframe: string;

  constructor(private shareS: ShareService) {
    super();
    this.shareS.urlSource.subscribe(data => {
      this.link_iframe = data;
    });
  }
}
