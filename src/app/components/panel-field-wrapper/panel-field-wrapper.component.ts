import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FieldWrapper, FormlyFieldConfig } from '@ngx-formly/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ShareService } from 'src/app/services/share.service';

@Component({
  selector: 'app-panel-field-wrapper',
  template: `
    <div class="card" [ngClass]="theme" [ngClass]="{ 'collapsed': collapsible && isCollapsed }">
      <h3 class="card-header" [ngClass]="theme" (click)="toggleCollapse()" *ngIf="!hideHeader">{{ to.label }}</h3>
      <div class="card-body" *ngIf="!collapsible || !isCollapsed">
          <ng-container *ngFor="let field of fields">
              <formly-field [field]="field"></formly-field>
          </ng-container>
      </div>
    </div>
  `,
})
export class PanelFieldWrapperComponent extends FieldWrapper implements OnInit {
  @Input() theme: string = 'default';
  @Input() collapsible: boolean = false;
  @Input() initiallyCollapsed: boolean = false;
  @Input() hideHeader: boolean = false;

  @ViewChild('formlyForm') formlyForm: any;


  isCollapsed: boolean = false;

  constructor(private fb: FormBuilder, private shareS: ShareService) {
    super();
  }

  ngOnInit() {
    this.isCollapsed = this.initiallyCollapsed;
  }

  toggleCollapse() {
    if (this.collapsible) {
      this.isCollapsed = !this.isCollapsed;
    }
  }
}
