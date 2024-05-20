import { Role } from './../../../models/role';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Permission } from 'src/app/models/permission';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  affecterUserRole(idUser: string, idRole: string): Observable<User> {
    return this.http.post<User>(`/api/users/${idUser}/roles/${idRole}`, {});
  }

  getAllUSers(): Observable<User[]>{
    return this.http.get<User[]>('http://localhost:8078/auth/allUsers');
  }


updateUser(idUser: string, user:User){
    return this.http.put(`http://localhost:8078/auth/updateUser/${idUser}`,user);
  }

  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>('http://localhost:8078/Role/AllRoles');
  }

  deleteUser(idUser:string): Observable<any>{
    return this.http.delete<any>(`http://localhost:8078/auth/deleteUser/${idUser}`);
  }

  addUser(user: User): Observable<User> {
    console.log("Sending user data to server:", user);

    return this.http.post<User>(`http://localhost:8078/auth/addUser`, user);
  }

  getUserById(idUser: string): Observable<any>{
    return this.http.get<any>(`http://localhost:8078/auth/getbyId/${idUser}`);
  }

  getAccessByRole(roleType: string){
    return this.http.get<string>(`http://localhost:8078/auth/roleT/${roleType}`)
  }


  getAllPermissions(): Observable<Permission[]>{
    return this.http.get<Permission[]>('http://localhost:8078/Permission/AllPermissions');
  }
}
