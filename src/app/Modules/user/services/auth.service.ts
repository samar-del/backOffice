import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {JwtHelperService} from'@auth0/angular-jwt';
import { DOCUMENT } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router  ) { }

  isLoggedIn(){
    return !!this.getAccessToken() && !this.isTokenExpired()
  }


  addAccessToken(accessToken:string){
    localStorage.setItem('accessToken',accessToken);
  }


  getAccessToken(){
    return localStorage.getItem('accessToken');
  }


  isTokenExpired(): boolean {
    const token: string | null = this.getAccessToken();
    if (!token) return false;
    const tokenSplit: string[] = token.split('.');
    if (tokenSplit.length !== 3) return false;
    const decodedString: string = atob(tokenSplit[1]);
    const jsonString: { exp: number } = JSON.parse(decodedString);
    const expiry = jsonString.exp;
    return Math.floor((new Date()).getTime() / 1000) >= expiry;
  }

  getUserRoles(): void {
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(this.getAccessToken()??"");
    console.log(decodedToken);
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    this.router.navigate(['/login']); // Redirigez vers la page de connexion ou la page souhaitée après la déconnexion
  }

}
