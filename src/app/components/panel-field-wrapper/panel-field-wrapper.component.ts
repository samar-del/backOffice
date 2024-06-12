import { Component, Input, OnInit } from '@angular/core';
import { FieldWrapper, FormlyFieldConfig } from '@ngx-formly/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ShareService } from 'src/app/services/share.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-panel-field-wrapper',
  template: `
    <div class="card" [ngClass]="theme" [ngClass]="{ 'collapsed': collapsible && isCollapsed }">
      <h3 class="card-header" [ngClass]="theme" (click)="toggleCollapse()" *ngIf="!hideHeader">{{ to.label }}</h3>
      <div cdkDropList class="card-body" *ngIf="!collapsible || !isCollapsed" (cdkDropListDropped)="drop($event)">
          <ng-container *ngFor="let field of field.fieldGroup">
              <formly-field [field]="field" cdkDrag cdkDragPreview></formly-field>
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
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.field.fieldGroup, event.previousIndex, event.currentIndex);
  }
}
