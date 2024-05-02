import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  private nomberOfColumns = new BehaviorSubject<any[]>([]);
  currentNomberOfColumns = this.nomberOfColumns.asObservable();
  addressOptions =  new BehaviorSubject<any[]>([]);

  constructor() { }

  // tslint:disable-next-line:typedef
  emitNumberColumn(message: {}[]) {
    this.nomberOfColumns.next(message);
  }
  emitAddressOptions(values: {}[]){
    this.addressOptions.next(values);
  }
}
