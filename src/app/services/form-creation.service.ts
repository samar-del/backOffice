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

}
