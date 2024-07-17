import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, DoCheck, HostListener, NgZone,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormDialogCheckboxComponent} from '../../../fields-dialog/form-dialog-checkbox/form-dialog-checkbox.component';
import {FormlyFormOptions, FormlyFieldConfig, FormlyField} from '@ngx-formly/core';
import {FormDialogComponent} from '../../../fields-dialog/form-dialog/form-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {RadioCustomizeDialogComponent} from '../../../fields-dialog/radio-customize-dialog/radio-customize-dialog.component';
import {FormCreationService} from '../../../../services/form-creation.service';
import {Field} from '../../../../models/Field';
import {TemplateOptions} from '../../../../models/TemplateOptions';
import {Options} from '../../../../models/Options';
import {forkJoin, Observable, Subscription} from 'rxjs';
import {SelectCustomizeDialogComponent} from '../../../fields-dialog/select-customize-dialog/select-customize-dialog.component';
import {TelFormDialogComponent} from '../../../fields-dialog/tel-form-dialog/tel-form-dialog.component';
import {FieldService} from '../../../../services/field.service';
import {OptionsService} from '../../../../services/options.service';
import {TemplateOptionsService} from '../../../../services/template-options.service';
import {DateFormDialogComponent} from '../../../fields-dialog/date-form-dialog/date-form-dialog.component';
import {FormColumnLayoutDialogComponent} from '../../../fields-dialog/form-column-layout-dialog/form-column-layout-dialog.component';
import {AddressCustomizeDialogComponent} from '../../../fields-dialog/address-customize-dialog/address-customize-dialog.component';
import {element, error, promise} from 'protractor';
import {ShareService} from '../../../../services/share.service';
import { FormTableComponent } from '../../../fields-dialog/form-table/form-table.component';
import { TableWrapperComponent } from '../../../table-wrapper/table-wrapper.component';
import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';
import { PanelDialogComponent } from '../../../fields-dialog/panel-dialog/panel-dialog.component';
import {TranslationService} from '../../../../services/translation.service';
import {HtmlDialogComponent} from '../../../fields-dialog/html-dialog/html-dialog.component';
import {IFrameDialogComponent} from '../../../fields-dialog/i-frame-dialog/i-frame-dialog.component';
import { Location } from '@angular/common';
import { LoginService } from 'src/app/Modules/user/services/login.service';
import {ActivatedRoute, Router} from '@angular/router';
import { AuthService } from 'src/app/Modules/user/services/auth.service';
import { FormFileDialogComponent } from '../../../fields-dialog/form-file-dialog/form-file-dialog.component';
import { switchMap } from 'rxjs/operators';
import {TabDialogComponent} from '../../../fields-dialog/tab-dialog/tab-dialog.component';
import {AlertDialogComponent} from '../../../fields-dialog/alert-dialog/alert-dialog.component';
import {StepperDialogComponent} from '../../../fields-dialog/stepper-dialog/stepper-dialog.component';
import {SelectMultipleDialogComponent} from "../../../fields-dialog/select-multiple-dialog/select-multiple-dialog.component";
import {DayFormDialogComponent} from "../../../fields-dialog/day-form-dialog/day-form-dialog.component";
import {FormContentService} from "../../../../services/form-content.service";

