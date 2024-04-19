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
    return this.httpClient.post('http://localhost:8090/addFormTemplate', form);
  }
  public getFormTemplateById(formId: string): Observable<any> {
    return this.httpClient.get<any>( `http://localhost:8090/getFormTemplate/${formId}`);
  }
  public getFieldById(fielId: string): Observable<any> {
    const url = `http://localhost:8090/field/getField/${fielId}`;
    return this.httpClient.get<any>(url);
  }
  public getOptionsById(optionId: string): Observable<any> {
    const url = `http://localhost:8090/options/getOption/${optionId}`;
    return this.httpClient.get<any>(url);
  }
}
