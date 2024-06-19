import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {forkJoin} from 'rxjs';
import {FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FormContentService} from '../../../../services/form-content.service';
import {Options} from '../../../../models/Options';

@Component({
  selector: 'app-form-submitted-content',
  templateUrl: './form-submitted-content.component.html',
  styleUrls: ['./form-submitted-content.component.css']
})
export class FormSubmittedContentComponent implements OnInit {
  @ViewChild('formlyForm') formlyForm: any;
  model: any = {};
  form: FormGroup;
  fields: FormlyFieldConfig[] = [];
  options: FormlyFormOptions = {};
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private formService: FormContentService, private fb: FormBuilder) {
    this.form = this.fb.group({});
  }

  ngOnInit(): void {
    console.log(this.data);
    this.getFormTemplateById();
  }

  async getFormTemplateById() {
    try {
      const fieldsId = this.data.formStructure.fieldIds;
      if (!fieldsId || fieldsId.length === 0) {
        return;
      }

      const fieldObservables = fieldsId.map((el: string) => this.formService.getFieldById(el));
      const fields = await forkJoin(fieldObservables).toPromise();

      await this.processFields(fields);

      this.fields = fields;
      this.initializeFormControls(fields);
      this.fields.forEach(field => {field.templateOptions.disabled = true; });
      console.log('Form Controls:', this.form.controls);
      console.log('Initial Model:', this.model);
      console.log('Fields:', this.fields);
    } catch (error) {
      console.error(error);
    }
  }
  private async processFields(fields: any[]): Promise<void> {
    for (const  field of fields) {
      if (field.templateOptions.options) {
        field.templateOptions.disabled = false;

        if (field.type === 'iframe') {
          const link_iframe = field.templateOptions.link_iframe;
          this.shareService.changeUrl(link_iframe);
        }

        const optionsObservables = field.templateOptions.options.map(
          (op: string) => this.formService.getOptionsById(op)
        );
        const options = await forkJoin(optionsObservables).toPromise();

        const newFieldOptions: Options[] = field.templateOptions.options.map((op: string) => {
          return options.find((opt: Options) => opt.id === op);
        }).filter(opt => opt !== undefined);

        field.templateOptions.options = newFieldOptions;
        this.options = field.templateOptions.options;
      }

      if (field.fieldGroup && field.fieldGroup.length > 0) {
        let fieldGroupObservables = [] ;
        field.fieldGroup.map((el) => {
          if ( el && el.id !== undefined ){
            fieldGroupObservables.push(this.formService.getFieldById(el?.id));
          }else {
            fieldGroupObservables.push(this.formService.getFieldById(el));
          }
        } );
        let fieldGroup = await forkJoin(fieldGroupObservables).toPromise();

        for (const fieldGroupElement of fieldGroup) {
          if (fieldGroupElement.fieldGroupId && fieldGroupElement.fieldGroupId.length > 0) {
            let fieldGroupElmObservables = fieldGroupElement.fieldGroupId.map((el: string) => this.formService.getFieldById(el));
            let fieldGroupFields = await forkJoin(fieldGroupElmObservables).toPromise();
            fieldGroupElement.fieldGroup= [...fieldGroupFields] ;
            console.log(fieldGroupElement);
            fieldGroupElmObservables = null ;
            fieldGroupFields = null ;
          }
        }

        field.fieldGroup = fieldGroup;
        fieldGroupObservables = null ;
        fieldGroup = null;
        await this.processFields(field.fieldGroup); // Recursively process nested fields

      }
    }
  }

  initializeFormControls(fields: FormlyFieldConfig[]) {
    const initializeFieldControl = (field: FormlyFieldConfig, parentKey: string = '') => {
      const key = parentKey ? `${parentKey}.${field.key}` : field.key;

      if (field.fieldGroup && field.fieldGroup.length > 0) {
        field.fieldGroup.forEach((nestedField) => initializeFieldControl(nestedField, key.toString()));
      } else {
        // Get initial value from answersObject
        const initialValue = this.getModelValue(key.toString()) || field.defaultValue || '';
        const control = this.fb.control(initialValue);
        this.form.addControl(key.toString(), control);

        // // Update model when control value changes
        // control.valueChanges.subscribe((value) => {
        //   this.setModelValue(key.toString(), value);
        // });
        //
        // // Set initial model value
        // this.setModelValue(key.toString(), control.value);
      }
    };

    fields.forEach((field) => initializeFieldControl(field));

    // Log the model after form controls are initialized
    console.log('Model after initializing form controls:', this.model);
  }
  getModelValue(key: string) {
    const keys = key.split('.');
    let modelPart = this.data.formModel.answersObject;
    for (let i = 0; i < keys.length; i++) {
      if (modelPart[keys[i]] === undefined) {
        return null;
      }
      modelPart = modelPart[keys[i]];
    }
    return modelPart;
  }
  setModelValue(key: string, value: any) {
    const keys = key.split('.');
    this.model = this.data.formModel.answersObject;
    let modelPart = this.model;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!modelPart[keys[i]]) {
        modelPart[keys[i]] = {};
      }
      modelPart = modelPart[keys[i]];
    }
    modelPart[keys[keys.length - 1]] = value;
  }
}
