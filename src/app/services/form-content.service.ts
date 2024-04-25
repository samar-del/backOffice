import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormTemplate} from '../models/FormTemplate';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormContentService {

  constructor(private httpClient: HttpClient) { }

  public getFormContent(formId: string): Observable<any> {
    return this.httpClient.get(`http://localhost:8078/formContent/getFormContentById/${formId}`);
  }
  public getFormTemplateById(formId: string): Observable<any> {
    return this.httpClient.get<any>( `http://localhost:8078/getFormTemplate/${formId}`);
  }
  public getFieldById(fielId: string): Observable<any> {
    const url = `http://localhost:8078/field/getField/${fielId}`;
    return this.httpClient.get<any>(url);
  }
  public getOptionsById(optionId: string): Observable<any> {
    const url = `http://localhost:8078/options/getOption/${optionId}`;
    return this.httpClient.get<any>(url);
  }
}
