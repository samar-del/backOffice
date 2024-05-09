import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  private nomberOfColumns = new BehaviorSubject<any[]>([]);
  currentNomberOfColumns = this.nomberOfColumns.asObservable();
  addressOptions =  new BehaviorSubject<any[]>([]);
  recentFieldsList = new BehaviorSubject<any[]>([]);
  fieldsList$ = this.recentFieldsList.asObservable();

  urlSource = new BehaviorSubject<string>(''); // Default value is an empty string
  currentUrl = this.urlSource.asObservable();

  constructor() { }
  emitListFields(list: {}[]){
    this.recentFieldsList.next(list);
  }

  // tslint:disable-next-line:typedef
  emitNumberColumn(message: {}[]) {
    this.nomberOfColumns.next(message);
  }
  emitAddressOptions(values: {}[]){
    this.addressOptions.next(values);
  }
  changeUrl(link_iframe: string) {
    this.urlSource.next(link_iframe);
  }

}
