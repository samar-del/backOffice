import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormlyFieldConfig, FormlyFormOptions} from "@ngx-formly/core";

@Component({
  selector: 'app-date-form-dialog',
  templateUrl: './date-form-dialog.component.html',
  styleUrls: ['./date-form-dialog.component.css']
})
export class DateFormDialogComponent implements OnInit {

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
    public dialogRef: MatDialogRef<DateFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.form = this.fb.group({
      label: [this.data.label, Validators.required],
      placeholder: [this.data.placeholder],
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

  onNoClick(): void {
    this.dialogRef.close();
  }
  getLabelStyles(): any {
    const customCss = this.form.get('custom_css').value;
    return customCss ? { 'cssText': customCss } : {}; // Return inline styles object
  }
  onTabChange(event: any): void {
    this.selectedTabIndex = event.index;
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

    };
  }


}
