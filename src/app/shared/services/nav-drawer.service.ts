import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class NavDrawerService {
  public isNavDrawerOpen = new Subject<boolean>();

  isNavDrawerOpen$ = this.isNavDrawerOpen.asObservable();

  constructor() {}

  setValue(val: boolean) {
    this.isNavDrawerOpen.next(val);
  }
}
