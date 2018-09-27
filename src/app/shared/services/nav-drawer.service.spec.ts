import { inject, TestBed } from '@angular/core/testing';

import { NavDrawerService } from './nav-drawer.service';

describe('NavDrawerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NavDrawerService],
    });
  });

  it(
    'should be created',
    inject([NavDrawerService], (service: NavDrawerService) => {
      expect(service).toBeTruthy();
    }),
  );
});
