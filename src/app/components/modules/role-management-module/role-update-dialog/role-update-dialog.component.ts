import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RoleService } from 'src/app/Modules/user/services/role.service';
import { Role } from 'src/app/models/role';

@Component({
  selector: 'app-role-update-dialog',
  templateUrl: './role-update-dialog.component.html',
  styleUrls: ['./role-update-dialog.component.css']
})
export class RoleUpdateDialogComponent implements OnInit {
  constructor(private rolePermissionService: RoleService, private toastr: ToastrService) {}
  roles: Role[] = []; 
  ngOnInit(): void {}

  associatePermissionToRole(roleId: string, permissionId: string): void {
    this.rolePermissionService.associatePermissionToRole(roleId, permissionId).subscribe(
      response => {
        this.toastr.success(response); // Display success message using Toastr
      },
      error => {
        this.toastr.error('Failed to associate permission with role.'); // Display error message using Toastr
        console.error('Failed to associate permission with role:', error);
      }
    );
  }

}
