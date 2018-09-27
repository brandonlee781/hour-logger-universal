import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'bl-side-nav-btn',
  templateUrl: './side-nav-btn.component.html',
  styleUrls: ['./side-nav-btn.component.scss'],
})
export class SideNavBtnComponent implements OnInit {
  @Input() icon?: string;
  @Input() label?: string;
  @Input() link?: string;
  @Input() position?: string;

  constructor() {}

  ngOnInit() {}
}
