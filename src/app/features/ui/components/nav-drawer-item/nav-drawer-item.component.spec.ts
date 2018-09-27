import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavDrawerItemComponent } from './nav-drawer-item.component';

describe('NavDrawerItemComponent', () => {
  let component: NavDrawerItemComponent;
  let fixture: ComponentFixture<NavDrawerItemComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [NavDrawerItemComponent],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NavDrawerItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
