import { Component, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'app-tabs-wrapper',
  template: `
  <ul class="nav nav-tabs">
  <li class="nav-item" *ngFor="let tab of tabs">
    <a class="nav-link" [class.active]="tab.active" [routerLink]="['.', { outlets: { primary: tab.route } } ]">{{ tab.label }}</a>
  </li>
</ul>
  `,
  styleUrls: ['./tabs-wrapper.component.css']
})
export class TabsWrapperComponent extends FieldType implements OnInit {

  tabs: { label: string, route: string, active: boolean }[] = [
    { label: 'Unique Settings', route: 'unique-settings', active: true },
    { label: 'Field Examples', route: 'field-examples', active: false },
    { label: 'Guidance', route: 'guidance', active: false },
    { label: 'JSON', route: 'json', active: false }
  ];

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  selectTab(selectedTab: { label: string, route: string, active: boolean }): void {
    // Désactive toutes les onglets
    this.tabs.forEach(tab => tab.active = false);
    // Active l'onglet sélectionné
    selectedTab.active = true;
    // Vous pouvez effectuer d'autres opérations ici, telles que le chargement du contenu pour l'onglet sélectionné
  }
}
