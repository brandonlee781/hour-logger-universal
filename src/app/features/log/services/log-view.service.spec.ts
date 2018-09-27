import { inject, TestBed } from '@angular/core/testing';

import { LogViewService } from './log-view.service';

describe('LogViewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LogViewService],
    });
  });

  it(
    'should be created',
    inject([LogViewService], (service: LogViewService) => {
      expect(service).toBeTruthy();
    }),
  );
});
