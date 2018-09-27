import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'bl-nav-drawer-item',
  templateUrl: './nav-drawer-item.component.html',
  styleUrls: ['./nav-drawer-item.component.scss'],
})
export class NavDrawerItemComponent implements OnInit {
  @Input() icon: string;
  @Input() text: string;
  @Input() isSelected: boolean;

  constructor() {}

  ngOnInit() {}

  changeSelected() {
    //
  }
}
