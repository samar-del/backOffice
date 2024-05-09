import { Component, Input, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-tabs-wrapper',
  template: `
  <nav mat-tab-nav-bar [backgroundColor]="background">
  <a mat-tab-link *ngFor="let tabs of tabs" (click)="activeLink = tabs"
    [active]="activeLink == tabs"> {{tabs}} </a>
  </nav>

  `,
  styles: [`
    .mat-tab-label {
      color: blue;
    }
  `]
})
export class TabsWrapperComponent implements OnInit {
  tabs = ['tab1'];
  activeLink = this.tabs[0];
  background: ThemePalette = undefined;

  constructor() {}

  ngOnInit(): void {}



}
