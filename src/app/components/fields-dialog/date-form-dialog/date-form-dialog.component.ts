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
      minLength: [this.data.minLength, Validators.min(0)],
      maxLength: [this.data.maxLength, Validators.min(0)],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
