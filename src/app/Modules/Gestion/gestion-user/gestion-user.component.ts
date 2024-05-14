import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user/services/user.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-gestion-user',
  templateUrl: './gestion-user.component.html',
  styleUrls: ['./gestion-user.component.css']
})
export class GestionUserComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }


  affecterUserRole(idUser: string, idRole: string): void {
    this.userService.affecterUserRole(idUser, idRole).subscribe(
      (user: User) => {
        console.log('Rôle affecté avec succès à l\'utilisateur : ', user);
        // Faites quelque chose avec la réponse si nécessaire
      },
      (error) => {
        console.error('Erreur lors de l\'affectation du rôle à l\'utilisateur : ', error);
        // Gérez l'erreur ici
      }
    );
  }

}
