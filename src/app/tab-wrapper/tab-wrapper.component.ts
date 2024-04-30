import { Component } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { FieldType, FieldWrapper, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-tab-wrapper',
  styleUrls: ['./tab-wrapper.component.css'],
  template: `
  <mat-tab-group>
    <mat-tab
      *ngFor="let tab of field.fieldGroup; let i = index; let last = last"
      [label]="tab.props.label"
      [disabled]="i !== 0 && !isValid(field.fieldGroup[i - 1])"
    >
      <div [ngClass]="'col-' + to.size + '-' + to.width + ' column-wrapper'">
        <ng-container #fieldComponent></ng-container>
      </div>
    </mat-tab>
  </mat-tab-group>
`,
})
export class TabWrapperComponent  extends FieldType{
  isValid(field: FormlyFieldConfig): boolean {
    if (field.key) {
      return field.formControl.valid;
    }

    return field.fieldGroup ? field.fieldGroup.every((f) => this.isValid(f)) : true;
  }
}

