import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfiniteScrollLoadingSnackbarComponent } from './infinite-scroll-loading-snackbar.component';

describe('InfiniteScrollLoadingSnackbarComponent', () => {
  let component: InfiniteScrollLoadingSnackbarComponent;
  let fixture: ComponentFixture<InfiniteScrollLoadingSnackbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfiniteScrollLoadingSnackbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfiniteScrollLoadingSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
