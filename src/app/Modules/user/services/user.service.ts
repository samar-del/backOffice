import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  affecterUserRole(userId: string, roleId: string): Observable<User> {
    return this.http.post<User>(`/api/users/${userId}/roles/${roleId}`, {});
  }
}
