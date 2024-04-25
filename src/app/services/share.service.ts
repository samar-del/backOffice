import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  private nomberOfColumns = new BehaviorSubject<any[]>([]);
  currentNomberOfColumns = this.nomberOfColumns.asObservable();

  constructor() { }

  // tslint:disable-next-line:typedef
  emitNumberColumn(message: {}[]) {
    this.nomberOfColumns.next(message);
  }

}
