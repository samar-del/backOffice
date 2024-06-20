import { PermissionService } from 'src/app/Modules/user/services/permission.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleService } from 'src/app/Modules/user/services/role.service';
import { Role } from 'src/app/models/role';
import { Permission } from 'src/app/models/permission';

@Component({
  selector: 'app-permission-dialog',
  templateUrl: './permission-dialog.component.html',
  styleUrls: ['./permission-dialog.component.css']
})
export class PermissionDialogComponent implements OnInit {
  selectedRole: Role; // Variable to store the selected role

  selectedPermissions: string[] = [];
  roles: Role[];
  permissions: Permission[];
  form: FormGroup;
  idRole: string; // Variable to store the idRole passed from the parent component

  constructor(
    public dialogRef: MatDialogRef<PermissionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { idRole: string, permissions: any[] },
    private permissionService: PermissionService,
    private fb: FormBuilder,
    private roleService: RoleService
  ) {


    this.form = this.fb.group({
     idRole: ['', Validators.required],
      permissions: [[], Validators.required]
    });
    this.form.patchValue({
      idRole: data.idRole
    });

    console.log("Data received in dialog component:", data);

  }

  ngOnInit(): void {
    this.loadPermissions();
    this.roleService.getRoleById(this.idRole);

  }

  onPermissionSelect(event: any) {
    const selectedPermissionId = event.target.value;
    if (selectedPermissionId) {
      this.selectedPermissions = [selectedPermissionId];
    }
  }

  loadRoles() {
    this.roleService.getAllRoles().subscribe(roles => {
      this.roles = roles;
    });
  }

  loadPermissions(): void {
    this.permissionService.getAllPermissions().subscribe(
      permissions => {
        this.permissions = permissions;
      },
      error => {
        console.error('Error loading permissions:', error);
      }
    );
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  onConfirmClick() {
    const idRole = this.form.get('idRole').value;
    console.log("idrole" ,idRole);
    const permissionId = this.selectedPermissions[0]; // Get the ID of the selected permission
    console.log("perm" ,permissionId);

    if (permissionId && idRole) {
      this.roleService.associatePermissionToRole(idRole, permissionId).subscribe(success => {
        if (success) {
          console.log('Permission associated successfully');
          this.dialogRef.close(true); // Pass true to indicate success
        } else {
          console.error('Failed to associate permission with role');
          // Handle failure
        }
      });
    }
  }

}
