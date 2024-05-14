import { LoginService } from './../../Modules/user/services/login.service';
import { Component } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
  constructor(private translationService: TranslationService, private loginService:LoginService, private router:Router) {}

  changeLanguage(language: string): void {
    this.translationService.changeLanguage(language);
  }
  
  handleLogout() {
    this.loginService.logout();
        this.router.navigate(['/login']); // Redirection vers la page de connexion après déconnexion
  }

}
