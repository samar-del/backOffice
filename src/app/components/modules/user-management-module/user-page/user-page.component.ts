// user-page.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/models/user';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/Modules/user/services/user.service';
import { AdminPageComponent } from '../admin-page/admin-page.component';
import { UpdateUserComponent } from '../update-user/update-user.component';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css'],
})
export class UserPageComponent implements OnInit {
  users: User[] = [];
  dataSource = new MatTableDataSource<User>(this.users);
  displayedColumns: string[] = ['username', 'email', 'role', 'action', 'delete'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: UserService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    this.service.getAllUSers().subscribe(
      (userList: User[]) => {
        this.users = userList;
        this.dataSource = new MatTableDataSource<User>(this.users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );
  }

  updateUser(idUser: string): void {
    const dialogRef = this.dialog.open(UpdateUserComponent, {
      width: '350px',
      data: { idUser: idUser }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUser();  // Reload the list of users after updating
        this.toastr.success('User updated successfully!');
      } else {
        this.toastr.info('User update cancelled.');
      }
    });
  }

  deleteUser(idUser: string): void {
    this.service.deleteUser(idUser).subscribe(() => {
      this.toastr.success('Deleted successfully!');
      this.loadUser();
    });
  }

  AddAdminDialog(): void {
    const dialogRef = this.dialog.open(AdminPageComponent, {
      width: '500px',
      data: {} // Pass data if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUser();  // Reload the list of users after addition
        this.toastr.success('User added successfully!');
      } else {
        this.toastr.info('User addition cancelled.');
      }
    });
  }

  onNoClick(): void {
    this.dialog.closeAll();
  }
}
