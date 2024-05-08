import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormDialogComponent } from '../form-dialog/form-dialog.component';

@Component({
  selector: 'app-tabs-dialog',
  templateUrl: './tabs-dialog.component.html',
  styleUrls: ['./tabs-dialog.component.css']
})
export class TabsDialogComponent implements OnInit {

  form: FormGroup;
  previewForm: FormGroup;
  newField: FormlyFieldConfig;
  @ViewChild('formlyForm') formlyForm: any;
  options: FormlyFormOptions = {};
  model: any = {};
  selectedTabIndex = 0; // Default tab index

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      label: [this.data.label],
      custom_css: [this.data.custom_css],
      hidden: [this.data.hidden],
      hide_label: [this.data.hide_label],
      disabled: [this.data.disabled],
      tableRows: this.fb.array([]) // Initialize form array for table rows
    });
    if (this.data.tableRows) {
      this.data.tableRows.forEach(row => this.addTabRow(row.label, row.key)); // Corrected method name
    }
  }

  addTab() {
    this.addTabRow('', ''); // Default values for label and key
  }

  removeTab(index: number) {
    this.tableRows.removeAt(index); // Corrected property name
  }

  addTabRow(label: string, key: string) {
    this.tableRows.push(this.fb.group({
      label: [label, Validators.required],
      key: [key, Validators.required]
    }));
  }

  // Remove a table row
  removeTableRow(index: number) {
    this.tableRows.removeAt(index);
  }

  // Getters for form array
  get tableRows() {
    return this.form.get('tableRows') as FormArray;
  }

  onTabChange(event: any): void {
    this.selectedTabIndex = event.index;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getLabelStyles(): any {
    const customCss = this.form.get('custom_css').value;
    return customCss ? { cssText: customCss } : {};
  }

  savetab() {
    const tablayout = {
      label: this.form.value.label,
      tableRows: this.form.value.tableRows
    };
    this.dialogRef.close(tablayout);
  }
  cancel() {
    this.dialogRef.close();
  }
}
