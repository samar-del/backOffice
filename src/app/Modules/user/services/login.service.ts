import { environment } from './../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import {catchError, map} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class LoginService {


  public email: string;
  public password: string;

  constructor(private http: HttpClient) { }

  signin(email: string, password: string) {

    return this.http.post<any>(`${environment.hostUrl}/auth/signin`, { email, password }).pipe(
      map(response => {
        this.registerSuccessfulLogin();
        this.storeToken(response.token);
        return response;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  
  private storeToken(token: string) {
    localStorage.setItem('accessToken', token); // Stockage du token dans le localStorage
  }
  registerSuccessfulLogin(){

  }
}
