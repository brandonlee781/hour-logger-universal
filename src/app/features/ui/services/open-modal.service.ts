import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenModalService {
  private isOpen = false;
  private open: Subject<boolean> = new BehaviorSubject<boolean>(this.isOpen);
  open$ = this.open.asObservable();

  toggleOpen(status?: 'open' | 'closed') {
    if (status) {
      this.isOpen = status === 'open' ? true : false;
    } else {
      this.isOpen = !this.isOpen;
    }
    this.open.next(this.isOpen);
  }

  constructor() { }
}
