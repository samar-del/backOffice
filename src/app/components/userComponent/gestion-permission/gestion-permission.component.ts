import { Component, OnInit } from '@angular/core';
import { PermissionServiceService } from 'src/app/services/permission-service.service';
import { ToastrService } from 'ngx-toastr';
import { Permission } from 'src/app/models/permission';

@Component({
  selector: 'app-gestion-permission',
  templateUrl: './gestion-permission.component.html',
  styleUrls: ['./gestion-permission.component.css']
})
export class GestionPermissionComponent implements OnInit {


  listpermission: Permission[];
  permissions: Permission[] = [];
  permission: Permission ={
    idPermission:'',
    permissionName:'',
    permissionType:'',
  }
  newPermission: Permission = {};
  permissionForUpdate : Permission= {};

  constructor(private permissionService: PermissionServiceService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  loadPermissions() {
    this.permissionService.getAllPermissions().subscribe(
      permissions => {
        this.permissions = permissions;
      },
      error => {
        console.error('Error fetching permissions:', error);
      }
    );
  }

  addPermission() {
    this.permissionService.addPermission(this.newPermission).subscribe(
      permission => {
        this.permissions.push(permission);
        this.newPermission= {};
        this.toastr.success('Permission added successfully', 'Success');
       // this.loadPermissions(); // Reload permissions after adding
      },
      error => {
        console.error('Error adding permission:', error);
        this.toastr.error('Error adding permission', 'Error');
      }
    );
  }

 deletePermission(idPermission: number) {
    this.permissionService.deletePermission(idPermission).subscribe(
      () => {
        this.permissions = this.permissions.filter(p => p.idPermission !== idPermission.toString()); // Remove deleted permission from the list
        this.toastr.success('Permission deleted successfully', 'Success');
      },
      error => {
        console.error('Error deleting permission:', error);
        this.toastr.error('Error deleting permission', 'Error');
      }
    );
  }

  getPermissionById(id: string) {
    this.permissionService.getPermissionById(id).subscribe(
      permission => {
        // Handle retrieved permission
        console.log('Permission:', permission);
      },
      error => {
        console.error('Error fetching permission by ID:', error);
        this.toastr.error('Error fetching permission by ID', 'Error');
      }
    );
  }


  updatePermission() {
    console.log(this.permissionForUpdate);
    this.permissionService.updatePermission(this.permissionForUpdate).subscribe(
      data => {
        this.toastr.warning("Permission updated !", 'Notification');
        // Vous pouvez ajouter d'autres actions ici si nécessaire
      },
      err => {
        this.toastr.error("Error in Permission update !", 'Notification');
      }
    );
  }
}
