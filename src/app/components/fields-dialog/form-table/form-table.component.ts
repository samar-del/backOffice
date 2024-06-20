import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import {TranslationService} from "../../../services/translation.service";
import {ShareService} from "../../../services/share.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-form-table',
  templateUrl: './form-table.component.html',
  styleUrls: ['./form-table.component.css']
})
export class FormTableComponent implements OnInit {

  form: FormGroup;
  previewForm: FormGroup;
  newField: FormlyFieldConfig;
  @ViewChild('formlyForm') formlyForm: any;
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [];
  model: any = {};
  selectedTabIndex = 0;
  translations: any = {};
  fieldsList: any[] = [];
  private fieldsListSub: Subscription;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FormTableComponent>,
    private translationService: TranslationService,
    private shareService: ShareService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.fieldsListSub = this.shareService.fieldsList$.subscribe(data => {
      this.fieldsList = data;
    });
  }


  ngOnInit() {
    console.log(this.fieldsList);
    this.form = this.fb.group({
      label_fr: [this.data.label_fr, Validators.required],
      label_ar: [this.data.label_ar, Validators.required],
      number_rows: [this.data.number_rows, Validators.required],
      number_columns: [this.data.number_columns, Validators.required],
      custom_css: [this.data.custom_css],
      hidden: [this.data.hidden],
      hide_label_fr: [this.data.hide_label_fr],
      hide_label_ar: [this.data.hide_label_ar],
      property_name: [this.generatePropertyName(this.data.label_fr)],
      field_tags: [this.data.field_tags]
    });
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
    const numberRows = this.form.get('number_rows').value;
    const numberColumns = this.form.get('number_columns').value;
    const labelFrHidden = this.form.get('hide_label_fr').value;
    const labelArHidden = this.form.get('hide_label_ar').value;
    const inputHidden = this.form.get('hidden').value;
    const tableRows: FormlyFieldConfig[] = [];

    // Generate table rows with the specified number of rows and columns
    for (let i = 0; i < numberColumns; i++) {
      const tableRow: FormlyFieldConfig[] = [];
      for (let j = 0; j < numberRows; j++) {
        const newField: FormlyFieldConfig = {
        };
        tableRow.push(newField);
      }
      tableRows.push({
        fieldGroup: tableRow,
      });
    }
    this.translationService.getCurrentLanguage().subscribe((currentLanguage: string) => {
      const label_fr = this.form.get('label_fr').value;
      const label_ar = this.form.get('label_ar').value;
      const textLabel = currentLanguage === 'ar' ? label_ar : label_fr;
    this.newField = {
      type: 'table',
      fieldGroup: tableRows,
      templateOptions: {
        label: textLabel,
        label_fr: labelFrHidden ? null : this.form.get('label_fr').value,
        label_ar: labelArHidden ? null : this.form.get('label_ar').value,
        custom_css: this.form.get('custom_css').value,
        number_rows: this.form.get('number_rows').value,
        number_columns: this.form.get('number_columns').value,
      },
      hide: inputHidden,
      expressionProperties: {
        'templateOptions.hideLabel_fr': () => labelFrHidden,
        'templateOptions.hideLabel_ar': () => labelArHidden
      },
    };
    });
  }




}


