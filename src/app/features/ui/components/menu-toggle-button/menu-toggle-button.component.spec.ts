import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuToggleButtonComponent } from './menu-toggle-button.component';

describe('MenuToggleButtonComponent', () => {
  let component: MenuToggleButtonComponent;
  let fixture: ComponentFixture<MenuToggleButtonComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [MenuToggleButtonComponent],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuToggleButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
