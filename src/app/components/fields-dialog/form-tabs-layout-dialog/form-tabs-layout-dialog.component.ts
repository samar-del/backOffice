import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormColumnLayoutDialogComponent } from '../form-column-layout-dialog/form-column-layout-dialog.component';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

@Component({
  selector: 'app-form-tabs-layout-dialog',
  templateUrl: './form-tabs-layout-dialog.component.html',
  styleUrls: ['./form-tabs-layout-dialog.component.css']
})
export class FormTabsLayoutDialogComponent implements OnInit {

  form:FormGroup;
 // tabs: FormArray;
 previewForm: FormGroup;
  newField: FormlyFieldConfig;
  @ViewChild('formlyForm') formlyForm: any;
  options: FormlyFormOptions = {};
  model: any = {};
 selectedTabIndex = 0;


  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<FormTabsLayoutDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.form = this.fb.group({
      custom_css: [this.data.custom_css],
      tableRows: this.fb.array([])
    });

    this.form.valueChanges.subscribe(() => {
      this.updateFields();
    });

    this.updateFields();

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getLabelStyles(): any {
    const customCss = this.form.get('custom_css').value;
    return customCss ? { 'cssText': customCss } : {}; // Return inline styles object
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
  initializeForm(): void {
    this.form = this.fb.group({
      label: [''], // Ajoutez les contrôles de formulaire nécessaires
      tabs: this.fb.array([]) // Initialisez un FormArray vide pour les onglets
    });
  }
  get tabs(): FormArray {
    return this.form.get('tabs') as FormArray;
  }

  addTab(): void {
    this.tabs.push(this.createTabFormGroup());
  }

  removeTab(index: number): void {
    this.tabs.removeAt(index);
  }

  removeRow(index: number): void {
    this.tableRows.removeAt(index);
  }
  // Méthode pour créer un FormGroup pour un onglet
  createTabFormGroup(): FormGroup {
    return this.fb.group({
      label: [''], // Ajoutez d'autres contrôles de formulaire si nécessaire
      key: ['']
    });
  }

  updateFields(): void {


    this.newField = {
      key: 'key',
        type: 'select',
      templateOptions : {
        options : this.form.get('tableRows').value,
        custom_css: this.form.get('custom_css').value,
      },
    };
  }

cancel() {
  this.dialogRef.close();
}

}
