import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
// @ts-ignore
import { MatSidenav } from '@angular/material';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {ContentComponent} from "../content/content.component";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;
  @ViewChild(ContentComponent) contentComponent: ContentComponent; // Inject ContentComponent
  isExpanded = true;
  showSubmenu: boolean = true;
  isShowing = true;
  showSubSubMenu: boolean = false;
  @Output() itemDragged = new EventEmitter<string>();
  items = ['input', 'radio', 'checkbox', 'button'];
  constructor() { }

  ngOnInit(): void {
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


  drag(event: CdkDragDrop<string[]>) {
    const droppedItem = this.items[event.previousIndex];
    this.contentComponent.onItemDropped(droppedItem); // Call method in ContentComponent
  }


}
