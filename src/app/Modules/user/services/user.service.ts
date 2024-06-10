import { Role } from './../../../models/role';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Permission } from 'src/app/models/permission';
import { User } from 'src/app/models/user';
import { UserRequest } from 'src/app/models/user-request';

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
  getUserAddressesCount(): Observable<{ [key: string]: number }> {
    return this.getAllUSers().pipe(
      map(users => {
        return users.reduce((acc, user) => {
          acc[user.adresse] = (acc[user.adresse] || 0) + 1;
          return acc;
        }, {} as { [key: string]: number });
      })
    );
  }

  getUserRolesCount(): Observable<{ [key: string]: number }> {
    return this.getAllRoles().pipe(
      map(roles => {
        return roles.reduce((acc, role) => {
          acc[role.roleType] = (acc[role.roleType] || 0) + 1;
          return acc;
        }, {} as { [key: string]: number });
      })
    );
  }

  getSimpleUserCountWithInscription(): Observable<{ [key: string]: number }> {
    return this.getAllUSers().pipe(
      tap(users => console.log('Users:', users)),
      map(users => {
        const simpleUserCount: { [key: string]: number } = {};
        simpleUserCount['SimpleUser'] = users.filter(user => user.roles && user.roles.some(role => role.roleType === 'USER')).length;
        console.log('Simple User Count:', simpleUserCount);
        return simpleUserCount;
      }),
      catchError(error => {
        console.error('Error fetching users:', error);
        // Return a default value or rethrow the error
        return of({ SimpleUser: 0 }); // Return an empty object or another default value
      })
    );
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


  addUserAndAssignRole(userRequest:UserRequest):Observable<User>{
    return this.http.post<User>(`http://localhost:8078/auth/addUserWithRoles`,userRequest);
  }
}
