import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../user/services/user.service';
import { User } from 'src/app/models/user';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupService } from '../../user/services/signup.service';
import { AuthService } from '../../user/services/auth.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-gestion-user',
  templateUrl: './gestion-user.component.html',
  styleUrls: ['./gestion-user.component.css'],
})
export class GestionUserComponent implements OnInit {
  signupForm: FormGroup;
  rolelist: any;



  constructor(
    private formBuilder: FormBuilder,
    private signupService: SignupService,
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService,
    private service: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialogRef<GestionUserComponent>
  ) {
    this.signupForm = this.formBuilder.group({
      userName: [''],
      password: [''],
      email: [''],
      roles: ['', Validators.required], // Initialize roles as an empty string
    });
  }

  editdata: any;

  ngOnInit(): void {
    this.service.getAllRoles().subscribe((res) => {
      this.rolelist = res;
    });
    if (this.data.userCode != null && this.data.userCode != '') {
      this.service.getRoleById(this.data.userCode).subscribe((res) => {
        this.editdata = res;
        // Check if editdata is defined and contains the roles property before accessing it
        if (this.editdata && this.editdata.roles && this.editdata.roles.length > 0) {
          const selectedRoleIds = this.editdata.roles.map(role => role.idRole);
          this.signupForm.patchValue({
            roles: selectedRoleIds // Set the selected role IDs
          });
        }
      });
    }
  }


  UpdateUser() {
    if (this.signupForm.valid) {
      this.userService
        .updateUser(this.signupForm.value.idUser, this.signupForm.value)
        .subscribe((res) => {
          this.toastr.success('Updated successfully!');
          this.dialog.close();
        });
    } else {
      this.toastr.warning('Please select a Role');
    }
  }

  affecterUserRole(idUser: string, idRole: string): void {
    this.userService.affecterUserRole(idUser, idRole).subscribe(
      (user: User) => {
        console.log("Rôle affecté avec succès à l'utilisateur : ", user);
        // Faites quelque chose avec la réponse si nécessaire
      },
      (error) => {
        console.error(
          "Erreur lors de l'affectation du rôle à l'utilisateur : ",
          error
        );
        // Gérez l'erreur ici
      }
    );
  }
}
