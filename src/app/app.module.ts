import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from '@core/app-routing.module';
import { MaterialModule } from '@core/material.module';
import { UIModule } from '@features/ui/ui.module';
import { NavDrawerService } from '@shared/services/nav-drawer.service';
import { UserService } from '@shared/services/user.service';

import { AppComponent } from './app.component';
import { LoginComponent } from './features/login/login.component';
import { GraphQLModule } from '@core/graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { TransferHttpCacheModule } from '@nguniversal/common';

@NgModule({
  declarations: [AppComponent, LoginComponent],
  imports: [
    AppRoutingModule,
    BrowserModule.withServerTransition({
      appId: 'hour-logger',
    }),
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    UIModule,
    GraphQLModule,
    HttpClientModule,
    TransferHttpCacheModule,
  ],
  bootstrap: [AppComponent],
  exports: [UIModule, AppRoutingModule],
  providers: [UserService, NavDrawerService],
})
export class AppModule {}
