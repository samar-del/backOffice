import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';

@Component({
  selector: 'app-form-dialog-checkbox',
  templateUrl: './form-dialog-checkbox.component.html',
  styleUrls: ['./form-dialog-checkbox.component.css']
})
export class FormDialogCheckboxComponent implements OnInit {

  form: FormGroup;
  previewForm: FormGroup;
  newField: FormlyFieldConfig;
  @ViewChild('formlyForm') formlyForm: any;
  options: FormlyFormOptions = {};
  model: any = {};
  selectedTabIndex = 0;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FormDialogCheckboxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.form = this.fb.group({
      label: [this.data.label, Validators.required],
      custom_css: [this.data.custom_css],
      hidden: [this.data.hidden],
      disabled: [this.data.disabled],
      required: [this.data.required],
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
    this.form.valueChanges.subscribe(() => {
      this.updateFields();
    });

    this.updateFields();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  getLabelStyles(): any {
    const customCss = this.form.get('custom_css').value;
    return customCss ? { 'cssText': customCss } : {}; // Return inline styles object
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
  updateTags(inputValue: string): void {
    const tagsArray = inputValue.split(',').map(tag => tag.trim());
    this.form.get('field_tags').setValue(tagsArray);
  }
  updateFields(): void {
    const inputHidden = this.form.get('hidden').value;
    const inputDisabled = this.form.get('disabled').value;

    this.newField = {
      type: 'checkbox',
      key: 'key',
      templateOptions: {
        label: this.form.get('label').value || 'New Checkbox Label',
        disabled: inputDisabled,
        custom_css: this.form.get('custom_css').value,
        error_label: this.form.get('error_label').value,
        custom_error_message: this.form.get('custom_error_message').value,
      },
      hide: inputHidden,
      defaultValue: false,
    };
  }

  onTabChange(event: any): void {
    this.selectedTabIndex = event.index;
  }
}
