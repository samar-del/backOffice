import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormColumnLayoutDialogComponent } from '../form-column-layout-dialog/form-column-layout-dialog.component';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {TranslationService} from "../../../services/translation.service";

@Component({
  selector: 'app-panel-dialog',
  templateUrl: './panel-dialog.component.html',
  styleUrls: ['./panel-dialog.component.css']
})
export class PanelDialogComponent implements OnInit {

  form:FormGroup;
  previewForm: FormGroup;
  newField: FormlyFieldConfig;
  @ViewChild('formlyForm') formlyForm: any;
  options: FormlyFormOptions = {};
  selectedTabIndex = 0;
  model: any = {};
  translations: any = {};
  fields: FormlyFieldConfig[] = [];
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FormColumnLayoutDialogComponent>,
    private translationService: TranslationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {
    this.form = this.fb.group({
      label: [this.data.label, Validators.required],
      label_fr: [this.data.label_fr, Validators.required],
      label_ar: [this.data.label_ar, Validators.required],
      theme: [this.data.theme],
      custom_css: [this.data.custom_css],
      hidden: [this.data.hidden],
      hide_label: [this.data.hide_label],
      disabled: [this.data.disabled],
      property_name: [this.generatePropertyName(this.data.label)],
      field_tags: [this.data.field_tags],
      collapsible: [this.data.collapsible],
      initiallyCollapsed: [this.data.initiallyCollapsed]

    });
    this.form.get('label_fr').valueChanges.subscribe((label: string) => {
      const propertyNameControl = this.form.get('property_name');
      propertyNameControl.setValue(this.generatePropertyName(label));
    });

    this.translationService.getCurrentLanguage().subscribe((language: string) => {
      this.loadTranslations();
    });

    this.loadTranslations();

  }

  onTabChange(event: any): void {
    this.selectedTabIndex = event.index;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  getLabelStyles(): any {
    const customCssControl = this.form.get('custom_css');
    if (customCssControl && customCssControl.value) {
      return { 'cssText': customCssControl.value };
    } else {
      return {};
    }
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
    const labelHidden = this.form.get('hide_label').value;
    const inputHidden = this.form.get('hidden').value;
    const inputDisabled = this.form.get('disabled').value;
    this.translationService.getCurrentLanguage().subscribe((currentLanguage: string) => {
      const label_fr = this.form.get('label_fr').value;
      const label_ar = this.form.get('label_ar').value;
      const textLabel = currentLanguage === 'ar' ? label_ar : label_fr;

    this.newField = {
      type: 'input',
      key: 'key1',
      templateOptions: {
        label: textLabel,
        label_fr: this.form.get('label_fr').value,
        label_ar: this.form.get('label_ar').value,
        type: 'panel',
        required: true,
        placeholder: this.form.get('placeholder').value,
        disabled: inputDisabled,
        custom_css: this.form.get('custom_css').value,
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
    });
  }
}
