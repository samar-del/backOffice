import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormTemplate} from '../models/FormTemplate';
import {Observable} from 'rxjs';
import {Field} from '../models/Field';
import {Options} from '../models/Options';

@Injectable({
  providedIn: 'root'
})
export class FormCreationService {

  constructor(private httpClient: HttpClient) { }

  public addFormTemplate(form: FormTemplate): Observable<any> {
    return this.httpClient.post('http://localhost:8078/addFormTemplate', form);
  }
  public getAllFormTemplate(): Observable<any> {
    return this.httpClient.get<any>('http://localhost:8078/getAllFormTemplate');
  }

  public deleteFormTemplateById(id: string): Observable<any>{
    return this.httpClient.delete<any>(`http://localhost:8078/deleteFormTemplate/${id}`)

  }

}
