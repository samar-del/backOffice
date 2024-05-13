import { Permission } from './../models/permission';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Role } from '../models/role';

@Injectable({
  providedIn: 'root'
})
export class PermissionServiceService {

  constructor(private http: HttpClient) { }

  getAllPermissions(): Observable<Permission[]>{
    return this.http.get<Permission[]>('http://localhost:8078/Permission/AllPermissions');
  }


  addPermission(permission: Permission): Observable<any> {
    return this.http.post<Permission>('http://localhost:8078/Permission/addPermission',permission);
  }

  deletePermission(id: number){
    return this.http.delete<any>(`http://localhost:8078/Permission/SupPermission/${id}`);
  }

  getPermissionById(id:string){
    return this.http.get<Permission[]>(`http://localhost:8078/Permission/UnePermission/${id}`);
  }

  updatePermission(permission:Permission): Observable<any>{
    return this.http.put<Permission>('http://localhost:8078/Permission/updatePer',permission);
  }

}
