import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class LogViewService {
  private currentView = 'list';
  private view: Subject<string> = new BehaviorSubject<string>(this.currentView);
  view$ = this.view.asObservable();

  toggleView() {
    if (this.currentView === 'list') {
      this.currentView = 'calendar';
    } else if (this.currentView === 'calendar') {
      this.currentView = 'list';
    }
    this.view.next(this.currentView);
  }

  constructor() {}
}