@Component({
  selector: 'app-update-form',
  templateUrl: './update-form.component.html',
  styleUrls: ['./update-form.component.css']
})
export class UpdateFormComponent implements OnInit, DoCheck {
  form: FormGroup;
  formHeader: FormGroup;
  formExist = false;
  fields: FormlyFieldConfig[] = [];
  newFields: FormlyFieldConfig[] = [];
  previewfields: FormlyFieldConfig[] = [];
  recentListFields: any[] = [];
  options: FormlyFormOptions = {};
  model: any = {};
  @ViewChild('formlyForm') formlyForm: any;
  formId: string;
  langue: string;
  formTitle: string;
  formDescription: string;
  private changes = false;
  translations: any = {};
  customizationDataMap: Map<string, any> = new Map();
  columnSize: any [ ] = [];
  previewModel: any = {};
  constructor(
    private fb: FormBuilder,
    private formService: FormContentService,
    private formCreationService: FormCreationService,
    private fieldService : FieldService,
    private route: ActivatedRoute,
    private translationService: TranslationService,
    private shareService: ShareService,
    private fbh: FormBuilder,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private newfb: FormBuilder
  ) {
    this.form = this.fb.group({});
    this.formHeader = this.fbh.group({
      title: [''],
      description: ['']
    });
  }
  ngOnInit(): void {
    this.translationService.getCurrentLanguage().subscribe((language: string) => {
      this.loadTranslations();
    });
    this.langue = localStorage.getItem('language');
    this.route.params.subscribe((params) => {
      this.formId = params['id']; // (+) converts string 'id' to a number
      this.getFormTemplateById();
    });
    this.translationService
      .getCurrentLanguage()
      .subscribe((language: string) => {
        this.langue = language;
        // Update form fields on language change
        this.updateFormLabel(language);
      });
    this.form.valueChanges.subscribe((values) => {
      console.log('Form Values:', values);
      console.log('Model:', this.model);
    });

    this.loadTranslations();
  }
  loadTranslations() {
    this.translationService.getCurrentLanguage().subscribe((language: string) => {
      this.translationService.loadTranslations(language).subscribe((translations: any) => {
        console.log('Loaded translations:', translations);
        this.translations = translations;
      });
    });
  }
  updateFormLabel(langue: string) {
    this.fields.forEach((el) => {
      if (langue === 'ar') {
        el.templateOptions.label = el.templateOptions.label_ar;
        el.templateOptions.placeholder = el.templateOptions.placeholder_ar;
      } else if (langue === 'fr' || langue === 'an') {
        el.templateOptions.label = el.templateOptions.label_fr;
        el.templateOptions.placeholder = el.templateOptions.placeholder_fr;
      }
    });
  }
  async getFormTemplateById() {
    try {
      const res = await this.formService.getFormTemplateById(this.formId).toPromise();
      this.formTitle = res.title;
      this.formDescription = res.description;
      this.formExist = true;

      if (!res.fieldIds || res.fieldIds.length === 0) {
        return;
      }
      const fieldObservables = res.fieldIds.map((el: string) => this.formService.getFieldById(el));
      const fields = await forkJoin(fieldObservables).toPromise();
      await this.processFields(fields);
      this.fields = fields;
      this.initializeFormControls(fields);
      console.log('Form Controls:', this.form.controls);
      console.log('Initial Model:', this.model);
      console.log('Fields:', this.fields);
    } catch (error) {
      console.error(error);
    }
  }

