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
