import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ContentComponent } from '../content/content.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;
  @ViewChild(ContentComponent) contentComponent: ContentComponent;
  isExpanded = true;
  isShowing = true;
  showSubSubMenu: boolean[] = []; // Array to store the state of each submenu
  @Output() itemDragged = new EventEmitter<string>();
  isSubmenuOpen: boolean[] = [];

  // Define categories with their respective items
  categories = [
    { name: 'Basics', items: ['Text','Number', 'radio', 'checkbox',  'select', 'button'] },
    { name: 'Advanced', items: ['Email', 'Phone Number','Url', 'Date / Time', 'autocomplete'] }
    // Add more categories as needed
  ];

  constructor() {
    // Initialize showSubSubMenu array with false values for each category
    this.categories.forEach(() => this.showSubSubMenu.push(false));
  }

  ngOnInit(): void {
    this.categories.forEach(() => this.isSubmenuOpen.push(false));
  }

  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }

  toggleSubMenu(index: number): void {
    this.isSubmenuOpen[index] = !this.isSubmenuOpen[index];
  }


  drag(event: CdkDragDrop<string[]>, categoryIndex: number) {
    const droppedItem = this.categories[categoryIndex].items[event.previousIndex];
    this.contentComponent.onItemDropped(droppedItem);
  }
}
