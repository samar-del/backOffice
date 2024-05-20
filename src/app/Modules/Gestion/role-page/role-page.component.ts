import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RoleService } from '../../user/services/role.service';
import { PermissionService } from '../../user/services/permission.service';
import { Permission } from 'src/app/models/permission';
import { Role } from 'src/app/models/role';
import { GestionPermissionDialogComponent } from '../gestion-permission-dialog/gestion-permission-dialog.component';

@Component({
  selector: 'app-role-page',
  templateUrl: './role-page.component.html',
  styleUrls: ['./role-page.component.css']
})
export class RolePageComponent implements OnInit {

  dataSource: MatTableDataSource<Role>;
  permissions: Permission[] = [];
  displayedColumns: string[] = ['RoleType', 'Permissions', 'action', 'delete'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private roleService: RoleService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    this.loadRoles();
    this.loadPermissions();
  }

  loadRoles(): void {
    this.roleService.getAllRoles().subscribe((roles: Role[]) => {
      this.dataSource = new MatTableDataSource(roles);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  loadPermissions(): void {
    this.permissionService.getAllPermissions().subscribe(
      (permissions: Permission[]) => {
        this.permissions = permissions;
      },
      (error) => {
        console.error('Error fetching permissions', error);
      }
    );
  }

  deleteRole(idRole: string): void {
    this.roleService.deleteRole(idRole).subscribe(() => {
      this.toastr.success('Deleted successfully!');
      this.loadRoles();
    });
  }

  updateRole(idRole: string): void {
    //this.roleService.updateRole(idRole)
  }

  openDialog(): void {
    this.loadRoles();
  }
}
