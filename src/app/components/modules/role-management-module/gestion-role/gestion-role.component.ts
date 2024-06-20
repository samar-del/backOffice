import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Permission } from 'src/app/models/permission';
<<<<<<< Updated upstream
import { Role } from 'src/app/models/role';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { PermissionService } from 'src/app/Modules/user/services/permission.service';
=======
>>>>>>> Stashed changes
import { RoleService } from 'src/app/Modules/user/services/role.service';
import { PermissionService } from 'src/app/Modules/user/services/permission.service';
import { ToastrService } from 'ngx-toastr';
<<<<<<< Updated upstream
import { error } from 'console';
=======
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
>>>>>>> Stashed changes

@Component({
  selector: 'app-gestion-role',
  templateUrl: './gestion-role.component.html',
  styleUrls: ['./gestion-role.component.css'],
})
export class GestionRoleComponent implements OnInit {
  permissions: Permission[]=[]; // Define Permission array
  roleForm: FormGroup; // Form group for role type and permission selection
  selected: string;
  roleType: string;

  constructor(
    public dialogRef: MatDialogRef<GestionRoleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private roleService: RoleService,
    private permissionService: PermissionService,
    private toastr: ToastrService
  ) {
<<<<<<< Updated upstream
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
=======
    this.selected = '';
    this.permissions = data.permissions || [];
    this.roleForm = this.fb.group({
      roleType: ['', Validators.required],
      // Autres contrôles de formulaire si nécessaire
    });
  }
>>>>>>> Stashed changes

  ngOnInit(): void {
    this.loadPermissions();
  }



  loadPermissions(): void {
    this.permissionService.getAllPermissions().subscribe(
      permissions => {
        this.permissions = permissions;
      },
      error => {
        console.error('Error loading permissions:', error);
        this.toastr.error('Failed to load permissions.');
      }
    );
  }
<<<<<<< Updated upstream
  addRoleWithPermissions(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const selectedPermissions = formValue.permissions.map((permissionId: string) =>
        this.permissions.find(permission => permission.id === permissionId)
      ).filter(permission => permission); // Filter out undefined values

      const newRole: Role = {
        roleType: formValue.roleType,
        permissions: selectedPermissions
=======

  cancel(): void {
    this.dialogRef.close();
  }

  addRoleAndAssociatePermission(): void {
    if (this.roleForm.valid) {

      const roleRequest = {
        roleType: this.roleType
        // Add other properties related to role creation as needed
>>>>>>> Stashed changes
      };

      this.roleService.addRoleAndAssociatePermission(roleRequest, this.selected).subscribe(
        result => {
          this.toastr.success('Role added and permission associated successfully.');
          this.dialogRef.close(true); // Close dialog with success
        },
        error => {
          console.error('Error adding role and associating permission:', error);
          this.toastr.error('Failed to add role and associate permission.');
          // Optionally handle error case
        }
      );
    } else {
      // Mark form controls as touched to display validation errors
      this.roleForm.markAllAsTouched();
      this.toastr.error('Please fill out all required fields.');
    }
  }
<<<<<<< Updated upstream



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

=======
>>>>>>> Stashed changes
}
