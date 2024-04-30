import {Component, OnInit, ViewChild} from '@angular/core';
import {FieldWrapper, FormlyFieldConfig} from '@ngx-formly/core';
import {ShareService} from '../../services/share.service';

@Component({
  selector: 'app-address-wrapper',
  templateUrl: './address-wrapper.component.html',
  styleUrls: ['./address-wrapper.component.css']
})
export class AddressWrapperComponent extends FieldWrapper {
  fields: FormlyFieldConfig[] = [];
  options: any = {};
  form: any;
  @ViewChild('formlyForm') formlyForm: any;
  addressValue = [{label: '', placeholder: ''}];

  constructor(private shareS: ShareService) {
    super();
    this.shareS.addressOptions.subscribe(data => {
      this.addressValue = data;
    });
    this.addressValue.forEach(add => {
      const newField: FormlyFieldConfig = {
        type: 'input',
        key: add.label,
        templateOptions: {
          label: add.label,
          type: 'text',
          placeholder: add.placeholder,
        },
        expressionProperties: {
          'templateOptions.errorState': (model: any, formState: any) => {
            // Check the length constraints and set error state accordingly
            const value = model[add.label];
            if (value === undefined || value === null) {
              return false; // Value is not defined or null, so no error state
            }
          },
        },
      };
      this.fields.push(newField);
    });

    console.log(this.fields);
  }
}
