import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLogDialogComponent } from './new-log-dialog.component';

describe('NewLogDialogComponent', () => {
  let component: NewLogDialogComponent;
  let fixture: ComponentFixture<NewLogDialogComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [NewLogDialogComponent],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLogDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
