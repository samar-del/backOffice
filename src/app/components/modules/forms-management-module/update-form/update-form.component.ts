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
        this.changes = true;

      }
    }
  }
  // tslint:disable-next-line:typedef
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

  updateForm(formId: string, formTemplate: { title: string, version: number, createdAt: Date, description: string }) {
    this.formCreationService.updateFormTemplate(formTemplate, formId).subscribe(
      res => {
        console.log('Form template updated:', res);
      },
      err => console.error('Error updating form template:', err)
    );
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

  async updateField(type: any) {
    const uniqueKey = `newInput_${this.fields.length + 1}`;
    let language: string;
    // Subscribe to get the current language
    this.translationService.getCurrentLanguage().subscribe((currentLang: string) => {
      language = currentLang;
    });
    let newField: FormlyFieldConfig[] = [{}];
    if ((language === 'an' && type === 'Text') ||
      (language === 'fr' && type === 'Texte') ||
      (language === 'ar' && type === 'نص')) {
      const customizationData = await this.openInputDialog();
      const listeCondition = customizationData.tableRows;
      // Assuming you have a map to store customization data by field key

      if (customizationData) {
        this.customizationDataMap = new Map();
        this.customizationDataMap.set(customizationData.property_name, customizationData);
        console.log(this.customizationDataMap.set(customizationData.property_name, customizationData));
        console.log('type :' , customizationData.type);
        const label_fr = customizationData.hide_label ? null : customizationData.label_fr;
        const label_ar = customizationData.hide_label ? null : customizationData.label_ar;
        const placeholder_fr = customizationData.placeholder_fr;
        const placeholder_ar = customizationData.placeholder_ar;
        newField = [{

          type: 'input',
          key: customizationData.property_name,
          templateOptions: {
            label: language === 'ar' ? customizationData.label_ar : customizationData.label_fr,
            label_fr,
            label_ar,
            type: 'text',
            placeholder: language === 'ar' ? customizationData.placeholder_ar : customizationData.placeholder_fr,
            placeholder_fr,
            placeholder_ar,
            minLength: customizationData.minLength,
            maxLength: customizationData.maxLength,
            required: customizationData.required,
            disabled: customizationData.disabled,
            // hidden: customizationData.hidden,
            custom_css: customizationData.custom_css,
            hide_label_fr: customizationData.hide_label_fr,
            hide_label_ar: customizationData.hide_label_ar,
            property_name: customizationData.property_name,
            field_tags: customizationData.field_tags,
            error_label: customizationData.error_label,
            custom_error_message: customizationData.custom_error_message,
            condi_shouldDisplay: customizationData.condi_shouldDisplay,
            condi_whenShouldDisplay: customizationData.condi_whenShouldDisplay,
            condi_value: customizationData.condi_value,
            condition: listeCondition.forEach(el => {
              const conditionValues = {keyCondition: el.keyCondition, valueCondition: el.valueCondition};
              return conditionValues;
            })
          },
          // wrappers: ['column'],
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
            'templateOptions.hidden': (model: any, formState: any) => {
              if (!customizationData.condi_whenShouldDisplay) {
                return false;
              }
              const fieldValue = model[customizationData.condi_whenShouldDisplay];
              return fieldValue !== customizationData.condi_value;
            }
          },
        }];
        this.cdr.detectChanges();
      }
    }

    if ((language === 'an' && type === 'HTML Element') ||
      (language === 'fr' && type === 'Element HTML') ||
      (language === 'ar' && type === 'عنصر HTML')) {
      const customizationData = await this.openHTMLDialog();
      console.log(customizationData);
      if (customizationData) {
        this.customizationDataMap = new Map();
        this.customizationDataMap.set(customizationData.property_name, customizationData);
        console.log(this.customizationDataMap.set(customizationData.property_name, customizationData));

        const label_fr = customizationData.hide_label ? null : customizationData.label_fr;
        const label_ar = customizationData.hide_label ? null : customizationData.label_ar;
        const htmlElement = customizationData.htmlElement;
        console.log(htmlElement);
        newField = [{
          type: 'html',
          key: customizationData.property_name,
          templateOptions: {
            label_fr,
            label_ar,
            html_tag: customizationData.html_tag,
            html_content: customizationData.html_content,
            htmlElement,
            type: 'html',
            minLength: customizationData.minLength,
            maxLength: customizationData.maxLength,
            required: customizationData.required,
            disabled: customizationData.disabled,
            custom_css: customizationData.custom_css,
            hide_label_fr: customizationData.hide_label_fr,
            hide_label_ar: customizationData.hide_label_ar,
            property_name: customizationData.property_name,
            field_tags: customizationData.field_tags,
            error_label: customizationData.error_label,
            custom_error_message: customizationData.custom_error_message,
            condi_shouldDisplay: customizationData.condi_shouldDisplay,
            condi_whenShouldDisplay: customizationData.condi_whenShouldDisplay,
            condi_value: customizationData.condi_value
          },
          // wrappers: ['column'],
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
        if (customizationData.condi_shouldDisplay && customizationData.condi_shouldDisplay) {
          if (customizationData.condi_shouldDisplay === true) {
            this.fields.forEach(el => {
              if (el.key === customizationData.condi_shouldDisplay) {
                if (el.model === customizationData.condi_value) {
                  newField.map(field => {
                    field.hide = false;
                    this.previewfields.push(field);
                  });
                }
              }
            });
          } else {
            this.fields.forEach(el => {
              if (el.key === customizationData.condi_shouldDisplay) {
                if (el.model === customizationData.condi_value) {
                  newField.map(field => {
                    field.hide = true;
                    this.previewfields.push(field);
                  });
                }
              }
            });
          }
        }

      }
    }

    if ((language === 'an' && type === 'Address') ||
      (language === 'fr' && type === 'Adresse') ||
      (language === 'ar' && type === 'العنوان')) {
      const customizationData = await this.openAddressDialog();
      let field: FormlyFieldConfig = {};
      const listFieldAddress = customizationData.tableRows;
      this.shareService.emitAddressOptions(listFieldAddress);
      if (customizationData) {
        this.customizationDataMap = new Map();
        this.customizationDataMap.set(customizationData.property_name, customizationData);
        console.log(this.customizationDataMap.set(customizationData.property_name, customizationData));

        const listFieldAddress = customizationData.tableRows || [];
        this.shareService.emitAddressOptions(listFieldAddress);

        const newField: FormlyFieldConfig[] = [];
        const label_fr = customizationData.label_fr;
        const label_ar = customizationData.label_ar;
        const property_name = customizationData.property_name;

        if (listFieldAddress.length !== 0) {
          const field: FormlyFieldConfig = {
            type: 'column',
            key: property_name,
            templateOptions: {
              label: language === 'ar' ? label_ar : label_fr,
              label_fr,
              label_ar,
              type: 'address',
              minLength: customizationData.minLength,
              maxLength: customizationData.maxLength,
              required: customizationData.required,
              disabled: customizationData.disabled,
              hidden: customizationData.hidden,
              custom_css: customizationData.custom_css,
              property_name,
              field_tags: customizationData.field_tags,
              error_label: customizationData.error_label,
              custom_error_message: customizationData.custom_error_message
            },
            wrappers: ['column'],
            fieldGroup: [],
          };
          listFieldAddress.forEach(el => {
            const Key = this.generateRandomId();
            const fieldGroupElem = {
              type: 'input',
              wrappers: ['address-wrapper'],
              key: this.generateRandomId(), // Ensure unique key for each input
              templateOptions: {
                label: el.label_row,
                placeholder: el.placeholder_row,
                custom_css: customizationData.custom_css,
                property_name,
                field_tags: customizationData.field_tags,
                error_label: customizationData.error_label,
                custom_error_message: customizationData.custom_error_message
              },
            };
            field.fieldGroup.push(fieldGroupElem);
          });
          newField.push(field);
          console.log('New Field:', newField);

          // Update the fields in Formly form
          this.fields = [...this.fields, ...newField];
          //this.cdr.detectChanges(); // Trigger change detection
        }
        else {
          const field: FormlyFieldConfig = {
            fieldGroupClassName: 'display-flex',
            fieldGroup: [
              {
                type: 'input',
                key: property_name,
                templateOptions: {
                  label: language === 'ar' ? label_ar : label_fr,
                  label_fr,
                  label_ar,
                  placeholder: customizationData.placeholder,
                  disabled: customizationData.disabled,
                  hidden: customizationData.hidden,
                  custom_css: customizationData.custom_css,
                  property_name,
                  field_tags: customizationData.field_tags,
                  error_label: customizationData.error_label,
                  custom_error_message: customizationData.custom_error_message
                }
              },
            ],
          };
          newField.push(field);
          console.log('New Field:', newField);

          //this.fields = [...this.fields, ...newField];
        }
      }
    }
    if ((language === 'an' && type === 'Email') ||
      (language === 'fr' && type === 'E-mail') ||
      (language === 'ar' && type === 'البريد الإلكتروني')) {
      const customizationData = await this.openInputDialog();
      // @ts-ignore
      if (customizationData) {
        this.customizationDataMap = new Map();
        this.customizationDataMap.set(customizationData.property_name, customizationData);
        console.log(this.customizationDataMap.set(customizationData.property_name, customizationData));
        const label_fr = customizationData.hide_label ? null : customizationData.label_fr;
        const label_ar = customizationData.hide_label ? null : customizationData.label_ar;
        const placeholder_fr = customizationData.placeholder_fr;
        const placeholder_ar = customizationData.placeholder_ar;

        newField = [{
          type: 'input',
          key: customizationData.property_name,
          templateOptions: {
            label: language === 'ar' ? customizationData.label_ar : customizationData.label_fr,
            label_fr,
            label_ar,
            type: 'email',
            placeholder: language === 'ar' ? customizationData.placeholder_ar : customizationData.placeholder_fr,
            placeholder_fr,
            placeholder_ar,
            minLength: customizationData.minLength,
            maxLength: customizationData.maxLength,
            custom_css: customizationData.custom_css,
            required: customizationData.required,
            disabled: customizationData.disabled,
            hidden: customizationData.hidden,
            hide_label_fr: customizationData.hide_label_fr,
            hide_label_ar: customizationData.hide_label_ar,
            property_name: customizationData.property_name,
            field_tags: customizationData.field_tags,
            error_label: customizationData.error_label,
            custom_error_message: customizationData.custom_error_message,

          },
          // wrappers: ['column'],


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
          // Customize other properties as needed
        }];
        this.cdr.detectChanges();
      }
    }
    if ((language === 'an' && type === 'IFrame') ||
      (language === 'fr' && type === 'IFrame') ||
      (language === 'ar' && type === 'IFrame')) {
      const customizationData = await this.openIFrameDialog();
      const link_iframe = customizationData.link_iframe;
      this.shareService.changeUrl(link_iframe);

      // @ts-ignore
      if (customizationData) {
        this.customizationDataMap = new Map();
        this.customizationDataMap.set(customizationData.property_name, customizationData);
        console.log(this.customizationDataMap.set(customizationData.property_name, customizationData));

        const label_fr = customizationData.hide_label ? null : customizationData.label_fr;
        const label_ar = customizationData.hide_label ? null : customizationData.label_ar;

        newField = [{
          type: 'iframe',
          key: customizationData.property_name,
          // wrappers: ['column'],
          templateOptions: {
            label: language === 'ar' ? customizationData.label_ar : customizationData.label_fr,
            label_fr,
            label_ar,
            type: 'iframe',
            link_iframe: link_iframe,
            custom_css: customizationData.custom_css,
            required: customizationData.required,
            hidden: customizationData.hidden,
            hide_label_fr: customizationData.hide_label_fr,
            hide_label_ar: customizationData.hide_label_ar,
            property_name: customizationData.property_name,
            field_tags: customizationData.field_tags,
            error_label: customizationData.error_label,
            custom_error_message: customizationData.custom_error_message
          },
          expressionProperties: {
            'templateOptions.errorState': (model: any, formState: any) => {
              // Check the length constraints and set error state accordingly
              const value = model[uniqueKey];
              if (value === undefined || value === null) {
                return false; // Value is not defined or null, so no error state
              }
              return value;
            },
          },
          // Customize other properties as needed
        }];
      }
    }

    if ((language === 'an' && type === 'Url') ||
      (language === 'fr' && type === 'URL') ||
      (language === 'ar' && type === 'عنوان URL')) {
      const customizationData = await this.openInputDialog();
      // @ts-ignore
      if (customizationData) {
        this.customizationDataMap = new Map();
        this.customizationDataMap.set(customizationData.property_name, customizationData);
        console.log(this.customizationDataMap.set(customizationData.property_name, customizationData));

        this.customizationDataMap.set(customizationData.property_name, customizationData);
        console.log(this.customizationDataMap.set(customizationData.property_name, customizationData));
        const label_fr = customizationData.hide_label ? null : customizationData.label_fr;
        const label_ar = customizationData.hide_label ? null : customizationData.label_ar;
        const placeholder_fr = customizationData.placeholder_fr;
        const placeholder_ar = customizationData.placeholder_ar;
        newField = [{
          type: 'input',
          key: customizationData.property_name,
          templateOptions: {
            label: language === 'ar' ? customizationData.label_ar : customizationData.label_fr,
            label_fr,
            label_ar,
            type: 'url',
            placeholder: language === 'ar' ? customizationData.placeholder_ar : customizationData.placeholder_fr,
            placeholder_fr,
            placeholder_ar,
            minLength: customizationData.minLength,
            maxLength: customizationData.maxLength,
            custom_css: customizationData.custom_css,
            required: customizationData.required,
            disabled: customizationData.disabled,
            hidden: customizationData.hidden,
            hide_label_fr: customizationData.hide_label_fr,
            hide_label_ar: customizationData.hide_label_ar,
            property_name: customizationData.property_name,
            field_tags: customizationData.field_tags,
            error_label: customizationData.error_label,
            custom_error_message: customizationData.custom_error_message
          },
          // wrappers: ['column'],

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
          // Customize other properties as needed
        }];
      }
    }
    if ((language === 'an' && type === 'Phone Number') ||
      (language === 'fr' && type === 'Numéro de téléphone') ||
      (language === 'ar' && type === 'رقم الهاتف')) {
      const customizationData = await this.openPhoneDialog();
      // @ts-ignore
      if (customizationData) {
        this.customizationDataMap = new Map();
        this.customizationDataMap.set(customizationData.property_name, customizationData);
        console.log(this.customizationDataMap.set(customizationData.property_name, customizationData));

        const label_fr = customizationData.hide_label ? null : customizationData.label_fr;
        const label_ar = customizationData.hide_label ? null : customizationData.label_ar;
        const placeholder_fr = customizationData.placeholder_fr;
        const placeholder_ar = customizationData.placeholder_ar;
        newField = [{
          type: 'input',
          key: customizationData.property_name,
          templateOptions: {
            label: language === 'ar' ? customizationData.label_ar : customizationData.label_fr,
            label_fr,
            label_ar,
            type: 'tel',
            placeholder: language === 'ar' ? customizationData.placeholder_ar : customizationData.placeholder_fr,
            placeholder_fr,
            placeholder_ar,
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
          // wrappers: ['column'],

          expressionProperties: {
            'templateOptions.errorState': (model: any, formState: any) => {
              // Check the length constraints and set error state accordingly
              const value = model[uniqueKey];
              if (value === undefined || value === null) {
                return false; // Value is not defined or null, so no error state
              }
              const isValidPhoneNumber = new RegExp(customizationData.pattern || '^[2-579]{2}\\s?\\d{2}\\s?\\d{2}\\s?\\d{2}$').test(value);
              const minLength = customizationData.minLength || 0;
              const maxLength = customizationData.maxLength || Infinity;
              return value.length < minLength || value.length > maxLength || !isValidPhoneNumber;
            },
          },
          // Customize other properties as needed
        }];
      }
    }
    if ((language === 'an' && type === 'Date / Time') ||
      (language === 'fr' && type === 'Date / Heure') ||
      (language === 'ar' && type === 'تاريخ / وقت')) {
      const customizationData = await this.openDateDialog();
      // @ts-ignore
      if (customizationData) {
        this.customizationDataMap = new Map();
        this.customizationDataMap.set(customizationData.property_name, customizationData);
        console.log(this.customizationDataMap.set(customizationData.property_name, customizationData));

        const label_fr = customizationData.hide_label_fr ? null : customizationData.label_fr;
        const label_ar = customizationData.hide_label_ar ? null : customizationData.label_ar;
        newField = [{
          type: 'input',
          key: customizationData.property_name,
          templateOptions: {
            label: language === 'ar' ? customizationData.label_ar : customizationData.label_fr,
            label_fr,
            label_ar,
            type: 'datetime-local',
            custom_css: customizationData.custom_css,
            required: customizationData.required,
            disabled: customizationData.disabled,
            hidden: customizationData.hidden,
            hide_label_fr: customizationData.hide_label_fr,
            hide_label_ar: customizationData.hide_label_ar,
            property_name: customizationData.property_name,
            field_tags: customizationData.field_tags,
            error_label: customizationData.error_label,
            custom_error_message: customizationData.custom_error_message
          },
          // wrappers: ['column'],

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
    if ((language === 'an' && type === 'Day') ||
      (language === 'fr' && type === 'Jour') ||
      (language === 'ar' && type === 'اليوم')) {
      const customizationData = await this.openDayDialog();
      // @ts-ignore
      if (customizationData) {
        this.customizationDataMap = new Map();
        this.customizationDataMap.set(customizationData.property_name, customizationData);
        console.log(this.customizationDataMap.set(customizationData.property_name, customizationData));

        const label_fr = customizationData.hide_label_fr ? null : customizationData.label_fr;
        const label_ar = customizationData.hide_label_ar ? null : customizationData.label_ar;
        newField = [{
          type: 'input',
          key: customizationData.property_name,
          templateOptions: {
            label: language === 'ar' ? customizationData.label_ar : customizationData.label_fr,
            label_fr,
            label_ar,
            type: 'date',
            custom_css: customizationData.custom_css,
            required: customizationData.required,
            disabled: customizationData.disabled,
            hidden: customizationData.hidden,
            hide_label_fr: customizationData.hide_label_fr,
            hide_label_ar: customizationData.hide_label_ar,
            property_name: customizationData.property_name,
            field_tags: customizationData.field_tags,
            error_label: customizationData.error_label,
            custom_error_message: customizationData.custom_error_message
          },
          // wrappers: ['column'],

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
    } else if ((language === 'an' && type === 'Number') ||
      (language === 'fr' && type === 'Nombre') ||
      (language === 'ar' && type === 'عدد')) {
      const customizationData = await this.openInputDialog();
      // @ts-ignore
      if (customizationData) {
        this.customizationDataMap = new Map();
        this.customizationDataMap.set(customizationData.property_name, customizationData);
        console.log(this.customizationDataMap.set(customizationData.property_name, customizationData));

        const label_fr = customizationData.hide_label ? null : customizationData.label_fr;
        const label_ar = customizationData.hide_label ? null : customizationData.label_ar;
        const placeholder_fr = customizationData.placeholder_fr;
        const placeholder_ar = customizationData.placeholder_ar;

        newField = [{
          type: 'input',
          key: customizationData.property_name,
          templateOptions: {
            label: language === 'ar' ? customizationData.label_ar : customizationData.label_fr,
            label_fr,
            label_ar,
            type: 'number',
            placeholder: language === 'ar' ? customizationData.placeholder_ar : customizationData.placeholder_fr,
            placeholder_fr,
            placeholder_ar,
            minLength: customizationData.minLength,
            maxLength: customizationData.maxLength,
            disabled: customizationData.disabled,
            hidden: customizationData.hidden,
            hide_label_fr: customizationData.hide_label_fr,
            hide_label_ar: customizationData.hide_label_ar,
            custom_css: customizationData.custom_css,
            property_name: customizationData.property_name,
            field_tags: customizationData.field_tags,
            error_label: customizationData.error_label,
            custom_error_message: customizationData.custom_error_message
          },
          // wrappers: ['column'],

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
    } else if ((language === 'an' && type === 'Radio button') ||
      (language === 'fr' && type === 'Bouton radio') ||
      (language === 'ar' && type === 'راديو')) {
      const customizationData = await this.openRadioDialog();
      if (customizationData) {
        this.customizationDataMap = new Map();
        this.customizationDataMap.set(customizationData.property_name, customizationData);
        console.log(this.customizationDataMap.set(customizationData.property_name, customizationData));

        newField = [{
          type: 'radio',
          key: customizationData.property_name,
          templateOptions: {
            label: language === 'ar' ? customizationData.label_ar : customizationData.label_fr,
            label_fr: customizationData.label_fr,
            label_ar: customizationData.label_ar,
            type: 'radio',
            options: customizationData.tableRows,
            disabled: customizationData.disabled,
            hidden: customizationData.hidden,
            custom_css: customizationData.custom_css,
            property_name: customizationData.property_name,
            field_tags: customizationData.field_tags,
            error_label: customizationData.error_label,
            custom_error_message: customizationData.custom_error_message
          },
          // wrappers: ['column'],

        }];
      }
    } else if ((language === 'an' && type === 'Select') ||
      (language === 'fr' && type === 'Sélectionner') ||
      (language === 'ar' && type === 'اختيار')) {
      const customizationData = await this.openSelectDialog();
      console.log(customizationData);
      if (customizationData) {
        this.customizationDataMap = new Map();
        this.customizationDataMap.set(customizationData.property_name, customizationData);
        console.log(this.customizationDataMap.set(customizationData.property_name, customizationData));

        newField = [{
          key: customizationData.property_name,
          type: 'select',
          templateOptions: {
            label: language === 'ar' ? customizationData.label_ar : customizationData.label_fr,
            label_fr: customizationData.label_fr,
            label_ar: customizationData.label_ar,
            type: 'select',
            options: customizationData.tableRows,
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
          // wrappers: ['column'],

        }];
      }
    } else if ((language === 'an' && type === 'Select Multiple') ||
      (language === 'fr' && type === 'Sélection multiple') ||
      (language === 'ar' && type === 'اختيار متعدد')) {
      const customizationData = await this.openSelectMultipleDialog();
      console.log(customizationData);
      if (customizationData) {
        this.customizationDataMap = new Map();
        this.customizationDataMap.set(customizationData.property_name, customizationData);
        console.log(this.customizationDataMap.set(customizationData.property_name, customizationData));

        newField = [{

          key: customizationData.property_name,
          type: 'select',
          templateOptions: {
            label: language === 'ar' ? customizationData.label_ar : customizationData.label_fr,
            label_fr: customizationData.label_fr,
            label_ar: customizationData.label_ar,
            type: customizationData.type,
            custom_css: customizationData.custom_css,
            multiple: true,
            options: customizationData.tableRows,
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

    } else if ((language === 'an' && type === 'Checkbox') ||
      (language === 'fr' && type === 'Case à cocher') ||
      (language === 'ar' && type === 'خانة اختيار')) {
      const customizationData = await this.openCheckboxDialog().toPromise();
      if (customizationData) {
        this.customizationDataMap = new Map();
        this.customizationDataMap.set(customizationData.property_name, customizationData);
        console.log(this.customizationDataMap.set(customizationData.property_name, customizationData));

        const label_fr = customizationData.label_fr;
        const label_ar = customizationData.label_ar;

        newField = [{
          type: 'checkbox',
          key: customizationData.property_name,
          templateOptions: {
            label: language === 'ar' ? customizationData.label_ar : customizationData.label_fr,
            label_fr,
            label_ar,
            type: 'checkbox',
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
          // wrappers: ['column'],

          defaultValue: false,
        }];
      }

    } else if  ((language === 'an' && type === 'File') ||
      (language === 'fr' && type === 'Fichier') ||
      (language === 'ar' && type === 'خانة اختيار')) {
      const customizationData = await this.openFileDialog().toPromise();
      if (customizationData){
        this.customizationDataMap = new Map();
        this.customizationDataMap.set(customizationData.property_name, customizationData);
        console.log(this.customizationDataMap.set(customizationData.property_name, customizationData));

        const label_fr = customizationData.label_fr;
        const label_ar = customizationData.label_ar;

        newField = [{
          type: 'file',
          key: customizationData.property_name,

          templateOptions: {
            label: language === 'ar' ? customizationData.label_ar : customizationData.label_fr,
            label_fr,
            label_ar,
            type: 'file',
            disabled: customizationData.disabled,
            hidden: customizationData.hidden,
            hide_label: customizationData.hide_label,
            custom_css: customizationData.custom_css,
            required: customizationData.required,
            property_name: customizationData.property_name,
            field_tags: customizationData.field_tags,
            error_label: customizationData.error_label,
            custom_error_message: customizationData.custom_error_message,
            storageType:customizationData.storageType,
            minFileSize:customizationData.minFileSize,
            maxFileSize:customizationData.maxFileSize
          },
        }];
      }
      /*{
       const label_fr = customizationData.label_fr;
       const label_ar = customizationData.label_ar;

     newField = [{
       key: customizationData.property_name,
       type: 'file',
       templateOptions: {
         label: language === 'ar' ? customizationData.label_ar : customizationData.label_fr,
         label_fr,
         label_ar,
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
     }];
   }*/

    } else if (type === 'Columns') {

      const customizationData = await this.openColumnDialog();
      if (customizationData) {
        let columnSizess = [{size: '', width: ''}];
        columnSizess = customizationData.tableRows;
        let columnField: FormlyFieldConfig;
        const columnFields = [];
        this.shareService.emitNumberColumn(columnSizess);
        for (let j = 0; j < columnSizess.length; j++) {
          columnField = {
            key: 'col-' + columnSizess[j].size + '-' + columnSizess[j].width,
            type: 'column',
            fieldGroup: [],
            wrappers: ['column'],
          } ;
          columnFields.push(columnField);
        }
        newField = [
          {
            key: customizationData.propertyName, // Key of the wrapper component for columns
            type: 'row',
            fieldGroup: columnFields,
            wrappers: ['columnSize'],
          }
        ];

        this.columnSize = customizationData.tableRows;
        this.shareService.emitNumberColumn(this.columnSize);
      }
      console.log(newField);
      this.form = this.fb.group({});
      //  this.formlyForm.resetForm({ model: this.model });
    } else if ((language === 'an' && type === 'Table') ||
      (language === 'fr' && type === 'Tableau') ||
      (language === 'ar' && type === 'جدول')) {
      const customizationData = await this.openTableDialog();
      if (customizationData) {
        this.customizationDataMap = new Map();
        this.customizationDataMap.set(customizationData.property_name, customizationData);
        console.log(this.customizationDataMap.set(customizationData.property_name, customizationData));

        const tableRows: FormlyFieldConfig[] = [];
        // let tableRows: FormlyFieldConfig[] = [
        //   {
        //     type: 'row',
        //     fieldGroup: []
        //   }
        // ];
        let tableRow: FormlyFieldConfig;
        let columnField: FormlyFieldConfig = {};
        // const columnFieldsByRow: FormlyFieldConfig[] = [];
        // Generate table rows with the specified number of rows and columns
        for (let i = 0; i < customizationData.number_rows; i++) {
          const columnFieldsByRow: FormlyFieldConfig[] = [];
          for (let j = 0; j < customizationData.number_columns; j++) {
            columnField = {
              key: 'column' + Math.floor(Math.random() * 90) + j,
              type: 'column',
              fieldGroup: [],
            } ;
            columnFieldsByRow.push(columnField);
            console.log(tableRow);
          }
          tableRow = {
            key: 'row' + Math.floor(Math.random() * 90) + i,
            type: 'row',
            fieldGroup: columnFieldsByRow,
          };
          tableRows.push(tableRow);
        }
        console.log(tableRow);
        newField = [{
          type: 'table',
          fieldGroup: tableRows,
          key: customizationData.property_name,
          templateOptions: {
            type: 'table',
            label: language === 'ar' ? customizationData.label_ar : customizationData.label_fr,
            label_fr: customizationData.label_fr,
            label_ar: customizationData.label_ar,
            number_rows: customizationData.number_rows,
            number_columns: customizationData.number_columns,
            custom_css: customizationData.custom_css,
            property_name: customizationData.property_name,
            field_tags: customizationData.field_tags,
            hide_label_fr: customizationData.hide_label_fr,
            hide_label_ar: customizationData.hide_label_ar,
          },
          // wrappers: ['column'],
        }];
        console.log(newField);
      }
    } else if (
      (language === 'an' && type === 'Tabs') ||
      (language === 'fr' && type === 'Onglets') ||
      (language === 'ar' && type === 'نوافذ التبويب')
    ) {
      const customizationData = await this.openTabDialog();
      if (customizationData) {
        this.customizationDataMap = new Map();
        this.customizationDataMap.set(customizationData.property_name, customizationData);
        console.log(this.customizationDataMap.get(customizationData.property_name));
        const tabs: FormlyFieldConfig[] = customizationData.tabLabels.map((tabLabel: any, index: number) => {
          return {
            templateOptions: { label: tabLabel.label,type: 'tab' },
            fieldGroup : [],
          };
        });

        newField = [
          {
            type: 'tab',
            fieldGroup: tabs,
            key: customizationData.property_name,
            templateOptions: {
              type: 'tab',
              label: language === 'ar' ? customizationData.label_ar : customizationData.label_fr,
              label_fr: customizationData.label_fr,
              label_ar: customizationData.label_ar,
              number_tabs: customizationData.tabLabels.length,
              custom_css: customizationData.custom_css,
              property_name: customizationData.property_name,
              field_tags: customizationData.field_tags,
              hide_label_fr: customizationData.hide_label_fr,
              hide_label_ar: customizationData.hide_label_ar,
              tabs: customizationData.tabs,
            },
            //wrappers: ['column'],
          },
        ];
        console.log(newField);
      }
    }
    else if (
      (language === 'an' && type === 'Stepper') ||
      (language === 'fr' && type === 'Étapes') ||
      (language === 'ar' && type === 'متدرج')
    ) {
      const customizationData = await this.openStepperDialog(); // Updated to use the stepper dialog
      const newFieldType = customizationData.stepper_orientation === 'horizontal' ? 'hr_stepper' : 'vr_stepper';
      if (customizationData) {
        this.customizationDataMap = new Map();
        this.customizationDataMap.set(customizationData.property_name, customizationData);
        const steps: FormlyFieldConfig[] = customizationData.stepperLabels.map((stepLabel: any, index: number) => {
          return {
            templateOptions: {
              label: stepLabel.label,
            },
            fieldGroup: [
              {
              }
            ]
          };
        });

        newField = [
          {
            type: newFieldType,
            fieldGroup: steps,
            key: customizationData.property_name,
            templateOptions: {
              type: newFieldType,
              label: language === 'ar' ? customizationData.label_ar : customizationData.label_fr,
              label_fr: customizationData.label_fr,
              label_ar: customizationData.label_ar,
              number_steps: customizationData.stepperLabels.length,
              custom_css: customizationData.custom_css,
              property_name: customizationData.property_name,
              field_tags: customizationData.field_tags,
              hide_label_fr: customizationData.hide_label_fr,
              hide_label_ar: customizationData.hide_label_ar,
              steps: customizationData.stepperLabels,
              orientation: customizationData.orientation
            },

          },
        ];
        console.log(newField);
      }
    }

    else if ((language === 'an' && type === 'Panel') ||
      (language === 'fr' && type === 'Panneau') ||
      (language === 'ar' && type === 'لوحة')) {
      const customizationData = await this.openPanelDialog();
      if (customizationData) {
        this.customizationDataMap = new Map();
        this.customizationDataMap.set(customizationData.property_name, customizationData);
        console.log(this.customizationDataMap.set(customizationData.property_name, customizationData));

        newField = [{
          type: 'panel',
          key: customizationData.property_name,
          templateOptions: {
            type: 'panel',
            label: language === 'ar' ? customizationData.label_ar : customizationData.label_fr,
            label_fr: customizationData.label_fr,
            label_ar: customizationData.label_ar,
            theme: customizationData.theme,
            disabled: customizationData.disabled,
            hidden: customizationData.hidden,
            hide_label: customizationData.hide_label,
            custom_css: customizationData.custom_css,
            property_name: customizationData.property_name,
            field_tags: customizationData.field_tags,
            collapsible: customizationData.collapsible
          },
          fieldGroup: [
          ],
        }];
      }
    }
    else {
      //  this.openRadioDialog();
    }

    if (newField.length > 0) {
      console.log(newField);
      newField.forEach(el => {
        this.fields.push(el);
        this.recentListFields.push(el.key);
        this.shareService.emitListFields(this.recentListFields);
        const previewField: FormlyFieldConfig = {};
        previewField.key = el.key;
        previewField.templateOptions = el.templateOptions;
        previewField.type = el.type;
        if (el.templateOptions && el.templateOptions.condi_whenShouldDisplay !== undefined) {
          const fieldToCheck = this.fields.find(field => field.key === el.templateOptions.condi_whenShouldDisplay);
          if (fieldToCheck) {
            if (fieldToCheck.key === el.templateOptions.condi_whenShouldDisplay && this.previewModel[fieldToCheck.key.toString()] === el.templateOptions.condi_value) {
              previewField.templateOptions.hidden = true;
            } else {
              previewField.templateOptions.hidden = false;
            }
            this.previewfields.push(previewField);
          } else {
            this.previewfields.push(el);
          }
        }
      });
      this.form.valueChanges.subscribe((value) => {
        this.model = { ...this.form.value };
        console.log('preview fields', this.previewfields);
        console.log('model', this.model);
      });

      // Rebuild the form group with the updated fields
      this.fb.group({});
      this.newfb.group({});
    }
  }
  async openPanelDialog() {
    const dialogRef = this.dialog.open(PanelDialogComponent, {
      width: '1400px', // Adjust the width as needed
      data: {
        label: '' // You can pass additional data to the panel customization component if needed
      }
    });

    try {
      const customizationData = await dialogRef.afterClosed().toPromise();
      return customizationData;
    } catch (error) {
      console.error('Error in dialog:', error);
      return null;
    }
  }
  async openTableDialog() {
    const dialogRef = this.dialog.open(FormTableComponent, {
      width: '1400px',
      data: {
        label_fr: '', label_ar: '', number_rows: '', number_columns: ''
      },
    });
    try {
      const customizationData = await dialogRef.afterClosed().toPromise();
      return customizationData;
    } catch (error) {
      console.error('Error in dialog:', error);
      return null;
    }
  }
  openCheckboxDialog(): Observable < any > {
    const dialogRef = this.dialog.open(FormDialogCheckboxComponent, {
      width: '1400px', // Adjust the width as needed
      data: {
        label_fr: '', // Default label value
        label_ar: ''
      }
    });

    return dialogRef.afterClosed();
  }
  openFileDialog(): Observable<any> {
    const dialogRef = this.dialog.open(FormFileDialogComponent, {
      width: '1400px', // Adjust the width as needed
      data: {
        label_fr: '' , // Default label value
        label_ar: ''
      }
    });

    return dialogRef.afterClosed();
  }
  async openHTMLDialog() {
    const dialogRef = this.dialog.open(HtmlDialogComponent, {
      width: '1400px',
      data: {
        label_fr: '',
        label_ar: '',
        html_tag: '',
        html_content: '',
        htmlElement: '',
        condi_whenShouldDisplay: '',
        condi_shouldDisplay: '',
        condi_value: ''
      },
    });
    try {
      const customizationData = await dialogRef.afterClosed().toPromise();
      customizationData.htmlElement = `<${customizationData.html_tag}>${customizationData.html_content}</${customizationData.html_tag}>`;
      return customizationData;
    } catch (error) {
      console.error('Error in dialog:', error);
      return null;
    }
  }
  async openIFrameDialog() {
    const dialogRef = this.dialog.open(IFrameDialogComponent, {
      width: '1400px',
      data: {label_fr: '', label_ar: '', link_iframe: '', condi_whenShouldDisplay: '', condi_shouldDisplay: '', condi_value: ''},
    });
    try {
      const customizationData = await dialogRef.afterClosed().toPromise();
      return customizationData;
    } catch (error) {
      console.error('Error in dialog:', error);
      return null;
    }
  }
  async openInputDialog() {
    const dialogRef = this.dialog.open(FormDialogComponent, {
      width: '1400px',
      data: {
        label_fr: '',
        label_ar: '',
        placeholder_fr: '',
        placeholder_ar: '',
        condi_whenShouldDisplay: '',
        condi_shouldDisplay: '',
        condi_value: ''
      },
    });
    try {
      const customizationData = await dialogRef.afterClosed().toPromise();
      return customizationData;
    } catch (error) {
      console.error('Error in dialog:', error);
      return null;
    }
  }
  async openAddressDialog() {
    const dialogRef = this.dialog.open(AddressCustomizeDialogComponent, {
      width: '1400px',
      data: {label: '', placeholder: ''},
    });
    try {
      const customizationData = await dialogRef.afterClosed().toPromise();
      console.log('data dialog :' , customizationData);
      return customizationData;
      console.log('data dialog :' , customizationData);
    } catch (error) {
      console.error('Error in dialog:', error);
      return null;
    }
  }
  async openDateDialog() {
    const dialogRef = this.dialog.open(DateFormDialogComponent, {
      width: '1400px',
      data: {label_fr: '', label_ar: '',type: 'datetime-local',},
    });
    try {
      const customizationData = await dialogRef.afterClosed().toPromise();
      return customizationData;
    } catch (error) {
      console.error('Error in dialog:', error);
      return null;
    }
  }
  async openDayDialog() {
    const dialogRef = this.dialog.open(DayFormDialogComponent, {
      width: '1400px',
      data: {label_fr: '', label_ar: '',type: 'date',},
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
      data: {label_fr: '', label_ar: '', placeholder_fr: '', placeholder_ar: ''},
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
      data: {label: '', width_col: '', tableRows: []},
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
      data: {label_fr: '', label_ar: '', placeholder: '', tableRows: [{label: '', value: ''}]},
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
      data: {label_fr: '', label_ar: '', placeholder: '', tableRows: [{label: '', value: ''}]},
    });
    try {
      const customizationData = await dialogRef.afterClosed().toPromise();
      return customizationData;
    } catch (error) {
      console.error('Error in dialog:', error);
      return null;
    }
  }
  async openSelectMultipleDialog() {
    const dialogRef = this.dialog.open(SelectMultipleDialogComponent, {
      width: '1400px',
      data: {label_fr: '', label_ar: '', multiple:true, placeholder: '', tableRows: [{label: '', value: ''}]},
    });
    try {
      const customizationData = await dialogRef.afterClosed().toPromise();
      return customizationData;
    } catch (error) {
      console.error('Error in dialog:', error);
      return null;
    }
  }
  async openTabDialog() {
    const dialogRef = this.dialog.open(TabDialogComponent, {
      width: '1400px',
      data: {
        label_fr: '', label_ar: '',tabLabels: [{label: ''}]
      },
    });
    try {
      const customizationData = await dialogRef.afterClosed().toPromise();
      return customizationData;
    } catch (error) {
      console.error('Error in dialog:', error);
      return null;
    }
  }
  async openStepperDialog() {
    const dialogRef = this.dialog.open(StepperDialogComponent, {
      width: '1400px',
      data: {
        label_fr: '', label_ar: '', stepperLabels : [{label: ''}]
      },
    });
    try {
      const customizationData = await dialogRef.afterClosed().toPromise();
      return customizationData;
    } catch (error) {
      console.error('Error in dialog:', error);
      return null;
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
    const dataToPass = { ...existingData, type: existingData.type || fieldType }; // Ensure type is passed
    console.log('Data passed to dialog:', dataToPass);
    switch(fieldType) {
      case 'text':
      case 'email':
      case 'number':
      case 'url':
        dialogRef = this.dialog.open(FormDialogComponent, {
          width: '1400px',
          data: dataToPass,
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
        this.updateFieldConfiguration(fieldKey, updatedCustomizationData);
        console.log('this is the updated data', updatedCustomizationData);
      }
    } catch (error) {
      console.error('Error in dialog:', error);
    }
  }
  // tslint:disable-next-line:typedef
  updateFieldConfiguration(fieldKey: string, customizationData: any) {
    const field = this.fields.find(f => f.key === fieldKey);

    if (!field) {
      console.error(`No field found with key ${fieldKey}`);
      return;
    }

    // Update the field's properties with the new customization data
    field.type = customizationData.type;
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

