import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Permission } from '../models/permission';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PermissionServiceService {

  constructor(private http: HttpClient) { }


 
}
