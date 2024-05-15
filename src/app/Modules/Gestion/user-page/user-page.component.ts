import { Component, OnInit, ViewChild } from '@angular/core';
import { ProtectedService } from '../../user/services/protected.service';
import { UserService } from '../../user/services/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css'],
})
export class UserPageComponent {
  constructor(private service: UserService) {
    this.Loaduser();
  }

  userList: any;
  dataSource: any;
  @ViewChild(MatPaginator)

  Loaduser() {
    this.service.getAllUSers().subscribe((res) => {
      this.userList = res;
      this.dataSource = new MatTableDataSource(this.userList);
    });
  }

  displayedColumns: string[] = ['username', 'email', 'role', 'action'];

  updateUser(idUser: string) {}
}
