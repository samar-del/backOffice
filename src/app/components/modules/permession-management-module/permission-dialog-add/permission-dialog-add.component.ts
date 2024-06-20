import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Permission } from 'src/app/models/permission';
import { GestionPermissionComponent } from '../PermissionPage/gestion-permission.component';
import { PermissionService } from 'src/app/Modules/user/services/permission.service';

@Component({
  selector: 'app-permission-dialog-add',
  templateUrl: './permission-dialog-add.component.html',
  styleUrls: ['./permission-dialog-add.component.css']
})
export class PermissionDialogAddComponent  {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private permissionService: PermissionService,
    private dialogRef: MatDialogRef<GestionPermissionComponent>
  ) {
    this.form = this.fb.group({
      permissionType: ['', Validators.required],
      permissionName: ['', Validators.required]
    });
  }

  save() {
    if (this.form.valid) {
      const newPermission: Permission = this.form.value;
      this.permissionService.addPermission(newPermission).subscribe(response => {
        this.dialogRef.close(response);
      }, error => {
        console.error('Error adding permission:', error);
      });
    }
  }


  close() {
    this.dialogRef.close();
  }


}
