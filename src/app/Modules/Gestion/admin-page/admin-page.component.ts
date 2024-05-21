import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../user/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {

  form:FormGroup;

  newUserData = {role: {permissions:[] } } as any ;
  roles: any[];
  permissions: any[];

  constructor(private formBuilder: FormBuilder, private userService: UserService,
    public dialogRef: MatDialogRef<AdminPageComponent>,
    public toastr:ToastrService

  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      userName: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      roleType: new FormControl(''),
      permissionType: new FormControl('')

        });

    this.userService.getAllRoles().subscribe(
      (data: any) => {
        this.roles = data; // Stockez les rôles récupérés dans la variable roles
      },
      error => {
        console.error('Error fetching roles:', error);
      }
    );
    this.userService.getAllPermissions().subscribe(
      (data: any) => {
        this.permissions = data; // Stockez les permissions récupérées dans la variable permissions
      },
      error => {
        console.error('Error fetching permissions:', error);
      }
    );
  }

  addNewUser(): void {
    if (this.form.valid) {
      this.userService.addUser(this.form.value).subscribe(
        response => {
          this.toastr.success('User added successfully!');
          this.form.reset();
        },
        error => {
          console.error('Error adding user:', error);
          this.toastr.error('Error adding user: ' + error.message);
        }
      );
    } else {
      this.toastr.warning('Please fill in all required fields');
    }
  }
  



  onNoClick(): void {
    this.dialogRef.close();

  }

}
