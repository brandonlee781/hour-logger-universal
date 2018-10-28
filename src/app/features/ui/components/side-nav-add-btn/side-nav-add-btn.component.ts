import { Component, OnInit } from '@angular/core';
import { OpenModalService } from '@features/ui/services/open-modal.service';

@Component({
  selector: 'bl-side-nav-add-btn',
  templateUrl: './side-nav-add-btn.component.html',
  styleUrls: ['./side-nav-add-btn.component.scss'],
})
export class SideNavAddBtnComponent implements OnInit {
  private isModalOpen: boolean;

  constructor(
    private openModalService: OpenModalService
  ) { }

  ngOnInit() {
    this.openModalService.open$.subscribe(open => {
      this.isModalOpen = open;
    });
  }

  onOpenModal() {
    if (!this.isModalOpen) {
      this.openModalService.toggleOpen();
    }
  }

}
