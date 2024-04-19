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
import {forkJoin, Observable} from 'rxjs';
import {SelectCustomizeDialogComponent} from '../fields-dialog/select-customize-dialog/select-customize-dialog.component';
import {TelFormDialogComponent} from '../fields-dialog/tel-form-dialog/tel-form-dialog.component';
import {FieldService} from '../../services/field.service';
import {OptionsService} from '../../services/options.service';
import {TemplateOptionsService} from '../../services/template-options.service';
import {DateFormDialogComponent} from '../fields-dialog/date-form-dialog/date-form-dialog.component';
import {FormColumnLayoutDialogComponent} from '../fields-dialog/form-column-layout-dialog/form-column-layout-dialog.component';
import {AddressCustomizeDialogComponent} from '../fields-dialog/address-customize-dialog/address-customize-dialog.component';
import {error} from 'protractor';




@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ContentComponent implements OnInit {
  newForm: FormGroup ;
  newFields: FormlyFieldConfig[] = [];
  newOptions: FormlyFormOptions = {};
  newModel: any = {};
 fields: FormlyFieldConfig[] = [];
  @ViewChild('formlyForm') formlyForm: any;
  form: FormGroup;
  model: any = {};
  options: FormlyFormOptions = {};
  containerDraggedOver: boolean = false;
  columnSize: any [ ] = [];
  // tslint:disable-next-line:max-line-length
  constructor(private fb: FormBuilder, private newfb: FormBuilder, private dialog: MatDialog, private  formService: FormCreationService, private fieldService: FieldService,
              private optionService: OptionsService, private templateOptionsService: TemplateOptionsService) {
    this.form = this.fb.group({});
    this.newForm = this.newfb.group({});
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
    }
    else {
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
      } else {
        this.containerDraggedOver = true;
        // @ts-ignore
        const droppedField: FormlyFieldConfig = { ...droppedItem }; // Create a copy of the dropped field
        // Find the index of the column layout container
        const columnIndex = this.fields.findIndex(field => field.key === event.container.id);
        if (columnIndex !== -1) {
          // Add the dropped field to the container's fieldGroup
          this.fields[columnIndex].fieldGroup.push(droppedField);
          // Update the form with the new fields
          this.form = this.fb.group({});
          this.formlyForm.resetForm({ model: this.model });
        }
      }

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.containerDraggedOver = false;
  }

  // tslint:disable-next-line:typedef
  async addField(type: string) {
    const uniqueKey = `newInput_${this.fields.length + 1}`;
    // Customize other properties based on the type
    let newField: FormlyFieldConfig[] = [{}];
    if (type === 'Text') {
      const customizationData = await this.openInputDialog();
      // @ts-ignore
      if (customizationData) {
        newField = [{
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
        newField = [{
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
        }];
      }
    }
    if (type === 'Url') {
      const customizationData = await this.openInputDialog();
      // @ts-ignore
      if (customizationData) {
        newField = [{
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
        }];
      }
    }
    if (type === 'Phone Number') {
      const customizationData = await this.openPhoneDialog();
      // @ts-ignore
      if (customizationData) {
        newField = [{
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
        }];
      }
    }
    if (type === 'Date / Time') {
      const customizationData = await this.openDateDialog();
      // @ts-ignore
      if (customizationData) {
        newField = [{
          type: 'input',
          key: uniqueKey,
          templateOptions: {
            label: customizationData.label,
            type: 'datetime-local',
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
        newField = [{
          type: 'input',
          key: uniqueKey,
          templateOptions: {
            label: customizationData.label,
            type: 'date',
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
        newField = [{
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
              const value = model[uniqueKey];
              const minLength = customizationData.minLength || 0;
              const maxLength = customizationData.maxLength || Infinity;
              return value.length < minLength || value.length > maxLength;
            }, }}]; }
    } else if (type === 'radio'){
      const customizationData = await this.openRadioDialog();
   //   console.log(customizationData.fields.length());
      if (customizationData) {
        newField = [{
          type: 'radio',
          key: uniqueKey,
          templateOptions: {
            label: customizationData.label,
            options : customizationData.tableRows ,
          },
        }];
      }
    }
    else if (type === 'select'){
      const customizationData = await this.openSelectDialog();
      console.log(customizationData);
      if (customizationData) {
        newField = [{
          key: uniqueKey,
          type: 'select',
          templateOptions : {
          label: customizationData.label,
            options : customizationData.tableRows,
        },
      }]; }
    }
    else if (type === 'Select Multiple'){
      const customizationData = await this.openSelectDialog();
      console.log(customizationData);
      if (customizationData) {
        newField = [{
          key: uniqueKey,
          type: 'select',
          templateOptions : {
            label: customizationData.label,
            multiple : true,
            options : customizationData.tableRows,
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
            label: customizationData.label || 'New Checkbox Label'
          },
          defaultValue: false,
        }];
        this.form = this.fb.group({});
        this.formlyForm.resetForm({model: this.model});
      }

    }
    else if (type === 'Columns') {
      const customizationData = await this.openColumnDialog();
      // let containerField: FormlyFieldConfig;
      // // tslint:disable-next-line:prefer-const
      // let fieldGroups: FormlyFieldConfig[] = [];
      // if (customizationData) {
      //   // tslint:disable-next-line:prefer-for-of
      //   for (let i = 0 ; i < customizationData.tableRows.length; i++ ){
      //      containerField = {
      //    //   fieldGroupClassName: 'row',
      //       fieldGroup: [
      //       {type: 'column',
      //       key: `${uniqueKey}_${i}`,
      //       className: 'columnClass' ,
      //       wrappers: ['column'], // Specify the wrapper here
      //       templateOptions: {
      //         columnSize: 'col-' + customizationData.tableRows[i].size + '-' + customizationData.tableRows[i].width ,
      //         label: customizationData.tableRows[i].label || 'New Column Label',
      //       }, }]
      //     };
      //      // @ts-ignore
      //      fieldGroups.push(containerField.fieldGroup);
      //      console.log(i);
      //   }
      //   const columnField: FormlyFieldConfig = {
      //       fieldGroupClassName: 'row',
      //       fieldGroup: fieldGroups
      //     };
      //   this.fields.push(columnField);
      if (customizationData) {
        const columnSizess  = [] ;
        customizationData.tableRows.map(el => {
          columnSizess.push(el.width);
        });
        console.log(columnSizess);
        newField = [
          {
            key: 'columnWrapper', // Key of the wrapper component for columns
            type: 'column', // Type of the wrapper component
            fieldGroup: [
            ],
          },
        ];
        this.columnSize = customizationData.tableRows;
      }
      console.log(newField);
      this.form = this.fb.group({});
    //  this.formlyForm.resetForm({ model: this.model });
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
  // tslint:disable-next-line:typedef

  // tslint:disable-next-line:typedef
  onDragOver(event: DragEvent) {
    event.preventDefault(); // Allow drop by preventing default behavior
  }

  // tslint:disable-next-line:typedef
  onDragLeave(event: DragEvent) {
    event.preventDefault(); // Prevent default behavior to maintain drop zone
  }
  // tslint:disable-next-line:typedef
  getForm(){
    const formid = '66052eee48dd413c8e1d8c91';
    let fieldIds = [];
    this.formService.getFormTemplateById(formid).subscribe(res => {
      fieldIds = res.fieldIds;
      if (fieldIds.length === 0) {
        return; // No fields to process
      }

      const fieldObservables = fieldIds.map(el => this.formService.getFieldById(el));

      forkJoin(fieldObservables).subscribe(fields => {
        fields.forEach(field => {
          const optionsObservables = field.templateOptions.options.map(op => this.formService.getOptionsById(op));

          forkJoin(optionsObservables).subscribe(options => {
            const newFieldOptions = [];

            // Match fetched options with field's options
            field.templateOptions.options.forEach((op) => {
              // @ts-ignore
              const matchedOption = options.find(opt => opt.id === op);
              if (matchedOption) {
                newFieldOptions.push(matchedOption);
              }
            });
            field.templateOptions.disabled = false ;
            // Assign the matched options to the field
            field.templateOptions.options = newFieldOptions;
            this.newOptions = field.templateOptions.options;
            console.log(field);
            this.newFields.push(field);
            this.newForm = this.newfb.group({});
            this.formlyForm.resetForm({ model: this.newModel });
            // tslint:disable-next-line:no-shadowed-variable
          }, error => {
            console.log(error);
          });
        });
        // tslint:disable-next-line:no-shadowed-variable
      }, error => {
        console.log(error);
      });
      // tslint:disable-next-line:no-shadowed-variable
    }, error => {
      console.log(error);
    });
  }
}
