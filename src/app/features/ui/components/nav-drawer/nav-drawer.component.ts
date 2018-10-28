import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Component, EventEmitter, Input, OnInit, Output, HostListener, ViewChild, ElementRef } from '@angular/core';
import { InfiniteScrollService } from '@features/ui/services/infinite-scroll.service';
import { NavDrawerService } from '@shared/services/nav-drawer.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'bl-nav-drawer',
  templateUrl: './nav-drawer.component.html',
  styleUrls: ['./nav-drawer.component.scss'],
})
export class NavDrawerComponent implements OnInit {
  @Input() links;
  @Input() headerTitle: string;
  defaultTitle: string;
  @Input() loading: boolean;
  @ViewChild('wrapper') drawerWrapper: ElementRef;
  contentPosition: any;
  isOpened = false;

  constructor(
    public breakpointObserver: BreakpointObserver,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
  ) {
    iconRegistry.addSvgIcon(
      'hamburger',
      sanitizer.bypassSecurityTrustResourceUrl('../../../../../assets/cheese-burger.svg'),
    );
  }

  ngOnInit() {
    this.defaultTitle = this.headerTitle;
  }

  toggleDrawer() {
    const offsetHeight = this.drawerWrapper.nativeElement.offsetHeight;
    const openHeight = 100;
    this.isOpened = !this.isOpened;
    if (this.isOpened) {
      this.contentPosition = {
        top: (offsetHeight - openHeight) + 'px',
        height: openHeight + 'px',
      };
    } else {
      this.contentPosition = {
        top: '48px',
      };
    }
  }
}
