import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormColumnLayoutDialogComponent } from '../form-column-layout-dialog/form-column-layout-dialog.component';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-panel-dialog',
  templateUrl: './panel-dialog.component.html',
  styleUrls: ['./panel-dialog.component.css']
})
export class PanelDialogComponent implements OnInit {

  form:FormGroup;
  selectedTabIndex = 0;
  @ViewChild('formlyForm') formlyForm: any;
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [];
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FormColumnLayoutDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {
    this.form = this.fb.group({
      label: [this.data.label, Validators.required],
    });
  }

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
