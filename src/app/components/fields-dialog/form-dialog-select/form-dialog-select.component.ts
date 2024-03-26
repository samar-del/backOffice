import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-form-dialog-select',
  templateUrl: './form-dialog-select.component.html',
  styleUrls: ['./form-dialog-select.component.css']
})
export class FormDialogSelectComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FormDialogSelectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      label: [this.data.label, Validators.required],
      options: this.fb.array([]) // Initialize options as a FormArray
    });
  }

  get options(): FormArray {
    return this.form.get('options') as FormArray;
  }

  addOption(optionValue: string) {
    this.options.push(this.fb.control(optionValue));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
