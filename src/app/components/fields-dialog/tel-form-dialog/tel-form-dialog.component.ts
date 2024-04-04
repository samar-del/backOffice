import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';

@Component({
  selector: 'app-tel-form-dialog',
  templateUrl: './tel-form-dialog.component.html',
  styleUrls: ['./tel-form-dialog.component.css']
})
export class TelFormDialogComponent implements OnInit {

  form: FormGroup;
  previewForm: FormGroup;
  newField: FormlyFieldConfig;
  @ViewChild('formlyForm') formlyForm: any;
  options: FormlyFormOptions = {};
  model: any = {};
  selectedTabIndex = 0;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TelFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.form = this.fb.group({
      label: [this.data.label, Validators.required],
      placeholder: [this.data.placeholder],
      minLength: [this.data.minLength, Validators.min(0)],
      maxLength: [this.data.maxLength, Validators.min(0)],
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
  updateFields(): void {
    this.newField = {
      type: 'input',
      key: 'key',
      templateOptions: {
        label: this.form.get('label').value,
        type: 'tel',
        placeholder: this.form.get('placeholder').value,
        minLength: this.form.get('minLength').value,
        maxLength: this.form.get('maxLength').value,
        // pattern: this.form.get('pattern').value || '^[2-579]{2}\\s?\\d{2}\\s?\\d{2}\\s?\\d{2}$', // Tunisian phone number pattern
      },
      expressionProperties: {
        'templateOptions.errorState': (model: any, formState: any) => {
          const value = model.key;
          const minLength = this.form.get('minLength').value || 0;
          const maxLength = this.form.get('maxLength').value || Infinity;
          // tslint:disable-next-line:max-line-length
          // const isValidPhoneNumber = new RegExp( this.form.get('pattern').value || '^[2-579]{2}\\s?\\d{2}\\s?\\d{2}\\s?\\d{2}$').test(value);
          // return value.length < minLength || value.length > maxLength || !isValidPhoneNumber;
        },
      },
      // Customize other properties as needed
    };
  }

}
