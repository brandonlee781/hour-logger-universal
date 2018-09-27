import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { addSeconds } from 'date-fns';
import { UserService } from '@shared/services/user.service';
import { AuthResponse } from '@shared/types';

import { environment } from '@environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'bl-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  isBrowser: boolean;

  constructor(
    private readonly router: Router,
    private readonly http: HttpClient,
    private readonly userService: UserService,
    @Inject(PLATFORM_ID) private platformId
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {}

  async submitLogin() {
    const { email, password } = this;
    const url = environment.apiUrl + '/auth/token';
    const body = { email, password };

    this.http.post(url, body)
      .subscribe((response: AuthResponse) => {

        if (this.isBrowser) {
          const storage = window.localStorage;
          storage.setItem(
            'token',
            JSON.stringify({
              token: response.token,
              expires: response.expires,
            }),
          );
        }

        this.userService.getUser();
        this.router.navigate(['/']);
      });
  }
}
