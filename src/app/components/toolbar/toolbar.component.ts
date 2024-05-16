import { Component, DoCheck } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { LoginService } from 'src/app/Modules/user/services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent implements DoCheck {
  isLoggedIn: boolean = false;

  ismenurequired=false;
  constructor(
    private translationService: TranslationService,
    private loginService: LoginService,
    private router: Router
  ) {}
  ngDoCheck(): void {
let currenturl= this.router.url;
if(currenturl=='/login' || currenturl=='/signup'){
this.ismenurequired=false;
}else{
  this.ismenurequired=true;
}
  }

  changeLanguage(language: string): void {
    this.translationService.changeLanguage(language);
  }
  handleLogout() {
    this.loginService.logout();
    this.router.navigate(['/login']);
    this.isLoggedIn = false; // Par exemple, mettez à jour isLoggedIn à false
    // Redirection vers la page de connexion après déconnexion
  }
}
