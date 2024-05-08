import { Component, Input, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'app-tabs-wrapper',
  template: `
  <mat-tab-group>
  <mat-tab *ngFor="let tab of tabs" [label]="tab.label">
    <div class="tabs">
      <div class="tab" *ngFor="let tab of tabs" [class.active]="tab.active">
        <a [routerLink]="[tab.route]" routerLinkActive="active">{{ tab.label }}</a>
      </div>
    </div>
    <div class="tab-content">
    <ng-container>

    </ng-container>
    </div>
  </mat-tab>
  <mat-tab label="hsh">
    <div class="tabs">
      <div class="tab" *ngFor="let tab of tabs" [class.active]="tab.active">
        <a [routerLink]="[tab.route]" routerLinkActive="active">{{ tab.label }}</a>
      </div>
    </div>
    <div class="tab-content">
      <h2>sj,d</h2>
    </div>
  </mat-tab>
</mat-tab-group>

  `,
  styles: [`
    .mat-tab-label {
      color: blue;
    }
  `]
})
export class TabsWrapperComponent extends FieldType implements OnInit {
  @Input() tabs: { label: string, route: string, active: boolean }[] = [];
  activeTab: { label: string, route: string, active: boolean };
  activeTabContent: any;

  constructor() {
    super();
  }

  ngOnInit(): void {
    if (this.tabs.length > 0) {
      // If tabs are provided as input, ensure one tab is active by default
      const activeTab = this.tabs.find(tab => tab.active);
      if (!activeTab) {
        this.activateTab(this.tabs[0]);
      } else {
        this.activateTab(activeTab);
      }
    }
  }

  activateTab(selectedTab: { label: string, route: string, active: boolean }) {
    this.activeTab = selectedTab;
    this.activeTabContent = this.field.templateOptions.tabContents.find(tab => tab.label === selectedTab.label);
  }
}
