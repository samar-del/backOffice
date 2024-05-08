import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-formly-field-iframe',
  template: `
    <iframe [src]="link_iframe | safeUrl" width="100%" height="100%" frameborder="0"></iframe>
  `,
})
export class FormlyFieldIframeComponent {
  @Input() link_iframe: string;

  constructor() { }
}
