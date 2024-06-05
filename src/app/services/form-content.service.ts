import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormTemplate} from '../models/FormTemplate';
import {Observable} from 'rxjs';
import { FormContent } from '../models/FormContent';
import { map } from 'rxjs/operators';

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
  public getAnswers(formTemplateId: string): Observable<any> {
    return this.httpClient.get(`http://localhost:8078/answers/getAnswersById/${formTemplateId}`);
  }
  uploadFile(email: string, file: File): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('email', email); // Add the email parameter
    formData.append('file', file, file.name);
    return this.httpClient.post<string>(`http://localhost:8078/files/upload`, formData);
  }

  getAll():Observable<FormContent[]>{
  return this.httpClient.get<FormContent[]>(`http://localhost:8078/formContent/getAll`);
 }
 getFormCountsByUser(): Observable<{ [key: string]: number }> {
  return this.getAll().pipe(
    map(forms => {
      return forms.reduce((acc, form) => {
        acc[form.idUser] = (acc[form.idUser] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });
    })
  );
}
}
