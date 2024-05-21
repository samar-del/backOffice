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
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GestionRoleComponent } from '../gestion-role/gestion-role.component';

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

  role : Role[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.roleForm = this.fb.group({
      roleType: ['', Validators.required],
      // Ajoutez d'autres contrôles de formulaire si nécessaire
    });
    this.loadRoles();
  }

  loadRoles(): void {
    this.roleService.getAllRoles().subscribe(
      (data: Role[]) => {
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

  openAddRoleModal(): void {
    this.showAddRoleModal = true;
  }

  closeAddRoleModal(): void {
    this.showAddRoleModal = false;
  }



  addRole() {
    const dialogRef = this.dialog.open(GestionRoleComponent, {
      width: '350px',
      data: {}, // Vous pouvez passer des données au dialogue si nécessaire
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRoles();  // Recharger la liste des rôles après ajout
        this.toastr.success('Role added successfully!');
      } else {
        this.toastr.info('Role addition cancelled.');
      }
    });
  }

  updateRole(idRole: string): void {
    // Mettez à jour la logique du rôle ici
  }

  deleteRole(idRole: string): void {
    this.roleService.deleteRole(idRole).subscribe(()=>{
      this.toastr.success('deleted successfully');
      this.loadRoles();
    })

  }
}

