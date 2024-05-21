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

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css'],
})
export class UserPageComponent {
  constructor(
    private service: UserService,
    private dialog: MatDialog,
    private roleService: RoleService,
    private toastr: ToastrService,
   // public dialogRef: MatDialogRef<AdminPageComponent>

  ) {
    this.loadUser();
    this.loadRoles();
  }

  haveedit: any;
  haveedd: any;
  havedelete: any;

  roleList: Role[] = [];
  userList: any;
  dataSource: any;
  selectedRole: string | undefined;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  loadUser(): void {
    this.service.getAllUSers().subscribe((userList: User[]) => {
      this.dataSource = new MatTableDataSource(userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  loadRoles(): void {
    this.roleService.getAllRoles().subscribe(
      (roles: Role[]) => {
        this.roleList = roles;
      },
      (error) => {
        console.error('Error fetching roles', error);
      }
    );
  }

  displayedColumns: string[] = ['username', 'email', 'role', 'action', 'delete'];

 /* updateUser(): void {
    const dialogRef = this.dialog.open(UpdateUserComponent, {
      width: '350px',
      data: {} // Vous pouvez passer des données au dialogue si nécessaire
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialogue fermé');
    });
  }*/
  updateUser(idUser: string){

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
      width: '350px',
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
