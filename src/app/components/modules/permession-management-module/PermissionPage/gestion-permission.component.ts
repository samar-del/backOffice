import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PermissionDialogAddComponent } from '../permission-dialog-add/permission-dialog-add.component';
import { PermissionService } from 'src/app/Modules/user/services/permission.service';
import { RoleService } from 'src/app/Modules/user/services/role.service';

@Component({
  selector: 'app-gestion-permission',
  templateUrl: './gestion-permission.component.html',
  styleUrls: ['./gestion-permission.component.css'],
})
export class GestionPermissionComponent implements OnInit {
  permissionList: any;
  datasource: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private roleService: RoleService,
    private permissions: PermissionService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {
    this.LoadPermission();
  }

  ngOnInit(): void {}

  LoadPermission() {
    this.permissions.getAllPermissions().subscribe((res) => {
      this.permissionList = res;
      this.datasource = new MatTableDataSource(this.permissionList);
      this.datasource.paginator = this.paginator;
      this.datasource.sort = this.sort;
    });
  }

  displayedColumns: string[] = ['PermissionType', 'PermissionName', 'delete'];

  deletePErmission(idPermission: string) {
    this.permissions.deletePermission(idPermission).subscribe(() => {
      this.toastr.success('deleted successfully');
      this.LoadPermission();
    });
  }
  addPermission() {
    const dialogRef = this.dialog.open(PermissionDialogAddComponent, {
      width: '500px',
      data: {}, // Vous pouvez passer des données au dialogue si nécessaire
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.LoadPermission();  // Recharger la liste des rôles après ajout
        this.toastr.success('Permission added successfully!');
      } else {
        this.toastr.info('Permission addition cancelled.');
      }    });
  }
}
