import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import { FormlyFieldConfig, FormlyFormOptions } from "@ngx-formly/core";
import { Subscription } from "rxjs";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TranslationService } from "../../../services/translation.service";
import { ShareService } from "../../../services/share.service";

@Component({
  selector: 'app-tab-dialog',
  templateUrl: './tab-dialog.component.html',
  styleUrls: ['./tab-dialog.component.css']
})
export class TabDialogComponent implements OnInit {

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
    public dialogRef: MatDialogRef<TabDialogComponent>,
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
      custom_css: [this.data.custom_css],
      hidden: [this.data.hidden],
      hide_label_fr: [this.data.hide_label_fr],
      hide_label_ar: [this.data.hide_label_ar],
      property_name: [this.generatePropertyName(this.data.label_fr)],
      field_tags: [this.data.field_tags],
      tabLabels: this.fb.array(this.data.tabLabels.map(row => this.createRow(row)))
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

  get tabLabels(): FormArray {
    return this.form.get('tabLabels') as FormArray;
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

  addTabLabel(): void {
    const tabLabels = this.form.get('tabLabels') as FormArray;
    tabLabels.push(this.fb.group({
      label: [''],
      value: ['']
    }));
  }

  createRow(rowData: any = {}): FormGroup {
    return this.fb.group({
      label: [rowData.label || '']
    });
  }
  addRow(): void {
    const tabLabels = this.form.get('tabLabels') as FormArray;
    tabLabels.push(this.createRow());
  }

  removeTabLabel(index: number): void {
    const tabLabels = this.form.get('tabLabels') as FormArray;
    tabLabels.removeAt(index);
  }

  // Inside TabDialogComponent

  updateFields(): void {
    this.translationService.getCurrentLanguage().subscribe((currentLanguage: string) => {
      const label_fr = this.form.get('label_fr').value;
      const label_ar = this.form.get('label_ar').value;
      const textLabel = currentLanguage === 'ar' ? label_ar : label_fr;
      const tabLabels = this.form.get('tabLabels') as FormArray;

      const fields: FormlyFieldConfig[] = tabLabels.controls.map((control: FormGroup, index: number) => {
        const tabLabel = control.get('label').value;
        return {
          key: 'tab_' + index,
          type: 'input',
          templateOptions: {
            label: tabLabel,
          },
        };
      });

      this.newField = {
        type: 'tab',
        fieldGroup: fields,
        templateOptions : {
          label: textLabel,
          tabs: tabLabels.value.map(tab => tab.label)
        },
      };
    });
  }



}
