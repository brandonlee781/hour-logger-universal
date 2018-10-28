import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideNavAddBtnComponent } from './side-nav-add-btn.component';

describe('SideNavComponent', () => {
  let component: SideNavAddBtnComponent;
  let fixture: ComponentFixture<SideNavAddBtnComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [SideNavAddBtnComponent],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SideNavAddBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
