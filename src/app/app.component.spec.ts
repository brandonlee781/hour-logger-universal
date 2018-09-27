import { APP_BASE_HREF } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppRoutingModule } from '@core/app-routing.module';
import { GraphQLModule } from '@core/graphql.module';
import { MaterialModule } from '@core/material.module';
import { LogModule } from '@features/log/log.module';
import { UIModule } from '@features/ui/ui.module';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [AppComponent],
        imports: [
          LogModule,
          UIModule,

          AppRoutingModule,
          GraphQLModule,
          MaterialModule,
        ],
        providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(AppComponent);
          app = fixture.debugElement.componentInstance;
        });
    }),
  );
  it(
    'should create the app',
    async(() => {
      expect(app).toBeTruthy();
    }),
  );
});
