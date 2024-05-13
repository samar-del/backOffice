
import {
  ChangeDetectorRef,
  Component, DoCheck, NgZone,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormDialogCheckboxComponent} from '../fields-dialog/form-dialog-checkbox/form-dialog-checkbox.component';
import {FormlyFormOptions, FormlyFieldConfig, FormlyField} from '@ngx-formly/core';
import {FormDialogComponent} from '../fields-dialog/form-dialog/form-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {RadioCustomizeDialogComponent} from '../fields-dialog/radio-customize-dialog/radio-customize-dialog.component';
import {FormCreationService} from '../../services/form-creation.service';
import {Field} from '../../models/Field';
import {TemplateOptions} from '../../models/TemplateOptions';
import {Options} from '../../models/Options';
import {forkJoin, Observable, Subscription} from 'rxjs';
import {SelectCustomizeDialogComponent} from '../fields-dialog/select-customize-dialog/select-customize-dialog.component';
import {TelFormDialogComponent} from '../fields-dialog/tel-form-dialog/tel-form-dialog.component';
import {FieldService} from '../../services/field.service';
import {OptionsService} from '../../services/options.service';
import {TemplateOptionsService} from '../../services/template-options.service';
import {DateFormDialogComponent} from '../fields-dialog/date-form-dialog/date-form-dialog.component';
import {FormColumnLayoutDialogComponent} from '../fields-dialog/form-column-layout-dialog/form-column-layout-dialog.component';
import {AddressCustomizeDialogComponent} from '../fields-dialog/address-customize-dialog/address-customize-dialog.component';
import {error, promise} from 'protractor';
import {ShareService} from '../../services/share.service'
import { FormTableComponent } from '../fields-dialog/form-table/form-table.component';
import { TableWrapperComponent } from '../table-wrapper/table-wrapper.component';
import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';
import { PanelDialogComponent } from '../fields-dialog/panel-dialog/panel-dialog.component';
import {TranslationService} from "../../services/translation.service";
import {HtmlDialogComponent} from "../fields-dialog/html-dialog/html-dialog.component";
import {IFrameDialogComponent} from "../fields-dialog/i-frame-dialog/i-frame-dialog.component";




