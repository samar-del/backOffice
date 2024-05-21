import { Permission } from 'src/app/models/permission';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from 'src/app/models/role';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http: HttpClient) { }
  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>('http://localhost:8078/Role/AllRoles');
  }

 addRole(role: Role): Observable<Role> {
    return this.http.post<Role>('http://localhost:8078/Role/AjouterRole',role);
  }


  deleteRole(id: string): Observable<any>{
    return this.http.delete<any>(`http://localhost:8078/Role/deleteRole/${id}`);
  }

  addRoleWithPermissions(role: Role): Observable<Role> {
    return this.http.post<Role>('http://localhost:8078/Role/roles', role);
  }

  getListPermissionByIdRole(id:string) : Observable<Permission[]>{
    return this.http.get<Permission[]>(`http://localhost:8078/Role/getListPByR/${id}`);
  }

  updateRole(role:Role): Observable<any>{
    return this.http.put('http://localhost:8078/Role/', role);
  }
  associatePermissionToRole(roleId: string, permissionId: string): Observable<string> {
    return this.http.post<string>(`http://localhost:8078/Role/ajouterPermissionToRole/${roleId}/${permissionId}`, {});
  }
}
