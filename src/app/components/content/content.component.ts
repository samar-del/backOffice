import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FormDialogCheckboxComponent} from "../fields-dialog/form-dialog-checkbox/form-dialog-checkbox.component";
import {FormlyFormOptions, FormlyFieldConfig} from '@ngx-formly/core';
import {FormDialogComponent} from '../fields-dialog/form-dialog/form-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {RadioCustomizeDialogComponent} from '../fields-dialog/radio-customize-dialog/radio-customize-dialog.component';
import {FormTemplate} from '../../models/FormTemplate';
import {FormCreationService} from '../../services/form-creation.service';
import {Field} from '../../models/Field';
import {TemplateOptions} from '../../models/TemplateOptions';
import {Options} from '../../models/Options';
import {Observable} from 'rxjs';
import {SelectCustomizeDialogComponent} from '../fields-dialog/select-customize-dialog/select-customize-dialog.component';
import {TelFormDialogComponent} from "../fields-dialog/tel-form-dialog/tel-form-dialog.component";


@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
 fields: FormlyFieldConfig[] = [];
  @ViewChild('formlyForm') formlyForm: any;
  form: FormGroup;
  model: any = {};
  options: FormlyFormOptions = {};
  formTemplate = new FormTemplate();
  lastFields: Field[] = [];
  fieldsTemplateOptions: TemplateOptions[];
  fieldsOptions: any[];
  constructor(private fb: FormBuilder, private dialog: MatDialog, private  formService: FormCreationService) {
    this.form = this.fb.group({});
  }
  ngOnInit(): void {
  }
  // tslint:disable-next-line:typedef
  onItemDropped(item: string) {
    this.addField(item);
  }

  // tslint:disable-next-line:typedef
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Transfer the item from the available items to the form
      const droppedItem = event.previousContainer.data[event.previousIndex];

      // Customize the dropped item (e.g., using a dialog)
      if (droppedItem === 'input') {
        this.addField('input');
      } else if (droppedItem === 'radio') {
        this.addField('radio');
      } else if (droppedItem === 'checkbox') {
        this.addField('checkbox');
      } else if (droppedItem === 'button') {
        this.addField('button');
      } else if (droppedItem === 'select') {
        this.addField('select');
      }

      // Transfer the item to the new container
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  // tslint:disable-next-line:typedef
  async addField(type: string) {
    const uniqueKey = `newInput_${this.fields.length + 1}`;
    // Customize other properties based on the type
    let newField: FormlyFieldConfig = {};
    if (type === 'Text') {
      const customizationData = await this.openInputDialog();
      // @ts-ignore
      if (customizationData) {
        newField = {
          type: 'input',
          key: uniqueKey,
          templateOptions: {
            label: customizationData.label,
            type: 'text',
            placeholder: customizationData.placeholder,
            minLength: customizationData.minLength,
            maxLength: customizationData.maxLength,
          },
          expressionProperties: {
            'templateOptions.errorState': (model: any, formState: any) => {
              // Check the length constraints and set error state accordingly
              const value = model[uniqueKey];
              const minLength = customizationData.minLength || 0;
              const maxLength = customizationData.maxLength || Infinity;
              return value.length < minLength || value.length > maxLength;
            },
          },
          // Customize other properties as needed
        };
      }
    }
    if (type === 'Email') {
      const customizationData = await this.openInputDialog();
      // @ts-ignore
      if (customizationData) {
        newField = {
          type: 'input',
          key: uniqueKey,
          templateOptions: {
            label: customizationData.label,
            type: 'email',
            placeholder: customizationData.placeholder,
            minLength: customizationData.minLength,
            maxLength: customizationData.maxLength,
          },
          expressionProperties: {
            'templateOptions.errorState': (model: any, formState: any) => {
              // Check the length constraints and set error state accordingly
              const value = model[uniqueKey];
              const minLength = customizationData.minLength || 0;
              const maxLength = customizationData.maxLength || Infinity;
              return value.length < minLength || value.length > maxLength;
            },
          },
          // Customize other properties as needed
        };
      }
    }
    if (type === 'Url') {
      const customizationData = await this.openInputDialog();
      // @ts-ignore
      if (customizationData) {
        newField = {
          type: 'input',
          key: uniqueKey,
          templateOptions: {
            label: customizationData.label,
            type: 'url',
            placeholder: customizationData.placeholder,
            minLength: customizationData.minLength,
            maxLength: customizationData.maxLength,
          },
          expressionProperties: {
            'templateOptions.errorState': (model: any, formState: any) => {
              // Check the length constraints and set error state accordingly
              const value = model[uniqueKey];
              const minLength = customizationData.minLength || 0;
              const maxLength = customizationData.maxLength || Infinity;
              return value.length < minLength || value.length > maxLength;
            },
          },
          // Customize other properties as needed
        };
      }
    }
    if (type === 'Phone Number') {
      const customizationData = await this.openPhoneDialog();
      // @ts-ignore
      if (customizationData) {
        newField = {
          type: 'input',
          key: uniqueKey,
          templateOptions: {
            label: customizationData.label,
            type: 'tel',
            placeholder: customizationData.placeholder,
            minLength: customizationData.minLength,
            maxLength: customizationData.maxLength,
            pattern: customizationData.pattern || '^[2-579]{2}\\s?\\d{2}\\s?\\d{2}\\s?\\d{2}$', // Tunisian phone number pattern
          },
          expressionProperties: {
            'templateOptions.errorState': (model: any, formState: any) => {
              // Check the length constraints and set error state accordingly
              const value = model[uniqueKey];
              const minLength = customizationData.minLength || 0;
              const maxLength = customizationData.maxLength || Infinity;
              const isValidPhoneNumber = new RegExp(customizationData.pattern || '^[2-579]{2}\\s?\\d{2}\\s?\\d{2}\\s?\\d{2}$').test(value);
              return value.length < minLength || value.length > maxLength || !isValidPhoneNumber;
            },
          },
          // Customize other properties as needed
        };
      }
    }
    if (type === 'Date / Time') {
      const customizationData = await this.openInputDialog();
      // @ts-ignore
      if (customizationData) {
        newField = {
          type: 'input',
          key: uniqueKey,
          templateOptions: {
            label: customizationData.label,
            type: 'datetime-local',
            placeholder: customizationData.placeholder,
            minLength: customizationData.minLength,
            maxLength: customizationData.maxLength,
          },
          expressionProperties: {
            'templateOptions.errorState': (model: any, formState: any) => {
              // Check the length constraints and set error state accordingly
              const value = model[uniqueKey];
              const minLength = customizationData.minLength || 0;
              const maxLength = customizationData.maxLength || Infinity;
              return value.length < minLength || value.length > maxLength;
            },
          },
          // Customize other properties as needed
        };
      }
    }
    else if (type === 'Number') {
      const customizationData = await this.openInputDialog();
      // @ts-ignore
      if (customizationData) {
        newField = {
          type: 'input',
          key: uniqueKey,
          templateOptions: {
            label: customizationData.label,
            type: 'number',
            placeholder: customizationData.placeholder,
            minLength: customizationData.minLength,
            maxLength: customizationData.maxLength,
          },
          expressionProperties: {
            'templateOptions.errorState': (model: any, formState: any) => {
              // Check the length constraints and set error state accordingly
              const value = model[uniqueKey];
              const minLength = customizationData.minLength || 0;
              const maxLength = customizationData.maxLength || Infinity;
              return value.length < minLength || value.length > maxLength;
            },
          }
        }
      }

    } else if (type === 'radio'){
      debugger;
      const customizationData = await this.openRadioDialog();
   //   console.log(customizationData.fields.length());
      if (customizationData) {
        newField = {
          type: 'radio',
          key: uniqueKey,
          templateOptions: {
            label: customizationData.label,
            options : customizationData.tableRows ,
          },
          // Customize other properties as needed
        };
      }
    }
    else if (type === 'select'){
      const customizationData = await this.openSelectDialog();
      console.log(customizationData);
      if (customizationData) {
        newField = {
          key: uniqueKey,
          type: 'select',
          templateOptions : {
          label: customizationData.label,
            options : customizationData.tableRows,
        },
      }; }
    }
    else if (type === 'checkbox') {
      const customizationData = await this.openCheckboxDialog().toPromise();
      if (customizationData) {
        newField = {
          type: 'checkbox',
          key: uniqueKey,
          templateOptions: {
            label: customizationData.label || 'New Checkbox Label'
          },
          defaultValue: false, // Add a default value for the checkbox
          // Customize other properties as needed
        };

        // Add the new field to the FormlyForm fields array
        this.fields.push(newField);

        // Update the form with the new fields
        this.form = this.fb.group({});
        this.formlyForm.resetForm({model: this.model});
      }

    }
    else if (type === 'button') {

      newField = {
        key: 'selectedAnswer',
        type: 'multiCheckbox',
      };
    } else if (type === 'button') {
      // @ts-ignore
      // @ts-ignore
      // @ts-ignore
      newField = {
        key: 'marvel1',
        type: 'select',
      };
    }else {
    //  this.openRadioDialog();
    }

    if (newField) {
      // Add the new field to the FormlyForm fields array
      this.fields.push(newField);

      // Update the form with the new fields
      this.form = this.fb.group({});
      this.formlyForm.resetForm({ model: this.model });
    }
  }

  openCheckboxDialog(): Observable<any> {
    const dialogRef = this.dialog.open(FormDialogCheckboxComponent, {
      width: '1400px', // Adjust the width as needed
      data: {
        label: '' // Default label value
      }
    });

    return dialogRef.afterClosed();
  }

  // tslint:disable-next-line:typedef
  /*openRadioDialog() {
    const dialogRef = this.dialog.open(FormDialogComponent, {
      width: '1400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Create the radio field group based on customization
        const newField: FormlyFieldConfig = {
          type: 'radio',
          key: 'newRadio',
          templateOptions: {
            label: result.radioLabel,
            options: result.options.map(option => ({value: option, label: option}))
          }
        };

        // Add the new field to the FormlyForm fields array
        this.fields.push(newField);

        // Update the form with the new fields
        this.form = this.fb.group({});
        this.formlyForm.resetForm({model: this.model});
      }

      // Update the form with the new fields
      this.form = this.fb.group({});
      this.formlyForm.resetForm({
        model: this.model
      });
    })
  }*/
  // tslint:disable-next-line:typedef
  async openInputDialog() {
    const dialogRef = this.dialog.open(FormDialogComponent, {
      width: '1400px',
      data: {label: '', placeholder: ''},
    });
    try {
      const customizationData = await dialogRef.afterClosed().toPromise();
      return customizationData;
    } catch (error) {
      console.error('Error in dialog:', error);
      return null;
    }
  }

  async openPhoneDialog() {
    const dialogRef = this.dialog.open(TelFormDialogComponent, {
      width: '1400px',
      data: {label: '', placeholder: ''},
    });
    try {
      const customizationData = await dialogRef.afterClosed().toPromise();
      return customizationData;
    } catch (error) {
      console.error('Error in dialog:', error);
      return null;
    }
  }

 // tslint:disable-next-line:typedef adjacent-overload-signatures
  async openRadioDialog() {
    const dialogRef = this.dialog.open(RadioCustomizeDialogComponent, {
      width: '1400px',
      data: {label: '', placeholder: '', tableRows: [{label : '', value: ''}]},
    });
    try {
      const customizationData = await dialogRef.afterClosed().toPromise();
      return customizationData;
    } catch (error) {
      console.error('Error in dialog:', error);
      return null;
    }
  }
  // tslint:disable-next-line:typedef
  async openSelectDialog() {
    const dialogRef = this.dialog.open(SelectCustomizeDialogComponent, {
      width: '1400px',
      data: {label: '', placeholder: '', tableRows: [{label : '', value: ''}]},
    });
    try {
      const customizationData = await dialogRef.afterClosed().toPromise();
      return customizationData;
    } catch (error) {
      console.error('Error in dialog:', error);
      return null;
    }
  }
  // tslint:disable-next-line:typedef
  submit() {
    if (this.form.valid) {
      const formValues = this.form.getRawValue(); // Extract raw form values
      console.log('Form Values:', formValues);
      // Handle form submission logic here (if needed)
    }
  }
