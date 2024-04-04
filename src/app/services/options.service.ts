import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Field} from '../models/Field';
import {Observable} from 'rxjs';
import {Options} from '../models/Options';
import {TemplateOptions} from "../models/TemplateOptions";

@Injectable({
  providedIn: 'root'
})
export class OptionsService {

  constructor(private httpClient: HttpClient) { }

  public addOption(option: Options): Observable<any> {
    return this.httpClient.post('http://localhost:8090/options/add', option);
  }
  public getOptionById(id: string): Observable<Options> {
    const url = `http://localhost:8090/getOptions/{id}`;
    return this.httpClient.get<Options>(url);
  }
}
