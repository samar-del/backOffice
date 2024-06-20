import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Field} from '../models/Field';

@Injectable({
  providedIn: 'root'
})
export class FieldService {

  constructor(private httpClient: HttpClient) { }

  public addField(field: Field): Observable<any> {
    return this.httpClient.post('http://localhost:8078/field/add', field);
  }
  public getFieldById(fieldId: string): Observable<Field> {
    const url = `http://localhost:8078/getField/${fieldId}`;
    return this.httpClient.get<Field>(url);
  }

}