// tslint:disable-next-line:typedef
  deleteField(uniqueKey: string) {
    // Find the index of the field with the given unique key
    const fieldIndex = this.fields.findIndex(field => field.key === uniqueKey);

    // If the field is found, remove it from the fields array
    if (fieldIndex !== -1) {
      this.fields.splice(fieldIndex, 1);

      // Update the form with the new fields
      this.form = this.fb.group({});
      this.formlyForm.resetForm({ model: this.model, fields: this.fields });
    }
  }

  // tslint:disable-next-line:typedef
  openCustomizationDialog(uniqueKey: string) {
    const field = this.fields.find(f => f.key === uniqueKey);

    if (field) {
      const dialogRef = this.dialog.open(FormDialogComponent, {
        width: '1400px',
        data: {
          label: field.templateOptions.label,
          placeholder: field.templateOptions.placeholder,
          minLength: field.templateOptions.minLength,
          maxLength: field.templateOptions.maxLength,
          // Include other properties from the field's templateOptions as needed
        },
      });

      dialogRef.afterClosed().subscribe((newCustomizationData) => {
        if (newCustomizationData !== undefined) {
          this.updateCustomizationData(uniqueKey, newCustomizationData);
        }
      });
    }
  }


  // tslint:disable-next-line:typedef
  updateCustomizationData(uniqueKey: string, newCustomizationData: any) {
    // Find the field with the given unique key
    const field = this.fields.find(f => f.key === uniqueKey);

    // If the field is found, update its customization data
    if (field) {
      field.templateOptions = {
        ...field.templateOptions,
        ...newCustomizationData,
      };

      // Update the form with the new fields
      this.form = this.fb.group({});
      this.formlyForm.resetForm({ model: this.model, fields: this.fields });
    }
  }




  // tslint:disable-next-line:typedef
  addFormTemplate(){
    if (this.form.valid) {
      // tslint:disable-next-line:no-shadowed-variable
       const Options: Options[] = [];
       debugger;
       const formValues = this.form.getRawValue();
      this.fieldsOptions = this.fields.map(field => {
        return field.templateOptions?.options || [];
      });
      this.fieldsOptions.map(el => {
        el.map(elm => {
          const option: Options = {
            label : elm.label,
            value : elm.value
          };
          Options.push(elm);
          return option;
        });
      });
       this.fieldsTemplateOptions = this.fields.map(field => {

        // @ts-ignore
        const templateOptions: TemplateOptions = {
          label : field.templateOptions.label,
          disabled : field.templateOptions.disabled,
          placeholder : field.templateOptions.placeholder,
          maxlength : field.templateOptions.maxLength,
          minlength : field.templateOptions.minLength,
          pattern : field.templateOptions.pattern,
          options: Options,
        };
        return templateOptions;
      });
       const fields = this.fields.map(field => {
        // Map FormlyFieldConfig to Field object
        const mappedField: Field = {
          type: field.type,
          key: field.key.toString(),
          templateOptions: this.fieldsTemplateOptions,
          // Map other properties as needed
        };
        this.lastFields.push(mappedField);
        return mappedField;
      });
       this.formTemplate.fieldIds = this.lastFields ;
       this.formTemplate.title = 'first form';
       this.formTemplate.version = 1;
       this.formTemplate.createdAt = new Date();
       this.formTemplate.description = 'description form 1 test';
       this.formService.addFormTemplate(this.formTemplate).subscribe(res => {
          console.log(res);
        },
        err => {
          console.log('erreur');
        }
      );
    }
  }
}
