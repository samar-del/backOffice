import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Field} from '../models/Field';
import {Observable} from 'rxjs';
import {Options} from '../models/Options';

@Injectable({
  providedIn: 'root'
})
export class OptionsService {

  constructor(private httpClient: HttpClient) { }

  public addOption(option: Options): Observable<any> {
    return this.httpClient.post('http://localhost:8090/options/add', option);
  }
}
