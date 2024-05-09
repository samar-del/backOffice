import { Permission } from './../../../models/permission';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Role } from 'src/app/models/role';
import { RoleServiceService } from 'src/app/services/role-service.service';
import { ConfigFileDiagnosticsReporter } from 'typescript';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { Permission } from 'src/app/models/permission';

@Component({
  selector: 'app-gestion-role',
  templateUrl: './gestion-role.component.html',
  styleUrls: ['./gestion-role.component.css']
})
export class GestionRoleComponent implements OnInit {

  @ViewChild(ConfirmationDialogComponent) confirmationDialog: ConfirmationDialogComponent;
  role: Role = {
    idRole: '',
    roleType: '',
    permissions: [] // Initialiser à un tableau vide
  };
  roleForUpdate: Role;
  roles: Role[] = [];
  newRole: Role = {};
  listroles: any;
  listpermissionRole!:Permission[];
  constructor( private roleService: RoleServiceService) { }

  ngOnInit(): void {
  }

  loadRoles() {
    this.roleService.getAllRoles().subscribe(
      roles => {
        this.roles = roles;
      },
      error => {
        console.error('Error fetching roles:', error);
      }
    );
  }

  getAllPermissions() {
    this.roleService.getAllRoles().subscribe(
      roles => {
        this.roles = roles;
      },
      error => {
        console.error('Error fetching roles:', error);
      }
    );
  }

  addRole() {
    this.roleService.addRole(this.newRole).subscribe(
      role => {
        this.roles.push(role);
        this.newRole = {};
      },
      error => {
        console.error('Error adding role:', error);
      }
    );
  }

  deleteRole(role: Role) {
    this.roleService.deleteRole(Number(role.idRole)).subscribe(
      () => {
        // Supprimer le rôle de la liste après la suppression réussie
        this.roles = this.roles.filter(r => r.idRole !== role.idRole);
      },
      error => {
        // Gérer les erreurs ici si nécessaire
        console.error('An error occurred while removing the role:', error);
      }
    );
  }




addRoleWithPermissions(role: Role): void {
 if (!role || !role.permissions || role.permissions.length === 0) {
      console.error('Role or permissions cannot be null or empty');
      return;
  }

    this.roleService.addRoleWithPermissions(role)
        .subscribe((response: Role) => {
            console.log('Role added successfully:', response);
            // Additional logic after adding the role
        }, error => {
            console.error('An error occurred while adding the role:', error);
        });
}

permissionRole(id:number){
  alert("salut")
  this.roleService.getListPermissionByIdRole(id).subscribe(
    data => {this.listpermissionRole = data},
    error => {alert("erreur recuperation list permission de ce role")}
  );
}

togglePermissionSelection(Permission: any, isChecked: boolean) {
  if (isChecked) {
    this.roleForUpdate.permissions.push(Permission);
  } else {
    const index = this.roleForUpdate.Permission.findIndex(p => p.idPermission === Permission.idPrivilege);
    if (index >= 0) {
      this.roleForUpdate.permissions.splice(index, 1);
    }
  }
}

}
