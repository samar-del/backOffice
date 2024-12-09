import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-draggable',
  template: `
    <div class="draggable" draggable="true" (dragstart)="onDragStart($event)">
      {{ field.templateOptions.label }}
    </div>
  `,
  styles: [
    `
      .draggable {
        padding: 8px;
        margin: 4px;
        border: 1px solid #ccc;
        cursor: grab;
      }
    `,
  ]
})
export class DraggableComponent  {

  @Input() field: any;

  // tslint:disable-next-line:typedef
  onDragStart(event: DragEvent) {
    event.dataTransfer?.setData('text/plain', JSON.stringify(this.field));
  }

}
