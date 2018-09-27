import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavDrawerLinkComponent } from './nav-drawer-link.component';

describe('NavDrawerLinkComponent', () => {
  let component: NavDrawerLinkComponent;
  let fixture: ComponentFixture<NavDrawerLinkComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [NavDrawerLinkComponent],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NavDrawerLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