@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ContentComponent implements OnInit, DoCheck {

  @ViewChild('tableWrapper') tableWrapper: TableWrapperComponent;
  previewForm: FormGroup;
 fields: FormlyFieldConfig[] = [];
  previewfields: FormlyFieldConfig[] = [];
  @ViewChild('formlyForm') formlyForm: any;
  form: FormGroup;
  model: any = {};
  previewModel: any = {};
  options: FormlyFormOptions = {};
  containerDraggedOver = false;
  columnSize: any [ ] = [];
  recentListFields: any[] = [];
  categories: { name: string, fields: FormlyFieldConfig[] }[] = [
    { name: 'Category 1', fields: [] },
    { name: 'Category 2', fields: [] },

  ];
  private previousPreviewFields: FormlyFieldConfig[] = [];

  // tslint:disable-next-line:max-line-length
  constructor(private fb: FormBuilder, private newfb: FormBuilder, private dialog: MatDialog, private  formService: FormCreationService, private fieldService: FieldService,
              private optionService: OptionsService, private templateOptionsService: TemplateOptionsService,
              private shareService: ShareService, private translationService: TranslationService, private cdr: ChangeDetectorRef, private ngZone: NgZone) {
    this.form = this.fb.group({});
    //this.previewForm = this.fb.group({});
  }
  ngOnInit(): void {
  }
  ngDoCheck(): void {
    // if (this.arePreviewFieldsChanged()) {
    //   console.log('Preview fields were changed');
    //   console.log('this.model', this.model);
    // //  console.log('this.previewmodel', this.previewModel);
    //   this.updatePreviewFields();
    // }
    this.shareService.emitPreviewFieldList(this.previewfields);
  }
  updatePreviewFields() {
    this.previewfields.forEach(field => {
      const fieldTocheck = this.fields.find(el => el.key === field.templateOptions.condi_whenShouldDispaly);
      if (fieldTocheck && this.previewModel[fieldTocheck.key.toString()] !== field.templateOptions.condi_value) {
        field.templateOptions.hidden = true;
      } else if (typeof field.expressionProperties === 'object' && typeof field.expressionProperties['templateOptions.hidden'] === 'function') {
        const expressionFunction = field.expressionProperties['templateOptions.hidden'];
        field.templateOptions.hidden = expressionFunction(this.previewModel, null, field);
      }
    });
  }
  arePreviewFieldsChanged(): boolean {
    if (this.previousPreviewFields.length !== this.previewfields.length) {
      return true;
    }

    for (let i = 0; i < this.previewfields.length; i++) {
      console.log(this.fields[i].model);
      if (JSON.stringify(this.previewfields[i].model) !== JSON.stringify(this.previousPreviewFields[i].model)) {
        return true;
      }
    }
    return false;
    console.log('this.fields.values()', this.fields.values());
    console.log('this.model', this.model);
    console.log('this.previewfields.values()', this.previewfields.values());
    console.log('this.previewmodel', this.previewModel);
    console.log('this.fields.values()', this.fields.values());
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
      if (customizationData) {
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
          wrappers: ['column'],
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
      }
    }
    if ((language === 'an' && type === 'HTML Element') ||
      (language === 'fr' && type === 'Element HTML') ||
      (language === 'ar' && type === 'عنصر HTML')) {
      const customizationData = await this.openHTMLDialog();
      console.log(customizationData);
      if (customizationData) {
        const label_fr = customizationData.hide_label ? null : customizationData.label_fr;
        const label_ar = customizationData.hide_label ? null : customizationData.label_ar;
        const htmlElement = customizationData.htmlElement;
        console.log(htmlElement);
        newField = [{
          type: 'html',
          key: customizationData.property_name,
          templateOptions: {
            html_tag:customizationData.html_tag,
            html_content:customizationData.html_content,
            htmlElement:htmlElement,
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
        if (customizationData.condi_shouldDisplay && customizationData.condi_shouldDisplay){
          if (customizationData.condi_shouldDisplay === true){
            this.fields.forEach(el => {
              if (el.key === customizationData.condi_shouldDisplay){
                if (el.model === customizationData.condi_value ){
                  newField.map(field => {
                    field.hide = false ;
                    this.previewfields.push(field);
                  });
                }
              }
            });
          }else {
            this.fields.forEach(el => {
              if (el.key === customizationData.condi_shouldDisplay){
                if (el.model === customizationData.condi_value ){
                  newField.map(field => {
                    field.hide = true ;
                    this.previewfields.push(field);
                  });
                }
              }
            }); }
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
        const label_fr = customizationData.label_fr;
        const label_ar = customizationData.label_ar;
        if (listFieldAddress.length !== 0) {
          field = {
            type: 'column',
            key: customizationData.property_name,
            templateOptions: {
              label: language === 'ar' ? customizationData.label_ar : customizationData.label_fr,
              label_fr,
              label_ar,
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
            fieldGroup: [],
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
        } else {
          field = {
            fieldGroupClassName: 'display-flex',
            fieldGroup: [
              {
                type: 'input',
                key: customizationData.property_name,
                templateOptions: {
                  label: language === 'ar' ? customizationData.label_ar : customizationData.label_fr,
                  label_fr,
                  label_ar,
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
      }
    }
    if ((language === 'an' && type === 'Email') ||
      (language === 'fr' && type === 'E-mail') ||
      (language === 'ar' && type === 'البريد الإلكتروني')) {
      const customizationData = await this.openInputDialog();
      // @ts-ignore
      if (customizationData) {
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
          // Customize other properties as needed
        }];
      }
    }
    if ((language === 'an' && type === 'IFrame') ||
      (language === 'fr' && type === 'IFrame') ||
      (language === 'ar' && type === 'IFrame')) {
      const customizationData = await this.openIFrameDialog();
      const link_iframe =customizationData.link_iframe
      this.shareService.changeUrl(link_iframe);

      // @ts-ignore
      if (customizationData) {
        const label_fr = customizationData.hide_label ? null : customizationData.label_fr;
        const label_ar = customizationData.hide_label ? null : customizationData.label_ar;

        newField = [{
          type: 'iframe',
          key: customizationData.property_name,
          wrappers: ['column'],
          templateOptions: {
            label: language === 'ar' ? customizationData.label_ar : customizationData.label_fr,
            label_fr: label_fr,
            label_ar: label_ar,
            type: 'iframe',
            link_iframe: customizationData.link_iframe,
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
          wrappers: ['column'],

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
    if ((language === 'an' && type === 'Day') ||
      (language === 'fr' && type === 'Jour') ||
      (language === 'ar' && type === 'اليوم')) {
      const customizationData = await this.openDateDialog();
      // @ts-ignore
      if (customizationData) {
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
    } else if ((language === 'an' && type === 'Number') ||
      (language === 'fr' && type === 'Nombre') ||
      (language === 'ar' && type === 'عدد')) {
      const customizationData = await this.openInputDialog();
      // @ts-ignore
      if (customizationData) {
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
    } else if ((language === 'an' && type === 'radio') ||
      (language === 'fr' && type === 'radio') ||
      (language === 'ar' && type === 'راديو')) {
      const customizationData = await this.openRadioDialog();
      if (customizationData) {
        newField = [{
          type: 'radio',
          key: customizationData.property_name,
          templateOptions: {
            label: language === 'ar' ? customizationData.label_ar : customizationData.label_fr,
            label_fr: customizationData.label_fr,
            label_ar: customizationData.label_ar,
            options: customizationData.tableRows,
            disabled: customizationData.disabled,
            hidden: customizationData.hidden,
            custom_css: customizationData.custom_css,
            property_name: customizationData.property_name,
            field_tags: customizationData.field_tags,
            error_label: customizationData.error_label,
            custom_error_message: customizationData.custom_error_message
          },
          wrappers: ['column'],

        }];
      }
    } else if ((language === 'an' && type === 'select') ||
      (language === 'fr' && type === 'select') ||
      (language === 'ar' && type === 'اختيار')) {
      const customizationData = await this.openSelectDialog();
      console.log(customizationData);
      if (customizationData) {
        newField = [{
          key: customizationData.property_name,
          type: 'select',
          templateOptions : {
            label: language === 'ar' ? customizationData.label_ar : customizationData.label_fr,
            label_fr: customizationData.label_fr,
            label_ar: customizationData.label_ar,
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
        wrappers: ['column'],

      }]; }
    }
    else if ((language === 'an' && type === 'Select Multiple') ||
      (language === 'fr' && type === 'Sélection multiple') ||
      (language === 'ar' && type === 'اختيار متعدد')) {
      const customizationData = await this.openSelectDialog();
      console.log(customizationData);
      if (customizationData) {
        newField = [{

          key: customizationData.property_name,
          type: 'select',
          templateOptions: {
            label: language === 'ar' ? customizationData.label_ar : customizationData.label_fr,
            label_fr: customizationData.label_fr,
            label_ar: customizationData.label_ar,
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

    }
    else if ((language === 'an' && type === 'checkbox') ||
      (language === 'fr' && type === 'checkbox') ||
      (language === 'ar' && type === 'خانة اختيار')) {
      const customizationData = await this.openCheckboxDialog().toPromise();
      if (customizationData) {
        const label_fr = customizationData.label_fr;
        const label_ar = customizationData.label_ar;

        newField = [{
          type: 'checkbox',
          key: customizationData.property_name,
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
          wrappers: ['column'],

          defaultValue: false,
        }];
      }

    } else if (type === 'File') {
      newField = [{
        key: 'file',
        type: 'file',
      }];
    }
   else if (type === 'Columns') {

      const customizationData = await this.openColumnDialog();
      if (customizationData) {
        let columnSizess = [{size: '', width: ''}];
        columnSizess = customizationData.tableRows;
        this.shareService.emitNumberColumn(columnSizess);
        console.log(columnSizess);
        newField = [
          {

            key: customizationData.property_name, // Key of the wrapper component for columns
            type: 'row',
            fieldArray: {
              type: 'columnSize',
              fieldGroup: [],
            },
            wrappers: ['column'],

          },
        ];

        this.columnSize = customizationData.tableRows;
        this.shareService.emitNumberColumn(this.columnSize);
      }
      console.log(newField);
      this.form = this.fb.group({});
    //  this.formlyForm.resetForm({ model: this.model });
      }

    else if ((language === 'an' && type === 'Table') ||
      (language === 'fr' && type === 'Tableau') ||
      (language === 'ar' && type === 'جدول')) {
      const customizationData = await this.openTableDialog();
      if (customizationData) {
        const tableRows: FormlyFieldConfig[] = [];

        // Generate table rows with the specified number of rows and columns
        for (let i = 0; i < customizationData.number_columns; i++) {
          const tableRow: FormlyFieldConfig[] = [];
          for (let j = 0; j < customizationData.number_rows; j++) {
            const newField: FormlyFieldConfig = {
              key: `row_${j}_col_${i}`,
              type: 'input', // You can change this to the appropriate field type
              templateOptions: {
                label: `Row ${j + 1} - Column ${i + 1}`,
              },
            };
            tableRow.push(newField);
            console.log(newField);
          }
          tableRows.push({
            fieldGroup: tableRow,
          });
        }

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
          wrappers: ['column'],
        }];
        console.log(newField);
      }
    }

    else if (type === 'panel') {
        const customizationData = await this.openPanelDialog();
        if (customizationData) {
          newField = [{
            type: 'panel',
            key: customizationData.property_name,
            templateOptions: {
              label: customizationData.label,
              theme: customizationData.theme,
              disabled: customizationData.disabled,
              hidden: customizationData.hidden,
              hide_label: customizationData.hide_label,
              custom_css: customizationData.custom_css,
              property_name: customizationData.property_name,
            field_tags: customizationData.field_tags,
            collapsible: customizationData.collapsible
              // Add any other template options as needed
            },
            wrappers: ['column'],

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
        const fieldToCheck = this.fields.find(field => field.key === el.templateOptions.condi_whenShouldDisplay);
        if (fieldToCheck){
            if (fieldToCheck.key === el.templateOptions.condi_whenShouldDisplay && this.previewModel[fieldToCheck.key.toString()] === el.templateOptions.condi_value){
              previewField.templateOptions.hidden = true ;
            } else {
              previewField.templateOptions.hidden = false ;
            }
            this.previewfields.push(previewField);
          } else {
          this.previewfields.push(el);
        }

      });
      this.form.valueChanges.subscribe((value) => {
         this.model = { ...value };
         console.log('preview fields',this.previewfields);
        console.log(this.model);
      });
      if (this.formlyForm) {
        // this.formlyForm.resetForm({ model: this.model });

      }
      // Rebuild the form group with the updated fields
      this.form = this.fb.group({});
      this.previewForm = this.newfb.group({});
    }
  }

  generateTableFields(rows: number, columns: number): any[] {
    const tableFields = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        const key = `row${i}_column${j}`;
        const field = {
          key: key,
          type: 'input', // You can adjust the type as needed
          templateOptions: {
            label: `Row ${i + 1} - Column ${j + 1}` // Adjust the label as needed
          }
        };
        tableFields.push(field);
      }
    }
    return tableFields;
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
        label_fr:'',label_ar:'', number_rows:'',number_columns:''
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



  openCheckboxDialog():Observable<any> {
    const dialogRef = this.dialog.open(FormDialogCheckboxComponent, {
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
      data: {label_fr: '', label_ar: '', html_tag:'', html_content:'', htmlElement:'', condi_whenShouldDisplay: '', condi_shouldDisplay: '', condi_value: ''},
    });
    try {
      const customizationData = await dialogRef.afterClosed().toPromise();
      customizationData.htmlElement = `<${customizationData.html_tag}>${customizationData.html_content}</${customizationData.html_tag}>`
      return customizationData;
    } catch (error) {
      console.error('Error in dialog:', error);
      return null;
    }
  }

  async openIFrameDialog() {
    const dialogRef = this.dialog.open(IFrameDialogComponent, {
      width: '1400px',
      data: {label_fr: '', label_ar: '' ,link_iframe: '', condi_whenShouldDisplay: '', condi_shouldDisplay: '', condi_value: ''},
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
      data: {label_fr: '', label_ar: '', placeholder_fr: '', placeholder_ar: '' , condi_whenShouldDisplay: '', condi_shouldDisplay: '', condi_value: ''},
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
      data: {label_fr: '', label_ar: '', placeholder: ''},
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
      data: {label_fr: '', label_ar: '', placeholder: '', tableRows: [{label : '', value: ''}]},
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
      data: {label_fr: '', label_ar: '', placeholder: '', tableRows: [{label : '', value: ''}]},
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
            // field.fieldGroup = fieldsGroupId;
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
      number_rows: field.templateOptions.number_rows,
      number_columns: field.templateOptions.number_columns,
      theme: field.templateOptions.theme,
      collapsible: field.templateOptions.collapsible,
      options: optionValues, // Store option IDs instead of values
      id: this.generateRandomId(),
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
