import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'bl-menu-toggle-button',
  templateUrl: './menu-toggle-button.component.html',
  styleUrls: ['./menu-toggle-button.component.scss'],
})
export class MenuToggleButtonComponent implements OnInit {
  @Output() buttonClicked = new EventEmitter();

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'hamburger',
      sanitizer.bypassSecurityTrustResourceUrl('assets/cheese-burger.svg'),
    );
  }

  ngOnInit() {}

  toggleDrawer($event) {
    this.buttonClicked.emit($event);
  }
}
