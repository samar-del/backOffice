import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';
import {TranslationService} from "../../../services/translation.service";
import {ShareService} from '../../../services/share.service';
import {Subscription} from 'rxjs';
@Component({
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.css']
})
export class FormDialogComponent implements OnInit {

  form: FormGroup;
  previewForm: FormGroup;
  newField: FormlyFieldConfig;
  fields: FormlyFieldConfig[] = [];
  @ViewChild('formlyForm') formlyForm: any;
  options: FormlyFormOptions = {};
  model: any = {};
  selectedTabIndex = 0; // Default tab index
  translations: any = {};
  fieldsList: any[] = [];
  private fieldsListSub: Subscription;
  NumberOptions = 0 ;
  showTable = false;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FormDialogComponent>,
    private translationService: TranslationService,
    private shareService: ShareService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.fieldsListSub = this.shareService.fieldsList$.subscribe(data => {
      this.fieldsList = data;
    });
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    console.log(this.fieldsList);
    this.form = this.fb.group({
      label_fr: [this.data.label_fr, Validators.required],
      label_ar: [this.data.label_ar, Validators.required],
      placeholder_fr: [this.data.placeholder_fr],
      placeholder_ar: [this.data.placeholder_ar],
      minLength: [this.data.minLength, Validators.min(0)],
      maxLength: [this.data.maxLength, Validators.min(0)],
      label_position: [this.data.label_position || 'top'],
      custom_css: [this.data.custom_css],
      hidden: [this.data.hidden],
      hide_label_fr: [this.data.hide_label_fr],
      hide_label_ar: [this.data.hide_label_ar],
      disabled: [this.data.disabled],
      required: [this.data.required, Validators.required],
      error_label: [this.data.error_label],
      custom_error_message: [this.data.custom_error_message],
      property_name: [this.generatePropertyName(this.data.label_fr)],
      field_tags: [this.data.field_tags],
      condi_whenShouldDisplay: [this.data.condi_whenShouldDisplay],
      condi_shouldDisplay: [this.data.condi_shouldDisplay],
      condi_value: [this.data.condi_value],
      tableRows: this.fb.array([])
    });

    // Subscribe to label changes to update property name
    this.form.get('label_fr').valueChanges.subscribe((label: string) => {
      const propertyNameControl = this.form.get('property_name');
      propertyNameControl.setValue(this.generatePropertyName(label));
    });

    this.translationService.getCurrentLanguage().subscribe((language: string) => {
      this.loadTranslations();
    });

    this.loadTranslations();

    this.form.valueChanges.subscribe(() => {
      this.updateFields();
    });

    this.updateFields();
  }
  addRow(): void {
    const tableRowsArray = this.form.get('tableRows') as FormArray;
    tableRowsArray.push(this.createRow());
    this.NumberOptions++ ;
  }
  createRow(): FormGroup {
    const row = this.fb.group({
      keyCondition: [''],
      valueCondition: [''],
    });
    return row;
  }
  removeRow(index: number): void {
    this.tableRows.removeAt(index);
    this.NumberOptions--;
  }
  get tableRows(): FormArray {
    return this.form.get('tableRows') as FormArray;
  }
  onTabChange(event: any): void {
    this.selectedTabIndex = event.index;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  getLabelStyles(): any {
    const customCss = this.form.get('custom_css').value;
    return customCss ? { cssText: customCss } : {}; // Return inline styles object
  }
  generatePropertyName(label: string): string {
    const words = label.split(/\s+/); // Split label into words
    let propertyName = '';

    // Iterate over each word to construct property name
    words.forEach((word, index) => {
      // Skip whitespace or empty words
      if (word.trim() === '') {
        return;
      }

      // Make the first word lowercase
      if (index === 0) {
        propertyName += word.toLowerCase();
      } else {
        // Make the first letter of subsequent words uppercase
        propertyName += word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
    });

    return propertyName;
  }

  loadTranslations() {
    this.translationService.getCurrentLanguage().subscribe((language: string) => {
      this.translationService.loadTranslations(language).subscribe((translations: any) => {
        console.log('Loaded translations:', translations);
        this.translations = translations;
      });
    });
  }


  updateTags(inputValue: string): void {
    const tagsArray = inputValue.split(',').map(tag => tag.trim());
    this.form.get('field_tags').setValue(tagsArray);
  }

  updateFields(): void {
    const labelFrHidden = this.form.get('hide_label_fr').value;
    const labelArHidden = this.form.get('hide_label_ar').value;
    const inputHidden = this.form.get('hidden').value;
    const inputDisabled = this.form.get('disabled').value;
    this.translationService.getCurrentLanguage().subscribe((currentLanguage: string) => {
      const label_fr = this.form.get('label_fr').value;
      const label_ar = this.form.get('label_ar').value;
      const textLabel = currentLanguage === 'ar' ? label_ar : label_fr;
      const placeholder_ar = this.form.get('placeholder_ar').value;
      const placeholder_fr = this.form.get('placeholder_fr').value;
      const placeholderText = currentLanguage === 'ar' ? placeholder_ar : placeholder_fr;

    this.newField = {
      type: 'input',
      key: 'key1',
      templateOptions: {
        label: textLabel,
        label_fr: labelFrHidden ? null : this.form.get('label_fr').value,
        label_ar: labelArHidden ? null : this.form.get('label_ar').value,
        type: 'text',
        required: false,
        placeholder_fr: this.form.get('placeholder_fr').value,
        placeholder_ar: this.form.get('placeholder_ar').value,
        placeholder: placeholderText,
        disabled: inputDisabled,
        custom_css: this.form.get('custom_css').value,
        error_label: this.form.get('error_label').value,
        custom_error_message: this.form.get('custom_error_message').value,
        labelPosition: this.form.get('label_position').value
      },
      hide: inputHidden,
      expressionProperties: {
        'templateOptions.hideLabel_fr': () => labelFrHidden,
        'templateOptions.hideLabel_ar': () => labelArHidden
      },
      validators: {
        minLength: {
          expression: (control: any) => {
            const value = control.value;
            const minLength = this.form.get('minLength').value || 0;
            return !value || value.length >= minLength;
          }
        },
        maxLength: {
          expression: (control: any) => {
            const value = control.value;
            const maxLength = this.form.get('maxLength').value || Infinity;
            return !value || value.length <= maxLength;
          }
        }
      },
    };
    });
  }



}
