import { environment } from './../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Role } from '../models/role';
import { Observable } from 'rxjs';
import { Permission } from '../models/permission';


@Injectable({
  providedIn: 'root'
})
export class RoleServiceService {
   constructor(private http: HttpClient) { }


  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>('http://localhost:8078/Role/AllRoles');
  }

 addRole(role: Role): Observable<any> {
    return this.http.post<Role>('http://localhost:8078/Role/AjouterRole',role);
  }


  deleteRole(id: number) {
    return this.http.delete<any>(`http://localhost:8078/Role/deleteRole/${id}`);
  }

  addRoleWithPermissions(role: Role): Observable<Role> {
    return this.http.post<Role>('http://localhost:8078/Role/roles', role);
  }

  getAllPermissions(): Observable<Permission[]>{
    return this.http.get<Permission[]>('http://localhost:8078/Permission/AllPermissions')
  }

  getListPermissionByIdRole(id:number) {
    return this.http.get<Permission[]>(`http://localhost:8078/Role/getListPByR/${id}`)
  }
}
