import { baseUrl, environment } from './../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import { loginRequest } from 'src/app/models/loginRequest';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient,
                private router: Router) { }

                signin(request: loginRequest) {
                  return this.http.post<any>(`${baseUrl}/auth/signin`, request).pipe(
                    map(response => {
                      if (response && response.token) {
                       // localStorage.setItem('accessToken', response.token);
                          this.storeToken(response.token);
                      }
                      // this.registerSuccessfulLogin();
                      //  console.log(response);
                      return response;
                    }),
                    catchError(error => {
                      return throwError(error);
                    })
                  );
                }

                generateToken(request:loginRequest) {
                  return this.http.post<any>(`${baseUrl}/auth/generateToken`, request);
                }

                logout() {
                  localStorage.removeItem('accessToken'); // Supprimez le token du localStorage
                  this.router.navigateByUrl('/login');
                }

                private storeToken(token: string) {
                  localStorage.setItem('accessToken', token); // Stockage du token dans le localStorage
                }

                registerSuccessfulLogin() {
                  // Implementer ici les actions à effectuer lors d'une connexion réussie
                }



  }
