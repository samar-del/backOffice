import {Component, OnInit, ViewChild} from '@angular/core';
import {FieldArrayType, FieldType, FieldWrapper, FormlyFieldConfig, FormlyFormBuilder} from '@ngx-formly/core';
import {Subscription} from 'rxjs';
import {FormBuilder} from '@angular/forms';
import {ContentComponent} from '../content/content.component';
import {ShareService} from '../../services/share.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-column-size',
  templateUrl: './column-size.component.html',
  styleUrls: ['./column-size.component.css']
})
export class ColumnSizeComponent extends FieldWrapper {

  fields: FormlyFieldConfig[] = [];
  options: any = {};
  form: any;
  @ViewChild('formlyForm') formlyForm: any;
  columns = [{size: '', width: ''}];
  columnsSubjectBehavior = [{}];
  subscription: Subscription;
  contentComponent: ContentComponent;
  constructor( private shareService: ShareService) {
    super();
    console.log("im here");

    this.subscription = this.shareService.currentNomberOfColumns.subscribe(data => this.columns = data);
  }
  // tslint:disable-next-line:typedef
  onDrop(event: any) {
    if (event.previousContainer !== event.container) {
      const field = {...event.item.data};
      this.contentComponent.addField(field, event.currentIndex);
     // this.field.fieldArray.push(this.contentComponent.addField(field));
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}

