import {ChangeDetectorRef, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';

@Component({
  selector: 'app-address-customize-dialog',
  templateUrl: './address-customize-dialog.component.html',
  styleUrls: ['./address-customize-dialog.component.css']
})
export class AddressCustomizeDialogComponent implements OnInit {
 form: FormGroup;
  previewForm: FormGroup;
  newField: FormlyFieldConfig;
  fields: FormlyFieldConfig[] = [];
  @ViewChild('formlyForm') formlyForm: any;
  options: FormlyFormOptions = {};
  model: any = {};
  selectedTabIndex = 0; // Default tab index


  showTable = false; // Variable to store the state of the checkbox
  NumberOptions = 0 ;
  // @ts-ignore
  // @ts-ignore
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddressCustomizeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdr: ChangeDetectorRef
  ) {}
  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.form = this.fb.group({
      label: [this.data.label, Validators.required],
      placeholder: [this.data.placeholder],
      disabled : [this.data.disabled],
      custom_css: [this.data.custom_css],
      required: [this.data.required],
      tableRows: this.fb.array([])
    });
    this. toggleTableVisibility();
    this.form.valueChanges.subscribe(() => {
      this.updateFields();
    });

    this.updateFields();
  }
  toggleTableVisibility(): void {
    this.showTable = !this.showTable;
    this.cdr.detectChanges();
  }
  getLabelStyles(): any {
    const customCss = this.form.get('custom_css').value;
    return customCss ? { 'cssText': customCss } : {}; // Return inline styles object
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
      placeholder: [''],
    });
    return row;
  }
  addRow(): void {
    const tableRowsArray = this.form.get('tableRows') as FormArray;
    tableRowsArray.push(this.createRow());
    this.NumberOptions++ ;
  }

  removeRow(index: number): void {
    this.tableRows.removeAt(index);
    this.NumberOptions--;
  }
  onTabChange(event: any): void {
    this.selectedTabIndex = event.index;
  }
  updateFields(): void {
    if ( this.NumberOptions === 0) {
      this.newField = {
        key: 'key',
        type: 'input',
        templateOptions: {
          label: this.form.get('label').value,
          options: this.form.get('tableRows').value,
          custom_css: this.form.get('custom_css').value,
        },
      };
      this.fields.push(this.newField);
    }else {
      const addressTemplateOption: any [] = [];
      addressTemplateOption.push(this.form.get('tableRows'));
      for (let i = 0 ; i < this.NumberOptions ; i++ ){
      addressTemplateOption.forEach(el => {
        this.newField = {
          key: 'key',
          type: 'input',
          templateOptions: {
            label: this.form.get('label').value,
            placeholder: this.form.get('placeholder').value,
            custom_css: this.form.get('custom_css').value,
          },
        };
        this.fields.push(this.newField);
      });
    }
    }
  }
}
