import { environment } from './../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  public userName: string;
  public password: string;
  public email: string;


  constructor(private http: HttpClient) { }

  signup(userName: string, password: string, email: string) {

    return this.http.post<any>(`${environment.hostUrl}/auth/signup`, {userName, password, email}).pipe(
      map(response => {
        this.registerSuccessfulSignup();
        return response;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  registerSuccessfulSignup() {
    // Logique à exécuter après une inscription réussie (par exemple, redirection vers une autre page)
  }

}
