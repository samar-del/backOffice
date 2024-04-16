import { signupRequest } from './../../../models/signupRequest';
import { baseUrl, environment } from './../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SignupService {



  constructor(private http: HttpClient) { }

  signup(request : signupRequest) {
    return this.http.post<any>(`${baseUrl}/auth/signup`, request).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }



}
