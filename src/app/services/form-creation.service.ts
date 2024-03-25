import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormTemplate} from '../models/FormTemplate';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormCreationService {

  constructor(private httpClient: HttpClient) { }

  public addFormTemplate(form: FormTemplate): Observable<any> {
    return this.httpClient.post('http://localhost:8090/addFormTemplate', form);
  }
}
