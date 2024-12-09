import { Component, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'app-formly-field-panel',
  templateUrl: './formly-field-panel.component.html',
  styleUrls: ['./formly-field-panel.component.css']
})
export class FormlyFieldPanelComponent extends FieldType {

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const fieldData = event.dataTransfer?.getData('field');
    if (fieldData) {
      const field = JSON.parse(fieldData);
      this.field.fieldGroup.push(field);
    }
  }

}
