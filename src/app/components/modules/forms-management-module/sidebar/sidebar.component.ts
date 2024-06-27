import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ContentComponent } from '../../../content/content.component';
import {animate, style, transition, trigger} from '@angular/animations';
import {TranslationService} from '../../../../services/translation.service';
import {UpdateFormComponent} from "../update-form/update-form.component";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(private translationService: TranslationService) {
    // Initialize showSubSubMenu array with false values for each category
    this.categories.forEach(() => this.showSubSubMenu.push(false));
  }
  @ViewChild('sidenav') sidenav: MatSidenav;
  @ViewChild(ContentComponent) contentComponent: ContentComponent;
  @ViewChild(UpdateFormComponent) updateFormComponent: UpdateFormComponent;
  isExpanded = true;
  isShowing = true;
  showSubSubMenu: boolean[] = []; // Array to store the state of each submenu
  @Output() itemDragged = new EventEmitter<{ item: string, position: DOMRect }>();
  isSubmenuOpen: boolean[] = [];
  containerDraggedOver = false;
  translations: any = {};
  edit: boolean = false;
  // Define categories with their respective items
  categories = [
    { name: 'Basics', items: ['Text', 'Number', 'Radio button', 'Checkbox',  'Select', 'Button'] },
    { name: 'Advanced', items: ['Email', 'Phone Number', 'Address', 'Url', 'Date / Time', 'Day', 'File', 'Select Multiple', 'Autocomplete', 'HTML Element', 'IFrame'] },
    { name: 'Layout', items: ['Columns', 'Table', 'Panel', 'Tabs', 'Stepper'] },

     // Add more categories as needed
  ];
  containers: [] = [];
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
    this.translationService.getCurrentLanguage().subscribe(language => {
      this.translationService.loadTranslations(language).subscribe(
        (translations: any) => {
          // Update sidebar items with translated values
          this.categories = translations.categories;
        }
      );
    });

    this.translationService.getCurrentLanguage().subscribe((language: string) => {
      this.loadTranslations();
    });

    this.loadTranslations();

    this.edit = JSON.parse(localStorage.getItem('edit') || 'false');

    localStorage.removeItem('edit');
  }

  loadTranslations() {
    this.translationService.getCurrentLanguage().subscribe((language: string) => {
      this.translationService.loadTranslations(language).subscribe((translations: any) => {
        console.log('Loaded translations:', translations);
        this.translations = translations;
      });
    });
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
    // tslint:disable-next-line:prefer-const
    let position: number;
    this.contentComponent.drop(event, droppedItem);
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
