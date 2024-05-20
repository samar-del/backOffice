import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../user/services/user.service';

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
    public dialogRef: MatDialogRef<AdminPageComponent>

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

  addNewUser() {
    if (this.form.valid) {
      console.log("Form Data:", this.form.value);
      this.userService.addUser(this.form.value).subscribe(
        data => {
          alert("User ajouté avec succès");
        },
        error => {
          console.error("Erreur lors de l'ajout d'un utilisateur:", error);
          alert("Erreur lors de l'ajout d'un utilisateur");
        }
      );
    } else {
      // Traiter le formulaire invalide si nécessaire
      alert("Veuillez remplir correctement tous les champs.");
    }
  }



  onNoClick(): void {
    this.dialogRef.close();

  }

}
