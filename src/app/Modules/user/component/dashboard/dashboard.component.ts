import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  isLoggedIn: boolean = false;

  constructor(private authService:AuthService, private loginService:LoginService, private router:Router
  ) { }
  //username:string=this.authService.getUsername()??"";
 ngOnInit(): void {
  this.chacklogedInUser();

 }


 chacklogedInUser(){
  this.isLoggedIn= this.authService.isLoggedIn();
  this.isLoggedIn = true; // Exemple de mise à jour pour isLoggedIn

 }

 handleLogout() {
  this.loginService.logout();
      this.router.navigate(['/login']);
      this.isLoggedIn = false; // Par exemple, mettez à jour isLoggedIn à false
      // Redirection vers la page de connexion après déconnexion
}
}
