import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-form-tabs-layout-dialog',
  templateUrl: './form-tabs-layout-dialog.component.html',
  styleUrls: ['./form-tabs-layout-dialog.component.css']
})
export class FormTabsLayoutDialogComponent implements OnInit {

  form: FormGroup;
  fields: FormlyFieldConfig[];
  sizes: string[] = ['md', 'lg', 'sm']; // Define available sizes




  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FormTabsLayoutDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {  }

  ngOnInit(): void {
    this.form = this.fb.group({
      label: [this.data.label, Validators.required],
      tableRows: this.fb.array([]) // Initialize form array for table rows
    });

    // If there are existing table rows, populate them
    if (this.data.tableRows) {
      this.data.tableRows.forEach(row => this.addRow(row.size, row.width));
    }
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
