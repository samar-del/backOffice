import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguageSubject: BehaviorSubject<string>;

  constructor(private http: HttpClient) {
    const savedLanguage = localStorage.getItem('language') || 'en'; // Default language is 'en'
    this.currentLanguageSubject = new BehaviorSubject<string>(savedLanguage);
  }

  loadTranslations(language: string) {
    return this.http.get(`assets/i18n/${language}.json`);
  }

  changeLanguage(language: string) {
    console.log('Language changed to:', language);
    localStorage.setItem('language', language); // Save the selected language to local storage
    this.currentLanguageSubject.next(language); // Update the current language
  }

  getCurrentLanguage() {
    return this.currentLanguageSubject.asObservable();
  }
}
