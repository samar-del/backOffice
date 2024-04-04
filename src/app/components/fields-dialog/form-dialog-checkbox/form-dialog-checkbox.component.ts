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
    });
    this.form.valueChanges.subscribe(() => {
      this.updateFields();
    });

    this.updateFields();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  updateFields(): void {
    this.newField =
    {
      type: 'checkbox',
        key: 'key',
      templateOptions: {
      label: this.form.get('label').value || 'New Checkbox Label'
    },
      defaultValue: false,
    };
  }
  onTabChange(event: any): void {
    this.selectedTabIndex = event.index;
  }
}
