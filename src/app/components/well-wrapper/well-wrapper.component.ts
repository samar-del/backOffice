import { FieldType } from '@ngx-formly/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-well-wrapper',
  template: `
  <div class="card grey-background">
    <div class="card-body">
      <!-- Content goes here -->
    </div>
  </div>
  `,
  styles: [`
    .grey-background {
      background-color: #e0e0e0; /* Grey color */
    }
  `]
})
export class WellWrapperComponent extends FieldType {

  constructor() {
    super();
   }

}
