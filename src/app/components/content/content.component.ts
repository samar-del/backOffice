import {Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FormDialogCheckboxComponent} from '../fields-dialog/form-dialog-checkbox/form-dialog-checkbox.component';
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
import {TelFormDialogComponent} from '../fields-dialog/tel-form-dialog/tel-form-dialog.component';
import {FieldService} from '../../services/field.service';
import {OptionsService} from '../../services/options.service';
import {TemplateOptionsService} from '../../services/template-options.service';
import {DateFormDialogComponent} from '../fields-dialog/date-form-dialog/date-form-dialog.component';
import {FormColumnLayoutDialogComponent} from '../fields-dialog/form-column-layout-dialog/form-column-layout-dialog.component';
import {AddressCustomizeDialogComponent} from '../fields-dialog/address-customize-dialog/address-customize-dialog.component';




@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ContentComponent implements OnInit {
 fields: FormlyFieldConfig[] = [];
  @ViewChild('formlyForm') formlyForm: any;
  form: FormGroup;
  model: any = {};
  options: FormlyFormOptions = {};
  // tslint:disable-next-line:max-line-length
  constructor(private fb: FormBuilder, private dialog: MatDialog, private  formService: FormCreationService, private fieldService: FieldService,
              private optionService: OptionsService, private templateOptionsService: TemplateOptionsService) {
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
      const droppedItem = event.previousContainer.data[event.previousIndex];

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

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  async addField(type: string) {
    const uniqueKey = `newInput_${this.fields.length + 1}`;
    // Customize other properties based on the type
    let newField: FormlyFieldConfig[] = [{}];
    if (type === 'Text') {
      const customizationData = await this.openInputDialog();
      if (customizationData) {
        const label = customizationData.hide_label ? null : customizationData.label;
        newField = [{
          type: 'input',
          key: uniqueKey,
          templateOptions: {
            label: label,
            type: 'text',
            placeholder: customizationData.placeholder,
            minLength: customizationData.minLength,
            maxLength: customizationData.maxLength,
            required: customizationData.required,
            disabled: customizationData.disabled,
            hidden: customizationData.hidden,
            custom_css: customizationData.custom_css,
            hide_label: customizationData.hide_label
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
        }];
      }
    }

    if (type === 'Address'){
      const customizationData = await this.openAddressDialog();
      let field: FormlyFieldConfig = {};
      const listFieldAddress = customizationData.tableRows;
      if (customizationData) {
        if (listFieldAddress.length !== 0) {
          listFieldAddress.forEach(el => {
            const Key = this.generateRandomId();
            field = {
              fieldGroupClassName: 'display-flex',
              fieldGroup: [
                {
                  className: 'flex-1',
                  type: 'input',
                  key: Key,
                  templateOptions: {
                    label: el.label,
                    placeholder: el.placeholder
                  },
                },
              ],
            };
            newField.push(field);
          });
        }else {
          field = {
            fieldGroupClassName: 'display-flex',
            fieldGroup: [
              {
                className: 'flex-2',
                type: 'input',
                key: uniqueKey,
                templateOptions: {
                  label: customizationData.label,
                  placeholder: customizationData.placeholder
                },
              },
            ],
          };
          newField.push(field);
        }
      }
    }
    if (type === 'Email') {
      const customizationData = await this.openInputDialog();
      // @ts-ignore
      if (customizationData) {
        const label = customizationData.hide_label ? null : customizationData.label;
        newField = [{
          type: 'input',
          key: uniqueKey,
          templateOptions: {
            label: label,
            type: 'email',
            placeholder: customizationData.placeholder,
            minLength: customizationData.minLength,
            maxLength: customizationData.maxLength,
            custom_css: customizationData.custom_css,
            required: customizationData.required,
            disabled: customizationData.disabled,
            hidden: customizationData.hidden,
            hide_label: customizationData.hide_label
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
        }];
      }
    }
    if (type === 'Url') {
      const customizationData = await this.openInputDialog();
      // @ts-ignore
      if (customizationData) {
        const label = customizationData.hide_label ? null : customizationData.label;
        newField = [{
          type: 'input',
          key: uniqueKey,
          templateOptions: {
            label: label,
            type: 'url',
            placeholder: customizationData.placeholder,
            minLength: customizationData.minLength,
            maxLength: customizationData.maxLength,
            custom_css: customizationData.custom_css,
            required: customizationData.required,
            disabled: customizationData.disabled,
            hidden: customizationData.hidden,
            hide_label: customizationData.hide_label
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
        }];
      }
    }
    if (type === 'Phone Number') {
      const customizationData = await this.openPhoneDialog();
      // @ts-ignore
      if (customizationData) {
        const label = customizationData.hide_label ? null : customizationData.label;
        newField = [{
          type: 'input',
          key: uniqueKey,
          templateOptions: {
            label: label,
            type: 'tel',
            placeholder: customizationData.placeholder,
            minLength: customizationData.minLength,
            maxLength: customizationData.maxLength,
            custom_css: customizationData.custom_css,
            required: customizationData.required,
            disabled: customizationData.disabled,
            hidden: customizationData.hidden,
            hide_label: customizationData.hide_label,
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
        }];
      }
    }
    if (type === 'Date / Time') {
      const customizationData = await this.openDateDialog();
      // @ts-ignore
      if (customizationData) {
        const label = customizationData.hide_label ? null : customizationData.label;
        newField = [{
          type: 'input',
          key: uniqueKey,
          templateOptions: {
            label: label,
            type: 'datetime-local',
            custom_css: customizationData.custom_css,
            required: customizationData.required,
            disabled: customizationData.disabled,
            hidden: customizationData.hidden,
            hide_label: customizationData.hide_label,
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
        }];
      }
    }
    if (type === 'Day') {
      const customizationData = await this.openDateDialog();
      // @ts-ignore
      if (customizationData) {
        const label = customizationData.hide_label ? null : customizationData.label;
        newField = [{
          type: 'input',
          key: uniqueKey,
          templateOptions: {
            label: label,
            type: 'date',
            custom_css: customizationData.custom_css,
            required: customizationData.required,
            disabled: customizationData.disabled,
            hidden: customizationData.hidden,
            hide_label: customizationData.hide_label,
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
        }];
      }
    }
    else if (type === 'Number') {
      const customizationData = await this.openInputDialog();
      // @ts-ignore
      if (customizationData) {
        const label = customizationData.hide_label ? null : customizationData.label;
        newField = [{
          type: 'input',
          key: uniqueKey,
          templateOptions: {
            label: label,
            type: 'number',
            placeholder: customizationData.placeholder,
            minLength: customizationData.minLength,
            maxLength: customizationData.maxLength,
            disabled: customizationData.disabled,
            hidden: customizationData.hidden,
            hide_label: customizationData.hide_label,
            custom_css: customizationData.custom_css
          },
          expressionProperties: {
            'templateOptions.errorState': (model: any, formState: any) => {
              const value = model[uniqueKey];
              const minLength = customizationData.minLength || 0;
              const maxLength = customizationData.maxLength || Infinity;
              return value.length < minLength || value.length > maxLength;
            }, }}]; }
    } else if (type === 'radio'){
      const customizationData = await this.openRadioDialog();
   //   console.log(customizationData.fields.length());
      if (customizationData) {
        const label = customizationData.hide_label ? null : customizationData.label;
        newField = [{
          type: 'radio',
          key: uniqueKey,
          templateOptions: {
            label: label,
            options : customizationData.tableRows ,
            disabled: customizationData.disabled,
            hidden: customizationData.hidden,
            hide_label: customizationData.hide_label,
            custom_css: customizationData.custom_css
          },
        }];
      }
    }
    else if (type === 'select'){
      const customizationData = await this.openSelectDialog();
      console.log(customizationData);
      if (customizationData) {
        const label = customizationData.hide_label ? null : customizationData.label;
        newField = [{
          key: uniqueKey,
          type: 'select',
          templateOptions : {
            label: label,
            options : customizationData.tableRows,
            custom_css: customizationData.custom_css,
            required: customizationData.required,
            disabled: customizationData.disabled,
            hidden: customizationData.hidden,
            hide_label: customizationData.hide_label
        },
      }]; }
    }
    else if (type === 'Select Multiple'){
      const customizationData = await this.openSelectDialog();
      console.log(customizationData);
      if (customizationData) {
        const label = customizationData.hide_label ? null : customizationData.label;
        newField = [{
          key: uniqueKey,
          type: 'select',
          templateOptions : {
            label: label,
            custom_css: customizationData.custom_css,
            multiple : true,
            options : customizationData.tableRows,
            required: customizationData.required,
            disabled: customizationData.disabled,
            hidden: customizationData.hidden,
            hide_label: customizationData.hide_label
          },
        }]; }
    }
    else if (type === 'checkbox') {
      const customizationData = await this.openCheckboxDialog().toPromise();
      if (customizationData) {
        newField = [{
          type: 'checkbox',
          key: uniqueKey,
          templateOptions: {
            label: customizationData.label || 'New Checkbox Label',
            disabled: customizationData.disabled,
            hidden: customizationData.hidden,
            hide_label: customizationData.hide_label,
            custom_css: customizationData.custom_css,
            required: customizationData.required,
          },
          defaultValue: false,
        }];
      }

    }
    else if (type === 'Columns') {
      const customizationData = await this.openColumnDialog();
      if (customizationData) {
        const { label, tableRows } = customizationData;
        // Create the div with the appropriate class for each table row
        const columnFields = tableRows.map(row => ({
          ...row,
          type: 'column',
          key: `${uniqueKey}_${row.size}_${row.width}`,
          wrappers: ['column'], // Specify the wrapper here
          templateOptions: {
            label: customizationData.label || 'New Column Label',
            size: row.size, // Pass the size value from the row
            width: row.width // Pass the width value from the row
          },
        }));

        // Wrap the column fields with a row div
        const rowDiv = {
          type: 'row',
          fieldGroup: columnFields
        };


        this.fields.push(rowDiv);

        // Update the form with the new fields
        this.form = this.fb.group({});
        this.formlyForm.resetForm({ model: this.model });
      }
    }
    else {
    //  this.openRadioDialog();
    }

    if (newField) {
      newField.forEach(el => {
        this.fields.push(el);
      });
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
  // tslint:disable-next-line:typedef
  async openAddressDialog() {
    const dialogRef = this.dialog.open(AddressCustomizeDialogComponent, {
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

  async openDateDialog() {
    const dialogRef = this.dialog.open(DateFormDialogComponent, {
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

  async openColumnDialog() {
    const dialogRef = this.dialog.open(FormColumnLayoutDialogComponent, {
      width: '1400px',
      data: { label: '', width_col: '', tableRows: [] },
    });
    try {
      const customizationData = await dialogRef.afterClosed().toPromise();
      return customizationData; // Return the entire customization data object
    } catch (error) {
      console.error('Error in dialog:', error);
      return null;
    }
  }


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
  submit() {
    if (this.form.valid) {
      const formValues = this.form.getRawValue();
      console.log('Form Values:', formValues);
    }
  }
// tslint:disable-next-line:typedef
  deleteField(uniqueKey: string) {
    const fieldIndex = this.fields.findIndex(field => field.key === uniqueKey);

    if (fieldIndex !== -1) {
      this.fields.splice(fieldIndex, 1);

      this.form = this.fb.group({});
      this.formlyForm.resetForm({ model: this.model, fields: this.fields });
    }
  }

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
    const field = this.fields.find(f => f.key === uniqueKey);

    if (field) {
      field.templateOptions = {
        ...field.templateOptions,
        ...newCustomizationData,
      };

      this.form = this.fb.group({});
      this.formlyForm.resetForm({ model: this.model, fields: this.fields });
    }
  }


  // tslint:disable-next-line:typedef
   async addFormTemplate(){
    if (this.form.valid) {
      const fieldsId: string[] = [];
      for (const field of this.fields) {
        const fieldOptions = await this.saveFieldOptions(field);
        const fieldId = await this.saveFieldWithTemplateOptions(field, fieldOptions);
        fieldsId.push(fieldId);
      }

      const formTemplate = {
        fieldIds: fieldsId,
        title: 'first form',
        version: 1,
        createdAt: new Date(),
        description: 'description form 1 test'
      };

      this.formService.addFormTemplate(formTemplate).subscribe(
        res => console.log('Form template added:', res),
        err => console.error('Error adding form template:', err)
      );
    }
  }
  async saveFieldOptions(field: FormlyFieldConfig): Promise<TemplateOptions> {
    let options;
    if (field.templateOptions.options) {
      options = await Promise.all((field.templateOptions.options as any[]).map(async option => {
        const newOption: Options = {
          label: option.label,
          value: option.value,
          id: this.generateRandomId()
        };
        await this.optionService.addOption(newOption).toPromise();
        return newOption;
      }));
    } else {
      options = [];
    }
    const optionValues: string[] = options.map(option => option.id); // Change to store option IDs
    const templateOptions: TemplateOptions = {
      label: field.templateOptions.label,
      disabled: field.templateOptions.disabled,
      placeholder: field.templateOptions.placeholder,
      maxlength: field.templateOptions.maxLength,
      minlength: field.templateOptions.minLength,
      pattern: field.templateOptions.pattern,
      multiple: field.templateOptions.multiple,
      type: field.templateOptions.type,
      required: field.templateOptions.required,
      hidden: field.templateOptions.hidden,
      hide_label:field.templateOptions.hide_label,
      custom_css:field.templateOptions.custom_css,
      options: optionValues, // Store option IDs instead of values
      id: this.generateRandomId()
    };

    await this.templateOptionsService.addTemplateOption(templateOptions).toPromise();
    return templateOptions;
  }

  async saveFieldWithTemplateOptions(field: FormlyFieldConfig, templateOptions: TemplateOptions): Promise<string> {
    const mappedField: Field = {
      type: field.type,
      key: field.key.toString(),
      templateOptions, // Store the ID of the templateOptions
      id: this.generateRandomId()
    };

    const res = await this.fieldService.addField(mappedField).toPromise();
    return res.id;
  }
  generateRandomId(length: number = 8): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let randomId = '';
    for (let i = 0; i < length; i++) {
      randomId += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return randomId;
  }


  isLastColumn(index: number): boolean {
    return index === this.fields.length - 1;
  }

  isNextColumnSizeDifferent(index: number): boolean {
    if (index < this.fields.length - 1) {
      return this.fields[index].templateOptions.size !== this.fields[index + 1].templateOptions.size;
    }
    return false;
  }


}
