import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/Modules/user/services/user.service';
import { UserRequest } from 'src/app/models/user-request';

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
      roleType: new FormControl('')
     // permissionType: new FormControl('')

        });

    this.userService.getAllRoles().subscribe(
      (data: any) => {
        this.roles = data; // Stockez les rôles récupérés dans la variable roles
      },
      error => {
        console.error('Error fetching roles:', error);
      }
    );
  }

  addNewUser(): void {
    if (this.form.invalid) {
      return;
    }

    const formValue = this.form.value;
    const selectedRole = this.roles.find(role => role.name === formValue.roleType);
    const userRequest: UserRequest = {
      userName: formValue.userName,
      password: formValue.password,
      email: formValue.email,
      role: selectedRole ? [selectedRole] : []
    };

    this.userService.addUserAndAssignRole(userRequest).subscribe(
       response => {
        this.toastr.success('User added successfully', 'Success');
        this.dialogRef.close(true);
      },
      error => {
        this.toastr.error('Error adding user', 'Error');
        console.error('Error adding user', error);
      }
    );
  }




  onNoClick(): void {
    this.dialogRef.close();

  }

}
