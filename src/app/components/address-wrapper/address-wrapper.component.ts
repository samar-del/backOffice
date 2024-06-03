import { Component, OnInit } from '@angular/core';
import { FieldWrapper, FormlyFieldConfig } from '@ngx-formly/core';
import { ShareService } from '../../services/share.service';

@Component({
  selector: 'app-address-wrapper',
  templateUrl: './address-wrapper.component.html',
  styleUrls: ['./address-wrapper.component.css']
})
export class AddressWrapperComponent extends FieldWrapper implements OnInit {
  fields: FormlyFieldConfig[] = [];

  constructor(private shareS: ShareService) {
    super();
  }

  ngOnInit(): void {
    this.shareS.addressOptions.subscribe(data => {
      this.initializeFields(data);
    });
  }

  initializeFields(addressValue: any[]) {
    this.fields = [];
    addressValue.forEach(add => {
      const newField: FormlyFieldConfig = {
        type: 'input',
        key: add.label_row,
        templateOptions: {
          label: add.label_row,
          type: 'text',
          placeholder: add.placeholder_row,
        },
        expressionProperties: {
          'templateOptions.errorState': (model: any) => {
            const value = model[add.label_row];
            return value === undefined || value === null;
          },
        },
      };
      this.fields.push(newField);
    });
    console.log(this.fields);
  }
}
