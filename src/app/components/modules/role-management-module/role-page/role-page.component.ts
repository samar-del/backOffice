import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Permission } from 'src/app/models/permission';
import { Role } from 'src/app/models/role';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RoleService } from 'src/app/Modules/user/services/role.service';
import { GestionRoleComponent } from '../gestion-role/gestion-role.component';
import { PermissionService } from 'src/app/Modules/user/services/permission.service';
import { forkJoin } from 'rxjs';
import {RoleUpdateComponent} from '../role-update/role-update.component';

@Component({
  selector: 'app-role-page',
  templateUrl: './role-page.component.html',
  styleUrls: ['./role-page.component.css']
})
export class RolePageComponent implements OnInit {
  roles: Role[] = [];
  displayedColumns: string[] = ['RoleType', 'Permissions', 'action', 'delete'];
  dataSource = new MatTableDataSource<Role>(this.roles);
  roleForm: FormGroup;
  showAddRoleModal: boolean = false; // Ajout d'une variable pour contrôler l'affichage du modal
  listPermissions = [];
  role : Role[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  permissions: any;

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private permissionService: PermissionService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {

  }

  ngOnInit(): void {
    this.roleForm = this.fb.group({
      roleType: ['', Validators.required]
            // Ajoutez d'autres contrôles de formulaire si nécessaire
    });
    this.loadRoles();
    this.loadPermissions();
  }

  loadRoles(): void {
    this.roleService.getAllRoles().subscribe(
      (data: Role[]) => {
        // Ensure that each role has a permissions array
        data.forEach(role => {
          if (!role.permissions) {
            role.permissions = [];
          }else {
            const permessionsByRole = [];
            role.permissions.forEach(permession => {
               this.permissionService.getPermissionToRole(permession).subscribe(res => {
                 permessionsByRole.push(res) ;
              });
            });
            role.permissions = permessionsByRole;
          }
        });
        this.roles = data;
        this.dataSource = new MatTableDataSource<Role>(this.roles);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => {
        console.error('Error fetching roles:', error);
      }
    );
  }



  dialogPEr(id: string, permission: string[]) {
    this.roleService.getRoleById(id).subscribe(roleInfo => {
      const permissionObservables = permission.map((permissionId: any) =>
        this.permissionService.getPermissionToRole(permissionId.id)
      );

      forkJoin(permissionObservables).subscribe(permissionsByRole => {
        const dialogRef = this.dialog.open(RoleUpdateComponent, {
          width: '500px',
          data: { role: roleInfo, permissions: permissionsByRole }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.loadRoles();  // Reload the list of roles after addition
            this.toastr.success('Permissions associated successfully!');
          } else {
            this.toastr.info('Permissions association cancelled.');
          }
        }, error => {
          console.error('Error occurred while subscribing to dialog close:', error);
          // Handle error, if necessary
        });
      }, error => {
        console.error('Error occurred while fetching permissions:', error);
        // Handle error, if necessary
      });
    }, error => {
      console.error('Error occurred while fetching role:', error);
      // Handle error, if necessary
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

  addRole() {
    const dialogRef = this.dialog.open(GestionRoleComponent, {
      width: '350px',
      data: {}, // Vous pouvez passer des données au dialogue si nécessaire
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRoles();  // Recharger la liste des rôles après ajout
        this.loadPermissions();
        this.toastr.success('Role added successfully!');
      } else {
        this.toastr.info('Role addition cancelled.');
      }
    });
  }



  deleteRole(id: string): void {
    this.roleService.deleteRole(id).subscribe(()=>{
      this.toastr.success('Deleted Role successfully');
      this.loadRoles();
    })

  }
}

