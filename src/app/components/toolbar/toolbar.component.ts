import { Component } from '@angular/core';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
  constructor(private translationService: TranslationService) {}

  changeLanguage(language: string): void {
    this.translationService.changeLanguage(language);
  }

}
