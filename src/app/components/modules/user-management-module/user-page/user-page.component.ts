import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/models/user';
import { ToastrService } from 'ngx-toastr';
import { Role } from 'src/app/models/role';
import { RoleService } from 'src/app/Modules/user/services/role.service';
import { UserService } from 'src/app/Modules/user/services/user.service';
import { AdminPageComponent } from '../admin-page/admin-page.component';
import { UpdateUserComponent } from '../update-user/update-user.component';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css'],
})
export class UserPageComponent implements OnInit{

  haveedit: any;
  haveedd: any;
  havedelete: any;

  roles:any;
  users: User[]=[];
  roleList: Role[] = [];
  userList: any;
  dataSource= new MatTableDataSource<User>(this.users);
  selectedRole: string | undefined;
  displayedColumns: string[] = ['username', 'email', 'role', 'action', 'delete'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: UserService,
    private dialog: MatDialog,
    private roleService: RoleService,
    private toastr: ToastrService,
   // public dialogRef: MatDialogRef<AdminPageComponent>

  ) {

  }
  ngOnInit(): void {
    this.loadUser();
    }


  loadUser(): void {
    this.service.getAllUSers().subscribe(
      (userList: User[]) => {
      this.users= userList;
      this.dataSource = new MatTableDataSource<User>(this.users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    },
    error => {
      console.error('Error fetching users:', error);
    }
  );
  }

  loadRoles(): void {
    this.roleService.getAllRoles().subscribe(
      roles => {
        this.roles = roles;
      },
      error => {
        console.error('Error loading roles:', error);
      }
    );
  }


 /* updateUser(): void {
    const dialogRef = this.dialog.open(UpdateUserComponent, {
      width: '350px',
      data: {} // Vous pouvez passer des données au dialogue si nécessaire
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialogue fermé');
    });
  }*/
  updateUser(){

  }


 /* updateUser(idUser: string, user: User) {
    this.service.updateUser(idUser, user).subscribe(
      () => {
        this.toastr.success('User updated successfully!');
        this.loadUser(); // Recharger la liste des utilisateurs après la mise à jour
      },
      (error) => {
        console.error('Error updating user:', error);
        this.toastr.error('Error updating user');
      }
    );
  }*/


  deleteUser(idUser: string) {
    this.service.deleteUser(idUser).subscribe(() => {
      this.toastr.success('delete successfully!');
      this.loadUser();
    });
  }

  AddAdminDialog(): void {
    const dialogRef = this.dialog.open(AdminPageComponent, {
      width: '500px',
      data: {} // Vous pouvez passer des données au dialogue si nécessaire
    }
  );
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUser();  // Recharger la liste des rôles après ajout
        this.toastr.success('User added successfully!');
      } else {
        this.toastr.info('User addition cancelled.');
      }
        });
  }

  opendialog() {
    this.loadUser();
  }
  onNoClick(): void {
    this.dialog.closeAll();

  }

}
