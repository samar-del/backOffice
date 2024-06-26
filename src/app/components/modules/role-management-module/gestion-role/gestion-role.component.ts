import { Options } from './../../../../models/Options';
import { RolePageComponent } from './../role-page/role-page.component';

import { Component, OnInit } from '@angular/core';
import { Permission } from 'src/app/models/permission';
import { Role } from 'src/app/models/role';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { PermissionService } from 'src/app/Modules/user/services/permission.service';
import { RoleService } from 'src/app/Modules/user/services/role.service';
import { ToastrService } from 'ngx-toastr';
import { error } from 'console';

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
  selectedPermissions: number[] = [];

  constructor(
    private roleService: RoleService,
    private permissionService: PermissionService,
    private dialogRef: MatDialogRef<RolePageComponent>,
    private fb: FormBuilder,
    private toastr: ToastrService

  ) {
    this.form = this.fb.group({
      roleType: new FormControl('', Validators.required),
      permissions: new FormControl('')
    });
    this.permissionService.getAllPermissions().subscribe(
      (data: any)=>{
        this.permissions = data;
      },
      error =>{
        console.error('error fetching permission', error);
      }
    )
   }

  ngOnInit(): void {
    this.loadRoles();
    this.loadPermissions();
  }

  save(){
    if(this.form.valid){
      const newRole: Role = this.form.value;
      this.roleService.addRole(newRole).subscribe(
        res=>{
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
        this.permissions.find(permission => permission.id === permissionId)
      ).filter(permission => permission.id); // Filter out undefined values
      const listPermissionsId = [];
      selectedPermissions.forEach(el => {
        listPermissionsId.push(el.id);
      });
      const newRole: Role = {
        roleType: formValue.roleType,
        permissions: listPermissionsId,
      };

      this.roleService.addRoleWithPermissions(newRole).subscribe(
        response => {
          this.dialogRef.close(response);
          this.loadRoles();
          this.loadPermissions();
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
  toUpperCaseInput() {
    const roleType = this.form.get('roleType');
    if (roleType) {
      const upperCaseValue = roleType.value.toUpperCase().replace(/\s/g, '');
      roleType.setValue(upperCaseValue, { emitEvent: false });
    }
  }
}