  private async processFields(fields: any[]): Promise<void> {
    for (let field of fields) {
      console.log('Processing field:', field); // Debug statement
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
          return options.find((opt) => opt.id === op);
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
            fieldGroupElement.fieldGroup = fieldGroupElement.fieldGroupId;
            const nestedFieldGroupObservables = fieldGroupElement.fieldGroup.map((el: string) =>
              this.formService.getFieldById(el)
            );
            const nestedFieldGroup = await forkJoin(nestedFieldGroupObservables).toPromise();
            fieldGroupElement.fieldGroup = nestedFieldGroup;
          }
        }
        field.fieldGroup = fieldGroup;
      }
      console.log('Processed field:', field); // Debug statement
    }
  }
  initializeFormControls(fields: FormlyFieldConfig[]) {
    const initializeFieldControl = (field: FormlyFieldConfig, parentKey: string = '') => {
      const key = parentKey ? `${parentKey}.${field.key}` : field.key;

      if (field.fieldGroup && field.fieldGroup.length > 0) {
        field.fieldGroup.forEach((nestedField) => initializeFieldControl(nestedField, key));
      } else {
        const control = this.fb.control(field.defaultValue || '');
        this.form.addControl(key.toString(), control);
        // Update model when control value changes
        control.valueChanges.subscribe((value) => {
          this.setModelValue(key.toString(), value);
        });
        // Set initial model value
        this.setModelValue(key.toString(), control.value);
      }
    };
    fields.forEach((field) => initializeFieldControl(field));
    // Log the model after form controls are initialized
    console.log('Model after initializing form controls:', this.model);
  }
  setModelValue(key: string, value: any) {
    const keys = key.split('.');
    let modelPart = this.model;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!modelPart[keys[i]]) {
        modelPart[keys[i]] = {};
      }
      modelPart = modelPart[keys[i]];
    }
    modelPart[keys[keys.length - 1]] = value;
  }
  updateFormAndFields(formId: string, formTemplate: { title: string, version: number, createdAt: Date, description: string }, fields: any[]) {
    // First, update the form template
    this.formCreationService.updateFormTemplate(formTemplate, formId).subscribe(
      res => {
        console.log('Form template updated:', res);

        // If form template update is successful, update the fields
        const fieldObservables = fields.map(field => {
          const fieldId = field.id; // Use the field's _id
          console.log('Updating field:', field); // Log field data before update
          return this.fieldService.editField(fieldId, field);
        });

        forkJoin(fieldObservables).subscribe(
          fieldResults => {
            console.log('Fields updated:', fieldResults);
          },
          fieldErr => {
            console.error('Error updating fields:', fieldErr);
          }
        );

      },
      err => {
        console.error('Error updating form template:', err);
      }
    );
  }

  updateForm(formId: string, formTemplate: { title: string, version: number, createdAt: Date, description: string }) {
    // Prepare the fields array with updated field data
    const updatedFields = this.fields.map(field => ({
      ...field,
      templateOptions: {
        ...field.templateOptions,
      },
      type: field.type, // Ensure the type is included
      id: field.id // Ensure the field's id is included
    }));

    console.log('Updated fields:', updatedFields); // Log updated fields before calling update

    // Call the new method to update form and fields
    this.updateFormAndFields(formId, formTemplate, updatedFields);
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
  saveForm() {
    const titre = this.formHeader.get('title')?.value;
    const description = this.formHeader.get('description')?.value;
    const formTemplate = {
      title: titre,
      version: 1,
      createdAt: new Date(),
      description: description
    };
    this.updateForm(this.formId, formTemplate);
  }
  submitFormTemplate() {
    if (this.form.valid) {
      console.log('Form Model submit:', this.model);
    }
    const formContentId = this.form.get('formContentId')?.value;
  }
  ngDoCheck(): void {
    if (this.fields){
      this.newFields = this.fields;
    }
  }
  deleteField(uniqueKey: string) {
    const fieldIndex = this.fields.findIndex(field => field.key === uniqueKey);

    if (fieldIndex !== -1) {
      const fieldId = this.fields[fieldIndex].id;  // Get the field ID
      const formTemplateId = this.formId;  // Get the form template ID
      this.fields.splice(fieldIndex, 1);
      this.form = this.fb.group({});
      this.fieldService.deleteFieldByIdAndUpdateFormTemplate(fieldId, formTemplateId)
        .subscribe(
          () => {
            console.log('Field deleted and form template updated');
          },
          error => {
            console.error('Error deleting field and updating form template:', error);
          }
        );
    }
  }
  submit() {
    if (this.form.valid) {
      const formValues = this.form.getRawValue();
      console.log('Form Values:', formValues);
    }
  }
  async openCustomizationDialog(fieldKey: string, fieldType: string) {
    const field = this.fields.find(f => f.key === fieldKey);
    if (!field) {
      console.error(`No field found with key ${fieldKey}`);
      return;
    }
    const existingData = field.templateOptions;
    console.log('this is the old data :', existingData);
    let dialogRef;
    const dataToPass = { ...existingData, type: fieldType }; // Ensure type is passed
    console.log('Data passed to dialog:', dataToPass);
    switch(fieldType) {
      case 'text':
      case 'email':
      case 'number':
      case 'url':
        dialogRef = this.dialog.open(FormDialogComponent, {
          width: '1400px',
          data: dataToPass
        });
        break;
      case 'vr_stepper':
      case 'hr_stepper':
        dialogRef = this.dialog.open(StepperDialogComponent, {
          width: '1400px',
          data: dataToPass,
        });
        break;
      case 'address':
        dialogRef = this.dialog.open(AddressCustomizeDialogComponent, {
          width: '1400px',
          data: dataToPass,
        });
        break;
      case 'datetime-local':
        dialogRef = this.dialog.open(DateFormDialogComponent, {
          width: '1400px',
          data: dataToPass,
        });
        break;
      case 'date':
        dialogRef = this.dialog.open(DayFormDialogComponent, {
          width: '1400px',
          data: dataToPass,
        });
        break;
      case 'checkbox':
        dialogRef = this.dialog.open(FormDialogCheckboxComponent, {
          width: '1400px',
          data: dataToPass,
        });
        break;
      case 'select':
        dialogRef = this.dialog.open(SelectCustomizeDialogComponent, {
          width: '1400px',
          data: dataToPass,
        });
        break;
      case 'select-multiple':
        dialogRef = this.dialog.open(SelectMultipleDialogComponent, {
          width: '1400px',
          data: dataToPass,
        });
        break;
      case 'html':
        dialogRef = this.dialog.open(HtmlDialogComponent, {
          width: '1400px',
          data: { ...dataToPass }  // Ensure all relevant data is passed
        });
        break;
      case 'table':
        dialogRef = this.dialog.open(FormTableComponent, {
          width: '1400px',
          data: dataToPass,
        });
        break;
      case 'iframe':
        dialogRef = this.dialog.open(IFrameDialogComponent, {
          width: '1400px',
          data: dataToPass,
        });
        break;
      case 'panel':
        dialogRef = this.dialog.open(PanelDialogComponent, {
          width: '1400px',
          data: dataToPass,
        });
        break;
      case 'file':
        dialogRef = this.dialog.open(FormFileDialogComponent, {
          width: '1400px',
          data: dataToPass,
        });
        break;
      case 'tel':
        dialogRef = this.dialog.open(TelFormDialogComponent, {
          width: '1400px',
          data: dataToPass,
        });
        break;
      case 'radio':
        dialogRef = this.dialog.open(RadioCustomizeDialogComponent, {
          width: '1400px',
          data: dataToPass,
        });
        break;
      case 'tab':
        dialogRef = this.dialog.open(TabDialogComponent, {
          width: '1400px',
          data: dataToPass,
        });
        break;
      default:
        console.error(`Unsupported field type: ${fieldType}`);
        return;
    }
    try {
      const updatedCustomizationData = await dialogRef.afterClosed().toPromise();
      if (updatedCustomizationData) {
        this.customizationDataMap.set(fieldKey, updatedCustomizationData);
        this.updateFieldConfiguration(fieldKey, updatedCustomizationData);
        console.log('this is the updated data', updatedCustomizationData);
      }
    } catch (error) {
      console.error('Error in dialog:', error);
    }
  }
  updateFieldConfiguration(fieldKey: string, customizationData: any) {
    const field = this.fields.find(f => f.key === fieldKey);
    if (!field) {
      console.error(`No field found with key ${fieldKey}`);
      return;
    }
    console.log("this is the customization data :",customizationData);
    // Update the field's properties with the new customization data
    field.type = field.type;
    console.log(field.type);
    field.key = customizationData.property_name;
    field.templateOptions.type = customizationData.type;
    field.templateOptions.label = customizationData.label_fr;
    field.templateOptions.label_fr = customizationData.label_fr;
    field.templateOptions.label_ar = customizationData.label_ar;
    field.templateOptions.placeholder = customizationData.placeholder_fr;
    field.templateOptions.pattern = customizationData.pattern;
    field.templateOptions.multiple = customizationData.multiple;
    field.templateOptions.options = customizationData.tableRows ? customizationData.tableRows.map(row => ({ label: row.label, value: row.value })) : []; // Update options
    field.templateOptions.placeholder_fr = customizationData.placeholder_fr;
    field.templateOptions.placeholder_ar = customizationData.placeholder_ar;
    field.templateOptions.property_name = customizationData.property_name;
    field.templateOptions.minLength = customizationData.minLength;
    field.templateOptions.maxLength = customizationData.maxLength;
    field.templateOptions.required = customizationData.required;
    field.templateOptions.disabled = customizationData.disabled;
    field.templateOptions.hidden = customizationData.hidden;
    field.templateOptions.custom_css = customizationData.custom_css;
    field.templateOptions.hide_label_fr = customizationData.hide_label_fr;
    field.templateOptions.hide_label_ar = customizationData.hide_label_ar;
    field.templateOptions.field_tags = customizationData.field_tags;
    field.templateOptions.error_label = customizationData.error_label;
    field.templateOptions.custom_error_message = customizationData.custom_error_message;
    field.templateOptions.condi_shouldDisplay = customizationData.condi_shouldDisplay;
    field.templateOptions.condi_whenShouldDisplay = customizationData.condi_whenShouldDisplay;
    field.templateOptions.condi_value = customizationData.condi_value;
    field.templateOptions.number_rows = customizationData.number_rows;
    field.templateOptions.number_columns = customizationData.number_columns;
    field.templateOptions.theme = customizationData.theme;
    field.templateOptions.stepper_orientation = customizationData.stepper_orientation;
    field.templateOptions.number_steps = customizationData.number_steps;
    field.templateOptions.link_iframe = this.shareService.changeUrl(customizationData.link_iframe);
    field.templateOptions.collapsible = customizationData.collapsible;
    field.templateOptions.storageType = customizationData.storageType;
    field.templateOptions.minFileSize = customizationData.minFileSize;
    field.templateOptions.maxFileSize = customizationData.maxFileSize;
    field.templateOptions.html_tag = customizationData.html_tag;
    field.templateOptions.html_content = customizationData.html_content;
    field.templateOptions.htmlElement = `<${customizationData.html_tag}>${customizationData.html_content}</${customizationData.html_tag}>`;
// Update tabs if defined
    if (customizationData.tabLabels && Array.isArray(customizationData.tabLabels)) {
      field.templateOptions.tabs = customizationData.tabLabels.map(tab => tab.label);
      console.log(field.templateOptions.tabs);
    } else {
      console.log('this is the tab :', customizationData.tabLabels);
      console.error('Tab labels are not defined or not an array');
    }
    // Trigger a change detection cycle to ensure the form is updated
    this.fields = [...this.fields];
  }
}

