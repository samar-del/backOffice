import {Component, Inject, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.css']
})
export class AlertDialogComponent implements OnInit {
  CustomAlertForm: FormGroup;
  showAlertInput: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AlertDialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.CustomAlertForm = this.fb.group({
      show_alert: [false],
      dont_show_alert: [false],
      alert_message: ['']
    });
  }

  ngOnInit(): void {
    this.CustomAlertForm = this.fb.group({
    alert_message : [this.data.alert_message],
      show_alert : [this.data.show_alert],
      dont_show_alert : [this.data.dont_show_alert]
    });
    // Subscribe to changes in the checkbox value to toggle the input visibility
    this.CustomAlertForm.get('show_alert')?.valueChanges.subscribe((value) => {
      if (value) {
        this.showAlertInput = true;
      } else {
        this.showAlertInput = false;
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
