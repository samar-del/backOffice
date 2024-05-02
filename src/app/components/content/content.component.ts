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
import {ShareService} from '../../services/share.service';
import {TranslationService} from "../../services/translation.service";




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
  containerDraggedOver: boolean = false;
  columnSize: any [ ] = [];
  categories: { name: string, fields: FormlyFieldConfig[] }[] = [
    { name: 'Category 1', fields: [] },
    { name: 'Category 2', fields: [] },
    // Add more categories if needed
  ];
  // tslint:disable-next-line:max-line-length
  constructor(private fb: FormBuilder, private newfb: FormBuilder, private dialog: MatDialog, private  formService: FormCreationService, private fieldService: FieldService,
              private optionService: OptionsService, private templateOptionsService: TemplateOptionsService,
              private shareService: ShareService, private translationService: TranslationService) {
    this.form = this.fb.group({});

  }
  ngOnInit(): void {
  }

  // tslint:disable-next-line:typedef
  drop(event: CdkDragDrop<string[]>, droppedItem: string , position: number) {
    if (event.previousContainer === event.container) {
      this.addField(droppedItem);
    //  moveItemInArray(this.fields, event.previousIndex, position);
    }
    else {
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
    let language: string;
    // Subscribe to get the current language
    this.translationService.getCurrentLanguage().subscribe((currentLang: string) => {
      language = currentLang;
    });    // Customize other properties based on the type
    let newField: FormlyFieldConfig[] = [{}];
    if ((language === 'an' && type === 'Text') ||
      (language === 'fr' && type === 'Texte') ||
      (language === 'ar' && type === 'نص')) {
      const customizationData = await this.openInputDialog();
      if (customizationData) {
        const label_fr = customizationData.hide_label ? null : customizationData.label_fr;
        const label_ar = customizationData.hide_label ? null : customizationData.label_ar;
        newField = [{
          type: 'input',
          key: customizationData.propertyName,
          templateOptions: {
            label_fr: label_fr,
            label_ar: label_ar,
            type: 'text',
            placeholder_fr: customizationData.placeholder_fr,
            placeholder_ar: customizationData.placeholder_ar,
            minLength: customizationData.minLength,
            maxLength: customizationData.maxLength,
            required: customizationData.required,
            disabled: customizationData.disabled,
            hidden: customizationData.hidden,
            custom_css: customizationData.custom_css,
            hide_label_fr: customizationData.hide_label_fr,
            hide_label_ar: customizationData.hide_label_ar,
            property_name: customizationData.property_name,
            field_tags: customizationData.field_tags,
            error_label: customizationData.error_label,
            custom_error_message: customizationData.custom_error_message
          },
          wrappers: ['column'],
          expressionProperties: {
            'templateOptions.errorState': (model: any, formState: any) => {
              // Check the length constraints and set error state accordingly
              const value = model[uniqueKey];
              if (value === undefined || value === null) {
                return false; // Value is not defined or null, so no error state
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
      if (customizationData) {
        const label = customizationData.hide_label ? null : customizationData.label;
        if (listFieldAddress.length !== 0) {
          listFieldAddress.forEach(el => {
            const Key = this.generateRandomId();
            field = {
              fieldGroupClassName: 'display-flex',
              wrappers: ['column'],
              fieldGroup: [
                {
                  className: 'flex-1',
                  type: 'input',
                  key: customizationData.propertyName,
                  templateOptions: {
                    label: label,
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
                },
              ],
            };
            newField.push(field);
          });
        }else {
          field = {
            fieldGroupClassName: 'display-flex',
            wrappers: ['column'],
            fieldGroup: [
              {
                className: 'flex-2',
                type: 'input',
                key: customizationData.propertyName,
                templateOptions: {
                  label: label,
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
          key: customizationData.propertyName,
          wrappers: ['column'],
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
            hide_label: customizationData.hide_label,
            property_name: customizationData.property_name,
            field_tags: customizationData.field_tags,
            error_label: customizationData.error_label,
            custom_error_message: customizationData.custom_error_message
          },
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
          key: customizationData.propertyName,
          wrappers: ['column'],
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
            hide_label: customizationData.hide_label,
            property_name: customizationData.property_name,
            field_tags: customizationData.field_tags,
            error_label: customizationData.error_label,
            custom_error_message: customizationData.custom_error_message
          },
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
          key: customizationData.propertyName,
          wrappers: ['column'],
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
            property_name: customizationData.property_name,
            field_tags: customizationData.field_tags,
            error_label: customizationData.error_label,
            custom_error_message: customizationData.custom_error_message,
            pattern: customizationData.pattern || '^[2-579]{2}\\s?\\d{2}\\s?\\d{2}\\s?\\d{2}$', // Tunisian phone number pattern
          },
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
          key: customizationData.propertyName,
          wrappers: ['column'],
          templateOptions: {
            label: label,
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
          key: customizationData.propertyName,
          wrappers: ['column'],
          templateOptions: {
            label: label,
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
          key: customizationData.propertyName,
          wrappers: ['column'],
          templateOptions: {
            label: label,
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
          key: customizationData.propertyName,
          wrappers: ['column'],
          templateOptions: {
            label: label,
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
        }];
      }
    }
    else if (type === 'select'){
      const customizationData = await this.openSelectDialog();
      console.log(customizationData);
      if (customizationData) {
        const label = customizationData.hide_label ? null : customizationData.label;
        newField = [{
          key: customizationData.propertyName,
          type: 'select',
          wrappers: ['column'],
          templateOptions : {
            label: label,
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
      }]; }
    }
    else if (type === 'Select Multiple'){
      const customizationData = await this.openSelectDialog();
      console.log(customizationData);
      if (customizationData) {
        const label = customizationData.hide_label ? null : customizationData.label;
        newField = [{
          key: customizationData.propertyName,
          wrappers: ['column'],
          type: 'select',
          templateOptions : {
            label: label,
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
        }]; }
    }
    else if (type === 'checkbox') {
      const customizationData = await this.openCheckboxDialog().toPromise();
      if (customizationData) {
        newField = [{
          type: 'checkbox',
          key: customizationData.propertyName,
          wrappers: ['column'],
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
            key: customizationData.propertyName, // Key of the wrapper component for columns
            type: 'row',
            fieldArray: {
              type: 'columnSize',
              fieldGroup: [],
            },
            wrappers: ['columnSize'],
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
      data: {label_fr: '', label_ar:'', placeholder_fr: '',placeholder_ar: ''},
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
      label_fr: field.templateOptions.label_fr,
      label_ar: field.templateOptions.label_ar,
      disabled: field.templateOptions.disabled,
      placeholder_fr: field.templateOptions.placeholder_fr,
      placeholder_ar: field.templateOptions.placeholder_ar,
      maxlength: field.templateOptions.maxLength,
      minlength: field.templateOptions.minLength,
      pattern: field.templateOptions.pattern,
      multiple: field.templateOptions.multiple,
      type: field.templateOptions.type,
      required: field.templateOptions.required,
      hidden: field.templateOptions.hidden,
      hide_label_fr:field.templateOptions.hide_label_fr,
      hide_label_ar:field.templateOptions.hide_label_ar,
      custom_css:field.templateOptions.custom_css,
      property_name:field.templateOptions.property_name,
      field_tags:field.templateOptions.field_tags,
      error_label:field.templateOptions.error_label,
      custom_error_message:field.templateOptions.custom_error_message,
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

}
