import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from 'src/app/models/role';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  affecterUserRole(idUser: string, idRole: string): Observable<User> {
    return this.http.post<User>(`/api/users/${idUser}/roles/${idRole}`, {});
  }

  getAllUSers(): Observable<User>{
    return this.http.get<User>('http://localhost:8078/auth/allUsers');
  }


updateUser(idUser: string, user:User){
    return this.http.put<User>(`http://localhost:8078/auth/updateUser/${idUser}`,user);
  }

  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>('http://localhost:8078/Role/AllRoles');
  }

  deleteUser(idUser:string): Observable<any>{
    return this.http.delete<any>(`http://localhost:8078/auth/deleteUser/${idUser}`);
  }
}
