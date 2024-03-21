import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  isExpanded = true;
  isShowing = false;

  constructor() { }

  ngOnInit(): void {
  }

}
