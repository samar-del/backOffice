import { signupRequest } from './../../../models/signupRequest';
import { baseUrl } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

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

IsLoggedIn(){
  return sessionStorage.getItem('username')!=null;
}

GetUserRole(){
  return sessionStorage.getItem('userrole')!=null?sessionStorage.getItem('userrole')?.toString():'';
}
}
