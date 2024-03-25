import {Component, Inject, OnInit, SimpleChanges} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-radio-customize-dialog',
  templateUrl: './radio-customize-dialog.component.html',
  styleUrls: ['./radio-customize-dialog.component.css']
})
export class RadioCustomizeDialogComponent implements OnInit {


  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<RadioCustomizeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  // tslint:disable-next-line:typedef
  ngOnInit() {
    debugger
    this.createRow();
    this.form = this.fb.group({
      label: [this.data.label, Validators.required],
      placeholder: [this.data.placeholder],
      disabled : [this.data.disabled],
      tableRows: this.fb.array([])
    });
    this.addRow();

    this.tableRows.controls.forEach((control: FormGroup) => {
      control.valueChanges.subscribe((value) => {
        console.log('Row value changed: ', value);
        // Perform any actions based on the changes here
      });
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  get tableRows(): FormArray {
    return this.form.get('tableRows') as FormArray;

  }

  createRow(): FormGroup {
    return this.fb.group({
      label: [this.data.labelOption || ''],
      value: [this.data.valueOption || ''],
    });
  }

  addRow(): void {
    this.tableRows.push(this.createRow());
  }

  removeRow(index: number): void {
    this.tableRows.removeAt(index);
  }
}
