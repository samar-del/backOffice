import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-date-form-dialog',
  templateUrl: './date-form-dialog.component.html',
  styleUrls: ['./date-form-dialog.component.css']
})
export class DateFormDialogComponent implements OnInit {

  form: FormGroup;

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
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
