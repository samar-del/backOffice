import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ContentComponent } from '../content/content.component';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor() {
    // Initialize showSubSubMenu array with false values for each category
    this.categories.forEach(() => this.showSubSubMenu.push(false));
  }
  @ViewChild('sidenav') sidenav: MatSidenav;
  @ViewChild(ContentComponent) contentComponent: ContentComponent;
  isExpanded = true;
  isShowing = true;
  showSubSubMenu: boolean[] = []; // Array to store the state of each submenu
  @Output() itemDragged = new EventEmitter<{ item: string, position: DOMRect }>();
  isSubmenuOpen: boolean[] = [];
  containerDraggedOver = false;

  // Define categories with their respective items
  categories = [
    { name: 'Basics', items: ['Text', 'Number', 'radio', 'checkbox',  'select', 'button'] },
    { name: 'Advanced', items: ['Email', 'Phone Number', 'Address', 'Url', 'Date / Time', 'Day', 'Select Multiple', 'autocomplete'] },
    { name: 'Layout', items: ['Columns'] }
     // Add more categories as needed
  ];
  // @ts-ignore
  dragAnimation = trigger('dragAnimation', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('300ms', style({ opacity: 1 })),
    ]),
    transition(':leave', [
      animate('300ms', style({ opacity: 0 })),
    ]),
  ]);

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
    const currentPosition = event.item.element.nativeElement.getBoundingClientRect();
    this.itemDragged.emit({ item: droppedItem, position: currentPosition });
    console.log(currentPosition);
    this.contentComponent.onItemDropped(droppedItem);
  }
  onDragEntered() {
    // Add a CSS class when an element is dragged over the container
    this.containerDraggedOver = true; // Assuming you have a boolean property to track the drag state
  }

  // tslint:disable-next-line:typedef
  onDragExited() {
    // Remove the CSS class when the element is dragged out of the container
    this.containerDraggedOver = false; // Assuming you have a boolean property to track the drag state
  }
  onDragStart(event: DragEvent) {
    event.dataTransfer.setData('text/plain', 'Some data to drop'); // Set data to be dropped
  }
}
