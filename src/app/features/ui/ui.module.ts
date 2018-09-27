import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@core/material.module';

import { MenuToggleButtonComponent } from './components/menu-toggle-button/menu-toggle-button.component';
import { NavDrawerItemComponent } from './components/nav-drawer-item/nav-drawer-item.component';
import { NavDrawerLinkComponent } from './components/nav-drawer-link/nav-drawer-link.component';
import { NavDrawerComponent } from './components/nav-drawer/nav-drawer.component';
import { ProfileDialogComponent } from './components/profile-dialog/profile-dialog.component';
import { SideNavBtnComponent } from './components/side-nav-btn/side-nav-btn.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { InfiniteScrollLoadingSnackbarComponent } from './components/infinite-scroll-loading-snackbar/infinite-scroll-loading-snackbar.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    InfiniteScrollModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    SideNavComponent,
    SideNavBtnComponent,
    MenuToggleButtonComponent,
    NavDrawerComponent,
    NavDrawerItemComponent,
    NavDrawerLinkComponent,
    ProfileDialogComponent,
    InfiniteScrollLoadingSnackbarComponent,
  ],
  exports: [
    SideNavComponent,
    SideNavBtnComponent,
    MenuToggleButtonComponent,
    NavDrawerComponent,
    NavDrawerItemComponent,
    NavDrawerLinkComponent,
  ],
  entryComponents: [ProfileDialogComponent],
})
export class UIModule {}
