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

  public deleteFieldByIdAndUpdateFormTemplate(fieldId: string, formTemplateId: string): Observable<any> {
    return this.httpClient.delete<any>(`http://localhost:8078/field/delete/${fieldId}/${formTemplateId}`);
  }

  public editField(fieldId: string, field:Field): Observable<any>{
    return this.httpClient.put(`http://localhost:8078/field/edit/${fieldId}`, field);
  }



}
