import {Component, Inject, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';
import {TranslationService} from "../../../services/translation.service";

@Component({
  selector: 'app-radio-customize-dialog',
  templateUrl: './radio-customize-dialog.component.html',
  styleUrls: ['./radio-customize-dialog.component.css']
})
export class RadioCustomizeDialogComponent implements OnInit {


  form: FormGroup;
  previewForm: FormGroup;
  newField: FormlyFieldConfig;
  @ViewChild('formlyForm') formlyForm: any;
  options: FormlyFormOptions = {};
  model: any = {};
  selectedTabIndex = 0;
  translations: any = {};

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<RadioCustomizeDialogComponent>,
    private translationService: TranslationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.form = this.fb.group({
      label_fr: [this.data.label_fr, Validators.required],
      label_ar: [this.data.label_ar, Validators.required],
      placeholder: [this.data.placeholder],
      disabled : [this.data.disabled],
      tableRows: this.fb.array([]),
      custom_css: this.data.custom_css,
      hidden: [this.data.hidden],
      error_label: [this.data.error_label],
      custom_error_message: [this.data.custom_error_message],
      property_name: [this.generatePropertyName(this.data.label_fr)],
      field_tags: [this.data.field_tags]
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
  updateFormGroup(index: number, controlName: string, value: any): void {
    const tableRowsArray = this.form.get('tableRows') as FormArray;
    const rowFormGroup = tableRowsArray.at(index) as FormGroup;
    rowFormGroup.controls[controlName].setValue(value);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  get tableRows(): FormArray {
    console.log(this.form.get('tableRows') );
    return this.form.get('tableRows') as FormArray;
  }

  createRow(): FormGroup {
    const row = this.fb.group({
      label: [''],
      value: [''],
    });
    return row;
  }
  addRow(): void {
    const tableRowsArray = this.form.get('tableRows') as FormArray;
    tableRowsArray.push(this.createRow());
  }

  removeRow(index: number): void {
    this.tableRows.removeAt(index);
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
    const inputHidden = this.form.get('hidden').value;
    const inputDisabled = this.form.get('disabled').value;

    this.translationService.getCurrentLanguage().subscribe((currentLanguage: string) => {
      const label_fr = this.form.get('label_fr').value;
      const label_ar = this.form.get('label_ar').value;
      const radioLabel = currentLanguage === 'ar' ? label_ar : label_fr;

    this.newField = {
        type: 'radio',
        key: 'key',
        templateOptions: {
          label:radioLabel,
          options : this.form.get('tableRows').value ,
          custom_css: this.form.get('custom_css').value,
          disabled: inputDisabled,
          error_label: this.form.get('error_label').value,
          custom_error_message: this.form.get('custom_error_message').value,
        },
      hide: inputHidden,
    };
    });
  }

  onTabChange(event: any): void {
    this.selectedTabIndex = event.index;
  }
  getLabelStyles(): any {
    const customCss = this.form.get('custom_css').value;
    return customCss ? { 'cssText': customCss } : {}; // Return inline styles object
  }
}
