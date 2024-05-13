import { Component, OnInit } from '@angular/core';
import { Permission } from 'src/app/models/permission';
import { Role } from 'src/app/models/role';
import { PermissionServiceService } from 'src/app/services/permission-service.service';
import { RoleServiceService } from 'src/app/services/role-service.service';
import { switchMap, map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-gestion-role',
  templateUrl: './gestion-role.component.html',
  styleUrls: ['./gestion-role.component.css']
})
export class GestionRoleComponent implements OnInit {
  roles: Role[];
  permissions: Permission[];
  selectedRole: Role;
  selectedPermissions: Permission[];

  constructor(private roleService: RoleServiceService, private permissionService: PermissionServiceService) { }

  ngOnInit(): void {
    this.getAllRoles();
    this.getAllPermissions();
  }

  getAllRoles() {
    this.roleService.getAllRoles().subscribe(roles => {
      this.roles = roles;
    });
  }

  getAllPermissions() {
    this.permissionService.getAllPermissions().subscribe(permissions => {
      this.permissions = permissions;
    });
  }

  onSelectRole(role: Role) {
    this.selectedRole = role;
    this.getSelectedPermissions();
  }

  getSelectedPermissions() {
    if (this.selectedRole && this.selectedRole.idRole) {
      this.roleService.getListPermissionByIdRole(this.selectedRole.idRole).subscribe(permissions => {
        this.selectedPermissions = permissions;
      });
    }
  }
  togglePermission(permission: Permission) {
    if (this.selectedRole && this.selectedPermissions) {
      if (this.isSelectedPermission(permission)) {
        // Remove permission
        this.selectedPermissions = this.selectedPermissions.filter(p => p.idPermission !== permission.idPermission);
      } else {
        // Add permission
        this.selectedPermissions.push(permission);
      }
    }
  }

  isSelectedPermission(permission: Permission): boolean {
    return this.selectedPermissions && this.selectedPermissions.some(p => p.idPermission === permission.idPermission);
  }

  savePermissions() {
    if (this.selectedRole && this.selectedPermissions) {
      const permissionObservables = this.selectedPermissions.map(permission => {
        return this.permissionService.getPermissionById(permission.idPermission);
      });

      forkJoin(permissionObservables).subscribe((permissions: Permission[][]) => {
        // Flatten the array of arrays into a single array
        const flattenedPermissions = [].concat(...permissions);

        // Update role with selected permissions
        this.selectedRole.permissions = flattenedPermissions;

        // Update the role in the backend
        this.roleService.updateRole(this.selectedRole).subscribe(() => {
          // Handle success
          console.log('Permissions saved successfully.');
        }, error => {
          // Handle error
          console.error('Failed to save permissions:', error);
        });
      });

    }
  }
}
