import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/models/user';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/Modules/user/services/auth.service';
import { SignupService } from 'src/app/Modules/user/services/signup.service';
import { UserService } from 'src/app/Modules/user/services/user.service';

@Component({
  selector: 'app-gestion-user',
  templateUrl: './gestion-user.component.html',
  styleUrls: ['./gestion-user.component.css'],
})
export class GestionUserComponent implements OnInit {
  form: FormGroup;
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
    this.form = this.formBuilder.group({
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
          this.form.patchValue({
            roles: selectedRoleIds // Set the selected role IDs
          });
        }
      });
    }
  }


  UpdateUser() {
    if (this.form.valid) {
      this.userService
        .updateUser(this.form.value.idUser, this.form.value)
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
