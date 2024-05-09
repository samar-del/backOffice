import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-tabs-dialog',
  templateUrl: './tabs-dialog.component.html',
  styleUrls: ['./tabs-dialog.component.css']
})
export class TabsDialogComponent implements OnInit {
  form: FormGroup;
  selectedTabIndex = 0;
  tabs = ['tab1'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TabsDialogComponent>
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      label: [''],
      custom_css: [''],
      hidden: [false],
      disabled: [false],
      tableRows: this.fb.array([])
    });
    this.addTabRow('tab1', 'tab1');
  }

  addTabRow(label: string, key: string): void {
    const row = this.fb.group({
      label: [label],
      key: [key]
    });
    this.tableRows.push(row);
  }

  get tableRows(): FormArray {
    return this.form.get('tableRows') as FormArray;
  }

  onTabChange(event): void {
    this.selectedTabIndex = event.index;
    if (this.selectedTabIndex === 0) {
      this.tableRows.clear();
      this.addTabRow('tab1', 'tab1');
    }
  }

  removeTableRow(index: number) {
    this.tableRows.removeAt(index);
  }

  cancel() {
    this.dialogRef.close();
  }

  addLink() {
    const newTabNumber = this.tabs.length + 1;
    const newTabLabel = `tab ${newTabNumber}`;
    this.tabs.push(newTabLabel);
    this.addTabRow(newTabLabel, newTabLabel);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
