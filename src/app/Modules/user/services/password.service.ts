import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl, environment } from './../../../../environments/environment';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class PasswordService {


  constructor(private http :HttpClient) { }

  forgetPassword(email:string): Observable<string>{
   // const { email } = this.form.value;
    return this.http.get<string>(`${baseUrl}/auth/requestPasswordReset/`+ email);
  }

  resetPassword(resetPasswordData:any,token:string){
    return this.http.post<any>(`${baseUrl}/auth/password-reset?token=`+token, resetPasswordData);

  }
}
