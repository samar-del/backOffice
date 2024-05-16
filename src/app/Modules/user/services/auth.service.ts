import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {JwtHelperService} from'@auth0/angular-jwt';
import { DOCUMENT } from '@angular/common';
import { Observable } from 'rxjs';
import { Role } from 'src/app/models/role';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router ,
    private http:HttpClient
   ) { }

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

  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>('http://localhost:8078/Role/AllRoles');
  }

  getUserRoles() {
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(this.getAccessToken()??"");
    console.log(decodedToken);
  }

GetUserRole(roleType:string): Observable<any>{
      return this.http.get<any>(`http://localhost:8078/Role/roleT/${roleType}`);

}

  getRoleById(idRole: string): Observable<any>{
    return this.http.get<any>(`http://localhost:8078/Role/unrole/${idRole}`);
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    this.router.navigate(['/login']); // Redirigez vers la page de connexion ou la page souhaitée après la déconnexion
  }

}
