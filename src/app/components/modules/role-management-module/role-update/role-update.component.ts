import {Component, Inject, OnInit} from '@angular/core';
import {Role} from '../../../../models/role';
import {Permission} from '../../../../models/permission';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {PermissionService} from '../../../../Modules/user/services/permission.service';
import {RoleService} from '../../../../Modules/user/services/role.service';

@Component({
  selector: 'app-role-update',
  templateUrl: './role-update.component.html',
  styleUrls: ['./role-update.component.css']
})
export class RoleUpdateComponent implements OnInit {

  selectedRole: Role; // Variable to store the selected role

  selectedPermissions: string[] = [];
  roles: Role[];
  permissions: any[];
  form: FormGroup;
  idRole: string; // Variable to store the idRole passed from the parent component
  allPermissions: any[];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      permissions: any[]
      role: any;
    },
    private permissionService: PermissionService,
    private fb: FormBuilder,
    private roleService: RoleService
  ) {

    this.idRole = this.data.role.id;
    this.form = this.fb.group({
      idRole: ['', Validators.required],
      permissions: [[], Validators.required]
    });
    this.form.patchValue({
      idRole: data.role.id,
    });
    this.permissions = this.data.permissions ;
    console.log("Data received in dialog component:", data);

  }

  ngOnInit(): void {
    this.idRole = this.data.role.id;
    this.permissions = this.data.permissions;
    this.roleService.getRoleById(this.idRole);
    this.permissionService.getAllPermissions().subscribe(res => {
      this.allPermissions = res;
    });

  }
  isPermissionSelected(permissionId: string): boolean {
    return this.permissions.some(permission => permission.id === permissionId);
  }
  onPermissionSelect(event: any) {
    const selectedPermissionId = event.target.value;
    if (selectedPermissionId) {
      this.selectedPermissions = [selectedPermissionId];
    }
  }
  onCancelClick() {
    this.dialogRef.close();
  }

  onConfirmClick() {
    const idRole = this.form.get('idRole').value;
    console.log("idrole" , idRole);
    const permissionId = this.selectedPermissions[0]; // Get the ID of the selected permission
    console.log("perm" , permissionId);

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
