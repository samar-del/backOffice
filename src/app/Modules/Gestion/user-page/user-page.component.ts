import { Component, OnInit, ViewChild } from '@angular/core';
import { ProtectedService } from '../../user/services/protected.service';
import { UserService } from '../../user/services/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { GestionUserComponent } from '../gestion-user/gestion-user.component';
import { RoleService } from '../../user/services/role.service';
import { User } from 'src/app/models/user';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css'],
})
export class UserPageComponent {
  constructor(private service: UserService, private dialog: MatDialog, private roleService:RoleService, private toastr:ToastrService) {
    this.Loaduser();
  }

  listroles: any;
  userList: any;
  dataSource: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  Loaduser(): void {
    this.service.getAllUSers().subscribe((res) => {
      this.userList = res;
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    this.roleService.getAllRoles().subscribe(
      data =>{this.listroles = data},
      error => {alert("Error de recuperation des privileges")}

    )
  }

  displayedColumns: string[] = ['username', 'email', 'role', 'action', 'delete'];

  updateUser(idUser: string) {
    //popup update = GestionUserComponent
    const popup = this.dialog.open(GestionUserComponent, {
      data: {
        userCode: idUser,
      },
      width: '50%',
    });

    popup.afterClosed().subscribe((res) => {
      this.Loaduser();

    });
  }
  deleteUser(idUser:string){
    this.service.deleteUser(idUser).subscribe(() => {
      this.toastr.success('delete successfully!');
      this.Loaduser();

    }
    )


  }

  opendialog() {
    this.Loaduser();
  }
}
