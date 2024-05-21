import { RolePageComponent } from './../role-page/role-page.component';

import { Component, OnInit } from '@angular/core';
import { Permission } from 'src/app/models/permission';
import { Role } from 'src/app/models/role';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { PermissionService } from 'src/app/Modules/user/services/permission.service';
import { RoleService } from 'src/app/Modules/user/services/role.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-gestion-role',
  templateUrl: './gestion-role.component.html',
  styleUrls: ['./gestion-role.component.css']
})
export class GestionRoleComponent implements OnInit {

  roles:Role [];
  permissions: Permission[];

  newRole: Role = { roleType: '', permissions: [] };
  form: FormGroup;

  constructor(
    private roleService: RoleService,
    private permissionService: PermissionService,
    private dialogRef: MatDialogRef<RolePageComponent>,
    private fb: FormBuilder,
    private toastr: ToastrService

  ) {
    this.form = this.fb.group({
      roleType: ['', Validators.required],
      permissions: [[], Validators.required]
    });
   }

  ngOnInit(): void {
    this.loadRoles();
    this.loadPermissions();
  }

  save(){
    if(this.form.valid){
      const newRole: Role = this.form.value;
      this.roleService.addRole(newRole).subscribe(res=>{
        this.loadRoles();
        this.dialogRef.close(res);
      }, error => {
        console.error('Error adding role:', error);
      })
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
  addRoleWithPermissions(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const selectedPermissions = formValue.permissions.map((permissionId: string) =>
        this.permissions.find(permission => permission.idPermission === permissionId)
      );
      const newRole: Role = {
        roleType: formValue.roleType,
        permissions: selectedPermissions
      };

      this.roleService.addRoleWithPermissions(newRole).subscribe(
        response => {
          this.toastr.success('Role added successfully');
          this.form.reset();
        },
        error => {
          this.toastr.error('Failed to add role');
          console.error('Error adding role:', error);
        }
      );
    }
  }


  assignPermissions(options: HTMLOptionsCollection): void {
    const selectedIds: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedIds.push(options[i].value);
      }
    }
    this.form.get('permissions')?.setValue(selectedIds);
  }


  getSelectedPermissionIds(options: HTMLOptionsCollection): string[] {
    const selectedIds: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedIds.push(options[i].value);
      }
    }
    return selectedIds;
  }
  close() {
    this.dialogRef.close();
  }
  onNoClick(): void {
    this.dialogRef.close();

  }

}
