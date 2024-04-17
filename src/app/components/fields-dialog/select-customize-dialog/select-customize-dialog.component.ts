import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';

@Component({
  selector: 'app-select-customize-dialog',
  templateUrl: './select-customize-dialog.component.html',
  styleUrls: ['./select-customize-dialog.component.css']
})
export class SelectCustomizeDialogComponent implements OnInit {
  form: FormGroup;
  previewForm: FormGroup;
  newField: FormlyFieldConfig;
  @ViewChild('formlyForm') formlyForm: any;
  options: FormlyFormOptions = {};
  model: any = {};
  selectedTabIndex = 0;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SelectCustomizeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.form = this.fb.group({
      label: [this.data.label, Validators.required],
      placeholder: [this.data.placeholder],
      disabled : [this.data.disabled],
      custom_css: [this.data.custom_css],
      hidden: [this.data.hidden],
      hide_label: [this.data.hide_label],
      required: [this.data.required],
      tableRows: this.fb.array([])
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
  getLabelStyles(): any {
    const customCss = this.form.get('custom_css').value;
    return customCss ? { 'cssText': customCss } : {}; // Return inline styles object
  }
  removeRow(index: number): void {
    this.tableRows.removeAt(index);
  }

  updateFields(): void {
    const labelHidden = this.form.get('hide_label').value;
    const inputHidden = this.form.get('hidden').value;
    const inputDisabled = this.form.get('disabled').value;

    this.newField = {
      key: 'key',
        type: 'select',
      templateOptions : {
        label: this.form.get('label').value,
        options : this.form.get('tableRows').value,
        custom_css: this.form.get('custom_css').value,
        disabled: inputDisabled,
    },
      hide: inputHidden,
      expressionProperties: {
        'templateOptions.hideLabel': () => labelHidden
      },
    };
  }

}
