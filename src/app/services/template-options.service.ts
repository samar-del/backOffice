import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Field} from '../models/Field';
import {Observable} from 'rxjs';
import {TemplateOptions} from '../models/TemplateOptions';
import {FormTemplate} from "../models/FormTemplate";

@Injectable({
  providedIn: 'root'
})
export class TemplateOptionsService {

  constructor(private httpClient: HttpClient) { }

  public addTemplateOption(templateOptions: TemplateOptions): Observable<any> {
    return this.httpClient.post('http://localhost:8078/templateOptions/add', templateOptions);
  }
  public getTemplateOptionsById(id: string): Observable<TemplateOptions> {
    const url = `http://localhost:8078/getTemplateOptions/{id}`;
    return this.httpClient.get<TemplateOptions>(url);
  }
}
