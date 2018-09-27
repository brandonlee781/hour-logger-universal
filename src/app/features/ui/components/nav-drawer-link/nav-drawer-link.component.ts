import { Component, Input, OnInit } from '@angular/core';
import { Link } from '@shared/types';

@Component({
  selector: 'bl-nav-drawer-link',
  templateUrl: './nav-drawer-link.component.html',
  styleUrls: ['./nav-drawer-link.component.scss'],
})
export class NavDrawerLinkComponent implements OnInit {
  @Input() link: Link;
  path;

  constructor() {}

  ngOnInit() {
    if (this.link.route) {
      this.path = [this.link.path, this.link.route];
    } else {
      this.path = [this.link.path];
    }
  }

  changeSelected() {
    //
  }
}
