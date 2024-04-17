import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';
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


  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.form = this.fb.group({
      label: [this.data.label, Validators.required],
      placeholder: [this.data.placeholder],
      minLength: [this.data.minLength, Validators.min(0)],
      maxLength: [this.data.maxLength, Validators.min(0)],
      label_position: [this.data.label_position],
      custom_css: [this.data.custom_css],
      hidden: [this.data.hidden],
      hide_label: [this.data.hide_label],
      disabled: [this.data.disabled],
      required: [this.data.required],
      error_label: [this.data.error_label],
      custom_error_message: [this.data.custom_error_message],
      property_name: [this.data.property_name],
      field_tags: [this.data.field_tags]
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
    return customCss ? { 'cssText': customCss } : {}; // Return inline styles object
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
  }



}
