import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormTemplate} from '../models/FormTemplate';
import {Observable} from 'rxjs';
import {Field} from '../models/Field';

@Injectable({
  providedIn: 'root'
})
export class FieldService {

  constructor(private httpClient: HttpClient) { }

  public addField(field: Field): Observable<any> {
    return this.httpClient.post('http://localhost:8090/field/add', field);
  }
}
