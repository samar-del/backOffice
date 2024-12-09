import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import {TranslationService} from "./services/translation.service";

@Directive({
  selector: '[appRestrictInput]'
})
export class RestrictInputDirective {
  private regexPatterns: { [key: string]: RegExp } = {
    an: /^[a-zA-Z]*$/, // Example pattern for language 'an'
    fr: /^[a-zA-Zéèàç]*$/, // Example pattern for French
    ar: /^[\u0600-\u06FF]*$/ // Example pattern for Arabic
  };

  private currentLanguage: string;

  constructor(private el: ElementRef, private translationService: TranslationService) {
    // Subscribe to the current language from the translation service
    this.translationService.getCurrentLanguage().subscribe((language: string) => {
      this.currentLanguage = language;
    });
  }

  @HostListener('input', ['$event']) onInput(event: KeyboardEvent): void {
    const inputElement = this.el.nativeElement;
    const pattern = this.regexPatterns[this.currentLanguage] || /.*/;
    const filteredValue = inputElement.value.split('').filter(char => pattern.test(char)).join('');

    if (inputElement.value !== filteredValue) {
      inputElement.value = filteredValue;
      event.preventDefault();
    }
  }
}
