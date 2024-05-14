import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguageSubject: BehaviorSubject<string>;

  constructor(private http: HttpClient) {
    this.currentLanguageSubject = new BehaviorSubject<string>('an'); // Default language is French
  }

  loadTranslations(language: string) {
    return this.http.get(`assets/i18n/${language}.json`);
  }

  changeLanguage(language: string) {
    console.log('Language changed to:', language);
    this.currentLanguageSubject.next(language);
  }


  getCurrentLanguage() {
    return this.currentLanguageSubject.asObservable();
  }
}
