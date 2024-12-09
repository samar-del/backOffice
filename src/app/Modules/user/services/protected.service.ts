import { baseUrl } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProtectedService {


  constructor(private http:HttpClient) { }

  /*getUserData(){
    return this.http.get(`http://localhost:8078/auth/protected/getdata`)
  }
  getAdminData(){
    return this.http.get(`http://localhost:8078/auth/admin/getdata`)
  }*/

}
