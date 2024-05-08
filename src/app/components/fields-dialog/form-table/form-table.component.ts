import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

@Component({
  selector: 'app-form-table',
  templateUrl: './form-table.component.html',
  styleUrls: ['./form-table.component.css']
})
export class FormTableComponent implements OnInit {

  form: FormGroup;
  previewForm: FormGroup;
  newField: FormlyFieldConfig;
  // Arrays to store row and column numbers
  rowArray: number[] = [];
  columnArray: number[] = [];
  @ViewChild('formlyForm') formlyForm: any;
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [];
  model: any = {};
  selectedTabIndex = 0;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FormTableComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }


  ngOnInit() {
    this.form = this.fb.group({
      label: [this.data.label, Validators.required],
      rows: [0, Validators.required],
      columns: [0, Validators.required],
      custom_css: [this.data.custom_css],
      label_position: [this.data.label_position || 'top'],
      hidden: [this.data.hidden],
      hide_label: [this.data.hide_label],
      property_name: [this.generatePropertyName(this.data.label)],
      field_tags: [this.data.field_tags]



    });
    this.form.get('label').valueChanges.subscribe((label: string) => {
      const propertyNameControl = this.form.get('property_name');
      propertyNameControl.setValue(this.generatePropertyName(label));
    });
  }

  generatePropertyName(label: string): string {
    const words = label.split(/\s+/); // Split label into words
    let propertyName = '';

    // Iterate over each word to construct property name
    words.forEach((word, index) => {
      // Skip whitespace or empty words
      if (word.trim() === '') {
        return;
      }

      // Make the first word lowercase
      if (index === 0) {
        propertyName += word.toLowerCase();
      } else {
        // Make the first letter of subsequent words uppercase
        propertyName += word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
    });

    return propertyName;
  }

  updateTags(inputValue: string): void {
    const tagsArray = inputValue.split(',').map(tag => tag.trim());
    this.form.get('field_tags').setValue(tagsArray);
  }

 /* saveTable(): void {
    if (this.form.valid) {
      const tableLayout = {
        label: this.form.value.label,
        rows: this.form.value.rows,
        columns: this.form.value.columns
      };
      this.dialogRef.close(tableLayout);
    } else {
      // Handle invalid form state if needed
    }
  }*/


onTabChange(event: any): void {
  this.selectedTabIndex = event.index;
}
onNoClick(): void {
  this.dialogRef.close();
}
getLabelStyles(): any {
  const customCssControl = this.form.get('custom_css');
  if (customCssControl && customCssControl.value) {
    return { 'cssText': customCssControl.value };
  } else {
    return {};
  }
}

}
  // Generate an array with numbers from 1 to the specified number of rows


