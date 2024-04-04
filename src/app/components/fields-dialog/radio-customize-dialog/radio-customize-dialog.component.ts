import {Component, Inject, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';

@Component({
  selector: 'app-radio-customize-dialog',
  templateUrl: './radio-customize-dialog.component.html',
  styleUrls: ['./radio-customize-dialog.component.css']
})
export class RadioCustomizeDialogComponent implements OnInit {


  form: FormGroup;
  previewForm: FormGroup;
  newField: FormlyFieldConfig;
  @ViewChild('formlyForm') formlyForm: any;
  options: FormlyFormOptions = {};
  model: any = {};
  selectedTabIndex = 0;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<RadioCustomizeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.form = this.fb.group({
      label: [this.data.label, Validators.required],
      placeholder: [this.data.placeholder],
      disabled : [this.data.disabled],
      tableRows: this.fb.array([])
    });
    this.form.valueChanges.subscribe(() => {
      this.updateFields();
    });

    this.updateFields();
  }
  updateFormGroup(index: number, controlName: string, value: any): void {
    const tableRowsArray = this.form.get('tableRows') as FormArray;
    const rowFormGroup = tableRowsArray.at(index) as FormGroup;
    rowFormGroup.controls[controlName].setValue(value);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  get tableRows(): FormArray {
    console.log(this.form.get('tableRows') );
    return this.form.get('tableRows') as FormArray;
  }

  createRow(): FormGroup {
    const row = this.fb.group({
      label: [''],
      value: [''],
    });
    return row;
  }
  addRow(): void {
    const tableRowsArray = this.form.get('tableRows') as FormArray;
    tableRowsArray.push(this.createRow());
  }

  removeRow(index: number): void {
    this.tableRows.removeAt(index);
  }
  updateFields(): void {
    this.newField = {
        type: 'radio',
        key: 'key',
        templateOptions: {
          label: this.form.get('label').value,
          options : this.form.get('tableRows').value ,
        },
      };
  }
  onTabChange(event: any): void {
    this.selectedTabIndex = event.index;
  }
}
