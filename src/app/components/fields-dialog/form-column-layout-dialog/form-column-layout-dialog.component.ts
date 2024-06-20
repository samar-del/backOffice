import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-form-column-layout-dialog',
  templateUrl: './form-column-layout-dialog.component.html',
  styleUrls: ['./form-column-layout-dialog.component.css']
})
export class FormColumnLayoutDialogComponent implements OnInit {

  form: FormGroup;
  sizes: string[] = ['md', 'lg', 'sm']; // Define available sizes
  selectedTabIndex = 0;
  translations: any = {};
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FormColumnLayoutDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      label: [this.data.label, Validators.required],
      property_name: [this.data.label],
      tableRows: this.fb.array([]), // Initialize form array for table rows
      custom_css: [this.data.custom_css],
      hidden: [this.data.hidden],
      hide_label: [this.data.hide_label],
    });

    // If there are existing table rows, populate them
    if (this.data.tableRows) {
      this.data.tableRows.forEach(row => this.addRow(row.size, row.width));
    }
  }
  onTabChange(event: any): void {
    this.selectedTabIndex = event.index;
  }
  updateTags(inputValue: string): void {
    const tagsArray = inputValue.split(',').map(tag => tag.trim());
    this.form.get('field_tags').setValue(tagsArray);
  }

  // Add a new table row
  addTableRow() {
    this.addRow('md', ''); // Default values for size and width
  }

  // Remove a table row
  removeTableRow(index: number) {
    this.tableRows.removeAt(index);
  }

  // Getters for form array
  get tableRows() {
    return this.form.get('tableRows') as FormArray;
  }

  // Helper method to add a row to the form array
  private addRow(size: string, width: string) {
    this.tableRows.push(this.fb.group({
      size: [size, Validators.required],
      width: [width, Validators.required]
    }));
  }

  getLabelStyles(): any {
    const customCss = this.form.get('custom_css').value;
    return customCss ? { 'cssText': customCss } : {}; // Return inline styles object
  }
  saveColumnLayout() {
    const columnLayout = {
      label: this.form.value.label,
      tableRows: this.form.value.tableRows
    };
    this.dialogRef.close(columnLayout);
  }

  cancel() {
    this.dialogRef.close();
  }
}
