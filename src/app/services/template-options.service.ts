import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Field} from '../models/Field';
import {Observable} from 'rxjs';
import {TemplateOptions} from '../models/TemplateOptions';

@Injectable({
  providedIn: 'root'
})
export class TemplateOptionsService {

  constructor(private httpClient: HttpClient) { }

  public addTemplateOption(templateOptions: TemplateOptions): Observable<any> {
    return this.httpClient.post('http://localhost:8090/templateOptions/add', templateOptions);
  }
}
