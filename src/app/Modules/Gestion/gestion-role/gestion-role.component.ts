import { RolePageComponent } from './../role-page/role-page.component';

import { Component, OnInit } from '@angular/core';
import { PermissionService } from '../../user/services/permission.service';
import { RoleService } from '../../user/services/role.service';
import { Permission } from 'src/app/models/permission';
import { Role } from 'src/app/models/role';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GestionPermissionComponent } from '../PermissionPage/gestion-permission.component';
import { MatDialogRef } from '@angular/material/dialog';

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
    private fb: FormBuilder

  ) {
    this.form= this.fb.group({
      roleType:['', Validators.required]
    })
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

  loadPermissions() {
    this.permissionService.getAllPermissions().subscribe(permissions => {
      this.permissions = permissions;
    });
  }

  addRoleWithPermissions() {
    this.roleService.addRoleWithPermissions(this.newRole).subscribe(role => {
      // Reset the newRole object
      this.newRole = { roleType: '', permissions: [] };
      // Handle success (e.g., show a success message)
      console.log('Role added successfully:', role);
    }, error => {
      // Handle error (e.g., show an error message)
      console.error('Error adding role:', error);
    });
  }


  assignPermissions(selectedPermissions: Permission[]) {
    this.newRole.permissions = selectedPermissions;
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


}
