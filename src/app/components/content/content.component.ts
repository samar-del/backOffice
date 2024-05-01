import {Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FormDialogCheckboxComponent} from '../fields-dialog/form-dialog-checkbox/form-dialog-checkbox.component';
import {FormlyFormOptions, FormlyFieldConfig, FormlyField} from '@ngx-formly/core';
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
import {error, promise} from 'protractor';
import {ShareService} from '../../services/share.service';




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
  containerDraggedOver = false;
  columnSize: any [ ] = [];
  categories: { name: string, fields: FormlyFieldConfig[] }[] = [
    { name: 'Category 1', fields: [] },
    { name: 'Category 2', fields: [] },

  ];
  // tslint:disable-next-line:max-line-length
  constructor(private fb: FormBuilder, private newfb: FormBuilder, private dialog: MatDialog, private  formService: FormCreationService, private fieldService: FieldService,
              private optionService: OptionsService, private templateOptionsService: TemplateOptionsService,
              private shareService: ShareService) {
    this.form = this.fb.group({});

  }
  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<string[]>, droppedItem: string) {
    // Calculate the position based on the cursor position
    const position = this.calculatePosition(event);

    // Insert the dropped item at the calculated position
    this.addField(droppedItem, position);


    this.containerDraggedOver = false;
  }

  calculatePosition(event: CdkDragDrop<string[]>): number {

    // Calculate the position based on the cursor's position
    // You may need to implement your own logic here based on your requirements
    // For example, you can calculate the position based on the Y coordinate of the cursor

    // Get the Y coordinate of the cursor relative to the content-container
    const offsetY = event.distance.y - event.container.element.nativeElement.getBoundingClientRect().top;

    // Calculate the position based on offsetY
    // Example: dividing the container's height into equal segments and determining the segment based on the cursor's position
    // This is just a placeholder; you'll need to adjust it based on your specific layout and requirements
    const containerHeight = event.container.element.nativeElement.clientHeight;
    const totalSegments = this.fields.length + 1; // Total segments including existing fields
    const segmentHeight = containerHeight / totalSegments;
    const position = Math.floor(offsetY / segmentHeight);

    return position;
  }


  // tslint:disable-next-line:typedef
  async addField(type: string, position: number) {
    const uniqueKey = `newInput_${this.fields.length + 1}`;
    // Customize other properties based on the type
    let newField: FormlyFieldConfig[] = [{


    }];
    if (type === 'Text' ) {
      const customizationData = await this.openInputDialog();
      if (customizationData) {
        const label = customizationData.hide_label ? null : customizationData.label;
        newField = [{
          wrappers: ['column'],
          type: 'input',
          key: customizationData.property_name,
          templateOptions: {
            label: label || '',
            type: 'text',
            placeholder: customizationData.placeholder,
            minLength: customizationData.minLength,
            maxLength: customizationData.maxLength,
            required: customizationData.required,
            disabled: customizationData.disabled,
            hidden: customizationData.hidden,
            custom_css: customizationData.custom_css,
            property_name: customizationData.property_name,
            field_tags: customizationData.field_tags,
            error_label: customizationData.error_label,
            custom_error_message: customizationData.custom_error_message,
          },


          expressionProperties: {
            'templateOptions.errorState': (model: any, formState: any) => {
              const value = model[uniqueKey];
              if (value === undefined || value === null) {
                return false;
              }
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
      this.shareService.emitAddressOptions(listFieldAddress);
      if (customizationData) {
        const label = customizationData.hide_label ? null : customizationData.label;
        if (listFieldAddress.length !== 0) {
          field = {
            type: 'column',
            key: customizationData.property_name,
            templateOptions: {

              label: customizationData.label,
              minLength: customizationData.minLength,
              maxLength: customizationData.maxLength,
              required: customizationData.required,
              disabled: customizationData.disabled,
              hidden: customizationData.hidden,
              custom_css: customizationData.custom_css,
              hide_label: customizationData.hide_label,
              property_name: customizationData.property_name,
              field_tags: customizationData.field_tags,
              error_label: customizationData.error_label,
              custom_error_message: customizationData.custom_error_message
            },
            wrappers: ['column'],

            fieldGroup: [ ],
          };
          listFieldAddress.forEach(el => {
            const Key = this.generateRandomId();
            const fieldGroupElem = {
                  type: 'input',
                  wrappers: ['address-wrapper'],
                  key: customizationData.property_name,
                  templateOptions: {

                    label : el.label,
                    placeholder: el.placeholder,
                    disabled: el.disabled,
                    hidden: el.hidden,
                    custom_css: el.custom_css,
                    hide_label: el.hide_label,
                    property_name: el.property_name,
                    field_tags: el.field_tags,
                    error_label: el.error_label,
                    custom_error_message: el.custom_error_message
                  },
                };
            field.fieldGroup.push(fieldGroupElem);
            });
          newField.push(field);
        }else {
          field = {
            fieldGroupClassName: 'display-flex',
            fieldGroup: [
              {
                type: 'input',
                key: customizationData.property_name,
                templateOptions: {

                  label: customizationData.propertyName,
                  placeholder: customizationData.placeholder,
                  disabled: customizationData.disabled,
                  hidden: customizationData.hidden,
                  custom_css: customizationData.custom_css,
                  hide_label: customizationData.hide_label,
                  property_name: customizationData.property_name,
                  field_tags: customizationData.field_tags,
                  error_label: customizationData.error_label,
                  custom_error_message: customizationData.custom_error_message
                },
                wrappers: ['column'],

              },
            ],
          };
          newField.push(field);
        }
    }}
    if (type === 'Email') {
      const customizationData = await this.openInputDialog();
      // @ts-ignore
      if (customizationData) {
        const label = customizationData.hide_label ? null : customizationData.label;
        newField = [{
          type: 'input',
          key: customizationData.property_name,
          templateOptions: {

            label: customizationData.label,
            type: 'email',
            placeholder: customizationData.placeholder,
            minLength: customizationData.minLength,
            maxLength: customizationData.maxLength,
            custom_css: customizationData.custom_css,
            required: customizationData.required,
            disabled: customizationData.disabled,
            hidden: customizationData.hidden,
            hide_label: customizationData.hide_label,
            property_name: customizationData.property_name,
            field_tags: customizationData.field_tags,
            error_label: customizationData.error_label,
            custom_error_message: customizationData.custom_error_message,

          },
          wrappers: ['column'],


          expressionProperties: {
            'templateOptions.errorState': (model: any, formState: any) => {
              // Check the length constraints and set error state accordingly
              const value = model[customizationData.propertyName];
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
          key: customizationData.property_name,
          templateOptions: {

            label,
            type: 'url',
            placeholder: customizationData.placeholder,
            minLength: customizationData.minLength,
            maxLength: customizationData.maxLength,
            custom_css: customizationData.custom_css,
            required: customizationData.required,
            disabled: customizationData.disabled,
            hidden: customizationData.hidden,
            hide_label: customizationData.hide_label,
            property_name: customizationData.property_name,
            field_tags: customizationData.field_tags,
            error_label: customizationData.error_label,
            custom_error_message: customizationData.custom_error_message
          },
          wrappers: ['column'],

          expressionProperties: {
            'templateOptions.errorState': (model: any, formState: any) => {
              // Check the length constraints and set error state accordingly
              const value = model[customizationData.propertyName];
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
          key: customizationData.property_name,
          templateOptions: {
            label,
            type: 'tel',
            placeholder: customizationData.placeholder,
            minLength: customizationData.minLength,
            maxLength: customizationData.maxLength,
            custom_css: customizationData.custom_css,
            required: customizationData.required,
            disabled: customizationData.disabled,
            hidden: customizationData.hidden,
            hide_label: customizationData.hide_label,
            property_name: customizationData.property_name,
            field_tags: customizationData.field_tags,
            error_label: customizationData.error_label,
            custom_error_message: customizationData.custom_error_message,
            pattern: customizationData.pattern || '^[2-579]{2}\\s?\\d{2}\\s?\\d{2}\\s?\\d{2}$', // Tunisian phone number pattern
          },
          wrappers: ['column'],

          expressionProperties: {
            'templateOptions.errorState': (model: any, formState: any) => {
              // Check the length constraints and set error state accordingly
              const value = model[customizationData.propertyName];
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
          key: customizationData.property_name,
          templateOptions: {
            label,
            type: 'datetime-local',
            custom_css: customizationData.custom_css,
            required: customizationData.required,
            disabled: customizationData.disabled,
            hidden: customizationData.hidden,
            hide_label: customizationData.hide_label,
            property_name: customizationData.property_name,
            field_tags: customizationData.field_tags,
            error_label: customizationData.error_label,
            custom_error_message: customizationData.custom_error_message
          },
          wrappers: ['column'],

          expressionProperties: {
            'templateOptions.errorState': (model: any, formState: any) => {
              // Check the length constraints and set error state accordingly
              const value = model[customizationData.propertyName];
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
          key: customizationData.property_name,
          templateOptions: {
            label,
            type: 'date',
            custom_css: customizationData.custom_css,
            required: customizationData.required,
            disabled: customizationData.disabled,
            hidden: customizationData.hidden,
            hide_label: customizationData.hide_label,
            property_name: customizationData.property_name,
            field_tags: customizationData.field_tags,
            error_label: customizationData.error_label,
            custom_error_message: customizationData.custom_error_message
          },
          wrappers: ['column'],

          expressionProperties: {
            'templateOptions.errorState': (model: any, formState: any) => {
              // Check the length constraints and set error state accordingly
              const value = model[customizationData.propertyName];
              const minLength = customizationData.minLength || 0;
              const maxLength = customizationData.maxLength || Infinity;
              return value.length < minLength || value.length > maxLength;
            },
          },
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
          key: customizationData.property_name,
          templateOptions: {
            label,
            type: 'number',
            placeholder: customizationData.placeholder,
            minLength: customizationData.minLength,
            maxLength: customizationData.maxLength,
            disabled: customizationData.disabled,
            hidden: customizationData.hidden,
            hide_label: customizationData.hide_label,
            custom_css: customizationData.custom_css,
            property_name: customizationData.property_name,
            field_tags: customizationData.field_tags,
            error_label: customizationData.error_label,
            custom_error_message: customizationData.custom_error_message
          },
          wrappers: ['column'],

          expressionProperties: {
            'templateOptions.errorState': (model: any, formState: any) => {
              const value = model[customizationData.propertyName];
              const minLength = customizationData.minLength || 0;
              const maxLength = customizationData.maxLength || Infinity;
              return value.length < minLength || value.length > maxLength;
            }, }}]; }
    } else if (type === 'radio'){
      const customizationData = await this.openRadioDialog();
      if (customizationData) {
        const label = customizationData.hide_label ? null : customizationData.label;
        newField = [{
          type: 'radio',
          key: customizationData.property_name,
          templateOptions: {
            label,
            options : customizationData.tableRows ,
            disabled: customizationData.disabled,
            hidden: customizationData.hidden,
            hide_label: customizationData.hide_label,
            custom_css: customizationData.custom_css,
            property_name: customizationData.property_name,
            field_tags: customizationData.field_tags,
            error_label: customizationData.error_label,
            custom_error_message: customizationData.custom_error_message
          },
          wrappers: ['column'],

        }];
      }
    }
    else if (type === 'select'){
      const customizationData = await this.openSelectDialog();
      console.log(customizationData);
      if (customizationData) {
        const label = customizationData.hide_label ? null : customizationData.label;
        newField = [{
          key: customizationData.property_name,
          type: 'select',
          templateOptions : {
            label,
            options : customizationData.tableRows,
            custom_css: customizationData.custom_css,
            required: customizationData.required,
            disabled: customizationData.disabled,
            hidden: customizationData.hidden,
            hide_label: customizationData.hide_label,
            property_name: customizationData.property_name,
            field_tags: customizationData.field_tags,
            error_label: customizationData.error_label,
            custom_error_message: customizationData.custom_error_message
        },
        wrappers: ['column'],

      }]; }
    }
    else if (type === 'Select Multiple'){
      const customizationData = await this.openSelectDialog();
      console.log(customizationData);
      if (customizationData) {

        const label = customizationData.hide_label ? null : customizationData.label;

        newField = [{

          key: customizationData.property_name,
          type: 'select',
          templateOptions : {
            label,
            custom_css: customizationData.custom_css,
            multiple : true,
            options : customizationData.tableRows,
            required: customizationData.required,
            disabled: customizationData.disabled,
            hidden: customizationData.hidden,
            hide_label: customizationData.hide_label,
            property_name: customizationData.property_name,
            field_tags: customizationData.field_tags,
            error_label: customizationData.error_label,
            custom_error_message: customizationData.custom_error_message
          },

        }];
       }

    }

    else if (type === 'checkbox') {
      const customizationData = await this.openCheckboxDialog().toPromise();
      if (customizationData) {
        newField = [{
          type: 'checkbox',
          key: customizationData.property_name,
          templateOptions: {
            label: customizationData.label ,
            disabled: customizationData.disabled,
            hidden: customizationData.hidden,
            hide_label: customizationData.hide_label,
            custom_css: customizationData.custom_css,
            required: customizationData.required,
            property_name: customizationData.property_name,
            field_tags: customizationData.field_tags,
            error_label: customizationData.error_label,
            custom_error_message: customizationData.custom_error_message
          },
          wrappers: ['column'],

          defaultValue: false,
        }];
      }

    } else if (type === 'File'){
      newField = [{
        key: 'file',
        type: 'file',
      }];
    }
   else if (type === 'Columns') {
      const customizationData = await this.openColumnDialog();
      if (customizationData) {
        let columnSizess  = [{size: '', width: ''}] ;
        columnSizess = customizationData.tableRows ;
        this.shareService.emitNumberColumn(columnSizess);
        console.log(columnSizess);
        newField = [
          {
            wrappers: ['columnSize'],

            key: customizationData.property_name, // Key of the wrapper component for columns
            type: 'row',
            fieldArray: {
              type: 'columnSize',
              fieldGroup: [],
            },
          },
        ];

        this.columnSize = customizationData.tableRows;
        this.shareService.emitNumberColumn(this.columnSize);
      }
      console.log(newField);
      this.form = this.fb.group({});
    //  this.formlyForm.resetForm({ model: this.model });
      }
    else {
    //  this.openRadioDialog();
    }

    if (newField.length > 0) {
      console.log(newField);
      newField.forEach(el => {
        this.fields.push(el); });

      // Check if formlyForm is defined before calling resetForm
      if (this.formlyForm) {
        this.formlyForm.resetForm({ model: this.model });
      }
      // Rebuild the form group with the updated fields
      this.form = this.fb.group({});
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
      data: {label: '', placeholder: '',
            tableRows: [{label : '', value: ''}]},
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
      // this.formlyForm.resetForm({ model: this.model, fields: this.fields });
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
   async addFormTemplate() {
    if (this.form.valid) {
      const fieldsId: string[] = [];
      const fieldsGroupId: any[] = [];
      let fieldOptions ;
      let fieldId ;
      for (const field of this.fields) {
        if (field.key) {
          if (field.fieldGroup != null && field.fieldGroup.length > 0) {
            for (const fieldGroup of field.fieldGroup) {
               fieldOptions = await this.saveFieldOptions(fieldGroup);
               const fieldGroupId = await this.saveFieldsGroupWithTemplateOptions(fieldGroup, fieldOptions);
               fieldsGroupId.push(fieldGroupId);
            }
            //field.fieldGroup = fieldsGroupId;
          }
          fieldOptions = await this.saveFieldOptions(field);
          fieldId = await this.saveFieldWithTemplateOptions(field, fieldOptions, fieldsGroupId);
          fieldsId.push(fieldId);
          }
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
    if (field.templateOptions.options != null) {
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
      hide_label: field.templateOptions.hide_label,
      custom_css: field.templateOptions.custom_css,
      property_name: field.templateOptions.property_name,
      field_tags: field.templateOptions.field_tags,
      error_label: field.templateOptions.error_label,
      custom_error_message: field.templateOptions.custom_error_message,
      options: optionValues, // Store option IDs instead of values
      id: this.generateRandomId()
    };

    await this.templateOptionsService.addTemplateOption(templateOptions).toPromise();
    return templateOptions;
  }
  async saveFieldsGroupWithTemplateOptions(field: FormlyFieldConfig, templateOptions: TemplateOptions): Promise<string> {
        const fieldsGroupId: any [] = [];
        const mappedField: Field = {
          type: field.type,
          key: field.key,
          templateOptions, // Store the ID of the templateOptions
          id: this.generateRandomId(),
         //
        };

        const res = await this.fieldService.addField(mappedField).toPromise();
        return res.id;
  }

  async saveFieldWithTemplateOptions(field: FormlyFieldConfig, templateOptions: TemplateOptions, fieldGroupId: any[]): Promise<string> {
    if (field.fieldGroup == null){
      fieldGroupId = [];
     }
    const mappedField: Field = {
      type: field.type,
      key: field.key,
      templateOptions, // Store the ID of the templateOptions
      id: this.generateRandomId(),
      fieldGroup: fieldGroupId,
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
  // tslint:disable-next-line:typedef
  onDragOver(event: DragEvent) {
    event.preventDefault(); // Allow drop by preventing default behavior
  }

  // tslint:disable-next-line:typedef
  onDragLeave(event: DragEvent) {
    event.preventDefault(); // Prevent default behavior to maintain drop zone
  }

}
