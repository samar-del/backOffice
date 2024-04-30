import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';
import {TranslationService} from "../../../services/translation.service";
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

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FormDialogComponent>,
    private translationService: TranslationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.form = this.fb.group({
      label: [this.data.label, Validators.required],
      placeholder: [this.data.placeholder],
      minLength: [this.data.minLength, Validators.min(0)],
      maxLength: [this.data.maxLength, Validators.min(0)],
      label_position: [this.data.label_position || 'top'],
      custom_css: [this.data.custom_css],
      hidden: [this.data.hidden],
      hide_label: [this.data.hide_label],
      disabled: [this.data.disabled],
      required: [this.data.required, Validators.required],
      error_label: [this.data.error_label],
      custom_error_message: [this.data.custom_error_message],
      property_name: [this.generatePropertyName(this.data.label)],
      field_tags: [this.data.field_tags]
    });

    // Subscribe to label changes to update property name
    this.form.get('label').valueChanges.subscribe((label: string) => {
      const propertyNameControl = this.form.get('property_name');
      propertyNameControl.setValue(this.generatePropertyName(label));
    });
    this.loadTranslations();

    // Subscribe to language changes
    this.translationService.getCurrentLanguage().subscribe((language: string) => {
      this.loadTranslations();
    });

    this.form.valueChanges.subscribe(() => {
      this.updateFields();
    });

    this.updateFields();
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
        this.translations = translations;

        // Use translation keys directly to access the translations
        const labelTranslationKey = 'this_label';
        const placeholderTranslationKey = 'this_placeholder';

        // Check if the translations exist before setting the form values
        if (this.translations && this.translations[labelTranslationKey]) {
          this.form.get('label').setValue(this.translations[labelTranslationKey]);
        }
        if (this.translations && this.translations[placeholderTranslationKey]) {
          this.form.get('placeholder').setValue(this.translations[placeholderTranslationKey]);
        }
      });
    });
  }



  updateTags(inputValue: string): void {
    const tagsArray = inputValue.split(',').map(tag => tag.trim());
    this.form.get('field_tags').setValue(tagsArray);
  }

  updateFields(): void {
    const labelHidden = this.form.get('hide_label').value;
    const inputHidden = this.form.get('hidden').value;
    const inputDisabled = this.form.get('disabled').value;

    this.newField = {
      type: 'input',
      key: 'key1',
      templateOptions: {
        label: labelHidden ? null : this.form.get('label').value,
        type: 'text',
        required: true,
        placeholder: this.form.get('placeholder').value,
        disabled: inputDisabled,
        custom_css: this.form.get('custom_css').value,
        error_label: this.form.get('error_label').value,
        custom_error_message: this.form.get('custom_error_message').value,
        labelPosition: this.form.get('label_position').value
      },
      hide: inputHidden,
      expressionProperties: {
        'templateOptions.hideLabel': () => labelHidden
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
      }
    };
  }



}
