import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appRestrictInput]'
})
export class RestrictInputDirective {
  @Input('appRestrictInput') pattern: string;

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const regex = new RegExp(this.pattern, 'g');
    const validValue = inputElement.value.match(regex)?.join('') || '';
    if (inputElement.value !== validValue) {
      inputElement.value = validValue;
      inputElement.dispatchEvent(new Event('input'));  // Trigger Angular's change detection
    }
  }
}
