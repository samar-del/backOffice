import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FormlyFieldConfig, FormlyFormOptions} from "@ngx-formly/core";
import {Subscription} from "rxjs";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TranslationService} from "../../../services/translation.service";
import {ShareService} from "../../../services/share.service";

@Component({
  selector: 'app-i-frame-dialog',
  templateUrl: './i-frame-dialog.component.html',
  styleUrls: ['./i-frame-dialog.component.css']
})
export class IFrameDialogComponent implements OnInit {

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
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<IFrameDialogComponent>,
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
      label_position: [this.data.label_position || 'top'],
      custom_css: [this.data.custom_css],
      hidden: [this.data.hidden],
      hide_label_fr: [this.data.hide_label_fr],
      hide_label_ar: [this.data.hide_label_ar],
      required: [this.data.required, Validators.required],
      error_label: [this.data.error_label],
      custom_error_message: [this.data.custom_error_message],
      property_name: [this.generatePropertyName(this.data.label_fr)],
      field_tags: [this.data.field_tags],
      link_iframe: [this.data.link_iframe, Validators.required],
      condi_whenShouldDisplay: [this.data.condi_whenShouldDisplay],
      condi_shouldDisplay: [this.data.condi_shouldDisplay],
      condi_value: [this.data.condi_value],
      type: [this.data.type],
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
    this.translationService.getCurrentLanguage().subscribe((currentLanguage: string) => {
      const label_fr = this.form.get('label_fr').value;
      const label_ar = this.form.get('label_ar').value;
      const textLabel = currentLanguage === 'ar' ? label_ar : label_fr;

      this.newField = {
        type: 'iframe',
        key: 'key1',
        templateOptions: {
          label: textLabel,
          label_fr: labelFrHidden ? null : this.form.get('label_fr').value,
          label_ar: labelArHidden ? null : this.form.get('label_ar').value,
          link_iframe: this.form.get('link_iframe').value,
          type: 'iframe',
          required: false,
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
      };
    });
  }


}
