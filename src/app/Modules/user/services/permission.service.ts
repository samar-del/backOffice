import { Permission } from 'src/app/models/permission';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(private http: HttpClient) { }

  getAllPermissions(): Observable<Permission[]>{
    return this.http.get<Permission[]>('http://localhost:8078/Permission/AllPermissions');
  }


  addPermission(permission: any): Observable<any> {
    return this.http.post<any>('http://localhost:8078/Permission/addPermission', permission);
  }

  deletePermission(id: string){
    return this.http.delete<any>(`http://localhost:8078/Permission/supPermission/${id}`);
  }

  getPermissionById(id:string){
    return this.http.get<Permission[]>(`http://localhost:8078/Permission/permissionsToRole/${id}`);
  }
  getPermissionToRole(id: string): Observable<any>{
    return this.http.get<any[]>(`http://localhost:8078/Permission/permissionsToRole/${id}`);
  }

  updatePermission(permission:Permission): Observable<any>{
    return this.http.put<Permission>('http://localhost:8078/Permission/updatePer',permission);
  }
}
